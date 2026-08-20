import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const registry = JSON.parse(fs.readFileSync('registry.json', 'utf8'));

const STORY_FILES = new Set([
  'stories/BrandBookInventory.stories.jsx',
  'stories/DirectusBlocks.stories.jsx',
  'stories/PodcastPlayerBlock.stories.jsx',
  'stories/SlideshowBlock.stories.jsx',
]);

const STORYBOOK_RECOMMENDED = {
  'mwth-brand-book': 'stories/BrandBookInventory.stories.jsx',
  'mwth-podcast-player': 'stories/PodcastPlayerBlock.stories.jsx',
  'mwth-slideshow-block': 'stories/SlideshowBlock.stories.jsx',
};

test('storybook recommended registry items have matching stories', () => {
  const items = new Map(registry.items.map((item) => [item.name, item]));

  for (const [itemName, storyPath] of Object.entries(STORYBOOK_RECOMMENDED)) {
    const item = items.get(itemName);
    assert.ok(item, `Missing registry item: ${itemName}`);
    assert.equal(item.meta?.storybookRecommended, true, `${itemName} should be marked storybookRecommended`);
    assert.ok(STORY_FILES.has(storyPath), `Missing story map entry for ${itemName}`);
    assert.ok(fs.existsSync(storyPath), `Missing story file for ${itemName}: ${storyPath}`);
  }
});

test('storybook kit registry item distributes all story files and config', () => {
  const kit = registry.items.find((item) => item.name === 'mwth-storybook-kit');
  assert.ok(kit, 'Missing mwth-storybook-kit registry item');
  assert.equal(kit.type, 'registry:item');

  const files = new Set(kit.files.map((file) => file.path));
  for (const storyPath of STORY_FILES) {
    assert.ok(files.has(storyPath), `Storybook kit should include ${storyPath}`);
  }

  for (const required of ['.storybook/main.mjs', '.storybook/preview.jsx', '.storybook/next-image.jsx']) {
    assert.ok(files.has(required), `Storybook kit should include ${required}`);
  }

  for (const file of kit.files) {
    assert.ok(path.isAbsolute(file.target) || file.target.startsWith('~/'), `${file.path} should use an install target`);
    assert.ok(fs.existsSync(file.path), `Registry file does not exist: ${file.path}`);
  }
});
