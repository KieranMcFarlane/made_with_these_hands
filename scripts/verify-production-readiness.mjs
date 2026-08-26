#!/usr/bin/env node

import assert from 'node:assert/strict';
import { Resend } from 'resend';

const directusUrl = String(process.env.DIRECTUS_URL || 'https://cms.nakanodigital.com').replace(/\/$/, '');
const token = process.env.DIRECTUS_MCP_TOKEN || process.env.DIRECTUS_STATIC_TOKEN;
const tenant = process.env.DIRECTUS_TENANT_VALUE || 'made-with-these-hands';
const sendTest = process.argv.includes('--send-test-enquiry');

assert.ok(token, 'DIRECTUS_MCP_TOKEN or DIRECTUS_STATIC_TOKEN is required.');

async function records(collection, fields, filter) {
  const query = new URLSearchParams({ fields: fields.join(','), limit: '-1' });
  if (filter) query.set('filter', JSON.stringify(filter));
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

function address(value) {
  return String(value || '').match(/<([^>]+)>/)?.[1] || String(value || '').trim();
}

function emailValid(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address(value));
}

function maskEmail(value) {
  const email = address(value);
  if (!emailValid(email)) return 'not configured';
  const [name, domain] = email.split('@');
  return `${name.slice(0, 2)}***@${domain}`;
}

const tenantFilter = { tenant: { _eq: tenant } };
const [pages, junctions, sections, textBlocks, episodes, makers, products, posts] = await Promise.all([
  records('site_pages', ['id', 'path', 'status'], tenantFilter),
  records('site_pages_blocks', ['id', 'site_pages_id', 'collection', 'item', 'sort', 'slot']),
  records('site_sections', ['id', 'component_key', 'data'], tenantFilter),
  records('block_text', ['id', 'key', 'dek', 'body'], tenantFilter),
  records('episodes', ['id', 'number', 'slug', 'status', 'podcast_guid', 'guest', 'maker', 'summary', 'body', 'audio_url', 'transcript', 'transcript_url', 'seo_title', 'seo_description'], tenantFilter),
  records('makers', ['id', 'slug', 'status', 'dek', 'bio', 'image', 'hero_image', 'seo_title', 'seo_description'], tenantFilter),
  records('products', ['id', 'slug', 'status', 'summary', 'description', 'image', 'gallery', 'enquiry_enabled', 'seo_title', 'seo_description'], tenantFilter),
  records('posts', ['id', 'slug', 'status', 'dek', 'body', 'image', 'seo_title', 'seo_description'], tenantFilter),
]);

const acceptancePage = pages.find(({ path }) => path === '/owner-acceptance');
const acceptanceBlocks = junctions
  .filter(({ site_pages_id }) => String(site_pages_id) === String(acceptancePage?.id))
  .sort((a, b) => Number(a.sort) - Number(b.sort));
const sectionById = new Map(sections.map((section) => [String(section.id), section]));
const acceptanceBlockDetails = acceptanceBlocks.map((junction) => {
  const section = junction.collection === 'site_sections' ? sectionById.get(String(junction.item)) : null;
  return {
    ...junction,
    componentKey: section?.component_key || junction.collection,
    data: section?.data || null,
  };
});
const acceptanceTextJunction = acceptanceBlockDetails.find(({ componentKey }) => componentKey === 'block_text');
const acceptanceText = acceptanceTextJunction?.data
  || textBlocks.find(({ id }) => String(id) === String(acceptanceTextJunction?.item));
const untouchedAcceptance = acceptanceText?.dek === 'This draft has not yet been reviewed by Hugh.';
const acceptanceOrder = acceptanceBlockDetails.map(({ componentKey }) => componentKey);
const ownerReorderDetected = acceptanceOrder.join(',') === 'block_hero,block_text,block_cta';
const ownerEditDetected = Boolean(acceptancePage && acceptanceText && !untouchedAcceptance);

