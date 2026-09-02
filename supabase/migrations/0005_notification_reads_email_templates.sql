-- Mabunda Travel & Tours — Admin Dashboard Phase 5
-- Per-admin notification read state, and email templates (editor only —
-- no sending until an email provider is connected in a later phase).
--
-- Run this once via the Supabase SQL Editor, after 0001–0004.
-- Safe to re-run: every statement is guarded.

-- ---------------------------------------------------------------------------
-- notification_reads — replaces the old shared notifications.read flag.
-- Presence of a row = that admin has read that notification.
-- ---------------------------------------------------------------------------

create table if not exists notification_reads (
  notification_id uuid not null references notifications(id) on delete cascade,
  admin_id        uuid not null references admins(id) on delete cascade,
  created_at      timestamptz not null default now(),
  primary key (notification_id, admin_id)
);

alter table notification_reads enable row level security;

drop policy if exists "admins read own notification reads" on notification_reads;
create policy "admins read own notification reads" on notification_reads
  for select using (admin_id = auth.uid());

drop policy if exists "admins mark own notifications read" on notification_reads;
create policy "admins mark own notifications read" on notification_reads
  for insert with check (admin_id = auth.uid());

-- The old shared flag is no longer read by the app; drop it now that
-- notification_reads is the source of truth.
alter table notifications drop column if exists read;

-- ---------------------------------------------------------------------------
-- email_templates — editable templates, not yet wired to any sending
-- mechanism. Seeded with the 7 templates named in the brief; only
-- enquiry_received/new_enquiry correspond to a real event today.
-- ---------------------------------------------------------------------------

create table if not exists email_templates (
  key         text primary key,
  label       text not null,
  subject     text not null default '',
  body        text not null default '',
  updated_by  uuid references admins(id),
  updated_at  timestamptz not null default now()
);

drop trigger if exists email_templates_set_updated_at on email_templates;
create trigger email_templates_set_updated_at
  before update on email_templates
  for each row execute function set_updated_at();

alter table email_templates enable row level security;

drop policy if exists "admins manage email templates" on email_templates;
create policy "admins manage email templates" on email_templates
  for all using (is_active_admin()) with check (is_active_admin());

insert into email_templates (key, label, subject, body) values
  ('enquiry_received', 'Customer: Enquiry received', 'We''ve received your enquiry, {{customer_name}}!',
   'Hi {{customer_name}},' || E'\n\n' || 'Thanks for reaching out to Mabunda Travel & Tours about {{tour_name}}. We''ve received your enquiry and will be in touch within one business day with a personalised quote.' || E'\n\n' || 'Journey. Explore. Experience.' || E'\n' || 'Mabunda Travel & Tours'),
  ('booking_confirmed', 'Customer: Booking confirmed', 'Your booking is confirmed — {{booking_reference}}',
   'Hi {{customer_name}},' || E'\n\n' || 'Your booking for {{tour_name}} on {{travel_date}} is confirmed. Your reference number is {{booking_reference}}.' || E'\n\n' || 'We look forward to hosting you!'),
  ('booking_cancelled', 'Customer: Booking cancelled', 'Booking {{booking_reference}} cancelled',
   'Hi {{customer_name}},' || E'\n\n' || 'This confirms that booking {{booking_reference}} for {{tour_name}} has been cancelled. If this wasn''t expected, please contact us.'),
  ('new_enquiry', 'Business: New enquiry', 'New enquiry from {{customer_name}}',
   'A new enquiry was submitted by {{customer_name}} about {{tour_name}}, travelling {{travel_date}}. View it in the admin dashboard under Enquiries.'),
  ('new_booking', 'Business: New booking', 'New booking — {{booking_reference}}',
   'A booking was confirmed: {{booking_reference}} for {{customer_name}}, {{tour_name}} on {{travel_date}}.'),
  ('system_notification', 'Business: System notification', 'Mabunda Travel & Tours — system notification',
   'This is a placeholder template for important system notifications (e.g. failed emails, security alerts). Not yet triggered by anything.')
on conflict (key) do nothing;
