#!/usr/bin/env node

import assert from 'node:assert/strict';
import { APPROVED_COMPONENTS, COMPONENT_MANIFEST_VERSION } from '../component-system/components.mjs';
import { BRAND_TENANT, brandFromRecords } from '../lib/brand-settings.mjs';

const apply = process.argv.includes('--apply');
const directusUrl = String(process.env.DIRECTUS_URL || 'https://cms.nakanodigital.com').replace(/\/$/, '');
const tenant = process.env.DIRECTUS_TENANT_VALUE || BRAND_TENANT;
const proposalId = process.env.DESIGN_CONTRACT_PROPOSAL_ID || '4';
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
  throw new Error(apply
    ? 'Apply requires DIRECTUS_ADMIN_TOKEN.'
    : 'Preview requires a Directus admin, MCP, or site token.');
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
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.errors?.[0]?.message || `${options.method || 'GET'} ${pathname} failed.`);
  return body?.data;
}

async function requireApproval() {
  const proposal = await request(`/items/component_proposals/${proposalId}?fields=id,component_key,status,approval`);
  assert.equal(proposal.component_key, 'block_design_contract');
  assert.equal(proposal.status, 'approved', `Proposal ${proposalId} must have status=approved before --apply.`);
  assert.equal(proposal.approval?.approved, true, `Proposal ${proposalId} must have approval.approved=true before --apply.`);
}

const spacingMeta = {
  interface: 'select-dropdown',
  note: 'Approved brand density. Raw CSS and numeric spacing are not accepted.',
  options: {
    choices: [
      { text: 'Compact', value: 'compact' },
      { text: 'Standard', value: 'standard' },
      { text: 'Generous', value: 'generous' },
    ],
  },
};

token = await resolveToken();
const collections = await request('/collections?limit=-1');
const collectionNames = new Set(collections.map(({ collection }) => collection));
const targetCollections = [
  'site_sections',
  ...APPROVED_COMPONENTS.map(({ collection }) => collection).filter((collection) => collectionNames.has(collection)),
];
const missingSpacingFields = [];

for (const collection of targetCollections) {
  const fields = await request(`/fields/${collection}`);
  if (!fields.some(({ field }) => field === 'spacing')) missingSpacingFields.push(collection);
}

const brandQuery = new URLSearchParams({
  'filter[tenant][_eq]': tenant,
  'filter[setting_key][_eq]': 'component_contract',
  fields: 'id,value',
  limit: '1',
});
const [liveBrandRecord] = await request(`/items/brand_settings?${brandQuery}`);
const contract = brandFromRecords().component_contract;
const registry = await request('/items/component_registry?fields=id,key,version&limit=-1');
const outdatedRegistry = registry.filter(({ key, version }) => (
  APPROVED_COMPONENTS.some(({ collection }) => collection === key) && version !== COMPONENT_MANIFEST_VERSION
));

const plan = {
  apply,
  proposal_id: proposalId,
  contract_version: COMPONENT_MANIFEST_VERSION,
  missing_spacing_fields: missingSpacingFields,
  brand_contract_update: liveBrandRecord?.value?.version !== COMPONENT_MANIFEST_VERSION,
  registry_updates: outdatedRegistry.map(({ key }) => key),
};

if (!apply) {
  console.log(JSON.stringify(plan, null, 2));
  process.exit(0);
}

await requireApproval();

for (const collection of missingSpacingFields) {
  await request(`/fields/${collection}`, {
    method: 'POST',
    body: JSON.stringify({
      field: 'spacing',
      type: 'string',
      meta: spacingMeta,
      schema: { is_nullable: true, default_value: 'standard' },
    }),
  });
}

if (liveBrandRecord) {
  await request(`/items/brand_settings/${liveBrandRecord.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ value: contract, source: 'component-factory-proposal-4' }),
  });
} else {
  await request('/items/brand_settings', {
    method: 'POST',
    body: JSON.stringify({ tenant, setting_key: 'component_contract', value: contract, source: 'component-factory-proposal-4' }),
  });
}

for (const record of registry) {
  const component = APPROVED_COMPONENTS.find(({ collection }) => collection === record.key);
  if (!component) continue;
  await request(`/items/component_registry/${record.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      version: component.version,
      variants: component.variants,
      allowed_slots: component.slots,
      field_contract: component.directusFields,
      accessibility_contract: component.accessibility,
      limits: component.limits,
      trusted_open_source: component.trustedOpenSource || [],
    }),
  });
}

console.log(JSON.stringify({ ...plan, ok: true }, null, 2));
