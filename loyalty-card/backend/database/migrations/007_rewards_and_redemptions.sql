-- Apply after 006_qr_scan_tokens.sql.

create table public.reward_definitions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  description text check (char_length(description) <= 500),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index one_active_reward_definition
  on public.reward_definitions ((is_active))
  where is_active;

create table public.reward_entitlements (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null unique references public.loyalty_cards (id) on delete restrict,
  reward_definition_id uuid references public.reward_definitions (id) on delete set null,
  reward_name text not null,
  reward_description text,
  created_at timestamptz not null default now()
);

create table public.reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  entitlement_id uuid not null unique references public.reward_entitlements (id) on delete restrict,
  redeemed_by uuid not null references public.profiles (id) on delete restrict,
  redeemed_at timestamptz not null default now()
);

create index reward_entitlements_card_history
  on public.reward_entitlements (card_id);

create trigger set_reward_definitions_updated_at
  before update on public.reward_definitions
  for each row execute procedure public.set_updated_at();

insert into public.reward_definitions (name, description)
values (
  'Completed Card Reward',
  'Set the specific reward before launch.'
);

create or replace function public.create_reward_entitlement_for_completed_card()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_reward public.reward_definitions%rowtype;
begin
  if old.status <> 'completed' and new.status = 'completed' then
    select *
    into v_reward
    from public.reward_definitions
    where is_active
    limit 1;

    if found then
      insert into public.reward_entitlements (
        card_id,
        reward_definition_id,
        reward_name,
        reward_description
      )
      values (
        new.id,
        v_reward.id,
        v_reward.name,
        v_reward.description
      );
    end if;
  end if;

  return new;
end;
$$;

create trigger create_reward_entitlement_for_completed_card
  after update of status on public.loyalty_cards
  for each row execute procedure public.create_reward_entitlement_for_completed_card();

insert into public.reward_entitlements (
  card_id,
  reward_definition_id,
  reward_name,
  reward_description
)
select
  loyalty_cards.id,
  reward_definitions.id,
  reward_definitions.name,
  reward_definitions.description
from public.loyalty_cards
cross join public.reward_definitions
where loyalty_cards.status = 'completed'
  and reward_definitions.is_active
  and not exists (
    select 1
    from public.reward_entitlements
    where reward_entitlements.card_id = loyalty_cards.id
  );

alter table public.reward_definitions enable row level security;
alter table public.reward_entitlements enable row level security;
alter table public.reward_redemptions enable row level security;

revoke all on table public.reward_definitions, public.reward_entitlements, public.reward_redemptions from anon, authenticated;
grant select on public.reward_entitlements, public.reward_redemptions to authenticated;
grant select on public.reward_definitions to authenticated;

create policy "Admins and owners can read reward definitions"
  on public.reward_definitions for select
  to authenticated
  using (public.has_role(array['admin', 'owner']::public.app_role[]));

create policy "Customers can read their own reward entitlements"
  on public.reward_entitlements for select
  to authenticated
  using (
    exists (
      select 1
      from public.loyalty_cards
      where loyalty_cards.id = reward_entitlements.card_id
        and loyalty_cards.customer_id = (select auth.uid())
    )
  );

create policy "Admins and owners can read reward entitlements"
  on public.reward_entitlements for select
  to authenticated
  using (public.has_role(array['admin', 'owner']::public.app_role[]));

create policy "Customers can read their own redemptions"
  on public.reward_redemptions for select
  to authenticated
  using (
    exists (
      select 1
      from public.reward_entitlements
      join public.loyalty_cards on loyalty_cards.id = reward_entitlements.card_id
      where reward_entitlements.id = reward_redemptions.entitlement_id
        and loyalty_cards.customer_id = (select auth.uid())
    )
  );

create policy "Admins and owners can read redemptions"
  on public.reward_redemptions for select
  to authenticated
  using (public.has_role(array['admin', 'owner']::public.app_role[]));

