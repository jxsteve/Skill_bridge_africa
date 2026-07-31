/**
 * Student task tracker — every task assigned to this student, grouped into
 * All / In Progress / Completed with a live count on In Progress. Each card
 * shows its real stage (Submitted, Under Admin Review, Awaiting Client Approval,
 * Completed…) so it stays in sync with the client and admin views.
 */
import { useEffect, useMemo, useState } from 'react';

import { BottomNav, MainTab } from '../components/ui';
import { PROJECTS, type Project } from '../data/marketplace';
import { isSupabaseConfigured } from '../lib/supabase';
import { listMyProjects } from '../data/marketplace-service';
import styles from './MyProjectsScreen.module.css';

type Props = {
  userId?: string;
  onOpenProject: (id: string) => void;
  onBrowse: () => void;
  onTab: (tab: MainTab) => void;
};

// Colour each fine-grained stage so the student can tell state at a glance.
const STAGE_STYLE: Record<string, { bg: string; color: string }> = {
  'In Progress': { bg: '#dbeafe', color: '#1d4ed8' },
  Submitted: { bg: '#fef3c7', color: '#b45309' },
  'Under Admin Review': { bg: '#fef3c7', color: '#b45309' },
  'Awaiting Client Approval': { bg: '#ede9fe', color: '#6d28d9' },
  Completed: { bg: '#dcfce7', color: '#16a34a' },
  Cancelled: { bg: '#fee2e2', color: '#dc2626' },
};

export default function MyProjectsScreen({ userId, onOpenProject, onBrowse, onTab }: Props) {
  const [active, setActive] = useState<'All' | 'In Progress' | 'Completed'>('All');
  const [allProjects, setAllProjects] = useState<Project[]>(isSupabaseConfigured ? [] : PROJECTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !userId) {
      setLoading(false);
      return;
    }
    listMyProjects(userId)
      .then(setAllProjects)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const inProgressCount = allProjects.filter((p) => p.status === 'In Progress').length;
  const completedCount = allProjects.filter((p) => p.status === 'Completed').length;

  const TABS: { key: typeof active; label: string; count?: number }[] = [
    { key: 'All', label: 'All' },
    { key: 'In Progress', label: 'In Progress', count: inProgressCount },
    { key: 'Completed', label: 'Completed', count: completedCount },
  ];

  const projects = useMemo(
    () => (active === 'All' ? allProjects : allProjects.filter((p) => p.status === active)),
    [active, allProjects],
  );

  return (
    <div className={styles.container}>
      <div className={styles.scroll}>
        <div className={styles.content}>
          <div className={styles.headerRow}>
            <p className={styles.title}>My Tasks</p>
            <button className={styles.findBtn} onClick={onBrowse}>
              Find work
            </button>
          </div>

          <div className={styles.tabs}>
            {TABS.map((t) => {
              const on = active === t.key;
              return (
                <button
                  key={t.key}
                  className={`${styles.tab} ${on ? styles.tabActive : ''}`}
                  onClick={() => setActive(t.key)}
                >
                  <span>{t.label}</span>
                  {t.count !== undefined && t.count > 0 && (
                    <span className={`${styles.tabCount} ${on ? styles.tabCountOn : ''}`}>{t.count}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className={styles.list}>
            {projects.map((project) => {
              const stage = project.stage ?? project.status;
              const style = STAGE_STYLE[stage] ?? STAGE_STYLE['In Progress'];
              return (
                <button key={project.id} className={styles.card} onClick={() => onOpenProject(project.id)}>
                  <div className={styles.cardHead}>
                    <span className={styles.cardTitle}>{project.title}</span>
                    <span className={styles.badge} style={{ background: style.bg }}>
                      <span className={styles.badgeText} style={{ color: style.color }}>
                        {stage}
                      </span>
                    </span>
                  </div>
                  <p className={styles.cardBudget}>Budget ${project.budget.toFixed(2)}</p>
                </button>
              );
            })}

            {!loading && projects.length === 0 && (
              <div className={styles.empty}>
                <p className={styles.emptyText}>
                  {active === 'Completed'
                    ? 'No completed tasks yet.'
                    : active === 'In Progress'
                      ? 'No tasks in progress right now.'
                      : 'You don’t have any tasks yet.'}
                </p>
                <button className={styles.emptyBtn} onClick={onBrowse}>
                  Browse open tasks
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav active="tasks" onSelect={onTab} />
    </div>
  );
}
