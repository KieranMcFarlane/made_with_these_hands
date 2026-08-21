#!/usr/bin/env node

import assert from 'node:assert/strict';

const directusUrl = process.env.DIRECTUS_URL || 'https://cms.nakanodigital.com';
const token = process.env.DIRECTUS_MCP_TOKEN || process.env.DIRECTUS_STATIC_TOKEN;
const tenant = process.env.DIRECTUS_TENANT_VALUE || 'made-with-these-hands';

assert.ok(token, 'DIRECTUS_MCP_TOKEN or DIRECTUS_STATIC_TOKEN is required.');

async function records(collection, fields) {
  const query = new URLSearchParams({ fields: fields.join(','), limit: '-1' });
  const response = await fetch(`${directusUrl}/items/${collection}?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await response.json().catch(() => null);
  assert.ok(response.ok, body?.errors?.[0]?.message || `Cannot read ${collection}.`);
  return body.data;
}

function missing(record, fields) {
  return fields.filter((field) => {
    const value = record[field];
    return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
  });
}

const [tenants, pages, makers, episodes, products, posts] = await Promise.all([
  records('tenants', ['slug', 'status', 'name', 'email', 'phone', 'location', 'site_url']),
  records('site_pages', ['id', 'path', 'status', 'page_type', 'title', 'seo_title', 'description', 'source', 'blocks']),
  records('makers', ['slug', 'status', 'name', 'dek', 'bio', 'image', 'hero_image', 'practice', 'seo_title', 'seo_description']),
  records('episodes', ['number', 'slug', 'status', 'title', 'guest', 'maker', 'summary', 'body', 'audio_url', 'transcript', 'transcript_url', 'podcast_guid', 'podcast_source_url', 'seo_title', 'seo_description']),
  records('products', ['slug', 'status', 'name', 'maker', 'summary', 'description', 'image', 'gallery', 'enquiry_enabled', 'seo_title', 'seo_description']),
  records('posts', ['slug', 'status', 'title', 'dek', 'body', 'image', 'seo_title', 'seo_description']),
]);

const expectedPages = ['/', '/makers', '/objects', '/about', '/podcast', '/journal', '/contact'];
const publishedPaths = new Set(pages.filter(({ status }) => status === 'published').map(({ path }) => path));
const importedEpisodes = episodes.filter(({ podcast_guid }) => podcast_guid);
const demoEpisodes = episodes.filter(({ podcast_guid }) => !podcast_guid);
const report = {
  ok: true,
  tenant,
  tenant_profile: tenants.map((record) => ({ slug: record.slug, missing: missing(record, ['name', 'email', 'location', 'site_url']), optional_missing: missing(record, ['phone']) })),
  navigation_pages: {
    expected: expectedPages.length,
    present: expectedPages.filter((path) => publishedPaths.has(path)),
    missing: expectedPages.filter((path) => !publishedPaths.has(path)),
  },
  owner_acceptance: pages.filter(({ path }) => path === '/owner-acceptance').map(({ id, status, blocks }) => ({ id, status, blocks: blocks?.length || 0 })),
  discovery_drafts: pages.filter(({ source }) => source === 'nakano-design-discovery').map(({ id, path, status }) => ({ id, path, status })),
  makers: makers.map((record) => ({ slug: record.slug, status: record.status, missing: missing(record, ['bio', 'image', 'seo_title', 'seo_description']) })),
  products: products.map((record) => ({ slug: record.slug, status: record.status, enquiry_enabled: record.enquiry_enabled, missing: missing(record, ['summary', 'description', 'image', 'seo_title', 'seo_description']) })),
  posts: posts.map((record) => ({ slug: record.slug, status: record.status, missing: missing(record, ['image', 'seo_title', 'seo_description']) })),
  podcast: {
    total: episodes.length,
    rss_imported_drafts: importedEpisodes.length,
    demo_records: demoEpisodes.length,
    imported_missing: importedEpisodes.map((record) => ({ number: record.number, missing: missing(record, ['guest', 'maker', 'transcript']) })),
  },
  owner_supplied_required: [
    'Confirm which demo makers, objects, posts, and episode pages represent real publishable content.',
    'Approve guest-to-maker matching and craft categories for RSS-imported episodes.',
    'Supply or approve transcripts where none are present in the RSS feed.',
    'Supply final maker portraits and object photography where the CMS has no approved image.',
    'Confirm product descriptions, availability, prices, and enquiry wording.',
    'Confirm the enquiry recipient and provide production Resend configuration.',
  ],
};

console.log(JSON.stringify(report, null, 2));
