import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const dash=new URL('../../../dash/',import.meta.url);
const read=f=>fs.readFileSync(new URL(f,dash),'utf8');
const strip=s=>s.replace(/(\.(?:mjs|css))\?v=[a-f0-9]{8}/g,'$1');
test('index.html and module imports carry the content hash of the current dashboard files (run scripts/dashboard/stamp.mjs before pushing)',()=>{
 const hash=createHash('sha256').update(['core.mjs','state.mjs','app.mjs','styles.css'].map(f=>strip(read(f))).join('\n')).digest('hex').slice(0,8);
 assert.match(read('index.html'),new RegExp(`\\./app\\.mjs\\?v=${hash}`));assert.match(read('index.html'),new RegExp(`\\./styles\\.css\\?v=${hash}`));
 assert.match(read('app.mjs'),new RegExp(`from '\\./core\\.mjs\\?v=${hash}'`));assert.match(read('app.mjs'),new RegExp(`from '\\./state\\.mjs\\?v=${hash}'`));
 assert.match(read('state.mjs'),new RegExp(`from '\\./core\\.mjs\\?v=${hash}'`));
});
