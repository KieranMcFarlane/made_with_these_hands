import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

test('proposal context, decisions, dry-run diffs, and idempotency are exposed through MCP', async () => {
  const root = process.cwd();
  const proposalId = `semantic-${crypto.randomUUID()}`;
  const directory = path.join(root, 'component-system', 'proposals', proposalId);
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, 'proposal.json'), `${JSON.stringify({
    id: proposalId,
    component_key: 'block_listing_archive_portraits',
    status: 'testing',
    lifecycle: { content_status: 'draft', publish: false, deploy: false },
    proposal: { label: 'Episode archive with portraits' },
  }, null, 2)}\n`);

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(root, 'tools/component-factory-mcp/index.mjs')],
    cwd: root,
    env: { COMPONENT_FACTORY_SITE_URL: 'http://localhost:3000' },
    stderr: 'pipe',
  });
  const client = new Client({ name: 'semantic-tools-test', version: '1.0.0' });

  try {
    await client.connect(transport);
    const dryRun = await client.callTool({ name: 'preview_semantic_change', arguments: {
      proposal_id: proposalId,
      before: { page_size: 5 },
      after: { page_size: 8 },
    } });
    assert.deepEqual(JSON.parse(dryRun.content[0].text).semantic_diff, [{ field: 'page_size', from: 5, to: 8 }]);

    const decision = {
      proposal_id: proposalId,
      type: 'presentation',
      summary: 'Use five episodes per page.',
      value: { page_size: 5 },
      source: 'owner',
      idempotency_key: 'pagination-decision',
    };
    const first = await client.callTool({ name: 'record_proposal_decision', arguments: decision });
    const replay = await client.callTool({ name: 'record_proposal_decision', arguments: decision });
    assert.equal(JSON.parse(first.content[0].text).idempotent_replay, undefined);
    assert.equal(JSON.parse(replay.content[0].text).idempotent_replay, true);

    const context = await client.callTool({ name: 'get_proposal_context', arguments: { proposal_id: proposalId } });
    const resolved = JSON.parse(context.content[0].text);
    assert.equal(resolved.proposal.label, 'Episode archive with portraits');
    assert.equal(resolved.decisions.length, 1);
    assert.ok(resolved.proposal.next_allowed_actions.includes('start_component_validation'));
    assert.ok(resolved.proposal.blocking_actions.some(({ action }) => action === 'deploy'));
  } finally {
    await client.close().catch(() => {});
    await fs.rm(directory, { recursive: true, force: true });
  }
});
