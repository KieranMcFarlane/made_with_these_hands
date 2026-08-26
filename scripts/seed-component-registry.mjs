import { APPROVED_COMPONENTS } from '../component-system/components.mjs';

const directusUrl = process.env.DIRECTUS_URL || 'http://127.0.0.1:8055';
const token = process.env.DIRECTUS_ADMIN_TOKEN;

if (!token) {
  console.error('DIRECTUS_ADMIN_TOKEN is required.');
  process.exit(1);
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
  if (!response.ok) {
    const message = body?.errors?.[0]?.message || body?.message || response.statusText;
    throw new Error(`${options.method || 'GET'} ${pathname}: ${message}`);
  }
  return body;
}

const sectionFields = (await request('/fields/site_sections')).data;
const genericStorageEnabled = ['component_key', 'schema_version', 'data'].every((required) => (
  sectionFields.some(({ field }) => field === required)
));
const collectionNames = new Set((await request('/collections?limit=-1')).data.map(({ collection }) => collection));

for (const component of APPROVED_COMPONENTS) {
  const query = new URLSearchParams({
    'filter[key][_eq]': component.collection,
    limit: '1',
    fields: 'id',
  });
  const existing = (await request(`/items/component_registry?${query}`)).data?.[0];
  if (!existing && !collectionNames.has(component.collection)) {
    const proposalQuery = new URLSearchParams({
      'filter[component_key][_eq]': component.collection,
      'filter[status][_eq]': 'approved',
      fields: 'id,approval',
      limit: '1',
    });
    const proposal = (await request(`/items/component_proposals?${proposalQuery}`)).data?.[0];
    if (proposal?.approval?.approved !== true) {
      console.log(`skipped unapproved component registry entry: ${component.collection}`);
      continue;
    }
  }
  const data = {
    key: component.collection,
    label: component.label,
    description: component.description,
    block_collection: genericStorageEnabled ? 'site_sections' : component.collection,
    status: component.status,
    version: component.version,
    variants: component.variants,
    allowed_slots: component.slots,
    field_contract: component.directusFields,
    accessibility_contract: component.accessibility,
    limits: component.limits,
    trusted_open_source: component.trustedOpenSource || [],
    preview_url: `/brand#component-${component.collection}`,
    renderer_key: component.renderer,
  };
  if (existing) {
    await request(`/items/component_registry/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    console.log(`updated component registry: ${component.collection}`);
  } else {
    await request('/items/component_registry', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    console.log(`created component registry: ${component.collection}`);
  }
}
