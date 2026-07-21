import styles from './AccountTypeCard.module.css';
import { BriefcaseBusinessIcon, ChevronRightIcon, GraduationCapIcon } from './icons';

export type AccountType = 'student' | 'client';

type Props = {
  type: AccountType;
  selected?: boolean;
  onClick?: () => void;
};

const CONTENT = {
  student: {
    title: 'I’m a Student',
    description: 'I want to showcase my skills and earn.',
    accent: '#0e3a9a',
  },
  client: {
    title: 'I’m a Client',
    description: 'I want to Hire verified Students.',
    accent: '#107535',
  },
} as const;

export function AccountTypeCard({ type, selected = false, onClick }: Props) {
  const content = CONTENT[type];
  return (
    <button
      type="button"
      className={`${styles.card} ${styles[type]} ${selected ? styles.selected : ''}`}
      onClick={onClick}
    >
      <span className={styles.icon}>
        {type === 'student' ? (
          <GraduationCapIcon size={56} color={content.accent} />
        ) : (
          <BriefcaseBusinessIcon size={56} color={content.accent} />
        )}
      </span>
      <span className={styles.body}>
        <span className={styles.title} style={{ color: content.accent }}>
          {content.title}
        </span>
        <span className={styles.row}>
          <span className={styles.description}>{content.description}</span>
          <ChevronRightIcon size={20} color="#374151" />
        </span>
      </span>
    </button>
  );
}
