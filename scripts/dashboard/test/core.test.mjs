import test from 'node:test';
import assert from 'node:assert/strict';

const lib = await import('../lib.mjs').catch(() => null);
const core = await import('../../../dash/core.mjs').catch(() => null);
const radar = (id) => ({schemaVersion:'radar.v1',id,title:id,updatedAt:'2026-10-31T22:00:00+09:00',occurrenceId:`${id}:one`,runStatus:'HOLD',summary:'조건 확인 중',items:[{id:'item-1',title:'PRIVATE_ARTWORK_SENTINEL',status:'hold',applicationStatus:'unknown',deadlineAt:null,deadlineDate:'2026-11-03'}]});

test('all tabs are encrypted together and only the matching password reveals both', async () => {
  assert.ok(lib && core, 'dashboard encryption module is not implemented');
  const cfg=await lib.makeKeyConfig('test-password-never-real');
  const enc=await lib.encryptDashboard([radar('open-calls'),radar('lectures')],cfg);
  assert.ok(!JSON.stringify(enc).includes('PRIVATE_ARTWORK_SENTINEL'));
  assert.ok(!JSON.stringify(enc).includes('test-password-never-real'));
  const plain=await core.decryptDashboard(enc,'test-password-never-real');
  assert.deepEqual(plain.radars.map(r=>r.id),['open-calls','lectures']);
  await assert.rejects(core.decryptDashboard(enc,'wrong-password'));
});

test('republishing uses a new IV and modified ciphertext cannot be opened', async () => {
  assert.ok(lib && core, 'dashboard encryption module is not implemented');
  const cfg=await lib.makeKeyConfig('fixture-passphrase-2');
  const a=await lib.encryptDashboard([radar('open-calls')],cfg);
  const b=await lib.encryptDashboard([radar('open-calls')],cfg);
  assert.notEqual(a.cipher.iv,b.cipher.iv);
  const changed=structuredClone(a);changed.ct=(changed.ct[0]==='A'?'B':'A')+changed.ct.slice(1);
  await assert.rejects(core.decryptDashboard(changed,'fixture-passphrase-2'));
});

test('exports allowlisted fields and rejects invalid or duplicated adapter data', () => {
  assert.ok(lib, 'dashboard adapter validation is not implemented');
  const input=radar('lectures');input.localKey='MUST_NOT_EXPORT';input.items[0].emailBody='MUST_NOT_EXPORT';
  const clean=lib.sanitizeRadar(input);
  assert.ok(!JSON.stringify(clean).includes('MUST_NOT_EXPORT'));
  assert.equal(clean.items[0].deadlineAt,null);
  assert.equal(clean.items[0].deadlineDate,'2026-11-03');
  const duplicate=radar('lectures');duplicate.items.push({...duplicate.items[0]});
  assert.throws(()=>lib.sanitizeRadar(duplicate),/duplicate/i);
  assert.throws(()=>lib.sanitizeRadar({...input,runStatus:'SUCCESS'}),/runStatus/);
  assert.throws(()=>lib.sanitizeRadar({...input,items:[{...input.items[0],officialUrl:'javascript:alert(1)'}]}),/URL/i);
});

test('submitted, cancelled and held items never become deadline application reminders', () => {
  assert.ok(core, 'dashboard state classification is not implemented');
  const now=new Date('2026-10-31T22:00:00+09:00');
  const item={status:'conditional',applicationStatus:'not_applied',deadlineAt:'2026-10-31T23:59:00+09:00'};
  assert.equal(core.isUrgent(item,now),true);
  for(const patch of [{applicationStatus:'submitted'},{applicationStatus:'cancelled'},{status:'hold',nextAction:'해외 체류 의무 확인 전 보류'},{status:'excluded'},{status:'waiting'}])assert.equal(core.isUrgent({...item,...patch},now),false);
  // An unconfirmed-pay hold with a live deadline is still a reminder: it is reviewable, not blocked.
  assert.equal(core.isUrgent({...item,status:'hold',nextAction:'내부 강사료 액수 확인 전 우선순위 보류'},now),true);
  assert.equal(core.itemBucket({...item,applicationStatus:'submitted'},new Date('2026-11-01T01:00:00+09:00')),'submitted');
  assert.equal(core.itemBucket(item,new Date('2026-11-01T01:00:00+09:00')),'closed');
});

