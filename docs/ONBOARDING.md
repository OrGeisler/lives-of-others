# Onboarding: how this project runs (for a new developer and their Claude)

Read `CLAUDE.md` first (rules, stack, payments flow). This file covers setup, deploys and secrets.
Secret VALUES are never in this repo. This file only says what exists, where it lives and who holds it.

## 1. First-time setup (5 minutes)
```bash
git clone git@github.com:OrGeisler/lives-of-others.git && cd lives-of-others   # default branch: main
cp .env.example .env.local        # public keys only: enough to run the site + admin UI
npm install && npm run dev        # http://localhost:5173
```
- `.env.example` holds only `VITE_*` values. They are public by design (shipped in the browser bundle).
- Local dev talks to the PRODUCTION Supabase project (there is no staging DB). Reading is harmless;
  anything you submit in forms/admin writes real rows. Use `?test=1` for payment tests and clean up after.
- Supabase CLI (only if you'll touch DB/functions): accept the Supabase org invite, then
  `supabase login` (your own token) and `supabase link --project-ref faycqdiwkafubfmnoazw`.
  `supabase db push` also needs the DB password: ask Or (never commit it).

## 2. How changes reach production
| What changed | How it deploys | Who / go needed |
| --- | --- | --- |
| `src/`, `public/`, `api/`, `vercel.json` | PR → merge to `main` → Vercel builds and deploys production automatically. Every PR gets a Vercel preview URL. | Each developer's Claude merges its own PRs (no approval needed). Never push to `main` directly. |
| `supabase/migrations/*` | `supabase db push` (applies to production immediately) | Or's go first |
| `supabase/functions/*` | `supabase functions deploy <name> --no-verify-jwt --use-api --project-ref faycqdiwkafubfmnoazw` | Or's go first |
| Vercel / Supabase secrets | Vercel dashboard (Or only, Hobby plan has no team seats) / `supabase secrets set` | Or |

Before a PR: `npm run build` must pass. For DB changes also run `node scripts/test-rls.mjs`.

## 3. Secrets map (names only)
**Vercel env vars** (project `lives-of-others-app`; only Or can view/edit):
| Name | Used by | What |
| --- | --- | --- |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | browser | public Supabase client (also in `.env.example`) |
| `SUPABASE_URL`, `SUPABASE_SECRET_KEY` | `api/*` | server-side DB access (bypasses RLS) |
| `INTERNAL_SECRET` | `api/send-certificate` | server-to-server auth (`x-internal-secret`) |
| `RESEND_API_KEY`, `MAIL_FROM` | `api/send-certificate` | send-only email key; sender `certificates@lives-of-others.com` |
| `SITE_URL` | `api/*` | `https://lives-of-others.com` (PDF rendering + links) |

**Supabase edge-function secrets** (`supabase secrets list`):
| Name | What |
| --- | --- |
| `GROW_WEBHOOK_SECRET` | the `?key=` that authenticates Grow's webhook calls |
| `GROW_SANDBOX` | flag for future Grow API calls (unused until API creds exist) |
| `INTERNAL_SECRET` | same value as in Vercel |
| `SUPABASE_*` | injected automatically by Supabase |

**Held by Or only** (his local file, never shared or committed): Supabase access token + DB password,
Vercel token, GitHub token, Resend API key, Grow webhook URL. If you need one of these actions, ask Or
or get your own access (Supabase/Resend have team invites).

## 4. Accounts and who owns them
| Service | Owner | Notes |
| --- | --- | --- |
| GitHub `OrGeisler/lives-of-others` | Or | `main` = this app, `static-site` = old static site (archive, never merge) |
| Vercel `lives-of-others-app` | Or (Hobby) | connected to GitHub, production branch `main` |
| Supabase org/project | Or (+ invited devs) | eu-central-1 |
| Resend (email) | Or | domain `lives-of-others.com` verified |
| Grow (payments) | the nonprofit | 4 payment pages (virtual 25/50/100 monthly, gift 180, birthday, test 1/2/3) + 2 webhooks → `grow-webhook`. Page links are editable in admin → תוכן האתר → קישורי תשלום |
| Domain DNS | Or | A → Vercel, `www` CNAME → Vercel, Resend records (`resend._domainkey`, `send`, `rsend`, `_dmarc`) |

## 5. Admin
`/admin`, Hebrew UI for the nonprofit's staff. Login is currently a temporary shared password held by Or
(issue #1: replace with per-person logins). In-app guide: admin → מדריך.

## 6. Where things are tracked
- Open work: GitHub Issues. History: `docs/WORKLOG.md` (one line per task, newest first).
- Rules/gotchas: `CLAUDE.md`. Update these as part of the same PR as your change.
