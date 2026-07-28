import { useRef } from 'react';

import styles from './OtpInput.module.css';

type Props = {
  length?: number;
  value: string;
  onChange: (code: string) => void;
  status?: 'default' | 'success' | 'error';
};

export function OtpInput({ length = 6, value, onChange, status = 'default' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const success = status === 'success';
  const error = status === 'error';

  return (
    <div className={styles.row} onClick={() => inputRef.current?.focus()}>
      {Array.from({ length }, (_, i) => (
        <div
          key={i}
          className={`${styles.box} ${
            success ? styles.success : error ? styles.error : i === value.length ? styles.active : ''
          }`}
        >
          {value[i] ?? ''}
        </div>
      ))}
      <input
        ref={inputRef}
        className={styles.hidden}
        value={value}
        inputMode="numeric"
        maxLength={length}
        autoFocus
        readOnly={success}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, length))}
      />
    </div>
  );
}
