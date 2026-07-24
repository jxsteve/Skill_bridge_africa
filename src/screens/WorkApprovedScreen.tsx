import { CelebrationCheck, PrimaryButton } from '../components/ui';
import styles from './WorkApprovedScreen.module.css';

function formatCurrency(value: number) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
}

type Props = {
  amount: number;
  onReleasePayment: () => void;
};

export default function WorkApprovedScreen({ amount, onReleasePayment }: Props) {
  
  const platformFee = amount * 0.05;
  const totalPayment = amount + platformFee;
  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <CelebrationCheck />

        <p className={styles.title}>Work Approved</p>
        <p className={styles.subtitle}>
          You have approved the work.
          <br />
          Payment will be released to the student.
        </p>

        <section className={styles.amountCard}>
          <div className={styles.amountRow}>
            <span className={styles.rowLabel}>Task Amount</span>
            <span className={styles.rowValue}>{formatCurrency(amount)}</span>
          </div>

          <div className={styles.amountRow}>
            <span className={styles.rowLabel}>Platform Service Fee (5%)</span>
            <span className={styles.feeValue}>{formatCurrency(platformFee)}</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.totalRow}>
            <span>Total Payment</span>
            <span>{formatCurrency(totalPayment)}</span>
          </div>
        </section>

        <p className={styles.note}>
          <strong>Note:</strong> A 5% platform service fee is added to completed tasks.
          The total amount above will be deducted from your wallet once you release
          payment.
        </p>
        <div className={styles.spacer} />
        <div className={styles.submit}>
          <PrimaryButton
            label="Release Payment"
            showIcon={false}
            fullWidth
            onClick={onReleasePayment}
          />
        </div>
      </div>
    </div>
  );
}