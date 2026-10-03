-- Admin support: staff invites by email, role helpers, staff management by admins

create table public.staff_invites (
  email text primary key,
  role text not null default 'editor' check (role in ('admin','editor')),
  name text,
  created_at timestamptz not null default now()
);
alter table public.staff_invites enable row level security;

alter table public.staff add column if not exists name text;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid() and role = 'admin');
$$;
grant execute on function public.is_admin() to authenticated;

-- Called by the admin app right after login: if the user's email was invited, make them staff.
create or replace function public.claim_staff() returns text
language plpgsql security definer set search_path = public as $$
declare inv public.staff_invites; em text := lower(auth.jwt() ->> 'email');
begin
  if auth.uid() is null then return null; end if;
  if exists (select 1 from public.staff where user_id = auth.uid()) then
    return (select role from public.staff where user_id = auth.uid());
  end if;
  select * into inv from public.staff_invites where lower(email) = em;
  if not found then return null; end if;
  insert into public.staff (user_id, email, role, name) values (auth.uid(), em, inv.role, inv.name);
  return inv.role;
end $$;
grant execute on function public.claim_staff() to authenticated;

-- admins manage invites and staff
create policy "admins manage invites" on public.staff_invites for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage staff" on public.staff for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select, insert, update, delete on public.staff_invites to authenticated;
grant insert, update, delete on public.staff to authenticated;

-- payments arriving from Grow that still need to be matched to a donor/dog by a human
alter table public.payments add column if not exists needs_review boolean not null default false;
alter table public.payments add column if not exists payer_name text;
alter table public.payments add column if not exists payer_phone text;
alter table public.payments add column if not exists payer_email text;
alter table public.payments add column if not exists source_link text;

-- bootstrap: the site builder is the first admin
insert into public.staff_invites (email, role, name) values ('orgeisler@bula.co.il', 'admin', 'אור') on conflict do nothing;
