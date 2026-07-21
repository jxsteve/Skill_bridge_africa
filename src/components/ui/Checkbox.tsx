import styles from './Checkbox.module.css';
import { CheckIcon } from './icons';

type Props = {
  checked: boolean;
  onToggle: () => void;
};

export function Checkbox({ checked, onToggle }: Props) {
  return (
    <button
      type="button"
      className={`${styles.box} ${checked ? styles.checked : ''}`}
      onClick={onToggle}
      aria-pressed={checked}
    >
      {checked && <CheckIcon size={14} />}
    </button>
  );
}
