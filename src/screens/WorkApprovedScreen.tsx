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
          <p className={styles.amountLabel}>Amount</p>
          <p className={styles.amountValue}>{formatCurrency(amount)}</p>
        </section>

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