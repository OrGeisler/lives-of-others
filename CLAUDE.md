# lives-of-others — site + admin for עמותת חיים של אחרים

Live: https://lives-of-others.com · Admin: /admin · Two developers (Or, Lev), each with Claude Code.
**New here? Read `docs/ONBOARDING.md`** (setup, how each kind of change deploys, secrets map, accounts).

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
  Everything that needs Chromium is ONE function, `api/cert.ts` (handlers in `api/_lib/h-*.ts`; old URLs kept by
  vercel.json rewrites). Never add another Chromium function: each deploy stores ~70MB per one (free 10GB quota).
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
- Phone check (iPhone Safari engine + Android, all pages): `npx -y -p playwright@1 node scripts/mobile-check.mjs`.
  Run it after UI changes. RTL gotcha: never hide things with `left:-9999px` (sideways scroll on iPhone).

## Branches & deploy
- `main` = this app (production). `static-site` = the OLD static site, archive only: never merge the two.
- Vercel is connected to this repo: **every push to `main` deploys production**. Never push to `main`
  directly. Work on a branch → PR (Vercel posts a preview URL on it) → merge once `npm run build` passes.
  Each developer's Claude (Or's and Lev's) merges its own PRs: no approval needed.
- Same for DB migrations (`supabase db push`) and edge-function deploys: once the change was agreed in
  chat, ship it (they hit production immediately, so run `npm run build` / `scripts/test-rls.mjs` first).

## Payments flow (how money is matched)
1. Our form (`/checkout`, `checkout` fn) saves donor + sponsorship/gift as `pending`, then redirects to Grow.
2. Grow webhook → `grow-webhook` (auth: `?key=` secret). Real payload has NO statusCode/pageCode:
   use `paymentSum`, `payerPhone`, `paymentDesc` (= Grow page TITLE), `transactionCode`, `invoiceName`.
3. Match by normalized phone (`donors.phone_norm`) + sum → `active`/`paid`. Unmatched → admin "צריך שיוך".
4. Page identified by title: "המלאך השומר…"=virtual, "אימוץ במתנה"=gift, "יום הולדת"=birthday,
   "בדיקות מערכת"=test (1/2/3 ₪). Renaming a Grow page title breaks this: update `ITEM_KIND`.
5. Test mode: add `?test=1` to any site URL → forms go to the Grow test page.
- Grow custom fields (e.g. dog name) are NOT in the webhook payload.
- Only the site's own pages (virtual/gift/birthday/test) are matched or flagged "צריך שיוך"; any other Grow page
  is never flagged. Site-linked donation pages get kinds by title (`DONATION_PAGES`: site_donation / memorial / items);
  any other page is `donation`. Payments page "מדפי האתר" = all site kinds. paymentDesc = the Grow page "title".

## Rules & gotchas
- Secrets never in git or chat. Each dev gets their own Supabase/Resend access; `VITE_*` keys are public.
- "Automatically expose new tables" is OFF: every new table needs explicit GRANTs (incl. service_role) + RLS.
  After a migration that adds a table, PostgREST may need `notify pgrst, 'reload schema'`.
- `style.css` loads after page CSS: overrides often need a more specific selector.
- Dog photos: crop keeps the face (`dogs.image_focus`, set in admin "איפה הפנים"); default 50% 18%.
- Admin login is a TEMPORARY shared password (see Issues): replace with per-person logins before real donor data.
- Emails are automatic (texts in `api/_lib/notify.ts`): grow-webhook → `/api/send-certificate` (= `api/cert.ts?op=send`) with `auto` after a paid,
  non-test payment; gift recipients by the daily Vercel cron `/api/cron-gift-recipients` (CRON_SECRET). WhatsApp stays manual.
- WhatsApp from admin: `src/admin/WaShare.tsx` (wa.me = text only; files go via the phone's share sheet).
  Marking "sent" there sets the same `*_certificate_sent_at` fields as the email button.
- supabase-js queries are lazy: a fire-and-forget `void supabase.from(...).insert()` never runs. Always `await` or `.then()`.
- Never use emoji in the certificate (server Chromium has no emoji font): use SVG.
- Facts/numbers on the site come from the nonprofit or the DB; don't invent copy figures.
- SEO: each public route gets a static head + text from `scripts/prerender-meta.mjs` (postbuild, also writes
  sitemap.xml). New public route → add it there. The SPA fallback is `spa.html`, not `index.html`.
  Nonprofit facts for search/AI live in that script (ORG, FAQ, EN_HTML) and `public/llms.txt`: change both together.
- Pages are lazy chunks renamed on every deploy: always load pages via `lazyPage` (src/lib/staleChunks.tsx), never bare `lazy`, or open tabs go white after a deploy.
- Old phones: `vite.config.ts` uses `@vitejs/plugin-legacy` (Safari 13 / Chrome 80 + polyfills). Without it Vite 8
  targets 2023+ browsers and older iPhones get a white screen. Check after build: `npx es-check@8 es2020 'dist/assets/*.js' --module`.
- Google Search Console (Or's Google account, property `https://lives-of-others.com/`) is verified by
  `public/google90aab82532d797ee.html`. Never delete it.
