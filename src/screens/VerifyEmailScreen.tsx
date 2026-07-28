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
  const continuedRef = useRef(false);

  const goContinue = () => {
    if (continuedRef.current) return;
    continuedRef.current = true;
    onContinue();
  };

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
      // Advance automatically once the code is confirmed.
      window.setTimeout(goContinue, 800);
    } else {
      // Keep the entered code visible so the error message actually shows and
      // the user can correct it. (Clearing it here used to instantly re-hide the
      // error via the effect below, making a rejected code look like a no-op.)
      setError(true);
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
          status={verified ? 'success' : error ? 'error' : 'default'}
        />
      </div>
      {error && (
        <p className={styles.error}>
          That code is incorrect or has expired. Try again or resend a new one.
        </p>
      )}
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
        onClick={verified ? goContinue : handleVerify}
      />
      {!verified && (
        <button className={styles.changeEmail} onClick={onChangeEmail}>
          Change Email
        </button>
      )}
    </div>
  );
}
