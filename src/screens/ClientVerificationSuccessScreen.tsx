import { CheckIcon, CopyIcon, PrimaryButton } from '../components/ui';
import styles from './ClientVerificationSuccessScreen.module.css';

type Props = {
  walletAddress: string;
  network?: string;
  onGoToDashboard: () => void;
};

function shortAddress(address: string) {
  return address.length > 10 ? `${address.slice(0, 4)}....${address.slice(-5)}` : address;
}

const CONFETTI = [
  { top: '4%', left: '30%', rotate: '-20deg', color: '#FDE68A' },
  { top: '2%', left: '62%', rotate: '15deg', color: '#BFDBFE' },
  { top: '14%', left: '10%', rotate: '35deg', color: '#FDE68A' },
  { top: '16%', left: '82%', rotate: '-30deg', color: '#86EFAC' },
  { top: '32%', left: '4%', rotate: '10deg', color: '#FDA4AF' },
  { top: '34%', left: '90%', rotate: '-10deg', color: '#FDE68A' },
  { top: '46%', left: '14%', rotate: '-25deg', color: '#86EFAC' },
  { top: '48%', left: '80%', rotate: '20deg', color: '#86EFAC' },
];

export default function ClientVerificationSuccessScreen({
  walletAddress,
  network = 'Solana (SOL)',
  onGoToDashboard,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.celebrationWrap}>
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className={styles.confetti}
              style={{
                top: c.top,
                left: c.left,
                backgroundColor: c.color,
                transform: `rotate(${c.rotate})`,
              }}
            />
          ))}
          <div className={styles.successCircle}>
            <CheckIcon size={56} color="#16A34A" strokeWidth={3} />
          </div>
        </div>

        <p className={styles.title}>Verification Completed</p>
        <p className={styles.subtitle}>
          Your secure wallet has been automatically created and verified, your account is active
          now.
        </p>

        <section className={styles.addressCard}>
          <p className={styles.addressLabel}>Platform Wallet Address</p>
          <div className={styles.addressRow}>
            <span className={styles.addressValue}>{shortAddress(walletAddress)}</span>
            <button className={styles.copyButton} aria-label="Copy address">
              <CopyIcon size={16} color="#6014E0" />
            </button>
          </div>
          <p className={styles.networkLabel}>Network</p>
          <p className={styles.networkValue}>{network}</p>
        </section>

        <div className={styles.spacer} />

        <div className={styles.submit}>
          <PrimaryButton
            label="Go to Dashboard"
            showIcon={false}
            fullWidth
            onClick={onGoToDashboard}
          />
        </div>
      </div>
    </div>
  );
}