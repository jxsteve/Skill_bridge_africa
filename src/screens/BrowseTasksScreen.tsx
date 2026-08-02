/**
 * Find Work — the marketplace of open, client-created tasks a student can bid on.
 * The student's own assigned work lives on the Tasks tab (MyProjectsScreen); this
 * screen is purely for discovering new tasks.
 */
import { useEffect, useMemo, useState } from 'react';

import { BottomNav, ChevronLeftIcon, SearchIcon, SlidersIcon } from '../components/ui';
import type { MainTab } from '../components/ui';
import { TASKS } from '../data/marketplace';
import type { Task, TaskCategory } from '../data/marketplace';
import { isSupabaseConfigured } from '../lib/supabase';
import { listOpenTasks } from '../data/marketplace-service';
import styles from './BrowseTasksScreen.module.css';

// When connected to the backend, only real (client-created) open tasks show.
const SEED_TASKS = isSupabaseConfigured ? [] : TASKS;

const CATEGORIES: ('All categories' | TaskCategory)[] = [
  'All categories',
  'Design',
  'Development',
  'Writing',
];

type Props = {
  onOpenTask: (id: string) => void;
  onBack: () => void;
  onTab: (tab: MainTab) => void;
};

export default function BrowseTasksScreen({ onOpenTask, onBack, onTab }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All categories');
  const [filterOpen, setFilterOpen] = useState(false);
  const [allTasks, setAllTasks] = useState<Task[]>(SEED_TASKS);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    listOpenTasks()
      .then(setAllTasks)
      .catch(() => {});
  }, []);

  // Match the query against every searchable field — title, description,
  // job type, skills, company, budget and due date. Every whitespace-separated
  // term must appear somewhere, so "design 200" matches a $200 design task.
  const matchesQuery = (t: Task) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const haystack = [
      t.title,
      t.description,
      t.category,
      t.client,
      ...(t.skills ?? []),
      String(t.budget),
      `$${t.budget}`,
      t.dueDate,
      `${t.dueInDays} days`,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return q.split(/\s+/).every((term) => haystack.includes(term));
  };

  const tasks = useMemo(
    () =>
      allTasks.filter(
        (t) => (category === 'All categories' || t.category === category) && matchesQuery(t),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, category, allTasks],
  );

  const categoryActive = category !== 'All categories';

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.pageHead}>
          <button className={styles.backBtn} onClick={onBack} aria-label="Back">
            <ChevronLeftIcon size={22} />
          </button>
          <p className={styles.pageTitle}>Find Work</p>
        </div>

        <div className={styles.searchRow}>
          <div className={styles.search}>
            <SearchIcon size={18} color="#9CA3AF" />
            <input
              className={styles.searchInput}
              placeholder="Search title, skill, company, budget…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className={styles.filterWrap}>
            <button
              type="button"
              className={`${styles.filterButton} ${categoryActive || filterOpen ? styles.filterButtonActive : ''}`}
              onClick={() => setFilterOpen((o) => !o)}
            >
              <SlidersIcon size={20} color={categoryActive ? '#124CC9' : '#374151'} />
            </button>
            {filterOpen && (
              <div className={styles.filterPanel}>
                <p className={styles.filterPanelTitle}>Category</p>
                {CATEGORIES.map((c) => {
                  const selected = c === category;
                  return (
                    <button
                      type="button"
                      key={c}
                      className={`${styles.filterOption} ${selected ? styles.filterOptionActive : ''}`}
                      onClick={() => {
                        setCategory(c);
                        setFilterOpen(false);
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {tasks.map((task) => (
          <button type="button" key={task.id} className={styles.card} onClick={() => onOpenTask(task.id)}>
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

        {tasks.length === 0 && <p className={styles.empty}>No open tasks match your search right now.</p>}
      </div>

      <BottomNav active="tasks" onSelect={onTab} />
    </div>
  );
}
