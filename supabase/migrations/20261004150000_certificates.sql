-- Adoption / gift certificates.
alter table public.sponsorships add column if not exists certificate_sent_at timestamptz;
alter table public.gifts add column if not exists certificate_sent_at timestamptz;

-- Public read of ONE certificate by its (unguessable uuid) id: only the display fields, and only once paid.
create or replace function public.get_certificate(p_id uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select jsonb_build_object('type','virtual','id',s.id,'name',d.honor_name,'dog',g.name,'dog_slug',g.slug,
            'image',g.main_image,'focus',g.image_focus,'tier',s.tier,'date',coalesce(s.started_at,s.created_at))
       from sponsorships s join donors d on d.id = s.donor_id left join dogs g on g.id = s.dog_id
      where s.id = p_id and s.status = 'active'),
    (select jsonb_build_object('type','gift','id',x.id,'name',x.recipient_name,'from',d.honor_name,'greeting',x.greeting,
            'dog',g.name,'dog_slug',g.slug,'image',g.main_image,'focus',g.image_focus,'date',coalesce(x.send_at,x.created_at))
       from gifts x left join donors d on d.id = x.buyer_donor_id left join dogs g on g.id = x.dog_id
      where x.id = p_id and x.status in ('paid','sent'))
  )
$$;
revoke execute on function public.get_certificate(uuid) from public;
grant execute on function public.get_certificate(uuid) to anon, authenticated, service_role;
