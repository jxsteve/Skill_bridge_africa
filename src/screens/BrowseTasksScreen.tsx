import { useMemo, useState } from 'react';

import { BottomNav, SearchIcon, SlidersIcon } from '../components/ui';
import type { MainTab } from '../components/ui';
import { PROJECTS, TASKS } from '../data/marketplace';
import type { TaskCategory } from '../data/marketplace';
import styles from './BrowseTasksScreen.module.css';

const VIEWS = ['All', 'In Progress', 'Completed'] as const;
const CATEGORIES: ('All categories' | TaskCategory)[] = [
  'All categories',
  'Design',
  'Development',
  'Writing',
];

type Props = {
  onOpenTask: (id: string) => void;
  onOpenProject: (id: string) => void;
  onTab: (tab: MainTab) => void;
};

export default function BrowseTasksScreen({ onOpenTask, onOpenProject, onTab }: Props) {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<(typeof VIEWS)[number]>('All');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All categories');
  const [filterOpen, setFilterOpen] = useState(false);

  const matchesQuery = (title: string) =>
    query.trim() === '' || title.toLowerCase().includes(query.trim().toLowerCase());

  const tasks = useMemo(
    () =>
      TASKS.filter(
        (t) =>
          (category === 'All categories' || t.category === category) &&
          matchesQuery(t.title),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, category],
  );

  const projects = useMemo(
    () =>
      PROJECTS.filter(
        (p) =>
          p.status === (view === 'In Progress' ? 'In Progress' : 'Completed') &&
          matchesQuery(p.title),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, view],
  );

  const categoryActive = category !== 'All categories';

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

        <div className={styles.filters}>
          {VIEWS.map((v) => {
            const selected = v === view;
            return (
              <button
                type="button"
                key={v}
                className={`${styles.filterChip} ${selected ? styles.filterChipActive : ''}`}
                onClick={() => setView(v)}
              >
                <span
                  className={`${styles.filterLabel} ${selected ? styles.filterLabelActive : ''}`}
                >
                  {v}
                </span>
              </button>
            );
          })}
        </div>

        {view === 'All' &&
          tasks.map((task) => (
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

        {view !== 'All' &&
          projects.map((project) => (
            <button
              type="button"
              key={project.id}
              className={styles.card}
              onClick={() => onOpenProject(project.id)}
            >
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>{project.title}</span>
                <span className={styles.badge}>
                  <span className={styles.badgeText}>{project.status}</span>
                </span>
              </div>
              <span className={styles.cardClient}>{project.client}</span>
              <span className={styles.cardMeta}>Due in {project.dueInDays} Days</span>
              <span className={styles.cardBudget}>
                Budget ${project.budget.toFixed(2)}
              </span>
            </button>
          ))}

        {view === 'All' && tasks.length === 0 && (
          <p className={styles.empty}>No tasks match your search.</p>
        )}
        {view === 'In Progress' && projects.length === 0 && (
          <p className={styles.empty}>No tasks in progress yet.</p>
        )}
        {view === 'Completed' && projects.length === 0 && (
          <p className={styles.empty}>No completed tasks yet.</p>
        )}
      </div>

      <BottomNav active="tasks" onSelect={onTab} />
    </div>
  );
}
