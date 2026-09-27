import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)', '../src/**/*.mdx'],
  framework: { name: '@storybook/react-vite', options: {} },
  // Reference captures are served next to stories for side-by-side visual QA.
  staticDirs: [{ from: '../reference', to: '/reference' }],
};
export default config;
