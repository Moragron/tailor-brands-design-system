import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PromoBanner } from './PromoBanner';
import { Button } from '../Button/Button';

const meta = { title: 'Components/PromoBanner', component: PromoBanner, args: { icon: '✨', children: 'Announcement text goes here', sticky: false } } satisfies Meta<typeof PromoBanner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Dismissible: Story = {
  render: (args) => {
    const [shown, setShown] = useState(true);
    return shown ? <PromoBanner {...args} onDismiss={() => setShown(false)} /> : <Button variant="secondary" onClick={() => setShown(true)}>Show again</Button>;
  },
};
