-- SkillBridge Africa — initial schema
-- Identity comes from Privy (email OTP + embedded wallet). Each Privy user id
-- (text, e.g. "did:privy:...") maps to one row in `profiles`.
--
-- Escrow / funding / payment MONEY MOVEMENT lives ON-CHAIN and is owned by the
-- blockchain backend. This DB only MIRRORS a coarse payment status so the UI can
-- render it; never treat these columns as the source of truth for funds.
--
-- Safe to re-run: the reset block below drops existing objects first. There is
-- no data to lose on a fresh project.

-- ---------------------------------------------------------------------------
-- Reset (idempotent apply)
-- ---------------------------------------------------------------------------
drop table if exists notifications    cascade;
drop table if exists submissions      cascade;
drop table if exists projects         cascade;
drop table if exists bids             cascade;
drop table if exists task_attachments cascade;
drop table if exists tasks            cascade;
drop table if exists client_profiles  cascade;
drop table if exists student_profiles cascade;
drop table if exists profiles         cascade;

drop function if exists auth_uid()          cascade;
drop function if exists is_admin()          cascade;
drop function if exists touch_updated_at()  cascade;

drop type if exists user_role          cascade;
drop type if exists verification_state cascade;
drop type if exists task_category      cascade;
drop type if exists task_status        cascade;
drop type if exists bid_status         cascade;
drop type if exists project_status     cascade;
drop type if exists payment_status     cascade;
drop type if exists attachment_kind    cascade;

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
-- One account can act as both client (posts tasks) and student (bids on tasks);
-- role only separates regular users from admins. Acting "as a student" just
-- means having a student_profile + bids; "as a client" means owning tasks.
create type user_role         as enum ('user', 'admin');
create type verification_state as enum ('unverified', 'pending', 'verified', 'rejected');
create type task_category      as enum ('Design', 'Development', 'Writing');
create type task_status        as enum ('open', 'assigned', 'in_progress', 'under_review', 'completed', 'cancelled');
create type bid_status         as enum ('pending', 'approved', 'rejected');
create type project_status     as enum ('in_progress', 'submitted', 'under_review', 'approved', 'completed', 'cancelled');
-- Mirror of on-chain state only:
create type payment_status     as enum ('unfunded', 'funded', 'released', 'refunded');
create type attachment_kind    as enum ('pdf', 'image', 'other');

