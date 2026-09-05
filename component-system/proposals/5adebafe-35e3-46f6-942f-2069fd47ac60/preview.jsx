'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './preview.module.css';

const episodes = [
  {
    number: '047',
    craft: 'Woodwork',
    place: 'Connemara',
    duration: '54 min',
    title: 'Bog oak, dowsing, and the grain of 4,000 years',
    guest: 'Méabh Ó Riada',
    summary: 'A woodworker on bog oak, ancient landscapes, and listening for water.',
    image: '/images/portuguese-woodworker-maker.png',
    alt: 'Méabh Ó Riada working at a timber bench',
  },
  {
    number: '046',
    craft: 'Silversmithing',
    place: 'Dublin',
    duration: '48 min',
    title: 'Silversmithing after the crash',
    guest: 'Tomás Kelly',
    summary: 'How one silversmith rebuilt a practice — and a community — after 2008.',
    image: '/images/mwth-maker-portrait.jpg',
    alt: 'Tomás Kelly working at a metalwork bench',
  },
  {
    number: '045',
    craft: 'Jewellery',
    place: 'Dublin',
    duration: '1h 02',
    title: 'What linen remembers',
    guest: 'Nuala Finn',
    summary: 'On flax, handwork, and the quiet knowledge held in cloth.',
    image: '/images/mwth-podcast-bench.jpg',
    alt: 'Nuala Finn arranging linen and tools at her workbench',
  },
  {
    number: '044',
    craft: 'Thatching',
    place: 'Co. Donegal',
    duration: '57 min',
    title: 'Thatching the last reed-roofs of Donegal',
    guest: 'Dáithí Ó Conchúir',
    summary: 'A thatcher on reed, weather, repair, and knowledge held on the roof.',
    image: null,
    alt: '',
  },
  {
    number: '043',
    craft: 'Basketry',
    place: 'Co. Clare',
    duration: '49 min',
    title: 'Winter willow and the working basket',
    guest: 'Saoirse Doolan',
    summary: 'A basket maker on season, coppice, and vessels made to be used.',
    image: '/images/mwth-product-lobster-pot.jpg',
    alt: 'Saoirse Doolan weaving a willow basket in her workshop',
  },
  {
    number: '042',
    craft: 'Glass engraving',
    place: 'Kilkenny',
    duration: '44 min',
    title: 'Thirty years at the wheel',
    guest: 'Hugh McNeill',
    summary: 'A glass engraver on patience, precision, and a life at the bench.',
    image: '/images/mwth-hero-glass-engraving.jpg',
    alt: 'Hugh McNeill engraving glass at the cutting wheel',
  },
];

function EpisodeImage({ src, alt }) {
  const [isPortrait, setIsPortrait] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete) setIsPortrait(image.naturalHeight > image.naturalWidth);
  }, []);

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      data-portrait={isPortrait ? 'true' : 'false'}
      onLoad={(event) => {
        const image = event.currentTarget;
        setIsPortrait(image.naturalHeight > image.naturalWidth);
      }}
    />
  );
}

export default function ArchivePortraitsPreview() {
  const pageSize = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(episodes.length / pageSize);
  const visibleEpisodes = episodes.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className={styles.section} aria-labelledby="archive-portraits-title">
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Episode index</p>
        <h2 id="archive-portraits-title">Browse every conversation</h2>
        <p>{episodes.length} recordings, ordered newest first. Choose an episode to open its notes and listening page.</p>
      </header>
      <ol className={styles.list}>
        {visibleEpisodes.map((episode) => (
          <li key={episode.number} className={styles.item}>
            <a className={styles.row} href={`/?page=episode&episode=${episode.number}`} aria-label={`View episode ${episode.number}: ${episode.title}`}>
              <span className={styles.media}>
                {episode.image ? <EpisodeImage src={episode.image} alt={episode.alt} /> : (
                  <span className={styles.imageFallback} aria-hidden="true">DÓC</span>
                )}
              </span>
              <span className={styles.copy}>
                <span className={styles.meta}>EP {episode.number} / {episode.craft} / {episode.place} / {episode.duration}</span>
                <strong>{episode.title}</strong>
                <span className={styles.guest}>{episode.guest}</span>
                <span className={styles.summary}>{episode.summary}</span>
              </span>
              <span className={styles.action} aria-hidden="true">View episode <span>→</span></span>
            </a>
          </li>
        ))}
      </ol>
      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Episode archive pages">
          <p className={styles.pageStatus} aria-live="polite">Page {page} of {totalPages}</p>
          <div className={styles.pageControls}>
            <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
              ← Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                aria-label={`Page ${pageNumber}`}
                aria-current={page === pageNumber ? 'page' : undefined}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>
              Next →
            </button>
          </div>
        </nav>
      )}
    </section>
  );
}
