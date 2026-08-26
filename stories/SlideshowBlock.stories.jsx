import SlideshowBlock from '../app/slideshow-block';
import { slideshowItem } from './mwth-story-data';

const meta = {
  title: 'MWTH/Blocks/Slideshow',
  component: SlideshowBlock,
  args: {
    item: slideshowItem,
  },
  parameters: {
    docs: {
      description: {
        component: 'A governed slideshow block with captions, counters, thumbnail variant, and reduced-motion-aware autoplay.',
      },
    },
  },
};

export default meta;

export const Editorial = {};

export const ThumbnailRail = {
  args: {
    item: {
      ...slideshowItem,
      variant: 'thumbnail-rail',
      title: 'Thumbnail rail for object and maker stories.',
    },
  },
};

export const AutoplayConfigured = {
  args: {
    item: {
      ...slideshowItem,
      autoplay: true,
      interval: 4000,
      title: 'Autoplay remains gated by reduced motion.',
    },
  },
};
