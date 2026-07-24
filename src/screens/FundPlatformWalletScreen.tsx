import { useState } from 'react';

import {
  ChevronLeftIcon,
  CopyIcon,
  PrimaryButton,
} from '../components/ui';
import styles from './FundPlatformWalletScreen.module.css';

type Props = {
  walletAddress: string;
  network?: string;
  minDeposit?: string;
  confirmationsRequired?: string;
  onBack: () => void;
  onPaymentSent: (amount: number) => void;
};

function shortAddress(address: string) {
  return address.length > 12 ? `${address.slice(0, 5)}.....${address.slice(-4)}` : address;
}

export default function FundPlatformWalletScreen({
  walletAddress,
  network = 'Solana (SOL)',
  minDeposit = '0.5 SOL',
  confirmationsRequired = '2 Confirmation',
  onBack,
  onPaymentSent,
}: Props) {
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail on insecure origins — fail silently, address is still visible.
    }
  };

  const handleConfirm = () => {
    const parsed = parseFloat(amount);
    onPaymentSent(Number.isFinite(parsed) ? parsed : 0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={onBack} aria-label="Back">
            <ChevronLeftIcon size={24} />
          </button>
          <p className={styles.title}>Fund Platform Wallet</p>
        </header>
        <p className={styles.subtitle}>
          Send funds to your platform wallet address to activate your account
        </p>

        <label className={styles.fieldLabel} htmlFor="fundAmount">
          Amount to fund
        </label>
        <input
          id="fundAmount"
          className={styles.amountInput}
          type="number"
          inputMode="decimal"
          placeholder="$50,850.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <section className={styles.addressCard}>
          <p className={styles.addressLabel}>Platform Wallet Address</p>
          <div className={styles.addressRow}>
            <span className={styles.addressValue}>{shortAddress(walletAddress)}</span>
            <button className={styles.copyButton} onClick={handleCopy} aria-label="Copy address">
              <CopyIcon size={16} color="#6014E0" />
            </button>
          </div>
          {copied && <p className={styles.copiedNote}>Copied to clipboard</p>}

          <div className={styles.qrRow}>
            <QrPlaceholder />
            <div className={styles.networkInfo}>
              <div className={styles.networkRow}>
                <span>Network</span>
                <span>{network}</span>
              </div>
              <div className={styles.networkRow}>
                <span>Min. Deposit</span>
                <span>{minDeposit}</span>
              </div>
              <div className={styles.networkRow}>
                <span>Confirmations</span>
                <span>{confirmationsRequired}</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.howTo}>
          <p className={styles.howToTitle}>How to fund</p>
          <ol className={styles.howToList}>
            <li>Send SOL or USDC to the address above</li>
            <li>Wait for 2 confirmations on the network</li>
            <li>Funds will reflect in your dashboard</li>
          </ol>
        </section>

        <div className={styles.submit}>
          <PrimaryButton
            label="I've Sent the Payment"
            showIcon={false}
            fullWidth
            onClick={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
}

// Decorative placeholder — swap for a real QR code (e.g. `qrcode.react`)
// rendering the actual walletAddress once that dependency is added.
function QrPlaceholder() {
  return (
    <svg
      width={92}
      height={92}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Wallet address QR code"
      style={{ flexShrink: 0 }}
    >
      <rect width={120} height={120} rx={8} fill="#F3F4F6" />
      <rect x={12} y={12} width={28} height={28} fill="#111827" />
      <rect x={80} y={12} width={28} height={28} fill="#111827" />
      <rect x={12} y={80} width={28} height={28} fill="#111827" />
      <rect x={20} y={20} width={12} height={12} fill="#F3F4F6" />
      <rect x={88} y={20} width={12} height={12} fill="#F3F4F6" />
      <rect x={20} y={88} width={12} height={12} fill="#F3F4F6" />
      <rect x={52} y={12} width={8} height={8} fill="#111827" />
      <rect x={64} y={24} width={8} height={8} fill="#111827" />
      <rect x={52} y={36} width={8} height={8} fill="#111827" />
      <rect x={76} y={52} width={8} height={8} fill="#111827" />
      <rect x={52} y={52} width={8} height={8} fill="#111827" />
      <rect x={88} y={52} width={8} height={8} fill="#111827" />
      <rect x={52} y={64} width={8} height={8} fill="#111827" />
      <rect x={64} y={76} width={8} height={8} fill="#111827" />
      <rect x={52} y={88} width={8} height={8} fill="#111827" />
      <rect x={64} y={100} width={8} height={8} fill="#111827" />
      <rect x={88} y={88} width={20} height={20} fill="#111827" />
    </svg>
  );
}