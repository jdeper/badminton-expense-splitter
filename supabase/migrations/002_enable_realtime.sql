-- Enable Supabase Realtime on app_data table for live updates across multiple users.
-- Also set replica identity to FULL so UPDATE payloads include all columns.
alter table public.app_data replica identity full;

begin;
  -- Add app_data to supabase_realtime publication if not already there
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table public.app_data;
commit;
