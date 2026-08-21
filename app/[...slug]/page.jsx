import { notFound } from 'next/navigation';

import { getMwthPage } from '../../lib/directus';
import DirectusHybridTemplate, { HYBRID_PAGE_TYPES } from '../directus-detail-template';
import DirectusPage from '../directus-page';

export const dynamic = 'force-dynamic';

async function pathFromParams(paramsPromise) {
  const params = await paramsPromise;
  return `/${(params?.slug || []).join('/')}`;
}

export async function generateMetadata({ params }) {
  const path = await pathFromParams(params);
  const page = await getMwthPage(path);
  if (!page) return {};

  return {
    title: page.seoTitle || page.title,
    description: page.description || undefined,
    alternates: {
      canonical: page.canonicalPath || page.path,
    },
  };
}

export default async function CatchAllPage({ params }) {
  const path = await pathFromParams(params);
  const page = await getMwthPage(path);

  if (page && HYBRID_PAGE_TYPES.has(page.type)) {
    return <DirectusHybridTemplate page={page} />;
  }
  if (page) return <DirectusPage page={page} />;
  notFound();
}
