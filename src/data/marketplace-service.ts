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
  PROJECTS,
  TASKS,
  type Bid,
  type Project,
  type Task,
  type TaskCategory,
} from './marketplace';
import { buildNotifications, type AppNotification, type NotificationKind } from './notifications';
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

/** A user's projects (as student or client), shaped for the UI. */
export async function listMyProjects(userId: string): Promise<Project[]> {
  if (!isSupabaseConfigured) return PROJECTS;
  const rows = await repo.projects.listForUser(userId);
  return rows.map((p) => ({
    id: p.id,
    title: p.task?.title ?? 'Project',
    client: '',
    dueInDays: 0,
    budget: Number(p.amount),
    status: p.status === 'completed' ? 'Completed' : 'In Progress',
    stage: PROJECT_STAGE_LABEL[p.status] ?? 'In Progress',
    rating: p.rating ?? undefined,
  }));
}

// Fine-grained stage label (for the badge) vs the coarse In Progress/Completed tab.
const PROJECT_STAGE_LABEL: Record<string, string> = {
  in_progress: 'In Progress',
  submitted: 'Submitted',
  under_review: 'Under Admin Review',
  approved: 'Awaiting Client Approval',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const NOTIF_KINDS: NotificationKind[] = ['verification', 'bid', 'job', 'payment'];

/** A user's notifications, shaped for the UI (falls back to the mock feed). */
export async function listMyNotifications(userId: string, verified: boolean): Promise<AppNotification[]> {
  if (!isSupabaseConfigured) return buildNotifications(verified);
  const rows = await repo.notifications.listByUser(userId);
  return rows.map((n) => ({
    id: n.id,
    kind: (NOTIF_KINDS.includes(n.type as NotificationKind) ? n.type : 'job') as NotificationKind,
    title: n.title,
    body: n.body,
    time: new Date(n.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    link: n.link ?? undefined,
  }));
}

/** Place a bid on a task (student sets their own amount/delivery/note). */
export async function placeBid(
  taskId: string,
  studentId: string,
  amount: number,
  deliveryDays: number,
  message = '',
): Promise<{ ok: boolean; reason?: string }> {
  if (!isSupabaseConfigured) return { ok: true };
  try {
    await repo.bids.create({
      task_id: taskId,
      student_id: studentId,
      amount,
      delivery_days: deliveryDays,
      message,
    });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    return { ok: false, reason: /duplicate|unique/i.test(msg) ? 'already-applied' : 'failed' };
  }
}

// ---- Task requests / assignment ------------------------------------------

/** A student's request to work on a task (stored as a bid). */
export type Applicant = {
  bidId: string;
  studentId: string;
  studentName: string;
  amount: number;
  deliveryDays: number;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
};

/** Student requests to work on a task (defaults the amount to the task budget). */
export async function requestTask(
  taskId: string,
  studentId: string,
  amount: number,
  note = '',
): Promise<{ ok: boolean; reason?: string }> {
  if (!isSupabaseConfigured) return { ok: true };
  try {
    await repo.bids.create({ task_id: taskId, student_id: studentId, amount, delivery_days: 3, message: note });
    return { ok: true };
  } catch (e) {
    // Unique violation => already requested.
    const msg = e instanceof Error ? e.message : '';
    return { ok: false, reason: /duplicate|unique/i.test(msg) ? 'already-requested' : 'failed' };
  }
}

/** Whether a student has already requested/bid on a task (one allowed per task). */
export async function hasApplied(taskId: string, studentId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const rows = await repo.bids.listByTask(taskId);
  return rows.some((b) => b.student_id === studentId);
}

/** Applicants (requests) for a task. */
export async function listTaskApplicants(taskId: string): Promise<Applicant[]> {
  if (!isSupabaseConfigured) return [];
  const rows = await repo.bids.listByTaskWithStudent(taskId);
  return rows.map((b) => ({
    bidId: b.id,
    studentId: b.student_id,
    studentName: b.student?.full_name || b.student_id,
    amount: Number(b.amount),
    deliveryDays: b.delivery_days,
    status: b.status,
    message: b.message,
  }));
}

async function notify(userId: string, title: string, body: string, type: string, link?: string) {
  const base = { user_id: userId, title, body, type };
  try {
    await repo.notifications.create(link ? { ...base, link } : base);
  } catch {
    // If the `link` column isn't present yet (migration 0005 not applied),
    // retry without it so the notification still lands.
    if (link) {
      try {
        await repo.notifications.create(base);
      } catch {
        /* best-effort */
      }
    }
  }
}

/** Admin approves a request: assigns the task, creates the project, rejects the rest. */
export async function approveApplication(p: {
  bidId: string;
  taskId: string;
  studentId: string;
  amount: number;
  clientId: string;
  taskTitle?: string;
}): Promise<void> {
  const project = await repo.projects.createDirect({
    task_id: p.taskId,
    student_id: p.studentId,
    client_id: p.clientId,
    amount: p.amount,
  });
  await repo.bids.setStatus(p.bidId, 'approved');
  const others = await repo.bids.listByTask(p.taskId);
  await Promise.all(
    others
      .filter((b) => b.id !== p.bidId && b.status === 'pending')
      .map((b) => repo.bids.setStatus(b.id, 'rejected')),
  );
  await notify(
    p.studentId,
    'Request approved',
    `You’ve been assigned “${p.taskTitle ?? 'a task'}”. Open it to submit your work.`,
    'job',
    `/app/projects/${project.id}/submit`,
  );
}

/** Admin rejects a single request. */
export async function rejectApplication(
  bidId: string,
  opts?: { studentId?: string; taskTitle?: string },
): Promise<void> {
  await repo.bids.setStatus(bidId, 'rejected');
  if (opts?.studentId) {
    await notify(
      opts.studentId,
      'Request declined',
      `Your request for “${opts.taskTitle ?? 'a task'}” was not approved this time.`,
      'bid',
      '/app/browse',
    );
  }
}

/** Admin assigns a task directly to a student (no request needed). */
export async function assignTaskToStudent(p: {
  taskId: string;
  studentId: string;
  clientId: string;
  amount: number;
  taskTitle?: string;
}): Promise<void> {
  const project = await repo.projects.createDirect({
    task_id: p.taskId,
    student_id: p.studentId,
    client_id: p.clientId,
    amount: p.amount,
  });
  await notify(
    p.studentId,
    'Task assigned to you',
    `An admin assigned you “${p.taskTitle ?? 'a task'}”. Open it to submit your work.`,
    'job',
    `/app/projects/${project.id}/submit`,
  );
}

/** Tasks a client created, with live status (empty until Supabase is configured). */
export async function listClientTasks(clientId: string) {
  if (!isSupabaseConfigured) return [];
  return repo.tasks.listByClient(clientId);
}

// ---- Submissions (student delivers work) ---------------------------------

/** A file attached to a submission, shaped for display. */
export type SubmissionFile = { name: string; sizeLabel: string; url: string; isImage: boolean };

function fileNameFromUrl(url: string): string {
  try {
    const last = decodeURIComponent(url.split('/').pop() ?? 'file');
    // Paths are stored as `<ts>-<original name>`; strip the timestamp prefix.
    return last.replace(/^\d+-/, '');
  } catch {
    return 'file';
  }
}

function isImageUrl(url: string): boolean {
  return /\.(png|jpe?g|gif|webp)$/i.test(url.split('?')[0]);
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Student submits work on a project: uploads each file to Storage, records the
 * submission (moves the project to under_review), flips the task to under_review,
 * and notifies the client. Returns the public URLs.
 */
export async function submitWork(
  projectId: string,
  files: File[],
  note = '',
): Promise<{ ok: boolean; reason?: string }> {
  if (!isSupabaseConfigured) return { ok: true };
  try {
    const urls: string[] = [];
    for (const f of files) {
      const path = `${projectId}/${Date.now()}-${sanitizeName(f.name)}`;
      urls.push(await repo.storage.upload('submissions', path, f));
    }
    await repo.submissions.create({ project_id: projectId, note, files: urls });
    const project = await repo.projects.get(projectId);
    if (project) {
      await repo.tasks.setStatus(project.task_id, 'under_review');
      await notify(
        project.client_id,
        'Work submitted',
        'A student submitted work on your task. It’s now under review.',
        'job',
        `/client/task/${project.task_id}`,
      );
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : 'failed' };
  }
}

// ---- Client task detail (drives the client review flow off real data) -----

export type ClientTaskDetail = {
  taskId: string;
  title: string;
  budget: number;
  taskStatus: string;
  applicantCount: number;
  rating: number | null;
  project: {
    id: string;
    status: string;
    paymentStatus: string;
    amount: number;
    studentId: string;
    studentName: string;
  } | null;
  submission: { note: string; submittedAt: string; files: SubmissionFile[] } | null;
};

/** Everything the client needs to see one of their tasks through the whole flow. */
export async function getClientTaskDetail(taskId: string): Promise<ClientTaskDetail | null> {
  if (!isSupabaseConfigured) return null;
  const task = await repo.tasks.get(taskId);
  if (!task) return null;

  const project = await repo.projects.getByTask(taskId);
  let studentName = '';
  let submission: ClientTaskDetail['submission'] = null;
  const rating: number | null = project?.rating ?? null;

  if (project) {
    const prof = await repo.profiles.get(project.student_id);
    studentName = prof?.full_name || 'Assigned student';
    const subs = await repo.submissions.listByProject(project.id);
    if (subs.length) {
      const latest = subs[0];
      submission = {
        note: latest.note,
        submittedAt: new Date(latest.created_at).toLocaleString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }),
        files: (latest.files ?? []).map((url) => ({
          name: fileNameFromUrl(url),
          sizeLabel: 'File',
          url,
          isImage: isImageUrl(url),
        })),
      };
    }
  }

  const bidRows = await repo.bids.listByTask(taskId);

  return {
    taskId,
    title: task.title,
    budget: Number(task.budget),
    taskStatus: task.status,
    applicantCount: bidRows.length,
    rating,
    project: project
      ? {
          id: project.id,
          status: project.status,
          paymentStatus: project.payment_status,
          amount: Number(project.amount),
          studentId: project.student_id,
          studentName,
        }
      : null,
    submission,
  };
}

// ---- Admin: approve a student's submission (hand off to the client) -------

/** Admin approves submitted work → project 'approved', client can now review. */
export async function approveSubmission(p: {
  projectId: string;
  clientId: string;
  taskId?: string;
  taskTitle?: string;
}): Promise<void> {
  await repo.projects.setStatus(p.projectId, 'approved');
  await notify(
    p.clientId,
    'Work ready for your review',
    `The submitted work for “${p.taskTitle ?? 'your task'}” passed admin review. Approve it to release payment.`,
    'job',
    p.taskId ? `/client/task/${p.taskId}` : undefined,
  );
}

// ---- Admin rates a student's work (shows on the task) ---------------------

/** Admin gives (or updates) a star rating for the student's work on a project. */
export async function rateStudentWork(p: {
  projectId: string;
  studentId: string;
  clientId: string;
  studentName: string;
  rating: number;
  comment?: string;
  taskTitle?: string;
  taskId?: string;
}): Promise<void> {
  if (!isSupabaseConfigured) return;
  await repo.projects.setRating(p.projectId, p.rating, p.comment);
  await notify(
    p.studentId,
    'You received a rating',
    `An admin rated your work on “${p.taskTitle ?? 'a task'}” ${p.rating}★.`,
    'job',
    '/app/tasks',
  );
}

/** The admin's rating for a project's work, if any. */
export async function getProjectRating(
  projectId: string,
): Promise<{ rating: number; comment: string } | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const project = await repo.projects.get(projectId);
    return project && project.rating != null
      ? { rating: project.rating, comment: project.rating_note ?? '' }
      : null;
  } catch {
    return null;
  }
}

