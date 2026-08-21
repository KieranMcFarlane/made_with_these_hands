'use client';

import 'media-chrome';
import { ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import styles from './directus-page.module.css';

function cleanUrl(value) {
  if (!value || typeof value !== 'string') return '';
  if (value.startsWith('/') || value.startsWith('https://') || value.startsWith('http://')) return value;
  return '';
}

function externalLinks(item) {
  return [
    ['Apple', cleanUrl(item.apple_url)],
    ['Spotify', cleanUrl(item.spotify_url)],
    ['Podbean', cleanUrl(item.podbean_url)],
  ].filter(([, href]) => href);
}

export default function PodcastPlayerBlock({ item = {}, content = {} }) {
  const [mediaReady, setMediaReady] = useState(false);
  const audioUrl = cleanUrl(item.audio_url);
  const links = externalLinks(item);
  const relatedProducts = Array.isArray(item.related_products) ? item.related_products : [];
  const products = (content?.products || [])
    .filter((product) => relatedProducts.includes(product.slug))
    .slice(0, 6);
  const title = item.episode_title || item.title || 'Podcast episode';
  const metadata = [
    item.guest,
    item.duration,
    item.published_date,
  ].filter(Boolean).join(' / ');

  useEffect(() => {
    setMediaReady(true);
  }, []);

  return (
    <section
      aria-label={`${title} podcast player`}
      className={`${styles.block} ${styles.podcastPlayerBlock}`}
      data-theme={item.theme || 'paper'}
      data-variant={item.variant || 'feature'}
    >
      <div className={styles.podcastPlayerHeader}>
        <div>
          {item.eyebrow && <p className={styles.eyebrow}>{item.eyebrow}</p>}
          <h2>{title}</h2>
          {metadata && <p className={styles.podcastMeta}>{metadata}</p>}
        </div>
        {item.dek && <p className={styles.dek}>{item.dek}</p>}
      </div>

      <div className={styles.podcastPlayerShell}>
        {audioUrl && mediaReady ? (
          <media-controller audio className={styles.mediaController}>
            <audio
              preload="metadata"
              slot="media"
              src={audioUrl}
            />
            <media-control-bar className={styles.mediaControlBar}>
              <media-play-button aria-label="Play or pause episode" />
              <media-time-range aria-label="Seek episode" />
              <media-time-display show-duration />
              <media-mute-button aria-label="Mute episode" />
            </media-control-bar>
          </media-controller>
        ) : audioUrl ? (
          <div aria-hidden="true" className={styles.mediaControllerPlaceholder} />
        ) : (
          <p className={styles.emptyListing}>No audio URL has been added for this episode yet.</p>
        )}

        <div className={styles.podcastPlayerActions}>
          {item.transcript && (
            <Button asChild className="rounded-none" size="sm" variant="outline">
              <a href={`#transcript-${item.episode || title}`}>Transcript</a>
            </Button>
          )}
          {links.map(([label, href]) => (
            <Button asChild className="rounded-none" key={label} size="sm" variant="outline">
              <a href={href} rel="noreferrer" target="_blank">
                {label}
                <ExternalLink aria-hidden="true" size={14} />
              </a>
            </Button>
          ))}
        </div>
      </div>

      {item.transcript && (
        <details className={styles.podcastTranscript} id={`transcript-${item.episode || title}`}>
          <summary>Transcript</summary>
          <p>{item.transcript}</p>
        </details>
      )}

      {products.length > 0 && (
        <div className={styles.podcastRelated}>
          <p className={styles.eyebrow}>Objects from this conversation</p>
          <div>
            {products.map((product) => (
              <a href={`/objects/${product.slug}`} key={product.slug}>
                <span>{product.name}</span>
                <small>{[product.craft, product.price].filter(Boolean).join(' / ')}</small>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
