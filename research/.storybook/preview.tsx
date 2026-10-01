import type { Preview } from '@storybook/react-vite';
import { ReferencePanel } from '../prototype/storybook/ReferencePanel';
import '../../src/styles/tw3/index.css';
import '../../src/styles/base.css';
import '../../.storybook/preview.css';

const preview: Preview = {
  parameters: { layout: 'padded', controls: { expanded: true } },
  decorators: [
    (Story, ctx) => (
      <div className="sb-frame">
        {/* data-tb-story is the element visual-qa and selftest screenshot/probe */}
        <div data-tb-story>
          <Story />
        </div>
        <ReferencePanel reference={ctx.parameters.reference} />
      </div>
    ),
  ],
};
export default preview;
