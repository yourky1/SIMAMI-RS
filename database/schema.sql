create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text,
  role text not null check (role in ('Administrator', 'Petugas Bangsal', 'Teknisi')),
  unit text not null,
  status text not null default 'Aktif',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists assets (
  id text primary key,
  name text not null,
  category text not null,
  serial_number text,
  location text not null,
  status text not null check (status in ('Tersedia', 'Dipakai', 'Dipinjam', 'Maintenance')),
  condition text not null,
  procurement_date date,
  unit_owner text,
  next_maintenance date,
  note text,
  image text,
  priority text default 'Normal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists borrow_requests (
  id uuid primary key default gen_random_uuid(),
  asset_id text not null references assets(id) on delete cascade,
  borrower text not null,
  borrower_role text default 'Petugas Bangsal',
  unit text not null,
  from_location text not null,
  to_location text not null,
  purpose text not null,
  expected_return date,
  status text not null default 'Menunggu Persetujuan',
  timeline jsonb default '[]'::jsonb,
  requested_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists asset_mutations (
  id uuid primary key default gen_random_uuid(),
  asset_id text not null references assets(id) on delete cascade,
  from_location text not null,
  to_location text not null,
  officer text not null,
  note text,
  status text not null default 'Belum kembali',
  created_at timestamptz not null default now()
);

create table if not exists maintenance_records (
  id uuid primary key default gen_random_uuid(),
  asset_id text not null references assets(id) on delete cascade,
  technician text not null,
  scheduled_date date not null,
  result text,
  status text not null default 'Terjadwal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_assets_location on assets(location);
create index if not exists idx_assets_status on assets(status);
create index if not exists idx_borrow_requests_asset_id on borrow_requests(asset_id);
create index if not exists idx_borrow_requests_status on borrow_requests(status);
create index if not exists idx_mutations_asset_id on asset_mutations(asset_id);
create index if not exists idx_maintenance_asset_id on maintenance_records(asset_id);
