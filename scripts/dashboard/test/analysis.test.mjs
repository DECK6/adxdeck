import test from 'node:test';import assert from 'node:assert/strict';
import {openCallsAdapter,sanitizeRadar} from '../lib.mjs';
const analysis=await import('../analysis.mjs').catch(()=>null);
const candidate={id:'fixture',title:'Fixture',status:'conditional-review',deadline_date:'2026-11-16',work_fit:'English internal research memo'};
const state={occurrence_id:'fixture:one',generated_at:'2026-11-01T03:00:00Z',candidates:[candidate]};
test('Korean analysis exposes format, money, travel and review without leaking English source notes',()=>{
 assert.ok(analysis,'Korean analysis merger missing');
 const overlay={items:[{id:'fixture',sourceFingerprint:analysis.candidateFingerprint(candidate),summary:'한국어 설명',review:'설치형 작품으로 재구성해야 합니다.',applicationType:'미디어아트 · 설치',prize:'상금 미확인',travel:'현장 방문 조건 미확인',livingSupport:'체류비 지원 미확인',fee:'참가비 미확인',requirements:'영상 단독 접수는 미확인',rights:'계약 확인 필요',eligibility:'국내 거주 지원자 자격 미확인',location:'미확인',schedule:'미확인',verifiedAt:'2026-11-01T03:00:00Z',basis:'공식 안내 확인'}]};
 const item=openCallsAdapter(state,{purpose_status:'VERIFIED'},'',overlay).items[0];
 assert.equal(item.summary,'한국어 설명');assert.ok(!JSON.stringify(item).includes('English internal'));
 assert.equal(item.deadlineDate,'2026-11-16');assert.equal(item.deadlineAt,null);
 assert.equal(item.highlights.find(f=>f.label==='지원 분야').value,'미디어아트 · 설치');
 assert.match(item.fields.find(f=>f.label==='검토 의견').value,/재구성/);
 assert.equal(sanitizeRadar({...openCallsAdapter(state,{purpose_status:'VERIFIED'},'',overlay)}).items[0].highlights.length,6);
 const stale=openCallsAdapter({...state,candidates:[{...candidate,work_fit:'Changed official scope'}]},{purpose_status:'VERIFIED'},'',overlay).items[0];
 assert.match(stale.fields.find(f=>f.label==='검토 의견').value,/갱신/);assert.ok(!JSON.stringify(stale).includes('Changed official'));
});
