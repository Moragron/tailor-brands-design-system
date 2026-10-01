import type { StorybookConfig } from '@storybook/react-vite';

// Design-system Storybook (published to GitHub Pages): tokens, components, patterns.
// The research prototype has its own config in research/.storybook.
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: { name: '@storybook/react-vite', options: {} },
};
export default config;
