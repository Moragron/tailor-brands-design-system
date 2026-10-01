import type { Meta, StoryObj } from '@storybook/react-vite';
import { StepLayout } from './StepLayout';
import { Button } from '../Button/Button';
import { ProgressStepper } from '../ProgressStepper/ProgressStepper';
import { PromoBanner } from '../PromoBanner/PromoBanner';

const meta = { title: 'Components/StepLayout', component: StepLayout, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof StepLayout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    brand: 'Your logo',
    top: <ProgressStepper current={1} total={4} />,
    footer: <><Button variant="secondary">Back</Button><Button>Continue</Button></>,
    children: <><h1 className="tb-h1">Page heading</h1><p className="tb-body">Supporting text.</p></>,
  },
};
export const WithBanner: Story = {
  args: { ...Default.args, banner: <PromoBanner icon="✨" onDismiss={() => {}}>Announcement text</PromoBanner>, children: <h1 className="tb-h1">Page heading</h1> },
};
