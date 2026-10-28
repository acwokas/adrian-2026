import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import ts from 'typescript';
const source = readFileSync('src/scripts/book-first-party.js','utf8');
function browser(options={}) {
 const rows=[],storage=new Map(Object.entries(options.storage||{}));
 const window={};
 const context={window,location:{hostname:'adrianwatkins.com',pathname:'/writing/heir-presumptive',search:'',...options.location},navigator:{userAgent:'Mozilla/5.0',...options.navigator},document:{referrer:'https://google.com/search?q=private@example.com',...options.document},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},URL,URLSearchParams,Date,Set,crypto:webcrypto,fetch:(url,init)=>{rows.push({url,...JSON.parse(init.body)});return Promise.resolve({ok:true})}};
 vm.runInNewContext(source,context);
 return {window,rows,storage,context};
}
test('page view and events use private IDs, paths and host-only referrers',()=>{
 const b=browser({location:{search:'?utm_source=google&email=private@example.com'}});
 assert.equal(b.rows.length,1);assert.equal(b.rows[0].event_type,'page_view');assert.equal(b.rows[0].referrer,'google.com');
 b.window.awBookTrack('book_read_progress',{percent_scrolled:50,email:'private@example.com'});
 assert.equal(b.rows[1].visitor_id,b.rows[0].visitor_id);assert.notEqual(b.rows[1].event_id,b.rows[0].event_id);
 assert.equal(b.rows[1].percent_scrolled,50);assert.ok(!JSON.stringify(b.rows).includes('private@example.com'));
 b.window.awBookTrack('aw_form_success',{});assert.equal(b.rows.length,2);
 vm.runInNewContext(source,b.context);assert.equal(b.rows.length,2);
});
test('localhost, preview, wrong page, bots, GPC, DNT, opt-out and QA never send',()=>{
 for(const options of [{location:{hostname:'localhost'}},{location:{hostname:'preview.pages.dev'}},{location:{pathname:'/contact'}},{navigator:{webdriver:true}},{navigator:{userAgent:'HeadlessChrome'}},{navigator:{globalPrivacyControl:true}},{navigator:{doNotTrack:'1'}},{storage:{aw_analytics_optout:'1'}},{storage:{aw_analytics_test:'1'}},{location:{search:'?analytics_test=1'}},{location:{search:'?utm_campaign=qa-test'}}]) {
  const b=browser(options);b.window.awBookTrack('book_view');assert.equal(b.rows.length,0,JSON.stringify(options));assert.ok(!b.storage.has('aw_book_visitor_v1'));
 }
});
test('opt-out is checked again for later events; browser ID persists across loads',()=>{
 const b=browser();const c=browser({storage:Object.fromEntries(b.storage)});assert.equal(b.rows[0].visitor_id,c.rows[0].visitor_id);
 b.storage.set('aw_analytics_optout','1');b.window.awBookTrack('book_signup');assert.equal(b.rows.length,1);
});
const code=ts.transpile(readFileSync('functions/api/book-analytics.ts','utf8'),{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022});
const {onRequestPost}=await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const originalFetch=globalThis.fetch;let writes=[];let storageStatus=201;
globalThis.fetch=async(url,init)=>{writes.push({url,init});return new Response(null,{status:storageStatus})};
const payload=()=>({event_id:webcrypto.randomUUID(),visitor_id:webcrypto.randomUUID(),event_type:'page_view',page_path:'/writing/heir-presumptive',test_traffic:false});
const post=async(body=payload(),headers={},host='adrianwatkins.com',env={SUPABASE_URL:'https://example.invalid',SUPABASE_SERVICE_ROLE_KEY:'not-a-secret'})=>onRequestPost({request:new Request(`https://${host}/api/book-analytics`,{method:'POST',headers:{origin:`https://${host}`,'content-type':'application/json','user-agent':'Mozilla/5.0',...headers},body:JSON.stringify(body)}),env});
test('server writes only bounded allowed fields and deduplicates by event ID',async()=>{
 writes=[];const p={...payload(),hostname:'evil.test',email:'private@example.com',referrer:'google.com',utm_source:'google',percent_scrolled:200};
 assert.equal((await post(p)).status,204);assert.equal(writes.length,1);
 const row=JSON.parse(writes[0].init.body);assert.equal(row.hostname,'adrianwatkins.com');assert.equal(row.percent_scrolled,100);assert.ok(!JSON.stringify(row).includes('private@example.com'));
 assert.match(writes[0].url,/on_conflict=event_id/);assert.match(writes[0].init.headers.Prefer,/ignore-duplicates/);
});
test('server rejects invalid origins, schema, bots and tests without storage',async()=>{
 writes=[];
 assert.equal((await post(payload(),{origin:'https://evil.test'})).status,403);
 assert.equal((await post(payload(),{},'preview.pages.dev')).status,403);
 assert.equal((await post({...payload(),event_type:'anything'})).status,400);
 assert.equal((await post({...payload(),visitor_id:[webcrypto.randomUUID()]})).status,400);
 assert.equal((await post({...payload(),event_id:[webcrypto.randomUUID()]})).status,400);
 assert.equal((await post({...payload(),test_traffic:'false'})).status,400);
 assert.equal((await post({...payload(),page_path:'/contact'})).status,400);
 assert.equal((await post(payload(),{'sec-gpc':'1'})).status,204);
 assert.equal((await post(payload(),{'user-agent':'Playwright'})).status,204);

 assert.equal((await post({...payload(),junk:'x'.repeat(3000)})).status,413);
 assert.equal(writes.length,0);
});
test('missing configuration and failed writes never claim stored success',async()=>{
 assert.equal((await post(payload(),{},'adrianwatkins.com',{})).status,503);
 storageStatus=503;assert.equal((await post()).status,503);storageStatus=201;
});
test.after(()=>{globalThis.fetch=originalFetch});

test('invalid and expired cached identifiers rotate; IP and private referrers are omitted',()=>{
 const id=webcrypto.randomUUID();
 for(const old of [{id:'x'.repeat(36),last:Date.now()},{id:[id],last:Date.now()},{id,last:Date.now()+86400000},{id,last:Date.now()-366*86400000}]) {
  const b=browser({storage:{aw_book_visitor_v1:JSON.stringify(old)}});assert.equal(typeof b.rows[0].visitor_id,'string');assert.notEqual(b.rows[0].visitor_id,old.id);
 }
 for(const referrer of ['http://192.168.1.1/private','http://[::1]/','http://intranet.local/','http://localhost/']) assert.equal(browser({document:{referrer}}).rows[0].referrer,null);
});

test('explicit boolean QA and test campaign flags are stored distinctly from visitors',async()=>{
 writes=[];
 for(const values of [{test_traffic:true},{utm_campaign:'qa-smoke'}]) {
 assert.equal((await post({...payload(),...values})).status,204);
 const row=JSON.parse(writes.at(-1).init.body);assert.equal(row.test_traffic,true);assert.equal(row.traffic_classification,'flagged_test');
 }
 const sql=readFileSync('docs/book-review/first-party-report.sql','utf8');assert.match(sql,/test_traffic=false/);assert.match(sql,/traffic_classification='unflagged_browser'/);
});
