# Work log (newest first, one line per task: date · who · what)

- 2026-10-13 · Or+Claude · AI search (GEO): public/llms.txt, richer NGO JSON-LD (ע"ר, founders, 2016, Ramat Efal, phone), FAQ (FAQPage JSON-LD + static text) on / and /about, English facts on /en. Facts only from site copy.
- 2026-10-13 · Or+Claude · Google Search Console: URL-prefix property https://lives-of-others.com/ (Or's Google account, separate from bula.co.il), verified by public/google90aab82532d797ee.html (keep it). Sitemap submitted; indexing requested for / and /virtual-adoption. Google had picked www as canonical (duplicate) before the www→apex redirect.
- 2026-10-13 · Or+Claude · White screen on older phones (iOS < 16.4): build now targets Safari 13/Chrome 80 + polyfills (@vitejs/plugin-legacy).
- 2026-10-13 · Or+Claude · SEO: robots.txt, sitemap.xml, per-route static title/description/canonical/og + text (prerender), NGO JSON-LD, www→apex 308, IndexNow key.
- 2026-10-09 · Or+Claude · Lev onboarding verified: fresh clone of main builds, Lev has write; his PR #16 merged.
- 2026-10-09 · Lev+Claude · .gitignore: also ignore `*.env` files.
- 2026-10-09 · Or+Claude · Rule: each dev's Claude (Or, Lev) merges its own PRs (no go needed); since extended to migrations/functions: agreed in chat → ship.
- 2026-10-09 · Or+Claude · docs/ONBOARDING.md: setup, deploy matrix, secrets map (names only), accounts.
- 2026-10-09 · Or+Claude · Vercel connected to GitHub (production = `main`); deploy flow is now PR → merge.
- 2026-10-09 · Or+Claude · Repo split clean: `main` = app, `static-site` = old site (GitHub Pages disabled). Lev has write access. Open items moved to Issues #1–#10.
- 2026-10-09 · Or+Claude · Added CLAUDE.md, this log, .env.example for a second developer.
- 2026-10-07 · Or+Claude · Hero "only nonprofit…" line restyled (not a button).
- 2026-10-05 · Or+Claude · Donate page rebuilt; before/after + stories on home; contact form saved to DB (admin "פניות") → Beri; privacy policy production version; column footer; closable WhatsApp button; phone menu ✕/backdrop.
- 2026-10-04 · Or+Claude · Cutover: lives-of-others.com → Vercel. Grow webhooks live (all tx + recurring). Gift/birthday/test Grow pages. Certificates (PDF + Resend email, manual send from admin). Test mode ?test=1.
- 2026-10-03 · Or+Claude · New React+Supabase app replaces static site; admin; checkout; RLS tests.
