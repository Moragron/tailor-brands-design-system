import { useId, useState, type FormEvent } from 'react';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';
import { TextInput } from '../TextInput/TextInput';
import './RegistrationModal.css';

// Verbatim option list from onboarding-flow-notes.md, screen 13.
export const DISCOVERY_OPTIONS = ['YouTube', 'Friend', 'TikTok', 'Google', 'TV', 'AI/ChatGPT', 'Facebook', 'Instagram', 'Other'];

export type RegistrationModalProps = {
  open?: boolean;
  ctaLabel?: string;
  /**
   * The button label the legal line refers to. Defaults to `ctaLabel`, so the two can't drift.
   * The live site shows 'By clicking "Sign up"' above a "Continue" button — reproduce with legalCtaLabel="Sign up".
   */
  legalCtaLabel?: string;
  /** Observed: "Continue with Google" (13-registration__modal.png). */
  googleLabel?: string;
  onSubmit?: (data: Record<string, string>) => void;
};

export function RegistrationModal({ open = true, ctaLabel = 'Continue', legalCtaLabel, googleLabel = 'Continue with Google', onSubmit }: RegistrationModalProps) {
  const id = useId();
  const [password, setPassword] = useState('');
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>);
  };
  return (
    <Modal open={open} title="Register to access your business report for free">
      <form className="tb-registration" onSubmit={submit}>
        <p className="tb-caption tb-registration__lead">This info stays private and won't appear on any public records.</p>
        <Button variant="secondary" fullWidth className="tb-registration__sso">
          <span aria-hidden>G</span> {googleLabel}
        </Button>
        <div className="tb-registration__divider" role="separator"><span>or</span></div>
        <div className="tb-registration__row">
          <TextInput name="firstName" label="First name" autoComplete="given-name" required />
          <TextInput name="lastName" label="Last name" autoComplete="family-name" required />
        </div>
        <TextInput name="phone" label="Phone" type="tel" prefix="+1" autoComplete="tel-national" />
        <TextInput name="email" label="Email" type="email" autoComplete="email" required />
        <TextInput name="password" label="Password" type="password" minLength={6} helper="At least 6 characters" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="tb-field">
          <label htmlFor={`${id}-discover`} className="tb-field__label">How did you discover Tailor Brands?</label>
          <div className="tb-field__control">
            <select id={`${id}-discover`} name="discovery" className="tb-field__input" defaultValue="">
              <option value="" disabled>Select</option>
              {DISCOVERY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <Button type="submit" fullWidth>{ctaLabel}</Button>
        <p className="tb-caption tb-registration__legal">
          {/* Verbatim from the live site (13-registration__modal.png), with the button name taken from ctaLabel. */}
          By clicking “{legalCtaLabel ?? ctaLabel}” you agree to our Terms Of Use and Privacy Policy. In addition, you also agree to
          receive email messages from us about your experience with our service, and features you can use.
        </p>
      </form>
    </Modal>
  );
}