test('date-only deadlines stay date-only across the KST calendar boundary', () => {
  assert.ok(core, 'dashboard deadline handling is not implemented');
  const item={status:'conditional',applicationStatus:'unknown',deadlineAt:null,deadlineDate:'2026-10-31'};
  assert.equal(core.itemBucket(item,new Date('2026-10-31T14:59:00Z')),'review');
  assert.equal(core.itemBucket(item,new Date('2026-10-31T15:01:00Z')),'closed');
});

test('safe report rendering escapes source HTML and disallows executable links', () => {
  assert.ok(core, 'dashboard report renderer is not implemented');
  const rendered=core.renderMarkdown('# Title\n\n<script>alert(1)</script>\n\n[good](https://example.com/a) [bad](javascript:alert(1))');
  assert.ok(!rendered.includes('<script>'));
  assert.ok(!rendered.includes('href="javascript:'));
  assert.ok(rendered.includes('href="https://example.com/a"'));
});

test('open-call export preserves submitted Gyeol and never promotes old exclusions', () => {
  assert.ok(lib, 'open-call exporter is not implemented');
  const state={occurrence_id:'manual:one',generated_at:'2026-10-31T22:00:00+09:00',candidates:[
    {id:'gyeol',title:'결',status:'submitted-awaiting-acknowledgement-or-result',grade:null,participation_status:'submitted-by-email-sent-verified',sent_at_kst:'2026-10-30T13:55:26+09:00',work_fit:'prepared; no sent/receipt evidence',deadline_kst:'2026-10-31T23:59:00+09:00'},
    {id:'residency',title:'Excluded residency',status:'excluded-overseas-residency',grade:null,deadline_kst:'2026-11-02T20:00:00+09:00'},
    {id:'conditional',title:'Review',status:'conditional-review',grade:'B',deadline_kst:'2026-11-05T15:00:00+09:00'}]};
  const exported=lib.openCallsAdapter(state,{purpose_status:'VERIFIED'},'# Report');
  assert.equal(exported.items[0].applicationStatus,'submitted');
  assert.ok(!JSON.stringify(exported.items[0]).includes('no sent/receipt evidence'));
  assert.match(exported.items[0].summary,/제출/);
  assert.equal(exported.items[1].status,'excluded');
  assert.equal(exported.items[2].status,'conditional');
});

test('invalid calendar dates are rejected instead of silently rolling into another month',()=>{
 const item={id:'calendar',title:'Calendar',status:'conditional',applicationStatus:'not_applied',deadlineDate:'2026-02-31'};
 const input={schemaVersion:'radar.v1',id:'lectures',title:'Lectures',updatedAt:'2026-10-31T12:00:00Z',occurrenceId:'one',runStatus:'HOLD',summary:'',items:[item]};
 assert.throws(()=>lib.sanitizeRadar(input),/deadlineDate/);
});

test('verified personal submissions and onboarding replies stay distinct from signed contracts',()=>{
 const input={occurrence_id:'audit:one',generated_at:'2026-11-01T03:00:00Z',candidates:[],participation_context:[{project:'CTxAI / C2 Project',state:'two personal works consents and email submitted',recorded_time:'2026-10-21T11:56:00+09:00'},{project:'LED.ART',state:'reply-sent-contract-pending',recorded_time:'2026-10-27T19:53:00+09:00'},{project:'Ocean',state:'seoullo-application-cancelled'}]};
 const out=lib.openCallsAdapter(input,{purpose_status:'VERIFIED'},'');
 assert.equal(out.items.length,2);assert.ok(out.items.every(i=>i.applicationStatus==='submitted'&&i.resultStatus==='awaiting'));
 assert.match(out.items.find(i=>i.id==='led-art-onboarding').summary,/계약.*미확정/);
 assert.equal(out.items.some(i=>/Ocean/.test(i.title)),false);
});

