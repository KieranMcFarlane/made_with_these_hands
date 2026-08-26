#!/usr/bin/env node

import assert from 'node:assert/strict';

const apply = process.argv.includes('--apply');
const directusUrl = String(process.env.DIRECTUS_URL || 'https://cms.nakanodigital.com').replace(/\/$/, '');
const tenant = process.env.DIRECTUS_TENANT_VALUE || 'made-with-these-hands';
let token;

const guestsByEpisode = new Map(Object.entries({
  1: 'Alison Kinnaird',
  2: 'Greg Dietrich',
  3: 'Dominic Fonde',
  4: 'Wayne Hart',
  5: 'Tom Vowden',
  6: 'Sue Burne',
  7: 'Ian Reeds',
  8: 'Sandra Snaddon',
  9: 'Seth Kennedy',
  10: 'Anya Crook',
  11: 'Rob Bibby',
  12: 'Alix Costin',
  13: 'Jane Catherine Sanders',
  14: 'Tracey Sheppard',
  15: 'Ed Griffiths',
  16: 'Sarah Brown',
  17: 'Helen Brough',
  18: 'Kathryn Tomasetti',
  19: 'Phil Howard',
  20: 'Chris Edwards',
  21: 'Sean Evelegh',
  22: 'Kate Sproston',
  23: 'Lucy Martin',
  24: 'Ross Alcock',
  25: 'Karen Willis',
  26: 'Louise West',
  27: 'Chris Fisher',
  28: 'Anna Rennie',
  29: 'Amelia Skachill Burke',
  30: 'Ella Merriman',
  31: 'Chris Ainslie',
  32: 'Gunta Andrews',
  33: 'Adam Jenkins',
  34: 'Ricky Keech',
  35: 'Tom Gaskell',
  36: 'Navah Langmeyer',
}));

const craftsByEpisode = new Map(Object.entries({
  1: 'Glass engraving', 2: 'Glassblowing and engraving', 3: 'Glass engraving',
  4: 'Letter carving and glass engraving', 5: 'Stained glass conservation', 6: 'Glass engraving',
  7: 'Leatherwork', 8: 'Glass engraving', 9: 'Horology', 10: 'Luthiery', 11: 'Ceramics',
  12: 'Glass engraving', 13: 'Ceramics', 14: 'Glass engraving', 15: 'Shoemaking and leatherwork',
  16: 'Glass art', 17: 'Glass art', 18: 'Weaving', 19: 'Clog making', 20: 'Oral history',
  21: 'Furniture design and woodwork', 22: 'Embroidery and textiles', 23: 'Jewellery', 24: 'Horology',
  25: 'Ceramics', 26: 'Lacemaking', 27: 'Woodturning', 28: 'Silversmithing and maille',
  29: 'Glassblowing', 30: 'Rush basketry', 31: 'Glass engraving', 32: 'Textile art',
  33: 'Longbow making and blacksmithing', 34: 'Glassblowing', 35: 'Glass art',
  36: 'Enamelling and jewellery',
}));

