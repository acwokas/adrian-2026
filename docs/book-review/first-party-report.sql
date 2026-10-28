-- READ ONLY. Default report is yesterday in Singapore; no daily-unique summation.
with bounds as (
 select ((now() at time zone 'Asia/Singapore')::date - 1)::timestamp at time zone 'Asia/Singapore' as day_start,
        ((now() at time zone 'Asia/Singapore')::date)::timestamp at time zone 'Asia/Singapore' as day_end
), scoped as (
 select e.* from public.heir_analytics_events e, bounds b
 where e.site='adrianwatkins' and e.hostname in ('adrianwatkins.com','www.adrianwatkins.com')
 and e.page_path='/writing/heir-presumptive' and e.event_type='page_view'
 and e.test_traffic=false and e.traffic_classification='unflagged_browser' and e.created_at < b.day_end
)
select min(created_at) as earliest_observed_at,
       count(*) as cumulative_page_views,
       count(distinct visitor_id) as cumulative_browser_users,
       count(*) filter (where created_at >= (select day_start from bounds)) as yesterday_page_views,
       count(distinct visitor_id) filter (where created_at >= (select day_start from bounds)) as yesterday_browser_users,
       max(created_at) as newest_in_range
from scoped;

-- Page referrers, NOT full acquisition attribution. Internal referrals remain labelled.
with bounds as (
 select ((now() at time zone 'Asia/Singapore')::date - 1)::timestamp at time zone 'Asia/Singapore' as day_start,
        ((now() at time zone 'Asia/Singapore')::date)::timestamp at time zone 'Asia/Singapore' as day_end
)
select case when referrer_domain in ('adrianwatkins.com','www.adrianwatkins.com') then 'internal'
            when referrer_domain is null then 'unrecorded' else referrer_domain end as referrer,
       count(*) as cumulative_views,
       count(*) filter (where created_at >= (select day_start from bounds)) as yesterday_views
from public.heir_analytics_events, bounds
where site='adrianwatkins' and hostname in ('adrianwatkins.com','www.adrianwatkins.com')
  and page_path='/writing/heir-presumptive' and event_type='page_view'
  and test_traffic=false and traffic_classification='unflagged_browser' and created_at < bounds.day_end
group by 1 order by cumulative_views desc;

-- Freshness is evidence of recent rows, not completeness or availability throughout a range.
select max(created_at) as newest_all_event_ingestion_at,
       max(created_at) filter (where test_traffic=false and traffic_classification='unflagged_browser') as newest_audience_event_at
from public.heir_analytics_events;

-- Campaign tags observed on the page, not GA4 session attribution.
with bounds as (
 select ((now() at time zone 'Asia/Singapore')::date - 1)::timestamp at time zone 'Asia/Singapore' as day_start,
        ((now() at time zone 'Asia/Singapore')::date)::timestamp at time zone 'Asia/Singapore' as day_end
)
select coalesce(utm_source,'unrecorded') as source, coalesce(utm_medium,'unrecorded') as medium,
       coalesce(utm_campaign,'unrecorded') as campaign,
       count(*) as cumulative_views,
       count(*) filter (where created_at >= bounds.day_start) as yesterday_views
from public.heir_analytics_events, bounds
where site='adrianwatkins' and hostname in ('adrianwatkins.com','www.adrianwatkins.com')
  and page_path='/writing/heir-presumptive' and event_type='page_view'
  and test_traffic=false and traffic_classification='unflagged_browser' and created_at < bounds.day_end
group by 1,2,3 order by cumulative_views desc;
