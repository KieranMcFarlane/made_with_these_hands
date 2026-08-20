import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, '..');

const config = {
  stories: ['../stories/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../public'],
  viteFinal: async (config) => ({
    ...config,
    resolve: {
      ...(config.resolve || {}),
      alias: {
        ...(config.resolve?.alias || {}),
        '@': root,
        'next/image': path.resolve(dirname, 'next-image.jsx'),
      },
    },
  }),
};

export default config;
