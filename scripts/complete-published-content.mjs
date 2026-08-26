#!/usr/bin/env node

import assert from 'node:assert/strict';
import { basename, extname } from 'node:path';
import { readFile } from 'node:fs/promises';

const directusUrl = String(process.env.DIRECTUS_URL || 'https://cms.nakanodigital.com').replace(/\/$/, '');
const token = process.env.DIRECTUS_ADMIN_TOKEN;
const tenant = process.env.DIRECTUS_TENANT_VALUE || 'made-with-these-hands';

assert.ok(token, 'DIRECTUS_ADMIN_TOKEN is required.');

const localImage = (name) => new URL(`../public/images/${name}`, import.meta.url);
const unsplash = (id) => `https://images.unsplash.com/${id}?w=1800&q=85&auto=format&fit=crop`;

const makers = [
  {
    slug: 'saoirse-doolan',
    image: localImage('mwth-product-lobster-pot.jpg'),
    imageTitle: 'MWTH - Saoirse Doolan - willow basketry',
  },
  {
    slug: 'hugh-mcneill',
    image: localImage('mwth-maker-portrait.jpg'),
    imageTitle: 'MWTH - Hugh McNeill - workshop portrait',
  },
  {
    slug: 'meabh-o-riada',
    image: localImage('portuguese-woodworker-maker.png'),
    imageTitle: 'MWTH - Meabh O Riada - woodworker feature',
  },
  {
    slug: 'tomas-kelly',
    image: unsplash('photo-1611652022419-a9419f74343d'),
    imageTitle: 'MWTH - Tomas Kelly - silversmithing detail',
  },
  {
    slug: 'nuala-finn',
    image: unsplash('photo-1606760227091-3dd870d97f1d'),
    imageTitle: 'MWTH - Nuala Finn - jewellery detail',
  },
];

const products = [
  {
    slug: 'lead-crystal-tumbler',
    makerName: 'Hugh McNeill',
    summary: 'A signed lead-crystal tumbler cut at the wheel in Kilkenny, in an edition of 12.',
    description: 'Hugh McNeill cuts each lead-crystal tumbler at his Kilkenny wheel and signs the finished piece. The edition is limited to 12. Enquire with the studio to confirm availability, timing, and delivery.',
    image: localImage('mwth-hero-glass-engraving.jpg'),
  },
  {
    slug: 'engraved-decanter',
    makerName: 'Hugh McNeill',
    summary: 'A lead-crystal decanter engraved by Hugh McNeill in a commission pattern.',
    description: 'This engraved decanter is cut by Hugh McNeill at his Kilkenny workshop using a commission pattern. Enquire with the studio to discuss the pattern, current availability, timing, and delivery.',
    image: unsplash('photo-1481833761820-0509d3217039'),
  },
  {
    slug: 'lobster-pot-small',
    makerName: 'Saoirse Doolan',
    summary: 'A small working lobster-pot basket woven in Co. Clare, in an edition of 12.',
    description: 'Saoirse Doolan weaves this small working lobster pot in Co. Clare using the basketry practice recorded in her maker story. The edition is limited to 12. Enquire with the studio to confirm availability and delivery.',
    image: localImage('mwth-product-lobster-pot.jpg'),
  },
  {
    slug: 'gathering-basket',
    makerName: 'Saoirse Doolan',
    summary: 'A gathering basket woven from hedgerow willow and signed on the underside.',
    description: 'Saoirse Doolan makes this gathering basket in Co. Clare from hedgerow willow and signs the underside. Enquire with the studio to confirm the current piece, lead time, and delivery.',
    image: localImage('mwth-product-lobster-pot.jpg'),
  },
  {
    slug: 'herb-trug',
    makerName: 'Saoirse Doolan',
    summary: 'A made-to-order willow herb trug for kitchen and garden use.',
    description: 'This kitchen herb trug is woven to order by Saoirse Doolan in Co. Clare. Enquire with the studio to discuss current lead time, dimensions, and delivery.',
    image: unsplash('photo-1605883705077-8d3d3cebe78c'),
  },
  {
    slug: 'bog-oak-spoon',
    makerName: 'Méabh Ó Riada',
    summary: 'A hand-finished spoon made from bog oak in Co. Galway.',
    description: 'Méabh Ó Riada shapes and hand-finishes this spoon from bog oak in Co. Galway. Natural variation in the timber makes each piece distinct. Enquire with the studio to confirm availability and delivery.',
    image: localImage('portuguese-woodworker-maker.png'),
  },
  {
    slug: 'silver-cuff',
    makerName: 'Nuala Finn',
    summary: 'A silver cuff developed from Nuala Finn’s linen studies in Dublin.',
    description: 'Nuala Finn makes this silver cuff in Dublin as part of her study of textile memory translated into metal. Enquire with the studio to confirm sizing, availability, and delivery.',
    image: unsplash('photo-1611652022419-a9419f74343d'),
  },
];

