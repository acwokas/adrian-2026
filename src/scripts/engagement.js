// First-party interaction measurement. Never collect form values or URL queries.
(() => {
  if (window.__awTracking) return;
  window.__awTracking = true;
  const production = /^(www\.)?adrianwatkins\.com$/.test(location.hostname);
  const bot = /bot|crawler|spider|headlesschrome|playwright|puppeteer|selenium/i.test(navigator.userAgent);
  const allowed = new Set(['aw_link_click', 'aw_download', 'aw_section_view', 'aw_scroll_depth', 'aw_engaged_read', 'aw_form_start', 'aw_form_submit', 'aw_form_error', 'aw_form_success', 'aw_booking_step', 'aw_menu_toggle', 'aw_share', 'sign_up', 'generate_lead']);
  const parameters = new Set(['link_type', 'link_domain', 'link_path', 'link_label', 'placement', 'section_name', 'percent_scrolled', 'form_name', 'error_type', 'method', 'lead_type', 'booking_step', 'action', 'engagement_time_msec']);
  const clean = value => String(value || '').replace(/[^\s@]+@[^\s@]+/g, '[redacted]').slice(0, 100);
  function track(name, values = {}) {
    if (!production || bot || !allowed.has(name)) return;
    const safe = {send_to: 'G-JSNS9WEB3N', page_path: location.pathname, page_location: location.origin + location.pathname, transport_type: 'beacon'};
    for (const [key, value] of Object.entries(values)) if (parameters.has(key)) safe[key] = typeof value === 'number' ? value : clean(value);
    window.dataLayer = window.dataLayer || [];
    // The Google tag is loaded by GTM. No extra config or page_view here.
    (function () { window.dataLayer.push(arguments); })('event', name, safe);
  }
  window.awTrack = track;
  const sectionName = element => {
    if (element.closest('header')) return 'header';
    if (element.closest('footer')) return 'footer';
    const section = element.closest('section, article, aside');
    return clean(section?.querySelector('h2,h1,h3')?.textContent || section?.id || 'content');
  };
  document.addEventListener('click', event => {
    const element = event.target instanceof Element ? event.target : null;
    if (!element) return;
    const link = element.closest('a[href]');
    if (link) {
      const url = new URL(link.href, location.href);
      const placement = sectionName(link);
      const method = link.closest('.share') ? (url.protocol === 'mailto:' ? 'email' : url.hostname) : null;
      if (method) { track('aw_share', {method, placement}); return; }
      const internal = url.origin === location.origin;
      const download = /\.(pdf|docx?|xlsx?|zip)$/i.test(url.pathname);
      const link_type = url.protocol === 'mailto:' ? 'email' : url.protocol === 'tel:' ? 'phone' : download ? 'download' : internal ? (url.hash ? 'anchor' : 'internal') : 'outbound';
      if (!['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)) return;
      track(download ? 'aw_download' : 'aw_link_click', {
        link_type, placement,
        link_domain: /^https?:$/.test(url.protocol) ? url.hostname : '',
        link_path: /^https?:$/.test(url.protocol) ? url.pathname : '',
        link_label: ['email', 'phone'].includes(link_type) ? link_type : clean(link.textContent.trim() || link.getAttribute('aria-label') || link.querySelector('img')?.alt),
      });
      return;
    }
    const button = element.closest('button');
    if (button?.matches('.nav-toggle')) track('aw_menu_toggle', {action: button.getAttribute('aria-expanded') === 'true' ? 'close' : 'open'});
    if (button?.matches('.share-copy')) track('aw_share', {method:'copy_link',placement:sectionName(button)});
  }, true);
  const started = new WeakSet();
  const formName = form => form.id === 'contact-form' ? 'contact' : form.getAttribute('action') === '/api/writing-subscribe' ? 'newsletter' : null;
  document.addEventListener('focusin', event => {
    const form = event.target instanceof Element ? event.target.closest('form') : null;
    if (!form || !formName(form) || started.has(form)) return;
    started.add(form); track('aw_form_start', {form_name:formName(form),placement:sectionName(form)});
  });
  const invalidTimes = new WeakMap();
  document.addEventListener('invalid', event => {
    const form = event.target.form;
    if (!form || !formName(form) || Date.now() - (invalidTimes.get(form) || 0) < 1000) return;
    invalidTimes.set(form,Date.now());track('aw_form_error',{form_name:formName(form),error_type:'validation'});
  },true);
  document.addEventListener('submit',event=>{const form=event.target;if(form instanceof HTMLFormElement && formName(form))track('aw_form_submit',{form_name:formName(form),placement:sectionName(form)});},true);
  const seen = new Set();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const name = clean(entry.target.textContent);
      if (!seen.has(name)) { seen.add(name); track('aw_section_view', {section_name:name}); }
      observer.unobserve(entry.target);
    }), {threshold: 0.5});
    document.querySelectorAll('main h1, main h2, main .work-feature h3').forEach(el=>observer.observe(el));
  }
  const depths = new Set(); let ticking = false;
  const scroll = () => {
    ticking=false;const height=document.documentElement.scrollHeight-innerHeight;
    if(height<=0)return;
    const progress=Math.round(scrollY/height*100);
    for(const depth of [25,50,75,90])if(progress>=depth&&!depths.has(depth)){depths.add(depth);track('aw_scroll_depth',{percent_scrolled:depth});}
  };
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(scroll);}},{passive:true});
  let active=0;const timer=setInterval(()=>{if(document.visibilityState==='visible')active+=1000;if(active>=30000){track('aw_engaged_read',{engagement_time_msec:30000});clearInterval(timer);}},1000);
  const bookingSeen=new Set();
  addEventListener('message',event=>{
    if(event.origin!=='https://calendly.com')return;
    const frame=[...document.querySelectorAll('iframe')].find(f=>f.contentWindow===event.source && new URL(f.src,location.href).hostname==='calendly.com');
    if(!frame)return;
    const name=event.data?.event;
    const steps={'calendly.profile_page_viewed':'profile','calendly.event_type_viewed':'event_type','calendly.date_and_time_selected':'time_selected','calendly.event_scheduled':'scheduled'};
    if(!steps[name]||bookingSeen.has(name))return;
    bookingSeen.add(name);track('aw_booking_step',{booking_step:steps[name]});
    if(name==='calendly.event_scheduled')track('generate_lead',{lead_type:'booking',method:'calendly'});
  });
})();
