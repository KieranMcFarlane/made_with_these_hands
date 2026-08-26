import { getMwthDirectusData } from '../lib/directus';
import SiteShell from './site-shell';
import TemplateSlotPortals from './template-slot-portals';

export const HYBRID_PAGE_TYPES = new Set([
  'about',
  'contact',
  'objects_index',
  'makers_index',
  'podcast_index',
  'journal_index',
  'product_detail',
  'maker_detail',
  'episode_detail',
  'post_detail',
]);

export default async function DirectusHybridTemplate({ page }) {
  const mainBlocks = page.blocks.filter((block) => (block.slot || 'main') === 'main');
  const slots = {
    'before-content': page.blocks.filter((block) => block.slot === 'before-content'),
    'after-content': [
      ...mainBlocks,
      ...page.blocks.filter((block) => block.slot === 'after-content'),
    ],
    'related-content': page.blocks.filter((block) => block.slot === 'related-content'),
  };
  const needsListings = page.blocks.some((block) => block.collection === 'block_listing');
  const content = needsListings ? await getMwthDirectusData() : null;

  return (
    <>
      <SiteShell />
      <TemplateSlotPortals slots={slots} content={content} />
    </>
  );
}
