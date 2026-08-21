import { DirectusBlock, DirectusBlocks } from '../app/directus-blocks';
import {
  block,
  content,
  ctaBlock,
  heroBlock,
  listingBlock,
  mediaBlock,
  podcastItem,
  quoteBlock,
  slideshowItem,
  textBlock,
} from './mwth-story-data';

const meta = {
  title: 'MWTH/Directus Blocks',
  component: DirectusBlock,
  parameters: {
    docs: {
      description: {
        component: 'Approved Directus page-builder blocks rendered from CMS-shaped data.',
      },
    },
  },
};

export default meta;

export const Hero = {
  args: {
    block: heroBlock,
    content,
  },
};

export const Text = {
  args: {
    block: textBlock,
    content,
  },
};

export const Media = {
  args: {
    block: mediaBlock,
    content,
  },
};

export const Quote = {
  args: {
    block: quoteBlock,
    content,
  },
};

export const Listing = {
  args: {
    block: listingBlock,
    content,
  },
};

export const CallToAction = {
  args: {
    block: ctaBlock,
    content,
  },
};

export const PageSequence = {
  render: () => (
    <DirectusBlocks
      blocks={[
        heroBlock,
        textBlock,
        { ...mediaBlock, sort: 30 },
        { ...quoteBlock, sort: 40 },
        { ...listingBlock, sort: 50 },
        block('block_slideshow', slideshowItem, { sort: 60 }),
        block('block_podcast_player', podcastItem, { sort: 70 }),
        { ...ctaBlock, sort: 80 },
      ]}
      content={content}
      slot="main"
    />
  ),
};
