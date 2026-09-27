import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AutocompleteInput } from './AutocompleteInput';
import { Button } from '../Button/Button';
import { US_STATES } from '../../data/usStates';

const meta = {
  title: 'Components/AutocompleteInput',
  component: AutocompleteInput,
  parameters: { reference: { screenshot: '02-business-state__autocomplete-open.png', note: '1/6 state autocomplete' } },
} satisfies Meta<typeof AutocompleteInput>;
export default meta;

export const StateWithGatedNext: StoryObj = {
  name: 'State picker + Next gated on selection (observed)',
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
        <AutocompleteInput label="Where will your business be based?" hideLabel options={US_STATES} value={value} onChange={setValue} />
        <Button disabled={!value}>Next</Button>
      </div>
    );
  },
};
