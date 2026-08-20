export const MAX_SLIDES = 12;
export const MINIMUM_AUTOPLAY_INTERVAL_MS = 4000;
export const DEFAULT_AUTOPLAY_INTERVAL_MS = 6000;

export function slideshowAssetUrl(file) {
  if (!file) return '';
  if (typeof file === 'string') {
    if (file.startsWith('/') || file.startsWith('http://') || file.startsWith('https://')) return file;
    return `/api/assets/${file}`;
  }
  return slideshowAssetUrl(file.id || file.image || file.file);
}

export function normalizeSlideshowSlides(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, MAX_SLIDES).map((slide, index) => {
    if (typeof slide === 'string') {
      return {
        src: slideshowAssetUrl(slide),
        alt: '',
        caption: '',
        credit: '',
        key: `${slide}-${index}`,
      };
    }
    if (!slide || typeof slide !== 'object') return null;
    const src = slideshowAssetUrl(slide.image || slide.file || slide.id);
    if (!src) return null;
    return {
      src,
      alt: slide.image_alt || slide.alt || '',
      caption: slide.caption || '',
      credit: slide.credit || '',
      key: `${slide.id || slide.image || slide.file || 'slide'}-${index}`,
    };
  }).filter(Boolean);
}

export function slideshowInterval(value) {
  return Math.max(Number(value) || DEFAULT_AUTOPLAY_INTERVAL_MS, MINIMUM_AUTOPLAY_INTERVAL_MS);
}

export function shouldRunSlideshowAutoplay({
  autoplay,
  paused,
  reducedMotion,
  slideCount,
}) {
  return Boolean(autoplay && !paused && !reducedMotion && slideCount > 1);
}

export function wrappedSlideIndex(index, slideCount) {
  if (!slideCount) return 0;
  return ((index % slideCount) + slideCount) % slideCount;
}