test('unconfirmed pay or schedule keeps an item reviewable while confirmed blockers and user holds stay held',()=>{
 const base={status:'hold',applicationStatus:'not_applied',deadlineDate:'2026-11-06',fields:[{label:'보수',value:'내부 규정 · 액수 미공개'}]};
 const now=new Date('2026-11-01T12:00:00+09:00');
 const pay={...base,nextAction:'내부 강사료 액수 확인 전 방문·서류 제작 우선순위 보류.'};
 assert.equal(core.holdKind(pay),'check');assert.equal(core.itemBucket(pay,now),'review');assert.deepEqual(core.bucketLabel(pay,now),{label:'확인 필요',cls:'check'});
 assert.equal(core.reasonOf(pay),'내부 강사료 액수 확인 전 방문·서류 제작 우선순위 보류.');
 for(const reason of ['주 5일의 실제 투입 범위 확인','저작재산권·2차적저작물작성권 양도 협의 문구','네덜란드에서 활동하거나 기반을 둔 지원자 조건','해외 체류 의무를 먼저 확인']){const i={...base,nextAction:reason};assert.equal(core.holdKind(i),'blocker',reason);assert.equal(core.itemBucket(i,now),'hold');}
 const eu={...base,nextAction:'국가 자격 미확인',fields:[{label:'지원 자격',value:'EU/Creative Europe 참여국 기반 조건'}]};assert.equal(core.holdKind(eu),'blocker');
 const user={...base,applicationStatus:'on_hold',nextAction:'보수 확인'};assert.equal(core.holdKind(user),'user');assert.equal(core.itemBucket(user,now),'hold');assert.equal(core.bucketLabel(user,now).label,'지원 보류');
 const explicit={...base,holdKind:'blocker',nextAction:'보수 미공개'};assert.equal(core.holdKind(explicit),'blocker');
 const reviewed={...base,reason:'명시 사유',highlights:[{label:'검토 의견',value:'검토 의견 문구'}],nextAction:'다음 확인'};assert.equal(core.reasonOf(reviewed),'명시 사유');assert.equal(core.reasonOf({...reviewed,reason:''}),'검토 의견 문구');
 const expired={...pay,deadlineDate:'2026-10-30'};assert.equal(core.itemBucket(expired,now),'closed');
});

test('organization keys group the same host across radars without grouping unrelated titles',()=>{
 assert.equal(core.orgKey({organization:'한국문화예술위원회',title:'x'}),'arko');assert.equal(core.orgKey({title:'ARKO 다원예술창작기반'}),'arko');
 assert.equal(core.orgKey({title:'CODE:ART2027 Lytton Plaza Installation'}),core.orgKey({title:'CODE:ART2027 Interactive Media Installations'}));
 assert.equal(core.orgKey({organization:'강사야',title:'현역 부사관 워크숍'}),'gangsaya');
 assert.equal(core.orgKey({title:'2026 서울영상공모전 서울 밤로그'}),null);assert.equal(core.orgKey({title:'x'}),null);
});

test('open-call adapter carries the lead track and organization of widened-scope candidates',()=>{
 const state={occurrence_id:'fixture:track',generated_at:'2026-11-01T07:00:00Z',candidates:[
  {id:'envision-museum-led',title:'박물관 LED 실시간 작품 제작',status:'conditional-review',track:'의뢰',organization:'Envision Creates',official_url:'https://derivative.ca/job-post/75445'},
  {id:'plain-open-call',title:'상금형 공모',status:'conditional-review',official_url:'https://example.org/call'}]};
 const out=lib.sanitizeRadar(lib.openCallsAdapter(state,{purpose_status:'VERIFIED'},''));
 assert.equal(out.items[0].track,'의뢰');assert.equal(out.items[0].organization,'Envision Creates');
 assert.equal(out.items[1].track,null);assert.equal(out.items[1].organization,'');
});
