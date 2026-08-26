import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_AUTOPLAY_INTERVAL_MS,
  MAX_SLIDES,
  MINIMUM_AUTOPLAY_INTERVAL_MS,
  normalizeSlideshowSlides,
  shouldRunSlideshowAutoplay,
  slideshowInterval,
  wrappedSlideIndex,
} from '../../lib/slideshow.mjs';

test('slideshow normalization enforces the manifest limit and preserves accessible metadata', () => {
  const source = Array.from({ length: MAX_SLIDES + 5 }, (_, index) => ({
    image: `file-${index}`,
    image_alt: `Meaningful image ${index}`,
    caption: `Caption ${index}`,
    credit: `Credit ${index}`,
  }));
  const slides = normalizeSlideshowSlides(source);

  assert.equal(slides.length, MAX_SLIDES);
  assert.deepEqual(slides[0], {
    src: '/api/assets/file-0',
    alt: 'Meaningful image 0',
    caption: 'Caption 0',
    credit: 'Credit 0',
    key: 'file-0-0',
  });
});

test('slideshow autoplay never runs for reduced motion, paused playback, or one slide', () => {
  const enabled = {
    autoplay: true,
    paused: false,
    reducedMotion: false,
    slideCount: 3,
  };

  assert.equal(shouldRunSlideshowAutoplay(enabled), true);
  assert.equal(shouldRunSlideshowAutoplay({ ...enabled, reducedMotion: true }), false);
  assert.equal(shouldRunSlideshowAutoplay({ ...enabled, paused: true }), false);
  assert.equal(shouldRunSlideshowAutoplay({ ...enabled, autoplay: false }), false);
  assert.equal(shouldRunSlideshowAutoplay({ ...enabled, slideCount: 1 }), false);
});

test('slideshow interval and index helpers enforce safe boundaries', () => {
  assert.equal(slideshowInterval(), DEFAULT_AUTOPLAY_INTERVAL_MS);
  assert.equal(slideshowInterval(100), MINIMUM_AUTOPLAY_INTERVAL_MS);
  assert.equal(slideshowInterval(8000), 8000);
  assert.equal(wrappedSlideIndex(-1, 3), 2);
  assert.equal(wrappedSlideIndex(3, 3), 0);
  assert.equal(wrappedSlideIndex(7, 3), 1);
  assert.equal(wrappedSlideIndex(1, 0), 0);
});
