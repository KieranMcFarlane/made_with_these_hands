#!/usr/bin/env node

import assert from 'node:assert/strict';
import {
  APPROVED_COMPONENT_COLLECTIONS,
  componentByCollection,
} from '../component-system/components.mjs';
import {
  GENERIC_BLOCK_COLLECTION,
  GENERIC_BLOCK_SCHEMA_VERSION,
  validateGenericPageBlock,
} from '../component-system/generic-page-block.mjs';

const apply = process.argv.includes('--apply');
const directusUrl = String(process.env.DIRECTUS_URL || 'https://cms.nakanodigital.com').replace(/\/$/, '');
const tenant = process.env.DIRECTUS_TENANT_VALUE || 'made-with-these-hands';
const proposalId = process.env.GENERIC_BLOCK_PROPOSAL_ID || '3';
let token;

async function resolveToken() {
  const candidates = apply
    ? [process.env.DIRECTUS_ADMIN_TOKEN]
    : [process.env.DIRECTUS_ADMIN_TOKEN, process.env.DIRECTUS_MCP_TOKEN, process.env.DIRECTUS_STATIC_TOKEN];
  for (const candidate of candidates.filter(Boolean)) {
    const response = await fetch(`${directusUrl}/users/me`, {
      headers: { Authorization: `Bearer ${candidate}` },
    });
    if (response.ok) return candidate;
  }
  const email = process.env.DIRECTUS_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const password = process.env.DIRECTUS_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  assert.ok(email && password, apply
    ? 'Apply requires DIRECTUS_ADMIN_TOKEN or Directus admin credentials.'
    : 'A Directus admin, MCP, or site token is required.');
  const response = await fetch(`${directusUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json().catch(() => null);
  assert.ok(response.ok && body?.data?.access_token, body?.errors?.[0]?.message || 'Directus login failed.');
  return body.data.access_token;
}

async function request(pathname, options = {}) {
  const response = await fetch(`${directusUrl}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(body?.errors?.[0]?.message || `${options.method || 'GET'} ${pathname} failed.`);
  return body?.data;
}

async function readItems(collection, query = {}) {
  const params = new URLSearchParams({ limit: '-1', ...query });
  return request(`/items/${collection}?${params}`);
}

async function requireApproval() {
  const proposal = await request(`/items/component_proposals/${proposalId}?fields=id,component_key,status,approval`);
  if (proposal.component_key !== 'block_generic_page'
      || proposal.status !== 'approved'
      || proposal.approval?.approved !== true) {
    throw new Error(`Proposal ${proposalId} must have status=approved and approval.approved=true before --apply.`);
  }
  return proposal;
}

const genericFields = [
  ['component_key', 'string', { interface: 'input', note: 'Approved registry key only.' }, { is_nullable: true }],
  ['schema_version', 'integer', { interface: 'input' }, { is_nullable: true, default_value: 1 }],
  ['spacing', 'string', {
    interface: 'select-dropdown',
    note: 'Approved brand density. Raw CSS and numeric spacing are not accepted.',
    options: {
      choices: [
        { text: 'Compact', value: 'compact' },
        { text: 'Standard', value: 'standard' },
        { text: 'Generous', value: 'generous' },
      ],
    },
  }, { is_nullable: true, default_value: 'standard' }],
  ['data', 'json', { interface: 'input-code', note: 'Declarative content only.' }, { is_nullable: true }],
  ['source_block_collection', 'string', { interface: 'input', readonly: true }, { is_nullable: true }],
  ['source_block_id', 'string', { interface: 'input', readonly: true }, { is_nullable: true }],
];

async function ensureGenericFields() {
  const existing = new Set((await request(`/${'fields'}/${GENERIC_BLOCK_COLLECTION}`)).map(({ field }) => field));
  for (const [field, type, meta, schema] of genericFields) {
    if (existing.has(field)) continue;
    await request(`/fields/${GENERIC_BLOCK_COLLECTION}`, {
      method: 'POST',
      body: JSON.stringify({ field, type, meta, schema }),
    });
  }
}

async function allowGenericBuilderCollection() {
  const relations = await request('/relations/site_pages_blocks');
  const relation = relations.find(({ collection, field }) => collection === 'site_pages_blocks' && field === 'site_pages_id');
  assert.ok(relation, 'Directus page-builder relation was not found.');
  const allowed = [...new Set([
    ...(relation.meta?.one_allowed_collections || APPROVED_COMPONENT_COLLECTIONS),
    GENERIC_BLOCK_COLLECTION,
  ])];
  await request('/relations/site_pages_blocks/site_pages_id', {
    method: 'PATCH',
    body: JSON.stringify({
      collection: relation.collection,
      field: relation.field,
      related_collection: relation.related_collection,
      schema: relation.schema,
      meta: { ...relation.meta, one_allowed_collections: allowed },
    }),
  });
}

token = await resolveToken();

const pages = await readItems('site_pages', {
  fields: 'id,path,status',
  filter: JSON.stringify({ tenant: { _eq: tenant } }),
});
const approvedRegistry = await readItems('component_registry', {
  fields: 'id,key',
  filter: JSON.stringify({ status: { _eq: 'approved' } }),
});
const approvedRegistryKeys = new Set(approvedRegistry.map(({ key }) => key));
const pageById = new Map(pages.map((page) => [String(page.id), page]));
const junctions = (await readItems('site_pages_blocks', {
  fields: 'id,site_pages_id,collection,item,sort,slot',
  sort: 'site_pages_id,sort',
})).filter((junction) => pageById.has(String(junction.site_pages_id))
  && APPROVED_COMPONENT_COLLECTIONS.includes(junction.collection));

const sourceCache = new Map();
const plan = [];
for (const junction of junctions) {
  const cacheKey = `${junction.collection}:${junction.item}`;
  let source = sourceCache.get(cacheKey);
  if (!source) {
    source = await request(`/items/${junction.collection}/${junction.item}?fields=*`);
    sourceCache.set(cacheKey, source);
  }
  const component = componentByCollection(junction.collection);
  assert.ok(
    approvedRegistryKeys.has(junction.collection),
    `${junction.collection} is not approved in the live Directus component registry.`,
  );
  const envelope = {
    component_key: junction.collection,
    schema_version: GENERIC_BLOCK_SCHEMA_VERSION,
    data: source,
  };
  validateGenericPageBlock(envelope);
  plan.push({
    junctionId: junction.id,
    page: pageById.get(String(junction.site_pages_id)),
    sourceCollection: junction.collection,
    sourceId: String(junction.item),
    componentVersion: component.version,
    genericKey: `generic-${junction.collection}-${junction.item}`,
    source,
  });
}

if (!apply) {
  const proposal = await request(`/items/component_proposals/${proposalId}?fields=id,status,approval`);
  console.log(JSON.stringify({
    ok: true,
    mode: 'dry-run',
    tenant,
    proposal: {
      id: proposalId,
      status: proposal.status,
      approved: proposal.approval?.approved === true,
    },
    pages: pages.length,
    junctions: plan.length,
    uniqueSourceBlocks: sourceCache.size,
    byComponent: Object.fromEntries(APPROVED_COMPONENT_COLLECTIONS.map((key) => [
      key,
      plan.filter(({ sourceCollection }) => sourceCollection === key).length,
    ])),
    destructiveChanges: 0,
    next: plan.length
      ? `Back up Directus, then rerun with --apply${proposal.approval?.approved === true ? '' : ` after approving proposal ${proposalId}`}.`
      : 'No legacy page junctions remain to migrate.',
  }, null, 2));
  process.exit(0);
}

await requireApproval();
await ensureGenericFields();
await allowGenericBuilderCollection();

let created = 0;
let relinked = 0;
for (const entry of plan) {
  const filter = JSON.stringify({
    _and: [
      { tenant: { _eq: tenant } },
      { source_block_collection: { _eq: entry.sourceCollection } },
      { source_block_id: { _eq: entry.sourceId } },
    ],
  });
  let generic = (await readItems(GENERIC_BLOCK_COLLECTION, { fields: 'id', filter }))[0];
  if (!generic) {
    generic = await request(`/items/${GENERIC_BLOCK_COLLECTION}`, {
      method: 'POST',
      body: JSON.stringify({
        tenant,
        key: entry.genericKey,
        status: entry.source.status || 'draft',
        label: `${entry.sourceCollection} ${entry.sourceId}`,
        component_key: entry.sourceCollection,
        schema_version: GENERIC_BLOCK_SCHEMA_VERSION,
        data: entry.source,
        source_block_collection: entry.sourceCollection,
        source_block_id: entry.sourceId,
      }),
    });
    created += 1;
  }
  await request(`/items/site_pages_blocks/${entry.junctionId}`, {
    method: 'PATCH',
    body: JSON.stringify({ collection: GENERIC_BLOCK_COLLECTION, item: String(generic.id) }),
  });
  relinked += 1;
}

for (const record of approvedRegistry.filter(({ key }) => (
  plan.some(({ sourceCollection }) => sourceCollection === key)
))) {
  await request(`/items/component_registry/${record.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ block_collection: GENERIC_BLOCK_COLLECTION }),
  });
}

console.log(JSON.stringify({
  ok: true,
  mode: 'applied',
  tenant,
  created,
  relinked,
  legacyRecordsDeleted: 0,
  legacyCollectionsDeleted: 0,
}, null, 2));
