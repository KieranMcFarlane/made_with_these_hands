export const COMPONENT_INVENTORY_GROUPS = [
  {
    key: 'site-chrome',
    title: 'Site chrome',
    description: 'Persistent navigation and presentation controls. These are configured globally, not inserted into pages.',
    components: [
      { name: 'Masthead and navigation', source: 'MastheadMid', directus: 'navigation_items + tenants', status: 'Global' },
      { name: 'Footer', source: 'FooterMid', directus: 'navigation_items + tenants', status: 'Global' },
      { name: 'Palette and display controls', source: 'PageToggle / display controls', directus: 'brand_settings', status: 'Internal' },
    ],
  },
  {
    key: 'home-sections',
    title: 'Editorial sections',
    description: 'Legacy homepage sections mapped onto the reusable Builder vocabulary.',
    components: [
      { name: 'Split opening', source: 'HeroA', directus: 'block_hero', status: 'Mapped' },
      { name: 'Cover opening', source: 'HeroB', directus: 'block_hero', status: 'Mapped' },
      { name: 'Mission statement', source: 'Mission', directus: 'block_text', status: 'Mapped' },
      { name: 'Craft feature', source: 'Craft', directus: 'block_text + block_listing', status: 'Mapped' },
      { name: 'Founder story', source: 'HughStory', directus: 'block_media + block_text + block_cta', status: 'Mapped' },
      { name: 'Podcast feature', source: 'Podcast', directus: 'block_listing + block_quote + block_cta', status: 'Mapped' },
      { name: 'Artist of the week', source: 'ArtistOfWeek', directus: 'block_listing', status: 'Mapped' },
      { name: 'Why craft matters', source: 'WhyCraft', directus: 'block_text + block_quote', status: 'Mapped' },
      { name: 'Shop prompt', source: 'ShopCTA', directus: 'block_cta', status: 'Mapped' },
    ],
  },
  {
    key: 'cards-listings',
    title: 'Cards and listings',
    description: 'Repeatable editorial cards selected through the Listing block rather than inserted one by one.',
    components: [
      { name: 'Product card', source: 'DataProductCard', directus: 'block_listing: products', status: 'Builder data' },
      { name: 'Maker card', source: 'ArtistsPage / maker links', directus: 'block_listing: makers', status: 'Builder data' },
      { name: 'Episode card or archive row', source: 'PodcastArchivePage', directus: 'block_listing: episodes', status: 'Builder data' },
      { name: 'Journal card', source: 'BlogCard', directus: 'block_listing: posts', status: 'Builder data' },
    ],
  },
  {
    key: 'templates',
    title: 'Structured templates',
    description: 'Routes backed by editorial collections. Their internal structure is fixed while their content remains editable.',
    components: [
      { name: 'Home', source: 'App home composition', directus: 'site_pages + blocks', status: 'Template' },
      { name: 'Objects index', source: 'ShopPage', directus: 'products + site_pages slots', status: 'Hybrid' },
      { name: 'Product detail', source: 'DataProductPage', directus: 'products + site_pages slots', status: 'Hybrid' },
      { name: 'Makers index', source: 'ArtistsPage', directus: 'makers + site_pages slots', status: 'Hybrid' },
      { name: 'Maker detail', source: 'DataMakerPage', directus: 'makers + site_pages slots', status: 'Hybrid' },
      { name: 'Craft index', source: 'DataCraftPage', directus: 'products + makers', status: 'Template' },
      { name: 'Podcast archive', source: 'DataPodcastArchivePage', directus: 'episodes + site_pages slots', status: 'Hybrid' },
      { name: 'Episode detail', source: 'DataEpisodePage', directus: 'episodes + site_pages slots', status: 'Hybrid' },
      { name: 'Journal index', source: 'BlogPage', directus: 'posts + site_pages slots', status: 'Hybrid' },
      { name: 'Journal article', source: 'BlogPostPage', directus: 'posts + site_pages slots', status: 'Hybrid' },
      { name: 'Contact / commissions', source: 'CommissionsPage', directus: 'site_pages slots + enquiries', status: 'Hybrid' },
      { name: 'Founder profile', source: 'HughStoryPage', directus: 'site_pages slots + blocks', status: 'Hybrid' },
    ],
  },
  {
    key: 'interactive',
    title: 'Interactive modules',
    description: 'Behavioural components tied to APIs or collection workflows. They remain controlled modules, not freeform blocks.',
    components: [
      { name: 'Enquiry drawer', source: 'EnquiryDrawer', directus: 'enquiries', status: 'Interactive' },
      { name: 'Commission form', source: 'CommissionsPage form', directus: 'enquiries', status: 'Interactive' },
      { name: 'Episode comments', source: 'EpisodeComments', directus: 'comments', status: 'Interactive' },
      { name: 'Podcast player', source: 'PodcastPlayerBlock / Media Chrome', directus: 'block_podcast_player', status: 'Tenant-safe' },
      { name: 'Audio and transcript controls', source: 'EpisodePage', directus: 'episodes', status: 'Legacy interactive' },
    ],
  },
  {
    key: 'primitives',
    title: 'Shared primitives',
    description: 'Small implementation details documented for consistency but intentionally hidden from the Builder.',
    components: [
      { name: 'Primary and secondary actions', source: 'Action links / buttons', directus: 'CTA fields', status: 'Primitive' },
      { name: 'Responsive image frame', source: 'Placeholder / next/image', directus: 'Directus files', status: 'Primitive' },
      { name: 'Rich or structured copy', source: 'RichText / StructuredBody', directus: 'body fields', status: 'Primitive' },
      { name: 'Product, maker and craft links', source: 'ProductLink / MakerLink / CraftLink', directus: 'slugs and relations', status: 'Primitive' },
      { name: 'Text input', source: 'CFInput', directus: 'form schema', status: 'Primitive' },
      { name: 'Textarea', source: 'CFTextarea', directus: 'form schema', status: 'Primitive' },
    ],
  },
];

export const COMPONENT_INVENTORY_COUNT = COMPONENT_INVENTORY_GROUPS
  .reduce((total, group) => total + group.components.length, 0);
