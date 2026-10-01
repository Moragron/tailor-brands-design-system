// Showcase of every component with placeholder copy. Lives in src/pages/, so Lovable never copies it
// into connected projects. Built only from the barrel, tokens and token utilities, like a consumer.
import { useEffect, useState, type ReactNode } from 'react';
import {
  AddOnCard,
  AddOnItem,
  AssistantMessage,
  AutocompleteInput,
  Button,
  ChipGroup,
  GatedContent,
  GroupedList,
  InfoDrawer,
  Modal,
  PercentLoader,
  PricingCard,
  ProgressStepper,
  PromoBanner,
  SelectionCardGroup,
  StepLayout,
  Tabs,
  TextInput,
} from '../index';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-(--tb-space-4) border-t border-tb-border-default pt-(--tb-space-8)">
      <h2 className="tb-h2">{title}</h2>
      {children}
    </section>
  );
}

export function Showcase() {
  const [layered, setLayered] = useState(false);
  const [chips, setChips] = useState<string[]>(['Option B']);
  const [single, setSingle] = useState<string[]>([]);
  const [freeText, setFreeText] = useState('');
  const [card, setCard] = useState<string | null>(null);
  const [place, setPlace] = useState<string | null>(null);
  const [extras, setExtras] = useState({ a: true, b: false, c: false });
  const [modalOpen, setModalOpen] = useState(false);
  const [locked, setLocked] = useState(true);
  const [percent, setPercent] = useState(40);

  // Same switch the Storybook toolbar uses: depth.css is imported, data-tb-depth="flat" opts out.
  useEffect(() => {
    document.documentElement.dataset.tbDepth = layered ? 'layered' : 'flat';
  }, [layered]);

  return (
    <>
      <PromoBanner onDismiss={() => undefined} dismissLabel="Dismiss">
        Announcement strip: short message with an optional dismiss button
      </PromoBanner>
      <StepLayout
        brand={<span className="font-tb-heading text-tb-h3 text-tb-text-primary">Your logo</span>}
        top={<ProgressStepper current={2} total={5} />}
        footer={
          <>
            <Button variant="secondary" onClick={() => setLayered((v) => !v)}>
              {layered ? 'Show flat look' : 'Show layered look'}
            </Button>
            <Button disabled={!chips.length}>Primary action</Button>
          </>
        }
      >
        <h1 className="tb-h1">Design system showcase</h1>
        <p className="tb-body">
          Every component with placeholder copy. The footer button switches between the measured flat look and the
          opt-in layered look (depth.css).
        </p>

        <Section title="Buttons">
          <div className="flex flex-wrap gap-(--tb-space-2)">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button disabled>Disabled</Button>
          </div>
          <Button fullWidth>Full width</Button>
        </Section>

        <Section title="Progress">
          <ProgressStepper current={3} total={5} />
          <ProgressStepper variant="sections" sections={['Details', 'Extras', 'Review']} activeIndex={1} />
        </Section>

        <Section title="Chips">
          <ChipGroup
            label="Multi-select"
            options={['Option A', 'Option B', 'Option C', 'Option D']}
            value={chips}
            onChange={setChips}
            freeText={{ value: freeText, onChange: setFreeText, placeholder: 'Something else', label: 'Other' }}
          />
          <ChipGroup label="Single-select" mode="single" options={['Yes', 'No', 'Not sure']} value={single} onChange={setSingle} />
        </Section>

        <Section title="Selection cards">
          <SelectionCardGroup
            label="Pick one"
            value={card}
            onChange={setCard}
            options={[
              { value: 'a', label: 'First choice', description: 'A short description of this option' },
              { value: 'b', label: 'Second choice', description: 'A short description of this option' },
              { value: 'c', label: 'Third choice' },
            ]}
          />
        </Section>

        <Section title="Inputs">
          <TextInput label="Email" type="email" placeholder="name@example.com" helper="Helper text" />
          <TextInput label="Phone" type="tel" prefix="+1" />
          <TextInput label="With an error" defaultValue="Invalid value" error="Error message" />
          <AutocompleteInput
            label="Autocomplete"
            options={['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel']}
            value={place}
            onChange={setPlace}
            placeholder="Start typing"
          />
        </Section>

        <Section title="Add-ons and disclosure">
          <AddOnCard title="Optional extras">
            <AddOnItem title="First extra" price="$9/mo" badge="Popular" added={extras.a} onChange={(a) => setExtras((x) => ({ ...x, a }))} />
            <AddOnItem
              title="Second extra"
              description="One line about what this adds"
              price="$5/mo"
              added={extras.b}
              onChange={(b) => setExtras((x) => ({ ...x, b }))}
            />
            <AddOnItem
              title="Third extra"
              mode="choice"
              addLabel="Add"
              skipLabel="Skip"
              added={extras.c}
              onChange={(c) => setExtras((x) => ({ ...x, c }))}
            />
          </AddOnCard>
          <InfoDrawer
            triggerLabel="Learn more"
            sections={[
              { heading: 'First heading', body: 'Supporting text for the first section.' },
              { heading: 'Second heading', body: 'Supporting text for the second section.' },
            ]}
          />
        </Section>

        <Section title="Loading and messages">
          <PercentLoader
            percent={percent}
            label="Progress"
            headline="Working on it"
            message={{ text: 'Status line', source: 'Secondary line' }}
          />
          <div className="flex gap-(--tb-space-2)">
            <Button variant="secondary" onClick={() => setPercent((p) => Math.max(0, p - 20))}>−20%</Button>
            <Button variant="secondary" onClick={() => setPercent((p) => Math.min(100, p + 20))}>+20%</Button>
          </div>
          <AssistantMessage thinking thinkingLabel="Thinking" />
          <AssistantMessage>A conversational message from the assistant.</AssistantMessage>
        </Section>

        <Section title="Tabs and grouped lists">
          <Tabs
            tabs={[
              { id: 'one', label: 'First', content: <GroupedList groups={[{ heading: 'Group A', items: ['Item one', 'Item two'] }, { heading: 'Group B', items: ['Item three'] }]} /> },
              { id: 'two', label: 'Second', content: <p className="tb-body">Second panel.</p> },
            ]}
          />
        </Section>

        <Section title="Pricing">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-(--tb-space-4)">
            <PricingCard name="Basic" price="$0" features={['Feature one', 'Feature two']} ctaLabel="Choose" />
            <PricingCard name="Plus" price="$12" period="/mo" badge="Most popular" highlighted features={['Everything in Basic', 'Feature three']} ctaLabel="Choose" />
            <PricingCard name="Pro" price="$29" period="/mo" features={['Everything in Plus', 'Feature four']} ctaLabel="Choose" />
          </div>
        </Section>

        <Section title="Modal and gated content">
          <Button variant="secondary" onClick={() => setModalOpen(true)}>Open modal</Button>
          <Modal open={modalOpen} title="Dialog title" onClose={() => setModalOpen(false)} closeLabel="Close">
            <p className="tb-body">Dialog content.</p>
            <Button fullWidth onClick={() => setModalOpen(false)}>Confirm</Button>
          </Modal>
          <GatedContent
            locked={locked}
            gate={
              <div className="grid gap-(--tb-space-2) rounded-tb-card bg-tb-surface-card p-(--tb-space-6)">
                <p className="tb-body">Content behind a gate</p>
                <Button onClick={() => setLocked(false)}>Unlock</Button>
              </div>
            }
          >
            <GroupedList groups={[{ heading: 'Gated group', items: ['Hidden item one', 'Hidden item two', 'Hidden item three'] }]} />
          </GatedContent>
        </Section>
      </StepLayout>
    </>
  );
}
