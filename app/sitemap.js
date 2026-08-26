import { getMwthSitemapPages } from '../lib/directus';

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

export default async function sitemap() {
  const directusPages = await getMwthSitemapPages();
  const fallbackPages = routes.map((route) => ({
    path: route || '/',
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
  const pagesByPath = new Map(
    [...fallbackPages, ...directusPages].map((page) => [page.path, page]),
  );

  return [...pagesByPath.values()].map((page) => ({
    url: `${siteUrl}${page.path === '/' ? '' : page.path}`,
    lastModified: page.lastModified || new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
