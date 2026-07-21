import styles from './Button.module.css';
import { ChevronRightIcon, CornerUpLeftIcon } from './icons';

type PrimaryProps = {
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
}: PrimaryProps) {
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

export function SecondaryButton({
  label,
  onClick,
  disabled = false,
  showIcon = true,
}: Omit<PrimaryProps, 'loading' | 'fullWidth'>) {
  return (
    <button className={styles.secondary} onClick={onClick} disabled={disabled}>
      {label}
      {showIcon && <ChevronRightIcon size={20} color={disabled ? '#6B7280' : '#124CC9'} />}
    </button>
  );
}

export function TextButton({
  label,
  onClick,
  disabled = false,
  showIcon = true,
}: Omit<PrimaryProps, 'loading' | 'fullWidth'>) {
  return (
    <button className={styles.text} onClick={onClick} disabled={disabled}>
      {label}
      {showIcon && <CornerUpLeftIcon size={16} color={disabled ? '#6B7280' : '#124CC9'} />}
    </button>
  );
}

export function IconButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button className={styles.icon} onClick={onClick}>
      {children}
    </button>
  );
}
