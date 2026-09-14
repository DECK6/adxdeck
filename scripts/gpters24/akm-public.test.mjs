import test from 'node:test';
import assert from 'node:assert/strict';
import {domains} from './data.mjs';
import {filesForWeek} from './core.mjs';
import {createProject,personalFiles,parseProject} from './personal.mjs';
import {ideaToAkmPrompt} from './memo-prompt.mjs';

test('common AKM exports preserve raw bodies with provenance and separate dated source/context names',()=>{
 for(const m of Object.values(domains))for(const w of [1,2,3,4]){
  const f=filesForWeek(m,w),sourceRoot=w===1?'00-inbox/':'10-sources/',sources=Object.keys(f).filter(p=>p.startsWith(sourceRoot));
  assert.equal(sources.length,m.notes.length);
  for(const path of sources){assert.match(path,/\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md$/);assert.match(f[path],/sourcePath:/);assert.match(f[path],/trustLevel: raw/);}
  for(const n of m.notes)assert.ok(sources.some(p=>f[p].includes(n.body)));
  const contexts=Object.keys(f).filter(p=>p.includes('30-context/projects/'));
  assert.equal(contexts.length,m.notes.length);assert.ok(contexts.every(p=>f[p].includes('akmLayer: context')));
  assert.ok(f['my-topic/akm-public-guide.md']);
  for(const row of JSON.parse(f['practice/note-paths.json']))for(const [key,path] of Object.entries(row))if(key!=='id')assert.ok(f[path],path);
 }
});
test('personal raw and draft paths resolve within each exported bundle without inventing finished knowledge',()=>{
 const p=createProject();p.model.notes=[{id:'N1',title:'내 계획',body:'내 글 A에는 인터뷰가 필요하다.',source:'직접 작성한 메모',date:'2026-09-14',links:['n1']},{id:'n1',title:'미확인',body:'자료 보유 여부는 아직 모른다.',source:'직접 작성한 메모',date:'2026-09-14',links:['N1']}];
 for(const w of [1,2,3,4]){
  const f=personalFiles(p,w),sources=Object.keys(f).filter(k=>k.startsWith('00-inbox/')&&k.endsWith('.md'));
  assert.equal(sources.length,2);assert.equal(new Set(sources.map(x=>x.toLowerCase())).size,2);
  const draft=Object.entries(f).filter(([k])=>k.startsWith('wiki-drafts/')&&!k.endsWith('README.md'));
  for(const [,text] of draft)for(const match of text.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g))assert.ok(f[match[1]+'.md'],match[1]);
  assert.ok(f['practice/akm-public-guide.md']);assert.match(f['wiki-drafts/README.md'],/30-context/);
  for(const row of JSON.parse(f['practice/note-paths.json']))for(const [key,path] of Object.entries(row))if(key!=='id')assert.ok(f[path],path);
 }
 assert.deepEqual(parseProject(JSON.stringify(p)).model.notes,p.model.notes);
});
test('memo prompt follows public root startup, metadata, Tier1 verification and optional adapter setup',()=>{
 const prompt=ideaToAkmPrompt();
 for(const text of ['40-memory/','비어','adapters/claude-code/README.md','adapters/codex/README.md','sourcePath','trustLevel: unverified','akmType: concept','99-system/VERIFICATION.md','node scripts/lint.mjs --akm .','node scripts/lint.mjs --links .','qmd는 필수 설치가 아닙니다'])assert.ok(prompt.includes(text),text);
 assert.ok(!prompt.includes('[[노트 경로]]'));
});
