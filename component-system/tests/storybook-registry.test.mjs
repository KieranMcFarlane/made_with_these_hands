import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { APPROVED_COMPONENTS } from '../components.mjs';
import {
  COMPONENT_INVENTORY_COUNT,
  COMPONENT_INVENTORY_GROUPS,
  componentInstanceHref,
} from '../../app/component-inventory.js';

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

test('every approved Directus block is represented in Storybook data', () => {
  const storySources = [
    fs.readFileSync('stories/DirectusBlocks.stories.jsx', 'utf8'),
    fs.readFileSync('stories/mwth-story-data.js', 'utf8'),
  ].join('\n');

  for (const component of APPROVED_COMPONENTS) {
    assert.match(
      storySources,
      new RegExp(`['\"]${component.collection}['\"]`),
      `Storybook should represent ${component.collection}`,
    );
  }
});

test('Storybook proves every approved spacing density', () => {
  const story = fs.readFileSync('stories/DirectusBlocks.stories.jsx', 'utf8');
  assert.match(story, /Composition \/ spacing densities/);
  for (const spacing of ['compact', 'standard', 'generous']) {
    assert.ok(story.includes(`'${spacing}'`), `Missing ${spacing} spacing proof state`);
  }
});

test('every component inventory entry links to a concrete proof instance', () => {
  const entries = COMPONENT_INVENTORY_GROUPS.flatMap((group) => group.components);
  assert.equal(entries.length, COMPONENT_INVENTORY_COUNT);
  assert.equal(COMPONENT_INVENTORY_COUNT, 39);

  for (const component of entries) {
    assert.ok(component.instances?.length, `${component.name} should link to at least one proof instance`);
    for (const instance of component.instances) {
      assert.ok(['site', 'storybook'].includes(instance.surface), `${component.name} has an unknown proof surface`);
      assert.match(instance.href, /^(\/|\?path=\/story\/)/, `${component.name} has an invalid proof link`);
    }
  }
});

test('component proof links resolve for local and deployed Storybook', () => {
  const storyInstance = { href: '?path=/story/mwth-directus-blocks--hero', surface: 'storybook' };
  const siteInstance = { href: '/objects', surface: 'site' };

  assert.equal(componentInstanceHref(storyInstance, '/iframe.html'), '/?path=/story/mwth-directus-blocks--hero');
  assert.equal(
    componentInstanceHref(storyInstance, '/storybook/iframe.html'),
    '/storybook/index.html?path=/story/mwth-directus-blocks--hero',
  );
  assert.equal(componentInstanceHref(siteInstance, '/storybook/iframe.html'), '/objects');
});
