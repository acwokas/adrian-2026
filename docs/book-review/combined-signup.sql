begin;
alter table public.heir_presumptive_subscribers drop constraint heir_presumptive_subscribers_consent_version_check;
alter table public.heir_presumptive_subscribers add constraint heir_presumptive_subscribers_consent_version_check check(consent_version in ('heir-presumptive-book-only-v1','heir-presumptive-and-writing-v2'));
create or replace function public.subscribe_heir_presumptive(subscriber_email text, consent_wording text) returns void language plpgsql security invoker set search_path='' as $$
begin
 if consent_wording not in ('heir-presumptive-book-only-v1','heir-presumptive-and-writing-v2') or consent_wording is null then raise exception 'Invalid consent'; end if;
 insert into public.heir_presumptive_subscribers(email,consent_at,consent_version,source,unsubscribed_at)
 values(lower(trim(subscriber_email)),now(),consent_wording,'/writing/heir-presumptive',null)
 on conflict(email) do update set consent_at=excluded.consent_at,consent_version=excluded.consent_version,unsubscribed_at=null;
 if consent_wording='heir-presumptive-and-writing-v2' then
 insert into public.writing_subscribers(email,source)
 values(lower(trim(subscriber_email)),'/writing/heir-presumptive')
 on conflict(email) do update set unsubscribed_at=null;
 end if;
end;
$$;
revoke all on function public.subscribe_heir_presumptive(text,text) from public,anon,authenticated;
grant execute on function public.subscribe_heir_presumptive(text,text) to service_role;
comment on table public.heir_presumptive_subscribers is 'Versioned consent: v1 book-only; v2 book plus Friday Frame and occasional writing updates. Preserve existing consent. Filter unsubscribed_at IS NULL before approved mailings.';
commit;
