import test from 'node:test';
import assert from 'node:assert/strict';
const state=await import('../../../dash/state.mjs').catch(()=>null);
const item=(id,patch={})=>({id,title:id,status:'conditional',applicationStatus:'not_applied',deadlineAt:'2026-11-04T18:00:00+09:00',fields:[],...patch});
const now=new Date('2026-11-01T12:00:00+09:00');
test('expired unsubmitted records are archived; submitted ones remain awaiting results',()=>{
 assert.ok(state,'workspace state module missing');
 const old=item('old',{deadlineAt:'2026-10-31T23:59:00+09:00',status:'hold'});
 assert.equal(state.isArchived(old,now),true);
 assert.equal(state.isArchived({...old,applicationStatus:'submitted'},now),false);
 assert.equal(state.isArchived(item('today',{deadlineAt:null,deadlineDate:'2026-11-01'}),now),false);
});
test('an explicit user submission overrides old source status, but not an official final result',()=>{
 assert.ok(state,'state overlay missing');
 const radar={id:'lectures',items:[item('one'),item('two',{applicationStatus:'submitted',resultStatus:'selected'})]};
 const changed=state.applyState(radar,[{radarId:'lectures',itemId:'one',applicationStatus:'submitted',resultStatus:'awaiting',updatedAt:'2026-11-01T03:00:00Z',revision:1},{radarId:'lectures',itemId:'two',applicationStatus:'submitted',resultStatus:'awaiting',updatedAt:'2026-11-01T03:00:00Z',revision:1}]);
 assert.equal(changed.items[0].applicationStatus,'submitted');assert.equal(changed.items[0].resultStatus,'awaiting');assert.match(changed.items[0].applicationStatusLabel,/발표 대기/);
 assert.equal(changed.items[1].resultStatus,'selected');assert.equal(radar.items[0].applicationStatus,'not_applied');
});
test('comparison has aligned fields, preserves missing values, and escapes source markup',()=>{
 assert.ok(state,'comparison renderer missing');
 const html=state.comparisonTable([item('a',{title:'<script>bad</script>',fields:[{label:'보수',value:'협의'},{label:'장소',value:'서울'}]}),item('b',{fields:[{label:'보수',value:'미공개'}]})]);
 assert.ok(!html.includes('<script>'));assert.match(html,/&lt;script&gt;/);assert.match(html,/협의/);assert.match(html,/미공개/);assert.match(html,/미확인/);assert.match(html,/확인·보류 사유/);
});
test('comparison selections toggle without duplicates and stop at three',()=>{
 assert.ok(state,'comparison selector missing');
 let ids=[];for(const id of ['a','b','c','d'])ids=state.toggleComparison(ids,id);
 assert.deepEqual(ids,['a','b','c']);assert.deepEqual(state.toggleComparison(ids,'b'),['a','c']);
});
test('verified mirror records cannot override a newer source reconciliation, unlike direct user corrections',()=>{
 const r={id:'lectures',items:[item('one')]},record={radarId:'lectures',itemId:'one',applicationStatus:'submitted',resultStatus:'awaiting',revision:1,updatedAt:'2026-11-01T00:00:00Z',source:'verified-record'};
 assert.equal(state.applyState(r,[record]).items[0].applicationStatus,'not_applied');
 assert.equal(state.applyState(r,[{...record,source:'dashboard-user'}]).items[0].applicationStatus,'submitted');
});
test('signed request changes are detected and signing key differs from encryption key',async()=>{
 assert.ok(state,'request authentication missing');
 const raw=new Uint8Array(32).fill(7),key=await state.deriveSigningKey(raw);
 assert.notDeepEqual([...key],[...raw]);
 const headers=await state.signedHeaders(key,'PUT','/v1/state','{"checked":true}',{timestamp:'1793502000',nonce:'a'.repeat(32)});
 assert.equal(await state.verifySignedRequest(key,'PUT','/v1/state','{"checked":true}',headers,1793502000),true);
 assert.equal(await state.verifySignedRequest(key,'PUT','/v1/state','{"checked":false}',headers,1793502000),false);
 assert.equal(await state.verifySignedRequest(key,'PUT','/v1/state','{"checked":true}',headers,1793503000),false);
});
test('after a saved state changes filters, inspector selection belongs to the visible list',()=>{
 assert.equal(state.visibleSelection('gone',[item('current'),item('next')]),'current');
 assert.equal(state.visibleSelection('next',[item('current'),item('next')]),'next');
 assert.equal(state.visibleSelection('gone',[]),null);
});
test('a late user submission no longer claims it is an unsubmitted expired call',()=>{
 const i=item('late',{status:'closed',fields:[{label:'검토 의견',value:'미지원 마감 보관. 약정 확인 필요'}],highlights:[{label:'검토 의견',value:'미지원 마감 보관. 약정 확인 필요'}]});
 const out=state.applyState({id:'open-calls',items:[i]},[{radarId:'open-calls',itemId:'late',source:'dashboard-user',applicationStatus:'submitted',resultStatus:'awaiting'}]).items[0];
 assert.match(out.highlights[0].value,/발표·회신 대기/);assert.ok(!out.fields[0].value.startsWith('미지원'));
});

test('a master hold from the dashboard overrides the producer state and clears any result',async()=>{
 const r={id:'lectures',items:[item('one',{resultStatus:null}),item('two',{applicationStatus:'submitted',resultStatus:'awaiting'})]};
 const out=state.applyState(r,[{radarId:'lectures',itemId:'one',applicationStatus:'on_hold',resultStatus:null,updatedAt:'2026-11-01T04:00:00Z',revision:1,source:'dashboard-user'}]);
 assert.equal(out.items[0].applicationStatus,'on_hold');assert.equal(out.items[0].resultStatus,null);assert.match(out.items[0].applicationStatusLabel,/보류/);
 const {validateRecords}=await import('../sync-state.mjs');
 assert.equal(validateRecords([{radarId:'lectures',itemId:'one',applicationStatus:'on_hold',resultStatus:null,updatedAt:'2026-11-01T04:00:00Z',revision:1,source:'dashboard-user'}])[0].applicationStatus,'on_hold');
 assert.throws(()=>validateRecords([{radarId:'lectures',itemId:'one',applicationStatus:'on_hold',resultStatus:'awaiting',updatedAt:'2026-11-01T04:00:00Z',revision:1,source:'dashboard-user'}]));
});
