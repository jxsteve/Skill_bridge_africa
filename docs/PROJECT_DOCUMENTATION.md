# SkillBridge Africa — Project Documentation

**Your Skills. Our Bridge.**

A trust-first freelance marketplace that connects verified African university students with real, paid client work — with escrow-backed payments and admin-mediated trust at its core.

- **Live product:** https://skillbridge-africa-193.netlify.app
- **Repository:** github.com/jxsteve/Skill_bridge_africa
- **Status:** Functional MVP (live)

---

## 1. Executive summary

SkillBridge Africa is a marketplace where clients post tasks and verified students bid on and deliver them. An admin layer verifies students, oversees assignments, and safeguards payments held in escrow — so both sides can transact with confidence.

The product is built as **one shared task lifecycle** feeding **three connected experiences**: a Student app, a Client app, and an Admin console. When one party acts, the others see it immediately — there are no divergent states.

The result is a working end-to-end product: a client funds a wallet, an admin assigns a verified student, the student delivers, the work is reviewed and approved, and payment is released — crediting the student and debiting the client automatically, with the task marked complete everywhere at once.

---

## 2. The problem

In a marketplace connecting students with clients, talent and opportunity exist — but trust and payment don't connect them:

- **Students can't break in.** Skilled students have no track record, so clients won't risk hiring them — and they can't build a record without work.
- **Clients fear the risk.** Paying an unknown student upfront is risky; there's no guarantee the work lands or meets the brief.
- **There's no safe money rail.** Without escrow or oversight, neither side trusts the payment — so the deal never happens.

The core challenge was therefore not a feature — it was **making strangers comfortable enough to transact**.

---

## 3. The solution — four pillars

Every part of the product serves at least one of four pillars:

| Pillar | What it delivers |
|---|---|
| **Identity** | Students earn a verified badge through an admin-reviewed check, so clients know exactly who they're hiring. |
| **Discovery** | Clients find the right student and students find real, relevant tasks — through bids and quick requests, with rich search. |
| **Escrow** | Funds sit in escrow and are released only when work is approved — visible and legible, never a leap of faith. |
| **Trust** | Admin oversight, ratings and shared status make the whole exchange transparent to all three sides at once. |

---

## 4. Users & roles

| Role | What they do |
|---|---|
| **Student** | Gets verified, browses and bids on tasks, delivers work, gets paid, and builds a track record (projects, clients, rating, earnings). |
| **Client** | Funds a wallet, posts tasks, reviews and approves delivered work, and releases payment from escrow. |
| **Admin** | Verifies students, assigns/approves work, monitors escrow, releases disputed payments, and rates the quality of each delivery. |

One account can act as both a student and a client; the admin console is a separate, credential-gated experience.

---

## 5. Core features

### Identity & verification
- Passwordless sign-up and login (email one-time code), with an embedded wallet created automatically on sign-up.
- A student/client toggle at login routes each user to the right experience.
- Student verification is an admin-reviewed request; students see a clear "verification in progress" state and receive a notification when approved. Verified status is what unlocks being assigned to work.

### Student profile
- Real, live statistics: completed projects, distinct clients hired by, average rating and review count, active bids, lifetime earnings, and verification status.
- Full details entered during setup (university, department, registration number, skills, bio, LinkedIn, availability) are stored and displayed, and the edit form pre-fills with existing data.

### Discovery, search & bidding
- A "Find Work" marketplace of open tasks; each job card shows the client's **company name**.
- **Multi-field search** across title, description, job type/category, required skills, company, budget (e.g. "200" or "$200") and due date — matching every term entered.
- Students can **place a bid** (set their own price, delivery time and pitch) or send a **quick request**. "My Bids" reflects their real, live bids.

### The task lifecycle (synchronized across all three roles)
1. **Client** posts a task → it awaits admin review.
2. **Students** bid on or request the task.
3. **Admin** reviews and assigns the best-fit student → escrow is marked funded.
4. **Student** delivers the work (real file upload with previews).
5. **Admin** reviews and approves the submission → hands it to the client.
6. **Client** reviews the work and either **requests changes** (reopens the task and notifies the student) or **approves** it.
7. On approval, **payment is released** from escrow, the student is credited, the client is debited, and the task is marked complete everywhere.

While a task is still awaiting admin review, the client can **edit or delete** it. After it's submitted, the student can **view and edit their submission** rather than starting a new one.

### Escrow & wallets
- Clients fund an in-app wallet; the platform wallet address and network are shown.
- **Money model:** the client pays the task amount **plus a 5% platform fee**; the platform keeps the fee; the student receives the full task amount.
- On release, balances move atomically: the client is debited (amount + fee), the student is credited (amount), the project and task are marked complete, and a wallet ledger entry is recorded for both parties.
- Wallet balances, funded/spent totals and amounts on hold are shown on the client dashboard and profile; students see their balance and earnings.

### Ratings & reviews
- The client rates the delivered work (stars + written review) at the end of the flow; the admin can also rate the quality of a delivery.
- The rating and comment are attached to the task and shown to the student on their completed tasks, and to the client on the task detail.

### Notifications & "Needs your attention"
- Per-user notifications for every cross-role event (assignment, submission, approval, payment, verification, review).
- Notifications are **deep-linked** — they open the exact task/screen where action is needed.
- Every dashboard (student, client, admin) has a **"Needs your attention"** section surfacing the next real action for whoever is holding the ball.

