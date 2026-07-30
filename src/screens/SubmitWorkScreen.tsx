import { useEffect, useMemo, useRef, useState } from 'react';

import { ChevronLeftIcon, FileIcon, PrimaryButton, UploadCloudIcon } from '../components/ui';
import styles from './SubmitWorkScreen.module.css';

const MAX_MESSAGE = 200;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

type Props = {
  onBack: () => void;
  onSubmit: (files: File[], message: string) => Promise<void> | void;
  submitting?: boolean;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SubmitWorkScreen({ onBack, onSubmit, submitting = false }: Props) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Object URLs for previewing images — revoked when the file list changes.
  const previews = useMemo(
    () => files.map((f) => (f.type.startsWith('image/') ? URL.createObjectURL(f) : null)),
    [files],
  );
  useEffect(() => {
    return () => previews.forEach((u) => u && URL.revokeObjectURL(u));
  }, [previews]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const picked = Array.from(list);
    const tooBig = picked.find((f) => f.size > MAX_SIZE);
    if (tooBig) {
      setError(`${tooBig.name} is larger than 10MB.`);
      return;
    }
    setError('');
    setFiles((prev) => [...prev, ...picked]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const canSubmit = files.length > 0 && !submitting;

  return (
    <div className={styles.container}>
      <div className={styles.scroll}>
        <div className={styles.content}>
          <button className={styles.back} onClick={onBack}>
            <ChevronLeftIcon />
          </button>

          <p className={styles.heading}>Submit Your Work</p>

          <p className={styles.label}>Upload Files</p>
          <button className={styles.upload} onClick={() => fileRef.current?.click()}>
            <span className={styles.uploadIcon}>
              <UploadCloudIcon size={28} />
            </span>
            <span className={styles.uploadText}>
              {files.length > 0 ? 'Add another file' : 'Upload File'}
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/gif,image/webp,application/pdf"
            className={styles.hiddenInput}
            onChange={(e) => addFiles(e.target.files)}
          />
          <p className={styles.hint}>PNG, JPG or PDF (Max. 10MB)</p>
          {error && (
            <p className={styles.hint} style={{ color: '#dc2626' }}>
              {error}
            </p>
          )}

          {/* Selected files — shown immediately so the student knows the upload took */}
          {files.length > 0 && (
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {files.map((f, i) => (
                <div
                  key={`${f.name}-${i}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 10,
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    background: '#ffffff',
                  }}
                >
                  {previews[i] ? (
                    <img
                      src={previews[i] as string}
                      alt=""
                      style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                    />
                  ) : (
                    <span
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                        background: 'var(--blue-50)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FileIcon size={20} color="var(--primary-blue)" />
                    </span>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#111827',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {f.name}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>{formatSize(f.size)}</p>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    aria-label={`Remove ${f.name}`}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#9ca3af',
                      fontSize: 20,
                      cursor: 'pointer',
                      lineHeight: 1,
                      padding: 4,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className={styles.label}>Message (Optional)</p>
          <div className={styles.textareaField}>
            <textarea
              className={styles.textarea}
              placeholder="Add a short note about your work"
              maxLength={MAX_MESSAGE}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <span className={styles.counter}>
              {message.length}/{MAX_MESSAGE}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <PrimaryButton
          label={submitting ? 'Submitting…' : 'Submit Work'}
          showIcon={false}
          fullWidth
          disabled={!canSubmit}
          onClick={() => canSubmit && onSubmit(files, message)}
        />
      </div>
    </div>
  );
}
