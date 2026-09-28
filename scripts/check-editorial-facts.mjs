#!/usr/bin/env node
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,relative} from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseDocument} from 'yaml';
import {verifyStaticProof} from './lib/static-editorial-proof.mjs';
const repository='acwokas/adrian-2026';
export const sha256=value=>createHash('sha256').update(value).digest('hex');
export function frontmatter(raw) {
 const m=raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);if(!m)throw Error('Missing frontmatter');
 const doc=parseDocument(m[1],{uniqueKeys:true});if(doc.errors.length)throw Error('Ambiguous frontmatter');
 const data=doc.toJS({maxAliasCount:0});if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Invalid frontmatter');
 if(Object.hasOwn(data,'draft')&&typeof data.draft!=='boolean')throw Error('Draft must be boolean');
 return data;
}
export function assessFile({raw,path,baseline,receipt,publicKey,requireReview=false,now=new Date()}) {
 if(!/^src\/content\/(writing|friday-frame)\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.mdx?$/.test(path))throw Error('Unexpected editorial path');
 const data=frontmatter(raw);
 if(data.draft===true&&!requireReview)return {disposition:'private_draft',path};
 // A receipt takes precedence over legacy status. Deleting a required receipt
 // cannot make an edited document match its frozen original hash.
 if(receipt)return {disposition:'independently_verified',path,...verifyStaticProof({raw,repository,path,receipt,publicKey,now})};
 if(!requireReview&&baseline[path]===sha256(raw))return {disposition:'legacy_unreviewed',path};
 throw Error('Current independent whole-file approval required: '+path);
}
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+'/'+e.name):/\.mdx?$/.test(e.name)?[dir+'/'+e.name]:[]);}
export function runGate({root=process.cwd(),file=null}={}) {
 const baseline=JSON.parse(readFileSync(resolve(root,'ops/editorial/legacy-unreviewed.json'),'utf8')).files;
 const publicKey=readFileSync(resolve(root,'ops/editorial/static-editorial-public-key.pem'),'utf8');
 const files=file?[file]:['src/content/writing','src/content/friday-frame'].flatMap(dir=>walk(resolve(root,dir)).map(f=>relative(root,f)));
 const results=[],failures=[];
 for(const path of files){try{
  const receiptPath=resolve(root,'ops/editorial/approvals',sha256(path)+'.json');
  const receipt=existsSync(receiptPath)?JSON.parse(readFileSync(receiptPath,'utf8')):null;
  results.push(assessFile({raw:readFileSync(resolve(root,path),'utf8'),path,baseline,receipt,publicKey,requireReview:!!file}));
 }catch(e){failures.push({path,error:e.message});}}
 const counts=results.reduce((a,r)=>(a[r.disposition]=(a[r.disposition]||0)+1,a),{});
 console.log(JSON.stringify({counts,failures,note:'Legacy allowance is frozen unreviewed archive debt, never factual approval.'},null,2));
 if(failures.length)throw Error('Editorial publication held');return results;
}
if(import.meta.url===pathToFileURL(process.argv[1]||'').href){try{
 const args=process.argv.slice(2);if(args.some(a=>!a.startsWith('--file='))||args.length>1)throw Error('Unknown gate option');
 runGate({file:args[0]?.slice(7)||null});
}catch(e){console.error(e.message);process.exitCode=1;}}
