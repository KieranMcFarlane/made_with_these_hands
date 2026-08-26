import Image from 'next/image';
import { APPROVED_COMPONENTS } from '../component-system/components.mjs';
import styles from './directus-page.module.css';
import PodcastPlayerBlock from './podcast-player-block';
import SlideshowBlock from './slideshow-block';

export const BLOCK_CATALOG = APPROVED_COMPONENTS;

function itemOf(block) {
  return block?.item || {};
}

function assetOf(block) {
  return block?.section?.image || '';
}

function assetUrl(file) {
  if (!file) return '';
  if (typeof file === 'string') {
    if (file.startsWith('/') || file.startsWith('http://') || file.startsWith('https://')) return file;
    return `/api/assets/${file}`;
  }
  return assetUrl(file.id || file.image || file.file);
}

function galleryOf(value) {
  if (!Array.isArray(value)) return [];
  return value.map((entry, index) => {
    if (typeof entry === 'string') {
      return { src: assetUrl(entry), alt: '', caption: '', key: `${entry}-${index}` };
    }
    if (!entry || typeof entry !== 'object') return null;
    const src = assetUrl(entry.image || entry.file || entry.id);
    if (!src) return null;
    return {
      src,
      alt: entry.alt || entry.image_alt || '',
      caption: entry.caption || '',
      key: `${entry.id || entry.image || entry.file || 'image'}-${index}`,
    };
  }).filter(Boolean);
}

function altOf(block) {
  const item = itemOf(block);
  return item.image_alt || block?.section?.imageAlt || '';
}

function themeOf(block) {
  return itemOf(block).theme || 'paper';
}

function variantOf(block, fallback) {
  return itemOf(block).variant || fallback;
}

function spacingOf(block) {
  const spacing = itemOf(block).spacing;
  return ['compact', 'standard', 'generous'].includes(spacing) ? spacing : 'standard';
}

function ActionLink({ href, label, secondary = false }) {
  if (!href || !label) return null;
  return (
    <a className={secondary ? styles.secondaryAction : styles.primaryAction} href={href}>
      {label}
    </a>
  );
}

function Actions({ item }) {
  const hasActions = (item.cta_href && item.cta_label)
    || (item.secondary_cta_href && item.secondary_cta_label);
  if (!hasActions) return null;

  return (
    <div className={styles.actions}>
      <ActionLink href={item.cta_href} label={item.cta_label} />
      <ActionLink
        href={item.secondary_cta_href}
        label={item.secondary_cta_label}
        secondary
      />
    </div>
  );
}

function StructuredBody({ value }) {
  if (!value) return null;

  if (Array.isArray(value)) {
    if (value.every((entry) => typeof entry === 'string')) {
      return (
        <ul className={styles.bodyList}>
          {value.map((entry) => <li key={entry}>{entry}</li>)}
        </ul>
      );
    }

    return (
      <div className={styles.bodyStack}>
        {value.map((entry, index) => {
          if (typeof entry === 'string') return <p key={`${entry}-${index}`}>{entry}</p>;
          if (!entry || typeof entry !== 'object') return null;
          const heading = entry.title || entry.heading || entry.label;
          const copy = entry.body || entry.text || entry.description;
          return (
            <article key={`${heading || 'item'}-${index}`}>
              {heading && <h3>{heading}</h3>}
              {copy && <p>{String(copy)}</p>}
            </article>
          );
        })}
      </div>
    );
  }

  if (typeof value === 'string') return <p>{value}</p>;

  return (
    <dl className={styles.definitionList}>
      {Object.entries(value).map(([key, entry]) => (
        <div key={key}>
          <dt>{key.replaceAll('_', ' ')}</dt>
          <dd>{Array.isArray(entry) ? entry.join(', ') : String(entry)}</dd>
        </div>
      ))}
    </dl>
  );
}

function HeroBlock({ block, preview = false }) {
  const item = itemOf(block);
  const image = assetOf(block);
  const Heading = preview ? 'h2' : 'h1';

  return (
    <section
      className={`${styles.block} ${styles.hero}`}
      data-theme={themeOf(block)}
      data-variant={variantOf(block, 'split')}
    >
      <div className={styles.heroCopy}>
        {item.eyebrow && <p className={styles.eyebrow}>{item.eyebrow}</p>}
        <Heading>{item.title}</Heading>
        {item.dek && <p className={styles.dek}>{item.dek}</p>}
        <Actions item={item} />
      </div>
      {image && (
        <div className={styles.heroImage}>
          <Image src={image} alt={altOf(block)} fill priority sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
      )}
    </section>
  );
}

function TextBlock({ block }) {
  const item = itemOf(block);
  return (
    <section
      className={`${styles.block} ${styles.textBlock}`}
      data-variant={item.variant || (item.alignment === 'center' ? 'centered' : 'two-column')}
      data-theme={themeOf(block)}
    >
      <div className={styles.blockHeading}>
        {item.eyebrow && <p className={styles.eyebrow}>{item.eyebrow}</p>}
        {item.title && <h2>{item.title}</h2>}
        {item.dek && <p className={styles.dek}>{item.dek}</p>}
      </div>
      <div className={styles.blockBody}>
        <StructuredBody value={item.body} />
      </div>
    </section>
  );
}

