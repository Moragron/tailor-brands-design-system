import type { Preview } from '@storybook/react-vite';
import '../tokens/tokens.css';
import '../src/styles/foundation.css';
import '../src/styles/base.css';
import '../src/styles/depth.css';
import './preview.css';

const preview: Preview = {
  // Toolbar switch between the measured flat look and the opt-in layered look (depth.css).
  globalTypes: {
    depth: {
      description: 'Flat (measured) or layered (depth.css)',
      toolbar: {
        title: 'Depth',
        icon: 'component',
        items: [
          { value: 'flat', title: 'Flat (measured)' },
          { value: 'layered', title: 'Layered (depth.css)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { depth: 'flat' },
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    options: { storySort: { order: ['Tokens', 'Components', 'Patterns'] } },
  },
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.tbDepth = context.globals.depth === 'layered' ? 'layered' : 'flat';
      return <Story />;
    },
    (Story) => (
      // data-tb-story marks the rendered story (used by screenshot tooling).
      <div data-tb-story>
        <Story />
      </div>
    ),
  ],
};
export default preview;
