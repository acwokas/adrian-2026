// Book-only, first-party observations. GA4 remains independent.
(() => {
  if (window.__awBookAnalytics) return;
  window.__awBookAnalytics = true;
  const path = '/writing/heir-presumptive';
  const key = 'aw_book_visitor_v1';
  const get = k => { try { return localStorage.getItem(k); } catch { return null; } };
  const test = () => new URLSearchParams(location.search).get('analytics_test') === '1' || get('aw_analytics_test') === '1';
  const blocked = () => !/^(www\.)?adrianwatkins\.com$/.test(location.hostname)
    || location.pathname.replace(/\/$/, '') !== path || test()
    || navigator.globalPrivacyControl === true || navigator.doNotTrack === '1'
    || navigator.webdriver === true || /bot|crawler|spider|headlesschrome|playwright|puppeteer|selenium/i.test(navigator.userAgent)
    || get('aw_analytics_optout') === '1';
  const events = new Set(['page_view','book_view','book_read_start','book_read_progress','book_engaged_read','book_signup']);
  let visitor;
  const identity = () => {
    if (visitor) return visitor;
    try {
      const old = JSON.parse(get(key) || 'null');
      visitor = old && typeof old.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(old.id) && Number.isFinite(old.last) && old.last <= Date.now() && Date.now() - old.last < 365 * 86400000 ? old.id : crypto.randomUUID();
      localStorage.setItem(key, JSON.stringify({id:visitor,last:Date.now()}));
    } catch { visitor = crypto.randomUUID(); }
    return visitor;
  };
  const token = value => typeof value === 'string' && /^[a-z0-9][a-z0-9_-]{0,63}$/i.test(value) ? value : null;
  window.awBookTrack = (event, values = {}) => {
    if (blocked() || !events.has(event)) return;
    try {
      const params = new URLSearchParams(location.search);
      const tags = Object.fromEntries(['source','medium','campaign'].map(k => ['utm_' + k, token(params.get('utm_' + k))]));
      if (Object.values(tags).some(v => v && /(^|[-_])(qa|test|preview|automation)([-_]|$)/i.test(v))) return;
      let referrer = null;
      try { referrer = document.referrer ? new URL(document.referrer).hostname : null; if (referrer && (!/[a-z]/i.test(referrer) || !referrer.includes('.') || /:|\.local$|\.internal$|^localhost$/i.test(referrer))) referrer = null; } catch {}
      const body = {event_id:crypto.randomUUID(),visitor_id:identity(),event_type:event,page_path:path,test_traffic:false,referrer,...tags};
      for (const [k, max] of [['percent_scrolled',100],['engagement_time_msec',1800000]]) {
        if (typeof values[k] === 'number' && Number.isFinite(values[k])) body[k] = Math.max(0,Math.min(max,Math.round(values[k])));
      }
      // No automatic retry after uncertain delivery. Stable event ID allows server deduplication.
      fetch('/api/book-analytics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),keepalive:true,credentials:'omit'}).catch(()=>{});
    } catch { /* Measurement never blocks the book. */ }
  };
  window.awBookTrack('page_view');
})();
