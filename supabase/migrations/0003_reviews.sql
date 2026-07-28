-- SkillBridge Africa — reviews (ratings & moderation)
-- Clients rate students after a project completes; admins moderate flagged ones.
-- Safe to re-run.

drop table if exists reviews cascade;
drop type if exists review_status cascade;

create type review_status as enum ('published', 'flagged', 'removed');

create table reviews (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid references projects(id) on delete set null,
  student_id    text references profiles(id) on delete set null,
  client_id     text references profiles(id) on delete set null,
  rating        integer not null default 5 check (rating between 1 and 5),
  comment       text default '',
  status        review_status not null default 'published',
  reviewer_name text default '',   -- denormalized for quick admin display
  student_name  text default '',
  created_at    timestamptz not null default now()
);
create index reviews_student_idx on reviews (student_id);
create index reviews_status_idx on reviews (status);

alter table reviews enable row level security;

-- Demo access (matches 0002). Harden alongside the rest before launch.
create policy demo_all on reviews for all to anon, authenticated using (true) with check (true);
