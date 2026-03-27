-- Family Trip Manager — Supabase Full Schema
-- Execute this SQL in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- Run in the exact order below.

-- =====================
-- 1. Extensions
-- =====================
create extension if not exists "uuid-ossp";

-- =====================
-- 2. Tables
-- =====================

-- profiles (synced with auth.users)
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- families
create table public.families (
  id           uuid default uuid_generate_v4() primary key,
  name         text not null,
  created_by   uuid references public.profiles(id) on delete set null,
  invite_code  text unique not null default upper(substring(md5(random()::text), 1, 8)),
  created_at   timestamptz default now()
);

-- family_members
create type public.family_role as enum ('admin', 'member');

create table public.family_members (
  id           uuid default uuid_generate_v4() primary key,
  family_id    uuid references public.families(id) on delete cascade not null,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  role         public.family_role default 'member' not null,
  nickname     text,
  member_role  text,  -- "pai", "mae", "crianca"
  age          int,
  height_cm    int,
  joined_at    timestamptz default now(),
  unique(family_id, user_id)
);

-- trips
create table public.trips (
  id                uuid default uuid_generate_v4() primary key,
  family_id         uuid references public.families(id) on delete cascade not null,
  name              text not null,
  destination       text not null,
  destination_code  text,
  origin            text,
  origin_code       text,
  start_date        date,
  end_date          date,
  exchange_rate     decimal(10,4) default 5.50,
  share_code        text unique not null default upper(substring(md5(random()::text), 1, 6)),
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trips_updated_at
  before update on public.trips
  for each row execute procedure public.update_updated_at();

-- flights
create type public.flight_type as enum ('ida', 'volta');
create type public.flight_status as enum ('confirmado', 'pendente', 'cancelado');

create table public.flights (
  id               uuid default uuid_generate_v4() primary key,
  trip_id          uuid references public.trips(id) on delete cascade not null,
  type             public.flight_type not null,
  airline          text,
  flight_number    text,
  pnr              text,
  origin           text,
  origin_code      text,
  destination      text,
  destination_code text,
  departure_at     timestamptz,
  arrival_at       timestamptz,
  duration         text,
  seats            text,
  baggage          text,
  status           public.flight_status default 'pendente',
  boarding_pass    text,
  check_in_available text,
  notes            text,
  created_at       timestamptz default now()
);

-- accommodations
create table public.accommodations (
  id                   uuid default uuid_generate_v4() primary key,
  trip_id              uuid references public.trips(id) on delete cascade not null,
  name                 text,
  address              text,
  maps_url             text,
  reservation_code     text,
  check_in_at          timestamptz,
  check_out_at         timestamptz,
  contact_phone        text,
  contact_email        text,
  room_type            text,
  parking              text,
  breakfast            text,
  wifi                 text,
  pool                 text,
  shuttle              text,
  crib                 text,
  cancellation_policy  text,
  distance_to_parks    text,
  notes                text,
  created_at           timestamptz default now()
);

-- car_rentals
create table public.car_rentals (
  id               uuid default uuid_generate_v4() primary key,
  trip_id          uuid references public.trips(id) on delete cascade not null,
  company          text,
  vehicle_category text,
  reservation_code text,
  pickup_at        timestamptz,
  return_at        timestamptz,
  pickup_location  text,
  return_location  text,
  insurance        text,
  child_seat       text,
  gps              text,
  fuel_policy      text,
  total_price      text,
  payment_method   text,
  notes            text,
  created_at       timestamptz default now()
);

-- events (agenda)
create table public.events (
  id          uuid default uuid_generate_v4() primary key,
  trip_id     uuid references public.trips(id) on delete cascade not null,
  title       text not null,
  description text,
  type        text,
  event_date  date not null,
  start_time  time,
  end_time    time,
  completed   boolean default false,
  notes       text,
  created_at  timestamptz default now()
);

-- budget_categories
create table public.budget_categories (
  id           uuid default uuid_generate_v4() primary key,
  trip_id      uuid references public.trips(id) on delete cascade not null,
  slug         text not null,
  name         text not null,
  icon         text,
  planned_brl  decimal(10,2) default 0,
  planned_usd  decimal(10,2) default 0,
  sort_order   int default 0,
  created_at   timestamptz default now()
);

-- expenses
create table public.expenses (
  id                 uuid default uuid_generate_v4() primary key,
  trip_id            uuid references public.trips(id) on delete cascade not null,
  budget_category_id uuid references public.budget_categories(id) on delete set null,
  added_by           uuid references public.profiles(id) on delete set null,
  amount             decimal(10,2) not null,
  currency           text default 'BRL',
  category           text,
  description        text,
  expense_date       date,
  created_at         timestamptz default now()
);

-- documents
create type public.doc_status as enum ('nao_iniciado', 'pendente', 'concluido');

create table public.documents (
  id               uuid default uuid_generate_v4() primary key,
  trip_id          uuid references public.trips(id) on delete cascade not null,
  title            text not null,
  owner            text,
  status           public.doc_status default 'nao_iniciado',
  expiry_date      date,
  notes            text,
  created_at       timestamptz default now()
);

-- packing_items (mala, mochila, farmacia, mercado)
create type public.packing_list_type as enum ('mala', 'mochila', 'farmacia', 'mercado');

create table public.packing_items (
  id               uuid default uuid_generate_v4() primary key,
  trip_id          uuid references public.trips(id) on delete cascade not null,
  list_type        public.packing_list_type not null,
  name             text not null,
  checked          boolean default false,
  category         text,
  created_at       timestamptz default now()
);

-- food_items (restaurantes customizados e itens de comida)
create type public.food_item_type as enum ('restaurante', 'comida');

create table public.food_items (
  id                uuid default uuid_generate_v4() primary key,
  trip_id           uuid references public.trips(id) on delete cascade not null,
  item_type         public.food_item_type not null,
  name              text not null,
  location          text,
  park_or_area      text,
  internal_location text,
  highlight         text,
  kid_friendly      boolean default true,
  category          text,
  checked           boolean default false,
  notes             text,
  created_at        timestamptz default now()
);

-- =====================
-- 2b. RPC Functions (atomic operations)
-- =====================

-- Create family + add creator as admin atomically
create or replace function public.create_family_with_member(p_name text)
returns json as $$
declare
  v_family_id uuid;
  v_invite_code text;
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Check if user already belongs to a family
  if exists (select 1 from public.family_members where user_id = v_user_id) then
    raise exception 'Voce ja pertence a uma familia';
  end if;

  -- Create family
  insert into public.families (name, created_by)
  values (p_name, v_user_id)
  returning id, invite_code into v_family_id, v_invite_code;

  -- Add creator as admin
  insert into public.family_members (family_id, user_id, role)
  values (v_family_id, v_user_id, 'admin');

  return json_build_object(
    'id', v_family_id,
    'name', p_name,
    'invite_code', v_invite_code
  );
end;
$$ language plpgsql security definer;

-- Join family by invite code atomically
create or replace function public.join_family_by_code(p_invite_code text)
returns json as $$
declare
  v_family record;
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Check if user already belongs to a family
  if exists (select 1 from public.family_members where user_id = v_user_id) then
    raise exception 'Voce ja pertence a uma familia';
  end if;

  -- Find family by invite code
  select id, name, invite_code into v_family
  from public.families
  where invite_code = upper(p_invite_code);

  if v_family.id is null then
    raise exception 'Codigo de convite invalido';
  end if;

  -- Add as member
  insert into public.family_members (family_id, user_id, role)
  values (v_family.id, v_user_id, 'member');

  return json_build_object(
    'id', v_family.id,
    'name', v_family.name,
    'invite_code', v_family.invite_code
  );
end;
$$ language plpgsql security definer;

-- Get invite code for a family (for sharing)
create or replace function public.get_family_invite_code(p_family_id uuid)
returns text as $$
declare
  v_code text;
begin
  select invite_code into v_code
  from public.families
  where id = p_family_id;

  -- Verify caller is a member
  if not exists (
    select 1 from public.family_members
    where family_id = p_family_id and user_id = auth.uid()
  ) then
    raise exception 'Not a family member';
  end if;

  return v_code;
end;
$$ language plpgsql security definer;

-- =====================
-- 3. Row Level Security
-- =====================

alter table public.profiles           enable row level security;
alter table public.families           enable row level security;
alter table public.family_members     enable row level security;
alter table public.trips              enable row level security;
alter table public.flights            enable row level security;
alter table public.accommodations     enable row level security;
alter table public.car_rentals        enable row level security;
alter table public.events             enable row level security;
alter table public.budget_categories  enable row level security;
alter table public.expenses           enable row level security;
alter table public.documents          enable row level security;
alter table public.packing_items      enable row level security;
alter table public.food_items         enable row level security;

-- Helper function
create or replace function public.is_family_member_of_trip(p_trip_id uuid)
returns boolean as $$
  select exists (
    select 1
    from public.family_members fm
    join public.trips t on t.family_id = fm.family_id
    where t.id = p_trip_id
      and fm.user_id = auth.uid()
  );
$$ language sql security definer;

-- profiles
create policy "Users read own profile" on public.profiles for select using (id = auth.uid());
create policy "Users update own profile" on public.profiles for update using (id = auth.uid());

-- families
create policy "Members see own family" on public.families for select
  using (
    created_by = auth.uid()
    or exists (select 1 from public.family_members where family_id = families.id and user_id = auth.uid())
  );
create policy "Users create family" on public.families for insert with check (created_by = auth.uid());
create policy "Admin updates family" on public.families for update
  using (exists (select 1 from public.family_members where family_id = families.id and user_id = auth.uid() and role = 'admin'));

-- family_members
create policy "Members see family members" on public.family_members for select
  using (exists (select 1 from public.family_members fm2 where fm2.family_id = family_members.family_id and fm2.user_id = auth.uid()));
create policy "Users join families" on public.family_members for insert with check (user_id = auth.uid());
create policy "Admin manages members" on public.family_members for update
  using (exists (select 1 from public.family_members fm2 where fm2.family_id = family_members.family_id and fm2.user_id = auth.uid() and fm2.role = 'admin'));
create policy "Admin deletes members" on public.family_members for delete
  using (exists (select 1 from public.family_members fm2 where fm2.family_id = family_members.family_id and fm2.user_id = auth.uid() and fm2.role = 'admin'));

-- trips
create policy "Members see trips" on public.trips for select
  using (
    exists (select 1 from public.family_members where family_id = trips.family_id and user_id = auth.uid())
    or true  -- allow public read for share_code lookup
  );
create policy "Members create trips" on public.trips for insert
  with check (exists (select 1 from public.family_members where family_id = trips.family_id and user_id = auth.uid()));
create policy "Members update trips" on public.trips for update
  using (exists (select 1 from public.family_members where family_id = trips.family_id and user_id = auth.uid()));
create policy "Members delete trips" on public.trips for delete
  using (exists (select 1 from public.family_members where family_id = trips.family_id and user_id = auth.uid() and role = 'admin'));

-- Child tables (all use same pattern)
create policy "Family access flights" on public.flights for all using (public.is_family_member_of_trip(trip_id));
create policy "Family access accommodations" on public.accommodations for all using (public.is_family_member_of_trip(trip_id));
create policy "Family access car_rentals" on public.car_rentals for all using (public.is_family_member_of_trip(trip_id));
create policy "Family access events" on public.events for all using (public.is_family_member_of_trip(trip_id));
create policy "Family access budget_categories" on public.budget_categories for all using (public.is_family_member_of_trip(trip_id));
create policy "Family access expenses" on public.expenses for all using (public.is_family_member_of_trip(trip_id));
create policy "Family access documents" on public.documents for all using (public.is_family_member_of_trip(trip_id));
create policy "Family access packing_items" on public.packing_items for all using (public.is_family_member_of_trip(trip_id));
create policy "Family access food_items" on public.food_items for all using (public.is_family_member_of_trip(trip_id));

-- Public read for shared trips (child tables)
create policy "Public read flights by share" on public.flights for select
  using (exists (select 1 from public.trips where id = trip_id));
create policy "Public read accommodations by share" on public.accommodations for select
  using (exists (select 1 from public.trips where id = trip_id));
create policy "Public read events by share" on public.events for select
  using (exists (select 1 from public.trips where id = trip_id));
create policy "Public read budget by share" on public.budget_categories for select
  using (exists (select 1 from public.trips where id = trip_id));
create policy "Public read expenses by share" on public.expenses for select
  using (exists (select 1 from public.trips where id = trip_id));
create policy "Public read documents by share" on public.documents for select
  using (exists (select 1 from public.trips where id = trip_id));
create policy "Public read packing by share" on public.packing_items for select
  using (exists (select 1 from public.trips where id = trip_id));
create policy "Public read food by share" on public.food_items for select
  using (exists (select 1 from public.trips where id = trip_id));

-- =====================
-- 4. Indexes
-- =====================
create index idx_family_members_user on public.family_members(user_id);
create index idx_family_members_family on public.family_members(family_id);
create index idx_trips_family on public.trips(family_id);
create index idx_trips_share_code on public.trips(share_code);
create index idx_flights_trip on public.flights(trip_id);
create index idx_accommodations_trip on public.accommodations(trip_id);
create index idx_car_rentals_trip on public.car_rentals(trip_id);
create index idx_events_trip on public.events(trip_id);
create index idx_budget_categories_trip on public.budget_categories(trip_id);
create index idx_expenses_trip on public.expenses(trip_id);
create index idx_documents_trip on public.documents(trip_id);
create index idx_packing_items_trip on public.packing_items(trip_id);
create index idx_food_items_trip on public.food_items(trip_id);

-- =====================
-- 5. Enable Realtime
-- =====================
alter publication supabase_realtime add table public.flights;
alter publication supabase_realtime add table public.accommodations;
alter publication supabase_realtime add table public.car_rentals;
alter publication supabase_realtime add table public.events;
alter publication supabase_realtime add table public.budget_categories;
alter publication supabase_realtime add table public.expenses;
alter publication supabase_realtime add table public.documents;
alter publication supabase_realtime add table public.packing_items;
alter publication supabase_realtime add table public.food_items;
