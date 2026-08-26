import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

test('component factory exposes the governed portable MCP contract', async () => {
  const root = process.cwd();
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(root, 'tools/component-factory-mcp/index.mjs')],
    cwd: root,
    env: {
      COMPONENT_FACTORY_SITE_URL: 'http://localhost:3000',
    },
    stderr: 'pipe',
  });
  const client = new Client({ name: 'component-factory-test', version: '1.0.0' });

  try {
    await client.connect(transport);
    const tools = await client.listTools();
    const names = tools.tools.map(({ name }) => name);
    for (const required of [
      'get_workflow_context',
      'read_brand_contract',
      'list_components',
      'get_guardrail_policy',
      'check_component_guardrails',
      'start_component_proposal',
      'scaffold_component',
      'validate_component',
      'create_preview',
      'prepare_component_release',
      'prepare_tenant_release',
      'publish_approved_component',
    ]) {
      assert.ok(names.includes(required), `${required} should be exposed`);
    }

    const resources = await client.listResources();
    assert.ok(resources.resources.some(({ uri }) => uri === 'component-factory://workflow'));

    const result = await client.callTool({ name: 'get_workflow_context', arguments: {} });
    const workflow = JSON.parse(result.content[0].text);
    assert.ok(workflow.policy.some((rule) => rule.includes('shadcn')));
    assert.ok(workflow.policy.some((rule) => rule.includes('permissionless')));
    assert.ok(workflow.policy.some((rule) => rule.includes('human-approved')));
    assert.ok(workflow.policy.some((rule) => rule.includes('semantic tokens')));
    assert.ok(workflow.policy.some((rule) => rule.includes('Storybook')));

    const guardrail = await client.callTool({
      name: 'check_component_guardrails',
      arguments: {
        request: 'Create a podcast player using Media Chrome for audio playback.',
        component_key: 'block_podcast_player',
        slots: ['main'],
        fields: [
          { name: 'audio_url', type: 'string' },
          { name: 'transcript', type: 'text' },
        ],
        trusted_packages: ['media-chrome'],
      },
    });
    const classified = JSON.parse(guardrail.content[0].text);
    assert.equal(classified.mode, 'tenant');
    assert.equal(classified.allowed, true);

    const rawSpacing = await client.callTool({
      name: 'check_component_guardrails',
      arguments: {
        request: 'Add a text block with custom spacing.',
        component_key: 'block_text',
        slots: ['main'],
        fields: [{ name: 'padding', type: 'string' }],
      },
    });
    const rejected = JSON.parse(rawSpacing.content[0].text);
    assert.equal(rejected.allowed, false);
    assert.equal(rejected.mode, 'platform');
  } finally {
    await client.close();
  }
});
