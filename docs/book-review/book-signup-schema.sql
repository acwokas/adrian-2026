-- Applied after explicit release approval, 23 October 2026, personal-site project ukacqljogssreycumocn.
-- Private book-only list. Do not include this table in general writing mailings.
create table public.heir_presumptive_subscribers (
 email text primary key check (email = lower(email)),
 created_at timestamptz not null default now(),
 consent_at timestamptz not null,
 consent_version text not null check (consent_version = 'heir-presumptive-book-only-v1'),
 source text not null check (source = '/writing/heir-presumptive'),
 unsubscribed_at timestamptz
);
alter table public.heir_presumptive_subscribers enable row level security;
revoke all on public.heir_presumptive_subscribers from public, anon, authenticated;
revoke all on public.heir_presumptive_subscribers from service_role;
grant select, insert, update on public.heir_presumptive_subscribers to service_role;
comment on table public.heir_presumptive_subscribers is 'Explicit consent for Heir Presumptive only. Never merge with writing_subscribers. Filter unsubscribed_at IS NULL before any approved book mailing.';
