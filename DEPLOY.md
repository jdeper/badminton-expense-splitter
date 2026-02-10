# Deployment Instructions

## Public production (Vercel)

### 1. Deploy to Vercel

**Option A: GitHub**
1. Push your repo to GitHub (e.g. `jdeper/badminton-expense-splitter`).
2. Go to [vercel.com](https://vercel.com) → **Add New…** → **Project** → Import the repo.
3. Click **Deploy**. Your app will be public at `https://<project>.vercel.app`.

**Option B: CLI**
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 2. Supabase in production (optional)

To use Supabase on the live site (so data syncs in the cloud):

1. In [Vercel](https://vercel.com) → your project → **Settings** → **Environment Variables**.
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL  
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key  
3. Redeploy (e.g. **Deployments** → ⋮ → **Redeploy**).

If you don’t set these, the production app uses **localStorage** (per device/browser).

### 3. Build check (local)

```bash
npm run build
npm run start
```

## Summary

| Item | Notes |
|------|--------|
| Production URL | `https://<project>.vercel.app` after deploy |
| Data | Supabase if env vars set; else localStorage |
| Public | Yes — anyone with the link can open the app |
