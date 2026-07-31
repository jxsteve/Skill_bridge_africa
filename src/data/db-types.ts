/** Row shapes mirroring supabase/migrations/0001_init.sql. */

export type UserRole = 'user' | 'admin';
export type VerificationState = 'unverified' | 'pending' | 'verified' | 'rejected';
export type TaskCategory = 'Design' | 'Development' | 'Writing';
export type TaskStatus =
  | 'open'
  | 'assigned'
  | 'in_progress'
  | 'under_review'
  | 'completed'
  | 'cancelled';
export type BidStatus = 'pending' | 'approved' | 'rejected';
export type ProjectStatus =
  | 'in_progress'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'completed'
  | 'cancelled';
/** Mirror of on-chain state — not the source of truth for funds. */
export type PaymentStatus = 'unfunded' | 'funded' | 'released' | 'refunded';
export type AttachmentKind = 'pdf' | 'image' | 'other';

export type Profile = {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  wallet_address: string | null;
  /** Simulated in-app wallet balance (demo). Real funds live on-chain. */
  wallet_balance: number;
  created_at: string;
  updated_at: string;
};

/** A single movement in a user's simulated wallet. */
export type WalletTransactionRow = {
  id: string;
  user_id: string;
  project_id: string | null;
  kind: 'funding' | 'payment' | 'earning' | 'fee' | 'refund';
  amount: number; // signed: + credit, − debit
  description: string;
  created_at: string;
};

export type StudentProfileRow = {
  user_id: string;
  avatar_url: string;
  bio: string;
  university: string;
  department: string;
  reg_number: string;
  linkedin: string;
  student_id_url: string;
  skills: string[];
  portfolio: string[];
  available: boolean;
  verification: VerificationState;
  updated_at: string;
};

export type ClientProfileRow = {
  user_id: string;
  company_name: string;
  about: string;
  verification: VerificationState;
  updated_at: string;
};

export type TaskRow = {
  id: string;
  client_id: string;
  title: string;
  category: TaskCategory;
  description: string;
  budget: number;
  skills: string[];
  due_date: string | null;
  status: TaskStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type TaskAttachmentRow = {
  id: string;
  task_id: string;
  name: string;
  size: string;
  kind: AttachmentKind;
  url: string;
};

export type BidRow = {
  id: string;
  task_id: string;
  student_id: string;
  amount: number;
  message: string;
  delivery_days: number;
  status: BidStatus;
  created_at: string;
};

export type ProjectRow = {
  id: string;
  task_id: string;
  bid_id: string | null;
  student_id: string;
  client_id: string;
  amount: number;
  status: ProjectStatus;
  payment_status: PaymentStatus;
  escrow_ref: string | null;
  /** Admin's 1–5 star rating of the delivered work (null until rated). */
  rating: number | null;
  rating_note: string | null;
  created_at: string;
  updated_at: string;
};

export type SubmissionRow = {
  id: string;
  project_id: string;
  note: string;
  files: string[];
  created_at: string;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  /** Optional in-app deep link to the task/screen this notification is about. */
  link: string | null;
  read: boolean;
  created_at: string;
};
