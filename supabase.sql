-- DOGEBOT PACK shared backend schema.
-- Run this once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 24),
  text text not null check (char_length(text) between 1 and 500),
  client_id text not null,
  likes integer not null default 0 check (likes >= 0),
  status text not null default 'published' check (status in ('pending', 'published', 'approved', 'rejected')),
  moderation_reason text,
  created_at timestamptz not null default now()
);

create index if not exists forum_posts_feed_idx on public.forum_posts (status, created_at desc);

create table if not exists public.memes (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text not null check (char_length(caption) between 1 and 96),
  client_id text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  moderation_reason text,
  created_at timestamptz not null default now()
);

create index if not exists memes_feed_idx on public.memes (status, created_at desc);

create table if not exists public.meme_votes (
  meme_id uuid not null references public.memes(id) on delete cascade,
  client_id text not null,
  created_at timestamptz not null default now(),
  primary key (meme_id, client_id)
);

create index if not exists meme_votes_feed_idx on public.meme_votes (meme_id, created_at desc);

create table if not exists public.agent_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  body text not null check (char_length(body) between 1 and 1500),
  source text not null default 'DOGEBOT PACK Agent',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  moderation_reason text,
  created_at timestamptz not null default now()
);

create index if not exists agent_updates_feed_idx on public.agent_updates (status, created_at desc);

create table if not exists public.rate_limits (
  scope_key text primary key,
  window_started_at timestamptz not null default now(),
  hit_count integer not null default 0
);

create or replace function public.check_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_hits integer;
begin
  insert into public.rate_limits(scope_key, window_started_at, hit_count)
  values (p_key, now(), 1)
  on conflict (scope_key) do update set
    hit_count = case
      when extract(epoch from (now() - public.rate_limits.window_started_at)) >= p_window_seconds then 1
      else public.rate_limits.hit_count + 1
    end,
    window_started_at = case
      when extract(epoch from (now() - public.rate_limits.window_started_at)) >= p_window_seconds then now()
      else public.rate_limits.window_started_at
    end
  returning hit_count into current_hits;
  return current_hits <= p_limit;
end;
$$;

alter table public.forum_posts enable row level security;
alter table public.memes enable row level security;
alter table public.meme_votes enable row level security;
alter table public.rate_limits enable row level security;
alter table public.agent_updates enable row level security;

insert into storage.buckets (id, name, public)
values ('dogebot-memes', 'dogebot-memes', true)
on conflict (id) do nothing;

-- The API uses SUPABASE_SERVICE_ROLE_KEY, so no public table policies are needed.
-- Public visitors can read approved content only through the Vercel API.
