import { useEffect, useState } from 'react';
import { AutocompleteInput } from '../components/AutocompleteInput/AutocompleteInput';
import { AssistantMessage } from '../components/AssistantMessage/AssistantMessage';
import { Button } from '../components/Button/Button';
import { ChipGroup } from '../components/SelectionChip/SelectionChip';
import { GatedContent } from '../components/Modal/Modal';
import { PercentLoader, useSimulatedProgress } from '../components/PercentLoader/PercentLoader';
import { ProgressStepper } from '../components/ProgressStepper/ProgressStepper';
import { PromoBanner } from '../components/PromoBanner/PromoBanner';
import { RegistrationModal } from '../components/RegistrationModal/RegistrationModal';
import { SelectionCardGroup } from '../components/SelectionCard/SelectionCard';
import { SuiteCard, SuiteItem } from '../components/SuiteCard/SuiteCard';
import { TextInput } from '../components/TextInput/TextInput';
import { TimelineTabs } from '../components/TimelineTabs/TimelineTabs';
import { LAUNCH_PLAN_TABS, SCANNING_MESSAGES } from '../data/flowContent';
import { NOT_CAPTURED } from '../data/notCaptured';
import { US_STATES } from '../data/usStates';
import { FlowLayout } from './FlowLayout';
import { buggyShortName, displayName } from './businessName';

export const STEPS = [
  'home', 'intro', 'business-state', 'business-activity', 'about-your-business-1', 'about-your-business-2',
  'about-your-business-3', 'business-expenses', 'scanning', 'blueprint', 'entity', 'liability', 'branding', 'registration',
] as const;
export type Step = (typeof STEPS)[number];

export type OnboardingFlowProps = {
  initialStep?: Step;
  businessName?: string;
  /** Reproduce the observed "Swell Salt" name-truncation bug */
  reproduceNameBug?: boolean;
  /** Reproduce the observed 'By clicking "Sign up"' vs "Continue" mismatch */
  reproduceCopyMismatch?: boolean;
  /** Pre-add suite items (observed default). false = the opt-in growth variant. */
  preAddSuites?: boolean;
  /** Scanning duration; observed ≈15s */
  scanMs?: number;
};

const info = [
  { heading: 'What', body: NOT_CAPTURED },
  { heading: 'Why important', body: NOT_CAPTURED },
  { heading: 'What we do', body: NOT_CAPTURED },
];

