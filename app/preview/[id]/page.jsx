import { notFound } from 'next/navigation';

import { getMwthDraftPreviewPage } from '../../../lib/directus';
import DirectusPage from '../../directus-page';

export const dynamic = 'force-dynamic';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DraftPreviewPage({ params }) {
  const { id } = await params;
  const page = await getMwthDraftPreviewPage(id);
  if (!page) notFound();

  return <DirectusPage page={page} />;
}
