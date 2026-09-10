import Image from 'next/image';
import { activePalette, brandFromRecords } from '../../lib/brand-settings.mjs';
import {
  getMwthBrandSettings,
  getMwthComponentRegistry,
  getMwthComponentUsage,
  getMwthPage,
} from '../../lib/directus';
import {
  COMPONENT_INVENTORY_COUNT,
  COMPONENT_INVENTORY_GROUPS,
  componentInstanceExternalHref,
} from '../component-inventory';
import { BLOCK_CATALOG, DirectusBlock } from '../directus-blocks';
import styles from './brand-book.module.css';
import ComponentInventoryBrowser from './component-inventory-browser';

export const metadata = {
  title: 'Brand Book',
  description: 'The living visual and editorial system for Made With These Hands.',
};

export const dynamic = 'force-dynamic';

const COMPONENT_PREVIEW_BLOCKS = [
  {
    collection: 'block_hero',
    id: 'preview-hero',
    section: { image: '/images/mwth-hero-glass-engraving.jpg' },
    item: {
      eyebrow: 'Editorial opening',
      title: 'The hand that makes, remembers.',
      dek: 'A journal of craftspeople, heritage skills, and the quiet discipline of making things by hand.',
      image_alt: 'Glass engraving at the workshop wheel',
      variant: 'split',
      cta_label: 'Explore craft',
      cta_href: '/objects',
    },
  },
  {
    collection: 'block_text',
    id: 'preview-text',
    item: {
      eyebrow: 'Working principle',
      title: 'Process before polish.',
      dek: 'Editorial copy remains specific, measured, and close to the work.',
      variant: 'two-column',
      body: [
        'Name the maker and the material.',
        'Keep the evidence of process visible.',
        'Leave enough room for the object to speak.',
      ],
    },
  },
  {
    collection: 'block_media',
    id: 'preview-media',
    section: { image: '/images/mwth-maker-portrait.jpg' },
    item: {
      eyebrow: 'Workshop portrait',
      title: 'The maker in their own space.',
      dek: 'Natural light, real texture, and a credited subject.',
      image_alt: 'Maker portrait in a workshop',
      caption: 'Portrait recorded beside the work / Made With These Hands',
      variant: 'figure',
    },
  },
  {
    collection: 'block_quote',
    id: 'preview-quote',
    item: {
      eyebrow: 'Field note',
      title: 'Listen before writing.',
      quote: 'The wheel teaches you to slow down - you cannot argue with it.',
      quote_attribution: 'Workshop conversation',
    },
  },
  {
    collection: 'block_listing',
    id: 'preview-listing',
    item: {
      eyebrow: 'Object archive',
      title: 'Made slowly, answered for personally.',
      dek: 'A governed listing reads from published Directus content.',
      listing_type: 'products',
      items_limit: 1,
      variant: 'grid',
    },
  },
  {
    collection: 'block_cta',
    id: 'preview-cta',
    item: {
      eyebrow: 'Continue the story',
      title: 'Ask about the work.',
      dek: 'A focused next step without checkout-first language.',
      variant: 'panel',
      cta_label: 'Make an enquiry',
      cta_href: '/contact',
      secondary_cta_label: 'Read the journal',
      secondary_cta_href: '/journal',
    },
  },
  {
    collection: 'block_slideshow',
    id: 'preview-slideshow',
    item: {
      eyebrow: 'shadcn Carousel / editorial',
      title: 'The workshop, frame by frame.',
      dek: 'Keyboard, swipe, reduced-motion and visible-focus behaviour are part of the approved contract.',
      variant: 'editorial',
      show_captions: true,
      show_counter: true,
      autoplay: false,
      slides: [
        { image: '/images/mwth-hero-glass-engraving.jpg', image_alt: 'Glass engraving in the workshop', caption: 'At the engraving wheel', credit: 'Made With These Hands' },
        { image: '/images/mwth-maker-portrait.jpg', image_alt: 'Maker portrait in a workshop', caption: 'The maker in their own space', credit: 'Made With These Hands' },
        { image: '/images/mwth-podcast-bench.jpg', image_alt: 'Field recording equipment on a workshop bench', caption: 'Recording beside the work', credit: 'Made With These Hands' },
      ],
    },
  },
  {
    collection: 'block_podcast_player',
    id: 'preview-podcast-player',
    item: {
      eyebrow: 'Trusted open source / Media Chrome',
      title: 'Hugh McNeill of Made With These Hands interviews Navah Langmeyer.',
      dek: 'A tenant-safe player stores direct episode data in Directus and renders branded controls without embed scripts.',
      variant: 'feature',
      episode: 'podbean-navah-langmeyer',
      episode_title: 'Hugh McNeill of Made With These Hands interviews Navah Langmeyer',
      guest: 'Navah Langmeyer',
      audio_url: 'https://mcdn.podbean.com/mf/web/i7xb5qh4kg3t4ztz/riverside_magic_episode_02_hugh_mcneill_s_stud87wfy.mp3',
      duration: '36 min',
      published_date: 'Jul 27, 2026',
      transcript: 'Transcript content can be stored in Directus as plain text, or replaced with a reviewed transcript link.',
      podbean_url: 'https://hughmn.podbean.com/',
      related_products: ['lobster-pot-small'],
    },
  },
];

