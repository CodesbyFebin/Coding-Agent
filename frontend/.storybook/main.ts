import type { StorybookConfig } from '@storybook/react-vite';
import { defineConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (cfg) =>
    defineConfig({
      ...cfg,
      resolve: {
        ...cfg.resolve,
        alias: {
          ...(cfg.resolve ?? {}).alias,
          '@': new URL('./src', import.meta.url).pathname,
        },
      },
    }) as typeof cfg,
};

export default config;
