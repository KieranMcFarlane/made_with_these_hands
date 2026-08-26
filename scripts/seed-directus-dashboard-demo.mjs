const directusUrl = (process.env.DIRECTUS_URL || 'http://127.0.0.1:8055').replace(/\/$/, '');
const tokens = [
  process.env.DIRECTUS_MCP_TOKEN,
  process.env.DIRECTUS_ADMIN_TOKEN,
].filter(Boolean);
let activeToken = tokens[0];
const tenant = process.env.DIRECTUS_TENANT_VALUE || 'made-with-these-hands';

if (!activeToken) {
  console.error('DIRECTUS_MCP_TOKEN or DIRECTUS_ADMIN_TOKEN is required.');
  process.exit(1);
}

async function performRequest(pathname, options = {}) {
  const response = await fetch(`${directusUrl}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${activeToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = body?.errors?.[0]?.message || body?.message || response.statusText;
    const error = new Error(`${options.method || 'GET'} ${pathname}: ${message}`);
    error.status = response.status;
    throw error;
  }
  return body;
}

async function request(pathname, options = {}) {
  try {
    return await performRequest(pathname, options);
  } catch (error) {
    const fallbackToken = tokens.find((candidate) => candidate !== activeToken);
    if (fallbackToken && error.status === 401) {
      activeToken = fallbackToken;
      return performRequest(pathname, options);
    }
    throw error;
  }
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

async function upsert(collection, filter, data) {
  const existing = await findOne(collection, filter, 'id');
  if (existing) {
    return (await request(`/items/${collection}/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })).data;
  }

  return (await request(`/items/${collection}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })).data;
}

async function ensurePage() {
  return upsert(
    'site_pages',
    {
      _and: [
        { tenant: { _eq: tenant } },
        { path: { _eq: '/dashboard' } },
      ],
    },
    {
      tenant,
      path: '/dashboard',
      canonical_path: '/dashboard',
      status: 'published',
      page_type: 'component_dashboard',
      title: 'Operating Dashboard',
      seo_title: 'Operating Dashboard | Made With These Hands',
      description: 'A Directus-driven operating view for the Made With These Hands content, brand, and component system.',
      priority: 0.2,
      change_frequency: 'monthly',
      sort: 90,
    },
  );
}

async function upsertBlock(collection, data) {
  return upsert(
    collection,
    {
      _and: [
        { tenant: { _eq: tenant } },
        { key: { _eq: data.key } },
      ],
    },
    { tenant, status: 'published', ...data },
  );
}

async function ensurePageBlock(pageId, collection, itemId, sort, slot = 'main') {
  const existing = await findOne('site_pages_blocks', {
    _and: [
      { site_pages_id: { _eq: pageId } },
      { collection: { _eq: collection } },
      { item: { _eq: String(itemId) } },
    ],
  }, 'id');

  const payload = {
    site_pages_id: pageId,
    collection,
    item: String(itemId),
    sort,
    slot,
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

async function ensureNavigationItem() {
  return upsert(
    'navigation_items',
    {
      _and: [
        { tenant: { _eq: tenant } },
        { menu: { _eq: 'primary' } },
        { href: { _eq: '/dashboard' } },
      ],
    },
    {
      tenant,
      menu: 'primary',
      label: 'Dashboard',
      href: '/dashboard',
      sort: 75,
    },
  );
}

const blockSpecs = [
  {
    collection: 'block_hero',
    sort: 10,
    slot: 'before-content',
    data: {
      key: 'dashboard_cover',
      variant: 'minimal',
      eyebrow: 'Client demo / Directus MCP',
      title: 'One governed place for story, shop-style enquiries, podcast, journal, and brand.',
      dek: 'This page is assembled from approved Directus blocks so Hugh can see how Codex, the brand book, and reusable components work together without opening up unsafe freeform code.',
      theme: 'paper',
      cta_label: 'Open brand book',
      cta_href: '/brand',
      secondary_cta_label: 'View component proposal',
      secondary_cta_href: '/brand/proposals/d435ec7c-7660-4c15-b8df-40bfb16a40db',
    },
  },
  {
    collection: 'block_text',
    sort: 20,
    data: {
      key: 'dashboard_status',
      variant: 'two-column',
      eyebrow: 'What is live',
      title: 'The site is split into repeatable content types and approved page blocks.',
      dek: 'This is the screen-recording story: the owner changes content in Directus, while Codex helps create governed components and respects the brand contract.',
      body: [
        {
          title: 'Brand book',
          body: 'Directus stores the brand settings; the site renders palette, voice, typography, component rules, and usage from those records.',
        },
        {
          title: 'Component registry',
          body: 'Approved blocks are registered as Hero, Text, Media, Quote, Listing, CTA, Slideshow, and Podcast Player. New components go through proposals before they become page options.',
        },
        {
          title: 'Editorial content',
          body: 'Makers, products, episodes, posts, comments, enquiries, pages, navigation, and reusable blocks are tenant-scoped for Made With These Hands.',
        },
        {
          title: 'Owner workflow',
          body: 'The owner can write blog posts, add podcast guests, reorder page blocks, publish enquiry-led products, and keep everything SEO-ready from Directus.',
        },
      ],
      theme: 'paper',
    },
  },
  {
    collection: 'block_text',
    sort: 30,
    data: {
      key: 'dashboard_guardrails',
      variant: 'left',
      eyebrow: 'Guardrails',
      title: 'Codex can move quickly because the rules are explicit.',
      dek: 'The component factory contract prevents accidental drift while still allowing new page sections to be designed and proposed.',
      body: [
        'Use the approved registry before proposing anything new.',
        'Prefer shadcn/Radix primitives for controls and interaction patterns.',
        'Document the capability gap for any bespoke primitive.',
        'Keep Directus content data-only: no executable JavaScript or renderer paths.',
        'Tenant-safe proposals can be installed when the guardrail passes; platform-level changes still require human approval.',
      ],
      theme: 'paper-2',
    },
  },
  {
    collection: 'block_listing',
    sort: 40,
    data: {
      key: 'dashboard_product_pipeline',
      variant: 'featured',
      eyebrow: 'Objects / enquiries',
      title: 'Product-style pages stay editorial and personal.',
      dek: 'Published objects can appear like a shop catalogue, but the journey is enquire-first so Hugh can follow up personally.',
      listing_type: 'products',
      items_limit: 3,
      theme: 'paper',
    },
  },
  {
    collection: 'block_listing',
    sort: 50,
    data: {
      key: 'dashboard_podcast_pipeline',
      variant: 'grid',
      eyebrow: 'Podcast / guests',
      title: 'Episodes connect guests, biographies, comments, and related objects.',
      dek: 'Each episode can support SEO metadata, published comments, guest context, and a related object rail.',
      listing_type: 'episodes',
      items_limit: 3,
      theme: 'paper',
    },
  },
  {
    collection: 'block_listing',
    sort: 60,
    data: {
      key: 'dashboard_journal_pipeline',
      variant: 'archive',
      eyebrow: 'Journal / SEO',
      title: 'Blog sections are reusable content, not one-off layouts.',
      dek: 'The journal can grow as posts and page blocks: introductions, quotes, media, listings, and CTAs stay brand-aligned.',
      listing_type: 'posts',
      items_limit: 3,
      theme: 'paper-2',
    },
  },
  {
    collection: 'block_slideshow',
    sort: 70,
    data: {
      key: 'dashboard_component_demo',
      variant: 'editorial',
      eyebrow: 'Approved component demo',
      title: 'A new governed component can be ordered onto a page.',
      dek: 'This slideshow uses the approved shadcn Carousel-backed component. The same workflow creates a proposal, validates it, then publishes it only after approval.',
      slides: [
        {
          image: '/images/mwth-hero-glass-engraving.jpg',
          image_alt: 'Glass engraving in the workshop',
          caption: 'Brand-led imagery: material, hand, and process.',
          credit: 'Made With These Hands',
        },
        {
          image: '/images/mwth-maker-portrait.jpg',
          image_alt: 'A craftsperson standing in their workshop',
          caption: 'Guest and maker biographies remain connected to the story.',
          credit: 'Made With These Hands',
        },
        {
          image: '/images/mwth-podcast-bench.jpg',
          image_alt: 'Podcast recording equipment on a workshop bench',
          caption: 'Podcast content can carry episode, guest, object, and comment data.',
          credit: 'Made With These Hands',
        },
      ],
      show_captions: true,
      show_counter: true,
      autoplay: false,
      interval: 6000,
      theme: 'paper',
    },
  },
  {
    collection: 'block_podcast_player',
    sort: 75,
    data: {
      key: 'dashboard_podcast_player',
      variant: 'feature',
      eyebrow: 'Tenant-safe component / Media Chrome',
      title: 'A branded podcast player can be ordered onto a Directus page.',
      dek: 'This block is rendered from Directus data, but playback uses the trusted open-source Media Chrome package rather than arbitrary embeds or CMS-provided code.',
      episode: 'podbean-navah-langmeyer',
      episode_title: 'Hugh McNeill of Made With These Hands interviews Navah Langmeyer',
      guest: 'Navah Langmeyer',
      audio_url: 'https://mcdn.podbean.com/mf/web/i7xb5qh4kg3t4ztz/riverside_magic_episode_02_hugh_mcneill_s_stud87wfy.mp3',
      duration: '36 min',
      published_date: 'Jul 27, 2026',
      transcript: 'Transcript content can be stored as plain text and edited through Directus MCP. The component decides how to render it, so the CMS remains data-only.',
      podbean_url: 'https://hughmn.podbean.com/',
      related_products: ['lobster-pot-small'],
      theme: 'paper',
    },
  },
  {
    collection: 'block_cta',
    sort: 80,
    slot: 'after-content',
    data: {
      key: 'dashboard_next_steps',
      variant: 'band',
      eyebrow: 'Screen recording path',
      title: 'Show the owner the system, then change one small thing live.',
      dek: 'Open the brand book, reorder this dashboard page in Directus, add a journal block, then show how a new component must pass the proposal guardrail before it can be published.',
      cta_label: 'Open brand book',
      cta_href: '/brand',
      secondary_cta_label: 'Open proposal',
      secondary_cta_href: '/brand/proposals/d435ec7c-7660-4c15-b8df-40bfb16a40db',
      theme: 'ink',
    },
  },
];

async function main() {
  const page = await ensurePage();
  await ensureNavigationItem();

  for (const spec of blockSpecs) {
    const block = await upsertBlock(spec.collection, spec.data);
    await ensurePageBlock(page.id, spec.collection, block.id, spec.sort, spec.slot || 'main');
    console.log(`linked ${spec.data.key} at ${spec.sort} (${spec.slot || 'main'})`);
  }

  console.log(`dashboard ready: ${directusUrl}/admin/content/site_pages/${page.id}`);
  console.log('site route ready: /dashboard');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
