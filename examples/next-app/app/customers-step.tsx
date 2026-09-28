'use client';

// Interactive screens are client components: they own the answer state.
import { useState } from 'react';
import { Button, ChipGroup, FlowLayout, ProgressStepper } from 'tailor-brands-design-system';

const CUSTOMERS = ['Local surfers', 'Visiting surfers', 'Beginner', 'Experienced', 'Families', 'Surf lesson students', 'Still figuring out'];

export function CustomersStep({ businessName }: { businessName: string }) {
  const [value, setValue] = useState<string[]>([]);
  const [other, setOther] = useState('');
  return (
    <FlowLayout
      top={<ProgressStepper current={4} total={6} />}
      footer={<Button disabled={value.length === 0 && !other.trim()}>Next</Button>}
    >
      {/* Render the business name exactly as typed (the live site truncated it). */}
      <h1 className="tb-h1">Who are {businessName}’s customers?</h1>
      <ChipGroup label="Customers" options={CUSTOMERS} value={value} onChange={setValue} freeText={{ value: other, onChange: setOther }} />
      {/* Tailwind utilities mapped from tokens (tokens/tailwind.css) */}
      <p className="text-tb-caption text-tb-text-muted">Pick as many as apply.</p>
    </FlowLayout>
  );
}
