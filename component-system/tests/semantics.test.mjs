import assert from 'node:assert/strict';
import test from 'node:test';
import { humanLabel, lifecycleGuidance, resolveSemanticIntent, semanticDiff } from '../../tools/component-factory-mcp/semantics.mjs';

test('semantic intent distinguishes requested capabilities from explicit prohibitions', () => {
  const intent = resolveSemanticIntent({ request: 'Add portrait images, pagination, and internal links. No audio playback, embeds, scripts, iframes, or schema changes.' });
  assert.deepEqual(intent.requested_capabilities.sort(), ['internal_links', 'pagination', 'portrait_images']);
  assert.deepEqual(intent.explicitly_forbidden.sort(), ['audio_playback', 'schema_changes', 'scripts']);
});

test('semantic intent resolves natural design language to governed presentation choices', () => {
  const intent = resolveSemanticIntent({
    request: 'Make this darker with more breathing room and keep faces visible.',
  });
  assert.deepEqual(intent.presentation, {
    surface: 'ink',
    spacing: 'generous',
    image_focus: 'top',
  });
});

test('semantic diffs report only changed fields', () => {
  assert.deepEqual(semanticDiff({ page_size: 5, publish: false }, { page_size: 8, publish: false }), [
    { field: 'page_size', from: 5, to: 8 },
  ]);
});

test('lifecycle guidance and labels are client-readable', () => {
  const proposal = { component_key: 'block_listing_archive_portraits', lifecycle: { publish: false, deploy: false } };
  assert.equal(humanLabel(proposal), 'Listing Archive Portraits');
  assert.ok(lifecycleGuidance(proposal).next_allowed_actions.includes('scaffold_component'));
  assert.ok(lifecycleGuidance(proposal).blocking_actions.some(({ action }) => action === 'deploy'));
});
