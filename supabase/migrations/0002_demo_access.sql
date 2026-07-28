-- SkillBridge Africa — DEMO ACCESS (temporary)
--
-- ⚠️  INSECURE / PRE-LAUNCH ONLY. This replaces the strict per-user security
-- rules from 0001 with permissive ones so the app works using the public anon
-- key before the Privy↔Supabase JWT bridge is configured. While this is applied,
-- anyone with the anon key can read/write all data. Rows are still tagged with
-- each user's id (client_id / student_id / user_id) by the app, but the database
-- does not ENFORCE ownership.
--
-- TO HARDEN BEFORE LAUNCH: configure the Privy JWT bridge, then run
-- 0003_secure.sql (restores the strict policies) — or re-apply 0001's policies.

-- Drop the strict policies from 0001 ----------------------------------------
drop policy if exists profiles_read      on profiles;
drop policy if exists profiles_insert    on profiles;
drop policy if exists profiles_update    on profiles;
drop policy if exists profiles_admin_del on profiles;
drop policy if exists sp_read  on student_profiles;
drop policy if exists sp_write on student_profiles;
drop policy if exists cp_read  on client_profiles;
drop policy if exists cp_write on client_profiles;
drop policy if exists tasks_read   on tasks;
drop policy if exists tasks_insert on tasks;
drop policy if exists tasks_update on tasks;
drop policy if exists tasks_delete on tasks;
drop policy if exists att_read  on task_attachments;
drop policy if exists att_write on task_attachments;
drop policy if exists bids_read   on bids;
drop policy if exists bids_insert on bids;
drop policy if exists bids_update on bids;
drop policy if exists bids_delete on bids;
drop policy if exists projects_read  on projects;
drop policy if exists projects_write on projects;
drop policy if exists submissions_rw on submissions;
drop policy if exists notif_read  on notifications;
drop policy if exists notif_write on notifications;

-- Permissive demo policies (anon + authenticated, full CRUD) -----------------
create policy demo_all on profiles         for all to anon, authenticated using (true) with check (true);
create policy demo_all on student_profiles for all to anon, authenticated using (true) with check (true);
create policy demo_all on client_profiles  for all to anon, authenticated using (true) with check (true);
create policy demo_all on tasks            for all to anon, authenticated using (true) with check (true);
create policy demo_all on task_attachments for all to anon, authenticated using (true) with check (true);
create policy demo_all on bids             for all to anon, authenticated using (true) with check (true);
create policy demo_all on projects         for all to anon, authenticated using (true) with check (true);
create policy demo_all on submissions      for all to anon, authenticated using (true) with check (true);
create policy demo_all on notifications    for all to anon, authenticated using (true) with check (true);
