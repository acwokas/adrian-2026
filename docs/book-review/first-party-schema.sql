-- Apply only after production approval, to the existing personal-site project.
-- No public table access and no changes to shared analytics/subscriber tables.
create table public.heir_analytics_events (
  event_id uuid primary key,
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  site text not null check (site = 'adrianwatkins'),
  hostname text not null check (hostname in ('adrianwatkins.com','www.adrianwatkins.com')),
  page_path text not null check (page_path = '/writing/heir-presumptive'),
  event_type text not null check (event_type in ('page_view','book_view','book_read_start','book_read_progress','book_engaged_read','book_signup')),
  test_traffic boolean not null default false,
  traffic_classification text not null check (traffic_classification in ('unflagged_browser','flagged_test')),
  constraint heir_test_classification_consistent check (test_traffic = (traffic_classification = 'flagged_test')),
  referrer_domain text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  percent_scrolled integer check (percent_scrolled between 0 and 100),
  engagement_time_msec integer check (engagement_time_msec between 0 and 1800000)
);
alter table public.heir_analytics_events enable row level security;
revoke all on public.heir_analytics_events from public, anon, authenticated;
grant select, insert on public.heir_analytics_events to service_role;
create index heir_analytics_reporting_idx on public.heir_analytics_events (event_type, created_at, visitor_id);
