// Cloudflare Pages Function: POST /api/writing-subscribe
//
// Captures email signups for /writing notifications.
//
// Storage: Supabase REST (no SDK; just fetch). Adrian confirmed direct
// Supabase writes 2026-05-22. Bind the following as Pages secrets on the
// adrianwatkins-com-preview project:
//
//   SUPABASE_URL                 e.g. https://abcd.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY    service-role key (server-only; never expose)
//
// Table schema (run once in Supabase SQL editor):
//
//   create extension if not exists "pgcrypto";
//
//   create table if not exists public.writing_subscribers (
//     id            uuid primary key default gen_random_uuid(),
//     email         text not null,
//     source        text default '/writing',
//     ip            text,
//     user_agent    text,
//     country       text,
//     created_at    timestamptz not null default now(),
//     confirmed_at  timestamptz,
//     unsubscribed_at timestamptz
//   );
//
//   create unique index if not exists writing_subscribers_email_uniq
//     on public.writing_subscribers (lower(email))
//     where unsubscribed_at is null;
//
// Missing storage configuration returns a failure so visitors are never told
// they subscribed when their details were not saved.

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_FROM?: string;
  CONTACT_TO?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

interface SubscribePayload {
  email?: string;
  source?: string;
  honeypot?: string;
}

const MAX_EMAIL = 320;
const MAX_SOURCE = 200;

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: SubscribePayload;
  try {
    if ((ctx.request.headers.get('content-type') || '').includes('application/json')) {
      body = await ctx.request.json();
    } else {
      const form = await ctx.request.formData();
      body = {
        email: String(form.get('email') || ''),
        source: String(form.get('source') || ''),
        honeypot: String(form.get('company') || ''),
      };
    }
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body) ||
      (['email', 'source', 'honeypot'] as const).some(key => body[key] !== undefined && typeof body[key] !== 'string')) {
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }

  // Honeypot: silently absorb. Return 200 so the bot moves on.
  if (body.honeypot && body.honeypot.length > 0) {
    return json({ ok: true, sent: true });
  }

  const email = (body.email || '').trim().slice(0, MAX_EMAIL).toLowerCase();
  const source = (body.source || '/writing').trim().slice(0, MAX_SOURCE);

  if (!email) return json({ ok: false, error: 'missing_email' }, 400);
  if (!/^[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(email)) {
    return json({ ok: false, error: 'invalid_email' }, 400);
  }

  // Per-IP rate limit hint: take just one signature header. Cloudflare's edge
  // already absorbs the obvious flood. This is for the Supabase row.
  const ip = ctx.request.headers.get('cf-connecting-ip') || '';
  const ua = (ctx.request.headers.get('user-agent') || '').slice(0, 500);
  const country = ctx.request.headers.get('cf-ipcountry') || '';

  const supaUrl = ctx.env.SUPABASE_URL;
  const supaKey = ctx.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supaUrl || !supaKey) {
    console.warn('[writing-subscribe] Storage configuration missing');
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  // Direct Supabase REST insert. Service-role key bypasses RLS, so we don't
  // need any anon-key policy gymnastics. Use Prefer:resolution=ignore-duplicates
  // and on_conflict=email so the same address re-subscribing does not 409.
  // 5s hard cap on the Supabase round-trip: without this, a Supabase outage
  // leaves the visitor's form submission spinning forever (no page to fall
  // back to here, this is a POST endpoint, so the fix is bounding the wait
  // and returning a clear error instead of hanging).
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const endpoint = `${supaUrl.replace(/\/$/, '')}/rest/v1/writing_subscribers?on_conflict=email`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supaKey,
        Authorization: `Bearer ${supaKey}`,
        Prefer: 'resolution=ignore-duplicates,return=representation',
      },
      body: JSON.stringify([
        {
          email,
          source,
          ip,
          user_agent: ua,
          country,
        },
      ]),
      signal: controller.signal,
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      // 409 conflict (already subscribed) is treated as success at the UI
      // layer with a distinct error code so the client can show "you are
      // already on the list".
      if (res.status === 409) {
        return json({ ok: false, error: 'already_subscribed' }, 409);
      }
      console.error('[writing-subscribe] supabase insert failed', res.status, txt);
      return json({ ok: false, error: 'store_failed', status: res.status }, 500);
    }

    const rows = await res.json() as Array<{ id: string; created_at: string }>;
    if (!rows.length) return json({ ok: false, error: 'already_subscribed' }, 409);
    // Storage is the source of truth. Email failure must not undo a signup.
    ctx.waitUntil(notifySignup(ctx.env, rows[0], email, source));
    return json({ ok: true, sent: true, stored: true });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('[writing-subscribe] supabase timeout after 5s');
      return json({ ok: false, error: 'store_timeout' }, 503);
    }
    console.error('[writing-subscribe] supabase exception', err);
    return json({ ok: false, error: 'store_exception' }, 500);
  } finally {
    clearTimeout(timeout);
  }
};

// GET returns method-not-allowed; helps Adrian sanity-check the endpoint with
// a quick curl without it 500ing.
export const onRequestGet: PagesFunction<Env> = async () => {
  return json({ ok: false, error: 'method_not_allowed', allowed: ['POST'] }, 405);
};

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

async function notifySignup(env: Env, row: { id: string; created_at: string }, email: string, source: string) {
  if (!env.RESEND_API_KEY) { console.error('[writing-subscribe] Alert configuration missing'); return; }
  const when = new Date(row.created_at).toLocaleString('en-SG', { timeZone: 'Asia/Singapore', dateStyle: 'medium', timeStyle: 'short' });
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `newsletter-signup/${row.id}` },
        body: JSON.stringify({
          from: env.CONTACT_FROM || 'Adrian Watkins <contact@adrianwatkins.com>',
          to: [env.CONTACT_TO || 'me@adrianwatkins.com'],
          subject: 'New website newsletter signup',
          text: `A new subscriber has joined your website writing list.\n\nEmail: ${email}\nSigned up: ${when} SGT\nSource: ${source}\n\nPrivate signup list: https://supabase.com/dashboard/project/ukacqljogssreycumocn/editor/56028`,
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) return;
      if (response.status < 500 && response.status !== 429) { console.error('[writing-subscribe] Alert rejected', response.status); return; }
    } catch { /* Retry using the same idempotency key. */ }
    if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
  }
  console.error('[writing-subscribe] Alert delivery failed after retries', row.id);
}
