#!/usr/bin/env node

const directusUrl = String(process.env.DIRECTUS_URL || 'http://127.0.0.1:8055').replace(/\/$/, '');
const token = process.env.DIRECTUS_MCP_TOKEN;
const tenant = process.env.DIRECTUS_TENANT_VALUE || 'made-with-these-hands';

if (!token) throw new Error('DIRECTUS_MCP_TOKEN is required.');

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

async function findOne(collection, filter) {
  const query = new URLSearchParams({ filter: JSON.stringify(filter), limit: '1' });
  return (await request(`/items/${collection}?${query}`))[0] || null;
}

async function ensureItem(collection, key, data) {
  const existing = await findOne(collection, {
    _and: [{ tenant: { _eq: tenant } }, { key: { _eq: key } }],
  });
  if (existing) return existing;
  return request(`/items/${collection}`, {
    method: 'POST',
    body: JSON.stringify({ ...data, key, tenant, status: 'draft' }),
  });
}

let page = await findOne('site_pages', {
  _and: [{ tenant: { _eq: tenant } }, { path: { _eq: '/owner-acceptance' } }],
});
if (!page) {
  page = await request('/items/site_pages', {
    method: 'POST',
    body: JSON.stringify({
      tenant,
      path: '/owner-acceptance',
      canonical_path: '/owner-acceptance',
      status: 'draft',
      page_type: 'custom',
      title: 'Owner acceptance',
      seo_title: 'Owner acceptance | Made With These Hands',
      description: 'A private draft used to verify Hugh\'s tenant-scoped Codex workflow.',
      priority: 0,
      change_frequency: 'never',
      sort: 999,
    }),
  });
}

const hero = await ensureItem('block_hero', 'owner_acceptance_hero', {
  eyebrow: 'Private workflow proof',
  title: 'Made With These Hands owner acceptance.',
  dek: 'An unpublished page for checking content, composition, and brand guardrails.',
  theme: 'paper',
  variant: 'minimal',
  image_alt: '',
});
const cta = await ensureItem('block_cta', 'owner_acceptance_cta', {
  eyebrow: 'Brand contract',
  title: 'Review the living brand book.',
  dek: 'The component vocabulary and visual rules remain visible while content changes.',
  theme: 'paper',
  variant: 'band',
  cta_label: 'Open brand book',
  cta_href: '/brand',
});
const text = await ensureItem('block_text', 'owner_acceptance_text', {
  eyebrow: 'Owner note',
  title: 'A controlled place to make the first edit.',
  dek: 'This draft has not yet been reviewed by Hugh.',
  theme: 'paper',
  variant: 'left',
  alignment: 'left',
  body: ['This text block is safe to edit and remains unpublished during acceptance.'],
});

const desired = [
  ['block_hero', hero.id, 1],
  ['block_cta', cta.id, 2],
  ['block_text', text.id, 3],
];
const existingJunctions = await request(`/items/site_pages_blocks?${new URLSearchParams({
  filter: JSON.stringify({ site_pages_id: { _eq: page.id } }),
  fields: 'id,site_pages_id,collection,item,sort,slot',
  limit: '-1',
})}`);

for (const [collection, item, sort] of desired) {
  const existing = existingJunctions.find((junction) => junction.collection === collection && String(junction.item) === String(item));
  if (existing) continue;
  await request('/items/site_pages_blocks', {
    method: 'POST',
    body: JSON.stringify({
      site_pages_id: page.id,
      collection,
      item: String(item),
      sort,
      slot: 'main',
    }),
  });
}

const finalJunctions = await request(`/items/site_pages_blocks?${new URLSearchParams({
  filter: JSON.stringify({ site_pages_id: { _eq: page.id } }),
  fields: 'id,collection,item,sort,slot',
  sort: 'sort',
  limit: '-1',
})}`);

if (page.status !== 'draft') throw new Error('Owner acceptance page must remain a draft.');
console.log(JSON.stringify({
  ok: true,
  tenant,
  page: { id: page.id, path: page.path, status: page.status },
  blocks: finalJunctions,
  published: false,
}, null, 2));
