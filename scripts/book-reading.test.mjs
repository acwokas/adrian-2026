import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source=readFileSync('src/components/BookReadingTracker.astro','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
const js=ts.transpile(source.replace(/import ['"]\.\.\/scripts\/book-first-party\.js['"];?/, ''),{target:ts.ScriptTarget.ES2022});
function setup(host='adrianwatkins.com') {let tick; const events=[];const box={top:0,bottom:3000,height:3000};const document={visibilityState:'visible',readyState:'complete',querySelector:()=>({getBoundingClientRect:()=>box})};const window={awTrack:(name,props)=>events.push({name,props})};vm.runInNewContext(js,{document,window,location:{hostname:host},innerHeight:800,setInterval:fn=>{tick=fn}});return {events,box,document,tick};}
test('local preview records no reading events',()=>{assert.deepEqual(setup('127.0.0.1').events,[])});
test('hidden tab and extract off screen do not count reading time',()=>{const s=setup();s.document.visibilityState='hidden';for(let i=0;i<40;i++)s.tick();s.document.visibilityState='visible';s.box.top=1000;for(let i=0;i<40;i++)s.tick();assert.deepEqual(s.events.map(e=>e.name),['book_view'])});
test('engaged reading requires both time and depth; events deduplicate',()=>{const s=setup();for(let i=0;i<35;i++)s.tick();assert.equal(s.events.filter(e=>e.name==='book_read_start').length,1);assert.equal(s.events.filter(e=>e.name==='book_engaged_read').length,0);s.box.top=-1000;s.box.bottom=2000;for(let i=0;i<35;i++)s.tick();assert.equal(s.events.filter(e=>e.name==='book_engaged_read').length,1);assert.equal(s.events.filter(e=>e.name==='book_read_progress'&&e.props.percent_scrolled===50).length,1)});
