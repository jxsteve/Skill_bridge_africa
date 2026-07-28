/**
 * Admin data aggregations for the admin panel. All reads go through Supabase;
 * amounts are summed client-side (fine at demo scale). Values are the app's
 * platform token (shown as $), not Naira — the wireframe's ₦ figures were
 * placeholder copy.
 */
import { db, isSupabaseConfigured } from '../lib/supabase';
import type { ProjectRow, StudentProfileRow, VerificationState } from './db-types';

export type VerificationRow = StudentProfileRow & {
  profile: { full_name: string; email: string } | null;
};

export type EscrowRow = ProjectRow & {
  task: { title: string } | null;
  client: { full_name: string } | null;
  student: { full_name: string } | null;
};

export type ReviewRow = {
  id: string;
  project_id: string | null;
  student_id: string | null;
  client_id: string | null;
  rating: number;
  comment: string;
  status: 'published' | 'flagged' | 'removed';
  reviewer_name: string;
  student_name: string;
  created_at: string;
};

export type AdminOverview = {
  verifiedStudents: number;
  pendingVerifications: number;
  totalStudents: number;
  activeEscrows: number;
  heldAmount: number;
  releasedAmount: number;
  awaitingApproval: number;
  disputed: number;
};

/** Student verification queue with the student's name/email joined in. */
export async function listVerifications(): Promise<VerificationRow[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await db()
    .from('student_profiles')
    .select('*, profile:profiles!student_profiles_user_id_fkey(full_name, email)')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as VerificationRow[];
}

/** All escrow contracts (projects) with task title and party names. */
export async function listEscrows(): Promise<EscrowRow[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await db()
    .from('projects')
    .select(
      '*, task:tasks(title), client:profiles!projects_client_id_fkey(full_name), student:profiles!projects_student_id_fkey(full_name)',
    )
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as EscrowRow[];
}

/** Reviews (empty if the reviews table/migration isn't present yet). */
export async function listReviews(): Promise<ReviewRow[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await db()
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return []; // table may not exist yet
  return (data ?? []) as ReviewRow[];
}

/** Dashboard counters, computed from the verification + escrow lists. */
export function computeOverview(verifs: VerificationRow[], escrows: EscrowRow[]): AdminOverview {
  const isFunded = (p: EscrowRow) => p.payment_status === 'funded';
  const isReleased = (p: EscrowRow) => p.payment_status === 'released';
  const awaiting = (p: EscrowRow) => p.status === 'under_review' || p.status === 'submitted';
  return {
    verifiedStudents: verifs.filter((v) => v.verification === 'verified').length,
    pendingVerifications: verifs.filter((v) => v.verification === 'pending').length,
    totalStudents: verifs.length,
    activeEscrows: escrows.filter(isFunded).length,
    heldAmount: escrows.filter(isFunded).reduce((s, p) => s + Number(p.amount), 0),
    releasedAmount: escrows.filter(isReleased).reduce((s, p) => s + Number(p.amount), 0),
    awaitingApproval: escrows.filter(awaiting).length,
    disputed: escrows.filter((p) => p.status === 'cancelled').length,
  };
}

/** Set a student's verification state. */
export async function setVerification(userId: string, verification: VerificationState): Promise<void> {
  const { error } = await db().from('student_profiles').update({ verification }).eq('user_id', userId);
  if (error) throw error;
}

/** Update an escrow's mirrored payment status (release/refund resolution). */
export async function setEscrowPayment(
  projectId: string,
  payment_status: ProjectRow['payment_status'],
): Promise<void> {
  const { error } = await db().from('projects').update({ payment_status }).eq('id', projectId);
  if (error) throw error;
}

/** Moderate a review. */
export async function setReviewStatus(id: string, status: ReviewRow['status']): Promise<void> {
  const { error } = await db().from('reviews').update({ status }).eq('id', id);
  if (error) throw error;
}
