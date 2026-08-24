-- Apply after 005_stamp_awards.sql.

create table public.qr_scan_tokens (
  id uuid primary key,
  customer_id uuid not null references public.profiles (id) on delete cascade,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now(),
  check (expires_at > created_at)
);

create index qr_scan_tokens_customer_expiry
  on public.qr_scan_tokens (customer_id, expires_at desc);

alter table public.qr_scan_tokens enable row level security;
revoke all on table public.qr_scan_tokens from anon, authenticated;

create or replace function public.consume_qr_token_and_award_stamp(
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

  if not found then
    raise exception 'QR code is invalid.';
  end if;

  if v_token.expires_at <= now() then
    raise exception 'QR code has expired.';
  end if;

  if v_token.consumed_at is not null then
    raise exception 'QR code has already been used.';
  end if;

  update public.qr_scan_tokens
  set consumed_at = now()
  where id = v_token.id;

  return public.award_stamp(v_token.customer_id, p_actor_id, v_token.id);
end;
$$;

revoke all on function public.consume_qr_token_and_award_stamp(uuid, uuid) from public;
grant execute on function public.consume_qr_token_and_award_stamp(uuid, uuid) to service_role;
