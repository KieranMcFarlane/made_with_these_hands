import { getMwthDirectusData } from '../lib/directus';
import { DirectusBlocks } from './directus-blocks';
import styles from './directus-page.module.css';

const TEMPLATE_SLOTS = ['before-content', 'main', 'after-content', 'related-content'];

export default async function DirectusPage({ page }) {
  const needsListings = page.blocks.some((block) => block.collection === 'block_listing');
  const content = needsListings ? await getMwthDirectusData() : null;
  const blocksBySlot = Object.fromEntries(
    TEMPLATE_SLOTS.map((slot) => [slot, page.blocks.filter((block) => (block.slot || 'main') === slot)]),
  );
  const firstVisibleBlock = TEMPLATE_SLOTS
    .flatMap((slot) => blocksBySlot[slot])
    .at(0);
  const hasHero = firstVisibleBlock?.collection === 'block_hero';

  return (
    <main className={styles.page} data-template={page.type || 'page'}>
      <DirectusBlocks blocks={blocksBySlot['before-content']} content={content} slot="before-content" />
      {!hasHero && (
        <header className={styles.pageHeader}>
          <p className={styles.eyebrow}>{page.type || 'Page'}</p>
          <h1>{page.title}</h1>
          {page.description && <p className={styles.dek}>{page.description}</p>}
        </header>
      )}
      <DirectusBlocks blocks={blocksBySlot.main} content={content} slot="main" />
      <DirectusBlocks blocks={blocksBySlot['after-content']} content={content} slot="after-content" />
      <DirectusBlocks blocks={blocksBySlot['related-content']} content={content} slot="related-content" />
    </main>
  );
}
