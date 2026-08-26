#!/usr/bin/env node

import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const mcpUrl = process.env.DIRECTUS_MCP_URL || 'https://cms.nakanodigital.com/mcp';
const token = process.env.DIRECTUS_MCP_TOKEN;
const pagePath = '/owner-acceptance';

assert.ok(token, 'DIRECTUS_MCP_TOKEN is required.');

function resultData(result) {
  if (result.isError) throw new Error(result.content?.[0]?.text || 'Directus MCP operation failed.');
  const text = (result.content || []).filter(({ type }) => type === 'text').map(({ text: value }) => value).join('');
  const parsed = JSON.parse(text);
  return parsed.raw || parsed;
}

const transport = new StreamableHTTPClientTransport(new URL(mcpUrl), {
  requestInit: { headers: { Authorization: `Bearer ${token}` } },
});
const client = new Client({ name: 'mwth-owner-acceptance', version: '1.0.0' });
await client.connect(transport);

try {
  const [page] = resultData(await client.callTool({
    name: 'items',
    arguments: {
      action: 'read',
      collection: 'site_pages',
      query: {
        fields: ['id', 'tenant', 'path', 'status'],
        filter: { path: { _eq: pagePath } },
        limit: 1,
      },
    },
  }));
  assert.ok(page, `${pagePath} was not found.`);
  assert.equal(page.tenant, 'made-with-these-hands');
  assert.equal(page.status, 'draft', 'Owner acceptance page must remain draft.');

  const junctions = resultData(await client.callTool({
    name: 'items',
    arguments: {
      action: 'read',
      collection: 'site_pages_blocks',
      query: {
        fields: ['id', 'site_pages_id', 'collection', 'item', 'sort', 'slot'],
        filter: { site_pages_id: { _eq: page.id } },
        sort: ['sort'],
        limit: 10,
      },
    },
  }));
  assert.equal(junctions.length, 3, 'Acceptance page must contain exactly three blocks.');
  assert.ok(junctions.every(({ collection }) => collection === 'site_sections'));

  const sections = resultData(await client.callTool({
    name: 'items',
    arguments: {
      action: 'read',
      collection: 'site_sections',
      query: {
        fields: ['id', 'tenant', 'status', 'component_key', 'data'],
        filter: { id: { _in: junctions.map(({ item }) => Number(item)) } },
        limit: 10,
      },
    },
  }));
  const sectionById = new Map(sections.map((section) => [String(section.id), section]));
  const junctionByComponent = new Map(junctions.map((junction) => [
    sectionById.get(String(junction.item))?.component_key,
    junction,
  ]));
  for (const key of ['block_hero', 'block_text', 'block_cta']) {
    assert.ok(junctionByComponent.has(key), `Acceptance page is missing ${key}.`);
  }

  const textJunction = junctionByComponent.get('block_text');
  const textSection = sectionById.get(String(textJunction.item));
  resultData(await client.callTool({
    name: 'items',
    arguments: {
      action: 'update',
      collection: 'site_sections',
      keys: [textSection.id],
      data: {
        data: {
          ...textSection.data,
          dek: 'This draft was reviewed through the owner-scoped Codex MCP workflow.',
          body: ['The content edit and component order were changed without publishing the page or adding executable CMS content.'],
        },
      },
    },
  }));

  const desiredOrder = ['block_hero', 'block_text', 'block_cta'];
  for (const [index, key] of desiredOrder.entries()) {
    const junction = junctionByComponent.get(key);
    resultData(await client.callTool({
      name: 'items',
      arguments: {
        action: 'update',
        collection: 'site_pages_blocks',
        keys: [junction.id],
        data: { sort: index + 1, slot: 'main' },
      },
    }));
  }

  const finalJunctions = resultData(await client.callTool({
    name: 'items',
    arguments: {
      action: 'read',
      collection: 'site_pages_blocks',
      query: {
        fields: ['id', 'collection', 'item', 'sort', 'slot'],
        filter: { site_pages_id: { _eq: page.id } },
        sort: ['sort'],
        limit: 10,
      },
    },
  }));
  const finalOrder = finalJunctions.map(({ item }) => sectionById.get(String(item))?.component_key);
  assert.deepEqual(finalOrder, desiredOrder);

  const [finalPage] = resultData(await client.callTool({
    name: 'items',
    arguments: {
      action: 'read',
      collection: 'site_pages',
      query: { fields: ['id', 'path', 'status'], filter: { id: { _eq: page.id } }, limit: 1 },
    },
  }));
  assert.equal(finalPage.status, 'draft');

  console.log(JSON.stringify({
    ok: true,
    transport: 'remote-directus-mcp',
    page: finalPage,
    finalOrder,
    contentEdited: true,
    published: false,
    executableCmsContentAdded: false,
  }, null, 2));
} finally {
  await client.close();
}
