/**
 * Data-access layer. Every screen and the admin console goes through these
 * functions instead of touching Supabase directly, so storage stays swappable
 * and the query shapes live in one place.
 *
 * Money movement (escrow/funding/release) is owned by the on-chain backend;
 * here we only read/write the mirrored `payment_status`.
 */
import { db } from '../lib/supabase';
import type {
  BidRow,
  BidStatus,
  ClientProfileRow,
  NotificationRow,
  PaymentStatus,
  Profile,
  ProjectRow,
  ProjectStatus,
  StudentProfileRow,
  SubmissionRow,
  TaskAttachmentRow,
  TaskRow,
  TaskStatus,
  UserRole,
  WalletTransactionRow,
} from './db-types';

function unwrap<T>({ data, error }: { data: T | null; error: unknown }): T {
  if (error) throw error;
  return data as T;
}

// ---- profiles -------------------------------------------------------------

export const profiles = {
  async get(id: string): Promise<Profile | null> {
    const { data, error } = await db()
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  /** Create the profile row on first login if missing. */
  async upsert(input: {
    id: string;
    email: string;
    role?: UserRole;
    full_name?: string;
    wallet_address?: string | null;
  }): Promise<Profile> {
    return unwrap(
      await db()
        .from('profiles')
        .upsert(input, { onConflict: 'id', ignoreDuplicates: false })
        .select()
        .single(),
    );
  },

  async setRole(id: string, role: UserRole): Promise<void> {
    const { error } = await db().from('profiles').update({ role }).eq('id', id);
    if (error) throw error;
  },

  /** Admin: list everyone, optionally filtered by role. */
  async list(role?: UserRole): Promise<Profile[]> {
    let q = db().from('profiles').select('*').order('created_at', { ascending: false });
    if (role) q = q.eq('role', role);
    return unwrap(await q);
  },
};

// ---- student / client profiles -------------------------------------------

export const studentProfiles = {
  async get(userId: string): Promise<StudentProfileRow | null> {
    const { data, error } = await db()
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  async save(row: Partial<StudentProfileRow> & { user_id: string }): Promise<StudentProfileRow> {
    return unwrap(
      await db().from('student_profiles').upsert(row, { onConflict: 'user_id' }).select().single(),
    );
  },
  async setVerification(userId: string, verification: StudentProfileRow['verification']): Promise<void> {
    const { error } = await db()
      .from('student_profiles')
      .update({ verification })
      .eq('user_id', userId);
    if (error) throw error;
  },
  /** Admin: all student profiles. */
  async listAll(): Promise<StudentProfileRow[]> {
    return unwrap(await db().from('student_profiles').select('*').order('updated_at', { ascending: false }));
  },
};

export const clientProfiles = {
  async get(userId: string): Promise<ClientProfileRow | null> {
    const { data, error } = await db()
      .from('client_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  async save(row: Partial<ClientProfileRow> & { user_id: string }): Promise<ClientProfileRow> {
    return unwrap(
      await db().from('client_profiles').upsert(row, { onConflict: 'user_id' }).select().single(),
    );
  },
};

// ---- tasks ----------------------------------------------------------------

export type TaskWithClient = TaskRow & {
  client: Pick<Profile, 'id' | 'full_name'> | null;
  attachments: TaskAttachmentRow[];
};

export const tasks = {
  /** Open marketplace tasks students can browse. */
  async listOpen(): Promise<TaskWithClient[]> {
    return unwrap(
      await db()
        .from('tasks')
        .select('*, client:profiles!tasks_client_id_fkey(id, full_name), attachments:task_attachments(*)')
        .eq('status', 'open')
        .order('created_at', { ascending: false }),
    );
  },
  async listByClient(clientId: string): Promise<TaskWithClient[]> {
    return unwrap(
      await db()
        .from('tasks')
        .select('*, client:profiles!tasks_client_id_fkey(id, full_name), attachments:task_attachments(*)')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false }),
    );
  },
  async get(id: string): Promise<TaskWithClient | null> {
    const { data, error } = await db()
      .from('tasks')
      .select('*, client:profiles!tasks_client_id_fkey(id, full_name), attachments:task_attachments(*)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  async create(input: {
    client_id: string;
    title: string;
    category: TaskRow['category'];
    description?: string;
    budget?: number;
    skills?: string[];
    due_date?: string | null;
  }): Promise<TaskRow> {
    return unwrap(await db().from('tasks').insert(input).select().single());
  },
  async update(id: string, patch: Partial<TaskRow>): Promise<void> {
    const { error } = await db().from('tasks').update(patch).eq('id', id);
    if (error) throw error;
  },
  async setStatus(id: string, status: TaskStatus): Promise<void> {
    const { error } = await db().from('tasks').update({ status }).eq('id', id);
    if (error) throw error;
  },
  async remove(id: string): Promise<void> {
    const { error } = await db().from('tasks').delete().eq('id', id);
    if (error) throw error;
  },
  /** Admin: everything, any status. */
  async listAll(): Promise<TaskWithClient[]> {
    return unwrap(
      await db()
        .from('tasks')
        .select('*, client:profiles!tasks_client_id_fkey(id, full_name), attachments:task_attachments(*)')
        .order('created_at', { ascending: false }),
    );
  },
};

// ---- bids -----------------------------------------------------------------

export type BidWithTask = BidRow & { task: Pick<TaskRow, 'id' | 'title' | 'budget'> | null };

export const bids = {
  async listByStudent(studentId: string): Promise<BidWithTask[]> {
    return unwrap(
      await db()
        .from('bids')
        .select('*, task:tasks(id, title, budget)')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false }),
    );
  },
  async listByTask(taskId: string): Promise<BidRow[]> {
    return unwrap(
      await db().from('bids').select('*').eq('task_id', taskId).order('created_at', { ascending: false }),
    );
  },
  /** Applicants for a task, each with the requesting student's name. */
  async listByTaskWithStudent(
    taskId: string,
  ): Promise<(BidRow & { student: Pick<Profile, 'id' | 'full_name'> | null })[]> {
    return unwrap(
      await db()
        .from('bids')
        .select('*, student:profiles!bids_student_id_fkey(id, full_name)')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false }),
    );
  },
  async create(input: {
    task_id: string;
    student_id: string;
    amount: number;
    message?: string;
    delivery_days?: number;
  }): Promise<BidRow> {
    return unwrap(await db().from('bids').insert(input).select().single());
  },
  async setStatus(id: string, status: BidStatus): Promise<void> {
    const { error } = await db().from('bids').update({ status }).eq('id', id);
    if (error) throw error;
  },
  /** Admin: every bid with its task title. */
  async listAll(): Promise<BidWithTask[]> {
    return unwrap(
      await db()
        .from('bids')
        .select('*, task:tasks(id, title, budget)')
        .order('created_at', { ascending: false }),
    );
  },
};

