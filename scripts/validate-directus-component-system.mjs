import assert from 'node:assert/strict';
import {
  APPROVED_COMPONENT_COLLECTIONS,
  APPROVED_COMPONENTS,
  COMPONENT_MANIFEST_VERSION,
} from '../component-system/components.mjs';

const directusUrl = process.env.DIRECTUS_URL || 'http://127.0.0.1:8055';
const token = process.env.DIRECTUS_COMPONENT_FACTORY_TOKEN
  || process.env.DIRECTUS_MCP_TOKEN
  || process.env.DIRECTUS_ADMIN_TOKEN;

if (!token) {
  console.error('A restricted Directus component-factory or MCP token is required for live validation.');
  process.exit(1);
}

async function request(pathname) {
  const response = await fetch(`${directusUrl}${pathname}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.errors?.[0]?.message || response.statusText;
    throw new Error(`GET ${pathname}: ${message}`);
  }
  return body?.data;
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right))
    .map(([key, entry]) => [key, stable(entry)]));
}

function jsonValue(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function assertContractEqual(actual, expected, label) {
  assert.deepEqual(stable(jsonValue(actual, actual)), stable(expected), `${label} differs from the compile-time manifest`);
}

function assertDirectusFieldType(actual, expected, label) {
  if (expected.type === 'uuid' && actual?.type === 'string' && actual?.meta?.interface === 'file-image') return;
  assert.equal(actual?.type, expected.type, `${label} has the wrong Directus type`);
}

const collections = await request('/collections?limit=-1');
const collectionNames = new Set(collections.map(({ collection }) => collection));
for (const collection of [
  ...APPROVED_COMPONENT_COLLECTIONS,
  'component_registry',
  'component_proposals',
  'site_pages',
  'site_pages_blocks',
]) {
  assert.ok(collectionNames.has(collection), `Missing Directus collection: ${collection}`);
}

const commonBlockFields = ['tenant', 'status', 'key', 'eyebrow', 'title', 'dek', 'theme'];
for (const component of APPROVED_COMPONENTS) {
  const fields = await request(`/fields/${component.collection}`);
  const fieldsByName = new Map(fields.map((field) => [field.field, field]));
  for (const field of [...commonBlockFields, ...component.directusFields.map(({ name }) => name)]) {
    assert.ok(fieldsByName.has(field), `${component.collection}.${field} is missing in Directus`);
  }
  for (const expected of component.directusFields) {
    assertDirectusFieldType(fieldsByName.get(expected.name), expected, `${component.collection}.${expected.name}`);
  }
}

const registryQuery = new URLSearchParams({
  fields: [
    'key',
    'label',
    'description',
    'block_collection',
    'status',
    'version',
    'variants',
    'allowed_slots',
    'field_contract',
    'accessibility_contract',
    'limits',
    'trusted_open_source',
    'preview_url',
    'renderer_key',
  ].join(','),
  limit: '-1',
});
const registry = await request(`/items/component_registry?${registryQuery}`);
const registryByKey = new Map(registry.map((record) => [record.key, record]));

for (const component of APPROVED_COMPONENTS) {
  const record = registryByKey.get(component.collection);
  assert.ok(record, `Missing component_registry record: ${component.collection}`);
  assert.equal(record.status, 'approved', `${component.collection} is not approved in Directus`);
  assert.equal(record.block_collection, component.collection);
  assert.equal(record.renderer_key, component.renderer);
  assert.equal(record.version, component.version);
  assert.equal(record.preview_url, `/brand#component-${component.collection}`);
  assertContractEqual(record.variants, component.variants, `${component.collection}.variants`);
  assertContractEqual(record.allowed_slots, component.slots, `${component.collection}.allowed_slots`);
  assertContractEqual(record.field_contract, component.directusFields, `${component.collection}.field_contract`);
  assertContractEqual(
    record.accessibility_contract,
    component.accessibility,
    `${component.collection}.accessibility_contract`,
  );
  assertContractEqual(record.limits, component.limits, `${component.collection}.limits`);
  assertContractEqual(record.trusted_open_source || [], component.trustedOpenSource || [], `${component.collection}.trusted_open_source`);
}

const relations = await request('/relations/site_pages_blocks');
const pageBuilderRelation = relations.find(({ collection, field }) => (
  collection === 'site_pages_blocks' && field === 'site_pages_id'
));
assert.ok(pageBuilderRelation, 'The site_pages Builder relation is missing');
assertContractEqual(
  pageBuilderRelation.meta?.one_allowed_collections,
  APPROVED_COMPONENT_COLLECTIONS,
  'site_pages Builder allowed collections',
);

const brandQuery = new URLSearchParams({
  'filter[setting_key][_eq]': 'component_contract',
  fields: 'setting_key,value',
  limit: '1',
});
const [brandContract] = await request(`/items/brand_settings?${brandQuery}`);
assert.ok(brandContract, 'The live brand component contract is missing');
const brandContractValue = jsonValue(brandContract.value, {});
assert.equal(
  brandContractValue.version,
  COMPONENT_MANIFEST_VERSION,
  'Live brand contract and component manifest versions differ',
);
assert.equal(brandContractValue.component_sources?.preferred, 'shadcn');
assert.equal(brandContractValue.component_sources?.fallback, 'bespoke-after-documented-gap');
assert.equal(brandContractValue.nesting?.executable_content_in_cms, false);

console.log(
  `Live Directus component system is valid (${APPROVED_COMPONENTS.length} approved components, manifest ${COMPONENT_MANIFEST_VERSION}).`,
);
