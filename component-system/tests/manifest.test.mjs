import assert from 'node:assert/strict';
import test from 'node:test';
import {
  APPROVED_COMPONENT_COLLECTIONS,
  COMPONENTS,
  componentByCollection,
} from '../components.mjs';

test('approved collections are unique and resolvable', () => {
  assert.equal(new Set(APPROVED_COMPONENT_COLLECTIONS).size, APPROVED_COMPONENT_COLLECTIONS.length);
  for (const collection of APPROVED_COMPONENT_COLLECTIONS) {
    assert.equal(componentByCollection(collection)?.status, 'approved');
  }
});

test('slideshow contract enforces safe variants, slots, and limits', () => {
  const slideshow = componentByCollection('block_slideshow');
  assert.deepEqual(slideshow.variants, ['editorial', 'full-width', 'thumbnail-rail']);
  assert.deepEqual(slideshow.slots, ['main', 'before-content', 'after-content']);
  assert.equal(slideshow.limits.slides, 12);
  assert.equal(slideshow.limits.minimumIntervalMs, 4000);
  assert.deepEqual(slideshow.primitives, ['shadcn:carousel', 'shadcn:button']);
  assert.ok(slideshow.accessibility.some((rule) => rule.includes('reduced motion')));
});

test('podcast player contract uses trusted open source without CMS executable content', () => {
  const player = componentByCollection('block_podcast_player');
  assert.deepEqual(player.variants, ['feature', 'compact', 'sticky-bar']);
  assert.ok(player.primitives.includes('shadcn:button'));
  assert.equal(player.trustedOpenSource[0].package, 'media-chrome');
  assert.equal(player.trustedOpenSource[0].license, 'MIT');
  assert.equal(player.limits.autoplay, false);
  assert.equal(player.limits.cmsExecutableContent, false);
  assert.ok(player.fields.includes('audio_url'));
  assert.ok(player.fields.includes('transcript'));
});

test('CMS contracts never include executable source', () => {
  const serialized = JSON.stringify(COMPONENTS);
  assert.equal(serialized.includes('<script'), false);
  assert.equal(serialized.includes('javascript:'), false);
  assert.equal(serialized.includes('componentPath'), false);
});
