-- Схема для будущего подключения базы данных (Auth, Database, Realtime)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'tutor',
  avatar_url text
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  telegram text,
  subject text,
  source text,
  status text not null default 'new' check (status in ('new','contacted','trial','paid','lost')),
  created_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  date date not null,
  time time not null,
  status text not null default 'planned' check (status in ('planned','done','cancelled')),
  price numeric(10,2) not null default 0,
  paid boolean not null default false
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  sender_id uuid references auth.users(id),
  text text,
  file_url text,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lessons enable row level security;
alter table public.messages enable row level security;

create policy "own profile" on public.profiles for all using (auth.uid() = id);
create policy "own leads" on public.leads for all using (auth.uid() = owner_id);
create policy "own lessons" on public.lessons for all using (auth.uid() = owner_id);
create policy "own messages" on public.messages for all
  using (exists (select 1 from public.leads l where l.id = lead_id and l.owner_id = auth.uid()));

alter publication supabase_realtime add table public.messages;
