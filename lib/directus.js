import { createDirectus, createItem, readItems, rest, staticToken } from '@directus/sdk';
import { APPROVED_COMPONENT_COLLECTIONS } from '../component-system/components.mjs';
import { brandFromRecords } from './brand-settings.mjs';

const DEFAULT_COLLECTIONS = {
  makers: 'makers',
  products: 'products',
  episodes: 'episodes',
  posts: 'posts',
  comments: 'comments',
  sections: 'site_sections',
  pages: 'site_pages',
  pageBlocks: 'site_pages_blocks',
  brand: 'brand_settings',
  componentRegistry: 'component_registry',
};

const PAGE_BLOCK_COLLECTIONS = new Set(APPROVED_COMPONENT_COLLECTIONS);

function tenantFilter() {
  if (!process.env.DIRECTUS_TENANT_FIELD || !process.env.DIRECTUS_TENANT_VALUE) return undefined;
  return {
    [process.env.DIRECTUS_TENANT_FIELD]: {
      _eq: process.env.DIRECTUS_TENANT_VALUE,
    },
  };
}

function directusAssetUrl(file) {
  if (!file || !process.env.DIRECTUS_URL) return null;
  if (typeof file === 'string') {
    if (file.startsWith('http://') || file.startsWith('https://') || file.startsWith('/')) return file;
    return `/api/assets/${file}`;
  }
  if (typeof file === 'object' && file.id) {
    return `/api/assets/${file.id}`;
  }
  return null;
}

function firstValue(item, keys, fallback = '') {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null && item[key] !== '') return item[key];
  }
  return fallback;
}

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizePractice(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(/\n{2,}|\r?\n/)
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return [];
}

function makerSlugFromValue(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return firstValue(value, ['slug', 'id', 'name']);
}

function normalizeMaker(item) {
  const name = firstValue(item, ['name', 'title']);
  const craft = firstValue(item, ['craft', 'craft_name', 'category']);

  return {
    slug: firstValue(item, ['slug'], toSlug(name)),
    name,
    craft,
    place: firstValue(item, ['place', 'location']),
    established: String(firstValue(item, ['established', 'year_established'], '')),
    image: directusAssetUrl(firstValue(item, ['image', 'hero_image', 'portrait'], null)),
    heroLabel: firstValue(item, ['heroLabel', 'hero_label', 'image_alt'], name),
    dek: firstValue(item, ['dek', 'description', 'summary']),
    practiceTitle: firstValue(item, ['practiceTitle', 'practice_title'], ''),
    practice: normalizePractice(firstValue(item, ['practice', 'body'], [])),
  };
}

function normalizeProduct(item) {
  const name = firstValue(item, ['name', 'title']);
  const craft = firstValue(item, ['craft', 'craft_name', 'category']);
  const price = firstValue(item, ['price', 'formatted_price'], '');

  return {
    slug: firstValue(item, ['slug'], toSlug(name)),
    name,
    maker: makerSlugFromValue(firstValue(item, ['maker', 'maker_slug'])),
    craft,
    price: typeof price === 'number' ? `£${price}` : String(price),
    place: firstValue(item, ['place', 'location']),
    image: directusAssetUrl(firstValue(item, ['image', 'product_image'], null)),
    meta: firstValue(item, ['meta', 'subtitle', 'description']),
  };
}

function normalizeEpisode(item) {
  const guest = firstValue(item, ['guest', 'name', 'title']);

  return {
    number: String(firstValue(item, ['number', 'episode_number'], '')),
    slug: firstValue(item, ['slug'], toSlug(firstValue(item, ['title', 'name'], guest))),
    maker: makerSlugFromValue(firstValue(item, ['maker', 'maker_slug'])),
    guest,
    title: firstValue(item, ['title', 'name']),
    craft: firstValue(item, ['craft', 'craft_name', 'category']),
    place: firstValue(item, ['place', 'location']),
    duration: firstValue(item, ['duration']),
    date: firstValue(item, ['date', 'published_date', 'publish_date']),
    audioUrl: firstValue(item, ['audioUrl', 'audio_url', 'audio'], ''),
    transcriptUrl: firstValue(item, ['transcriptUrl', 'transcript_url'], ''),
    body: normalizePractice(firstValue(item, ['body', 'description', 'summary'], [])),
    chapters: Array.isArray(item.chapters) ? item.chapters : [],
  };
}

