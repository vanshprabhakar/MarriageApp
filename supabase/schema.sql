-- 1. Wedding Settings & Theme Table (Single row ID = 1 for MVP, or multiple rows for SaaS)
create table if not exists wedding_settings (
  id bigint primary key,
  groom_name text not null default 'Vansh',
  bride_name text not null default 'Riya',
  date_range_label text not null default 'November 24–25, 2026',
  city text not null default 'Taj Yeshwantpur, Bengaluru',
  ceremonies jsonb not null default '[]'::jsonb,
  rsvp_theme jsonb not null default '{}'::jsonb
);

-- 2. Households & RSVP Table
create table if not exists households (
  id bigint primary key,
  name text not null,
  side text default 'Groom',
  whatsapp text default '',
  is_outstation boolean default false,
  invited_events text[] default '{}',
  status text default 'Pending',
  headcount int default 2,
  arrival_date text default '',
  arrival_time text default '',
  departure_date text default '',
  departure_time text default '',
  allocated_stay text default 'Unassigned'
);

-- 3. Shopping & Trousseau Inventory Table
create table if not exists inventory (
  id bigint primary key,
  name text not null,
  category text default 'Apparel',
  ceremony text default 'Wedding',
  status text default 'To Buy',
  custody text default 'Pending Purchase',
  owner text default 'Vansh'
);

-- 4. Budget & Vendors Table
create table if not exists vendors (
  id bigint primary key,
  name text not null,
  category text default 'Venue',
  side text default 'Shared',
  total numeric default 0,
  paid numeric default 0,
  due_date text default ''
);

-- Enable RLS and allow public access for frictionless Guest RSVPs
alter table wedding_settings enable row level security;
alter table households enable row level security;
alter table inventory enable row level security;
alter table vendors enable row level security;

create policy "Public access wedding_settings" on wedding_settings for all using (true) with check (true);
create policy "Public access households" on households for all using (true) with check (true);
create policy "Public access inventory" on inventory for all using (true) with check (true);
create policy "Public access vendors" on vendors for all using (true) with check (true);