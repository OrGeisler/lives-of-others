-- חיים של אחרים — סכמה ראשונית (B0)
-- עקרון: RLS על הכל. הציבור קורא רק תוכן פעיל; צוות (staff) מנהל הכל; ה-webhook כותב עם service role.

-- ---------- helpers ----------
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create table public.staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'editor' check (role in ('admin','editor')),
  created_at timestamptz not null default now()
);
alter table public.staff enable row level security;

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid());
$$;

-- ---------- content (public read) ----------
create table public.dogs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  age_text text,
  tagline text,
  story text,                       -- פסקאות מופרדות בשורה ריקה
  main_image text,
  gallery text[] not null default '{}',
  available_for_adoption boolean not null default true,
  available_for_virtual boolean not null default true,
  available_for_gift boolean not null default false,
  grow_virtual_link text,
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger dogs_updated before update on public.dogs for each row execute function public.set_updated_at();

create table public.birthday_schedule (
  month int primary key check (month between 1 and 12),
  dog_id uuid references public.dogs(id) on delete set null,
  text text
);

create table public.fallen (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  card_title text not null,
  modal_title text,
  eyebrow text,
  card_text text,
  story_html text,
  portrait text,
  hero_image text,
  grow_link text,
  active boolean not null default true,
  sort int not null default 0
);

create table public.team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo text,
  active boolean not null default true,
  sort int not null default 0
);

create table public.site_settings (
  key text primary key,
  value jsonb not null
);

-- ---------- operations (staff only) ----------
create table public.donors (
  id uuid primary key default gen_random_uuid(),
  honor_name text,                  -- "לכבוד" — השם לקבלה
  phone text,
  email text,
  source text check (source in ('friends','facebook','instagram','volunteering','news','other')),
  consent_terms_at timestamptz,
  consent_marketing boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);
create index on public.donors (phone);
create index on public.donors (email);

create table public.sponsorships (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references public.donors(id) on delete cascade,
  dog_id uuid references public.dogs(id) on delete set null,
  tier int check (tier in (25,50,100)),
  status text not null default 'pending' check (status in ('pending','active','canceled','failed')),
  grow_recurring_id text,
  started_at timestamptz,
  canceled_at timestamptz,
  last_payment_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.gifts (
  id uuid primary key default gen_random_uuid(),
  buyer_donor_id uuid references public.donors(id) on delete set null,
  dog_id uuid references public.dogs(id) on delete set null,
  recipient_name text,
  recipient_phone text,
  recipient_email text,
  greeting text,
  send_at timestamptz,
  sent_at timestamptz,
  status text not null default 'pending' check (status in ('pending','paid','sent','canceled')),
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('virtual','gift','birthday','donation','memorial','items')),
  donor_id uuid references public.donors(id) on delete set null,
  dog_id uuid references public.dogs(id) on delete set null,
  sponsorship_id uuid references public.sponsorships(id) on delete set null,
  gift_id uuid references public.gifts(id) on delete set null,
  sum numeric(10,2),
  status text,
  grow_transaction_id text unique,
  asmachta text,
  receipt_url text,
  raw jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.updates_log (
  id uuid primary key default gen_random_uuid(),
  sponsorship_id uuid references public.sponsorships(id) on delete cascade,
  gift_id uuid references public.gifts(id) on delete cascade,
  period date not null,             -- היום הראשון בחודש של העדכון
  channel text check (channel in ('whatsapp','email','other')),
  sent_by uuid references auth.users(id),
  sent_at timestamptz not null default now(),
  note text
);

-- ---------- RLS ----------
alter table public.dogs enable row level security;
alter table public.birthday_schedule enable row level security;
alter table public.fallen enable row level security;
alter table public.team enable row level security;
alter table public.site_settings enable row level security;
alter table public.donors enable row level security;
alter table public.sponsorships enable row level security;
alter table public.gifts enable row level security;
alter table public.payments enable row level security;
alter table public.updates_log enable row level security;

-- public read of active content
create policy "public read dogs" on public.dogs for select using (active or public.is_staff());
create policy "public read bday" on public.birthday_schedule for select using (true);
create policy "public read fallen" on public.fallen for select using (active or public.is_staff());
create policy "public read team" on public.team for select using (active or public.is_staff());
create policy "public read settings" on public.site_settings for select using (true);

-- staff manage everything
do $$
declare t text;
begin
  foreach t in array array['dogs','birthday_schedule','fallen','team','site_settings','donors','sponsorships','gifts','payments','updates_log'] loop
    execute format('create policy "staff all %1$s" on public.%1$I for all to authenticated using (public.is_staff()) with check (public.is_staff())', t);
  end loop;
end $$;
create policy "staff read staff" on public.staff for select to authenticated using (public.is_staff());

-- explicit grants (auto-expose is off)
grant usage on schema public to anon, authenticated;
grant select on public.dogs, public.birthday_schedule, public.fallen, public.team, public.site_settings to anon, authenticated;
grant insert, update, delete on public.dogs, public.birthday_schedule, public.fallen, public.team, public.site_settings to authenticated;
grant select, insert, update, delete on public.donors, public.sponsorships, public.gifts, public.payments, public.updates_log to authenticated;
grant select on public.staff to authenticated;
grant execute on function public.is_staff() to anon, authenticated;

-- ---------- storage: public media bucket, staff upload ----------
insert into storage.buckets (id, name, public) values ('media','media', true) on conflict (id) do nothing;
create policy "public read media" on storage.objects for select using (bucket_id = 'media');
create policy "staff write media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_staff());
create policy "staff update media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_staff());
create policy "staff delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_staff());