function normalizePost(item) {
  const title = firstValue(item, ['title', 'name']);
  return {
    slug: firstValue(item, ['slug'], toSlug(title)),
    title,
    dek: firstValue(item, ['dek', 'description', 'summary'], ''),
    date: firstValue(item, ['date', 'published_date', 'publish_date'], ''),
    author: firstValue(item, ['author', 'byline'], 'Hugh McNeill'),
    category: firstValue(item, ['category', 'section'], 'Dispatch'),
    image: directusAssetUrl(firstValue(item, ['image', 'hero_image'], null)),
    body: normalizePractice(firstValue(item, ['body', 'content'], [])),
  };
}

function normalizeComment(item) {
  return {
    id: firstValue(item, ['id']),
    episode: firstValue(item, ['episode', 'episode_number', 'episode_slug']),
    name: firstValue(item, ['name']),
    body: firstValue(item, ['body', 'comment', 'message']),
    date: firstValue(item, ['date_created', 'created_at', 'date'], ''),
  };
}

function normalizeSection(item) {
  const key = firstValue(item, ['key', 'slug']);
  if (!key) return null;

  const section = {
    key,
    label: firstValue(item, ['label'], ''),
    eyebrow: firstValue(item, ['eyebrow'], ''),
    title: firstValue(item, ['title', 'heading'], ''),
    dek: firstValue(item, ['dek', 'description', 'summary'], ''),
    body: normalizePractice(firstValue(item, ['body', 'content'], [])),
    image: directusAssetUrl(firstValue(item, ['image', 'hero_image'], null)),
    imageAlt: firstValue(item, ['imageAlt', 'image_alt', 'image_label'], ''),
    imageCaption: firstValue(item, ['imageCaption', 'image_caption'], ''),
    quote: firstValue(item, ['quote'], ''),
    ctaLabel: firstValue(item, ['ctaLabel', 'cta_label'], ''),
    ctaHref: firstValue(item, ['ctaHref', 'cta_href'], ''),
    secondaryCtaLabel: firstValue(item, ['secondaryCtaLabel', 'secondary_cta_label'], ''),
    secondaryCtaHref: firstValue(item, ['secondaryCtaHref', 'secondary_cta_href'], ''),
    meta: firstValue(item, ['meta'], ''),
  };

  const extra = firstValue(item, ['extra', 'settings'], null);
  if (extra && typeof extra === 'object' && !Array.isArray(extra)) {
    Object.assign(section, extra);
  }

  return [key, section];
}

function normalizeSections(items) {
  const sections = {};
  for (const item of items) {
    const pair = normalizeSection(item);
    if (pair) sections[pair[0]] = pair[1];
  }
  return sections;
}

function m2aCollectionName(block) {
  return firstValue(block, ['collection'], '').replace(/^directus_collection_/, '');
}

function m2aItem(block) {
  const collection = m2aCollectionName(block);
  if (block.item && typeof block.item === 'object' && !Array.isArray(block.item)) return block.item;
  if (collection && block[`${collection}_id`] && typeof block[`${collection}_id`] === 'object') return block[`${collection}_id`];
  return null;
}

function normalizeBlock(block) {
  if (!block || typeof block !== 'object') return null;

  const collection = m2aCollectionName(block);
  const item = m2aItem(block);
  if (!item) return null;

  const type = firstValue(item, ['block_type', 'type'], collection.replace(/^block_/, ''));
  const sectionPair = normalizeSection({
    ...item,
    key: firstValue(item, ['key', 'slug'], firstValue(block, ['key', 'slug'], '')),
    label: firstValue(item, ['label'], type),
  });

  return {
    id: firstValue(block, ['id'], firstValue(item, ['id'], '')),
    collection,
    type,
    sort: firstValue(block, ['sort'], firstValue(item, ['sort'], 0)),
    slot: firstValue(block, ['slot'], 'main'),
    item,
    section: sectionPair ? sectionPair[1] : null,
  };
}

