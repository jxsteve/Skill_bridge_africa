# Supabase setup

This connects the app to a real database so data entered by students and clients
is stored, queried, edited, and managed by an admin. Do this once.

## 1. Create the project
1. Go to https://supabase.com → **New project** (free tier is fine).
2. Pick a name (e.g. `skillbridge-africa`) and a strong DB password. Region: closest to your users (e.g. West Europe / London).

## 2. Run the schema
1. In the project, open **SQL Editor → New query**.
2. Paste the full contents of [`migrations/0001_init.sql`](./migrations/0001_init.sql) and click **Run**.
3. You should see the tables under **Table Editor**: `profiles`, `student_profiles`, `client_profiles`, `tasks`, `task_attachments`, `bids`, `projects`, `submissions`, `notifications`.

## 3. Create storage buckets (for uploads)
Under **Storage**, create these **public** buckets (used for student ID, avatars, portfolio, task attachments, submission files):
- `avatars`
- `student-ids`
- `portfolio`
- `attachments`
- `submissions`

## 4. Get your keys
**Project Settings → API**. Copy:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** key → `VITE_SUPABASE_ANON_KEY`

Put them in a local `.env` file (see `.env.example`) and in **Netlify → Site settings → Environment variables** for production builds. The anon key is safe to expose; never ship the `service_role` key.

## 5. Connect Privy identity to row-level security (important)
The app authenticates with Privy, not Supabase Auth. For the security rules to
recognize a user, Supabase must trust Privy's JWT so `auth.jwt() ->> 'sub'`
resolves to the Privy user id.

Configure **Authentication → Sign In / Providers → Third-party auth** (or the JWT
settings) to accept tokens from Privy's issuer, using Privy's JWKS URL from the
Privy dashboard (App settings → verification key / JWKS). Once set, the app
forwards the Privy access token on every request (see `src/lib/supabase.ts`).

> Until this bridge is configured, treat the connection as **demo-only** — the
> RLS policies won't be able to identify users, so don't launch publicly.

## 6. Make yourself an admin
After logging into the app once (which creates your `profiles` row), run in the
SQL editor:
```sql
update profiles set role = 'admin' where email = 'YOUR-EMAIL';
```

## What the app does once configured
`src/lib/supabase.ts` reads the env vars; if present, all screens use the live
database via `src/data/repo.ts`. If absent, the app falls back to the bundled
mock data, so it always runs.
