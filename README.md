# CDAC CCAT Preparation Portfolio

## Overview

This is a React + Vite portfolio app with Supabase auth, user profile tracking, premium payment flow, and admin approval pipeline.

Key features:
- User signup / login with Supabase
- Premium access gating via `users.is_premium` + `users.premium_expires_at`
- `payments` and `results` data management
- RLS (Row Level Security) policies in Supabase
- Vercel serverless API routes for payment submission and admin actions
- Secure admin operation flow through an admin token header (
  `x-admin-token`)

## Getting started

1. Clone repository:

```bash
git clone https://github.com/SiddheshGajare15/portfolio_Siddhesh.git
cd portfolio_Siddhesh
```

2. Install dependencies:

```bash
npm install
cd api
npm install
cd ..
```

3. Create `.env` (not tracked) with required values:

```
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_API_TOKEN=your_admin_secret
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
ADMIN_EMAIL=admin@example.com
```

4. Run Supabase migration script in Dashboard SQL Editor:

- Use `supabase_schema.sql` in this repo
- Ensure `public.users` has `premium_expires_at` column:

```sql
alter table public.users add column if not exists premium_expires_at timestamp with time zone;
```

5. Start local dev server:

```bash
npm run dev
```

## Usage

- `/signup`: create account; requires email verification
- `/login`: sign in to dashboard
- Premium tests are gated by `is_premium` and premium expiry.

## Important Security notes

- `src/hooks/useAuth.jsx` has defensive auth flow, returning generic errors to users.
- `api/payments/submit.js` now requires `Authorization: Bearer <access_token>`;
  userId is resolved from token, not client payload.
- `api/admin/payments/action.js` requires `x-admin-token` header and `ADMIN_API_TOKEN`.

## Production deployment

- Deploy to Vercel (or preferred host) with environment variables
- Set Supabase `anon` and service role key in hosting secrets
- Ensure Supabase table policies from `supabase_schema.sql` are applied

## Troubleshooting

- `400` from `/rest/v1/users` if `premium_expires_at` missing: run
  migration above.
- `Signup successful` / `Please verify email` logic is controlled in `useAuth.signup`.

## Testing

- `npm run build` should pass
- `npm run dev` should load app
- Signup existing email shows message/err from API (no false success)
- Admin route with wrong token returns 403

## Maintenance

- Keep secrets out of repo (`.env` in `.gitignore`)
- Review Supabase RLS policy every release
- Code style: Prettier / ESLint as needed