function normalizePage(item) {
  const blocks = Array.isArray(item.blocks)
    ? item.blocks.map(normalizeBlock).filter(Boolean).sort((a, b) => a.sort - b.sort)
    : [];
  const path = firstValue(item, ['path', 'canonical_path', 'slug'], '');

  return {
    id: firstValue(item, ['id'], ''),
    status: firstValue(item, ['status'], ''),
    slug: firstValue(item, ['slug'], toSlug(path || firstValue(item, ['title'], ''))),
    path,
    canonicalPath: firstValue(item, ['canonical_path'], path),
    type: firstValue(item, ['page_type', 'type'], ''),
    title: firstValue(item, ['title', 'name'], ''),
    seoTitle: firstValue(item, ['seo_title'], ''),
    description: firstValue(item, ['description', 'seo_description'], ''),
    blocks,
  };
}

function normalizePages(items) {
  return items.map(normalizePage).filter((page) => page.path || page.slug || page.title);
}

function sectionsFromPages(pages) {
  const sections = {};
  for (const page of pages) {
    for (const block of page.blocks) {
      if (block.section?.key) sections[block.section.key] = block.section;
    }
  }
  return sections;
}

async function readOptionalItems(client, collection, query) {
  try {
    return await client.request(readItems(collection, query));
  } catch (error) {
    console.warn(`Skipping optional Directus collection "${collection}"`, error);
    return [];
  }
}

async function hydratePageBlocks(client, page) {
  if (!page || !Array.isArray(page.blocks)) return page;

  const groupedIds = new Map();
  for (const block of page.blocks) {
    const collection = m2aCollectionName(block);
    if (!PAGE_BLOCK_COLLECTIONS.has(collection) || !block.item || typeof block.item === 'object') continue;
    if (!groupedIds.has(collection)) groupedIds.set(collection, new Set());
    groupedIds.get(collection).add(String(block.item));
  }

  const entries = await Promise.all(
    [...groupedIds.entries()].map(async ([collection, ids]) => {
      const items = await readOptionalItems(client, collection, {
        fields: ['*'],
        filter: {
          _and: [
            tenantFilter(),
            { status: { _eq: 'published' } },
            { id: { _in: [...ids] } },
          ].filter(Boolean),
        },
        limit: -1,
      });
      return [collection, new Map(items.map((item) => [String(item.id), item]))];
    }),
  );
  const itemsByCollection = new Map(entries);

  return {
    ...page,
    blocks: page.blocks.map((block) => {
      const collection = m2aCollectionName(block);
      const item = itemsByCollection.get(collection)?.get(String(block.item));
      return item ? { ...block, item } : block;
    }),
  };
}

export function hasDirectusConfig() {
  return Boolean(process.env.DIRECTUS_URL);
}

export function getDirectusClient() {
  if (!hasDirectusConfig()) return null;

  const base = createDirectus(process.env.DIRECTUS_URL);
  if (process.env.DIRECTUS_STATIC_TOKEN) {
    return base.with(staticToken(process.env.DIRECTUS_STATIC_TOKEN)).with(rest());
  }
  return base.with(rest());
}

export async function getMwthBrandSettings() {
  const client = getDirectusClient();
  if (!client) return brandFromRecords();

  const records = await readOptionalItems(client, DEFAULT_COLLECTIONS.brand, {
    fields: ['setting_key', 'value'],
    filter: tenantFilter(),
    limit: -1,
  });

  return brandFromRecords(records);
}

export async function getMwthComponentRegistry() {
  const client = getDirectusClient();
  if (!client) return [];

  return readOptionalItems(client, DEFAULT_COLLECTIONS.componentRegistry, {
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
    ],
    filter: { status: { _eq: 'approved' } },
    sort: ['key'],
    limit: -1,
  });
}

