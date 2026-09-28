import {test} from 'node:test';import assert from 'node:assert/strict';import {generateKeyPairSync,sign} from 'node:crypto';
import {assessFile,frontmatter,sha256} from './check-editorial-facts.mjs';
import {staticDocument,proofMessage,STATIC_PROOF_VERSION} from './lib/static-editorial-proof.mjs';
const keys=generateKeyPairSync('ed25519'),path='src/content/friday-frame/test.md',raw='---\ntitle: Test\ndraft: true\nsummary: Test summary\n---\nHypothetical example.\n';
function signed(text=raw){const proof={version:STATIC_PROOF_VERSION,repository:'acwokas/adrian-2026',path,document_sha256:staticDocument(text).sha256,review_sha256:'a'.repeat(64),source_sha256:'b'.repeat(64),reviewed_at:new Date(Date.now()-1000).toISOString(),expires_at:new Date(Date.now()+3600000).toISOString()};return {proof,signature:sign(null,Buffer.from(proofMessage(proof)),keys.privateKey).toString('base64')};}
const common={path,baseline:{},publicKey:keys.publicKey};
test('new draft may stage but cannot publish without independent proof',()=>{assert.equal(assessFile({...common,raw}).disposition,'private_draft');assert.throws(()=>assessFile({...common,raw,requireReview:true}));assert.throws(()=>assessFile({...common,raw:raw.replace('draft: true','draft: false')}));});
test('signed draft can publish, changed summary or body cannot',()=>{const receipt=signed();assert.equal(assessFile({...common,raw,receipt,requireReview:true}).approved,true);const published=raw.replace('draft: true','draft: false');assert.equal(assessFile({...common,raw:published,receipt}).approved,true);for(const change of [published+'Changed',published.replace('summary: Test','summary: Unsupported')])assert.throws(()=>assessFile({...common,raw:change,receipt}));});
test('legacy allowance never certifies and cannot allow changes or promote original drafts',()=>{const published=raw.replace('draft: true','draft: false'),baseline={[path]:sha256(published)};assert.equal(assessFile({...common,raw:published,baseline}).disposition,'legacy_unreviewed');assert.throws(()=>assessFile({...common,raw:published+'Change',baseline}));assert.throws(()=>assessFile({...common,raw:published,baseline,requireReview:true}));});
test('missing, forged, expired and cross-path receipts cannot approve publication',()=>{const receipt=signed(),published=raw.replace('draft: true','draft: false');for(const change of [{receipt:{...receipt,signature:'bad'}},{now:new Date(Date.now()+86400000)},{path:'src/content/writing/other.md'}])assert.throws(()=>assessFile({...common,raw:published,receipt,...change}));});
test('ambiguous YAML and alias-based draft state do not silently skip review',()=>{for(const text of ['---\ndraft: true\n"draft": false\n---\nText','---\ndraft: yes\n---\nText','---\nbase: &a false\ndraft: *a\n---\nText'])assert.throws(()=>frontmatter(text));});


test('text-only approvals cannot cover reference graphics or nested visual metadata',()=>{
 const body='---\ntitle: Synthetic test\ndraft: true\n---\nFictional prose.\n';
 for(const media of ['![chart][ref]','![chart]','<svg></svg>','<canvas></canvas>','<object data="x"></object>'])assert.throws(()=>staticDocument(body+media),/visual media/);
 for(const metadata of ['images: ["https://example.com/x.png"]','"heroImage": "https://example.com/x.png"',"assets: {cover: 'https://example.com/x.png'}",'hero-image: "https://example.com/x.png"'])assert.throws(()=>staticDocument(body.replace('draft: true','draft: true\n'+metadata)),/image metadata/);
});
