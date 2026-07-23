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
  /**
   * When true, an "Others" option is appended; choosing it lets the user
   * type their own value instead of picking from the list.
   */
  allowCustom?: boolean;
};

export function SelectField({
  icon,
  placeholder,
  value,
  options,
  onSelect,
  allowCustom = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customText, setCustomText] = useState('');
  const framed = useFramed();

  // A stored value not present in the list came from "Others".
  const isCustomValue = value !== '' && !options.includes(value);

  const openSheet = () => {
    setCustomMode(false);
    setCustomText(isCustomValue ? value : '');
    setOpen(true);
  };

  const saveCustom = () => {
    const typed = customText.trim();
    if (!typed) return;
    onSelect(typed);
    setOpen(false);
  };

  return (
    <>
      <button type="button" className={styles.field} onClick={openSheet}>
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

            {customMode ? (
              <div className={styles.customArea}>
                <input
                  className={styles.customInput}
                  placeholder={placeholder}
                  value={customText}
                  autoFocus
                  onChange={(e) => setCustomText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveCustom()}
                />
                <button
                  type="button"
                  className={styles.customSave}
                  disabled={customText.trim() === ''}
                  onClick={saveCustom}
                >
                  Save
                </button>
              </div>
            ) : (
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
                {allowCustom && (
                  <button
                    className={`${styles.option} ${isCustomValue ? styles.optionSelected : ''}`}
                    onClick={() => setCustomMode(true)}
                  >
                    <span>Others</span>
                    {isCustomValue && <CheckIcon size={16} color="#124CC9" />}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
