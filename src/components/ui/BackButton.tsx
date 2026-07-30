import { ChevronLeftIcon } from './icons';

/**
 * Left-aligned back button for screens that would otherwise be forward-only.
 * Self-contained styling so it drops into any screen's content without needing
 * per-screen CSS.
 */
export function BackButton({ onClick, label = 'Back' }: { onClick: () => void; label?: string }) {
  return (
    <div style={{ display: 'flex', width: '100%', padding: '2px 0 10px' }}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          cursor: 'pointer',
        }}
      >
        <ChevronLeftIcon size={22} />
      </button>
    </div>
  );
}
