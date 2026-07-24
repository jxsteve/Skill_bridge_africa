import { ConfettiBurst, WalletIcon } from '../components/ui';
import styles from './PaymentReleasedScreen.module.css';

type Props = {
  recipientName: string;
  amount: number;
};

function formatCurrency(value: number) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
}

export default function PaymentReleasedScreen({ recipientName, amount }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ConfettiBurst>
          <WalletIcon size={72} color="var(--primary-blue)" strokeWidth={2.5} />
        </ConfettiBurst>

        <p className={styles.title}>Payment Released</p>
        <p className={styles.subtitle}>Payment has been released to</p>
        <p className={styles.recipientName}>{recipientName}</p>

        <section className={styles.amountCard}>
          <p className={styles.amountLabel}>Amount</p>
          <p className={styles.amountValue}>{formatCurrency(amount)}</p>
        </section>
      </div>
    </div>
  );
}