// ---- Wallets (simulated, for the demo) ------------------------------------

export type ClientWallet = { balance: number; totalFunded: number; totalSpent: number; onHold: number };
export type StudentWallet = { balance: number; totalEarned: number };

/** Client wallet figures: balance, lifetime funded/spent, and funds committed to active work. */
export async function getClientWallet(clientId: string): Promise<ClientWallet> {
  if (!isSupabaseConfigured) return { balance: 0, totalFunded: 0, totalSpent: 0, onHold: 0 };
  const [balance, txns, projects] = await Promise.all([
    repo.wallets.balance(clientId),
    repo.wallets.transactions(clientId),
    repo.projects.listByClient(clientId),
  ]);
  const totalFunded = txns.filter((t) => t.kind === 'funding').reduce((s, t) => s + Number(t.amount), 0);
  const totalSpent = txns
    .filter((t) => t.kind === 'payment')
    .reduce((s, t) => s + Math.abs(Number(t.amount)), 0);
  // "On hold" = amount committed to assigned-but-not-yet-paid work (+5% fee).
  const active = ['in_progress', 'submitted', 'under_review', 'approved'];
  const onHold = projects
    .filter((p) => active.includes(p.status))
    .reduce((s, p) => s + Number(p.amount) * 1.05, 0);
  return { balance, totalFunded, totalSpent, onHold };
}

