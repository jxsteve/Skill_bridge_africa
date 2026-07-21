import { useState } from 'react';

import {
  ArrowRightCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  PrimaryButton,
} from '../components/ui';
import { DELIVERY_OPTIONS } from '../data/marketplace';
import styles from './PlaceBidScreen.module.css';

type Props = {
  onBack: () => void;
  onSubmit: () => void;
};

export default function PlaceBidScreen({ onBack, onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [delivery, setDelivery] = useState('');
  const [note, setNote] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  const canSubmit = amount.trim() !== '' && delivery !== '';

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <button type="button" className={styles.back} onClick={onBack}>
          <ChevronLeftIcon />
        </button>

        <p className={styles.label}>Your Bid ($)</p>
        <div className={styles.field}>
          <input
            className={styles.input}
            placeholder="$23"
            inputMode="numeric"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1'))
            }
          />
        </div>

        <p className={styles.label}>Delivery Time</p>
        <button
          type="button"
          className={styles.field}
          onClick={() => setPickerOpen((o) => !o)}
        >
          <span className={`${styles.input} ${!delivery ? styles.placeholder : ''}`}>
            {delivery || 'Select Delivery Time'}
          </span>
          <ChevronDownIcon />
        </button>
        {pickerOpen && (
          <div className={styles.options}>
            {DELIVERY_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt}
                className={styles.option}
                onClick={() => {
                  setDelivery(opt);
                  setPickerOpen(false);
                }}
              >
                <span className={styles.optionText}>{opt}</span>
              </button>
            ))}
          </div>
        )}

        <p className={styles.label}>Cover Note (Optional)</p>
        <div className={`${styles.field} ${styles.textareaField}`}>
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            placeholder="I can Deliver a modern and user-friendly design that fits your brand"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <p className={styles.label}>Attachment (Optional)</p>
        <button type="button" className={styles.addFile}>
          <ArrowRightCircleIcon size={20} />
          <span className={styles.addFileText}>Add File</span>
        </button>
      </div>

      <div className={styles.footer}>
        <PrimaryButton
          label="Submit Bid"
          showIcon={false}
          fullWidth
          disabled={!canSubmit}
          onClick={onSubmit}
        />
      </div>
    </div>
  );
}
