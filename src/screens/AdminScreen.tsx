/**
 * Admin console — view, edit and manage all data across the platform.
 * Reads/writes go through the repo layer. In demo mode the anon role has full
 * access; once the JWT bridge + strict RLS are on, only profiles.role = 'admin'
 * will be able to load this data.
 */
import { useCallback, useEffect, useState } from 'react';

import { isSupabaseConfigured } from '../lib/supabase';
import {
  bids as bidsRepo,
  profiles as profilesRepo,
  projects as projectsRepo,
  studentProfiles,
  tasks as tasksRepo,
} from '../data/repo';
import type {
  BidWithTask,
  TaskWithClient,
} from '../data/repo';
import type {
  Profile,
  ProjectRow,
  StudentProfileRow,
  UserRole,
  VerificationState,
} from '../data/db-types';
import styles from './AdminScreen.module.css';

type Tab = 'users' | 'tasks' | 'bids' | 'projects';
const TABS: Tab[] = ['users', 'tasks', 'bids', 'projects'];

export default function AdminScreen({ onExit }: { onExit: () => void }) {
  const [tab, setTab] = useState<Tab>('users');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<Profile[]>([]);
  const [students, setStudents] = useState<StudentProfileRow[]>([]);
  const [tasks, setTasks] = useState<TaskWithClient[]>([]);
  const [bids, setBids] = useState<BidWithTask[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);

  const reload = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [u, s, t, b, p] = await Promise.all([
        profilesRepo.list(),
        studentProfiles.listAll(),
        tasksRepo.listAll(),
        bidsRepo.listAll(),
        projectsRepo.listAll(),
      ]);
      setUsers(u);
      setStudents(s);
      setTasks(t);
      setBids(b);
      setProjects(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const verificationOf = (userId: string): VerificationState =>
    students.find((s) => s.user_id === userId)?.verification ?? 'unverified';

  const setRole = async (id: string, role: UserRole) => {
    await profilesRepo.setRole(id, role);
    void reload();
  };
  const setVerification = async (userId: string, v: VerificationState) => {
    await studentProfiles.setVerification(userId, v);
    void reload();
  };
  const setBidStatus = async (id: string, s: 'approved' | 'rejected' | 'pending') => {
    await bidsRepo.setStatus(id, s);
    void reload();
  };
  const setTaskStatus = async (id: string, s: TaskWithClient['status']) => {
    await tasksRepo.setStatus(id, s);
    void reload();
  };
  const removeTask = async (id: string) => {
    await tasksRepo.remove(id);
    void reload();
  };
  const setProjectPayment = async (id: string, s: ProjectRow['payment_status']) => {
    await projectsRepo.setPaymentStatus(id, s);
    void reload();
  };

  const counts = {
    users: users.length,
    tasks: tasks.length,
    bids: bids.length,
    projects: projects.length,
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <p className={styles.title}>Admin Console</p>
          <p className={styles.subtitle}>Manage all platform data</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.ghostBtn} onClick={() => void reload()}>
            Refresh
          </button>
          <button className={styles.ghostBtn} onClick={onExit}>
            Exit
          </button>
        </div>
      </header>

      <nav className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t[0].toUpperCase() + t.slice(1)} ({counts[t]})
          </button>
        ))}
      </nav>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.muted}>Loading…</p>}

      <div className={styles.body}>
        {tab === 'users' &&
          users.map((u) => (
            <div key={u.id} className={styles.card}>
              <div className={styles.cardMain}>
                <span className={styles.cardTitle}>{u.full_name || '(no name)'}</span>
                <span className={styles.cardMeta}>{u.email}</span>
                <span className={styles.cardMetaSmall}>{u.id}</span>
              </div>
              <div className={styles.cardControls}>
                <span className={`${styles.pill} ${u.role === 'admin' ? styles.pillAdmin : ''}`}>
                  {u.role}
                </span>
                <span className={styles.pill}>verif: {verificationOf(u.id)}</span>
                <button
                  className={styles.smallBtn}
                  onClick={() => void setRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                >
                  {u.role === 'admin' ? 'Revoke admin' : 'Make admin'}
                </button>
                <button className={styles.smallBtn} onClick={() => void setVerification(u.id, 'verified')}>
                  Verify
                </button>
                <button className={styles.smallBtn} onClick={() => void setVerification(u.id, 'rejected')}>
                  Reject
                </button>
              </div>
            </div>
          ))}

        {tab === 'tasks' &&
          tasks.map((t) => (
            <div key={t.id} className={styles.card}>
              <div className={styles.cardMain}>
                <span className={styles.cardTitle}>{t.title}</span>
                <span className={styles.cardMeta}>
                  {t.category} · ${Number(t.budget).toFixed(2)} · by {t.client?.full_name || t.client_id}
                </span>
              </div>
              <div className={styles.cardControls}>
                <select
                  className={styles.select}
                  value={t.status}
                  onChange={(e) => void setTaskStatus(t.id, e.target.value as TaskWithClient['status'])}
                >
                  {['open', 'assigned', 'in_progress', 'under_review', 'completed', 'cancelled'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button className={styles.dangerBtn} onClick={() => void removeTask(t.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}

        {tab === 'bids' &&
          bids.map((b) => (
            <div key={b.id} className={styles.card}>
              <div className={styles.cardMain}>
                <span className={styles.cardTitle}>{b.task?.title || b.task_id}</span>
                <span className={styles.cardMeta}>
                  ${Number(b.amount).toFixed(2)} · {b.delivery_days}d · by {b.student_id}
                </span>
              </div>
              <div className={styles.cardControls}>
                <span className={styles.pill}>{b.status}</span>
                <button className={styles.smallBtn} onClick={() => void setBidStatus(b.id, 'approved')}>
                  Approve
                </button>
                <button className={styles.smallBtn} onClick={() => void setBidStatus(b.id, 'rejected')}>
                  Reject
                </button>
              </div>
            </div>
          ))}

        {tab === 'projects' &&
          projects.map((p) => (
            <div key={p.id} className={styles.card}>
              <div className={styles.cardMain}>
                <span className={styles.cardTitle}>Project {p.id.slice(0, 8)}</span>
                <span className={styles.cardMeta}>
                  ${Number(p.amount).toFixed(2)} · {p.status}
                </span>
              </div>
              <div className={styles.cardControls}>
                <span className={styles.pill}>pay: {p.payment_status}</span>
                <select
                  className={styles.select}
                  value={p.payment_status}
                  onChange={(e) => void setProjectPayment(p.id, e.target.value as ProjectRow['payment_status'])}
                >
                  {['unfunded', 'funded', 'released', 'refunded'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

        {!loading && counts[tab] === 0 && <p className={styles.muted}>No {tab} yet.</p>}
      </div>
    </div>
  );
}
