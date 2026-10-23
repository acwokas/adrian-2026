// Versioned consent: cached v1 forms stay book-only; v2 explicitly includes writing updates.
// Release prerequisite: apply and verify docs/book-review/book-signup-schema.sql.
interface Env { SUPABASE_URL?: string; SUPABASE_SERVICE_ROLE_KEY?: string }
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {status, headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
export const onRequestGet: PagesFunction<Env> = async () => json({ok:false,error:'method_not_allowed'},405);
export const onRequestPost: PagesFunction<Env> = async ({request, env}) => {
 const origin = request.headers.get('origin');
 if (origin && origin !== new URL(request.url).origin) return json({ok:false,error:'invalid_origin'},403);
 if (!request.headers.get('content-type')?.includes('application/json')) return json({ok:false,error:'invalid_content_type'},415);
 let data;
 try { const raw = await request.text(); if(raw.length > 2048) return json({ok:false,error:'too_large'},413); data = JSON.parse(raw); }
 catch { return json({ok:false,error:'bad_request'},400); }
 if (!data || typeof data !== 'object' || Array.isArray(data) || typeof data.email !== 'string' || (data.honeypot !== undefined && typeof data.honeypot !== 'string')) return json({ok:false,error:'invalid_fields'},400);
 if (data.honeypot) return json({ok:true});
 if (data.consent !== true) return json({ok:false,error:'consent_required'},400);
 const consentVersion = data.consentVersion ?? 'heir-presumptive-book-only-v1';
 if (!['heir-presumptive-book-only-v1','heir-presumptive-and-writing-v2'].includes(consentVersion)) return json({ok:false,error:'invalid_consent_version'},400);
 const email = data.email.trim().toLowerCase();
 if (email.length > 320 || !/^[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(email)) return json({ok:false,error:'invalid_email'},400);
 if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return json({ok:false,error:'not_configured'},503);
 try {
  const response = await fetch(`${env.SUPABASE_URL.replace(/\/$/,'')}/rest/v1/rpc/subscribe_heir_presumptive`, {
   method:'POST', headers:{'Content-Type':'application/json',apikey:env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,Prefer:'resolution=merge-duplicates,return=minimal'},
   body:JSON.stringify({subscriber_email:email,consent_wording:consentVersion}),signal:AbortSignal.timeout(10000)
  });
  if (!response.ok) { console.error('[book-subscribe] storage status',response.status); return json({ok:false,error:'not_saved'},503); }
  return json({ok:true});
 } catch { return json({ok:false,error:'not_saved'},503); }
};
