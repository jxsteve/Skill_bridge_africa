import { useMemo, useState } from 'react';

import { BottomNav, SearchIcon, SlidersIcon } from '../components/ui';
import type { MainTab } from '../components/ui';
import { TASKS } from '../data/marketplace';
import type { TaskCategory } from '../data/marketplace';
import styles from './BrowseTasksScreen.module.css';

const FILTERS: ('All' | TaskCategory)[] = ['All', 'Design', 'Development', 'Writing'];

type Props = {
  onOpenTask: (id: string) => void;
  onTab: (tab: MainTab) => void;
};

export default function BrowseTasksScreen({ onOpenTask, onTab }: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const tasks = useMemo(() => {
    return TASKS.filter((t) => {
      const matchesFilter = filter === 'All' || t.category === filter;
      const matchesQuery =
        query.trim() === '' ||
        t.title.toLowerCase().includes(query.trim().toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.searchRow}>
          <div className={styles.search}>
            <SearchIcon size={18} color="#9CA3AF" />
            <input
              className={styles.searchInput}
              placeholder="Search tasks....."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="button" className={styles.filterButton}>
            <SlidersIcon size={20} />
          </button>
        </div>

        <div className={styles.filters}>
          {FILTERS.map((f) => {
            const selected = f === filter;
            return (
              <button
                type="button"
                key={f}
                className={`${styles.filterChip} ${selected ? styles.filterChipActive : ''}`}
                onClick={() => setFilter(f)}
              >
                <span
                  className={`${styles.filterLabel} ${selected ? styles.filterLabelActive : ''}`}
                >
                  {f}
                </span>
              </button>
            );
          })}
        </div>

        {tasks.map((task) => (
          <button
            type="button"
            key={task.id}
            className={styles.card}
            onClick={() => onOpenTask(task.id)}
          >
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>{task.title}</span>
              {task.featured && (
                <span className={styles.badge}>
                  <span className={styles.badgeText}>Featured</span>
                </span>
              )}
            </div>
            <span className={styles.cardClient}>{task.client}</span>
            <span className={styles.cardMeta}>Due in {task.dueInDays} Days</span>
            <span className={styles.cardBudget}>Budget ${task.budget.toFixed(2)}</span>
          </button>
        ))}

        {tasks.length === 0 && (
          <p className={styles.empty}>No tasks match your search.</p>
        )}
      </div>

      <BottomNav active="tasks" onSelect={onTab} />
    </div>
  );
}
