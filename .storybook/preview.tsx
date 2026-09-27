import type { Preview } from '@storybook/react-vite';
import tokens from '../tokens/tokens.json';
import { ReferencePanel } from '../src/storybook/ReferencePanel';
import '../tokens/tokens.css';
import '../src/styles/base.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    options: { storySort: { order: ['Docs', 'Tokens', 'Components', 'Onboarding flow'] } },
  },
  decorators: [
    (Story, ctx) => (
      <div className="sb-frame">
        {tokens.$meta.status !== 'observed' && (
          <div className="sb-token-status" role="note">
            Tokens: <strong>{tokens.$meta.status}</strong> — values are not yet Tailor Brands' observed values. See README → Known gaps.
          </div>
        )}
        {/* data-tb-story is the element visual-qa screenshots */}
        <div data-tb-story>
          <Story />
        </div>
        <ReferencePanel reference={ctx.parameters.reference} />
      </div>
    ),
  ],
};
export default preview;
