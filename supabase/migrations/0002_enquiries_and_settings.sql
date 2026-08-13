-- Mabunda Travel & Tours — Admin Dashboard Phase 2
-- Enquiry management (extends the existing `bookings` table + adds
-- `enquiry_notes`) and the singleton `settings` table for business info.
--
-- Run this once via the Supabase SQL Editor, after 0001_admin_cms.sql.
-- Safe to re-run: every statement is guarded.

-- ---------------------------------------------------------------------------
-- bookings — base table (created here; turned out not to already exist —
-- api/bookings.ts was inserting into a table that was never created) +
-- enquiry-management columns
-- ---------------------------------------------------------------------------

create table if not exists bookings (
  id             uuid primary key default gen_random_uuid(),
  full_name      text not null,
  email          text not null,
  phone          text not null,
  travel_date    date,
  num_travellers int,
  destination    text,
  message        text,
  created_at     timestamptz not null default now()
);

alter table bookings add column if not exists service text;
alter table bookings add column if not exists pickup_location text;
alter table bookings add column if not exists dropoff_location text;
alter table bookings add column if not exists status text not null default 'new';
alter table bookings add column if not exists archived boolean not null default false;
alter table bookings add column if not exists updated_at timestamptz not null default now();

-- Add the status check constraint separately so re-running this file doesn't
-- error if the column already existed without it.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_status_check'
  ) then
    alter table bookings add constraint bookings_status_check
      check (status in ('new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'));
  end if;
end $$;

drop trigger if exists bookings_set_updated_at on bookings;
create trigger bookings_set_updated_at
  before update on bookings
  for each row execute function set_updated_at();

create index if not exists bookings_status_idx on bookings(status);
create index if not exists bookings_archived_idx on bookings(archived);
create index if not exists bookings_created_at_idx on bookings(created_at);

alter table bookings enable row level security;

-- No anon/public policy at all: inserts happen exclusively via the
-- service-role key in api/bookings.ts (keeps rate limiting, honeypot and
-- validation server-side). Admins can read and update, but not insert or
-- delete — enquiries are records, not draft content; archive instead.
drop policy if exists "admins read enquiries" on bookings;
create policy "admins read enquiries" on bookings
  for select using (is_active_admin());

drop policy if exists "admins update enquiries" on bookings;
create policy "admins update enquiries" on bookings
  for update using (is_active_admin()) with check (is_active_admin());

-- ---------------------------------------------------------------------------
-- enquiry_notes — timestamped internal notes trail per enquiry
-- ---------------------------------------------------------------------------

create table if not exists enquiry_notes (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null references bookings(id) on delete cascade,
  admin_id    uuid references admins(id),
  note        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists enquiry_notes_booking_idx on enquiry_notes(booking_id);

alter table enquiry_notes enable row level security;

drop policy if exists "admins manage enquiry notes" on enquiry_notes;
create policy "admins manage enquiry notes" on enquiry_notes
  for all using (is_active_admin()) with check (is_active_admin());

-- ---------------------------------------------------------------------------
-- settings — singleton business info row
-- ---------------------------------------------------------------------------

create table if not exists settings (
  id                          smallint primary key default 1 check (id = 1),
  phone                       text not null default '',
  phone_intl                  text not null default '',
  email                       text not null default '',
  whatsapp_number             text not null default '',
  address                     text not null default '',
  hours                       jsonb not null default '[]',
  social_links                jsonb not null default '{}',
  booking_notification_email  text,
  auto_response_enabled       boolean not null default true,
  auto_response_message       text,
  updated_by                  uuid references admins(id),
  updated_at                  timestamptz not null default now()
);

drop trigger if exists settings_set_updated_at on settings;
create trigger settings_set_updated_at
  before update on settings
  for each row execute function set_updated_at();

alter table settings enable row level security;

drop policy if exists "public reads settings" on settings;
create policy "public reads settings" on settings
  for select using (true);

drop policy if exists "admins update settings" on settings;
create policy "admins update settings" on settings
  for update using (is_active_admin()) with check (is_active_admin());

-- Seed the singleton row with Mabunda's real current values (matches
-- src/lib/company.ts at the time of writing) so the Settings page shows
-- accurate data immediately rather than placeholders.
insert into settings (
  id, phone, phone_intl, email, whatsapp_number, address, hours, social_links,
  auto_response_enabled
)
values (
  1,
  '076 812 3456',
  '+27768123456',
  'bookings@mabundatravel.co.za',
  '+27768123456',
  'Acornhoek, Mpumalanga, 1360, South Africa',
  '[
    {"days": "Mon – Fri", "time": "07:00 – 18:00"},
    {"days": "Saturday",  "time": "08:00 – 14:00"},
    {"days": "Sunday",    "time": "By appointment"}
  ]'::jsonb,
  '{}'::jsonb,
  true
)
on conflict (id) do nothing;
