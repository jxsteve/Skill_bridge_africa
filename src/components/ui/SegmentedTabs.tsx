import styles from './SegmentedTabs.module.css';

type Props = {
  tabs: string[];
  active: number;
  onChange: (index: number) => void;
};

export function SegmentedTabs({ tabs, active, onChange }: Props) {
  return (
    <div className={styles.row}>
      {tabs.map((tab, i) => (
        <button
          key={tab}
          className={`${styles.tab} ${i === active ? styles.active : ''}`}
          onClick={() => onChange(i)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
