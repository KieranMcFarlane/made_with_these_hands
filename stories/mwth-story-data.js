export const products = [
  {
    slug: 'lobster-pot-small',
    name: 'Lobster pot, small',
    craft: 'Basketry',
    price: 'GBP 220',
    place: 'Kilkenny',
    image: '/images/mwth-product-lobster-pot.jpg',
    meta: 'Willow, hand-shaped and enquiry-led.',
  },
  {
    slug: 'bog-oak-spoon',
    name: 'Bog oak spoon',
    craft: 'Woodwork',
    price: 'GBP 180',
    place: 'Co. Galway',
    image: '/images/portuguese-woodworker-maker.png',
    meta: 'Dark oak, quiet grain, hand-finished.',
  },
  {
    slug: 'engraved-glass-tumbler',
    name: 'Engraved glass tumbler',
    craft: 'Glass engraving',
    price: 'GBP 95',
    place: 'Kilkenny',
    image: '/images/mwth-hero-glass-engraving.jpg',
    meta: 'Fine line engraving for daily use.',
  },
];

export const episodes = [
  {
    number: '047',
    slug: 'meabh-o-riada-bog-oak',
    guest: 'Meabh O Riada',
    title: 'Meabh O Riada and bog oak, dowsing, and the grain of 4,000 years.',
    craft: 'Woodwork',
    place: 'Co. Galway',
    duration: '42 min',
  },
  {
    number: '046',
    slug: 'navah-langmeyer-workshop-magic',
    guest: 'Navah Langmeyer',
    title: 'Riverside magic and the discipline of making.',
    craft: 'Textiles',
    place: 'Kilkenny',
    duration: '36 min',
  },
];

export const posts = [
  {
    slug: 'why-we-record-the-tools',
    title: 'Why we record the tools',
    dek: 'A note on memory, use, and the objects that hold a maker in place.',
    category: 'Field note',
    date: 'Apr 2026',
  },
  {
    slug: 'objects-that-ask-for-time',
    title: 'Objects that ask for time',
    dek: 'How enquiry-led selling changes the conversation around craft.',
    category: 'Essay',
    date: 'May 2026',
  },
];

export const content = {
  products,
  episodes,
  posts,
  makers: [
    {
      slug: 'meabh-o-riada',
      name: 'Meabh O Riada',
      craft: 'Woodwork',
      place: 'Co. Galway',
      image: '/images/portuguese-woodworker-maker.png',
      dek: 'Bog-oak woodworker working with hand tools and timber held underground since the Bronze Age.',
    },
  ],
};

export function block(collection, item, overrides = {}) {
  return {
    id: `${collection}-${item.key || item.title || item.episode || 'story'}`,
    collection,
    sort: overrides.sort || 10,
    slot: overrides.slot || 'main',
    item,
    section: overrides.section || {},
    ...overrides,
  };
}

export const heroBlock = block(
  'block_hero',
  {
    key: 'storybook_hero',
    variant: 'split',
    eyebrow: 'Storybook / approved block',
    title: 'Every component has to carry the craft.',
    dek: 'A Directus-shaped hero block rendered inside the Made With These Hands brand contract.',
    cta_label: 'View objects',
    cta_href: '/objects',
    secondary_cta_label: 'Read journal',
    secondary_cta_href: '/journal',
    theme: 'paper',
  },
  {
    section: {
      image: '/images/mwth-hero-glass-engraving.jpg',
      imageAlt: 'Hands engraving glass in a workshop',
    },
  },
);

export const textBlock = block('block_text', {
  key: 'storybook_text',
  variant: 'two-column',
  eyebrow: 'Guardrails',
  title: 'The CMS stores data. The component owns behaviour.',
  dek: 'This is the line that keeps the owner flexible without letting content become executable code.',
  body: [
    {
      title: 'Directus',
      body: 'Stores copy, media references, links, ordering, SEO fields, and tenant-scoped content.',
    },
    {
      title: 'Component Factory',
      body: 'Checks proposals against brand, field, dependency, and permission rules before release.',
    },
  ],
  theme: 'paper-2',
});

