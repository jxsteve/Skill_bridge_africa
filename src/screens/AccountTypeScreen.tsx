import { AccountType, AccountTypeCard } from '../components/ui';
import styles from './AccountTypeScreen.module.css';

type Props = {
  onSelect: (type: AccountType) => void;
};

export default function AccountTypeScreen({ onSelect }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.title}>Choose Your{'\n'}Account Type</p>
        <p className={styles.subtitle}>
          Select how you want to use{'\n'}SkillBridge Africa
        </p>
        <div className={styles.cards}>
          <AccountTypeCard type="student" onClick={() => onSelect('student')} />
          <AccountTypeCard type="client" onClick={() => onSelect('client')} />
        </div>
      </div>
    </div>
  );
}
