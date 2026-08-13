-- Mabunda Travel & Tours — Admin Dashboard Phase 4
-- Audit log (generic trigger-based), notification centre (new-enquiry
-- trigger), and maintenance mode settings fields.
--
-- Run this once via the Supabase SQL Editor, after 0001–0003.
-- Safe to re-run: every statement is guarded.

-- ---------------------------------------------------------------------------
-- audit_logs — immutable trail of every admin write, populated by a
-- generic trigger attached to each content table below.
-- ---------------------------------------------------------------------------

create table if not exists audit_logs (
  id             uuid primary key default gen_random_uuid(),
  admin_id       uuid references admins(id),
  action         text not null check (action in ('insert', 'update', 'delete', 'login')),
  resource_type  text not null,
  resource_id    text,
  resource_label text,
  created_at     timestamptz not null default now()
);

create index if not exists audit_logs_created_at_idx on audit_logs(created_at);
create index if not exists audit_logs_resource_type_idx on audit_logs(resource_type);

alter table audit_logs enable row level security;

-- Read-only trail: admins can read, nobody gets update/delete policies —
-- rows are only ever written by the trigger function (security definer)
-- or the one manual login-event insert from the app.
drop policy if exists "admins read audit log" on audit_logs;
create policy "admins read audit log" on audit_logs
  for select using (is_active_admin());

drop policy if exists "admins insert audit log" on audit_logs;
create policy "admins insert audit log" on audit_logs
  for insert with check (is_active_admin());

-- Generic audit trigger. Usage: `execute function audit_row_change('name')`
-- or `execute function audit_row_change('question', 'id')` — first arg is
-- the column to use as a human-readable label, second (optional, defaults
-- to 'id') is the primary key column.
create or replace function audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  label_column text := nullif(TG_ARGV[0], '');
  pk_column    text := coalesce(nullif(TG_ARGV[1], ''), 'id');
  label_value  text;
  pk_value     text;
  rec          record;
begin
  rec := coalesce(NEW, OLD);

  if label_column is not null then
    execute format('select ($1).%I::text', label_column) into label_value using rec;
  end if;
  execute format('select ($1).%I::text', pk_column) into pk_value using rec;

  insert into audit_logs (admin_id, action, resource_type, resource_id, resource_label)
  values (auth.uid(), lower(TG_OP), TG_TABLE_NAME, pk_value, label_value);

  return rec;
end;
$$;

drop trigger if exists audit_tours on tours;
create trigger audit_tours after insert or update or delete on tours
  for each row execute function audit_row_change('name');

drop trigger if exists audit_transfers on transfers;
create trigger audit_transfers after insert or update or delete on transfers
  for each row execute function audit_row_change('name');

drop trigger if exists audit_destinations on destinations;
create trigger audit_destinations after insert or update or delete on destinations
  for each row execute function audit_row_change('name');

drop trigger if exists audit_faqs on faqs;
create trigger audit_faqs after insert or update or delete on faqs
  for each row execute function audit_row_change('question');

drop trigger if exists audit_testimonials on testimonials;
create trigger audit_testimonials after insert or update or delete on testimonials
  for each row execute function audit_row_change('customer_name');

drop trigger if exists audit_bookings on bookings;
create trigger audit_bookings after insert or update or delete on bookings
  for each row execute function audit_row_change('full_name');

drop trigger if exists audit_settings on settings;
create trigger audit_settings after insert or update or delete on settings
  for each row execute function audit_row_change();

drop trigger if exists audit_seo_pages on seo_pages;
create trigger audit_seo_pages after insert or update or delete on seo_pages
  for each row execute function audit_row_change('path', 'path');

drop trigger if exists audit_media on media;
create trigger audit_media after insert or update or delete on media
  for each row execute function audit_row_change('alt_text');

drop trigger if exists audit_admins on admins;
create trigger audit_admins after insert or update or delete on admins
  for each row execute function audit_row_change('email');

-- ---------------------------------------------------------------------------
-- notifications — system-generated alerts. Phase 4 only produces
-- "new enquiry" notifications (the one real event we have); more types
-- will be added as the underlying features (email, security monitoring)
-- actually exist, not before.
-- ---------------------------------------------------------------------------

create table if not exists notifications (
  id            uuid primary key default gen_random_uuid(),
  type          text not null default 'new_enquiry',
  title         text not null,
  message       text,
  resource_type text,
  resource_id   uuid,
  read          boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists notifications_read_idx on notifications(read);
create index if not exists notifications_created_at_idx on notifications(created_at);

alter table notifications enable row level security;

drop policy if exists "admins read notifications" on notifications;
create policy "admins read notifications" on notifications
  for select using (is_active_admin());

drop policy if exists "admins mark notifications read" on notifications;
create policy "admins mark notifications read" on notifications
  for update using (is_active_admin()) with check (is_active_admin());

create or replace function notify_new_enquiry()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into notifications (type, title, message, resource_type, resource_id)
  values (
    'new_enquiry',
    'New enquiry received',
    NEW.full_name || case when NEW.service is not null then ' — ' || NEW.service else '' end,
    'bookings',
    NEW.id
  );
  return NEW;
end;
$$;

drop trigger if exists bookings_notify_new_enquiry on bookings;
create trigger bookings_notify_new_enquiry after insert on bookings
  for each row execute function notify_new_enquiry();

-- ---------------------------------------------------------------------------
-- settings — maintenance mode fields
-- ---------------------------------------------------------------------------

alter table settings add column if not exists maintenance_mode boolean not null default false;
alter table settings add column if not exists maintenance_message text;
