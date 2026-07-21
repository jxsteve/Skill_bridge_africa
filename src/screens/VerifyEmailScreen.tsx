import { useEffect, useRef, useState } from 'react';

import { CheckIcon, OtpInput, PrimaryButton } from '../components/ui';
import styles from './VerifyEmailScreen.module.css';

const RESEND_SECONDS = 45;

type Props = {
  email: string;
  onVerify: (code: string) => Promise<boolean>;
  onContinue: () => void;
  onResend: () => void;
  onChangeEmail: () => void;
};

export default function VerifyEmailScreen({
  email,
  onVerify,
  onContinue,
  onResend,
  onChangeEmail,
}: Props) {
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const verifyingRef = useRef(false);

  const handleVerify = async () => {
    if (verifyingRef.current || verified || code.length !== 6) return;
    verifyingRef.current = true;
    setVerifying(true);
    setError(false);
    const ok = await onVerify(code);
    setVerifying(false);
    verifyingRef.current = false;
    if (ok) {
      setVerified(true);
    } else {
      setError(true);
      setCode('');
    }
  };

  // Clear a previous error as soon as the user edits the code again.
  useEffect(() => {
    if (error && code.length < 6) setError(false);
  }, [code, error]);

  const handleResend = () => {
    setSecondsLeft(RESEND_SECONDS);
    setError(false);
    onResend();
  };

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const countdown = `00:${String(secondsLeft).padStart(2, '0')}`;

  return (
    <div className={styles.container}>
      <p className={styles.title}>Verify Your Email</p>
      <p className={styles.subtitle}>
        We’ve sent a 6-digit code to{'\n'}
        <span className={styles.email}>{email}</span>
      </p>

      <div className={styles.otp}>
        <OtpInput
          value={code}
          onChange={setCode}
          status={verified ? 'success' : 'default'}
        />
      </div>
      {error && <p className={styles.error}>Invalid code. Please try again.</p>}
      {verified ? (
        <div className={styles.successRow}>
          <div className={styles.successBadge}>
            <CheckIcon size={12} strokeWidth={3.5} />
          </div>
          <span className={styles.successText}>Code verified successfully!</span>
        </div>
      ) : (
        <>
          <p className={styles.hint}>Didnt receive the code?</p>
          <button
            className={styles.resend}
            onClick={secondsLeft <= 0 ? handleResend : undefined}
          >
            Resend Code{secondsLeft > 0 ? ` (${countdown})` : ''}
          </button>
        </>
      )}

      <div className={styles.spacer} />

      <PrimaryButton
        label={verified ? 'Continue to Dashboard' : 'Verify Code'}
        showIcon={false}
        fullWidth
        loading={verifying}
        disabled={!verified && code.length !== 6}
        onClick={verified ? onContinue : handleVerify}
      />
      {!verified && (
        <button className={styles.changeEmail} onClick={onChangeEmail}>
          Change Email
        </button>
      )}
    </div>
  );
}