/** Student wallet figures: balance and lifetime earnings. */
export async function getStudentWallet(studentId: string): Promise<StudentWallet> {
  if (!isSupabaseConfigured) return { balance: 0, totalEarned: 0 };
  const [balance, txns] = await Promise.all([
    repo.wallets.balance(studentId),
    repo.wallets.transactions(studentId),
  ]);
  const totalEarned = txns.filter((t) => t.kind === 'earning').reduce((s, t) => s + Number(t.amount), 0);
  return { balance, totalEarned };
}

/** How many of a client's tasks are approved by admin and awaiting the client's review. */
export async function getClientAttention(clientId: string): Promise<{ awaitingReview: number }> {
  if (!isSupabaseConfigured) return { awaitingReview: 0 };
  try {
    const projects = await repo.projects.listByClient(clientId);
    return { awaitingReview: projects.filter((p) => p.status === 'approved').length };
  } catch {
    return { awaitingReview: 0 };
  }
}

/** Top up the client's simulated wallet. */
export async function fundWallet(userId: string, amount: number): Promise<number> {
  if (!isSupabaseConfigured) return amount;
  return repo.wallets.fund(userId, amount);
}

/** Release payment for a project (client approval). Returns the amounts + new balances. */
export async function releasePayment(projectId: string) {
  if (!isSupabaseConfigured) {
    return { amount: 0, fee: 0, total: 0, client_balance: 0, student_balance: 0, already_released: false };
  }
  const result = await repo.wallets.release(projectId);
  // Tell both parties what just happened (feeds their dashboards + notifications).
  if (!result.already_released) {
    try {
      const project = await repo.projects.get(projectId);
      if (project) {
        const task = await repo.tasks.get(project.task_id);
        const title = task?.title ?? 'the task';
        await notify(
          project.student_id,
          'Payment received',
          `You’ve been paid $${Number(result.amount).toFixed(2)} for “${title}”. Your task is complete.`,
          'payment',
          '/app/tasks',
        );
        await notify(
          project.client_id,
          'Payment released',
          `You released $${Number(result.total).toFixed(2)} for “${title}”. The task is now complete.`,
          'payment',
          `/client/task/${project.task_id}`,
        );
      }
    } catch {
      // Best-effort — never block the payout on a notification write.
    }
  }
  return result;
}

/** Notify a student of an admin verification decision (impact reaches their feed). */
export async function notifyVerificationDecision(
  studentId: string,
  decision: 'verified' | 'rejected',
): Promise<void> {
  if (!isSupabaseConfigured) return;
  if (decision === 'verified') {
    await notify(
      studentId,
      'You’re verified 🎉',
      'An admin approved your verification. Browse open tasks and start bidding.',
      'verification',
      '/app/browse',
    );
  } else {
    await notify(
      studentId,
      'Verification not approved',
      'Your verification wasn’t approved this time. Update your details and resubmit.',
      'verification',
      '/profile-setup',
    );
  }
}
