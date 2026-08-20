import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import test from 'node:test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

test('component publication cannot advance before approval and only publishes the allowed transition', async () => {
  const root = process.cwd();
  const proposalId = `publish-gate-${crypto.randomUUID()}`;
  const proposalDirectory = path.join(root, 'component-system', 'proposals', proposalId);
  const proposalPath = path.join(proposalDirectory, 'proposal.json');
  const patchBodies = [];
  let directusProposal = {
    id: 999,
    component_key: 'block_slideshow',
    status: 'awaiting_approval',
    approval: null,
  };

  await fs.mkdir(proposalDirectory, { recursive: true });
  await fs.writeFile(proposalPath, `${JSON.stringify({
    id: proposalId,
    directus_id: 999,
    component_key: 'block_slideshow',
    status: 'awaiting_approval',
    validation_summary: { ok: true },
  }, null, 2)}\n`);

  const server = http.createServer(async (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    if (request.method === 'GET' && request.url === '/items/component_proposals/999?fields=*') {
      response.end(JSON.stringify({ data: directusProposal }));
      return;
    }
    if (request.method === 'PATCH' && request.url === '/items/component_proposals/999') {
      let body = '';
      for await (const chunk of request) body += chunk;
      const parsed = JSON.parse(body);
      patchBodies.push(parsed);
      directusProposal = { ...directusProposal, ...parsed };
      response.end(JSON.stringify({ data: directusProposal }));
      return;
    }
    response.statusCode = 404;
    response.end(JSON.stringify({ errors: [{ message: 'Not found' }] }));
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(root, 'tools/component-factory-mcp/index.mjs')],
    cwd: root,
    env: {
      DIRECTUS_URL: `http://127.0.0.1:${address.port}`,
      DIRECTUS_COMPONENT_FACTORY_TOKEN: 'test-token',
      COMPONENT_FACTORY_SITE_URL: 'http://localhost:3000',
    },
    stderr: 'pipe',
  });
  const client = new Client({ name: 'component-factory-publish-test', version: '1.0.0' });

  try {
    await client.connect(transport);
    const blocked = await client.callTool({
      name: 'publish_approved_component',
      arguments: { proposal_id: proposalId },
    });
    assert.equal(blocked.isError, true);
    assert.match(blocked.content[0].text, /not human-approved/i);
    assert.deepEqual(patchBodies, []);
    assert.equal(JSON.parse(await fs.readFile(proposalPath, 'utf8')).status, 'awaiting_approval');

    directusProposal = {
      ...directusProposal,
      status: 'approved',
      approval: {
        approved: true,
        approved_by: 'Human reviewer',
        approved_at: new Date().toISOString(),
      },
    };
    const published = await client.callTool({
      name: 'publish_approved_component',
      arguments: { proposal_id: proposalId },
    });
    assert.equal(published.isError, undefined);
    assert.deepEqual(patchBodies, [{ status: 'published' }]);

    const result = JSON.parse(published.content[0].text);
    assert.equal(result.status, 'published');
    assert.equal(result.component, 'block_slideshow');

    const local = JSON.parse(await fs.readFile(proposalPath, 'utf8'));
    assert.equal(local.status, 'published');
    assert.match(local.published_at, /^\d{4}-\d{2}-\d{2}T/);
  } finally {
    await client.close().catch(() => {});
    await new Promise((resolve) => server.close(resolve));
    await fs.rm(proposalDirectory, { recursive: true, force: true });
  }
});

test('tenant release advances without human approval when guardrails pass', async () => {
  const root = process.cwd();
  const proposalId = `tenant-release-${crypto.randomUUID()}`;
  const proposalDirectory = path.join(root, 'component-system', 'proposals', proposalId);
  const proposalPath = path.join(proposalDirectory, 'proposal.json');

  await fs.mkdir(proposalDirectory, { recursive: true });
  await fs.writeFile(proposalPath, `${JSON.stringify({
    id: proposalId,
    component_key: 'block_podcast_player',
    status: 'awaiting_approval',
    validation_summary: { ok: true },
    guardrail: {
      mode: 'tenant',
      allowed: true,
      checks: [
        { ok: true, scope: 'open_source', reason: 'Trusted package allowlist matched: media-chrome' },
      ],
    },
  }, null, 2)}\n`);

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(root, 'tools/component-factory-mcp/index.mjs')],
    cwd: root,
    env: {
      COMPONENT_FACTORY_SITE_URL: 'http://localhost:3000',
    },
    stderr: 'pipe',
  });
  const client = new Client({ name: 'component-factory-tenant-release-test', version: '1.0.0' });

  try {
    await client.connect(transport);
    const released = await client.callTool({
      name: 'prepare_tenant_release',
      arguments: { proposal_id: proposalId },
    });
    assert.equal(released.isError, undefined);

    const result = JSON.parse(released.content[0].text);
    assert.equal(result.status, 'ready_for_tenant_install');
    assert.equal(result.approval, 'not_required_inside_guardrails');

    const local = JSON.parse(await fs.readFile(proposalPath, 'utf8'));
    assert.equal(local.status, 'ready_for_tenant_install');
    assert.equal(local.tenant_release.status, 'ready_for_tenant_install');
  } finally {
    await client.close().catch(() => {});
    await fs.rm(proposalDirectory, { recursive: true, force: true });
  }
});
