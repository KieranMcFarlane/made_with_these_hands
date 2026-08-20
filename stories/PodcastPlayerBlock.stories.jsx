import PodcastPlayerBlock from '../app/podcast-player-block';
import { content, podcastItem } from './mwth-story-data';

const meta = {
  title: 'MWTH/Blocks/Podcast Player',
  component: PodcastPlayerBlock,
  args: {
    content,
    item: podcastItem,
  },
  parameters: {
    docs: {
      description: {
        component: 'A tenant-safe podcast player using Directus data and trusted open-source Media Chrome controls.',
      },
    },
  },
};

export default meta;

export const Feature = {};

export const Compact = {
  args: {
    item: {
      ...podcastItem,
      variant: 'compact',
      title: 'Compact player for episode pages.',
    },
  },
};

export const MissingAudio = {
  args: {
    item: {
      ...podcastItem,
      audio_url: '',
      podbean_url: '',
      title: 'Episode record waiting for audio.',
    },
  },
};
