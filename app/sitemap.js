const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://madewiththesehands.ie';

const routes = [
  '',
  '/objects',
  '/about',
  '/makers/saoirse-doolan',
  '/makers/hugh-mcneill',
  '/podcast',
  '/podcast/047',
  '/podcast/046',
  '/podcast/045',
  '/journal',
  '/journal/why-we-record-the-tools',
  '/journal/the-object-archive',
  '/contact',
  '/commissions',
  '/craft/basketry',
  '/craft/glass-engraving',
];

export default function sitemap() {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}
