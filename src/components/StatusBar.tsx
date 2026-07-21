import styles from './StatusBar.module.css';

/** Simulated iOS status bar shown at the top of the phone frame. */
export function StatusBar() {
  return (
    <div className={styles.bar}>
      <span className={styles.time}>9:41</span>
      <svg width={74} height={14} viewBox="0 0 74 14" aria-hidden>
        <rect x={0} y={9} width={3} height={4} rx={1} fill="#111827" />
        <rect x={5} y={7} width={3} height={6} rx={1} fill="#111827" />
        <rect x={10} y={4.5} width={3} height={8.5} rx={1} fill="#111827" />
        <rect x={15} y={2} width={3} height={11} rx={1} fill="#111827" />
        <path d="M24 6.7a10.5 10.5 0 0 1 15 0" stroke="#111827" strokeWidth={2.2} strokeLinecap="round" fill="none" />
        <path d="M27.2 9.7a6 6 0 0 1 8.6 0" stroke="#111827" strokeWidth={2.2} strokeLinecap="round" fill="none" />
        <circle cx={31.5} cy={12.2} r={1.7} fill="#111827" />
        <rect x={47} y={1.5} width={21} height={11} rx={3.5} stroke="#111827" strokeOpacity={0.4} strokeWidth={1} fill="none" />
        <rect x={49} y={3.5} width={13} height={7} rx={2} fill="#111827" />
        <path d="M69.5 5v4a2.2 2.2 0 0 0 0-4Z" fill="#111827" fillOpacity={0.4} />
      </svg>
    </div>
  );
}