// ---- projects (assigned work) --------------------------------------------

export const projects = {
  async listByStudent(studentId: string): Promise<ProjectRow[]> {
    return unwrap(
      await db().from('projects').select('*').eq('student_id', studentId).order('created_at', { ascending: false }),
    );
  },
  async listByClient(clientId: string): Promise<ProjectRow[]> {
    return unwrap(
      await db().from('projects').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
    );
  },
  /** Projects where the user is either the student or the client, with task title. */
  async listForUser(userId: string): Promise<(ProjectRow & { task: { title: string } | null })[]> {
    return unwrap(
      await db()
        .from('projects')
        .select('*, task:tasks(title)')
        .or(`student_id.eq.${userId},client_id.eq.${userId}`)
        .order('created_at', { ascending: false }),
    );
  },
  /** Approve a bid -> create the project and flip task + bid status. */
  async createFromBid(bid: BidRow, clientId: string): Promise<ProjectRow> {
    const project = unwrap<ProjectRow>(
      await db()
        .from('projects')
        .insert({
          task_id: bid.task_id,
          bid_id: bid.id,
          student_id: bid.student_id,
          client_id: clientId,
          amount: bid.amount,
          payment_status: 'funded', // escrow funded on assignment (demo mirror)
        })
        .select()
        .single(),
    );
    await bids.setStatus(bid.id, 'approved');
    await tasks.setStatus(bid.task_id, 'assigned');
    return project;
  },
  /** Admin directly assigns a task to a student (no application needed). */
  async createDirect(input: {
    task_id: string;
    student_id: string;
    client_id: string;
    amount: number;
  }): Promise<ProjectRow> {
    const project = unwrap<ProjectRow>(
      await db()
        .from('projects')
        .insert({ ...input, payment_status: 'funded' }) // escrow funded on assignment
        .select()
        .single(),
    );
    await tasks.setStatus(input.task_id, 'assigned');
    return project;
  },
  async get(id: string): Promise<ProjectRow | null> {
    const { data, error } = await db().from('projects').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  /** The (latest) project for a task, if one has been assigned. */
  async getByTask(taskId: string): Promise<ProjectRow | null> {
    const { data, error } = await db()
      .from('projects')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  async setStatus(id: string, status: ProjectStatus): Promise<void> {
    const { error } = await db().from('projects').update({ status }).eq('id', id);
    if (error) throw error;
  },
  /** Mirror on-chain payment state (called after the backend confirms a tx). */
  async setPaymentStatus(id: string, payment_status: PaymentStatus, escrow_ref?: string): Promise<void> {
    const patch: Partial<ProjectRow> = { payment_status };
    if (escrow_ref !== undefined) patch.escrow_ref = escrow_ref;
    const { error } = await db().from('projects').update(patch).eq('id', id);
    if (error) throw error;
  },
  async listAll(): Promise<ProjectRow[]> {
    return unwrap(await db().from('projects').select('*').order('created_at', { ascending: false }));
  },
};

// ---- submissions ----------------------------------------------------------

export const submissions = {
  async listByProject(projectId: string): Promise<SubmissionRow[]> {
    return unwrap(
      await db().from('submissions').select('*').eq('project_id', projectId).order('created_at', { ascending: false }),
    );
  },
  async create(input: { project_id: string; note?: string; files?: string[] }): Promise<SubmissionRow> {
    const row = unwrap<SubmissionRow>(await db().from('submissions').insert(input).select().single());
    await projects.setStatus(input.project_id, 'under_review');
    return row;
  },
};

// ---- notifications --------------------------------------------------------

export const notifications = {
  async listByUser(userId: string): Promise<NotificationRow[]> {
    return unwrap(
      await db().from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    );
  },
  async markRead(id: string): Promise<void> {
    const { error } = await db().from('notifications').update({ read: true }).eq('id', id);
    if (error) throw error;
  },
  async create(input: { user_id: string; title: string; body?: string; type?: string }): Promise<NotificationRow> {
    return unwrap(await db().from('notifications').insert(input).select().single());
  },
};

// ---- file storage ---------------------------------------------------------

export const storage = {
  /** Upload a file and return its public URL. Bucket must exist (see setup). */
  async upload(bucket: string, path: string, file: File): Promise<string> {
    const { error } = await db().storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    return db().storage.from(bucket).getPublicUrl(path).data.publicUrl;
  },
};

// ---- wallets (simulated in-app balance for the demo) ----------------------
// Real money lives on-chain; these back the wallet figures shown in the UI so
// the end-to-end flow (fund → assign → pay → get paid) is demonstrable.

export const wallets = {
  /** Current simulated balance for a user (0 if no profile yet). */
  async balance(userId: string): Promise<number> {
    const { data, error } = await db()
      .from('profiles')
      .select('wallet_balance')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return Number(data?.wallet_balance ?? 0);
  },
  async transactions(userId: string): Promise<WalletTransactionRow[]> {
    return unwrap(
      await db()
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
    );
  },
  /** Top up a wallet; returns the new balance. */
  async fund(userId: string, amount: number): Promise<number> {
    const { data, error } = await db().rpc('fund_wallet', { p_user_id: userId, p_amount: amount });
    if (error) throw error;
    return Number(data);
  },
  /** Release payment for a project (debit client, credit student, complete task). */
  async release(projectId: string): Promise<{
    amount: number;
    fee: number;
    total: number;
    client_balance: number;
    student_balance: number;
    already_released: boolean;
  }> {
    const { data, error } = await db().rpc('release_payment', { p_project_id: projectId });
    if (error) throw error;
    return data as {
      amount: number;
      fee: number;
      total: number;
      client_balance: number;
      student_balance: number;
      already_released: boolean;
    };
  },
};
