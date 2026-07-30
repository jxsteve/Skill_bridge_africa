-- SkillBridge Africa — DEMO WALLETS + payment release
--
-- The production design keeps real money ON-CHAIN (owned by the blockchain
-- backend); the DB only mirrors `payment_status`. For the pre-launch DEMO we add
-- a simulated in-app wallet so the end-to-end flow (client pays → student is
-- credited → task completes) can be shown without the chain.
--
-- Money model (matches the client-facing "Work Approved" screen):
--   client pays  = amount + 5% platform fee
--   platform fee = amount * 0.05   (kept by the platform)
--   student gets = amount          (the full agreed amount)
--
-- Safe to re-run.

-- ---------------------------------------------------------------------------
-- Wallet balance on each profile (simulated; not the on-chain source of truth)
-- ---------------------------------------------------------------------------
alter table profiles add column if not exists wallet_balance numeric(14,2) not null default 0;

-- ---------------------------------------------------------------------------
-- Ledger of wallet movements (funding / payment / earning)
-- ---------------------------------------------------------------------------
drop table if exists wallet_transactions cascade;
create table wallet_transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null references profiles(id) on delete cascade,
  project_id  uuid references projects(id) on delete set null,
  kind        text not null,                    -- funding | payment | earning | fee | refund
  amount      numeric(14,2) not null,           -- signed: + credit, − debit
  description text default '',
  created_at  timestamptz not null default now()
);
create index wallet_tx_user_idx on wallet_transactions (user_id, created_at desc);

alter table wallet_transactions enable row level security;
drop policy if exists demo_all on wallet_transactions;
create policy demo_all on wallet_transactions for all to anon, authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- fund_wallet(user, amount) — top up a wallet and record the funding.
-- ---------------------------------------------------------------------------
create or replace function fund_wallet(p_user_id text, p_amount numeric)
returns numeric
language plpgsql
as $$
declare
  v_balance numeric(14,2);
begin
  update profiles set wallet_balance = wallet_balance + p_amount
    where id = p_user_id
    returning wallet_balance into v_balance;
  if not found then
    raise exception 'profile % not found', p_user_id;
  end if;
  insert into wallet_transactions (user_id, kind, amount, description)
    values (p_user_id, 'funding', p_amount, 'Wallet funded');
  return v_balance;
end;
$$;

-- ---------------------------------------------------------------------------
-- release_payment(project) — the atomic payout on client approval.
--   • debits the client (amount + 5% fee)
--   • credits the student (amount)
--   • records both ledger entries
--   • marks project completed + released, and the task completed
-- Idempotent: a second call on an already-released project is a no-op.
-- ---------------------------------------------------------------------------
create or replace function release_payment(p_project_id uuid)
returns jsonb
language plpgsql
as $$
declare
  v_project        projects%rowtype;
  v_amount         numeric(14,2);
  v_fee            numeric(14,2);
  v_total          numeric(14,2);
  v_client_balance numeric(14,2);
  v_student_balance numeric(14,2);
begin
  select * into v_project from projects where id = p_project_id for update;
  if not found then
    raise exception 'project % not found', p_project_id;
  end if;

  v_amount := v_project.amount;
  v_fee    := round(v_amount * 0.05, 2);
  v_total  := v_amount + v_fee;

  if v_project.payment_status = 'released' then
    select wallet_balance into v_client_balance  from profiles where id = v_project.client_id;
    select wallet_balance into v_student_balance from profiles where id = v_project.student_id;
    return jsonb_build_object(
      'already_released', true,
      'amount', v_amount, 'fee', v_fee, 'total', v_total,
      'client_balance', v_client_balance, 'student_balance', v_student_balance
    );
  end if;

  update profiles set wallet_balance = wallet_balance - v_total
    where id = v_project.client_id
    returning wallet_balance into v_client_balance;
  update profiles set wallet_balance = wallet_balance + v_amount
    where id = v_project.student_id
    returning wallet_balance into v_student_balance;

  insert into wallet_transactions (user_id, project_id, kind, amount, description)
    values (v_project.client_id, p_project_id, 'payment', -v_total,
            'Payment released (task amount + 5% platform fee)');
  insert into wallet_transactions (user_id, project_id, kind, amount, description)
    values (v_project.student_id, p_project_id, 'earning', v_amount,
            'Payment received for completed work');

  update projects set status = 'completed', payment_status = 'released' where id = p_project_id;
  update tasks    set status = 'completed' where id = v_project.task_id;

  return jsonb_build_object(
    'already_released', false,
    'amount', v_amount, 'fee', v_fee, 'total', v_total,
    'client_balance', v_client_balance, 'student_balance', v_student_balance
  );
end;
$$;

grant execute on function fund_wallet(text, numeric)  to anon, authenticated;
grant execute on function release_payment(uuid)       to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage bucket for student work submissions (public read for the demo).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('submissions', 'submissions', true)
  on conflict (id) do update set public = true;

drop policy if exists submissions_demo_read   on storage.objects;
drop policy if exists submissions_demo_write  on storage.objects;
create policy submissions_demo_read  on storage.objects for select to anon, authenticated
  using (bucket_id = 'submissions');
create policy submissions_demo_write on storage.objects for all to anon, authenticated
  using (bucket_id = 'submissions') with check (bucket_id = 'submissions');
