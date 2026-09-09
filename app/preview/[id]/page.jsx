import { notFound } from 'next/navigation';

import { getMwthDraftPreviewPage } from '../../../lib/directus';
import { verifyDraftPreviewToken } from '../../../lib/draft-preview-token';
import DirectusPage from '../../directus-page';

export const dynamic = 'force-dynamic';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DraftPreviewPage({ params, searchParams }) {
  const { id } = await params;
  const { token } = await searchParams;
  if (!verifyDraftPreviewToken(id, token)) notFound();
  const page = await getMwthDraftPreviewPage(id, { allowProduction: true });
  if (!page) notFound();

  return <DirectusPage page={page} />;
}
