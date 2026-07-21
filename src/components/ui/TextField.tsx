import { useState } from 'react';

import styles from './TextField.module.css';
import { EyeIcon, EyeOffIcon } from './icons';

type Props = {
  icon?: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  secure?: boolean;
  type?: string;
  multiline?: boolean;
};

export function TextField({
  icon,
  placeholder,
  value,
  onChange,
  secure = false,
  type = 'text',
  multiline = false,
}: Props) {
  const [hidden, setHidden] = useState(true);
  const inputType = secure ? (hidden ? 'password' : 'text') : type;

  return (
    <div className={`${styles.field} ${multiline ? styles.multiline : ''}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {multiline ? (
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={styles.input}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {secure && (
        <button className={styles.toggle} type="button" onClick={() => setHidden((h) => !h)}>
          {hidden ? (
            <EyeOffIcon size={20} color="#6B7280" />
          ) : (
            <EyeIcon size={20} color="#6B7280" />
          )}
        </button>
      )}
    </div>
  );
}
