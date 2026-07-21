import { useState } from 'react';

import { Checkbox, MailIcon, PrimaryButton, TextField } from '../components/ui';
import styles from './LoginScreen.module.css';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

type Props = {
  initialEmail?: string;
  initialRememberMe?: boolean;
  onSubmit: (email: string, rememberMe: boolean) => void;
  onSignUp: () => void;
};

export default function LoginScreen({
  initialEmail = '',
  initialRememberMe = true,
  onSubmit,
  onSignUp,
}: Props) {
  const [email, setEmail] = useState(initialEmail);
  const [rememberMe, setRememberMe] = useState(initialRememberMe);

  const canSubmit = EMAIL_PATTERN.test(email.trim());

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(email.trim(), rememberMe);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.title}>Welcome Back</p>
        <p className={styles.subtitle}>
          Login with your email — we’ll send you{'\n'}a 6-digit code
        </p>

        <div className={styles.form}>
          <TextField
            icon={<MailIcon />}
            placeholder="Email Address"
            value={email}
            onChange={setEmail}
            type="email"
          />
        </div>

        <div className={styles.rememberRow}>
          <Checkbox checked={rememberMe} onToggle={() => setRememberMe((r) => !r)} />
          <span className={styles.rememberText}>Remember my email</span>
        </div>

        <div className={styles.submit}>
          <PrimaryButton
            label="Send Login Code"
            showIcon={false}
            fullWidth
            disabled={!canSubmit}
            onClick={handleSubmit}
          />
        </div>

        <div className={styles.signUpRow}>
          <span className={styles.signUpText}>Don’t have an account? </span>
          <button className={styles.signUpLink} onClick={onSignUp}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
