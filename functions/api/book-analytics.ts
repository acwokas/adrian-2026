// Read-only reporting is private. This public endpoint can only append validated book events.
interface Env { SUPABASE_URL?: string; SUPABASE_SERVICE_ROLE_KEY?: string }
const PATH = '/writing/heir-presumptive';
const HOSTS = new Set(['adrianwatkins.com','www.adrianwatkins.com']);
const EVENTS = new Set(['page_view','book_view','book_read_start','book_read_progress','book_engaged_read','book_signup']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const buckets = new Map<string,{count:number;until:number}>();
const reply = (status = 204) => new Response(null,{status,headers:{'Cache-Control':'no-store'}});
export const onRequestGet: PagesFunction<Env> = async () => reply(405);
export const onRequestPost: PagesFunction<Env> = async ({request,env}) => {
  const url = new URL(request.url);
  if (!HOSTS.has(url.hostname) || request.headers.get('origin') !== url.origin || request.headers.get('sec-fetch-site') === 'cross-site') return reply(403);
  if (request.headers.get('sec-gpc') === '1' || request.headers.get('dnt') === '1') return reply();
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply(415);
  const ua = request.headers.get('user-agent') || '';
  if (!ua || /bot|crawler|spider|headlesschrome|playwright|puppeteer|selenium/i.test(ua)) return reply();
  let data;
  try {
    const reader = request.body?.getReader(); if (!reader) return reply(400);
    let bytes = 0, raw = ''; const decoder = new TextDecoder();
    while (true) { const {done,value} = await reader.read(); if (done) break; bytes += value.length; if(bytes > 2048) {await reader.cancel();return reply(413);} raw += decoder.decode(value,{stream:true}); }
    data = JSON.parse(raw + decoder.decode());
  } catch { return reply(400); }
  if (!data || typeof data !== 'object' || Array.isArray(data) || typeof data.event_id !== 'string' || typeof data.visitor_id !== 'string' || !UUID.test(data.event_id) || !UUID.test(data.visitor_id)
    || !EVENTS.has(data.event_type) || data.page_path !== PATH || typeof data.test_traffic !== 'boolean') return reply(400);
  const tag = (v:unknown) => typeof v === 'string' && /^[a-z0-9][a-z0-9_-]{0,63}$/i.test(v) ? v : null;
  const tags = {utm_source:tag(data.utm_source),utm_medium:tag(data.utm_medium),utm_campaign:tag(data.utm_campaign)};
  const taggedTest = Object.values(tags).some(v => v && /(^|[-_])(qa|test|preview|automation)([-_]|$)/i.test(v));
  const isTest = data.test_traffic === true || taggedTest;
  const now = Date.now();
  for (const [id,b] of buckets) if (b.until <= now) buckets.delete(id);
  const b = buckets.get(data.visitor_id) || {count:0,until:now+60000};
  if (b.count >= 60 || (!buckets.has(data.visitor_id) && buckets.size >= 5000)) return reply(429);
  b.count++; buckets.set(data.visitor_id,b);
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return reply(503);
  let referrer_domain = null;
  if (typeof data.referrer === 'string' && /^[a-z0-9.-]{1,253}$/i.test(data.referrer) && /[a-z]/i.test(data.referrer) && data.referrer.includes('.') && !/\.local$|\.internal$|^localhost$/i.test(data.referrer)) referrer_domain = data.referrer.toLowerCase().replace(/^www\./,'');
  const number = (v:unknown,max:number) => typeof v === 'number' && Number.isFinite(v) ? Math.max(0,Math.min(max,Math.round(v))) : null;
  const row = {event_id:data.event_id,visitor_id:data.visitor_id,event_type:data.event_type,page_path:PATH,
    hostname:url.hostname,site:'adrianwatkins',test_traffic:isTest,traffic_classification:isTest ? 'flagged_test' : 'unflagged_browser',
    referrer_domain,...tags,percent_scrolled:number(data.percent_scrolled,100),engagement_time_msec:number(data.engagement_time_msec,1800000)};
  try {
    const response = await fetch(`${env.SUPABASE_URL.replace(/\/$/,'')}/rest/v1/heir_analytics_events?on_conflict=event_id`,{
      method:'POST',headers:{'Content-Type':'application/json',apikey:env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,Prefer:'resolution=ignore-duplicates,return=minimal'},
      body:JSON.stringify(row),signal:AbortSignal.timeout(5000)});
    if (!response.ok) {console.error('book_analytics_write_failed',response.status);return reply(503);}
    return reply();
  } catch {console.error('book_analytics_write_failed','network');return reply(503);}
};
