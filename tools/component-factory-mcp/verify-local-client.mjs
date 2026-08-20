#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const rootDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);
const accessPath = path.join(rootDirectory, 'deploy/component-factory/.env.client-access');

function parseEnvironment(source) {
  const values = {};
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)="(.*)"\s*$/);
    if (match) values[match[1]] = match[2].replaceAll('\\"', '"').replaceAll('\\\\', '\\');
  }
  return values;
}

const access = parseEnvironment(await fs.readFile(accessPath, 'utf8'));
const endpoint = new URL(access.COMPONENT_FACTORY_MCP_URL);
const token = access.CLIENT_COMPONENT_FACTORY_TOKEN;
if (!token) throw new Error('The local client access file does not contain a bearer token.');

const transport = new StreamableHTTPClientTransport(endpoint, {
  requestInit: {
    headers: { Authorization: `Bearer ${token}` },
  },
});
const client = new Client({ name: 'component-factory-deployment-check', version: '1.0.0' });

await client.connect(transport);
try {
  const tools = await client.listTools();
  const workflowResult = await client.callTool({
    name: 'get_workflow_context',
    arguments: {},
  });
  const brandResult = await client.callTool({
    name: 'read_brand_contract',
    arguments: {},
  });
  const workflow = JSON.parse(workflowResult.content[0].text);

  console.log(JSON.stringify({
    ok: true,
    endpoint: endpoint.toString(),
    tool_count: tools.tools.length,
    client_id: workflow.deployment.client_id,
    isolation: workflow.deployment.isolation,
    brand_contract_readable: !brandResult.isError,
    secrets_printed: false,
  }, null, 2));
} finally {
  await client.close();
}
