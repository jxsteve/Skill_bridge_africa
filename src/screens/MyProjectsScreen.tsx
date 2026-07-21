import { useMemo, useState } from 'react';

import { BottomNav, MainTab, SegmentedTabs } from '../components/ui';
import { PROJECTS } from '../data/marketplace';
import styles from './MyProjectsScreen.module.css';

const TABS = ['In Progress (3)', 'Completed (2)'];
const STATUSES = ['In Progress', 'Completed'] as const;

type Props = {
  onOpenProject: (id: string) => void;
  onTab: (tab: MainTab) => void;
};

export default function MyProjectsScreen({ onOpenProject, onTab }: Props) {
  const [active, setActive] = useState(0);

  const projects = useMemo(
    () => PROJECTS.filter((p) => p.status === STATUSES[active]),
    [active],
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
