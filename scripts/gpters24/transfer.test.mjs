import test from 'node:test';import assert from 'node:assert/strict';
import {createProject,parseProject,personalFiles,personalPrompt} from './personal.mjs';
test('legacy personal projects gain an empty domain plan without losing data',()=>{
 const p=createProject();delete p.domainPlan;p.title='기존 주제';const restored=parseProject(JSON.stringify(p));assert.equal(restored.title,p.title);assert.deepEqual(restored.domainPlan.expected,['','','']);
});
test('domain mapping and expected answers survive export and stay out of agent evaluation prompt',()=>{
 const p=createProject();p.title='내 콘텐츠';p.domainPlan.target='게시할 글';p.domainPlan.rule='필수 자료가 모두 확인되면 준비됨';p.domainPlan.expected[0]='PRIVATE_EXPECTED_ANSWER';p.domainPlan.evidence[0]='N1의 실제 문장';
 const restored=parseProject(JSON.stringify(p));assert.equal(restored.domainPlan.target,'게시할 글');
 for(let w=1;w<=4;w++){const f=personalFiles(p,w);assert.match(f['practice/domain-design.md'],/게시할 글/);assert.match(f['practice/test-design.md'],/PRIVATE_EXPECTED_ANSWER/);assert.match(f['practice/transfer-guide.md'],/3–5/);assert.ok(!personalPrompt(p,w).includes('PRIVATE_EXPECTED_ANSWER'));assert.match(personalPrompt(p,w),/test-design/);}
});
test('malformed domain planning fields are rejected before restoring a project',()=>{
 const p=createProject();p.domainPlan.expected=['one'];assert.throws(()=>parseProject(JSON.stringify(p)));
});
test('rough idea memo persists, exports into its dedicated prompt and stays out of evaluation prompts',()=>{
 const p=createProject();p.ideaMemo='PRIVATE_IDEA: 인터뷰 자료가 모이면 글을 쓰고 싶다.';
 const restored=parseProject(JSON.stringify(p));assert.equal(restored.ideaMemo,p.ideaMemo);
 for(let w=1;w<=4;w++){const f=personalFiles(restored,w);assert.match(f['practice/idea-to-akm-prompt.md'],/PRIVATE_IDEA/);assert.match(f['practice/idea-to-akm-prompt.md'],/99-system\/ROUTER.md/);assert.match(f['practice/idea-to-akm-prompt.md'],/미확인/);assert.ok(!personalPrompt(restored,w).includes('PRIVATE_IDEA'));}
 const old=createProject();delete old.ideaMemo;assert.equal(parseProject(JSON.stringify(old)).ideaMemo,'');
});
test('idea memo imports are bounded and textual',()=>{
 const p=createProject();for(const invalid of [[],{},'x'.repeat(20001)]){p.ideaMemo=invalid;assert.throws(()=>parseProject(JSON.stringify(p)));}
});
