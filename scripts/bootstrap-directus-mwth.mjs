const directusUrl = process.env.DIRECTUS_URL || 'http://127.0.0.1:8055';
const token = process.env.DIRECTUS_ADMIN_TOKEN;

if (!token) {
  console.error('DIRECTUS_ADMIN_TOKEN is required.');
  process.exit(1);
}

async function request(path, options = {}) {
  const response = await fetch(`${directusUrl}${path}`, {
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
    throw new Error(`${options.method || 'GET'} ${path}: ${message}`);
  }

  return body;
}

async function collectionExists(collection) {
  const result = await request('/collections');
  return result.data.some((item) => item.collection === collection);
}

async function fieldExists(collection, field) {
  const result = await request(`/fields/${collection}`);
  return result.data.some((item) => item.field === field);
}

async function itemExists(collection, filter) {
  const query = new URLSearchParams({
    filter: JSON.stringify(filter),
    limit: '1',
  });
  const result = await request(`/items/${collection}?${query}`);
  return result.data[0] || null;
}

async function ensureCollection(collection, options = {}) {
  if (await collectionExists(collection)) {
    console.log(`collection exists: ${collection}`);
    return;
  }

  await request('/collections', {
    method: 'POST',
    body: JSON.stringify({
      collection,
      meta: {
        icon: options.icon || 'article',
        note: options.note || null,
        display_template: options.displayTemplate || null,
      },
      schema: {},
    }),
  });
  console.log(`created collection: ${collection}`);
}

async function ensureField(collection, field, type, meta = {}, schema = {}) {
  if (await fieldExists(collection, field)) {
    console.log(`field exists: ${collection}.${field}`);
    return;
  }

  await request(`/fields/${collection}`, {
    method: 'POST',
    body: JSON.stringify({
      field,
      type,
      meta: {
        interface: interfaceFor(type),
        ...meta,
      },
      schema: {
        is_nullable: true,
        ...schema,
      },
    }),
  });
  console.log(`created field: ${collection}.${field}`);
}

function interfaceFor(type) {
  if (type === 'text') return 'input-multiline';
  if (type === 'json') return 'input-code';
  if (type === 'uuid') return 'file-image';
  if (type === 'boolean') return 'boolean';
  if (type === 'integer' || type === 'decimal') return 'input';
  return 'input';
}

async function ensureTenant() {
  const existing = await itemExists('tenants', { slug: { _eq: 'made-with-these-hands' } });
  if (existing) {
    console.log('tenant exists: made-with-these-hands');
    return existing;
  }

  const result = await request('/items/tenants', {
    method: 'POST',
    body: JSON.stringify({
      slug: 'made-with-these-hands',
      status: 'published',
      name: 'Made With These Hands',
      site_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://madewiththesehands.ie',
      description: 'A journal of heritage craft, makers, objects, podcast episodes, and workshop notes.',
      email: 'studio@madewiththesehands.ie',
      location: 'Kilkenny, Ireland',
      footer_tagline: 'Heritage craft, recorded at the bench.',
    }),
  });
  console.log('created tenant: made-with-these-hands');
  return result.data;
}

async function ensureGenericPage(path, pageType, title, sort) {
  const existing = await itemExists('site_pages', {
    _and: [
      { tenant: { _eq: 'made-with-these-hands' } },
      { path: { _eq: path } },
    ],
  });
  if (existing) {
    console.log(`page exists: ${path}`);
    return;
  }

  await request('/items/site_pages', {
    method: 'POST',
    body: JSON.stringify({
      tenant: 'made-with-these-hands',
      path,
      canonical_path: path,
      status: 'published',
      page_type: pageType,
      title,
      seo_title: `${title} | Made With These Hands`,
      description: 'Made With These Hands records heritage craft, makers, objects, podcast episodes, and workshop notes.',
      priority: path === '/' ? 1 : 0.7,
      change_frequency: path === '/' ? 'weekly' : 'monthly',
      sort,
    }),
  });
  console.log(`created page: ${path}`);
}

async function ensureNavigationItem(menu, href, label, sort) {
  const existing = await itemExists('navigation_items', {
    _and: [
      { tenant: { _eq: 'made-with-these-hands' } },
      { menu: { _eq: menu } },
      { href: { _eq: href } },
    ],
  });
  if (existing) {
    console.log(`navigation exists: ${menu} ${href}`);
    return;
  }

  await request('/items/navigation_items', {
    method: 'POST',
    body: JSON.stringify({
      tenant: 'made-with-these-hands',
      menu,
      href,
      label,
      sort,
    }),
  });
  console.log(`created navigation: ${menu} ${href}`);
}

async function ensureContentCollection(collection, fields, options = {}) {
  await ensureCollection(collection, options);
  for (const field of fields) {
    await ensureField(collection, ...field);
  }
}

async function main() {
  await ensureTenant();

  await Promise.all([
    ensureGenericPage('/', 'home', 'Made With These Hands', 10),
    ensureGenericPage('/objects', 'objects_index', 'Objects', 20),
    ensureGenericPage('/about', 'about', 'Hugh McNeill', 30),
    ensureGenericPage('/makers', 'makers_index', 'Makers', 40),
    ensureGenericPage('/podcast', 'podcast_index', 'Field Recordings', 50),
    ensureGenericPage('/journal', 'journal_index', 'Journal', 60),
    ensureGenericPage('/contact', 'contact', 'Contact', 70),
  ]);

  await Promise.all([
    ensureNavigationItem('primary', '/', 'Home', 10),
    ensureNavigationItem('primary', '/objects', 'Objects', 20),
    ensureNavigationItem('primary', '/podcast', 'Podcast', 30),
    ensureNavigationItem('primary', '/journal', 'Journal', 40),
    ensureNavigationItem('primary', '/about', 'Hugh', 50),
    ensureNavigationItem('primary', '/contact', 'Contact', 60),
  ]);

  await ensureContentCollection('makers', [
    ['tenant', 'string'],
    ['slug', 'string', {}, { is_nullable: false, is_unique: true }],
    ['status', 'string'],
    ['name', 'string', {}, { is_nullable: false }],
    ['craft', 'string'],
    ['place', 'string'],
    ['established', 'string'],
    ['dek', 'text'],
    ['bio', 'text'],
    ['image', 'uuid'],
    ['hero_image', 'uuid'],
    ['hero_label', 'string'],
    ['practice_title', 'string'],
    ['practice', 'json'],
    ['seo_title', 'string'],
    ['seo_description', 'text'],
  ], { icon: 'person', displayTemplate: '{{name}}' });

  await ensureContentCollection('products', [
    ['tenant', 'string'],
    ['slug', 'string', {}, { is_nullable: false, is_unique: true }],
    ['status', 'string'],
    ['name', 'string', {}, { is_nullable: false }],
    ['maker', 'string'],
    ['craft', 'string'],
    ['place', 'string'],
    ['price', 'string'],
    ['meta', 'string'],
    ['summary', 'text'],
    ['description', 'text'],
    ['image', 'uuid'],
    ['gallery', 'json'],
    ['enquiry_enabled', 'boolean'],
    ['seo_title', 'string'],
    ['seo_description', 'text'],
  ], { icon: 'inventory_2', displayTemplate: '{{name}}' });

  await ensureContentCollection('episodes', [
    ['tenant', 'string'],
    ['number', 'string', {}, { is_nullable: false }],
    ['slug', 'string'],
    ['status', 'string'],
    ['maker', 'string'],
    ['guest', 'string'],
    ['title', 'string', {}, { is_nullable: false }],
    ['craft', 'string'],
    ['place', 'string'],
    ['duration', 'string'],
    ['date', 'date'],
    ['summary', 'text'],
    ['body', 'json'],
    ['audio_url', 'string'],
    ['transcript', 'text'],
    ['transcript_url', 'string'],
    ['chapters', 'json'],
    ['related_products', 'json'],
    ['related_posts', 'json'],
    ['seo_title', 'string'],
    ['seo_description', 'text'],
  ], { icon: 'podcasts', displayTemplate: 'EP {{number}} — {{title}}' });

  await ensureContentCollection('posts', [
    ['tenant', 'string'],
    ['slug', 'string', {}, { is_nullable: false, is_unique: true }],
    ['status', 'string'],
    ['title', 'string', {}, { is_nullable: false }],
    ['dek', 'text'],
    ['author', 'string'],
    ['date', 'date'],
    ['category', 'string'],
    ['image', 'uuid'],
    ['body', 'json'],
    ['related_makers', 'json'],
    ['related_products', 'json'],
    ['related_episodes', 'json'],
    ['seo_title', 'string'],
    ['seo_description', 'text'],
  ], { icon: 'article', displayTemplate: '{{title}}' });

  await ensureContentCollection('site_sections', [
    ['tenant', 'string'],
    ['key', 'string', {}, { is_nullable: false, is_unique: true }],
    ['status', 'string'],
    ['label', 'string'],
    ['eyebrow', 'string'],
    ['title', 'text'],
    ['dek', 'text'],
    ['body', 'json'],
    ['image', 'uuid'],
    ['image_alt', 'string'],
    ['image_caption', 'text'],
    ['quote', 'text'],
    ['cta_label', 'string'],
    ['cta_href', 'string'],
    ['secondary_cta_label', 'string'],
    ['secondary_cta_href', 'string'],
    ['meta', 'text'],
    ['extra', 'json'],
  ], { icon: 'dashboard_customize', displayTemplate: '{{key}} - {{label}}' });

  await ensureContentCollection('comments', [
    ['tenant', 'string'],
    ['episode', 'string', {}, { is_nullable: false }],
    ['name', 'string', {}, { is_nullable: false }],
    ['email', 'string', {}, { is_nullable: false }],
    ['body', 'text', {}, { is_nullable: false }],
    ['status', 'string'],
  ], { icon: 'forum', displayTemplate: '{{name}} — {{episode}}' });

  await ensureContentCollection('enquiries', [
    ['tenant', 'string'],
    ['product', 'string'],
    ['product_name', 'string'],
    ['maker_name', 'string'],
    ['name', 'string', {}, { is_nullable: false }],
    ['email', 'string', {}, { is_nullable: false }],
    ['phone', 'string'],
    ['message', 'text', {}, { is_nullable: false }],
    ['status', 'string'],
  ], { icon: 'mail', displayTemplate: '{{product_name}} — {{name}}' });
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
