import styles from './Button.module.css';
import { ChevronRightIcon } from './icons';

type Props = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  showIcon?: boolean;
  fullWidth?: boolean;
};

export function PrimaryButton({
  label,
  onClick,
  disabled = false,
  loading = false,
  showIcon = true,
  fullWidth = false,
}: Props) {
  return (
    <button
      className={`${styles.primary} ${fullWidth ? styles.fullWidth : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <span className={loading ? styles.hidden : styles.content}>
        {label}
        {showIcon && <ChevronRightIcon size={20} color={disabled ? '#6B7280' : '#F9FAFB'} />}
      </span>
      {loading && <span className={styles.spinner} />}
    </button>
  );
}
