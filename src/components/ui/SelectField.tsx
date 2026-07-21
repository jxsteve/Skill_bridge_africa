import { useState } from 'react';

import { useFramed } from '../PhoneFrame';
import styles from './SelectField.module.css';
import { CheckIcon, ChevronDownIcon } from './icons';

type Props = {
  icon?: React.ReactNode;
  placeholder: string;
  value: string;
  options: readonly string[];
  onSelect: (option: string) => void;
};

export function SelectField({ icon, placeholder, value, options, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const framed = useFramed();

  return (
    <>
      <button type="button" className={styles.field} onClick={() => setOpen(true)}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={`${styles.value} ${!value ? styles.placeholder : ''}`}>
          {value || placeholder}
        </span>
        <ChevronDownIcon />
      </button>

      {open && (
        <div
          className={`${styles.backdrop} ${framed ? styles.backdropCentered : ''}`}
          onClick={() => setOpen(false)}
        >
          <div
            className={`${styles.sheet} ${framed ? styles.sheetFramed : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {!framed && <div className={styles.grabber} />}
            <p className={styles.sheetTitle}>{placeholder}</p>
            <div className={styles.options}>
              {options.map((opt) => {
                const selected = opt === value;
                return (
                  <button
                    key={opt}
                    className={`${styles.option} ${selected ? styles.optionSelected : ''}`}
                    onClick={() => {
                      onSelect(opt);
                      setOpen(false);
                    }}
                  >
                    <span>{opt}</span>
                    {selected && <CheckIcon size={16} color="#124CC9" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
