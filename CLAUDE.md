# lives-of-others — site + admin for עמותת חיים של אחרים

Live: https://lives-of-others.com · Admin: /admin · Two developers (Or, Lev), each with Claude Code.

## Keep this file and the log current (both of you, and your Claude)
- After every task: add ONE line to `docs/WORKLOG.md` (newest first: date · who · what).
- Learned something that changes HOW to work here (a gotcha, a rule, a decision)? Add it to
  "Rules & gotchas" below. Keep this file under ~120 lines: replace stale lines, don't append history.
- Open work lives in GitHub Issues, not in files. Commit these doc updates with the change.

## Stack
- Vite + React 19 + TS + react-router 7. Styles: `src/styles/style.css` (original design) + per-area CSS.
  Hebrew, RTL. No Tailwind.
- Supabase (project `faycqdiwkafubfmnoazw`, eu-central-1): Postgres + RLS, Auth, Storage bucket `media`,
  edge functions `checkout`, `grow-webhook` (`supabase/functions`).
- Vercel: SPA + serverless `api/` (certificate PDF via puppeteer-core + @sparticuz/chromium; email via Resend).
- Payments: Grow payment links (no API yet). Receipts: Grow/Morning.

## Layout
- `src/pages` public pages · `src/pages/site` split pages (/dogs /about /homes /volunteer /donate /contact)
- `src/components/home` home sections · `src/admin` staff admin (/admin)
- `src/lib` data hooks, `links.ts` (fixed URLs), `constants.ts` (tiers 25/50/100, gift 180, sources)
- `supabase/migrations` schema (never edit an applied migration; add a new one)
- `scripts/test-rls.mjs` permission tests (runs in a rolled-back transaction)

## Commands
- `npm run dev` (needs `.env.local`, copy `.env.example`) · `npm run build` must pass before commit
- Migrations: `supabase db push` · Functions: `supabase functions deploy <name> --no-verify-jwt --use-api`
- RLS tests: `node scripts/test-rls.mjs` (needs `SUPABASE_DB_PASSWORD` in env)

## Branches & deploy
- `main` = this app (production). `static-site` = the OLD static site, archive only: never merge the two.
- Vercel is connected to this repo: **every push to `main` deploys production**. Never push to `main`
  directly. Work on a branch → PR (Vercel posts a preview URL on it) → Or merges = his go to deploy.
- DB migrations (`supabase db push`) and edge-function deploys hit production immediately: get Or's go first.

## Payments flow (how money is matched)
1. Our form (`/checkout`, `checkout` fn) saves donor + sponsorship/gift as `pending`, then redirects to Grow.
2. Grow webhook → `grow-webhook` (auth: `?key=` secret). Real payload has NO statusCode/pageCode:
   use `paymentSum`, `payerPhone`, `paymentDesc` (= Grow page TITLE), `transactionCode`, `invoiceName`.
3. Match by normalized phone (`donors.phone_norm`) + sum → `active`/`paid`. Unmatched → admin "צריך שיוך".
4. Page identified by title: "המלאך השומר…"=virtual, "אימוץ במתנה"=gift, "יום הולדת"=birthday,
   "בדיקות מערכת"=test (1/2/3 ₪). Renaming a Grow page title breaks this: update `ITEM_KIND`.
5. Test mode: add `?test=1` to any site URL → forms go to the Grow test page.
- Grow custom fields (e.g. dog name) are NOT in the webhook payload.

## Rules & gotchas
- Secrets never in git or chat. Each dev gets their own Supabase/Resend access; `VITE_*` keys are public.
- "Automatically expose new tables" is OFF: every new table needs explicit GRANTs (incl. service_role) + RLS.
  After a migration that adds a table, PostgREST may need `notify pgrst, 'reload schema'`.
- `style.css` loads after page CSS: overrides often need a more specific selector.
- Dog photos: crop keeps the face (`dogs.image_focus`, set in admin "איפה הפנים"); default 50% 18%.
- Admin login is a TEMPORARY shared password (see Issues): replace with per-person logins before real donor data.
- Never use emoji in the certificate (server Chromium has no emoji font): use SVG.
- Facts/numbers on the site come from the nonprofit or the DB; don't invent copy figures.