function MediaBlock({ block }) {
  const item = itemOf(block);
  const image = assetOf(block);
  const gallery = galleryOf(item.images);
  return (
    <section
      className={`${styles.block} ${styles.mediaBlock}`}
      data-theme={themeOf(block)}
      data-variant={variantOf(block, 'figure')}
    >
      <div className={styles.blockHeading}>
        {item.eyebrow && <p className={styles.eyebrow}>{item.eyebrow}</p>}
        {item.title && <h2>{item.title}</h2>}
        {item.dek && <p className={styles.dek}>{item.dek}</p>}
      </div>
      {image && (
        <figure className={styles.mediaFigure}>
          <div className={styles.mediaImage}>
            <Image src={image} alt={altOf(block)} fill sizes="100vw" />
          </div>
          {item.caption && <figcaption>{item.caption}</figcaption>}
        </figure>
      )}
      {gallery.length > 0 && variantOf(block, 'figure') === 'gallery' && (
        <div className={styles.galleryGrid}>
          {gallery.map((entry) => (
            <figure key={entry.key}>
              <div className={styles.galleryImage}>
                <Image src={entry.src} alt={entry.alt} fill sizes="(max-width: 700px) 100vw, 50vw" />
              </div>
              {entry.caption && <figcaption>{entry.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

function QuoteBlock({ block }) {
  const item = itemOf(block);
  return (
    <section className={`${styles.block} ${styles.quoteBlock}`} data-theme={themeOf(block)}>
      {item.eyebrow && <p className={styles.eyebrow}>{item.eyebrow}</p>}
      {item.title && <h2>{item.title}</h2>}
      <blockquote>&ldquo;{item.quote || item.dek}&rdquo;</blockquote>
      {item.quote_attribution && <cite>{item.quote_attribution}</cite>}
    </section>
  );
}

function listingSourceKey(item) {
  const type = item.listing_type || 'products';
  return {
    related_objects: 'products',
    related_episodes: 'episodes',
    related_posts: 'posts',
  }[type] || type;
}

function listingItems(item, content) {
  const sourceKey = listingSourceKey(item);
  const source = content?.[sourceKey] || [];
  const filtered = source.filter((entry) => {
    if (item.craft && entry.craft !== item.craft) return false;
    if (item.maker && entry.maker !== item.maker && entry.slug !== item.maker) return false;
    return true;
  });
  return filtered.slice(0, item.items_limit || 6);
}

function listingTitle(entry) {
  return entry.name || entry.title || entry.guest || `Episode ${entry.number}`;
}

function listingMeta(entry) {
  return [entry.craft, entry.place, entry.category, entry.duration].filter(Boolean).join(' / ');
}

function listingHref(item, entry) {
  const sourceKey = listingSourceKey(item);
  if (sourceKey === 'products' && entry.slug) return `/objects/${entry.slug}`;
  if (sourceKey === 'makers' && entry.slug) return `/makers/${entry.slug}`;
  if (sourceKey === 'episodes' && (entry.number || entry.slug)) return `/podcast/${entry.number || entry.slug}`;
  if (sourceKey === 'posts' && entry.slug) return `/journal/${entry.slug}`;
  return '';
}

function ListingBlock({ block, content }) {
  const item = itemOf(block);
  const entries = listingItems(item, content);
  return (
    <section
      className={`${styles.block} ${styles.listingBlock}`}
      data-theme={themeOf(block)}
      data-variant={variantOf(block, 'grid')}
    >
      <div className={styles.blockHeading}>
        {item.eyebrow && <p className={styles.eyebrow}>{item.eyebrow}</p>}
        {item.title && <h2>{item.title}</h2>}
        {item.dek && <p className={styles.dek}>{item.dek}</p>}
      </div>
      <div className={styles.cardGrid}>
        {entries.map((entry, index) => (
          <article className={styles.card} key={entry.slug || entry.number || `${listingTitle(entry)}-${index}`}>
            <a className={styles.cardLink} href={listingHref(item, entry) || undefined}>
              {entry.image && (
                <div className={styles.cardImage}>
                  <Image
                    src={entry.image}
                    alt={listingTitle(entry)}
                    fill
                    sizes="(max-width: 700px) 100vw, 33vw"
                  />
                </div>
              )}
              {listingMeta(entry) && <p className={styles.eyebrow}>{listingMeta(entry)}</p>}
              <h3>{listingTitle(entry)}</h3>
              {(entry.dek || entry.meta) && <p>{entry.dek || entry.meta}</p>}
            </a>
          </article>
        ))}
        {!entries.length && <p className={styles.emptyListing}>No matching items are published yet.</p>}
      </div>
    </section>
  );
}

function CtaBlock({ block }) {
  const item = itemOf(block);
  return (
    <section
      className={`${styles.block} ${styles.ctaBlock}`}
      data-theme={themeOf(block)}
      data-variant={variantOf(block, 'panel')}
    >
      {item.eyebrow && <p className={styles.eyebrow}>{item.eyebrow}</p>}
      <h2>{item.title}</h2>
      {item.dek && <p className={styles.dek}>{item.dek}</p>}
      <Actions item={item} />
    </section>
  );
}

export const BLOCK_COMPONENTS = {
  block_hero: HeroBlock,
  block_text: TextBlock,
  block_media: MediaBlock,
  block_quote: QuoteBlock,
  block_listing: ListingBlock,
  block_cta: CtaBlock,
  block_slideshow: ({ block }) => <SlideshowBlock item={itemOf(block)} />,
  block_podcast_player: ({ block, content }) => <PodcastPlayerBlock item={itemOf(block)} content={content} />,
};

export function DirectusBlock({ block, content, preview = false }) {
  const Component = BLOCK_COMPONENTS[block.collection];
  if (!Component) return null;
  return (
    <div className={styles.componentFrame} data-spacing={spacingOf(block)}>
      <Component block={block} content={content} preview={preview} />
    </div>
  );
}

export function DirectusBlocks({ blocks, content, slot }) {
  if (!blocks?.length) return null;
  return (
    <div className={styles.slot} data-slot={slot}>
      {blocks.map((block) => (
        <DirectusBlock key={`${block.collection}-${block.id}`} block={block} content={content} />
      ))}
    </div>
  );
}
