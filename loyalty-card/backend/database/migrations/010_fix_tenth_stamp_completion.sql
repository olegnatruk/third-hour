-- Apply after 009_require_idempotency_keys.sql.
-- A card cannot transiently be active at 10 stamps because of its consistency check.

create or replace function public.award_stamp(
  p_customer_id uuid,
  p_actor_id uuid,
  p_idempotency_key uuid
)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  v_actor_role public.app_role;
  v_actor_status public.account_status;
  v_customer_status public.account_status;
  v_card public.loyalty_cards%rowtype;
  v_next_card public.loyalty_cards%rowtype;
  v_existing_card_id uuid;
begin
  select role, status into v_actor_role, v_actor_status
  from public.profiles where id = p_actor_id;

  if not found or v_actor_status <> 'active'
    or v_actor_role not in ('cashier', 'admin', 'owner') then
    raise exception 'Only active staff accounts can award stamps.';
  end if;

  select status into v_customer_status
  from public.profiles where id = p_customer_id for update;

  if not found or v_customer_status <> 'active' then
    raise exception 'Customer account is unavailable.';
  end if;

  select stamp_transactions.card_id into v_existing_card_id
  from public.stamp_transactions
  join public.loyalty_cards on loyalty_cards.id = stamp_transactions.card_id
  where stamp_transactions.idempotency_key = p_idempotency_key
    and loyalty_cards.customer_id = p_customer_id;

  if found then
    select * into v_card from public.loyalty_cards where id = v_existing_card_id;
    select * into v_next_card from public.loyalty_cards
    where customer_id = p_customer_id and status = 'active';

    return jsonb_build_object(
      'idempotent', true,
      'awardedCardId', v_card.id,
      'awardedCardNumber', v_card.card_number,
      'awardedCardStampCount', v_card.stamp_count,
      'cardCompleted', v_card.status = 'completed',
      'nextActiveCardId', v_next_card.id
    );
  end if;

  select * into v_card from public.loyalty_cards
  where customer_id = p_customer_id and status = 'active';

  if not found then
    raise exception 'Customer does not have an active loyalty card.';
  end if;

  if v_card.stamp_count = 9 then
    update public.loyalty_cards
    set stamp_count = 10, status = 'completed', completed_at = now()
    where id = v_card.id
    returning * into v_card;
  else
    update public.loyalty_cards
    set stamp_count = stamp_count + 1
    where id = v_card.id
    returning * into v_card;
  end if;

  insert into public.stamp_transactions (
    card_id, stamp_change, transaction_type, created_by, idempotency_key
  ) values (v_card.id, 1, 'earned', p_actor_id, p_idempotency_key);

  if v_card.status = 'completed' then
    insert into public.loyalty_cards (customer_id, card_number)
    values (p_customer_id, v_card.card_number + 1)
    returning * into v_next_card;

    return jsonb_build_object(
      'idempotent', false,
      'awardedCardId', v_card.id,
      'awardedCardNumber', v_card.card_number,
      'awardedCardStampCount', v_card.stamp_count,
      'cardCompleted', true,
      'nextActiveCardId', v_next_card.id,
      'nextActiveCardNumber', v_next_card.card_number
    );
  end if;

  return jsonb_build_object(
    'idempotent', false,
    'awardedCardId', v_card.id,
    'awardedCardNumber', v_card.card_number,
    'awardedCardStampCount', v_card.stamp_count,
    'cardCompleted', false
  );
end;
$$;

create or replace function public.adjust_active_card_stamp(
  p_customer_id uuid,
  p_actor_id uuid,
  p_stamp_change integer,
  p_reason text,
  p_idempotency_key uuid
)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  v_actor_role public.app_role;
  v_actor_status public.account_status;
  v_customer_status public.account_status;
  v_card public.loyalty_cards%rowtype;
  v_next_card public.loyalty_cards%rowtype;
  v_existing_card_id uuid;
begin
  if p_stamp_change not in (-1, 1) then
    raise exception 'Manual adjustments must change exactly one stamp.';
  end if;
  if nullif(trim(p_reason), '') is null or char_length(p_reason) > 500 then
    raise exception 'A manual adjustment reason of up to 500 characters is required.';
  end if;

  select role, status into v_actor_role, v_actor_status
  from public.profiles where id = p_actor_id;
  if not found or v_actor_status <> 'active' or v_actor_role not in ('admin', 'owner') then
    raise exception 'Only active admins and owners can adjust stamps.';
  end if;

  select status into v_customer_status
  from public.profiles where id = p_customer_id for update;
  if not found or v_customer_status <> 'active' then
    raise exception 'Customer account is unavailable.';
  end if;

  select card_id into v_existing_card_id
  from public.stamp_transactions where idempotency_key = p_idempotency_key;
  if found then
    select * into v_card from public.loyalty_cards where id = v_existing_card_id;
    return jsonb_build_object('idempotent', true, 'cardId', v_card.id, 'cardNumber', v_card.card_number, 'stampCount', v_card.stamp_count);
  end if;

  select * into v_card from public.loyalty_cards
  where customer_id = p_customer_id and status = 'active';
  if not found then
    raise exception 'Customer does not have an active loyalty card.';
  end if;
  if p_stamp_change = -1 and v_card.stamp_count = 0 then
    raise exception 'A zero-stamp card cannot be reduced.';
  end if;

  if p_stamp_change = 1 and v_card.stamp_count = 9 then
    update public.loyalty_cards
    set stamp_count = 10, status = 'completed', completed_at = now()
    where id = v_card.id returning * into v_card;
  else
    update public.loyalty_cards
    set stamp_count = stamp_count + p_stamp_change
    where id = v_card.id returning * into v_card;
  end if;

  insert into public.stamp_transactions (
    card_id, stamp_change, transaction_type, reason, created_by, idempotency_key
  ) values (v_card.id, p_stamp_change, 'manual_adjustment', trim(p_reason), p_actor_id, p_idempotency_key);

  if v_card.status = 'completed' then
    insert into public.loyalty_cards (customer_id, card_number)
    values (p_customer_id, v_card.card_number + 1)
    returning * into v_next_card;
    return jsonb_build_object('idempotent', false, 'cardId', v_card.id, 'cardNumber', v_card.card_number, 'stampCount', v_card.stamp_count, 'cardCompleted', true, 'nextActiveCardId', v_next_card.id);
  end if;

  return jsonb_build_object('idempotent', false, 'cardId', v_card.id, 'cardNumber', v_card.card_number, 'stampCount', v_card.stamp_count, 'cardCompleted', false);
end;
$$;
