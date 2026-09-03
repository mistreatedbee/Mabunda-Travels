-- Homepage content singleton — editable hero, section headings & copy.
-- Optional: prefer seo_pages path '/_homepage' (used by the app without this table).
-- Run if you want a dedicated homepage table instead.

create table if not exists homepage (
  id          smallint primary key default 1 check (id = 1),
  content     jsonb not null default '{}',
  updated_by  uuid references admins(id),
  updated_at  timestamptz not null default now()
);

drop trigger if exists homepage_set_updated_at on homepage;
create trigger homepage_set_updated_at
  before update on homepage
  for each row execute function set_updated_at();

alter table homepage enable row level security;

drop policy if exists "public reads homepage" on homepage;
create policy "public reads homepage" on homepage
  for select using (true);

drop policy if exists "admins manage homepage" on homepage;
create policy "admins manage homepage" on homepage
  for all using (is_active_admin()) with check (is_active_admin());

insert into homepage (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;
