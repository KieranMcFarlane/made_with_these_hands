#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

function parseEnvironment(source) {
  const values = {};
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value.replaceAll('\\"', '"').replaceAll('\\\\', '\\');
  }
  return values;
}

async function readEnvironment(file) {
  try {
    return parseEnvironment(await fs.readFile(file, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return {};
    throw error;
  }
}

function toolText(result) {
  return (result.content || [])
    .filter(({ type }) => type === 'text')
    .map(({ text }) => text)
    .join('\n');
}

async function inspectServer({ name, url, token, expectedTools = [], verify }) {
  if (!token) throw new Error(`${name} token is not configured.`);
  const transport = new StreamableHTTPClientTransport(new URL(url), {
    requestInit: { headers: { Authorization: `Bearer ${token}` } },
  });
  const client = new Client({ name: 'mwth-client-handover-check', version: '1.0.0' });
  await client.connect(transport);
  try {
    const result = await client.listTools();
    const toolNames = result.tools.map(({ name: toolName }) => toolName);
    for (const expected of expectedTools) {
      if (!toolNames.includes(expected)) throw new Error(`${name} is missing expected tool ${expected}.`);
    }
    const proof = verify ? await verify(client) : undefined;
    return { name, url, tool_count: toolNames.length, expected_tools_present: true, ...proof };
  } finally {
    await client.close();
  }
}

const root = process.cwd();
const projectEnvironment = await readEnvironment(path.join(root, '.env.local'));
const clientEnvironment = await readEnvironment(path.join(root, 'deploy/component-factory/.env.client-access'));
const environment = { ...projectEnvironment, ...clientEnvironment, ...process.env };

const results = [];
results.push(await inspectServer({
  name: 'Directus MCP',
  url: environment.DIRECTUS_MCP_URL || 'https://cms.nakanodigital.com/mcp',
  token: environment.DIRECTUS_MCP_TOKEN,
  expectedTools: ['system-prompt', 'items', 'schema'],
  verify: async (client) => {
    const result = await client.callTool({
      name: 'items',
      arguments: {
        action: 'read',
        collection: 'site_pages',
        query: {
          fields: ['id', 'path', 'status', 'tenant'],
          filter: { path: { _eq: '/owner-acceptance' } },
          limit: 1,
        },
      },
    });
    if (result.isError) throw new Error('Directus MCP tenant proof read failed.');
    const content = toolText(result);
    if (!content.includes('/owner-acceptance') || !content.includes('made-with-these-hands')) {
      throw new Error('Directus MCP did not return the expected tenant-scoped acceptance page.');
    }
    const deniedDelete = await client.callTool({
      name: 'items',
      arguments: {
        action: 'delete',
        collection: 'posts',
        keys: [2147483647],
      },
    });
    if (!deniedDelete.isError) throw new Error('Directus MCP unexpectedly accepted a delete operation.');
    return { tenant_read_proven: true, acceptance_page_found: true, delete_denied: true };
  },
}));
results.push(await inspectServer({
  name: 'Component Factory MCP',
  url: environment.COMPONENT_FACTORY_MCP_URL || 'https://factory.nakanodigital.com/mcp',
  token: environment.CLIENT_COMPONENT_FACTORY_TOKEN,
  expectedTools: ['get_workflow_context', 'list_components', 'start_component_proposal'],
}));

console.log(JSON.stringify({
  ok: true,
  client_id: environment.DIRECTUS_TENANT_VALUE || 'made-with-these-hands',
  servers: results,
  secrets_printed: false,
}, null, 2));
