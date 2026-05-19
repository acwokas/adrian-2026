// Cloudflare Pages Function: POST /api/contact
// Wires the contact form to Resend. Sends two emails per submission:
//   1. Notification to Adrian (replyTo = submitter so reply lands back)
//   2. Auto-reply to the submitter confirming receipt
// RESEND_API_KEY must be bound as a Pages secret. If missing, returns 503.

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

const DEFAULT_FROM = 'Adrian Watkins <contact@adrianwatkins.com>';
const DEFAULT_TO = 'me@adrianwatkins.com';

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: ContactPayload;
  try {
    body = await ctx.request.json();
  } catch {
    return json({ ok: false, error: 'bad_json' }, 400);
  }

  // Honeypot: silently absorb. Return success so the bot moves on.
  if (body.honeypot && body.honeypot.length > 0) {
    return json({ ok: true, sent: true });
  }

  const name = (body.name || '').trim().slice(0, 200);
  const email = (body.email || '').trim().slice(0, 320);
  const message = (body.message || '').trim().slice(0, 8000);

  if (!name || !email || !message) {
    return json({ ok: false, error: 'missing_fields' }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'invalid_email' }, 400);
  }

  // Lightweight spam heuristics: drop silently. The submitter sees success;
  // nothing actually sends. We do not want to give bots a 4xx signal.
  const urlCount = (message.match(/https?:\/\//gi) || []).length;
  const tooShort = message.length < 20;
  if (urlCount >= 2 || tooShort) {
    console.log('[contact] spam heuristic drop', { urlCount, len: message.length, email });
    return json({ ok: true, sent: true });
  }

  const apiKey = ctx.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY not bound');
    return json({ ok: false, error: 'resend_not_configured' }, 503);
  }

  const from = ctx.env.CONTACT_FROM || DEFAULT_FROM;
  const to = ctx.env.CONTACT_TO || DEFAULT_TO;

  // 1. Notification to Adrian
  const notifyRes = await sendEmail(apiKey, {
    from,
    to: [to],
    reply_to: email,
    subject: `Contact form: ${name} (${email})`,
    text: [
      `Reply directly to ${email} and the response will land back with the sender.`,
      '',
      `Name:    ${name}`,
      `Email:   ${email}`,
      '',
      'Message:',
      message,
      '',
      '---',
      'adrianwatkins.com contact form.',
    ].join('\n'),
  });

  if (!notifyRes.ok) {
    console.error('[contact] notify send failed', notifyRes.status, notifyRes.body);
    return json({ ok: false, error: 'send_failed', status: notifyRes.status }, 500);
  }

  // 2. Auto-reply to the submitter
  const autoRes = await sendEmail(apiKey, {
    from,
    to: [email],
    subject: 'Thanks for getting in touch. Adrian Watkins.',
    text: [
      `Hi ${name.split(/\s+/)[0]},`,
      '',
      'Thanks for your message. It has landed in my inbox.',
      '',
      'I typically respond within two business days. Singapore-based, available across Asia-Pacific time zones.',
      '',
      'In the meantime, the EDGE Framework whitepaper is at https://adrianwatkins.com/documents/EDGE-Framework-Whitepaper.pdf',
      '',
      'Speak soon.',
      '',
      'Adrian',
      '',
      '---',
      'This is an automated acknowledgement. Replying to it is fine; it routes to my inbox.',
    ].join('\n'),
  });

  if (!autoRes.ok) {
    // Notification already sent. Surface but do not 500 the request.
    console.error('[contact] auto-reply failed', autoRes.status, autoRes.body);
    return json({ ok: true, sent: true, autoReplyFailed: true, autoReplyStatus: autoRes.status });
  }

  return json({ ok: true, sent: true });
};

interface SendArgs {
  from: string;
  to: string[];
  subject: string;
  text: string;
  reply_to?: string;
}

async function sendEmail(
  apiKey: string,
  args: SendArgs
): Promise<{ ok: boolean; status: number; body: string }> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  const text = await res.text().catch(() => '');
  return { ok: res.ok, status: res.status, body: text };
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
