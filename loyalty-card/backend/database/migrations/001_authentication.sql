-- Third Hour loyalty-card authentication and authorization foundation.
-- Run this migration in the Supabase SQL Editor before testing authenticated routes.

create type public.app_role as enum ('customer', 'cashier', 'admin', 'owner');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  phone text not null unique,
  display_name text,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

revoke all on table public.profiles from anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, phone, display_name)
  values (
    new.id,
    new.phone,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.has_role(required_roles public.app_role[])
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = any(required_roles)
  );
$$;

grant usage on schema public to authenticated;
grant select on public.profiles to authenticated;
grant execute on function public.has_role(public.app_role[]) to authenticated;

create policy "Customers can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Admins and owners can read all profiles"
  on public.profiles for select
  to authenticated
  using (public.has_role(array['admin', 'owner']::public.app_role[]));
