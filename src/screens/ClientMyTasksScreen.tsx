/**
 * Client "My Tasks" — lists the tasks this client created, their live status,
 * and (expandable) the students who requested to work on each. View-only:
 * approving/assigning is an admin action.
 */
import { useCallback, useEffect, useState } from 'react';

import { BackButton, BottomNav, type MainTab } from '../components/ui';
import { isSupabaseConfigured } from '../lib/supabase';
import { listClientTasks, listTaskApplicants, type Applicant } from '../data/marketplace-service';
import type { TaskWithClient } from '../data/repo';
import styles from './ClientMyTasksScreen.module.css';

type Props = {
  clientId?: string;
  onBack: () => void;
  onCreateTask: () => void;
  onTab: (tab: MainTab) => void;
};

const STATUS_LABEL: Record<string, string> = {
  open: 'Open',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  under_review: 'Under Review',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function ClientMyTasksScreen({ clientId, onBack, onCreateTask, onTab }: Props) {
  const [tasks, setTasks] = useState<TaskWithClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Record<string, Applicant[]>>({});

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

  const toggle = async (taskId: string) => {
    if (expanded === taskId) {
      setExpanded(null);
      return;
    }
    setExpanded(taskId);
    if (!applicants[taskId]) {
      const list = await listTaskApplicants(taskId);
      setApplicants((prev) => ({ ...prev, [taskId]: list }));
    }
  };

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

        {tasks.map((t) => {
          const apps = applicants[t.id] ?? [];
          const isOpen = expanded === t.id;
          return (
            <div key={t.id} className={styles.card}>
              <button className={styles.cardHead} onClick={() => void toggle(t.id)}>
                <div className={styles.cardMain}>
                  <span className={styles.cardTitle}>{t.title}</span>
                  <span className={styles.cardMeta}>
                    {t.category} · ${Number(t.budget).toFixed(2)}
                  </span>
                </div>
                <span className={`${styles.status} ${styles[`s_${t.status}`] ?? ''}`}>
                  {STATUS_LABEL[t.status] ?? t.status}
                </span>
              </button>

              {isOpen && (
                <div className={styles.applicants}>
                  <p className={styles.applicantsTitle}>
                    Requests {apps.length > 0 ? `(${apps.length})` : ''}
                  </p>
                  {apps.length === 0 && (
                    <p className={styles.muted}>No requests yet.</p>
                  )}
                  {apps.map((a) => (
                    <div key={a.bidId} className={styles.applicantRow}>
                      <span className={styles.applicantName}>{a.studentName}</span>
                      <span className={`${styles.reqStatus} ${styles[`r_${a.status}`] ?? ''}`}>
                        {a.status}
                      </span>
                    </div>
                  ))}
                  <p className={styles.note}>
                    An admin reviews and assigns requests.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <BottomNav active="tasks" onSelect={onTab} variant="client" />
    </div>
  );
}
