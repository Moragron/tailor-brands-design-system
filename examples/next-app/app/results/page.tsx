import { Button, GatedContent, GroupedList, Modal, StepLayout, Tabs, TextInput } from 'tailor-brands-design-system';

// A result page behind a sign-in gate, built only from design-system components.
export default function ResultsPage() {
  return (
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
        <Tabs
          tabs={[
            { id: 'now', label: 'Now', content: <GroupedList groups={[{ heading: 'Group A', items: ['Item one', 'Item two'] }]} /> },
            { id: 'later', label: 'Later', content: <p className="tb-body">More items.</p> },
          ]}
        />
      </StepLayout>
    </GatedContent>
  );
}