-- ---------------------------------------------------------------------------
-- profiles — one row per authenticated user
-- ---------------------------------------------------------------------------
create table profiles (
  id             text primary key,             -- Privy user id
  email          text not null,
  role           user_role not null default 'user',
  full_name      text default '',
  wallet_address text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index profiles_role_idx on profiles (role);

-- Student-specific profile (1:1 with profiles; present when the user bids)
create table student_profiles (
  user_id       text primary key references profiles(id) on delete cascade,
  avatar_url    text default '',
  bio           text default '',
  university    text default '',
  department    text default '',
  reg_number    text default '',
  linkedin      text default '',
  student_id_url text default '',
  skills        text[] not null default '{}',
  portfolio     text[] not null default '{}',
  available     boolean not null default true,
  verification  verification_state not null default 'unverified',
  updated_at    timestamptz not null default now()
);

-- Client-specific profile (1:1 with profiles; present when the user posts tasks)
create table client_profiles (
  user_id      text primary key references profiles(id) on delete cascade,
  company_name text default '',
  about        text default '',
  verification verification_state not null default 'unverified',
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- tasks — posted by clients
-- ---------------------------------------------------------------------------
create table tasks (
  id          uuid primary key default gen_random_uuid(),
  client_id   text not null references profiles(id) on delete cascade,
  title       text not null,
  category    task_category not null,
  description text not null default '',
  budget      numeric(12,2) not null default 0,   -- denominated in the platform token
  skills      text[] not null default '{}',
  due_date    date,
  status      task_status not null default 'open',
  featured    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index tasks_client_idx on tasks (client_id);
create index tasks_status_idx on tasks (status);

create table task_attachments (
  id       uuid primary key default gen_random_uuid(),
  task_id  uuid not null references tasks(id) on delete cascade,
  name     text not null,
  size     text default '',
  kind     attachment_kind not null default 'other',
  url      text not null
);
create index task_attachments_task_idx on task_attachments (task_id);

-- ---------------------------------------------------------------------------
-- bids — students bidding on tasks
-- ---------------------------------------------------------------------------
create table bids (
  id            uuid primary key default gen_random_uuid(),
  task_id       uuid not null references tasks(id) on delete cascade,
  student_id    text not null references profiles(id) on delete cascade,
  amount        numeric(12,2) not null default 0,
  message       text default '',
  delivery_days integer not null default 3,
  status        bid_status not null default 'pending',
  created_at    timestamptz not null default now(),
  unique (task_id, student_id)                    -- one bid per student per task
);
create index bids_task_idx on bids (task_id);
create index bids_student_idx on bids (student_id);

-- ---------------------------------------------------------------------------
-- projects — a task assigned to a student (created when a bid is approved)
-- payment_status/escrow_ref MIRROR on-chain state owned by the backend dev.
-- ---------------------------------------------------------------------------
create table projects (
  id             uuid primary key default gen_random_uuid(),
  task_id        uuid not null references tasks(id) on delete cascade,
  bid_id         uuid references bids(id) on delete set null,
  student_id     text not null references profiles(id) on delete cascade,
  client_id      text not null references profiles(id) on delete cascade,
  amount         numeric(12,2) not null default 0,
  status         project_status not null default 'in_progress',
  payment_status payment_status not null default 'unfunded', -- mirror of chain
  escrow_ref     text,                                       -- on-chain tx/contract ref
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index projects_student_idx on projects (student_id);
create index projects_client_idx on projects (client_id);

-- ---------------------------------------------------------------------------
-- submissions — work delivered by a student on a project
-- ---------------------------------------------------------------------------
create table submissions (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  note       text default '',
  files      text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index submissions_project_idx on submissions (project_id);

-- ---------------------------------------------------------------------------
-- notifications — per-user
-- ---------------------------------------------------------------------------
create table notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    text not null references profiles(id) on delete cascade,
  title      text not null,
  body       text default '',
  type       text default 'info',
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on notifications (user_id, read);

-- ---------------------------------------------------------------------------
-- Helper functions (defined AFTER the tables they reference)
-- auth_uid(): current Privy user id from the verified JWT `sub` claim.
-- Requires Supabase to be configured to accept Privy-issued JWTs.
-- ---------------------------------------------------------------------------
create or replace function auth_uid() returns text
language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub',
    ''
  );
$$;

create or replace function is_admin() returns boolean
language sql stable as $$
  select exists (
    select 1 from profiles p where p.id = auth_uid() and p.role = 'admin'
  );
$$;

-- updated_at maintenance
create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger t_profiles_touch  before update on profiles         for each row execute function touch_updated_at();
create trigger t_student_touch   before update on student_profiles for each row execute function touch_updated_at();
create trigger t_client_touch    before update on client_profiles  for each row execute function touch_updated_at();
create trigger t_tasks_touch     before update on tasks            for each row execute function touch_updated_at();
create trigger t_projects_touch  before update on projects         for each row execute function touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Policies assume auth_uid() returns the Privy user id from a verified JWT.
-- Admins (profiles.role = 'admin') can read/write everything.
-- ---------------------------------------------------------------------------
alter table profiles         enable row level security;
alter table student_profiles enable row level security;
alter table client_profiles  enable row level security;
alter table tasks            enable row level security;
alter table task_attachments enable row level security;
alter table bids             enable row level security;
alter table projects         enable row level security;
alter table submissions      enable row level security;
alter table notifications    enable row level security;

-- profiles: anyone authenticated can read (needed to show client/student names);
-- users manage their own row; admins manage all.
create policy profiles_read   on profiles for select using (auth_uid() <> '');
create policy profiles_insert on profiles for insert with check (id = auth_uid());
create policy profiles_update on profiles for update using (id = auth_uid() or is_admin());
create policy profiles_admin_del on profiles for delete using (is_admin());

-- student_profiles / client_profiles: readable by all authed; owner or admin writes.
create policy sp_read   on student_profiles for select using (auth_uid() <> '');
create policy sp_write  on student_profiles for all using (user_id = auth_uid() or is_admin()) with check (user_id = auth_uid() or is_admin());
create policy cp_read   on client_profiles for select using (auth_uid() <> '');
create policy cp_write  on client_profiles for all using (user_id = auth_uid() or is_admin()) with check (user_id = auth_uid() or is_admin());

-- tasks: readable by all authed; client owns writes; admin overrides.
create policy tasks_read   on tasks for select using (auth_uid() <> '');
create policy tasks_insert on tasks for insert with check (client_id = auth_uid() or is_admin());
create policy tasks_update on tasks for update using (client_id = auth_uid() or is_admin());
create policy tasks_delete on tasks for delete using (client_id = auth_uid() or is_admin());

create policy att_read  on task_attachments for select using (auth_uid() <> '');
create policy att_write on task_attachments for all
  using (exists (select 1 from tasks t where t.id = task_id and (t.client_id = auth_uid() or is_admin())))
  with check (exists (select 1 from tasks t where t.id = task_id and (t.client_id = auth_uid() or is_admin())));

-- bids: student owns their bids; the task's client can read them; admin overrides.
create policy bids_read on bids for select using (
  student_id = auth_uid()
  or exists (select 1 from tasks t where t.id = task_id and t.client_id = auth_uid())
  or is_admin()
);
create policy bids_insert on bids for insert with check (student_id = auth_uid());
create policy bids_update on bids for update using (
  student_id = auth_uid()
  or exists (select 1 from tasks t where t.id = task_id and t.client_id = auth_uid())
  or is_admin()
);
create policy bids_delete on bids for delete using (student_id = auth_uid() or is_admin());

-- projects: the student, the client, or an admin.
create policy projects_read on projects for select using (
  student_id = auth_uid() or client_id = auth_uid() or is_admin()
);
create policy projects_write on projects for all using (
  student_id = auth_uid() or client_id = auth_uid() or is_admin()
) with check (
  student_id = auth_uid() or client_id = auth_uid() or is_admin()
);

-- submissions: parties on the parent project, or admin.
create policy submissions_rw on submissions for all
  using (exists (select 1 from projects p where p.id = project_id and (p.student_id = auth_uid() or p.client_id = auth_uid() or is_admin())))
  with check (exists (select 1 from projects p where p.id = project_id and (p.student_id = auth_uid() or is_admin())));

-- notifications: only the owner (or admin) sees them.
create policy notif_read   on notifications for select using (user_id = auth_uid() or is_admin());
create policy notif_write  on notifications for all using (user_id = auth_uid() or is_admin()) with check (user_id = auth_uid() or is_admin());
