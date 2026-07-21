import { useState } from 'react';

import {
  AccountType,
  Checkbox,
  MailIcon,
  PhoneIcon,
  PrimaryButton,
  TextField,
  UserIcon,
} from '../components/ui';
import styles from './RegistrationScreen.module.css';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export type RegistrationDetails = {
  fullName: string;
  email: string;
  phone: string;
};

type Props = {
  accountType: AccountType;
  onSubmit: (details: RegistrationDetails) => void;
  onLogin: () => void;
};

export default function RegistrationScreen({ accountType, onSubmit, onLogin }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);

  const roleLabel = accountType === 'student' ? 'Student' : 'Client';
  const canSubmit =
    fullName.trim().length > 0 && EMAIL_PATTERN.test(email.trim()) && agreed;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim() });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.title}>{roleLabel}{'\n'}Registration</p>
        <p className={styles.subtitle}>Create your account to get verified</p>

        <div className={styles.form}>
          <TextField
            icon={<UserIcon />}
            placeholder="Full Name"
            value={fullName}
            onChange={setFullName}
          />
          <TextField
            icon={<MailIcon />}
            placeholder="Email Address"
            value={email}
            onChange={setEmail}
            type="email"
          />
          <TextField
            icon={<PhoneIcon />}
            placeholder="Phone Number"
            value={phone}
            onChange={setPhone}
            type="tel"
          />
        </div>

        <p className={styles.passwordless}>
          No password needed — we’ll email you a 6-digit code to verify your
          account.
        </p>

        <div className={styles.consentRow}>
          <Checkbox checked={agreed} onToggle={() => setAgreed((a) => !a)} />
          <span className={styles.consentText}>
            I agree to the{'  '}
            <span className={styles.consentLink}>Terms & Privacy Policy</span>
          </span>
        </div>

        <div className={styles.submit}>
          <PrimaryButton
            label="Create Account"
            showIcon={false}
            fullWidth
            disabled={!canSubmit}
            onClick={handleSubmit}
          />
        </div>

        <div className={styles.loginRow}>
          <span className={styles.loginText}>Already have an account? </span>
          <button className={styles.loginLink} onClick={onLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
