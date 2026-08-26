import {
  APPROVED_COMPONENT_COLLECTIONS,
  APPROVED_COMPONENTS,
  COMPONENT_SLOTS,
} from '../component-system/components.mjs';

const directusUrl = process.env.DIRECTUS_URL || 'http://127.0.0.1:8055';
let token = process.env.DIRECTUS_ADMIN_TOKEN;
const LEGACY_BLOCK_COLLECTIONS = new Set([
  'block_hero',
  'block_text',
  'block_media',
  'block_quote',
  'block_listing',
  'block_cta',
  'block_slideshow',
]);

async function resolveAdminToken() {
  if (token) {
    const response = await fetch(`${directusUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) return token;
  }

  const email = process.env.DIRECTUS_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const password = process.env.DIRECTUS_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('A valid DIRECTUS_ADMIN_TOKEN or Directus admin email/password is required.');
  }
  const response = await fetch(`${directusUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.data?.access_token) {
    throw new Error(body?.errors?.[0]?.message || 'Directus admin login failed.');
  }
  return body.data.access_token;
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

async function getRelation(collection, field) {
  const result = await request(`/relations/${collection}`);
  return result.data.find((item) => item.collection === collection && item.field === field) || null;
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

async function ensureAliasField(collection, field, meta = {}) {
  if (await fieldExists(collection, field)) {
    console.log(`field exists: ${collection}.${field}`);
    return;
  }

  try {
    await request(`/fields/${collection}`, {
      method: 'POST',
      body: JSON.stringify({
        field,
        type: 'alias',
        meta,
        schema: null,
      }),
    });
    console.log(`created field: ${collection}.${field}`);
  } catch (error) {
    console.warn(`could not create alias field ${collection}.${field}: ${error.message}`);
    console.warn('Create this as a Builder (M2A) field in Directus if your API version requires UI setup.');
  }
}

async function ensureRelation(relation) {
  const existing = await getRelation(relation.collection, relation.field);
  if (existing) {
    if (relation.meta) {
      await request(`/relations/${relation.collection}/${relation.field}`, {
        method: 'PATCH',
        body: JSON.stringify({
          collection: existing.collection,
          field: existing.field,
          related_collection: existing.related_collection,
          schema: existing.schema,
          meta: relation.meta,
        }),
      });
      console.log(`updated relation: ${relation.collection}.${relation.field}`);
      return;
    }
    console.log(`relation exists: ${relation.collection}.${relation.field}`);
    return;
  }

  await request('/relations', {
    method: 'POST',
    body: JSON.stringify(relation),
  });
  console.log(`created relation: ${relation.collection}.${relation.field}`);
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
      site_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://madewiththesehands.com',
      description: 'A journal of heritage craft, makers, objects, podcast episodes, and workshop notes.',
      email: process.env.ENQUIRY_TO_EMAIL || 'hughmn@hotmail.com',
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

async function ensureProposalTenantOwnership() {
  const result = await request('/items/component_proposals?fields=id,tenant&limit=-1');
  for (const proposal of result.data) {
    if (proposal.tenant) continue;
    await request(`/items/component_proposals/${proposal.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ tenant: 'made-with-these-hands' }),
    });
    console.log(`backfilled component proposal tenant: ${proposal.id}`);
  }
  await request('/fields/component_proposals/tenant', {
    method: 'PATCH',
    body: JSON.stringify({ schema: { is_nullable: false } }),
  });
  console.log('enforced field: component_proposals.tenant is not nullable');
}

async function ensureCoreCollections() {
  await ensureContentCollection('tenants', [
    ['slug', 'string', {}, { is_nullable: false, is_unique: true }],
    ['status', 'string'],
    ['name', 'string', {}, { is_nullable: false }],
    ['site_url', 'string'],
    ['description', 'text'],
    ['email', 'string'],
    ['location', 'string'],
    ['footer_tagline', 'text'],
  ], { icon: 'domain', displayTemplate: '{{name}}' });

  await ensureContentCollection('brand_settings', [
    ['tenant', 'string', {}, { is_nullable: false }],
    ['setting_key', 'string', {}, { is_nullable: false }],
    ['value', 'json'],
    ['source', 'string'],
  ], { icon: 'palette', displayTemplate: '{{setting_key}}' });

  await ensureContentCollection('component_registry', [
    ['key', 'string', {}, { is_nullable: false, is_unique: true }],
    ['label', 'string', {}, { is_nullable: false }],
    ['description', 'text'],
    ['block_collection', 'string', {}, { is_nullable: false }],
    ['status', 'string', choiceField([
      ['Proposed', 'proposed'],
      ['Testing', 'testing'],
      ['Approved', 'approved'],
      ['Deprecated', 'deprecated'],
    ], 'Only approved components may be published in the page builder.'), { default_value: 'proposed' }],
    ['version', 'string', {}, { is_nullable: false }],
    ['variants', 'json'],
    ['allowed_slots', 'json'],
    ['field_contract', 'json'],
    ['accessibility_contract', 'json'],
    ['limits', 'json'],
    ['trusted_open_source', 'json'],
    ['preview_url', 'string'],
    ['renderer_key', 'string', {}, { is_nullable: false }],
    ['approved_by', 'string'],
    ['approved_at', 'timestamp'],
  ], { icon: 'widgets', displayTemplate: '{{label}} · {{status}} · v{{version}}' });

  await ensureContentCollection('component_proposals', [
    ['tenant', 'string'],
    ['request', 'text', {}, { is_nullable: false }],
    ['component_key', 'string', {}, { is_nullable: false }],
    ['requested_by', 'string'],
    ['status', 'string', choiceField([
      ['Proposed', 'proposed'],
      ['Testing', 'testing'],
      ['Awaiting approval', 'awaiting_approval'],
      ['Ready for tenant install', 'ready_for_tenant_install'],
      ['Approved', 'approved'],
      ['Rejected', 'rejected'],
      ['Published', 'published'],
    ], 'Publishing tools require an approved proposal.'), { default_value: 'proposed' }],
    ['proposal', 'json'],
    ['guardrail', 'json'],
    ['tenant_release', 'json'],
    ['brand_contract_version', 'string'],
    ['branch_or_change_id', 'string'],
    ['validation_summary', 'json'],
    ['preview_url', 'string'],
    ['approval', 'json'],
  ], { icon: 'approval', displayTemplate: '{{component_key}} · {{status}}' });
  await ensureProposalTenantOwnership();

  await ensureContentCollection('site_pages', [
    ['tenant', 'string'],
    ['path', 'string', {}, { is_nullable: false }],
    ['canonical_path', 'string'],
    ['status', 'string'],
    ['page_type', 'string'],
    ['title', 'string', {}, { is_nullable: false }],
    ['seo_title', 'string'],
    ['description', 'text'],
    ['priority', 'decimal'],
    ['change_frequency', 'string'],
    ['sort', 'integer'],
  ], { icon: 'web', displayTemplate: '{{path}} - {{title}}' });

  await ensureContentCollection('navigation_items', [
    ['tenant', 'string'],
    ['menu', 'string', {}, { is_nullable: false }],
    ['href', 'string', {}, { is_nullable: false }],
    ['label', 'string', {}, { is_nullable: false }],
    ['sort', 'integer'],
  ], { icon: 'menu', displayTemplate: '{{menu}} - {{label}}' });
}

function baseBlockFields(extraFields = []) {
  return [
    ['tenant', 'string'],
    ['status', 'string'],
    ['key', 'string'],
    ['eyebrow', 'string'],
    ['title', 'text'],
    ['dek', 'text'],
    ['theme', 'string'],
    ...extraFields,
  ];
}

function choiceField(choices, note) {
  return {
    interface: 'select-dropdown',
    note,
    options: {
      choices: choices.map(([text, value]) => ({ text, value })),
    },
  };
}

async function ensureBlockCollections() {
  for (const component of APPROVED_COMPONENTS.filter(({ collection }) => LEGACY_BLOCK_COLLECTIONS.has(collection))) {
    const fields = component.directusFields.map((field) => {
      const meta = {};
      if (field.choices) Object.assign(meta, choiceField(field.choices, field.note));
      if (field.interface) meta.interface = field.interface;
      if (field.note && !field.choices) meta.note = field.note;
      if (field.listFields) {
        meta.options = {
          fields: field.listFields.map((listField) => ({
            field: listField.field,
            name: listField.name,
            type: listField.type,
            meta: {
              interface: listField.interface,
              required: Boolean(listField.required),
            },
          })),
          template: '{{image_alt}}',
        };
      }
      const schema = {};
      if (field.required) schema.is_nullable = false;
      if (field.default !== undefined) schema.default_value = field.default;
      return [field.name, field.type, meta, schema];
    });

    await ensureContentCollection(
      component.collection,
      baseBlockFields(fields),
      { icon: component.icon, displayTemplate: component.displayTemplate },
    );
  }
}

async function ensurePageBuilderField() {
  const builderCollections = APPROVED_COMPONENT_COLLECTIONS
    .filter((collection) => LEGACY_BLOCK_COLLECTIONS.has(collection));
  await ensureAliasField('site_pages', 'blocks', {
    interface: 'list-m2a',
    special: ['m2a'],
    options: {
      collections: builderCollections,
    },
    display: 'related-values',
    display_options: {
      template: '{{item.title}}',
    },
    width: 'full',
  });

  await ensureContentCollection('site_pages_blocks', [
    ['site_pages_id', 'integer', { interface: 'select-dropdown-m2o', special: ['m2o'], hidden: true }, { foreign_key_table: 'site_pages', foreign_key_column: 'id' }],
    ['collection', 'string', { interface: 'select-dropdown', special: ['m2a'], hidden: true }],
    ['item', 'string', { interface: 'input', special: ['m2a'], hidden: true }],
    ['sort', 'integer', { interface: 'input', hidden: true }],
    ['slot', 'string', choiceField(
      COMPONENT_SLOTS.map(({ label, value }) => [label, value]),
      'Places this block into a controlled template region.',
    ), { default_value: 'main' }],
  ], { icon: 'link', displayTemplate: '{{collection}} {{item}}' });

  await ensureRelation({
    collection: 'site_pages_blocks',
    field: 'site_pages_id',
    related_collection: 'site_pages',
    schema: {
      table: 'site_pages_blocks',
      column: 'site_pages_id',
      foreign_key_table: 'site_pages',
      foreign_key_column: 'id',
      on_delete: 'CASCADE',
    },
    meta: {
      many_collection: 'site_pages_blocks',
      many_field: 'site_pages_id',
      one_collection: 'site_pages',
      one_field: 'blocks',
      one_collection_field: 'collection',
      one_allowed_collections: builderCollections,
      junction_field: 'item',
      sort_field: 'sort',
      one_deselect_action: 'delete',
    },
  });
}

async function main() {
  token = await resolveAdminToken();
  await ensureCoreCollections();
  await ensureBlockCollections();
  await ensurePageBuilderField();
  await ensureTenant();

  await Promise.all([
    ensureGenericPage('/', 'home', 'Made With These Hands', 10),
    ensureGenericPage('/objects', 'objects_index', 'Objects', 20),
    ensureGenericPage('/about', 'about', 'Hugh McNeill', 30),
    ensureGenericPage('/makers', 'makers_index', 'Makers', 40),
    ensureGenericPage('/podcast', 'podcast_index', 'Field Recordings', 50),
    ensureGenericPage('/journal', 'journal_index', 'Journal', 60),
    ensureGenericPage('/contact', 'contact', 'Contact', 70),
    ensureGenericPage('/brand', 'brand_book', 'Brand Book', 80),
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
    ['podcast_guid', 'string'],
    ['podcast_source_url', 'string'],
    ['podcast_feed_url', 'string'],
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
    ['spacing', 'string', choiceField([
      ['Compact', 'compact'],
      ['Standard', 'standard'],
      ['Generous', 'generous'],
    ], 'Approved brand density. Raw CSS and numeric spacing are not accepted.'), { default_value: 'standard' }],
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
