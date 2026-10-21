-- Private project inquiry dashboard schema.
-- Run this once in the Supabase SQL Editor before deploying the Vercel functions.

create extension if not exists pgcrypto;

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.project_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  company text not null default '',
  website text not null default '',
  service text not null,
  budget text not null,
  timeline text not null,
  description text not null,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'in_progress', 'completed')),
  checklist jsonb not null default '{
    "replied": false,
    "requirements_confirmed": false,
    "proposal_sent": false,
    "work_started": false,
    "delivered": false
  }'::jsonb
);

create table if not exists public.inquiry_submission_limits (
  ip_hash text primary key,
  window_started_at timestamptz not null default now(),
  submission_count integer not null default 0 check (submission_count >= 0)
);

create index if not exists project_inquiries_created_at_idx
  on public.project_inquiries (created_at desc);
create index if not exists inquiry_submission_limits_window_idx
  on public.inquiry_submission_limits (window_started_at);

-- The browser never queries these tables directly. Only the Vercel API uses
-- the server-only service role key, after checking the signed-in user against
-- portfolio_admins. RLS remains enabled as defense in depth.
alter table public.portfolio_admins enable row level security;
alter table public.project_inquiries enable row level security;
alter table public.inquiry_submission_limits enable row level security;

revoke all on public.portfolio_admins from anon, authenticated;
revoke all on public.project_inquiries from anon, authenticated;
revoke all on public.inquiry_submission_limits from anon, authenticated;
grant all on public.portfolio_admins to service_role;
grant all on public.project_inquiries to service_role;

create or replace function public.submit_project_inquiry(
  p_ip_hash text,
  p_name text,
  p_email text,
  p_phone text,
  p_company text,
  p_website text,
  p_service text,
  p_budget text,
  p_timeline text,
  p_description text
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_submission_count integer;
  v_inquiry_id uuid;
begin
  delete from public.inquiry_submission_limits
  where window_started_at < pg_catalog.now() - interval '1 day';

  insert into public.inquiry_submission_limits (ip_hash, window_started_at, submission_count)
  values (p_ip_hash, pg_catalog.now(), 1)
  on conflict (ip_hash) do update set
    window_started_at = case
      when public.inquiry_submission_limits.window_started_at <= pg_catalog.now() - interval '1 hour' then pg_catalog.now()
      else public.inquiry_submission_limits.window_started_at
    end,
    submission_count = case
      when public.inquiry_submission_limits.window_started_at <= pg_catalog.now() - interval '1 hour' then 1
      else public.inquiry_submission_limits.submission_count + 1
    end
  returning submission_count into v_submission_count;

  if v_submission_count > 5 then
    raise exception 'Inquiry submission rate limit exceeded.' using errcode = 'P0001';
  end if;

  insert into public.project_inquiries (
    name, email, phone, company, website, service, budget, timeline, description
  ) values (
    p_name, p_email, p_phone, p_company, p_website, p_service, p_budget, p_timeline, p_description
  ) returning id into v_inquiry_id;

  return v_inquiry_id;
end;
$$;

revoke all on function public.submit_project_inquiry(text, text, text, text, text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.submit_project_inquiry(text, text, text, text, text, text, text, text, text, text) to service_role;
