-- Mabunda Travel & Tours — Admin Dashboard Phase 1
-- Content tables (tours, transfers, destinations, faqs, testimonials),
-- the admins/RBAC table, RLS policies, and the public "media" storage bucket.
--
-- Run this once via the Supabase SQL Editor (or `supabase db push` if you
-- link the CLI yourself). Safe to re-run: every statement is guarded.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- admins (RBAC source of truth — one row per dashboard user)
-- ---------------------------------------------------------------------------

create table if not exists admins (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  full_name   text not null default '',
  role        text not null default 'editor' check (role in ('super_admin', 'admin', 'editor')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists admins_set_updated_at on admins;
create trigger admins_set_updated_at
  before update on admins
  for each row execute function set_updated_at();

-- Small helper used by every RLS policy below: is the current JWT user an
-- active admin? SQL function so policies stay short and consistent.
create or replace function is_active_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from admins
    where id = auth.uid() and is_active = true
  );
$$;

create or replace function is_super_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from admins
    where id = auth.uid() and is_active = true and role = 'super_admin'
  );
$$;

alter table admins enable row level security;

drop policy if exists "admins can read admin list" on admins;
create policy "admins can read admin list" on admins
  for select using (is_active_admin());

drop policy if exists "super admins manage other admins" on admins;
create policy "super admins manage other admins" on admins
  for all using (is_super_admin() or id = auth.uid())
  with check (is_super_admin() or id = auth.uid());

-- ---------------------------------------------------------------------------
-- destinations
-- ---------------------------------------------------------------------------

