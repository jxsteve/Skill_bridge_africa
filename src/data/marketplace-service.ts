/**
 * UI-facing marketplace service. Screens call these and receive the same shapes
 * they already render (Task / Bid). Sources from Supabase when configured,
 * otherwise falls back to the bundled mock data so the app always runs.
 */
import { isSupabaseConfigured } from '../lib/supabase';
import * as repo from './repo';
import type { NewTaskDetails } from '../screens/CreateTaskScreen';
import {
  BIDS,
  TASKS,
  type Bid,
  type Task,
  type TaskCategory,
} from './marketplace';
import type { BidWithTask, TaskWithClient } from './repo';

// UI CreateTask categories collapse into the three DB buckets.
const CATEGORY_MAP: Record<string, TaskCategory> = {
  'UI/UX Design': 'Design',
  'Graphic Design': 'Design',
  'Video Editing': 'Design',
  'Web Development': 'Development',
  'Mobile App Development': 'Development',
  'Data Entry': 'Development',
  Other: 'Development',
  'Content Writing': 'Writing',
};

function daysUntil(dueDate: string | null): number {
  if (!dueDate) return 0;
  const due = new Date(`${dueDate}T00:00:00`).getTime();
  const now = new Date().setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((due - now) / 86_400_000));
}

function formatDate(dueDate: string | null): string {
  if (!dueDate) return '';
  const d = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dueDate;
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function toUiTask(row: TaskWithClient): Task {
  return {
    id: row.id,
    title: row.title,
    client: row.client?.full_name || 'Client',
    category: row.category,
    dueInDays: daysUntil(row.due_date),
    dueDate: formatDate(row.due_date),
    budget: Number(row.budget),
    featured: row.featured,
    description: row.description,
    skills: row.skills ?? [],
    attachments: (row.attachments ?? []).map((a) => ({
      name: a.name,
      size: a.size,
      kind: a.kind === 'image' ? 'image' : 'pdf',
    })),
  };
}

function toUiBid(row: BidWithTask): Bid {
  const status = row.status === 'approved' ? 'Approved' : row.status === 'rejected' ? 'Rejected' : 'Pending';
  return {
    id: row.id,
    title: row.task?.title ?? 'Task',
    client: '',
    dueInDays: row.delivery_days,
    budget: Number(row.amount),
    status,
    group: status === 'Approved' ? 'Won' : status === 'Pending' ? 'Pending' : 'Active',
  };
}

/** Open tasks a student can browse. */
export async function listOpenTasks(): Promise<Task[]> {
  if (!isSupabaseConfigured) return TASKS;
  const rows = await repo.tasks.listOpen();
  return rows.map(toUiTask);
}

/** A single task by id (falls back to mock). */
export async function getTask(id: string): Promise<Task | null> {
  if (!isSupabaseConfigured) return TASKS.find((t) => t.id === id) ?? null;
  const row = await repo.tasks.get(id);
  return row ? toUiTask(row) : null;
}

/** Persist a task a client created. Returns the new task id. */
export async function createTask(clientId: string, details: NewTaskDetails): Promise<string> {
  if (!isSupabaseConfigured) return 'mock-task';
  const row = await repo.tasks.create({
    client_id: clientId,
    title: details.title,
    category: CATEGORY_MAP[details.category] ?? 'Development',
    description: details.description,
    budget: details.budget,
    skills: details.skills,
    due_date: details.deadline || null,
  });
  return row.id;
}

/** A student's bids (falls back to mock). */
export async function listMyBids(studentId: string): Promise<Bid[]> {
  if (!isSupabaseConfigured) return BIDS;
  const rows = await repo.bids.listByStudent(studentId);
  return rows.map(toUiBid);
}

/** Convert a delivery label like "2 days" / "1 week" into a day count. */
export function deliveryToDays(label: string): number {
  const m = label.match(/(\d+)\s*(day|week)/i);
  if (!m) return 3;
  const n = parseInt(m[1], 10);
  return /week/i.test(m[2]) ? n * 7 : n;
}

/** Place a bid on a task. */
export async function placeBid(
  taskId: string,
  studentId: string,
  amount: number,
  deliveryDays: number,
  message = '',
): Promise<void> {
  if (!isSupabaseConfigured) return;
  await repo.bids.create({
    task_id: taskId,
    student_id: studentId,
    amount,
    delivery_days: deliveryDays,
    message,
  });
}
