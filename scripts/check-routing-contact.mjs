import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
async function moduleAt(path) {
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}
const { onRequest } = await moduleAt('functions/_middleware.ts');
for (const path of ['/not-a-real-page', '/singapore-misspelt', '/missing/image.png']) {
  const res = await onRequest({ request: new Request(`https://adrianwatkins.com${path}`), next: async () => new Response('Missing', { status: 404 }) });
  assert.equal(res.status, 404);
  assert.equal(res.headers.get('location'), null);
}
const page = await onRequest({ request: new Request('https://adrianwatkins.com/singapore'), next: async () => new Response('Singapore') });
assert.equal(page.status, 200);
assert.equal(page.headers.get('x-robots-tag'), null);
for (const status of [200, 304]) {
  const cv = await onRequest({ request: new Request('https://adrianwatkins.com/documents/AdrianWatkins_Executive-CV.pdf'), next: async () => new Response(status === 304 ? null : 'PDF', { status }) });
  assert.equal(cv.status, status);
  assert.match(cv.headers.get('cache-control'), /max-age=300/);
}
const alias = await onRequest({ request: new Request('https://branch.example.pages.dev/'), next: async () => new Response('Preview') });
assert.equal(alias.headers.get('x-robots-tag'), 'noindex, nofollow');
const robots = await onRequest({ request: new Request('https://example.pages.dev/robots.txt') });
assert.match(await robots.text(), /Allow: \//);
const sitemap = await onRequest({ request: new Request('https://adrianwatkins.com/sitemap.xml') });
assert.equal(sitemap.status, 301);
assert.equal(sitemap.headers.get('location'), '/sitemap-index.xml');
const { onRequestPost } = await moduleAt('functions/api/contact.ts');
let calls = [];
const originalFetch = globalThis.fetch;
globalThis.fetch = async (_url, init) => { calls.push(JSON.parse(init.body)); return new Response('{}', { status: 200 }); };
const submit = (body, env = { RESEND_API_KEY: 'test-only' }) => onRequestPost({ request: new Request('https://example.test/api/contact', { method: 'POST', body: JSON.stringify(body) }), env });
try {
  for (const message of ['Hello Adrian', 'Programme: https://example.test/programme and context: https://example.test/about']) {
    calls = [];
    assert.equal((await submit({ name: 'Test', email: 'test@example.test', message })).status, 200);
    assert.equal(calls.length, 2);
    assert.equal(calls[1].reply_to, 'me@adrianwatkins.com');
  }
  for (const body of [null, [], { name: 123 }, { name: 'Test', email: 'bad', message: 'Hello' }]) {
    calls = [];
    assert.equal((await submit(body)).status, 400);
    assert.equal(calls.length, 0);
  }
  calls = [];
  await submit({ honeypot: 'bot' });
  assert.equal(calls.length, 0);
  assert.equal((await submit({ name: 'Test', email: 'test@example.test', message: 'Hello' }, {})).status, 503);
  globalThis.fetch = async () => new Response('{}', { status: 503 });
  assert.equal((await submit({ name: 'Test', email: 'test@example.test', message: 'Hello' })).status, 500);
} finally { globalThis.fetch = originalFetch; }
console.log('Routing, alias indexing and contact regression checks passed. No network requests sent.');

const { onRequestPost: subscribe } = await moduleAt('functions/api/writing-subscribe.ts');
const signup = (body, env = {}) => subscribe({ request: new Request('https://example.test/api/writing-subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }), env });
for (const body of [null, [], { email: 3 }, { email: 'person@example.test', source: [] }]) assert.equal((await signup(body)).status, 400);
const unconfigured = await signup({ email: 'person@example.test' });
assert.equal(unconfigured.status, 503);
assert.equal((await unconfigured.json()).ok, false);
assert.equal((await signup({ honeypot: 'bot' })).status, 200);
console.log('Newsletter validation and missing-storage checks passed.');