### Admin console (web)
- Credential-gated login that persists across page refreshes for the session.
- **Dashboard** with a single "Needs your attention" queue (pending verifications + submissions to review) and a recent escrow-activity feed.
- **Student Verification** queue with approve/reject and per-student detail.
- **Tasks** management with applicant review and student assignment.
- **Escrow Monitoring** with a clear payment breakdown (amount · fee · total · student receives), an "approve submission → send to client" action, real payment release, refund and dispute handling, and a per-task student rating control.
- **Live-activity detection:** the console polls in the background and shows a non-blocking "New activity — Refresh" banner when a student or client changes something, so the admin never has to guess when to refresh.
- **Sidebar count badges** showing how many items in each section need attention (new open tasks, pending verifications, submissions to review).

### Marketing landing page
- A public landing page with a hero built from the real product dashboard, a statistics band, a photo showcase, testimonials, and tasteful entrance/scroll animations.

---

## 6. Technology stack

| Layer | Technology |
|---|---|
| **Frontend framework** | React 18 + TypeScript |
| **Build tool / dev server** | Vite |
| **Routing** | React Router |
| **Styling** | CSS Modules; design tokens (brand blue, green, violet) |
| **Typography** | Manrope |
| **Authentication** | Privy — passwordless email one-time-code login + embedded wallets |
| **Wallet network** | Solana (embedded wallet addresses) |
| **Backend & database** | Supabase — PostgreSQL with the PostgREST auto-generated REST API |
| **Access control** | PostgreSQL Row-Level Security |
| **File storage** | Supabase Storage (student work submissions) |
| **Server-side logic** | PostgreSQL functions / RPC (wallet funding & atomic payment release) |
| **Hosting & delivery** | Netlify (static single-page-app hosting, CLI deployments) |
| **Version control** | Git / GitHub |
| **Design** | Figma (wireframes, screen flows, product showcase) |

---

## 7. System architecture

**A single-page React application talking directly to Supabase.**

- The **frontend** (React + Vite) is a static bundle served by Netlify. Client-side routing is handled by React Router, with a redirect rule so every route resolves to the app.
- **Supabase** provides the database (PostgreSQL), an auto-generated REST API (PostgREST), file storage, and server-side functions — reached from the app through a typed data-access layer so all query shapes live in one place.
- **Authentication** is handled by Privy (email OTP + embedded wallet). Each authenticated user maps to one row in the `profiles` table.
- **Money movement** for the demo is handled by two PostgreSQL functions — one to fund a wallet and one to release payment atomically (debit client, credit student, complete the task, write the ledger). This keeps the balance changes consistent in a single database transaction.
- **File submissions** are uploaded to a Supabase Storage bucket and referenced by URL, so the client and admin can preview a student's delivered work.

---

## 8. Data model

The database is organized around identity, work, and money:

| Table | Purpose |
|---|---|
| `profiles` | One row per authenticated user — email, role, wallet address, simulated wallet balance. |
| `student_profiles` | Student details — university, department, skills, portfolio, verification status. |
| `client_profiles` | Client details — company name, about, verification status. |
| `tasks` | Posted work — title, category, budget, skills, due date, lifecycle status. |
| `task_attachments` | Files attached to a task brief. |
| `bids` | A student's bid or request on a task. |
| `projects` | A task assigned to a student — amount, status, mirrored payment status, and the work rating. |
| `submissions` | Work delivered on a project (uploaded files + note). |
| `notifications` | Per-user notifications with deep links. |
| `wallet_transactions` | The simulated wallet ledger (funding, payments, earnings). |

Schema changes are managed as ordered SQL migration files (initial schema, access policies, wallets & payment functions, notification links, per-task ratings).

---

## 9. Security & access

- **Authentication** is passwordless (email one-time code); there are no stored passwords.
- **Row-Level Security** is enabled on every table. For the pre-launch demo, permissive policies allow the app to operate with the public anon key; the intended production posture is to enforce per-user ownership through the identity bridge.
- The **admin console** is protected by a credential gate, required once per browser session.
- Secrets (database keys) are supplied through environment variables and are never committed to the repository.

---

## 10. Deployment & delivery

- The app is hosted on **Netlify** as a static single-page application and is **live** at https://skillbridge-africa-193.netlify.app.
- Deployments are produced by building the app and publishing the output through the Netlify CLI.
- Environment configuration (database URL and public key) is injected at build time.
- Single-page-app routing is handled with a redirect rule so deep links resolve correctly.

---

## 11. Design process & assets

The product was designed before it was built, so the whole team shared one mental model:

1. **Research & framing** — reducing a broad idea to the four pillars (identity, discovery, escrow, trust).
2. **Wireframes** — low-fidelity admin and app screens.
3. **High-fidelity screens & flows** — the student, client and admin experiences, laid out as a connected flow.
4. **A design system** — a small set of reusable patterns and tokens (the brand colours, status pills, the "attention" card) so screens are assembled from known parts.
5. **A product case study & showcase** — the narrative and the app on display, for presentation and hand-off.

Design was produced and documented in **Figma**.

---

## 12. Team & collaboration

- Work is tracked in a shared **Git/GitHub** repository with multiple contributors, using feature branches and pull requests.
- Commits are descriptive and scoped, giving a clear history of how the product evolved.

---

## 13. Project status

**A working product — not just screens.** The following are live and function end-to-end:

- Student, client and admin experiences, fully synchronized off one task lifecycle.
- The complete escrow loop: fund → assign → deliver → approve → release, with the student credited and the client debited automatically.
- A real admin console: verification queue, task management and assignment, escrow monitoring, and per-task ratings.
- Real file uploads for student work, and legible, attention-first dashboards for every role.

---

## 14. Roadmap / future work

- Move escrow **on-chain** for real, auditable settlement.
- Feed ratings into **discovery and ranking** so strong students surface higher.
- Add **in-app messaging** between clients and students.
- Add a **dispute-resolution** workflow.
- Harden **row-level security** for production launch.

---

*SkillBridge Africa — connecting African university talent with the clients who need it, safely.*
