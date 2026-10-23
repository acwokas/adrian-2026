import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
function fixture(host='adrianwatkins.com', userAgent='Mozilla/5.0') {
 const handlers={};
 class Element { constructor(href){this.href=href;this.textContent='Download my executive CV (PDF)';} closest(s){return s==='a[href]'?this:null;} getAttribute(){return null;} querySelector(){return null;} }
 const window={};
 const document={addEventListener:(n,fn)=>handlers[n]=fn};
 vm.runInNewContext(fs.readFileSync('src/scripts/engagement.js','utf8'),{window,document,location:{hostname:host,pathname:'/executive-cv',origin:`https://${host}`,href:`https://${host}/executive-cv?recipient=private@example.com`},navigator:{userAgent},URL,Element,addEventListener(){},setInterval(){},clearInterval(){}});
 return {click(path,type='click',button=0){handlers[type]({target:new Element(`https://${host}${path}`),type,button});},events:()=>window.dataLayer||[]};
}
for (const path of ['/documents/Adrian-Watkins-Executive-CV-2027.pdf','/documents/Adrian-Watkins-Executive-CV-2026.pdf','/documents/AdrianWatkins_Executive-CV.pdf']) {
 for(const type of ['click','auxclick']) {
 const f=fixture();f.click(path+'?recipient=private@example.com',type,type==='auxclick'?1:0);
 assert.equal(f.events().length,1);assert.equal(f.events()[0][1],'cv_download');
 assert.equal(f.events()[0][2].link_path,path);
 assert.ok(!JSON.stringify(f.events()).includes('private@example.com'));
 }
}
const f=fixture();f.click('/documents/EDGE-Framework-Whitepaper.pdf');assert.equal(f.events()[0][1],'aw_download');
f.click('/executive-cv');assert.equal(f.events()[1][1],'aw_link_click');
f.click('/documents/Adrian-Watkins-Executive-CV-2027.pdf','auxclick',2);assert.equal(f.events().length,2);
for(const f of [fixture('localhost'),fixture('adrianwatkins.com','HeadlessChrome')]) {f.click('/documents/Adrian-Watkins-Executive-CV-2027.pdf');assert.equal(f.events().length,0);}
const page=fs.readFileSync('dist/executive-cv.html','utf8');
assert.match(page,/Download my executive CV/);assert.match(page,/GTM-W5NHK72H/);
assert.ok(!fs.readFileSync('public/_redirects','utf8').split('\n').some(l=>/^\/executive-cv\s/.test(l)));
console.log('CV routes, click/keyboard-compatible handler, middle click, privacy and bot/preview suppression passed. No analytics sent.');
