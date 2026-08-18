-- ============================================================================
--  TEAM APEX — Supabase schema  (run once in the Supabase SQL Editor)
-- ----------------------------------------------------------------------------
--  Creates:
--    • admins            — allow-list of dashboard admin emails
--    • site_settings     — editable contact info / socials (single row)
--    • listings          — property listings
--    • form_submissions  — every website form submission
--    • storage bucket    — "listing-images" (public read, admin write)
--  All tables are protected with Row Level Security:
--    • The public (anon key) can READ listings + settings, and INSERT form
--      submissions — nothing else.
--    • Only signed-in users whose email is in `admins` can write.
--  This whole script is safe to re-run.
-- ============================================================================

-- ─────────────────────────────────────────────────────────────
-- 1. ADMIN ALLOW-LIST + helper function
-- ─────────────────────────────────────────────────────────────
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;
-- No policies on `admins`: clients can never read/write it. It is managed
-- here in the SQL editor, and is_admin() reads it via SECURITY DEFINER.

-- 👇  CHANGE THIS to the email you will sign in to the dashboard with.
insert into public.admins (email) values ('aldredt13@gmail.com')
on conflict (email) do nothing;

-- Returns true when the currently signed-in user is an admin.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins a
    where a.email = (auth.jwt() ->> 'email')
  );
