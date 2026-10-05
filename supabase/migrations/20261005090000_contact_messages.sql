-- Contact form submissions (public can only INSERT; staff read/manage)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  phone text check (phone is null or char_length(phone) <= 20),
  topic text check (topic is null or char_length(topic) <= 80),
  message text check (message is null or char_length(message) <= 2000),
  handled_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
create policy "public can send" on public.contact_messages for insert to anon, authenticated with check (handled_at is null);
create policy "staff manage" on public.contact_messages for all to authenticated using (public.is_staff()) with check (public.is_staff());
grant insert on public.contact_messages to anon;
grant select, insert, update, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