export const mediaBlock = block(
  'block_media',
  {
    key: 'storybook_media',
    variant: 'figure',
    eyebrow: 'Documented process',
    title: 'The evidence stays in the frame.',
    dek: 'Meaningful imagery carries alternative text, a caption, and a stable editorial ratio.',
    image_alt: 'Hands engraving a crystal tumbler at a workshop bench',
    caption: 'Hugh McNeill at the engraving wheel / Made With These Hands',
    theme: 'paper',
  },
  {
    section: {
      image: '/images/mwth-hero-glass-engraving.jpg',
      imageAlt: 'Hands engraving a crystal tumbler at a workshop bench',
    },
  },
);

export const quoteBlock = block('block_quote', {
  key: 'storybook_quote',
  eyebrow: 'Field note',
  title: 'A voice kept close to the work.',
  quote: 'The wheel teaches you to slow down. You cannot argue with it.',
  quote_attribution: 'Workshop conversation',
  theme: 'paper-2',
});

export const listingBlock = block('block_listing', {
  key: 'storybook_listing',
  variant: 'featured',
  eyebrow: 'Objects / enquiries',
  title: 'Product-style cards without a checkout funnel.',
  dek: 'The block reads published products and keeps the journey enquiry-led.',
  listing_type: 'products',
  items_limit: 3,
  theme: 'paper',
});

export const ctaBlock = block('block_cta', {
  key: 'storybook_cta',
  variant: 'band',
  eyebrow: 'Continue personally',
  title: 'Ask about the object, not the checkout.',
  dek: 'The final action follows the Made With These Hands enquiry-led promise.',
  cta_label: 'Make an enquiry',
  cta_href: '/contact',
  secondary_cta_label: 'Read the journal',
  secondary_cta_href: '/journal',
  theme: 'ink',
});

export const slideshowItem = {
  key: 'storybook_slideshow',
  variant: 'editorial',
  eyebrow: 'Approved component',
  title: 'A slideshow that knows its limits.',
  dek: 'Captions, counters, controls, and autoplay rules are owned by the component contract.',
  slides: [
    {
      image: '/images/mwth-hero-glass-engraving.jpg',
      image_alt: 'Glass engraving in a workshop',
      caption: 'Material, hand, and process.',
      credit: 'Made With These Hands',
    },
    {
      image: '/images/mwth-podcast-bench.jpg',
      image_alt: 'Podcast recording equipment on a workshop bench',
      caption: 'Oral archive connected to objects and makers.',
      credit: 'Made With These Hands',
    },
    {
      image: '/images/portuguese-woodworker-maker.png',
      image_alt: 'Woodworker in a workshop',
      caption: 'Maker biography and craft context stay connected.',
      credit: 'Generated demo image',
    },
  ],
  show_captions: true,
  show_counter: true,
  autoplay: false,
  interval: 6000,
  theme: 'paper',
};

export const podcastItem = {
  key: 'storybook_podcast_player',
  variant: 'feature',
  eyebrow: 'Tenant-safe component / Media Chrome',
  title: 'A branded player, not an arbitrary embed.',
  dek: 'The CMS provides episode data and links. Media Chrome provides the trusted open-source playback controls.',
  episode: 'podbean-navah-langmeyer',
  episode_title: 'Hugh McNeill of Made With These Hands interviews Navah Langmeyer',
  guest: 'Navah Langmeyer',
  audio_url: 'https://mcdn.podbean.com/mf/web/i7xb5qh4kg3t4ztz/riverside_magic_episode_02_hugh_mcneill_s_stud87wfy.mp3',
  duration: '36 min',
  published_date: 'Jul 27, 2026',
  transcript: 'Transcript content is plain text in Directus. Rendering, controls, and behaviour stay inside the approved component.',
  podbean_url: 'https://hughmn.podbean.com/',
  related_products: ['lobster-pot-small', 'bog-oak-spoon'],
  theme: 'paper',
};
