// Cloudflare Pages Function: POST /api/contact
// Sends contact form submissions via Resend if RESEND_API_KEY is bound,
// otherwise logs to the console and returns success so the form still works.
// Bind RESEND_API_KEY as a Pages secret to activate live sending.

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_FROM?: string;
  CONTACT_TO?: string;
}

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  honeypot?: string;
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: ContactPayload;
  try {
    body = await ctx.request.json();
  } catch {
    return json({ ok: false, error: 'Bad JSON body.' }, 400);
  }

  if (body.honeypot && body.honeypot.length > 0) {
    return json({ ok: true, sent: false, reason: 'honeypot' });
  }

  const name = (body.name || '').trim().slice(0, 200);
  const email = (body.email || '').trim().slice(0, 320);
  const message = (body.message || '').trim().slice(0, 8000);

  if (!name || !email || !message) {
    return json({ ok: false, error: 'name, email, and message are required.' }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'Email address looks invalid.' }, 400);
  }

  const apiKey = ctx.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('[contact] RESEND_API_KEY not bound, stubbing send:', { name, email, length: message.length });
    return json({ ok: true, sent: false, reason: 'stub' });
  }

  const from = ctx.env.CONTACT_FROM || 'website@adrianwatkins.com';
  const to = ctx.env.CONTACT_TO || 'me@adrianwatkins.com';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `adrianwatkins.com contact: ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[contact] Resend send failed', res.status, text);
    return json({ ok: false, error: 'Send failed. Please email me directly.' }, 502);
  }

  return json({ ok: true, sent: true });
};

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
