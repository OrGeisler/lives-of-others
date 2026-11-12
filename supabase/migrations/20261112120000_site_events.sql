-- Site analytics (12.11): our own anonymous visit counter, shown in admin → סטטיסטיקה.
-- No cookies and no IP: a random id per browser tab session (sessionStorage), the page path, where the visit came from,
-- phone/desktop and language. Written by src/lib/track.ts; staff read the totals through site_stats().
create table public.site_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('view', 'wa', 'pay')),   -- page view · WhatsApp click · payment-page click
  path text not null check (length(path) <= 200),
  visit text not null check (length(visit) <= 40),
  source text check (length(source) <= 60),                   -- the visit's landing source (facebook, google, direct…)
  device text check (device in ('phone', 'tablet', 'desktop')),
  lang text check (lang in ('he', 'en'))
);
create index site_events_created_at on public.site_events (created_at);
alter table public.site_events enable row level security;
create policy "public can log" on public.site_events for insert to anon, authenticated with check (created_at > now() - interval '1 minute');
create policy "staff read" on public.site_events for select to authenticated using (public.is_staff());
grant insert (kind, path, visit, source, device, lang) on public.site_events to anon, authenticated;
grant select on public.site_events to authenticated;
grant all on public.site_events to service_role;

-- One JSON with everything the admin page shows, for the last p_days days (Israel dates).
create or replace function public.site_stats(p_days int default 30) returns json
language plpgsql stable security definer set search_path = public as $$
declare
  since timestamptz := date_trunc('day', now() at time zone 'Asia/Jerusalem') at time zone 'Asia/Jerusalem' - make_interval(days => greatest(p_days, 1) - 1);
  prev timestamptz := since - make_interval(days => greatest(p_days, 1));
  today timestamptz := date_trunc('day', now() at time zone 'Asia/Jerusalem') at time zone 'Asia/Jerusalem';
  r json;
begin
  if not public.is_staff() then raise exception 'staff only'; end if;
  with e as (select * from site_events where created_at >= since),
  v as (select visit, min(source) source, min(device) device, min(lang) lang, count(*) filter (where kind = 'view') views
        from e group by visit),
  -- '/en/dogs/rex' and '/dogs/rex' are the same page
  p as (select regexp_replace(path, '^/en(?=/|$)', '') as page, kind from e),
  pg as (select case when page = '' then '/' else page end page, kind from p)
  select json_build_object(
    'days', p_days,
    'visits', (select count(*) from v),
    'views', (select coalesce(sum(views), 0) from v),
    'wa', (select count(*) from e where kind = 'wa'),
    'pay', (select count(*) from e where kind = 'pay'),
    'today', (select count(distinct visit) from site_events where created_at >= today),
    'prev_visits', (select count(distinct visit) from site_events where created_at >= prev and created_at < since),
    'one_page', (select count(*) from v where views <= 1),
    'inquiries', (select count(*) from contact_messages where created_at >= since and coalesce(topic, '') not like '%בדיק%'),
    'site_payments', (select count(*) from payments where coalesce(paid_at, created_at) >= since
                      and kind in ('virtual', 'gift', 'birthday', 'site_donation', 'memorial', 'items')),
    'site_sum', (select coalesce(sum(sum), 0) from payments where coalesce(paid_at, created_at) >= since
                 and kind in ('virtual', 'gift', 'birthday', 'site_donation', 'memorial', 'items')),
    'daily', (select coalesce(json_agg(d order by d.day), '[]') from (
        select (created_at at time zone 'Asia/Jerusalem')::date as day, count(distinct visit) visits, count(*) filter (where kind = 'view') views
        from e group by 1) d),
    'hours', (select coalesce(json_agg(h order by h.hour), '[]') from (
        select extract(hour from created_at at time zone 'Asia/Jerusalem')::int as hour, count(distinct visit) visits
        from e group by 1) h),
    'weekdays', (select coalesce(json_agg(w order by w.dow), '[]') from (
        select extract(dow from created_at at time zone 'Asia/Jerusalem')::int as dow, count(distinct visit) visits
        from e group by 1) w),
    'pages', (select coalesce(json_agg(x), '[]') from (
        select page, count(*) views from pg where kind = 'view' group by 1 order by 2 desc limit 12) x),
    'dogs', (select coalesce(json_agg(x), '[]') from (
        select d.name, d.slug, count(*) views
        from pg join dogs d on d.slug = substring(pg.page from '^/(?:dogs|virtual-adoption)/([^/?#]+)')
        where pg.kind = 'view' group by d.name, d.slug order by 3 desc limit 10) x),
    'wa_pages', (select coalesce(json_agg(x), '[]') from (
        select page, count(*) clicks from pg where kind = 'wa' group by 1 order by 2 desc limit 8) x),
    'sources', (select coalesce(json_agg(x), '[]') from (
        select coalesce(source, 'direct') source, count(*) visits from v group by 1 order by 2 desc limit 12) x),
    'devices', (select coalesce(json_agg(x), '[]') from (
        select coalesce(device, 'desktop') device, count(*) visits from v group by 1 order by 2 desc) x),
    'langs', (select coalesce(json_agg(x), '[]') from (
        select coalesce(lang, 'he') lang, count(*) visits from v group by 1 order by 2 desc) x)
  ) into r;
  return r;
end $$;
revoke all on function public.site_stats(int) from public, anon;
grant execute on function public.site_stats(int) to authenticated;
