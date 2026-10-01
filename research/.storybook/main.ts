import type { StorybookConfig } from '@storybook/react-vite';

// Research Storybook (not published): the Tailor Brands flow prototype, rendered next to live captures.
const config: StorybookConfig = {
  stories: ['../prototype/**/*.stories.@(ts|tsx)'],
  framework: { name: '@storybook/react-vite', options: {} },
  staticDirs: [{ from: '../reference', to: '/reference' }],
};
export default config;
