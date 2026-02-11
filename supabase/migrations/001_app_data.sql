-- Table for app state (single row keyed by id = 'default')
create table if not exists public.app_data (
  id text primary key default 'default',
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- Allow anonymous read/write for now (restrict with RLS when you add auth)
alter table public.app_data enable row level security;

create policy "Allow all for app_data"
  on public.app_data
  for all
  using (true)
  with check (true);

-- Optional: ensure updated_at is set on update
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger app_data_updated_at
  before update on public.app_data
  for each row execute function public.set_updated_at();
