import { useEffect, useMemo, useState } from 'react';

import { BottomNav, MainTab, SegmentedTabs } from '../components/ui';
import { PROJECTS, type Project } from '../data/marketplace';
import { isSupabaseConfigured } from '../lib/supabase';
import { listMyProjects } from '../data/marketplace-service';
import styles from './MyProjectsScreen.module.css';

const STATUSES = ['In Progress', 'Completed'] as const;

type Props = {
  userId?: string;
  onOpenProject: (id: string) => void;
  onTab: (tab: MainTab) => void;
};

export default function MyProjectsScreen({ userId, onOpenProject, onTab }: Props) {
  const [active, setActive] = useState(0);
  const [allProjects, setAllProjects] = useState<Project[]>(PROJECTS);

  useEffect(() => {
    if (!isSupabaseConfigured || !userId) return;
    listMyProjects(userId)
      .then(setAllProjects)
      .catch(() => {});
  }, [userId]);

  const TABS = STATUSES.map(
    (status) => `${status} (${allProjects.filter((p) => p.status === status).length})`,
  );

  const projects = useMemo(
    () => allProjects.filter((p) => p.status === STATUSES[active]),
    [active, allProjects],
  );

  return (
    <div className={styles.container}>
      <div className={styles.scroll}>
        <div className={styles.content}>
          <SegmentedTabs tabs={TABS} active={active} onChange={setActive} />

          <div className={styles.list}>
            {projects.map((project) => (
              <button
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
                <p className={styles.cardClient}>{project.client}</p>
                <p className={styles.cardMeta}>Due in {project.dueInDays} Days</p>
                <p className={styles.cardBudget}>Budget ${project.budget.toFixed(2)}</p>
              </button>
            ))}
            {projects.length === 0 && (
              <p className={styles.empty}>No projects here yet.</p>
            )}
          </div>
        </div>
      </div>

      <BottomNav active="tasks" onSelect={onTab} />
    </div>
  );
}
