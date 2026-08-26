#!/usr/bin/env node

import assert from 'node:assert/strict';
import { convert } from 'html-to-text';
import { XMLParser } from 'fast-xml-parser';

const feedUrl = process.env.MWTH_PODCAST_FEED_URL || 'https://feed.podbean.com/hughmn/feed.xml';
const directusUrl = process.env.DIRECTUS_URL || 'https://cms.nakanodigital.com';
const token = process.env.DIRECTUS_ADMIN_TOKEN;
const tenant = process.env.DIRECTUS_TENANT_VALUE || 'made-with-these-hands';
const apply = process.argv.includes('--apply');

assert.ok(!apply || token, 'DIRECTUS_ADMIN_TOKEN is required with --apply.');

function list(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function plainText(value) {
  return convert(String(value || ''), {
    wordwrap: false,
    selectors: [
      { selector: 'a', options: { ignoreHref: true } },
      { selector: 'img', format: 'skip' },
    ],
  }).replace(/\n{3,}/g, '\n\n').trim();
}

function slugFromLink(link, number) {
  try {
    const parts = new URL(link).pathname.split('/').filter(Boolean);
    const episodeIndex = parts.indexOf('e');
    if (episodeIndex >= 0 && parts[episodeIndex + 1]) return parts[episodeIndex + 1];
  } catch {
    // The source GUID remains the canonical sync key when a link is malformed.
  }
  return `podcast-${number}`;
}

function durationLabel(seconds) {
  const total = Number(seconds);
  if (!Number.isFinite(total) || total <= 0) return '';
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainder = total % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}` : `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function episodeFromItem(item, position) {
  const number = String(item['itunes:episode'] || position);
  const summary = plainText(item['itunes:summary'] || item.description || item['content:encoded']);
  const body = plainText(item['content:encoded'] || item.description)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const date = new Date(item.pubDate);
  const sourceUrl = String(item.link || '');
  return {
    tenant,
    number,
    slug: slugFromLink(sourceUrl, number),
    status: 'draft',
    title: String(item['itunes:title'] || item.title || `Podcast episode ${number}`),
    duration: durationLabel(item['itunes:duration']),
    date: Number.isNaN(date.valueOf()) ? null : date.toISOString().slice(0, 10),
    summary,
    body,
    audio_url: String(item.enclosure?.['@_url'] || ''),
    transcript: null,
    transcript_url: null,
    podcast_guid: String(typeof item.guid === 'object' ? item.guid['#text'] : item.guid || ''),
    podcast_source_url: sourceUrl,
    podcast_feed_url: feedUrl,
    seo_title: String(item['itunes:title'] || item.title || `Podcast episode ${number}`),
    seo_description: summary.slice(0, 160),
  };
}

async function directus(pathname, options = {}) {
  const response = await fetch(`${directusUrl}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.errors?.[0]?.message || `${options.method || 'GET'} ${pathname} failed`);
  return body?.data;
}

async function ensureSourceFields() {
  const fields = await directus('/fields/episodes');
  const existing = new Set(fields.map(({ field }) => field));
  for (const [field, note] of [
    ['podcast_guid', 'Stable RSS GUID used for idempotent imports.'],
    ['podcast_source_url', 'Canonical public episode URL from the podcast feed.'],
    ['podcast_feed_url', 'RSS source used for this imported episode.'],
  ]) {
    if (existing.has(field)) continue;
    await directus('/fields/episodes', {
      method: 'POST',
      body: JSON.stringify({ field, type: 'string', meta: { interface: 'input', note } }),
    });
  }
}

const feedResponse = await fetch(feedUrl);
assert.ok(feedResponse.ok, `Podcast feed returned ${feedResponse.status}.`);
const parsed = new XMLParser({ ignoreAttributes: false, trimValues: true }).parse(await feedResponse.text());
const sourceItems = list(parsed?.rss?.channel?.item);
const episodes = sourceItems.map((item, index) => episodeFromItem(item, sourceItems.length - index));
assert.ok(episodes.length > 0, 'Podcast feed contains no episodes.');
assert.ok(episodes.every(({ podcast_guid, audio_url }) => podcast_guid && audio_url), 'Every imported episode requires a GUID and audio enclosure.');

if (!apply) {
  console.log(JSON.stringify({
    ok: true,
    mode: 'dry-run',
    feed: feedUrl,
    episodes_found: episodes.length,
    newest: episodes[0]?.title,
    will_publish: false,
  }, null, 2));
  process.exit(0);
}

await ensureSourceFields();
const existing = await directus(`/items/episodes?${new URLSearchParams({ fields: 'id,podcast_guid,status', limit: '-1' })}`);
const byGuid = new Map(existing.filter(({ podcast_guid: guid }) => guid).map((record) => [record.podcast_guid, record]));
let created = 0;
let updated = 0;
for (const episode of episodes) {
  const record = byGuid.get(episode.podcast_guid);
  if (record) {
    const { status: _status, ...changes } = episode;
    await directus(`/items/episodes/${record.id}`, { method: 'PATCH', body: JSON.stringify(changes) });
    updated += 1;
  } else {
    await directus('/items/episodes', { method: 'POST', body: JSON.stringify(episode) });
    created += 1;
  }
}

console.log(JSON.stringify({
  ok: true,
  mode: 'apply',
  feed: feedUrl,
  episodes_found: episodes.length,
  created,
  updated,
  published: 0,
}, null, 2));
