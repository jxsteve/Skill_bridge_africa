import { CheckIcon, PrimaryButton, WalletIcon } from '../components/ui';
import styles from './VerificationSuccessScreen.module.css';

type Props = {
  walletAddress?: string;
  onDone: () => void;
};

function shortAddress(address?: string) {
  if (!address) return '6x1a7…x9kL2';
  return address.length > 12
    ? `${address.slice(0, 6)}…${address.slice(-5)}`
    : address;
}

/** Confirms verification and the newly created student wallet. */
export default function VerificationSuccessScreen({ walletAddress, onDone }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.checkOuter}>
          <div className={styles.checkInner}>
            <CheckIcon size={40} color="#ffffff" strokeWidth={2.5} />
          </div>
        </div>
        <span className={styles.title}>Verification Successful!</span>
        <p className={styles.message}>
          Your account is verified and you&rsquo;re ready to start earning.
        </p>

        <div className={styles.walletCard}>
          <div className={styles.walletIcon}>
            <WalletIcon size={22} color="#107535" />
          </div>
          <div className={styles.walletText}>
            <span className={styles.walletTitle}>Dedicated wallet created</span>
            <span className={styles.walletBody}>
              A secure student wallet has been created for you.
            </span>
            <span className={styles.walletAddress}>{shortAddress(walletAddress)}</span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <PrimaryButton
          label="Go to Dashboard"
          showIcon={false}
          fullWidth
          onClick={onDone}
        />
      </div>
    </div>
  );
}
