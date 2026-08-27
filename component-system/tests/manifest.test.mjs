import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import {
  APPROVED_COMPONENT_COLLECTIONS,
  COMPONENTS,
  componentByCollection,
} from '../components.mjs';
import { materializeGenericPageBlock } from '../generic-page-block.mjs';
import { brandFromRecords } from '../../lib/brand-settings.mjs';

test('brand contract fixes the 4px scale and semantic composition vocabulary', () => {
  const contract = brandFromRecords().component_contract;
  assert.equal(contract.version, '1.1.0');
  assert.equal(contract.spacing.base_unit_px, 4);
  assert.deepEqual(Object.values(contract.spacing.scale_px), [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128]);
  assert.deepEqual(contract.spacing.density_choices, ['compact', 'standard', 'generous']);
  assert.equal(contract.composition.directus_spacing_field, 'spacing');
  assert.equal(contract.composition.raw_css_in_cms, false);
  assert.equal(contract.composition.raw_numeric_spacing_in_cms, false);
});

test('governed presentation spacing is checked against the 4px grid', () => {
  assert.doesNotThrow(() => {
    execFileSync(process.execPath, ['scripts/validate-spacing-scale.mjs'], { stdio: 'pipe' });
  });
});

test('approved collections are unique and resolvable', () => {
  assert.equal(new Set(APPROVED_COMPONENT_COLLECTIONS).size, APPROVED_COMPONENT_COLLECTIONS.length);
  for (const collection of APPROVED_COMPONENT_COLLECTIONS) {
    assert.equal(componentByCollection(collection)?.status, 'approved');
  }
});

test('every component exposes only approved semantic spacing choices', () => {
  for (const component of COMPONENTS) {
    assert.deepEqual(component.spacingModes, ['compact', 'standard', 'generous']);
    const spacing = component.directusFields.find(({ name }) => name === 'spacing');
    assert.equal(spacing.type, 'string');
    assert.equal(spacing.default, 'standard');
    assert.deepEqual(spacing.choices.map(([, value]) => value), component.spacingModes);
    assert.equal(component.fields.includes('spacing'), true);
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

test('generic storage resolves only approved declarative components', () => {
  const block = materializeGenericPageBlock({
    component_key: 'block_text',
    schema_version: 1,
    key: 'proof',
    data: { title: 'Approved content', body: ['Plain text'] },
  });
  assert.equal(block.componentKey, 'block_text');
  assert.equal(block.item.key, 'proof');
  assert.equal(block.item.title, 'Approved content');
  assert.equal(materializeGenericPageBlock({
    component_key: 'block_text',
    data: { title: 'Compact content', spacing: 'compact' },
  }).item.spacing, 'compact');
  assert.throws(() => materializeGenericPageBlock({ component_key: 'unknown', data: {} }), /approved registry/);
  assert.throws(() => materializeGenericPageBlock({
    component_key: 'block_text',
    data: { renderer_path: './arbitrary-code.js' },
  }), /not an allowed content field/);
  assert.throws(() => materializeGenericPageBlock({
    component_key: 'block_text',
    data: { body: '<script>alert(1)</script>' },
  }), /executable content/);
  assert.throws(() => materializeGenericPageBlock({
    component_key: 'block_text',
    data: { spacing: '72px' },
  }), /compact, standard, or generous/);
  assert.throws(() => materializeGenericPageBlock({
    component_key: 'block_text',
    data: { padding: '72px' },
  }), /approved presentation tokens/);
});
