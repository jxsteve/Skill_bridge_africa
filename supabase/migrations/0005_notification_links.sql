-- SkillBridge Africa — clickable notifications
--
-- Adds an in-app deep link to each notification so the "Needs your attention"
-- feeds can take the user straight to the relevant task to act on it.
-- Safe to re-run.

alter table notifications add column if not exists link text;
