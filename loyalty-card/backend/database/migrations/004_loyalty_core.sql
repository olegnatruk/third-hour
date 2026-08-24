-- Apply after 001_authentication.sql through 003_accounts_and_roles.sql.

create type public.loyalty_card_status as enum ('active', 'completed');
create type public.stamp_transaction_type as enum (
  'earned',
  'reversed',
  'manual_adjustment'
);

create table public.loyalty_cards (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  card_number integer not null check (card_number > 0),
  status public.loyalty_card_status not null default 'active',
  stamp_count integer not null default 0 check (stamp_count between 0 and 10),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (customer_id, card_number),
  check (
    (status = 'active' and stamp_count between 0 and 9 and completed_at is null)
    or
    (status = 'completed' and stamp_count = 10 and completed_at is not null)
  )
);

create unique index one_active_loyalty_card_per_customer
  on public.loyalty_cards (customer_id)
  where status = 'active';

create table public.stamp_transactions (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.loyalty_cards (id) on delete restrict,
  stamp_change integer not null check (stamp_change <> 0),
  transaction_type public.stamp_transaction_type not null,
  reason text check (char_length(reason) <= 500),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  check (
    (transaction_type = 'earned' and stamp_change > 0)
    or (transaction_type = 'reversed' and stamp_change < 0)
    or transaction_type = 'manual_adjustment'
  ),
  check (
    transaction_type <> 'manual_adjustment'
    or nullif(trim(reason), '') is not null
  )
);

create index loyalty_cards_customer_history
  on public.loyalty_cards (customer_id, card_number desc);

create index stamp_transactions_card_history
  on public.stamp_transactions (card_id, created_at desc);

create trigger set_loyalty_cards_updated_at
  before update on public.loyalty_cards
  for each row execute procedure public.set_updated_at();

create or replace function public.prevent_stamp_transaction_change()
returns trigger
language plpgsql
as $$
begin
  raise exception 'Stamp transactions are immutable. Create a reversal or adjustment instead.';
end;
$$;

create trigger prevent_stamp_transaction_update
  before update or delete on public.stamp_transactions
  for each row execute procedure public.prevent_stamp_transaction_change();

create or replace function public.create_initial_loyalty_card()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.loyalty_cards (customer_id, card_number)
  values (new.id, 1);
  return new;
end;
$$;

insert into public.loyalty_cards (customer_id, card_number)
select profiles.id, 1
from public.profiles
where not exists (
  select 1
  from public.loyalty_cards
  where loyalty_cards.customer_id = profiles.id
);

create trigger create_initial_loyalty_card_for_profile
  after insert on public.profiles
  for each row execute procedure public.create_initial_loyalty_card();

alter table public.loyalty_cards enable row level security;
alter table public.stamp_transactions enable row level security;

revoke all on table public.loyalty_cards, public.stamp_transactions from anon, authenticated;
grant select on public.loyalty_cards, public.stamp_transactions to authenticated;

create policy "Customers can read their own loyalty cards"
  on public.loyalty_cards for select
  to authenticated
  using ((select auth.uid()) = customer_id);

create policy "Admins and owners can read all loyalty cards"
  on public.loyalty_cards for select
  to authenticated
  using (public.has_role(array['admin', 'owner']::public.app_role[]));

create policy "Customers can read their own stamp history"
  on public.stamp_transactions for select
  to authenticated
  using (
    exists (
      select 1
      from public.loyalty_cards
      where loyalty_cards.id = stamp_transactions.card_id
        and loyalty_cards.customer_id = (select auth.uid())
    )
  );

create policy "Admins and owners can read all stamp history"
  on public.stamp_transactions for select
  to authenticated
  using (public.has_role(array['admin', 'owner']::public.app_role[]));
