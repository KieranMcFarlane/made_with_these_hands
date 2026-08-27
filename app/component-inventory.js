const story = (id, label = 'Storybook') => ({
  href: `?path=/story/${id}`,
  label,
  surface: 'storybook',
});

const site = (path, label = 'Live instance') => ({
  href: path,
  label,
  surface: 'site',
});

export function componentInstanceHref(instance, pathname = '/') {
  if (instance.surface !== 'storybook') return instance.href;
  const managerPath = pathname.startsWith('/storybook/') ? '/storybook/index.html' : '/';
  return `${managerPath}${instance.href}`;
}

export function componentInstanceExternalHref(instance, siteUrl = 'http://localhost:3038') {
  if (instance.surface !== 'storybook') return instance.href;
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '');
  const isLocalSite = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalizedSiteUrl);
  const storybookUrl = process.env.NEXT_PUBLIC_STORYBOOK_URL
    || (isLocalSite ? 'http://127.0.0.1:6006' : `${normalizedSiteUrl}/storybook/index.html`);
  return `${storybookUrl}${instance.href}`;
}

export const COMPONENT_INVENTORY_GROUPS = [
  {
    key: 'site-chrome',
    title: 'Site chrome',
    description: 'Persistent navigation and presentation controls. These are configured globally, not inserted into pages.',
    components: [
      { name: 'Masthead and navigation', source: 'MastheadMid', directus: 'navigation_items + tenants', status: 'Global', instances: [site('/', 'Open masthead')] },
      { name: 'Footer', source: 'FooterMid', directus: 'navigation_items + tenants', status: 'Global', instances: [site('/about', 'Open page footer')] },
      { name: 'Palette and display controls', source: 'PageToggle / display controls', directus: 'brand_settings', status: 'Internal', instances: [site('/brand#colour', 'Open colour contract'), site('/brand#components', 'Open component rules')] },
    ],
  },
  {
    key: 'home-sections',
    title: 'Editorial sections',
    description: 'Legacy homepage sections mapped onto the reusable Builder vocabulary.',
    components: [
      { name: 'Split opening', source: 'HeroA', directus: 'block_hero', status: 'Mapped', instances: [story('mwth-directus-blocks--hero', 'Block proof'), site('/', 'Homepage instance')] },
      { name: 'Cover opening', source: 'HeroB', directus: 'block_hero', status: 'Mapped', instances: [story('mwth-directus-blocks--hero-cover', 'Cover proof'), site('/', 'Homepage control')] },
      { name: 'Mission statement', source: 'Mission', directus: 'block_text', status: 'Mapped', instances: [story('mwth-directus-blocks--text', 'Block proof'), site('/#about', 'Homepage instance')] },
      { name: 'Craft feature', source: 'Craft', directus: 'block_text + block_listing', status: 'Mapped', instances: [story('mwth-directus-blocks--page-sequence', 'Composition proof'), site('/#craft', 'Homepage instance')] },
      { name: 'Founder story', source: 'HughStory', directus: 'block_media + block_text + block_cta', status: 'Mapped', instances: [story('mwth-directus-blocks--media', 'Media proof'), site('/#stories', 'Homepage instance')] },
      { name: 'Podcast feature', source: 'Podcast', directus: 'block_listing + block_quote + block_cta', status: 'Mapped', instances: [story('mwth-directus-blocks--page-sequence', 'Composition proof'), site('/#podcast', 'Homepage instance')] },
      { name: 'Artist of the week', source: 'ArtistOfWeek', directus: 'block_listing', status: 'Mapped', instances: [story('mwth-directus-blocks--listing', 'Listing proof'), site('/makers/saoirse-doolan', 'Featured maker')] },
      { name: 'Why craft matters', source: 'WhyCraft', directus: 'block_text + block_quote', status: 'Mapped', instances: [story('mwth-directus-blocks--quote', 'Quote proof'), site('/journal/why-we-record-the-tools', 'Editorial instance')] },
      { name: 'Shop prompt', source: 'ShopCTA', directus: 'block_cta', status: 'Mapped', instances: [story('mwth-directus-blocks--call-to-action', 'Block proof'), site('/objects', 'Objects journey')] },
    ],
  },
  {
    key: 'cards-listings',
    title: 'Cards and listings',
    description: 'Repeatable editorial cards selected through the Listing block rather than inserted one by one.',
    components: [
      { name: 'Product card', source: 'DataProductCard', directus: 'block_listing: products', status: 'Builder data', instances: [story('mwth-directus-blocks--listing', 'Listing proof'), site('/objects', 'Product instances')] },
      { name: 'Maker card', source: 'ArtistsPage / maker links', directus: 'block_listing: makers', status: 'Builder data', instances: [story('mwth-directus-blocks--listing', 'Listing proof'), site('/makers', 'Maker instances')] },
      { name: 'Episode card or archive row', source: 'PodcastArchivePage', directus: 'block_listing: episodes', status: 'Builder data', instances: [story('mwth-directus-blocks--listing', 'Listing proof'), site('/podcast', 'Episode instances')] },
      { name: 'Journal card', source: 'BlogCard', directus: 'block_listing: posts', status: 'Builder data', instances: [story('mwth-directus-blocks--listing', 'Listing proof'), site('/journal', 'Journal instances')] },
    ],
  },
  {
    key: 'templates',
    title: 'Structured templates',
    description: 'Routes backed by editorial collections. Their internal structure is fixed while their content remains editable.',
    components: [
      { name: 'Home', source: 'App home composition', directus: 'site_pages + blocks', status: 'Template', instances: [site('/', 'Open template'), story('mwth-directus-blocks--page-sequence', 'Builder sequence')] },
      { name: 'Objects index', source: 'ShopPage', directus: 'products + site_pages slots', status: 'Hybrid', instances: [site('/objects')] },
      { name: 'Product detail', source: 'DataProductPage', directus: 'products + site_pages slots', status: 'Hybrid', instances: [site('/objects/lobster-pot-small')] },
      { name: 'Makers index', source: 'ArtistsPage', directus: 'makers + site_pages slots', status: 'Hybrid', instances: [site('/makers')] },
      { name: 'Maker detail', source: 'DataMakerPage', directus: 'makers + site_pages slots', status: 'Hybrid', instances: [site('/makers/meabh-o-riada')] },
      { name: 'Craft index', source: 'DataCraftPage', directus: 'products + makers', status: 'Template', instances: [site('/craft/basketry')] },
      { name: 'Podcast archive', source: 'DataPodcastArchivePage', directus: 'episodes + site_pages slots', status: 'Hybrid', instances: [site('/podcast')] },
      { name: 'Episode detail', source: 'DataEpisodePage', directus: 'episodes + site_pages slots', status: 'Hybrid', instances: [site('/podcast/047')] },
      { name: 'Journal index', source: 'BlogPage', directus: 'posts + site_pages slots', status: 'Hybrid', instances: [site('/journal')] },
      { name: 'Journal article', source: 'BlogPostPage', directus: 'posts + site_pages slots', status: 'Hybrid', instances: [site('/journal/why-we-record-the-tools')] },
      { name: 'Contact / commissions', source: 'CommissionsPage', directus: 'site_pages slots + enquiries', status: 'Hybrid', instances: [site('/contact', 'Contact instance'), site('/commissions', 'Commission instance')] },
      { name: 'Founder profile', source: 'HughStoryPage', directus: 'site_pages slots + blocks', status: 'Hybrid', instances: [site('/about')] },
    ],
  },
  {
    key: 'interactive',
    title: 'Interactive modules',
    description: 'Behavioural components tied to APIs or collection workflows. They remain controlled modules, not freeform blocks.',
    components: [
      { name: 'Enquiry drawer', source: 'EnquiryDrawer', directus: 'enquiries', status: 'Interactive', instances: [site('/objects/lobster-pot-small', 'Open object enquiry')] },
      { name: 'Commission form', source: 'CommissionsPage form', directus: 'enquiries', status: 'Interactive', instances: [site('/commissions')] },
      { name: 'Episode comments', source: 'EpisodeComments', directus: 'comments', status: 'Interactive', instances: [site('/podcast/047')] },
      { name: 'Podcast player', source: 'PodcastPlayerBlock / Media Chrome', directus: 'block_podcast_player', status: 'Tenant-safe', instances: [story('mwth-blocks-podcast-player--feature', 'Feature'), story('mwth-blocks-podcast-player--compact', 'Compact'), story('mwth-blocks-podcast-player--missing-audio', 'Missing audio'), site('/brand/proposals/4047964e-4f7c-42a0-95ca-9261420be37b', 'Factory proposal')] },
      { name: 'Audio and transcript controls', source: 'EpisodePage', directus: 'episodes', status: 'Legacy interactive', instances: [site('/podcast/047')] },
    ],
  },
  {
    key: 'primitives',
    title: 'Shared primitives',
    description: 'Small implementation details documented for consistency but intentionally hidden from the Builder.',
    components: [
      { name: 'Primary and secondary actions', source: 'Action links / buttons', directus: 'CTA fields', status: 'Primitive', instances: [story('mwth-directus-blocks--call-to-action', 'CTA proof')] },
      { name: 'Responsive image frame', source: 'Placeholder / next/image', directus: 'Directus files', status: 'Primitive', instances: [story('mwth-directus-blocks--media', 'Media proof')] },
      { name: 'Rich or structured copy', source: 'RichText / StructuredBody', directus: 'body fields', status: 'Primitive', instances: [story('mwth-directus-blocks--text', 'Text proof')] },
      { name: 'Product, maker and craft links', source: 'ProductLink / MakerLink / CraftLink', directus: 'slugs and relations', status: 'Primitive', instances: [story('mwth-directus-blocks--listing', 'Link proof')] },
      { name: 'Text input', source: 'CFInput', directus: 'form schema', status: 'Primitive', instances: [site('/contact', 'Form instance')] },
      { name: 'Textarea', source: 'CFTextarea', directus: 'form schema', status: 'Primitive', instances: [site('/contact', 'Form instance')] },
    ],
  },
];

export const COMPONENT_INVENTORY_COUNT = COMPONENT_INVENTORY_GROUPS
  .reduce((total, group) => total + group.components.length, 0);