const COMPONENT_PREVIEW_CONTENT = {
  products: [
    {
      slug: 'lobster-pot-small',
      name: 'Lobster pot, small',
      craft: 'Basketry',
      place: 'Connemara',
      meta: 'Willow and working memory',
      image: '/images/mwth-product-lobster-pot.jpg',
    },
  ],
};

function Swatch({ name, value }) {
  return (
    <div className={styles.swatch}>
      <div className={styles.swatchColour} style={{ background: value }} />
      <div>
        <strong>{name.replaceAll('_', ' ')}</strong>
        <code>{value}</code>
      </div>
    </div>
  );
}

function RuleList({ items = [] }) {
  return (
    <ul className={styles.ruleList}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function blockValue(block, field, fallback = '') {
  const value = block?.item?.[field] ?? block?.section?.[field];
  return value !== undefined && value !== null && value !== '' ? value : fallback;
}

function blockKey(block) {
  return blockValue(block, 'key', '');
}

function blockImage(block) {
  return block?.section?.image || '';
}

function jsonValue(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function catalogFromRegistry(records = []) {
  if (!records.length) return BLOCK_CATALOG;
  const liveRegistry = new Map(records.map((record) => [record.block_collection || record.key, record]));

  return BLOCK_CATALOG.map((compiled) => {
    const record = liveRegistry.get(compiled.collection);
    if (!record) return compiled;
    const collection = compiled.collection;
    const fieldContract = jsonValue(record.field_contract, []);
    const variants = jsonValue(record.variants, compiled.variants);
    const slots = jsonValue(record.allowed_slots, compiled.slots);
    const accessibility = jsonValue(record.accessibility_contract, compiled.accessibility);
    const limits = jsonValue(record.limits, compiled.limits);
    const trustedOpenSource = jsonValue(record.trusted_open_source, compiled.trustedOpenSource);
    const fieldNames = Array.isArray(fieldContract)
      ? fieldContract.map((field) => field.field || field.name).filter(Boolean)
      : [];
    return {
      ...compiled,
      collection,
      label: record.label || compiled.label,
      description: record.description || compiled.description,
      status: record.status || compiled.status,
      version: record.version || compiled.version,
      variants,
      slots,
      fields: fieldNames.length ? fieldNames : compiled.fields,
      accessibility,
      limits,
      trustedOpenSource,
      preview_url: record.preview_url || compiled.preview_url,
      renderer: record.renderer_key || compiled.renderer,
    };
  });
}

function fallbackBlocks(brand) {
  return [
    {
      sort: 10,
      item: {
        key: 'brand_cover',
        eyebrow: 'Identity / 01',
        title: brand.identity.essence,
        dek: brand.identity.story,
      },
    },
    {
      sort: 20,
      item: {
        key: 'brand_story',
        eyebrow: '01 / Brand story',
        title: brand.identity.promise,
        dek: brand.identity.descriptor,
        body: brand.identity.principles,
      },
    },
    { sort: 30, item: { key: 'brand_colour', eyebrow: '02 / Colour', title: 'Material, quiet, and warm.' } },
    { sort: 40, item: { key: 'brand_type', eyebrow: '03 / Typography', title: 'Editorial hierarchy with workshop utility.' } },
    { sort: 50, item: { key: 'brand_voice', eyebrow: '04 / Voice', title: 'Measured, specific, and human.', quote: brand.voice.example } },
    { sort: 60, item: { key: 'brand_imagery', eyebrow: '05 / Imagery', title: brand.imagery.direction } },
    { sort: 70, item: { key: 'brand_components', eyebrow: '06 / Components', title: 'A small system, used consistently.' } },
  ];
}

function BrandSection({
  block,
  brand,
  catalog,
  componentUsage,
  palette,
  paletteEntries,
}) {
  const key = blockKey(block);
  const eyebrow = blockValue(block, 'eyebrow');
  const title = blockValue(block, 'title');
  const dek = blockValue(block, 'dek');

  if (key === 'brand_story') {
    const principles = Array.isArray(block?.item?.body) && block.item.body.length
      ? block.item.body
      : brand.identity.principles;
    return (
      <section className={styles.section} id="story">
        <div className={styles.sectionLabel}>{eyebrow}</div>
        <div className={styles.storyGrid}>
          <div>
            <p className={styles.kicker}>{dek || brand.identity.descriptor}</p>
            <h2>{title || brand.identity.promise}</h2>
          </div>
          <RuleList items={principles} />
        </div>
      </section>
    );
  }

  if (key === 'brand_colour') {
    return (
      <section className={`${styles.section} ${styles.paperSection}`} id="colour">
        <div className={styles.sectionLabel}>{eyebrow}</div>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>Active palette</p>
            <h2>{title || palette.name}</h2>
          </div>
          <p>{dek || palette.description}</p>
        </div>
        <div className={styles.swatchGrid}>
          {Object.entries(palette.tokens).map(([name, value]) => (
            <Swatch key={name} name={name} value={value} />
          ))}
        </div>
        <div className={styles.paletteVariants}>
          {paletteEntries.map(([paletteKey, item]) => (
            <article key={paletteKey} className={styles.paletteCard}>
              <div className={styles.paletteStrip}>
                {['paper', 'paper_2', 'ink', 'accent'].map((token) => (
                  <span key={token} style={{ background: item.tokens[token] }} />
                ))}
              </div>
              <p className={styles.eyebrow}>{paletteKey === brand.palette.active ? 'Current' : 'Alternative'}</p>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (key === 'brand_type') {
    return (
      <section className={styles.section} id="type">
        <div className={styles.sectionLabel}>{eyebrow}</div>
        <div className={styles.sectionHeading}>
          <h2>{title}</h2>
          <p>{dek || 'Display, body, and utility roles remain distinct.'}</p>
        </div>
        <div className={styles.typeSpecimens}>
          <article>
            <p className={styles.eyebrow}>{brand.typography.display.family} / Display</p>
            <div className={styles.displaySpecimen}>The discipline of making things by hand.</div>
            <p>{brand.typography.display.role}</p>
          </article>
          <article>
            <p className={styles.eyebrow}>{brand.typography.body.family} / Body</p>
            <div className={styles.bodySpecimen}>
              A handmade object carries evidence of a person: pressure, patience, correction, and the decision to stop.
            </div>
            <p>{brand.typography.body.role}</p>
          </article>
          <article>
            <p className={styles.eyebrow}>{brand.typography.utility.family} / Utility</p>
            <div className={styles.monoSpecimen}>FIELD RECORDING 047 / CONNEMARA / 54 MIN</div>
            <p>{brand.typography.utility.role}</p>
          </article>
        </div>
        <RuleList items={brand.typography.rules} />
      </section>
    );
  }

  if (key === 'brand_voice') {
    return (
      <section className={`${styles.section} ${styles.darkSection}`} id="voice">
        <div className={styles.sectionLabel}>{eyebrow}</div>
        <div className={styles.sectionHeading}>
          <h2>{title}</h2>
          <p>{dek}</p>
        </div>
        <div className={styles.voiceGrid}>
          <div>
            <p className={styles.eyebrow}>Sounds like</p>
            <RuleList items={brand.voice.sounds_like} />
          </div>
          <div>
            <p className={styles.eyebrow}>Avoid</p>
            <RuleList items={brand.voice.avoid} />
          </div>
        </div>
        <blockquote>&ldquo;{blockValue(block, 'quote', brand.voice.example)}&rdquo;</blockquote>
      </section>
    );
  }

  if (key === 'brand_imagery') {
    const image = blockImage(block);
    const imageAlt = blockValue(block, 'image_alt', blockValue(block, 'imageAlt', ''));
    const caption = blockValue(block, 'caption', blockValue(block, 'imageCaption', ''));

    return (
      <section className={styles.section} id="imagery">
        <div className={styles.sectionLabel}>{eyebrow}</div>
        <div className={styles.imageryLead}>
          <h2>{title || brand.imagery.direction}</h2>
          <p>{dek || `${brand.imagery.composition} ${brand.imagery.light}`}</p>
        </div>
        {image && (
          <figure className={styles.imageryFigure}>
            <div className={styles.imageryImageFrame}>
              <Image
                className={styles.imageryImage}
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 90vw"
              />
            </div>
            {caption && <figcaption>{caption}</figcaption>}
          </figure>
        )}
        <div className={styles.guidanceGrid}>
          <div>
            <p className={styles.eyebrow}>Look for</p>
            <RuleList items={brand.imagery.subjects} />
          </div>
          <div>
            <p className={styles.eyebrow}>Leave out</p>
            <RuleList items={brand.imagery.avoid} />
          </div>
        </div>
      </section>
    );
  }

  if (key === 'brand_components') {
    const defaultContract = brandFromRecords().component_contract;
    const spacing = {
      ...defaultContract.spacing,
      ...brand.component_contract?.spacing,
      scale_px: brand.component_contract?.spacing?.scale_px || defaultContract.spacing.scale_px,
      density_choices: brand.component_contract?.spacing?.density_choices || defaultContract.spacing.density_choices,
      density_tokens: brand.component_contract?.spacing?.density_tokens || defaultContract.spacing.density_tokens,
    };
    const composition = brand.component_contract?.composition || defaultContract.composition;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3038';
    const inventoryGroups = COMPONENT_INVENTORY_GROUPS.map((group) => ({
      ...group,
      components: group.components.map((component) => ({
        ...component,
        instances: component.instances.map((instance) => ({
          ...instance,
          href: componentInstanceExternalHref(instance, siteUrl),
        })),
      })),
    }));
    return (
      <section className={`${styles.section} ${styles.paperSection}`} id="components">
        <div className={styles.sectionLabel}>{eyebrow}</div>
        <div className={styles.sectionHeading}>
          <h2>{title}</h2>
          <p>{dek}</p>
        </div>
        <div className={styles.contractFoundation}>
          <article>
            <p className={styles.eyebrow}>Foundation / 4px scale</p>
            <h3>One rhythm, named decisions.</h3>
            <div className={styles.spacingScale}>
              {Object.entries(spacing.scale_px).map(([token, pixels]) => (
                <div key={token}>
                  <span style={{ width: `${Math.max(4, pixels)}px` }} />
                  <code>{token.replace('_', '-')}</code>
                  <small>{pixels}px</small>
                </div>
              ))}
            </div>
          </article>
          <article>
            <p className={styles.eyebrow}>Directus / controlled composition</p>
            <h3>Meaningful choices, no raw CSS.</h3>
            <div className={styles.densityList}>
              {spacing.density_choices.map((density) => (
                <div key={density}>
                  <strong>{density}</strong>
                  <code>
                    {Object.entries(spacing.density_tokens[density])
                      .map(([role, token]) => `${role}:${token}`)
                      .join(' / ')}
                  </code>
                </div>
              ))}
            </div>
            <p className={styles.contractNote}>
              Directus field <code>{composition.directus_spacing_field}</code> accepts only these
              three values. Raw CSS and numeric spacing remain outside CMS content.
            </p>
          </article>
          <article>
            <p className={styles.eyebrow}>Factory / release proof</p>
            <h3>Draft until every gate passes.</h3>
            <RuleList items={[
              'Brand contract and approved registry',
              'Live Directus contract',
              'Component behaviour tests',
              'Storybook visual and accessibility states',
              'Dependency audit and production build',
              'Published-route smoke tests',
            ]}
            />
          </article>
        </div>
        <div className={styles.componentCatalogArea}>
          <div className={styles.componentDirectory}>
            <div>
              <p className={styles.eyebrow}>Approved page blocks</p>
              <h2>{catalog.length} reusable ways to compose a page.</h2>
            </div>
            <p>
              Each specimen pairs the editable Directus contract with the component that visitors
              actually see. Open the details only when you need fields or accessibility rules.
            </p>
          </div>
          <nav className={styles.componentJumpLinks} aria-label="Approved page blocks">
            {catalog.map((component, index) => (
              <a href={`#component-${component.collection}`} key={component.collection}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {component.label}
              </a>
            ))}
          </nav>
          <div className={styles.componentShowcases}>
            {COMPONENT_PREVIEW_BLOCKS.map((preview, index) => {
              const component = catalog.find(({ collection }) => collection === preview.collection);
              if (!component) return null;
              const usage = componentUsage[component.collection] || [];
              return (
                <article
                  className={styles.componentShowcase}
                  id={`component-${component.collection}`}
                  key={component.collection}
                >
                <header className={styles.componentShowcaseHeader}>
                  <div>
                    <p className={styles.eyebrow}>
                      {String(index + 1).padStart(2, '0')} / {component.collection} / {component.renderer}
                    </p>
                    <h3>{component.label}</h3>
                    <p>{component.description}</p>
                  </div>
                  <div className={styles.componentState}>
                    <span>{component.status}</span>
                    <code>v{component.version}</code>
                  </div>
                </header>

                <dl className={styles.componentFacts}>
                  <div>
                    <dt>Variants</dt>
                    <dd>{component.variants.length ? component.variants.join(' / ') : 'Single approved form'}</dd>
                  </div>
                  <div>
                    <dt>Spacing</dt>
                    <dd>{component.spacingModes.join(' / ')}</dd>
                  </div>
                  <div>
                    <dt>Page slots</dt>
                    <dd>{component.slots.join(' / ')}</dd>
                  </div>
                  <div>
                    <dt>Where used</dt>
                    <dd>
                      {usage.length
                        ? usage.map(({ path, slot }) => `${path} (${slot})`).join(' / ')
                        : ['block_slideshow', 'block_podcast_player'].includes(component.collection)
                          ? 'Brand Book specimen'
                          : 'No published page'}
                    </dd>
                  </div>
                </dl>

                <details className={styles.componentContract}>
                  <summary>View fields, dependencies, and accessibility contract</summary>
                  <div className={styles.componentContractGrid}>
                    <div>
                      <p className={styles.eyebrow}>Editable fields</p>
                      <ul className={styles.fieldList}>
                        {component.fields.map((field) => <li key={field}>{field}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className={styles.eyebrow}>Accessibility</p>
                      <RuleList items={component.accessibility} />
                      {component.primitives?.length > 0 && (
                        <p className={styles.cardMeta}>Primitives: {component.primitives.join(' / ')}</p>
                      )}
                      {component.trustedOpenSource?.length > 0 && (
                        <p className={styles.cardMeta}>
                          Trusted source:{' '}
                          {component.trustedOpenSource
                            .map((entry) => `${entry.package} (${entry.license})`)
                            .join(' / ')}
                        </p>
                      )}
                    </div>
                  </div>
                </details>

                <div className={styles.componentPreviewLabel} id={`live-example-${component.collection}`}>
                  <span>Rendered specimen</span>
                  <span>Directus-shaped preview data</span>
                </div>
                <div className={styles.componentPreview}>
                  <DirectusBlock
                    block={preview}
                    content={COMPONENT_PREVIEW_CONTENT}
                    preview
                  />
                </div>
                </article>
              );
            })}
          </div>
        </div>
        <div className={styles.inventoryHeader} id="component-inventory">
          <div>
            <p className={styles.eyebrow}>Full site inventory</p>
            <h2>{COMPONENT_INVENTORY_COUNT} components, classified by responsibility.</h2>
          </div>
          <p>
            Only page-level composition belongs in the Builder. Templates, interactive modules,
            global chrome, and primitives keep controlled contracts with Directus.
          </p>
        </div>
        <ComponentInventoryBrowser groups={inventoryGroups} />
        <div className={styles.usageNote}>
          <strong>Accent use</strong>
          <p>{brand.usage.accent_rule}</p>
        </div>
      </section>
    );
  }

  return null;
}

export async function BrandBook({ path = '/brand' } = {}) {
  const [brandResult, page, registry, componentUsage] = await Promise.all([
    getMwthBrandSettings(),
    getMwthPage(path),
    getMwthComponentRegistry(),
    getMwthComponentUsage(),
  ]);
  const brand = brandResult || brandFromRecords();
  const catalog = catalogFromRegistry(registry);
  const palette = activePalette(brand);
  const paletteEntries = Object.entries(brand.palette.palettes);
  const blocks = page?.blocks?.length ? page.blocks : fallbackBlocks(brand);
  const cover = blocks.find((block) => blockKey(block) === 'brand_cover') || fallbackBlocks(brand)[0];
  const sections = blocks.filter((block) => blockKey(block) !== 'brand_cover');

  return (
    <main className={styles.book}>
      <header className={styles.cover}>
        <div className={styles.coverMeta}>
          <span>{page?.title || 'Made With These Hands'}</span>
          <span>Living brand book</span>
          <span>Directus-backed</span>
        </div>
        <div className={styles.coverGrid}>
          <div>
            <p className={styles.eyebrow}>{blockValue(cover, 'eyebrow', 'Identity / 01')}</p>
            <h1>{blockValue(cover, 'title', brand.identity.essence)}</h1>
          </div>
          <p className={styles.coverIntro}>{blockValue(cover, 'dek', brand.identity.story)}</p>
        </div>
        <nav className={styles.contents} aria-label="Brand book sections">
          {sections.map((block) => {
            const key = blockKey(block).replace('brand_', '');
            return <a key={blockKey(block)} href={`#${key}`}>{blockValue(block, 'eyebrow', key).split('/').at(-1).trim()}</a>;
          })}
        </nav>
      </header>

      {sections.map((block) => (
        <BrandSection
          key={block.id || blockKey(block)}
          block={block}
          brand={brand}
          catalog={catalog}
          componentUsage={componentUsage}
          palette={palette}
          paletteEntries={paletteEntries}
        />
      ))}

      <footer className={styles.footer}>
        <span>Made With These Hands / Brand book</span>
        <span>Source: Directus site_pages.blocks + brand_settings</span>
      </footer>
    </main>
  );
}

export default function BrandBookPage() {
  return <BrandBook path="/brand" />;
}
