-- Apply after 001_authentication.sql and 002_switch_auth_to_email.sql.

create type public.account_status as enum ('active', 'suspended');

alter table public.profiles
  add column status public.account_status not null default 'active';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Bootstrap the first owner manually after this migration.
-- Replace the placeholder and run once in the Supabase SQL Editor:
-- update public.profiles set role = 'owner' where email = 'owner@example.com';