const importedEpisodes = episodes.filter(({ podcast_guid }) => podcast_guid);
const reviewGroups = [
  ['podcast', importedEpisodes, (record) => [
    ...missing(record, ['guest', 'maker', 'summary', 'audio_url', 'seo_title', 'seo_description']),
    ...(!record.transcript && !record.transcript_url ? ['transcript'] : []),
  ]],
  ['makers', makers, (record) => [
    ...missing(record, ['bio', 'seo_title', 'seo_description']),
    ...(!record.image && !record.hero_image ? ['image'] : []),
    ...(/awaiting owner review|draft guest record/i.test(`${record.bio || ''} ${record.dek || ''}`) ? ['owner_review'] : []),
  ]],
  ['objects', products, (record) => missing(record, ['summary', 'description', 'image', 'seo_title', 'seo_description'])],
  ['blog', posts, (record) => missing(record, ['dek', 'body', 'image', 'seo_title', 'seo_description'])],
];
const content = Object.fromEntries(reviewGroups.map(([name, items, gapsFor]) => {
  const incomplete = items
    .map((item) => ({ id: item.id, key: item.slug || item.number, missing: gapsFor(item) }))
    .filter(({ missing: gaps }) => gaps.length);
  return [name, {
    total: items.length,
    published: items.filter(({ status }) => status === 'published').length,
    drafts: items.filter(({ status }) => status !== 'published').length,
    complete: items.length - incomplete.length,
    incomplete,
  }];
}));

const resendConfigured = Boolean(process.env.RESEND_API_KEY)
  && emailValid(process.env.ENQUIRY_FROM_EMAIL)
  && emailValid(process.env.ENQUIRY_TO_EMAIL);
let resendDomain = { configured: resendConfigured, verified: false, domain: null };
if (resendConfigured) {
  const fromDomain = address(process.env.ENQUIRY_FROM_EMAIL).split('@')[1];
  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.domains.list();
  if (result.error) throw new Error(`Resend domain check failed: ${result.error.message}`);
  const domain = result.data?.data?.find(({ name }) => name === fromDomain);
  resendDomain = { configured: true, verified: domain?.status === 'verified', domain: fromDomain };

  if (sendTest) {
    assert.ok(resendDomain.verified, `Resend sender domain ${fromDomain} is not verified.`);
    const sent = await resend.emails.send({
      from: process.env.ENQUIRY_FROM_EMAIL,
      to: [process.env.ENQUIRY_TO_EMAIL],
      subject: 'Made With These Hands enquiry delivery test',
      text: 'This confirms that the production enquiry sender and Hugh recipient are configured. No customer enquiry was created.',
    });
    if (sent.error) throw new Error(`Resend test failed: ${sent.error.message}`);
    resendDomain.testSent = true;
    resendDomain.testId = sent.data?.id || null;
  }
}

const report = {
  ok: true,
  tenant,
  ownerAcceptance: {
    pageId: acceptancePage?.id || null,
    remainsDraft: acceptancePage?.status === 'draft',
    blockOrder: acceptanceOrder,
    ownerEditDetected,
    ownerReorderDetected,
    state: ownerEditDetected && ownerReorderDetected ? 'ready-for-owner-signoff' : 'awaiting-owner-acceptance',
  },
  content,
  enquiries: {
    apiKeyConfigured: Boolean(process.env.RESEND_API_KEY),
    sender: maskEmail(process.env.ENQUIRY_FROM_EMAIL),
    recipient: maskEmail(process.env.ENQUIRY_TO_EMAIL),
    ...resendDomain,
  },
  next: [
    !ownerEditDetected || !ownerReorderDetected ? 'Hugh must edit and reorder the owner-acceptance draft through Codex MCP.' : null,
    Object.values(content).some(({ incomplete }) => incomplete.length) ? 'Review and complete the listed content records before publishing.' : null,
    !resendConfigured ? 'Set the production Resend key, sender, and recipient.' : null,
    resendConfigured && !resendDomain.verified ? `Verify the Resend DNS records for ${resendDomain.domain} and rerun this check.` : null,
    resendDomain.verified && !sendTest ? 'Run with --send-test-enquiry once Hugh confirms the recipient address.' : null,
  ].filter(Boolean),
};

console.log(JSON.stringify(report, null, 2));
