-- Mabunda Travel & Tours — Admin Dashboard Phase 3
-- Media library metadata, SEO page overrides, TripAdvisor settings fields.
--
-- Run this once via the Supabase SQL Editor, after 0001 and 0002.
-- Safe to re-run: every statement is guarded.

-- ---------------------------------------------------------------------------
-- media — central metadata for every file in the "media" storage bucket
-- ---------------------------------------------------------------------------

create table if not exists media (
  id           uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  url          text not null,
  alt_text     text not null default '',
  description  text,
  file_size    int,
  mime_type    text,
  folder       text,
  uploaded_by  uuid references admins(id),
  created_at   timestamptz not null default now()
);

create index if not exists media_folder_idx on media(folder);
create index if not exists media_created_at_idx on media(created_at);

alter table media enable row level security;

drop policy if exists "public reads media metadata" on media;
create policy "public reads media metadata" on media
  for select using (true);

drop policy if exists "admins manage media metadata" on media;
create policy "admins manage media metadata" on media
  for all using (is_active_admin()) with check (is_active_admin());

-- ---------------------------------------------------------------------------
-- seo_pages — per-page SEO overrides for the fixed public routes.
-- A missing row means "use the page's built-in default" — Seo.tsx only
-- overrides when a row exists.
-- ---------------------------------------------------------------------------

create table if not exists seo_pages (
  path             text primary key,
  title            text,
  description      text,
  og_title         text,
  og_description   text,
  og_image_url     text,
  robots_index     boolean not null default true,
  canonical_url    text,
  updated_by       uuid references admins(id),
  updated_at       timestamptz not null default now()
);

drop trigger if exists seo_pages_set_updated_at on seo_pages;
create trigger seo_pages_set_updated_at
  before update on seo_pages
  for each row execute function set_updated_at();

alter table seo_pages enable row level security;

drop policy if exists "public reads seo overrides" on seo_pages;
create policy "public reads seo overrides" on seo_pages
  for select using (true);

drop policy if exists "admins manage seo overrides" on seo_pages;
create policy "admins manage seo overrides" on seo_pages
  for all using (is_active_admin()) with check (is_active_admin());

-- ---------------------------------------------------------------------------
-- settings — TripAdvisor fields
-- ---------------------------------------------------------------------------

alter table settings add column if not exists tripadvisor_url text;
alter table settings add column if not exists tripadvisor_review_url text;
