import { activePalette, brandFromRecords } from '../../lib/brand-settings.mjs';
import { getMwthBrandSettings } from '../../lib/directus';
import styles from './brand-book.module.css';

export const metadata = {
  title: 'Brand Book',
  description: 'The living visual and editorial system for Made With These Hands.',
};

export const dynamic = 'force-dynamic';

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

function RuleList({ items }) {
  return (
    <ul className={styles.ruleList}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export default async function BrandBookPage() {
  const brand = (await getMwthBrandSettings()) || brandFromRecords();
  const palette = activePalette(brand);
  const paletteEntries = Object.entries(brand.palette.palettes);

  return (
    <main className={styles.book}>
      <header className={styles.cover}>
        <div className={styles.coverMeta}>
          <span>Made With These Hands</span>
          <span>Living brand book</span>
          <span>Directus-backed</span>
        </div>
        <div className={styles.coverGrid}>
          <div>
            <p className={styles.eyebrow}>Identity / 01</p>
            <h1>{brand.identity.essence}</h1>
          </div>
          <p className={styles.coverIntro}>{brand.identity.story}</p>
        </div>
        <nav className={styles.contents} aria-label="Brand book sections">
          <a href="#story">Story</a>
          <a href="#colour">Colour</a>
          <a href="#type">Type</a>
          <a href="#voice">Voice</a>
          <a href="#imagery">Imagery</a>
          <a href="#components">Components</a>
        </nav>
      </header>

      <section className={styles.section} id="story">
        <div className={styles.sectionLabel}>01 / Brand story</div>
        <div className={styles.storyGrid}>
          <div>
            <p className={styles.kicker}>{brand.identity.descriptor}</p>
            <h2>{brand.identity.promise}</h2>
          </div>
          <RuleList items={brand.identity.principles} />
        </div>
      </section>

      <section className={`${styles.section} ${styles.paperSection}`} id="colour">
        <div className={styles.sectionLabel}>02 / Colour</div>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>Active palette</p>
            <h2>{palette.name}</h2>
          </div>
          <p>{palette.description}</p>
        </div>
        <div className={styles.swatchGrid}>
          {Object.entries(palette.tokens).map(([name, value]) => (
            <Swatch key={name} name={name} value={value} />
          ))}
        </div>
        <div className={styles.paletteVariants}>
          {paletteEntries.map(([key, item]) => (
            <article key={key} className={styles.paletteCard}>
              <div className={styles.paletteStrip}>
                {['paper', 'paper_2', 'ink', 'accent'].map((token) => (
                  <span key={token} style={{ background: item.tokens[token] }} />
                ))}
              </div>
              <p className={styles.eyebrow}>{key === brand.palette.active ? 'Current' : 'Alternative'}</p>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="type">
        <div className={styles.sectionLabel}>03 / Typography</div>
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

      <section className={`${styles.section} ${styles.darkSection}`} id="voice">
        <div className={styles.sectionLabel}>04 / Voice</div>
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
        <blockquote>“{brand.voice.example}”</blockquote>
      </section>

      <section className={styles.section} id="imagery">
        <div className={styles.sectionLabel}>05 / Imagery</div>
        <div className={styles.imageryLead}>
          <h2>{brand.imagery.direction}</h2>
          <p>{brand.imagery.composition} {brand.imagery.light}</p>
        </div>
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

      <section className={`${styles.section} ${styles.paperSection}`} id="components">
        <div className={styles.sectionLabel}>06 / Components</div>
        <div className={styles.componentGrid}>
          <article className={styles.componentCard}>
            <p className={styles.eyebrow}>Editorial opening</p>
            <h2>The hand that makes, <em>remembers.</em></h2>
            <p>A journal of craftspeople, heritage skills, and the quiet discipline of making things by hand.</p>
            <div className={styles.buttonRow}>
              <button type="button" className={styles.primaryButton}>Explore craft</button>
              <button type="button" className={styles.secondaryButton}>Listen to the podcast</button>
            </div>
          </article>
          <article className={styles.componentCard}>
            <p className={styles.eyebrow}>Archive card / 047</p>
            <div className={styles.archivePlate}>MWTH</div>
            <p className={styles.cardMeta}>Woodwork / Connemara / 54 min</p>
            <h3>Bog oak, dowsing, and the grain of 4,000 years</h3>
          </article>
        </div>
        <div className={styles.usageNote}>
          <strong>Accent use</strong>
          <p>{brand.usage.accent_rule}</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>Made With These Hands / Brand book</span>
        <span>Source: Directus → brand_settings</span>
      </footer>
    </main>
  );
}
