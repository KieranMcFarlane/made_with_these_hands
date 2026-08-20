'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  normalizeSlideshowSlides,
  shouldRunSlideshowAutoplay,
  slideshowInterval,
  wrappedSlideIndex,
} from '@/lib/slideshow.mjs';
import styles from './directus-page.module.css';

export default function SlideshowBlock({ item }) {
  const slides = useMemo(() => normalizeSlideshowSlides(item.slides), [item.slides]);
  const [api, setApi] = useState(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(!item.autoplay);
  const [reducedMotion, setReducedMotion] = useState(true);
  const interval = slideshowInterval(item.interval);

  const goTo = (next) => {
    if (!api || !slides.length) return;
    api.scrollTo(wrappedSlideIndex(next, slides.length));
  };

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(query.matches);
    updatePreference();
    query.addEventListener?.('change', updatePreference);
    return () => query.removeEventListener?.('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!api) return undefined;
    const onSelect = () => setIndex(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || !shouldRunSlideshowAutoplay({
      autoplay: item.autoplay,
      paused,
      reducedMotion,
      slideCount: slides.length,
    })) return undefined;
    const timer = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, interval);
    return () => window.clearInterval(timer);
  }, [api, interval, item.autoplay, paused, reducedMotion, slides.length]);

  if (!slides.length) return null;
  const current = slides[index] || slides[0];
  const showCaptions = item.show_captions !== false;
  const hasCaptions = slides.some((slide) => slide.caption || slide.credit);
  const captionText = (slide) => (
    <>
      {slide.caption}
      {slide.caption && slide.credit && ' / '}
      {slide.credit}
    </>
  );

  return (
    <section
      aria-label={item.title || 'Image slideshow'}
      className={`${styles.block} ${styles.slideshowBlock}`}
      data-theme={item.theme || 'paper'}
      data-variant={item.variant || 'editorial'}
    >
      <div className={styles.slideshowHeading}>
        <div>
          {item.eyebrow && <p className={styles.eyebrow}>{item.eyebrow}</p>}
          {item.title && <h2>{item.title}</h2>}
        </div>
        {item.dek && <p className={styles.dek}>{item.dek}</p>}
      </div>

      <Carousel
        aria-label={item.title || 'Image slideshow'}
        className={styles.slideshowStage}
        opts={{ align: 'start', loop: false }}
        setApi={setApi}
      >
        <CarouselContent className={styles.slideshowTrack}>
          {slides.map((slide, slideIndex) => (
            <CarouselItem key={slide.key}>
              <div className={styles.slideshowImage}>
                <Image
                  alt={slide.alt}
                  fill
                  loading={slideIndex === 0 ? 'eager' : 'lazy'}
                  sizes="(max-width: 900px) 100vw, 88vw"
                  src={slide.src}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className={styles.slideshowControls}>
          <div>
            <Button
              aria-label="Previous slide"
              className="rounded-none"
              onClick={() => goTo(index - 1)}
              size="icon-lg"
              type="button"
              variant="outline"
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button
              aria-label="Next slide"
              className="rounded-none"
              onClick={() => goTo(index + 1)}
              size="icon-lg"
              type="button"
              variant="outline"
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
          {item.show_counter !== false && (
            <p aria-live={item.autoplay && !paused ? 'off' : 'polite'} className={styles.slideshowCounter}>
              {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </p>
          )}
          {item.autoplay && (
            <Button
              aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
              className={`${styles.slideshowPlayback} rounded-none`}
              onClick={() => setPaused((value) => !value)}
              size="sm"
              type="button"
              variant="outline"
            >
              {paused ? 'Play' : 'Pause'}
            </Button>
          )}
        </div>

        {showCaptions && hasCaptions && (
          <div aria-live="polite" className={styles.slideshowCaptionFrame}>
            {slides.map((slide) => (
              <p
                aria-hidden="true"
                className={`${styles.slideshowCaption} ${styles.slideshowCaptionSizer}`}
                key={`${slide.key}-caption-size`}
              >
                {captionText(slide)}
              </p>
            ))}
            <p className={styles.slideshowCaption}>
              {captionText(current)}
            </p>
          </div>
        )}
      </Carousel>

      {(item.variant === 'thumbnail-rail') && (
        <div aria-label="Choose slide" className={styles.slideshowThumbnails}>
          {slides.map((slide, slideIndex) => (
            <Button
              aria-current={slideIndex === index ? 'true' : undefined}
              aria-label={`Show slide ${slideIndex + 1}`}
              className="rounded-none p-0"
              key={slide.key}
              onClick={() => goTo(slideIndex)}
              type="button"
              variant="ghost"
            >
              <Image alt="" fill sizes="120px" src={slide.src} />
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}
