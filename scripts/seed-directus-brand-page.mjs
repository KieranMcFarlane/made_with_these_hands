const directusUrl = (process.env.DIRECTUS_URL || 'http://127.0.0.1:8055').replace(/\/$/, '');
const token = process.env.DIRECTUS_MCP_TOKEN || process.env.DIRECTUS_ADMIN_TOKEN;
const tenant = process.env.DIRECTUS_TENANT_VALUE || 'made-with-these-hands';

if (!token) {
  console.error('DIRECTUS_MCP_TOKEN or DIRECTUS_ADMIN_TOKEN is required.');
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

async function findOne(collection, filter, fields = '*') {
  const query = new URLSearchParams({
    filter: JSON.stringify(filter),
    fields,
    limit: '1',
  });
  const result = await request(`/items/${collection}?${query}`);
  return result.data?.[0] || null;
}

async function ensurePage() {
  const existing = await findOne('site_pages', {
    _and: [
      { tenant: { _eq: tenant } },
      { path: { _eq: '/brand' } },
    ],
  });
  const data = {
    tenant,
    path: '/brand',
    canonical_path: '/brand',
    status: 'published',
    page_type: 'brand_book',
    title: 'Brand Book',
    seo_title: 'Brand Book | Made With These Hands',
    description: 'The living visual and editorial system for Made With These Hands.',
    priority: 0.3,
    change_frequency: 'monthly',
    sort: 80,
  };

  if (existing) {
    return (await request(`/items/site_pages/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })).data;
  }

  return (await request('/items/site_pages', {
    method: 'POST',
    body: JSON.stringify(data),
  })).data;
}

async function upsertBlock(collection, data) {
  const existing = await findOne(collection, {
    _and: [
      { tenant: { _eq: tenant } },
      { key: { _eq: data.key } },
    ],
  });
  const payload = { tenant, status: 'published', ...data };

  if (existing) {
    return (await request(`/items/${collection}/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })).data;
  }

  return (await request(`/items/${collection}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })).data;
}

async function ensurePageBlock(pageId, collection, itemId, sort) {
  const existing = await findOne('site_pages_blocks', {
    _and: [
      { site_pages_id: { _eq: pageId } },
      { collection: { _eq: collection } },
      { item: { _eq: String(itemId) } },
    ],
  });
  const payload = {
    site_pages_id: pageId,
    collection,
    item: String(itemId),
    sort,
  };

  if (existing) {
    await request(`/items/site_pages_blocks/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return existing.id;
  }

  return (await request('/items/site_pages_blocks', {
    method: 'POST',
    body: JSON.stringify(payload),
  })).data.id;
}

const blockSpecs = [
  {
    collection: 'block_hero',
    sort: 10,
    data: {
      key: 'brand_cover',
      eyebrow: 'Identity / 01',
      title: 'The hand remembers.',
      dek: 'A living system for documenting craft with restraint, clarity, and evidence of the person who made it.',
      theme: 'paper',
    },
  },
  {
    collection: 'block_text',
    sort: 20,
    data: {
      key: 'brand_story',
      eyebrow: '01 / Brand story',
      title: 'Keep the evidence of the hand visible.',
      dek: 'The promise and principles that hold every story together.',
      body: [
        'The maker is the authority.',
        'Process matters as much as outcome.',
        'Specific language beats promotional language.',
        'Restraint creates room for the work.',
      ],
      theme: 'paper',
    },
  },
  {
    collection: 'block_text',
    sort: 30,
    data: {
      key: 'brand_colour',
      eyebrow: '02 / Colour',
      title: 'Material, quiet, and warm.',
      dek: 'The active palette and approved alternatives are controlled by brand_settings.',
      theme: 'paper-2',
    },
  },
  {
    collection: 'block_text',
    sort: 40,
    data: {
      key: 'brand_type',
      eyebrow: '03 / Typography',
      title: 'Editorial hierarchy with workshop utility.',
      dek: 'Display, body, and utility roles remain distinct.',
      theme: 'paper',
    },
  },
  {
    collection: 'block_quote',
    sort: 50,
    data: {
      key: 'brand_voice',
      eyebrow: '04 / Voice',
      title: 'Measured, specific, and human.',
      dek: 'The voice should sound recorded at the bench, not invented in a campaign room.',
      quote: 'The wheel teaches you to slow down - you cannot argue with it.',
      quote_attribution: 'Made With These Hands voice example',
      theme: 'ink',
    },
  },
  {
    collection: 'block_media',
    sort: 60,
    data: {
      key: 'brand_imagery',
      eyebrow: '05 / Imagery',
      title: 'Light should reveal work, not decorate it.',
      dek: 'Composition and subject guidance for photography and generated editorial imagery.',
      caption: 'Use real texture, directional light, and enough negative space for the story to breathe.',
      theme: 'paper',
    },
  },
  {
    collection: 'block_text',
    sort: 70,
    data: {
      key: 'brand_components',
      eyebrow: '06 / Components',
      title: 'A small system, used consistently.',
      dek: 'Editorial openings, archive cards, buttons, and accent usage.',
      theme: 'paper-2',
    },
  },
];

async function main() {
  const page = await ensurePage();
  for (const spec of blockSpecs) {
    const block = await upsertBlock(spec.collection, spec.data);
    await ensurePageBlock(page.id, spec.collection, block.id, spec.sort);
    console.log(`linked ${spec.data.key} at ${spec.sort}`);
  }
  console.log(`brand page ready: ${page.id}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
