import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AutocompleteInput } from './AutocompleteInput';
import { Button } from '../Button/Button';

const OPTIONS = ['Amber', 'Azure', 'Coral', 'Emerald', 'Indigo', 'Ivory', 'Jade', 'Lavender', 'Olive', 'Ruby', 'Sapphire', 'Teal'];

const meta = { title: 'Components/AutocompleteInput', component: AutocompleteInput } satisfies Meta<typeof AutocompleteInput>;
export default meta;

export const WithGatedAction: StoryObj = {
  name: 'Picker + action enabled once an option is chosen',
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
        <AutocompleteInput label="Colour" options={OPTIONS} value={value} onChange={setValue} placeholder="Start typing…" />
        <Button disabled={!value}>Continue</Button>
      </div>
    );
  },
};