$$;
-- Signed-in users only (used by the app + RLS policies). Not anon.
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Keeps updated_at fresh on any UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 2. SITE SETTINGS  (single editable row, id = 1)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.site_settings (
  id               int primary key default 1,
  whatsapp_display text,
  whatsapp_link    text,
  phone_display    text,
  phone_link       text,
  email            text,
  facebook         text,
  instagram        text,
  linkedin         text,
  domain           text,
  tagline          text,
  about            text,
  updated_at       timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into public.site_settings
  (id, whatsapp_display, whatsapp_link, phone_display, phone_link, email,
   facebook, instagram, linkedin, domain, tagline, about)
values
  (1, '063 482 8664', 'https://wa.me/27634828664', '063 482 8664',
   'tel:+27634828664', 'info@teamapex.co.za', '', '', '',
   'www.teamapex.co.za', 'We make Real Estate a Breeze',
   'Team APEX powered by Real Estate Services is a results-driven real estate team helping homeowners buy, sell and rent — and guiding agents to successful careers across South Africa.')
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "site settings are public" on public.site_settings;
create policy "site settings are public" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "admins update site settings" on public.site_settings;
create policy "admins update site settings" on public.site_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- 3. LISTINGS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.listings (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  title         text not null,
  slug          text not null unique,
  description   text,
  price         numeric,
  listing_type  text not null default 'For Sale',   -- 'For Sale' | 'To Rent'
  property_type text,
  status        text not null default 'available',  -- 'available' | 'sold' | 'rented'
  location      text,
  address       text,
  bedrooms      int,
  bathrooms     int,
  garages       int,
  size_sqm      numeric,
  features      text[] default '{}',
  images        text[] default '{}',                -- public image URLs
  featured      boolean not null default false
);
create index if not exists listings_created_idx on public.listings (created_at desc);
create index if not exists listings_type_idx    on public.listings (listing_type);

drop trigger if exists listings_updated_at on public.listings;
create trigger listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

alter table public.listings enable row level security;

drop policy if exists "listings are public" on public.listings;
create policy "listings are public" on public.listings
  for select to anon, authenticated using (true);

drop policy if exists "admins insert listings" on public.listings;
create policy "admins insert listings" on public.listings
  for insert to authenticated with check (public.is_admin());

drop policy if exists "admins update listings" on public.listings;
create policy "admins update listings" on public.listings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete listings" on public.listings;
create policy "admins delete listings" on public.listings
  for delete to authenticated using (public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- 4. FORM SUBMISSIONS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.form_submissions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  type          text not null,          -- 'contact' | 'sell' | 'join' | 'enquiry'
  name          text not null,
  email         text,
  phone         text,
  message       text,
  listing_id    uuid references public.listings(id) on delete set null,
  listing_title text,
  meta          jsonb,
  is_read       boolean not null default false
);
create index if not exists submissions_created_idx on public.form_submissions (created_at desc);

alter table public.form_submissions enable row level security;

-- Anyone may submit a form (but not as "already read", and only valid types).
drop policy if exists "public can submit" on public.form_submissions;
create policy "public can submit" on public.form_submissions
  for insert to anon, authenticated
  with check (
    coalesce(is_read, false) = false
    and type in ('contact', 'sell', 'join', 'enquiry')
  );

-- Only admins can read / manage submissions.
drop policy if exists "admins read submissions" on public.form_submissions;
create policy "admins read submissions" on public.form_submissions
  for select to authenticated using (public.is_admin());

drop policy if exists "admins update submissions" on public.form_submissions;
create policy "admins update submissions" on public.form_submissions
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete submissions" on public.form_submissions;
create policy "admins delete submissions" on public.form_submissions
  for delete to authenticated using (public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- 5. STORAGE  (bucket for listing photos)
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

drop policy if exists "listing images are public" on storage.objects;
create policy "listing images are public" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'listing-images');

drop policy if exists "admins upload listing images" on storage.objects;
create policy "admins upload listing images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'listing-images' and public.is_admin());

drop policy if exists "admins update listing images" on storage.objects;
create policy "admins update listing images" on storage.objects
  for update to authenticated
  using (bucket_id = 'listing-images' and public.is_admin());

drop policy if exists "admins delete listing images" on storage.objects;
create policy "admins delete listing images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'listing-images' and public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- 6. STORAGE USAGE  (powers the dashboard "Photo storage" meter)
-- ─────────────────────────────────────────────────────────────
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
revoke execute on function public.storage_stats() from public;
grant execute on function public.storage_stats() to authenticated;

-- NOTE: image cleanup on listing delete happens in the app (see
-- deleteListingFolder() in src/lib/imaging.ts), NOT in a DB trigger — Supabase
-- blocks direct DELETEs on storage.objects, so files must go through the
-- Storage API.

-- ============================================================================
--  DONE.  Next steps:
--   1. Make sure the email in the `admins` insert (top of file) is the one you
--      will sign in with.
--   2. In your app, open /dashboard/login and create that account.
--   3. (Optional, for instant login) Supabase Dashboard → Authentication →
--      Providers → Email → turn OFF "Confirm email", or click the confirmation
--      link emailed to you.
-- ============================================================================

-- ============================================================================
--  TEAM / SUB-ACCOUNTS  (applied via migrations — documented here for reference)
-- ----------------------------------------------------------------------------
--  public.profiles          one row per dashboard user
--                             role = 'owner' (main account, sees everything)
--                                  | 'agent'  (sees only their own work)
--                           avatar_url powers the profile photo on listings.
--  public.listing_assignments  extra agents a listing has been "given to".
--  listings.agent_id        the agent who owns / markets the listing.
--
--  Helper functions:
--    is_owner()             current user is a main account
--    is_staff()             current user has any active dashboard profile
--    is_admin()             alias for is_owner() (used by older policies)
--    can_manage_listing(id) owner, or the listing's agent, or assigned to it
--
--  Account provisioning (no service-role key needed in the browser):
--    provision_user(...)          internal, not exposed to clients
--    create_team_member(...)      RPC — owners only, creates a confirmed
--                                 auth user + profile in one call
--    set_team_member_password()   RPC — owners only, resets a password
--
--  Access summary:
--    listings          public SELECT (the website needs it);
--                      INSERT/UPDATE/DELETE require can_manage_listing()
--    form_submissions  anyone may INSERT; owners read all, agents read only
--                      enquiries on listings they manage
--    profiles          publicly readable (agent details show on listings);
--                      owners manage all, users update their own
--    storage           'listing-images' + 'avatars' public read, admin write
--
--  NOTE: auth.users rows created via SQL must have '' (not NULL) in the token
--  columns (confirmation_token, recovery_token, email_change*, phone_change*,
--  reauthentication_token) or GoTrue fails login with
--  "Database error querying schema". provision_user() handles this.
-- ============================================================================