create or replace function public.set_active_reward_definition(
  p_actor_id uuid,
  p_name text,
  p_description text default null
)
returns public.reward_definitions
language plpgsql
security definer set search_path = public
as $$
declare
  v_actor_role public.app_role;
  v_actor_status public.account_status;
  v_reward public.reward_definitions%rowtype;
begin
  select role, status
  into v_actor_role, v_actor_status
  from public.profiles
  where id = p_actor_id;

  if not found or v_actor_status <> 'active' or v_actor_role <> 'owner' then
    raise exception 'Only an active owner can configure rewards.';
  end if;

  if char_length(trim(p_name)) = 0 or char_length(trim(p_name)) > 120 then
    raise exception 'Reward name must contain 1 to 120 characters.';
  end if;

  if p_description is not null and char_length(p_description) > 500 then
    raise exception 'Reward description must be 500 characters or fewer.';
  end if;

  update public.reward_definitions set is_active = false where is_active;

  insert into public.reward_definitions (name, description, is_active)
  values (trim(p_name), nullif(trim(coalesce(p_description, '')), ''), true)
  returning * into v_reward;

  return v_reward;
end;
$$;

create or replace function public.redeem_oldest_reward(
  p_customer_id uuid,
  p_actor_id uuid
)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  v_actor_role public.app_role;
  v_actor_status public.account_status;
  v_entitlement public.reward_entitlements%rowtype;
  v_card_number integer;
begin
  select role, status
  into v_actor_role, v_actor_status
  from public.profiles
  where id = p_actor_id;

  if not found or v_actor_status <> 'active'
    or v_actor_role not in ('cashier', 'admin', 'owner') then
    raise exception 'Only active staff accounts can redeem rewards.';
  end if;

  select reward_entitlements.*
  into v_entitlement
  from public.reward_entitlements
  join public.loyalty_cards on loyalty_cards.id = reward_entitlements.card_id
  where loyalty_cards.customer_id = p_customer_id
    and not exists (
      select 1
      from public.reward_redemptions
      where reward_redemptions.entitlement_id = reward_entitlements.id
    )
  order by loyalty_cards.completed_at asc
  limit 1
  for update of reward_entitlements;

  if not found then
    raise exception 'Customer has no available completed-card reward.';
  end if;

  select card_number
  into v_card_number
  from public.loyalty_cards
  where id = v_entitlement.card_id;

  insert into public.reward_redemptions (entitlement_id, redeemed_by)
  values (v_entitlement.id, p_actor_id);

  return jsonb_build_object(
    'entitlementId', v_entitlement.id,
    'cardId', v_entitlement.card_id,
    'cardNumber', v_card_number,
    'rewardName', v_entitlement.reward_name,
    'rewardDescription', v_entitlement.reward_description,
    'redeemed', true
  );
end;
$$;

create or replace function public.consume_qr_token_and_redeem_reward(
  p_token_id uuid,
  p_actor_id uuid
)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  v_token public.qr_scan_tokens%rowtype;
begin
  select *
  into v_token
  from public.qr_scan_tokens
  where id = p_token_id
  for update;

  if not found or v_token.expires_at <= now() or v_token.consumed_at is not null then
    raise exception 'QR code is invalid, expired, or has already been used.';
  end if;

  update public.qr_scan_tokens set consumed_at = now() where id = v_token.id;

  return public.redeem_oldest_reward(v_token.customer_id, p_actor_id);
end;
$$;

revoke all on function public.set_active_reward_definition(uuid, text, text) from public;
revoke all on function public.redeem_oldest_reward(uuid, uuid) from public;
revoke all on function public.consume_qr_token_and_redeem_reward(uuid, uuid) from public;
grant execute on function public.set_active_reward_definition(uuid, text, text) to service_role;
grant execute on function public.redeem_oldest_reward(uuid, uuid) to service_role;
grant execute on function public.consume_qr_token_and_redeem_reward(uuid, uuid) to service_role;