export async function getMwthComponentUsage() {
  const client = getDirectusClient();
  if (!client) return {};

  const blocks = await readOptionalItems(client, DEFAULT_COLLECTIONS.pageBlocks, {
    fields: ['collection', 'site_pages_id', 'slot'],
    limit: -1,
  });
  const pageIds = [...new Set(blocks.map(({ site_pages_id }) => Number(site_pages_id)).filter(Boolean))];
  if (!pageIds.length) return {};

  const pages = await readOptionalItems(client, DEFAULT_COLLECTIONS.pages, {
    fields: ['id', 'path', 'title'],
    filter: {
      _and: [
        tenantFilter(),
        { id: { _in: pageIds } },
        { status: { _eq: 'published' } },
      ].filter(Boolean),
    },
    limit: -1,
  });
  const pagesById = new Map(pages.map((page) => [Number(page.id), page]));

  return blocks.reduce((usage, block) => {
    const page = pagesById.get(Number(block.site_pages_id));
    if (!page || !block.collection) return usage;
    const entry = { path: page.path, title: page.title, slot: block.slot || 'main' };
    const current = usage[block.collection] || [];
    if (!current.some((item) => item.path === entry.path && item.slot === entry.slot)) current.push(entry);
    usage[block.collection] = current;
    return usage;
  }, {});
}

export async function getMwthPage(path) {
  const client = getDirectusClient();
  if (!client || !path) return null;

  const pages = await readOptionalItems(client, DEFAULT_COLLECTIONS.pages, {
    fields: ['*', 'blocks.*'],
    filter: {
      _and: [
        tenantFilter(),
        { path: { _eq: path } },
        { status: { _eq: 'published' } },
      ].filter(Boolean),
    },
    limit: 1,
  });

  return pages[0] ? normalizePage(await hydratePageBlocks(client, pages[0])) : null;
}

export async function getMwthSitemapPages() {
  const client = getDirectusClient();
  if (!client) return [];

  const pages = await readOptionalItems(client, DEFAULT_COLLECTIONS.pages, {
    fields: ['path', 'canonical_path', 'priority', 'change_frequency'],
    filter: {
      _and: [
        tenantFilter(),
        { status: { _eq: 'published' } },
      ].filter(Boolean),
    },
    limit: -1,
  });

  return pages
    .map((page) => ({
      path: firstValue(page, ['canonical_path', 'path'], ''),
      priority: Number(firstValue(page, ['priority'], 0.7)),
      changeFrequency: firstValue(page, ['change_frequency'], 'monthly'),
      lastModified: '',
    }))
    .filter((page) => page.path);
}

export async function getMwthDirectusData() {
  const client = getDirectusClient();
  if (!client) return null;
  const filter = tenantFilter();
  const publishedFilter = {
    _and: [
      filter,
      { status: { _eq: 'published' } },
    ].filter(Boolean),
  };

  const collections = {
    makers: process.env.DIRECTUS_MAKERS_COLLECTION || DEFAULT_COLLECTIONS.makers,
    products: process.env.DIRECTUS_PRODUCTS_COLLECTION || DEFAULT_COLLECTIONS.products,
    episodes: process.env.DIRECTUS_EPISODES_COLLECTION || DEFAULT_COLLECTIONS.episodes,
    posts: process.env.DIRECTUS_POSTS_COLLECTION || DEFAULT_COLLECTIONS.posts,
    sections: process.env.DIRECTUS_SECTIONS_COLLECTION || DEFAULT_COLLECTIONS.sections,
    pages: process.env.DIRECTUS_PAGES_COLLECTION || DEFAULT_COLLECTIONS.pages,
    brand: DEFAULT_COLLECTIONS.brand,
  };

  const [makers, products, episodes, posts, sections, pages, brandRecords] = await Promise.all([
    client.request(readItems(collections.makers, { fields: ['*'], filter: publishedFilter, limit: -1 })),
    client.request(readItems(collections.products, { fields: ['*'], filter: publishedFilter, limit: -1 })),
    client.request(readItems(collections.episodes, { fields: ['*'], filter: publishedFilter, limit: -1 })),
    readOptionalItems(client, collections.posts, { fields: ['*'], filter: publishedFilter, limit: -1 }),
    readOptionalItems(client, collections.sections, { fields: ['*'], filter, limit: -1 }),
    readOptionalItems(client, collections.pages, { fields: ['*', 'blocks.*'], filter: publishedFilter, limit: -1 }),
    readOptionalItems(client, collections.brand, { fields: ['setting_key', 'value'], filter, limit: -1 }),
  ]);

  const hydratedPages = await Promise.all(pages.map((page) => hydratePageBlocks(client, page)));
  const normalizedPages = normalizePages(hydratedPages);

  return {
    makers: makers.map(normalizeMaker).filter((maker) => maker.slug && maker.name),
    products: products.map(normalizeProduct).filter((product) => product.slug && product.name),
    episodes: episodes.map(normalizeEpisode).filter((episode) => episode.number || episode.title),
    posts: posts.map(normalizePost).filter((post) => post.slug && post.title),
    site: {
      sections: {
        ...normalizeSections(sections),
        ...sectionsFromPages(normalizedPages),
      },
      pages: normalizedPages,
      brand: brandFromRecords(brandRecords),
    },
  };
}

