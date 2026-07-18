# VMK Tennis Academy (VMKTA)

Public marketing site + admin CRM for VMK Tennis Academy.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- **Supabase PostgreSQL** via Prisma (`DATABASE_URL`)
- `@supabase/supabase-js` helpers (API / Storage later)
- Auth.js (NextAuth v5) — credentials + roles (wired in milestone 4)

## Getting started (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Copy into `.env` (see `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → **Settings → API**
   - `DATABASE_URL` → **Connect → Connection string → URI** (must start with `postgresql://`)
3. Then:

```bash
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/admin/login  
- Seeded admin: `admin@vmkta.com` / `ADMIN_PASSWORD`

## Deploy on Vercel

Set these env vars (Production + Preview):

| Variable | From |
|----------|------|
| `DATABASE_URL` | Supabase → Connect → URI (pooler :6543) |
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Settings → API |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | your Vercel URL |

Build runs `prisma migrate deploy`. Seed once:

```bash
DATABASE_URL="postgresql://..." npm run db:seed
```


## Brand tokens

| Token | Value |
|-------|-------|
| Deep green | `#0B3D2E` (`--vmk-green` / `primary`) |
| Lime accent | `#C6F432` (`--vmk-lime` / `accent`) |
| Off-white | `#FAFAF7` (`--vmk-cream` / `background`) |

## Milestones

1. ✅ Scaffold + theme + Prisma schema/seed + shadcn
2. ✅ Public homepage (DB-backed sections, SEO, program pages)
3. ✅ Lead-capture forms (Zod, honeypot, rate limit, email notify)
4. Auth + admin shell
5. Leads module
6. Students / batches / attendance
7. Payments
8. CMS content
9. Reports + polish

### Hero media

Drop files into:
- `public/videos/hero.mp4` — autoplays when available (skipped on slow connections / reduced motion)
- Or set `hero.posterUrl` / `hero.videoUrl` via site settings

### Lead forms

- Trial → `Lead` with `source = TRIAL_BOOKING`
- Enquiry → `Lead` with `source = ENQUIRY`
- Admin notified via `sendEmail()` (console in dev; Resend when `EMAIL_PROVIDER=resend`)
- Rate limit: 5 submissions / 15 min / IP
- Honeypot field `website` silently succeeds for bots
