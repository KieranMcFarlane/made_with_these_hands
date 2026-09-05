#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const gatewayUrl = process.env.NAKANO_MCP_URL || 'https://mcp.nakanodigital.com/mcp';
const accessToken = process.env.NAKANO_OAUTH_ACCESS_TOKEN;

const resourceMetadataUrl = new URL('/.well-known/oauth-protected-resource/mcp', gatewayUrl);
const metadataResponse = await fetch(resourceMetadataUrl);
if (!metadataResponse.ok) throw new Error(`Nakano protected-resource discovery returned ${metadataResponse.status}.`);
const metadata = await metadataResponse.json();

if (metadata.resource !== gatewayUrl) throw new Error('Nakano resource metadata does not identify the canonical gateway.');
if (!metadata.authorization_servers?.includes('https://id.nakanodigital.com')) {
  throw new Error('Nakano resource metadata does not identify the canonical OAuth issuer.');
}

const summary = {
  ok: true,
  gateway: gatewayUrl,
  oauth_issuer: 'https://id.nakanodigital.com',
  discovery_proven: true,
  live_grant_proven: false,
  secrets_printed: false,
};

if (!accessToken) {
  console.log(JSON.stringify({
    ...summary,
    next_action: 'Authenticate the optional nakano MCP connection in Codex to complete the live tenant check.',
  }, null, 2));
  process.exit(0);
}

const client = new Client({ name: 'mwth-client-oauth-acceptance', version: '1.0.0' });
const transport = new StreamableHTTPClientTransport(new URL(gatewayUrl), {
  requestInit: { headers: { Authorization: `Bearer ${accessToken}` } },
});

await client.connect(transport);
try {
  const { tools } = await client.listTools();
  const names = tools.map(({ name }) => name);
  for (const required of ['cms_items', 'cms_archive_items', 'cms_restore_items', 'factory_get_workflow_context', 'factory_list_components']) {
    if (!names.includes(required)) throw new Error(`Nakano gateway is missing ${required}.`);
  }
  if (names.some((name) => /(delete|schema|secret|role)/i.test(name))) {
    throw new Error('Nakano gateway advertised a prohibited customer operation.');
  }
  const factoryProof = await client.callTool({ name: 'factory_get_workflow_context', arguments: {} });
  if (factoryProof.isError) throw new Error('Factory workflow context failed through the Nakano gateway.');
  console.log(JSON.stringify({
    ...summary,
    live_grant_proven: true,
    tool_count: names.length,
    cms_available: true,
    cms_archive_restore_available: true,
    factory_available: true,
    prohibited_tools_hidden: true,
  }, null, 2));
} finally {
  await client.close();
}
