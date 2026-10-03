-- Normalized phone (digits, Israeli local form 05XXXXXXXX) so the webhook can match payers in the DB
-- instead of loading every donor (PostgREST caps responses at 1000 rows).
create or replace function public.norm_phone(p text) returns text language sql immutable as $$
  select nullif(regexp_replace(regexp_replace(coalesce(p, ''), '\D', '', 'g'), '^(00)?972', '0'), '')
$$;
alter table public.donors add column if not exists phone_norm text generated always as (public.norm_phone(phone)) stored;
create index if not exists donors_phone_norm_idx on public.donors (phone_norm);
