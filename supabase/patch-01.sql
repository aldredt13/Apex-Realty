-- ============================================================================
--  Patch 01 — fixes "site settings won't save" + enables the storage meter.
--  Run this once in the Supabase SQL Editor. Safe to re-run.
-- ============================================================================

-- 1) Make sure every account you've signed up with is an admin.
--    (Single-owner project, so this is safe. Remove/limit later if you add staff.)
insert into public.admins (email)
select email from auth.users
on conflict (email) do nothing;

-- 2) Re-assert the update policy on site_settings (in case it was missing).
drop policy if exists "admins update site settings" on public.site_settings;
create policy "admins update site settings" on public.site_settings
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 3) Storage usage function for the dashboard "Photo storage" meter.
create or replace function public.storage_stats()
returns table (bytes bigint, files bigint)
language sql
security definer
set search_path = public, storage
stable
as $$
  select
    coalesce(sum((metadata->>'size')::bigint), 0)::bigint as bytes,
    count(*)::bigint as files
  from storage.objects
  where bucket_id = 'listing-images';
$$;
grant execute on function public.storage_stats() to authenticated;

-- ---- Handy checks (optional) -----------------------------------------------
-- Who can sign in as admin:   select * from public.admins;
-- Which accounts exist:       select email from auth.users;
-- Policies on site_settings:  select policyname, cmd from pg_policies
--                             where tablename = 'site_settings';
