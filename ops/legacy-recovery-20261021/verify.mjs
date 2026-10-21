// Read-only acceptance for the exact legacy recovery manifest. HTTP fetches do
// not execute GTM or GA4. Pass a base URL only after the articles are published.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const manifest=JSON.parse(fs.readFileSync(resolve(root,'ops/legacy-recovery-20261021/manifest.json')));
const base=process.argv[2];
const results=[];
function checkDates(html,article){
 if(!article.editorialDate)return;
 const published=article.editorialDate+'T00:00:00.000Z';
 const modified=article.updatedDate+'T00:00:00.000Z';
 const scripts=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 const metadata=scripts.flatMap(s=>s['@graph']||[s]).find(s=>s['@type']==='Article');
 assert.equal(metadata?.datePublished,published,`Published: ${article.slug}`);
 assert.equal(metadata?.dateModified,modified,`Modified: ${article.slug}`);
 const updated=new Date(modified).toLocaleDateString('en-GB',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'});
 assert.ok(html.includes('Updated '+updated),`Visible update: ${article.slug}`);
 assert.ok(html.includes(`property="article:modified_time" content="${modified}"`),`OG modified: ${article.slug}`);
}
const listing=fs.readFileSync(resolve(root,'dist/writing.html'),'utf8');
const feed=fs.readFileSync(resolve(root,'dist/writing/rss.xml'),'utf8');
for(const article of manifest.articles){
 assert.ok(listing.includes(article.destination),`Listed: ${article.slug}`);
 if(article.editorialDate){
  const items=[...feed.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m=>m[1]);
  const item=items.find(x=>x.includes('https://adrianwatkins.com'+article.destination));
  assert.ok(item,`RSS item: ${article.slug}`);
  assert.equal(new Date(item.match(/<pubDate>(.*?)<\/pubDate>/)[1]).toISOString().slice(0,10),article.editorialDate,`RSS date: ${article.slug}`);
 }
}
for(const article of manifest.articles){
 const html=fs.readFileSync(resolve(root,`dist${article.destination}.html`),'utf8');
 assert.ok(!/noindex/i.test(html),`Indexability: ${article.slug}`);
 assert.ok(html.includes(`https://adrianwatkins.com${article.destination}`),`Canonical: ${article.slug}`);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`H1: ${article.slug}`);
 checkDates(html,article);
 assert.ok(!/Page not found/.test(html),`Article output: ${article.slug}`);
 if(!base)continue;
 for(const path of article.redirects){
  const r=await fetch(new URL(path,base),{redirect:'manual'});
  assert.equal(r.status,301,path);
  assert.equal(new URL(r.headers.get('location'),base).pathname,article.destination,path);
  results.push({path,status:r.status,destination:article.destination});
 }
 const page=await fetch(new URL(article.destination,base));
 assert.equal(page.status,200,article.destination);
 const body=await page.text();
 checkDates(body,article);
 assert.ok(!/Page not found/.test(body),article.destination);
 assert.ok(body.includes(`https://adrianwatkins.com${article.destination}`),article.destination);
 assert.ok(!/noindex/i.test(body),article.destination);
}
if(base){
 for(const path of ['/','/writing','/about','/singapore','/speaking','/contact'])assert.equal((await fetch(new URL(path,base))).status,200,path);
 for(const path of ['/not-a-real-page-legacy-recovery-check','/wp-admin/legacy-recovery-check'])assert.equal((await fetch(new URL(path,base),{redirect:'manual'})).status,404,path);
}
console.log(JSON.stringify({passed:true,articles:manifest.articles.length,redirects:results.length,base:base||'built output',results},null,2));