const posts = [
  {
    slug: 'why-we-record-the-tools',
    image: localImage('mwth-podcast-bench.jpg'),
    imageTitle: 'MWTH - Why we record the tools',
  },
  {
    slug: 'the-object-archive',
    image: localImage('mwth-product-lobster-pot.jpg'),
    imageTitle: 'MWTH - The object archive',
  },
];

async function request(path, options = {}) {
  const response = await fetch(`${directusUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => null);
  assert.ok(response.ok, body?.errors?.[0]?.message || `${options.method || 'GET'} ${path} failed.`);
  return body?.data;
}

async function findRecord(collection, slug) {
  const filter = JSON.stringify({ _and: [{ tenant: { _eq: tenant } }, { slug: { _eq: slug } }] });
  const params = new URLSearchParams({ filter, limit: '1' });
  const records = await request(`/items/${collection}?${params}`);
  assert.equal(records?.length, 1, `Expected one ${collection} record for ${slug}.`);
  assert.equal(records[0].status, 'published', `${collection}.${slug} is not published; refusing to modify it.`);
  return records[0];
}

async function findFile(title) {
  const params = new URLSearchParams({ filter: JSON.stringify({ title: { _eq: title } }), limit: '1', fields: 'id,title' });
  return (await request(`/files?${params}`))?.[0] || null;
}

async function imageBlob(source) {
  if (source instanceof URL && source.protocol === 'file:') {
    const bytes = await readFile(source);
    const extension = extname(source.pathname).toLowerCase();
    const type = extension === '.png' ? 'image/png' : 'image/jpeg';
    return { blob: new Blob([bytes], { type }), filename: basename(source.pathname) };
  }

  const response = await fetch(source);
  assert.ok(response.ok, `Cannot download curated image: ${response.status}`);
  const blob = await response.blob();
  const id = String(source).match(/photo-[^?]+/)?.[0] || 'editorial-image';
  return { blob, filename: `${id}.jpg` };
}

async function ensureFile(source, title) {
  const existing = await findFile(title);
  if (existing) return existing.id;

  const { blob, filename } = await imageBlob(source);
  const form = new FormData();
  form.append('title', title);
  form.append('filename_download', filename);
  form.append('file', blob, filename);
  const uploaded = await request('/files', { method: 'POST', body: form });
  return uploaded.id;
}

function blank(value) {
  return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
}

async function fill(collection, slug, proposed, replace = {}) {
  const record = await findRecord(collection, slug);
  const patch = Object.fromEntries(Object.entries(proposed).filter(([field, value]) => {
    return !blank(value) && (blank(record[field]) || replace[field]?.includes(record[field]));
  }));
  if (Object.keys(patch).length === 0) {
    console.log(`unchanged ${collection}.${slug}`);
    return;
  }
  await request(`/items/${collection}/${record.id}`, { method: 'PATCH', body: JSON.stringify(patch) });
  console.log(`completed ${collection}.${slug}: ${Object.keys(patch).join(', ')}`);
}

async function completeMaker(item) {
  const record = await findRecord('makers', item.slug);
  const image = blank(record.image) ? await ensureFile(item.image, item.imageTitle) : record.image;
  const practice = Array.isArray(record.practice) ? record.practice.filter(Boolean) : [];
  await fill('makers', item.slug, {
    bio: practice.join('\n\n'),
    image,
    seo_title: `${record.name} | Made With These Hands`,
    seo_description: `${record.dek} Read the maker biography, related objects, and podcast connections.`,
  });
}

async function completeProduct(item) {
  const record = await findRecord('products', item.slug);
  const imageTitle = `MWTH - ${record.name} - object image`;
  const image = blank(record.image) ? await ensureFile(item.image, imageTitle) : record.image;
  await fill('products', item.slug, {
    summary: item.summary,
    description: item.description,
    image,
    seo_title: `${record.name} by ${item.makerName} | Made With These Hands`,
    seo_description: `${item.summary} View its maker and send a personal enquiry to the studio.`,
  }, {
    seo_title: [`${record.name} by ${record.maker} | Made With These Hands`],
  });
}

async function completePost(item) {
  const record = await findRecord('posts', item.slug);
  const image = blank(record.image) ? await ensureFile(item.image, item.imageTitle) : record.image;
  await fill('posts', item.slug, {
    image,
    seo_title: `${record.title} | Made With These Hands`,
    seo_description: record.dek,
  });
}

for (const maker of makers) await completeMaker(maker);
for (const product of products) await completeProduct(product);
for (const post of posts) await completePost(post);

console.log(`Published content completion finished for tenant ${tenant}.`);
