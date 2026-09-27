import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlowLayout } from './FlowLayout';
import { Button } from '../Button/Button';
import { ProgressStepper } from '../ProgressStepper/ProgressStepper';
import { PromoBanner } from '../PromoBanner/PromoBanner';

const meta = {
  title: 'Components/FlowLayout',
  component: FlowLayout,
  parameters: { layout: 'fullscreen', reference: { screenshot: '02-business-state.png', note: 'Onboarding page shell' } },
} satisfies Meta<typeof FlowLayout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const QuestionScreen: Story = {
  args: {
    top: <ProgressStepper current={1} total={6} />,
    footer: <Button disabled>Next</Button>,
    children: <h1 className="tb-h1">Where will your business be based?</h1>,
  },
};
export const RecommendationScreen: Story = {
  args: {
    banner: <PromoBanner emoji="🎁" onDismiss={() => {}}>Get up to $50 in Amazon gift card</PromoBanner>,
    top: <ProgressStepper variant="sections" sections={['Entity', 'Liability', 'Branding']} activeIndex={1} />,
    footer: <Button>Next</Button>,
    children: <h1 className="tb-h2">People don’t know that an LLC alone won’t fully protect your personal assets.</h1>,
  },
  parameters: { reference: { screenshot: '11-liability.png' } },
};
