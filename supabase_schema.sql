-- =============================================================================
-- CDAC CCAT Platform — Supabase Schema
-- IDEMPOTENT: safe to re-run. Drops existing policies before recreating them.
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. USERS TABLE (extends Supabase Auth)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.users (
  id                uuid references auth.users on delete cascade primary key,
  email             text unique,
  is_premium        boolean default false,
  premium_expires_at timestamp with time zone,
  created_at        timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.users enable row level security;

-- Drop existing policies (idempotent)
drop policy if exists "Users can view their own data."   on public.users;
drop policy if exists "Users can update their own data." on public.users;
drop policy if exists "Users can view own data"          on public.users;
drop policy if exists "Users can update own data"        on public.users;
drop policy if exists "Users can insert own row"         on public.users;

create policy "Users can view own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can insert own row"
  on public.users for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update own data"
  on public.users for update
  using (auth.uid() = id);


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. MOCK TESTS TABLE
--    questions JSONB structure: { "sectionA": [...], "sectionB": [...] }
--    Free tests  → sectionB = []
--    Premium tests → sectionA (50 Qs) + sectionB (50 Qs)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.mock_tests (
  id         uuid default gen_random_uuid() primary key,
  title      text not null,
  type       text check (type in ('free', 'premium')) not null,
  duration   integer not null,     -- in minutes
  questions  jsonb not null,       -- { "sectionA": [...], "sectionB": [...] }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.mock_tests enable row level security;

-- Drop existing policies
drop policy if exists "Free tests are readable by authenticated users"  on public.mock_tests;
drop policy if exists "Premium tests are readable by premium users only" on public.mock_tests;
drop policy if exists "Premium users can read premium tests" on public.mock_tests;
drop policy if exists "Anyone can read mock tests"                       on public.mock_tests;
drop policy if exists "Authenticated users can read free tests"          on public.mock_tests;

-- Free tests: any logged-in user can read (questions included)
create policy "Authenticated users can read free tests"
  on public.mock_tests for select
  to authenticated
  using (type = 'free');

-- Premium tests: only users with is_premium = true can read
create policy "Premium users can read premium tests"
  on public.mock_tests for select
  to authenticated
  using (
    type = 'premium'
    and exists (
      select 1 from public.users
      where id = auth.uid()
        and is_premium = true
    )
  );

-- No public INSERT / UPDATE / DELETE — only service role (admin) can write


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. RESULTS TABLE
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.results (
  id              uuid default gen_random_uuid() primary key,
  user_id         uuid references auth.users on delete cascade not null,
  test_id         uuid references public.mock_tests on delete cascade not null,
  score           integer not null,          -- percentage (0-100)
  total_questions integer not null,
  correct_answers integer not null,
  accuracy        integer not null default 0,
  time_taken      integer not null,          -- seconds
  created_at      timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.results enable row level security;

drop policy if exists "Users can insert their own results" on public.results;
drop policy if exists "Users can view their own results"  on public.results;
drop policy if exists "Users can insert own results"      on public.results;
drop policy if exists "Users can view own results"        on public.results;

create policy "Users can insert own results"
  on public.results for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can view own results"
  on public.results for select
  to authenticated
  using (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. PAYMENTS TABLE
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.payments (
  id             uuid default gen_random_uuid() primary key,
  user_id        uuid references auth.users on delete cascade not null,
  transaction_id text unique not null,
  status         text check (status in ('pending', 'approved', 'rejected')) default 'pending' not null,
  created_at     timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.payments enable row level security;

drop policy if exists "Users can insert their own payments" on public.payments;
drop policy if exists "Users can view their own payments"  on public.payments;
drop policy if exists "Users can insert own payments"      on public.payments;
drop policy if exists "Users can view own payments"        on public.payments;

create policy "Users can insert own payments"
  on public.payments for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can view own payments"
  on public.payments for select
  to authenticated
  using (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. AUTO-SYNC: create users row on Supabase Auth signup
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;   -- safe if already exists
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger only if it doesn't already exist
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end $$;
