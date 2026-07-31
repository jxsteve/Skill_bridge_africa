-- SkillBridge Africa — admin rating of a student's work, stored on the task.
--
-- The admin gives a 1–5 star rating on a project; it shows on the task for the
-- student and client once work is submitted/completed. Safe to re-run.

alter table projects add column if not exists rating smallint check (rating between 1 and 5);
alter table projects add column if not exists rating_note text;
