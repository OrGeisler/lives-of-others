-- Payments from the site's general donation page ("עמוד תרומה כללי- אתר") get their own kind,
-- so the admin Payments page can show everything the site sends people to.
alter table public.payments drop constraint if exists payments_kind_check;
alter table public.payments add constraint payments_kind_check
  check (kind in ('virtual','gift','birthday','donation','site_donation','memorial','items'));

-- backfill from the Grow page title (paymentDesc)
update public.payments set kind = 'memorial' where kind = 'donation' and raw->>'paymentDesc' like 'פרויקט הנצחה%';
update public.payments set kind = 'items' where kind = 'donation' and raw->>'paymentDesc' = 'תרומה כללית - הוראת קבע';
update public.payments set kind = 'site_donation' where kind = 'donation' and raw->>'paymentDesc' like 'עמוד תרומה כללי%אתר%';
