import type { Preview } from '@storybook/react-vite';
import '../tokens/tokens.css';
import '../src/styles/foundation.css';
import '../src/styles/base.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    options: { storySort: { order: ['Tokens', 'Components', 'Patterns'] } },
  },
  decorators: [
    (Story) => (
      // data-tb-story marks the rendered story (used by screenshot tooling).
      <div data-tb-story>
        <Story />
      </div>
    ),
  ],
};
export default preview;
