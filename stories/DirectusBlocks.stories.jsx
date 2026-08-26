import { DirectusBlock, DirectusBlocks } from '../app/directus-blocks';
import {
  block,
  content,
  ctaBlock,
  heroBlock,
  genericBlock,
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

export const HeroCover = {
  name: 'Hero / cover',
  args: {
    block: {
      ...heroBlock,
      item: {
        ...heroBlock.item,
        key: 'storybook_hero_cover',
        variant: 'cover',
        eyebrow: 'Storybook / cover opening',
        title: 'The workshop fills the frame.',
      },
    },
    content,
  },
};

export const Text = {
  args: {
    block: textBlock,
    content,
  },
};

export const SpacingDensities = {
  name: 'Composition / spacing densities',
  render: () => (
    <main>
      {['compact', 'standard', 'generous'].map((spacing) => (
        <DirectusBlock
          block={{
            ...textBlock,
            id: `storybook-spacing-${spacing}`,
            item: {
              ...textBlock.item,
              key: `storybook_spacing_${spacing}`,
              eyebrow: `Spacing / ${spacing}`,
              title: `${spacing[0].toUpperCase()}${spacing.slice(1)} editorial rhythm.`,
              spacing,
            },
          }}
          content={content}
          key={spacing}
          preview
        />
      ))}
    </main>
  ),
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

export const GenericStorageEnvelope = {
  name: 'Generic storage / approved renderer',
  args: {
    block: genericBlock('block_text', {
      key: 'generic_storage_proof',
      eyebrow: '25 / 25 capacity fix',
      title: 'One validated store, the same approved component.',
      dek: 'Directus stores a component key and declarative data. The application retains control of rendering and behaviour.',
      body: ['This state proves the generic envelope resolves through the existing brand-safe renderer.'],
      theme: 'paper-2',
    }),
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
