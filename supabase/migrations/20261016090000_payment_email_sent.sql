-- When the automatic email for a payment went out (birthday thank-you), so it's never sent twice
alter table public.payments add column if not exists email_sent_at timestamptz;
