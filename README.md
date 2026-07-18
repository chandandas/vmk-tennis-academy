# VMK Tennis Academy (VMKTA)

Public marketing site + admin CRM for VMK Tennis Academy.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma 7 + SQLite (local) / PostgreSQL-ready
- Auth.js (NextAuth v5) — credentials + roles (wired in milestone 4)

## Getting started

```bash
cp .env.example .env
# Set DATABASE_URL to a Neon/Postgres connection string (SQLite will not work on Vercel)
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

- Site: http://localhost:3000  
- Admin login stub: http://localhost:3000/admin/login  
- Seeded admin: `admin@vmkta.com` / value of `ADMIN_PASSWORD` in `.env`

## Deploy on Vercel (fix 500 SQLite error)

Vercel cannot use SQLite (`Cannot open database because the directory does not exist`). Use **PostgreSQL**:

1. Create a free DB at [Neon](https://console.neon.tech) (or Vercel Storage → Postgres).
2. Copy the connection string (`postgresql://...?sslmode=require`).
3. In **Vercel → Project → Settings → Environment Variables**, set:
   - `DATABASE_URL` = your Postgres URL (Production + Preview)
   - `AUTH_SECRET` = `openssl rand -base64 32`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-app.vercel.app`
   - `ADMIN_PASSWORD` = (optional, for seeding)
4. Redeploy (or push to GitHub). Build runs `prisma migrate deploy`.
5. Seed once (local, pointing at the same `DATABASE_URL`):

```bash
DATABASE_URL="postgresql://..." npm run db:seed
```

After that, `/` should load without 500s.

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
