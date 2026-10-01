'use client';

// Interactive steps are client components: they own the answer state.
import { useState } from 'react';
import { Button, ChipGroup, ProgressStepper, StepLayout } from 'tailor-brands-design-system';

const OPTIONS = ['Option A', 'Option B', 'Option C', 'Option D', 'Option E'];

export function QuestionStep() {
  const [value, setValue] = useState<string[]>([]);
  const [other, setOther] = useState('');
  return (
    <StepLayout
      brand="Your logo"
      top={<ProgressStepper current={2} total={5} />}
      footer={
        <>
          <Button variant="secondary">Back</Button>
          <Button disabled={value.length === 0 && !other.trim()}>Continue</Button>
        </>
      }
    >
      <h1 className="tb-h1">Ask one clear question per page</h1>
      {/* Tailwind utilities generated from the tokens (tokens/tailwind.css) */}
      <p className="text-tb-caption text-tb-text-muted">Choose all that apply</p>
      <ChipGroup
        label="Ask one clear question per page"
        options={OPTIONS}
        value={value}
        onChange={setValue}
        freeText={{ value: other, onChange: setOther, placeholder: 'Something else…' }}
      />
    </StepLayout>
  );
}