export async function getEpisodeComments(episode) {
  const client = getDirectusClient();
  if (!client || !episode) return [];

  const collection = process.env.DIRECTUS_COMMENTS_COLLECTION || DEFAULT_COLLECTIONS.comments;
  const episodeField = process.env.DIRECTUS_COMMENTS_EPISODE_FIELD || 'episode';
  const statusFilter = process.env.DIRECTUS_COMMENTS_STATUS_FIELD
    ? { [process.env.DIRECTUS_COMMENTS_STATUS_FIELD]: { _eq: process.env.DIRECTUS_COMMENTS_STATUS_VALUE || 'approved' } }
    : undefined;
  const filter = {
    _and: [
      { [episodeField]: { _eq: episode } },
      tenantFilter(),
      statusFilter,
    ].filter(Boolean),
  };

  const comments = await readOptionalItems(client, collection, {
    fields: ['*'],
    filter,
    limit: 100,
  });

  return comments.map(normalizeComment).filter((comment) => comment.name && comment.body);
}

export async function createEpisodeComment(payload) {
  const client = getDirectusClient();
  if (!client) throw new Error('Directus is not configured');

  const collection = process.env.DIRECTUS_COMMENTS_COLLECTION || DEFAULT_COLLECTIONS.comments;
  const episodeField = process.env.DIRECTUS_COMMENTS_EPISODE_FIELD || 'episode';
  const comment = {
    [episodeField]: String(payload.episode || '').trim(),
    name: String(payload.name || '').trim(),
    email: String(payload.email || '').trim(),
    body: String(payload.body || '').trim(),
  };

  if (process.env.DIRECTUS_TENANT_FIELD && process.env.DIRECTUS_TENANT_VALUE) {
    comment[process.env.DIRECTUS_TENANT_FIELD] = process.env.DIRECTUS_TENANT_VALUE;
  }
  if (process.env.DIRECTUS_COMMENTS_STATUS_FIELD) {
    comment[process.env.DIRECTUS_COMMENTS_STATUS_FIELD] = process.env.DIRECTUS_COMMENTS_DEFAULT_STATUS || 'pending';
  }

  return client.request(createItem(collection, comment));
}

export async function createProductEnquiry(payload) {
  const client = getDirectusClient();
  if (!client) return null;

  const enquiry = {
    tenant: process.env.DIRECTUS_TENANT_VALUE || 'made-with-these-hands',
    status: 'new',
    product: String(payload.productSlug || payload.product || '').trim(),
    product_name: String(payload.productName || '').trim(),
    maker_name: String(payload.makerName || '').trim(),
    name: String(payload.name || '').trim(),
    email: String(payload.email || '').trim(),
    phone: String(payload.phone || '').trim(),
    message: String(payload.message || '').trim(),
  };

  return client.request(createItem(process.env.DIRECTUS_ENQUIRIES_COLLECTION || 'enquiries', enquiry));
}
