import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AddOnCard, AddOnItem } from '../components/AddOnCard/AddOnCard';
import { Button } from '../components/Button/Button';
import { GatedContent, Modal } from '../components/Modal/Modal';
import { PricingCard } from '../components/PricingCard/PricingCard';
import { ProgressStepper } from '../components/ProgressStepper/ProgressStepper';
import { ChipGroup } from '../components/SelectionChip/SelectionChip';
import { StepLayout } from '../components/StepLayout/StepLayout';
import { GroupedList, Tabs } from '../components/Tabs/Tabs';
import { TextInput } from '../components/TextInput/TextInput';

// Composition examples with placeholder content. They show how the components combine,
// not any particular product's copy.
const meta = { title: 'Patterns', parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;

export const QuestionStep: StoryObj = {
  name: 'Question step',
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <StepLayout
        brand="Your logo"
        top={<ProgressStepper current={2} total={5} />}
        footer={<><Button variant="secondary">Back</Button><Button disabled={!value.length}>Continue</Button></>}
      >
        <h1 className="tb-h1">Ask one clear question per page</h1>
        <p className="tb-caption">Choose all that apply</p>
        <ChipGroup label="Ask one clear question per page" options={['Option A', 'Option B', 'Option C', 'Option D']} value={value} onChange={setValue} />
      </StepLayout>
    );
  },
};

export const ReviewStep: StoryObj = {
  name: 'Review step with optional extras',
  render: () => {
    const [added, setAdded] = useState<Record<string, boolean>>({ a: false, b: false });
    const set = (k: string) => (v: boolean) => setAdded((x) => ({ ...x, [k]: v }));
    return (
      <StepLayout
        brand="Your logo"
        top={<ProgressStepper variant="sections" sections={['Details', 'Extras', 'Review']} activeIndex={1} />}
        footer={<><Button variant="secondary">Back</Button><Button>Continue</Button></>}
      >
        <h1 className="tb-h2">Recommended extras</h1>
        <AddOnCard title="Optional">
          <AddOnItem title="First extra" price="$9/mo" added={added.a} onChange={set('a')} />
          <AddOnItem title="Second extra" price="$5/mo" added={added.b} onChange={set('b')} />
        </AddOnCard>
      </StepLayout>
    );
  },
};

export const GatedResult: StoryObj = {
  name: 'Result behind a sign-in gate',
  render: () => (
    <GatedContent
      locked
      gate={
        <Modal open title="Create an account to see your results">
          <TextInput label="Email" type="email" />
          <TextInput label="Password" type="password" />
          <Button fullWidth>Continue</Button>
        </Modal>
      }
    >
      <StepLayout brand="Your logo">
        <h1 className="tb-h1">Your results</h1>
        <Tabs tabs={[
          { id: 'now', label: 'Now', content: <GroupedList groups={[{ heading: 'Group A', items: ['Item one', 'Item two'] }]} /> },
          { id: 'later', label: 'Later', content: <p className="tb-body">More items.</p> },
        ]} />
      </StepLayout>
    </GatedContent>
  ),
};

export const PricingPage: StoryObj = {
  name: 'Pricing',
  render: () => (
    <StepLayout brand="Your logo">
      <h1 className="tb-h1">Choose a plan</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16 }}>
        <PricingCard name="Basic" price="$0" features={['Feature one', 'Feature two']} ctaLabel="Choose" />
        <PricingCard name="Plus" price="$12" period="/mo" badge="Most popular" highlighted features={['Everything in Basic', 'Feature three']} ctaLabel="Choose" />
        <PricingCard name="Pro" price="$29" period="/mo" features={['Everything in Plus', 'Feature four']} ctaLabel="Choose" />
      </div>
    </StepLayout>
  ),
};
