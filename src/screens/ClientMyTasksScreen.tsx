/**
 * Client "My Tasks" — lists the tasks this client created and their live status.
 * Tapping a task opens its detail, which reflects the real project lifecycle
 * (waiting for admin → student assigned → submitted → ready for review → done).
 */
import { useCallback, useEffect, useState } from 'react';

import { BackButton, BottomNav, ChevronRightIcon, type MainTab } from '../components/ui';
import { isSupabaseConfigured } from '../lib/supabase';
import { listClientTasks } from '../data/marketplace-service';
import type { TaskWithClient } from '../data/repo';
import styles from './ClientMyTasksScreen.module.css';

type Props = {
  clientId?: string;
  onBack: () => void;
  onCreateTask: () => void;
  onOpenTask: (taskId: string) => void;
  onTab: (tab: MainTab) => void;
};

const STATUS_LABEL: Record<string, string> = {
  open: 'Waiting for review',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  under_review: 'Under Review',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function ClientMyTasksScreen({ clientId, onBack, onCreateTask, onOpenTask, onTab }: Props) {
  const [tasks, setTasks] = useState<TaskWithClient[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured || !clientId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setTasks(await listClientTasks(clientId));
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className={styles.container}>
      <div className={styles.scroll}>
        <BackButton onClick={onBack} />
        <div className={styles.headerRow}>
          <p className={styles.title}>My Tasks</p>
          <button className={styles.newBtn} onClick={onCreateTask}>
            + New Task
          </button>
        </div>

        {loading && <p className={styles.muted}>Loading…</p>}
        {!loading && tasks.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyText}>
              You haven’t created any tasks yet. Post one to start receiving requests.
            </p>
            <button className={styles.emptyBtn} onClick={onCreateTask}>
              Create a Task
            </button>
          </div>
        )}

        {tasks.map((t) => (
          <button key={t.id} className={styles.card} onClick={() => onOpenTask(t.id)}>
            <div className={styles.cardHead}>
              <div className={styles.cardMain}>
                <span className={styles.cardTitle}>{t.title}</span>
                <span className={styles.cardMeta}>
                  {t.category} · ${Number(t.budget).toFixed(2)}
                </span>
              </div>
              <span className={`${styles.status} ${styles[`s_${t.status}`] ?? ''}`}>
                {STATUS_LABEL[t.status] ?? t.status}
              </span>
            </div>
            <div className={styles.viewRow}>
              <span className={styles.viewText}>View details</span>
              <ChevronRightIcon size={16} color="#9CA3AF" />
            </div>
          </button>
        ))}
      </div>

      <BottomNav active="tasks" onSelect={onTab} variant="client" />
    </div>
  );
}