export function OnboardingFlow({
  initialStep = 'home', businessName = 'Swell & Salt Surf Co.', reproduceNameBug = true,
  reproduceCopyMismatch = true, preAddSuites = true, scanMs = 15000,
}: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>(initialStep);
  const [name, setName] = useState(businessName);
  const [state, setState] = useState<string | null>(null);
  const [activity, setActivity] = useState('');
  const [owners, setOwners] = useState<string[]>([]);
  const [customers, setCustomers] = useState<string[]>([]);
  const [customersOther, setCustomersOther] = useState('');
  const [channels, setChannels] = useState<string[]>([]);
  const [revenue, setRevenue] = useState<string | null>(null);
  const [bannerShown, setBannerShown] = useState(true);
  const [updates, setUpdates] = useState(false);
  const [suite, setSuite] = useState<Record<string, boolean>>(
    Object.fromEntries(['Annual Report', 'EIN', 'Operating Agreement', 'Website', 'Domain'].map((k) => [k, preAddSuites])),
  );
  const shown = reproduceNameBug ? buggyShortName(name) : displayName(name);
  const next = () => setStep(STEPS[Math.min(STEPS.indexOf(step) + 1, STEPS.length - 1)]);
  const nextBtn = (disabled = false, label = 'Next') => <Button onClick={next} disabled={disabled}>{label}</Button>;
  const counter = (n: number) => <ProgressStepper current={n} total={6} />;
  const sections = (i: number) => <ProgressStepper variant="sections" sections={['Entity', 'Liability', 'Branding']} activeIndex={i} />;
  const item = (k: string) => <SuiteItem key={k} title={k} info={['Website', 'Domain'].includes(k) ? undefined : info} added={suite[k]} onChange={(v) => setSuite((s) => ({ ...s, [k]: v }))} />;
  const banner = bannerShown && <PromoBanner emoji="🎁" onDismiss={() => setBannerShown(false)}>Get up to $50 in Amazon gift card</PromoBanner>;

  switch (step) {
    case 'home':
      return (
        <FlowLayout>
          <h1 className="tb-h1">Start Your Business. Worry Free.</h1>
          <TextInput label="Business name" hideLabel value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={next} disabled={!name.trim()}>Start</Button>
        </FlowLayout>
      );
    case 'intro':
      return (
        <FlowLayout footer={nextBtn()}>
          <h1 className="tb-h1">Before we begin</h1>
          <AssistantMessage><p>I’m so happy you’re starting this journey… I’ll handle the paperwork.</p></AssistantMessage>
        </FlowLayout>
      );
    case 'business-state':
      return (
        <FlowLayout top={counter(1)} footer={nextBtn(!state)}>
          <h1 className="tb-h1">Where will your business be based?</h1>
          <AutocompleteInput label="Where will your business be based?" hideLabel options={US_STATES} value={state} onChange={setState} />
        </FlowLayout>
      );
    case 'business-activity':
      return (
        <FlowLayout top={counter(2)} footer={nextBtn(!activity.trim())}>
          <h1 className="tb-h1">What does your business do?</h1>
          <TextInput label="What does your business do?" hideLabel helper="Plain English — a few words is plenty" value={activity} onChange={(e) => setActivity(e.target.value)} />
        </FlowLayout>
      );
    case 'about-your-business-1':
      return (
        <FlowLayout top={counter(3)} footer={nextBtn()}>
          <h1 className="tb-h1">Who owns and runs {shown} day to day?</h1>
          <p className="tb-not-captured">AI-personalised chip labels on this screen were not recorded.</p>
          <ChipGroup label="Owners" options={['Option 1 (not captured)', 'Option 2 (not captured)', 'Option 3 (not captured)']} value={owners} onChange={setOwners} />
        </FlowLayout>
      );
    case 'about-your-business-2':
      return (
        <FlowLayout top={counter(4)} footer={nextBtn()}>
          <h1 className="tb-h1">Who are {shown}’s customers?</h1>
          <ChipGroup
            label="Customers"
            options={['Local surfers', 'Visiting surfers', 'Beginner', 'Experienced', 'Families', 'Surf lesson students', 'Still figuring out']}
            value={customers} onChange={setCustomers} freeText={{ value: customersOther, onChange: setCustomersOther }}
          />
        </FlowLayout>
      );
    case 'about-your-business-3':
      return (
        <FlowLayout top={counter(5)} footer={nextBtn()}>
          <h1 className="tb-h1">How do customers get your surf gear and lessons?</h1>
          <ChipGroup label="Channels" options={['In-store pickup', 'Local delivery', 'In-person lessons', 'Online lessons']} value={channels} onChange={setChannels} />
        </FlowLayout>
      );
    case 'business-expenses':
      return (
        <FlowLayout top={counter(6)} footer={nextBtn(!revenue)}>
          <h1 className="tb-h1">How much do you bring in each month?</h1>
          <p className="tb-caption">This helps set up your books and taxes.</p>
          <SelectionCardGroup
            label="Monthly revenue" value={revenue} onChange={setRevenue}
            options={[{ value: 'not-yet', label: 'Not yet' }, { value: 'gt-25k', label: '>$25k', description: 'Intermediate bands not recorded' }, { value: 'prefer-not', label: 'Prefer not to say' }]}
          />
        </FlowLayout>
      );
    case 'scanning':
      return <Scanning durationMs={scanMs} onDone={next} />;
    case 'blueprint':
      return (
        <FlowLayout footer={nextBtn()}>
          <h1 className="tb-h1">Your business blueprint is almost ready.</h1>
          <div className="tb-blueprint">
            <section><h2 className="tb-h3">Part 1 · Now</h2><ol><li>Choose Entity</li><li>Limit Liability</li><li>Build Brand</li></ol></section>
            {/* Observed copy, typo included ("filling" → should be "filing"). See README → Growth notes. */}
            <section><h2 className="tb-h3">Part 2 · After filling [sic]</h2><ol><li>Protect Privacy</li><li>Find Permits</li><li>Manage Finances</li></ol></section>
          </div>
        </FlowLayout>
      );
    case 'entity':
      return (
        <FlowLayout banner={banner} top={sections(0)} footer={nextBtn()}>
          <EntityCopy />
          <SuiteCard title="ADD-ON">
            <SuiteItem title="Business Updates & Notification" badge="*FREE" mode="choice" added={updates} onChange={setUpdates} />
          </SuiteCard>
        </FlowLayout>
      );
    case 'liability':
      return (
        <FlowLayout banner={banner} top={sections(1)} footer={nextBtn()}>
          <h1 className="tb-h2">People don’t know that an LLC alone won’t fully protect your personal assets.</h1>
          <SuiteCard title="PERSONAL LIABILITY SUITE">{['Annual Report', 'EIN', 'Operating Agreement'].map(item)}</SuiteCard>
        </FlowLayout>
      );
    case 'branding':
      return (
        <FlowLayout banner={banner} top={sections(2)} footer={nextBtn()}>
          <h1 className="tb-h2">Before customers buy your surfboards, they Google you…</h1>
          <p className="tb-body">If swellsaltsurfco.com or similar domain is unavailable… {NOT_CAPTURED}</p>
          <SuiteCard title="BRANDING SUITE">{['Website', 'Domain'].map(item)}</SuiteCard>
        </FlowLayout>
      );
    case 'registration':
      return (
        <GatedContent locked gate={<RegistrationModal ctaLabel="Continue" legalCtaLabel={reproduceCopyMismatch ? 'Sign up' : undefined} />}>
          <FlowLayout>
            <p className="tb-caption">I know it can be overwhelming sometimes</p>
            <h1 className="tb-h1">Your Custom Launch Plan is Ready</h1>
            <p className="tb-caption">{displayName(name)} · {NOT_CAPTURED}</p>
            <TimelineTabs tabs={LAUNCH_PLAN_TABS} />
          </FlowLayout>
        </GatedContent>
      );
  }
}

function Scanning({ durationMs, onDone }: { durationMs: number; onDone: () => void }) {
  const { percent, message } = useSimulatedProgress(SCANNING_MESSAGES, durationMs, onDone);
  return <FlowLayout><PercentLoader percent={percent} message={message} /></FlowLayout>;
}

function EntityCopy() {
  const [thinking, setThinking] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setThinking(false), 1500); // duration of the live "Thinking" state was not measured
    return () => clearTimeout(t);
  }, []);
  return (
    <AssistantMessage thinking={thinking}>
      <p>…focus on serving surfers with boards, wetsuits and lessons knowing your home and personal savings are protected… California LLC is best fit.</p>
    </AssistantMessage>
  );
}
