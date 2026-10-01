import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { GatedContent, Modal } from './Modal';
import { Button } from '../Button/Button';
import { TextInput } from '../TextInput/TextInput';

const meta = { title: 'Components/Modal', component: Modal } satisfies Meta<typeof Modal>;
export default meta;

const Background = () => (
  <div style={{ display: 'grid', gap: 12, padding: 24 }}>
    <h1 className="tb-h1">Content behind the gate</h1>
    {Array.from({ length: 6 }, (_, i) => <p key={i} className="tb-body">Line of content {i + 1}</p>)}
  </div>
);

export const Gate: StoryObj = {
  name: 'Gate over blurred content',
  render: () => (
    <GatedContent locked gate={<Modal open title="Sign in to continue"><TextInput label="Email" type="email" /><Button fullWidth>Continue</Button></Modal>}>
      <Background />
    </GatedContent>
  ),
};
export const Dismissible: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <GatedContent locked={open} gate={<Modal open={open} title="Dialog title" onClose={() => setOpen(false)}><p className="tb-body">Dialog body.</p><Button fullWidth onClick={() => setOpen(false)}>Done</Button></Modal>}>
        <Background />
        {!open && <Button onClick={() => setOpen(true)}>Open again</Button>}
      </GatedContent>
    );
  },
};
