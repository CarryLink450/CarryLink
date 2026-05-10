create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_type as enum ('Sender', 'Traveler', 'Both');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text not null,
  current_country text not null,
  home_country text not null,
  user_type public.user_type not null default 'Both',
  avatar_initials text not null,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  traveler_id uuid not null references public.profiles(id) on delete cascade,
  from_country text not null,
  from_city text not null,
  to_country text not null,
  to_city text not null,
  departure_date date not null,
  arrival_date date not null,
  available_space text not null,
  max_item_weight_kg numeric(6, 2) not null,
  accepted_item_types text[] not null default '{}',
  items_not_accepted text[] not null default '{}',
  expected_compensation text not null,
  meeting_preferences text not null,
  notes text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  from_country text not null,
  from_city text not null,
  to_country text not null,
  to_city text not null,
  preferred_start_date date not null,
  preferred_end_date date not null,
  item_category text not null,
  item_description text not null,
  approximate_size text not null,
  approximate_weight_kg numeric(6, 2) not null,
  is_sealed boolean not null default false,
  offered_compensation text not null,
  pickup_flexibility text not null,
  delivery_flexibility text not null,
  legal_confirmation boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  request_id uuid not null references public.delivery_requests(id) on delete cascade,
  strength text not null,
  score integer not null,
  created_at timestamptz not null default now(),
  unique (trip_id, request_id)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  primary key (conversation_id, profile_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  sent_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.delivery_requests enable row level security;
alter table public.matches enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Public profiles are readable" on public.profiles;
create policy "Public profiles are readable"
  on public.profiles for select
  using (true);

drop policy if exists "Users can manage own profile" on public.profiles;
create policy "Users can manage own profile"
  on public.profiles for all
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

drop policy if exists "Active trips are readable" on public.trips;
create policy "Active trips are readable"
  on public.trips for select
  using (status = 'active');

drop policy if exists "Travelers manage own trips" on public.trips;
create policy "Travelers manage own trips"
  on public.trips for all
  using (exists (select 1 from public.profiles p where p.id = traveler_id and p.auth_user_id = auth.uid()))
  with check (exists (select 1 from public.profiles p where p.id = traveler_id and p.auth_user_id = auth.uid()));

drop policy if exists "Active delivery requests are readable" on public.delivery_requests;
create policy "Active delivery requests are readable"
  on public.delivery_requests for select
  using (status = 'active');

drop policy if exists "Senders manage own delivery requests" on public.delivery_requests;
create policy "Senders manage own delivery requests"
  on public.delivery_requests for all
  using (exists (select 1 from public.profiles p where p.id = sender_id and p.auth_user_id = auth.uid()))
  with check (exists (select 1 from public.profiles p where p.id = sender_id and p.auth_user_id = auth.uid()));

drop policy if exists "Matches are readable" on public.matches;
create policy "Matches are readable"
  on public.matches for select
  using (true);

drop policy if exists "Participants can read conversations" on public.conversations;
create policy "Participants can read conversations"
  on public.conversations for select
  using (
    exists (
      select 1
      from public.conversation_participants cp
      join public.profiles p on p.id = cp.profile_id
      where cp.conversation_id = conversations.id and p.auth_user_id = auth.uid()
    )
  );

drop policy if exists "Participants can read participant rows" on public.conversation_participants;
create policy "Participants can read participant rows"
  on public.conversation_participants for select
  using (
    exists (
      select 1
      from public.conversation_participants cp
      join public.profiles p on p.id = cp.profile_id
      where cp.conversation_id = conversation_participants.conversation_id and p.auth_user_id = auth.uid()
    )
  );

drop policy if exists "Participants can read messages" on public.messages;
create policy "Participants can read messages"
  on public.messages for select
  using (
    exists (
      select 1
      from public.conversation_participants cp
      join public.profiles p on p.id = cp.profile_id
      where cp.conversation_id = messages.conversation_id and p.auth_user_id = auth.uid()
    )
  );

drop policy if exists "Participants can send messages" on public.messages;
create policy "Participants can send messages"
  on public.messages for insert
  with check (
    exists (
      select 1
      from public.conversation_participants cp
      join public.profiles p on p.id = cp.profile_id
      where cp.conversation_id = messages.conversation_id
        and cp.profile_id = messages.sender_id
        and p.auth_user_id = auth.uid()
    )
  );