create table if not exists destinations (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  description     text not null default '',
  attractions     text[] not null default '{}',
  images          jsonb not null default '[]',
  tag             text,
  stat_label      text,
  stat_value      text,
  featured        boolean not null default false,
  status          text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  seo_title       text,
  seo_description text,
  created_by      uuid references admins(id),
  updated_by      uuid references admins(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

drop trigger if exists destinations_set_updated_at on destinations;
create trigger destinations_set_updated_at
  before update on destinations
  for each row execute function set_updated_at();

create index if not exists destinations_status_idx on destinations(status);
create index if not exists destinations_slug_idx on destinations(slug);

alter table destinations enable row level security;

drop policy if exists "public reads published destinations" on destinations;
create policy "public reads published destinations" on destinations
  for select using (status = 'published' or is_active_admin());

drop policy if exists "admins manage destinations" on destinations;
create policy "admins manage destinations" on destinations
  for all using (is_active_admin()) with check (is_active_admin());

-- ---------------------------------------------------------------------------
-- tours
-- ---------------------------------------------------------------------------

create table if not exists tours (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  slug               text not null unique,
  short_description  text not null default '',
  full_description   text not null default '',
  destination_id     uuid references destinations(id) on delete set null,
  duration           text,
  starting_location  text,
  highlights         text[] not null default '{}',
  activities         text[] not null default '{}',
  included           text[] not null default '{}',
  excluded           text[] not null default '{}',
  price_from         numeric,
  price_note         text,
  max_travellers     int,
  images             jsonb not null default '[]',
  tag                text,
  featured           boolean not null default false,
  status             text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  seo_title          text,
  seo_description    text,
  created_by         uuid references admins(id),
  updated_by         uuid references admins(id),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

drop trigger if exists tours_set_updated_at on tours;
create trigger tours_set_updated_at
  before update on tours
  for each row execute function set_updated_at();

create index if not exists tours_status_idx on tours(status);
create index if not exists tours_slug_idx on tours(slug);
create index if not exists tours_destination_idx on tours(destination_id);

alter table tours enable row level security;

drop policy if exists "public reads published tours" on tours;
create policy "public reads published tours" on tours
  for select using (status = 'published' or is_active_admin());

drop policy if exists "admins manage tours" on tours;
create policy "admins manage tours" on tours
  for all using (is_active_admin()) with check (is_active_admin());

-- ---------------------------------------------------------------------------
-- transfers
-- ---------------------------------------------------------------------------

create table if not exists transfers (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  slug               text not null unique,
  type               text not null default 'custom' check (type in ('airport', 'private', 'destination', 'custom')),
  pickup_location    text,
  dropoff_location   text,
  description        text not null default '',
  vehicle_type       text,
  passenger_capacity int,
  luggage_capacity   text,
  pricing_type       text not null default 'quote' check (pricing_type in ('fixed', 'quote')),
  price              numeric,
  images             jsonb not null default '[]',
  availability_note  text,
  seo_title          text,
  seo_description    text,
  status             text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by         uuid references admins(id),
  updated_by         uuid references admins(id),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

drop trigger if exists transfers_set_updated_at on transfers;
create trigger transfers_set_updated_at
  before update on transfers
  for each row execute function set_updated_at();

create index if not exists transfers_status_idx on transfers(status);
create index if not exists transfers_slug_idx on transfers(slug);

alter table transfers enable row level security;

drop policy if exists "public reads published transfers" on transfers;
create policy "public reads published transfers" on transfers
  for select using (status = 'published' or is_active_admin());

drop policy if exists "admins manage transfers" on transfers;
create policy "admins manage transfers" on transfers
  for all using (is_active_admin()) with check (is_active_admin());

-- ---------------------------------------------------------------------------
-- faqs
-- ---------------------------------------------------------------------------

create table if not exists faqs (
  id             uuid primary key default gen_random_uuid(),
  question       text not null,
  answer         text not null,
  category       text not null default 'general' check (category in ('general', 'booking')),
  display_order  int not null default 0,
  published      boolean not null default true,
  created_by     uuid references admins(id),
  updated_by     uuid references admins(id),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

drop trigger if exists faqs_set_updated_at on faqs;
create trigger faqs_set_updated_at
  before update on faqs
  for each row execute function set_updated_at();

create index if not exists faqs_published_idx on faqs(published);
create index if not exists faqs_display_order_idx on faqs(display_order);

alter table faqs enable row level security;

drop policy if exists "public reads published faqs" on faqs;
create policy "public reads published faqs" on faqs
  for select using (published = true or is_active_admin());

drop policy if exists "admins manage faqs" on faqs;
create policy "admins manage faqs" on faqs
  for all using (is_active_admin()) with check (is_active_admin());

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------

create table if not exists testimonials (
  id                uuid primary key default gen_random_uuid(),
  customer_name     text not null,
  review            text not null,
  rating            int not null default 5 check (rating between 1 and 5),
  customer_location text,
  photo_url         text,
  source            text,
  featured          boolean not null default false,
  published         boolean not null default true,
  created_by        uuid references admins(id),
  updated_by        uuid references admins(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

drop trigger if exists testimonials_set_updated_at on testimonials;
create trigger testimonials_set_updated_at
  before update on testimonials
  for each row execute function set_updated_at();

create index if not exists testimonials_published_idx on testimonials(published);

alter table testimonials enable row level security;

drop policy if exists "public reads published testimonials" on testimonials;
create policy "public reads published testimonials" on testimonials
  for select using (published = true or is_active_admin());

drop policy if exists "admins manage testimonials" on testimonials;
create policy "admins manage testimonials" on testimonials
  for all using (is_active_admin()) with check (is_active_admin());

-- ---------------------------------------------------------------------------
-- Storage: public "media" bucket for tour/transfer/destination/testimonial images
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "public reads media" on storage.objects;
create policy "public reads media" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media" on storage.objects
  for insert with check (bucket_id = 'media' and is_active_admin());

drop policy if exists "admins update media" on storage.objects;
create policy "admins update media" on storage.objects
  for update using (bucket_id = 'media' and is_active_admin());

drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media" on storage.objects
  for delete using (bucket_id = 'media' and is_active_admin());
