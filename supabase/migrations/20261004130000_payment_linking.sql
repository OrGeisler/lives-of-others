-- Atomic "match this Grow payment" actions for the admin (staff only).
create or replace function public.link_payment_to_sponsorship(p_payment uuid, p_sponsorship uuid) returns void
language plpgsql security definer set search_path = public as $$
declare sp public.sponsorships; pay public.payments;
begin
  if not public.is_staff() then raise exception 'not allowed' using errcode = '42501'; end if;
  select * into pay from public.payments where id = p_payment for update;
  select * into sp from public.sponsorships where id = p_sponsorship for update;
  if pay.id is null or sp.id is null then raise exception 'not found'; end if;
  update public.payments set kind = 'virtual', donor_id = sp.donor_id, dog_id = sp.dog_id, sponsorship_id = sp.id, needs_review = false where id = pay.id;
  update public.sponsorships set status = 'active', last_payment_at = coalesce(pay.paid_at, now()), started_at = coalesce(sp.started_at, pay.paid_at, now()) where id = sp.id;
end $$;

create or replace function public.link_payment_to_gift(p_payment uuid, p_gift uuid) returns void
language plpgsql security definer set search_path = public as $$
declare g public.gifts; pay public.payments;
begin
  if not public.is_staff() then raise exception 'not allowed' using errcode = '42501'; end if;
  select * into pay from public.payments where id = p_payment for update;
  select * into g from public.gifts where id = p_gift for update;
  if pay.id is null or g.id is null then raise exception 'not found'; end if;
  update public.payments set kind = 'gift', donor_id = g.buyer_donor_id, dog_id = g.dog_id, gift_id = g.id, needs_review = false where id = pay.id;
  update public.gifts set status = case when status = 'pending' then 'paid' else status end where id = g.id;
end $$;

create or replace function public.payment_new_sponsorship(p_payment uuid, p_dog uuid, p_tier int) returns void
language plpgsql security definer set search_path = public as $$
declare pay public.payments; d uuid; s uuid;
begin
  if not public.is_staff() then raise exception 'not allowed' using errcode = '42501'; end if;
  select * into pay from public.payments where id = p_payment for update;
  if pay.id is null then raise exception 'not found'; end if;
  insert into public.donors (honor_name, phone, email) values (pay.payer_name, pay.payer_phone, pay.payer_email) returning id into d;
  insert into public.sponsorships (donor_id, dog_id, tier, status, started_at, last_payment_at)
    values (d, p_dog, p_tier, 'active', coalesce(pay.paid_at, now()), coalesce(pay.paid_at, now())) returning id into s;
  update public.payments set kind = 'virtual', donor_id = d, dog_id = p_dog, sponsorship_id = s, needs_review = false where id = pay.id;
end $$;

revoke execute on function public.link_payment_to_sponsorship(uuid, uuid), public.link_payment_to_gift(uuid, uuid), public.payment_new_sponsorship(uuid, uuid, int) from public, anon;
grant execute on function public.link_payment_to_sponsorship(uuid, uuid), public.link_payment_to_gift(uuid, uuid), public.payment_new_sponsorship(uuid, uuid, int) to authenticated;