function slug(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
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
  const email = process.env.DIRECTUS_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const password = process.env.DIRECTUS_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  assert.ok(email && password, apply
    ? 'Apply requires DIRECTUS_ADMIN_TOKEN or Directus admin credentials.'
    : 'A Directus admin, MCP, or site token is required.');
  const response = await fetch(`${directusUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json().catch(() => null);
  assert.ok(response.ok && body?.data?.access_token, body?.errors?.[0]?.message || 'Directus login failed.');
  return body.data.access_token;
}

async function items(collection, fields) {
  const query = new URLSearchParams({
    fields,
    filter: JSON.stringify({ tenant: { _eq: tenant } }),
    limit: '-1',
  });
  return request(`/items/${collection}?${query}`);
}

token = await resolveToken();

const [episodes, makers] = await Promise.all([
  items('episodes', 'id,number,title,status,guest,maker,craft,summary,podcast_guid,podcast_source_url'),
  items('makers', 'id,slug,name,status,craft,dek,bio'),
]);
const imported = episodes.filter(({ podcast_guid }) => podcast_guid);
const existingMakerBySlug = new Map(makers.map((maker) => [maker.slug, maker]));
const plan = imported.map((episode) => {
  const guest = guestsByEpisode.get(String(episode.number));
  assert.ok(guest, `Episode ${episode.number} has no reviewed title-to-guest mapping.`);
  assert.ok(episode.title.toLowerCase().includes(guest.split(' ')[0].toLowerCase()), `Episode ${episode.number} title does not support guest ${guest}.`);
  const makerSlug = slug(guest);
  const craft = craftsByEpisode.get(String(episode.number));
  assert.ok(craft, `Episode ${episode.number} has no reviewed craft mapping.`);
  const maker = existingMakerBySlug.get(makerSlug);
  return {
    episode,
    guest,
    craft,
    makerSlug,
    maker,
    makerExists: Boolean(maker),
    makerNeedsEnrichment: Boolean(maker?.status === 'draft' && /draft guest record/i.test(String(maker.bio || ''))),
    episodeNeedsUpdate: !episode.guest || !episode.maker || !episode.craft,
  };
});

if (!apply) {
  console.log(JSON.stringify({
    ok: true,
    mode: 'dry-run',
    source: 'Podbean RSS episode titles already stored in Directus',
    importedEpisodes: imported.length,
    titleBackedGuestMappings: plan.length,
    draftMakersToCreate: plan.filter(({ makerExists }) => !makerExists).length,
    draftMakersToEnrich: plan.filter(({ makerNeedsEnrichment }) => makerNeedsEnrichment).length,
    episodesToLink: plan.filter(({ episodeNeedsUpdate }) => episodeNeedsUpdate).length,
    willPublish: false,
    willOverwriteOwnerEdits: false,
    reviewRequired: ['guest spelling', 'craft category', 'biography', 'portrait', 'transcript'],
  }, null, 2));
  process.exit(0);
}

let makersCreated = 0;
let episodesLinked = 0;
for (const entry of plan) {
  if (!entry.makerExists) {
    await request('/items/makers', {
      method: 'POST',
      body: JSON.stringify({
        tenant,
        slug: entry.makerSlug,
        status: 'draft',
        name: entry.guest,
        craft: entry.craft,
        dek: `Podcast guest on Made With These Hands. Biography awaiting owner review.`,
        bio: entry.episode.summary,
        practice_title: `${entry.craft}, in conversation.`,
        seo_title: `${entry.guest} | Made With These Hands`,
        seo_description: `${entry.guest} appears on the Made With These Hands podcast. Guest biography awaiting owner review.`,
      }),
    });
    makersCreated += 1;
  } else if (entry.makerNeedsEnrichment) {
    await request(`/items/makers/${entry.maker.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        craft: entry.maker.craft || entry.craft,
        bio: entry.episode.summary,
        practice_title: `${entry.craft}, in conversation.`,
      }),
    });
  }
  const changes = {};
  if (!entry.episode.guest) changes.guest = entry.guest;
  if (!entry.episode.maker) changes.maker = entry.makerSlug;
  if (!entry.episode.craft) changes.craft = entry.craft;
  if (Object.keys(changes).length) {
    await request(`/items/episodes/${entry.episode.id}`, {
      method: 'PATCH',
      body: JSON.stringify(changes),
    });
    episodesLinked += 1;
  }
}

console.log(JSON.stringify({
  ok: true,
  mode: 'applied',
  importedEpisodes: imported.length,
  makersCreated,
  makersEnriched: plan.filter(({ makerNeedsEnrichment }) => makerNeedsEnrichment).length,
  episodesLinked,
  published: 0,
  ownerEditsOverwritten: 0,
}, null, 2));
