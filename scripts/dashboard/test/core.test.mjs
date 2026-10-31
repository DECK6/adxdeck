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
  for(const patch of [{applicationStatus:'submitted'},{applicationStatus:'cancelled'},{status:'hold'},{status:'excluded'},{status:'waiting'}])assert.equal(core.isUrgent({...item,...patch},now),false);
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
