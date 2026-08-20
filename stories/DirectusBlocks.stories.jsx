import { DirectusBlock, DirectusBlocks } from '../app/directus-blocks';
import {
  block,
  content,
  heroBlock,
  listingBlock,
  podcastItem,
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

export const Listing = {
  args: {
    block: listingBlock,
    content,
  },
};

export const PageSequence = {
  render: () => (
    <DirectusBlocks
      blocks={[
        heroBlock,
        textBlock,
        listingBlock,
        block('block_slideshow', slideshowItem, { sort: 40 }),
        block('block_podcast_player', podcastItem, { sort: 50 }),
      ]}
      content={content}
      slot="main"
    />
  ),
};
