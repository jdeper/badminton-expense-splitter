# Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy **Project URL** and **anon public** key.
3. Copy `.env.local.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Create the table: in Supabase **SQL Editor**, run the contents of `supabase/migrations/001_app_data.sql`.

If these env vars are not set, the app uses **localStorage** as before.
