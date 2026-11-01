import test from 'node:test';import assert from 'node:assert/strict';
import {applyReplies,sanitizeReceivables} from '../ledgers.mjs';
import {makeKeyConfig,encryptDashboard,sanitizeRadar} from '../lib.mjs';import {decryptDashboard} from '../../../dash/core.mjs';
const radar={schemaVersion:'radar.v1',id:'lectures',title:'강의처',updatedAt:'2026-11-01T03:00:00Z',occurrenceId:'one',runStatus:'HOLD',summary:'',items:[{id:'a',title:'A',status:'waiting',applicationStatus:'submitted',resultStatus:'awaiting'},{id:'b',title:'B',status:'conditional',applicationStatus:'not_applied'},{id:'c',title:'C',status:'waiting',applicationStatus:'submitted',resultStatus:'awaiting'}]};
test('institution replies annotate items and a final answer settles the awaiting result',()=>{
 const ledger={schemaVersion:'radar-reply-ledger.v1',records:[{radarId:'lectures',itemId:'a',replyStatus:'not_selected',replyAt:'2026-10-26',replyNote:'기관 전형 결과 메일'},{radarId:'lectures',itemId:'b',replyStatus:'selected',replyAt:'2026-10-27T01:00:00Z'},{radarId:'lectures',itemId:'c',replyStatus:'meeting',replyAt:'2026-10-22'},{radarId:'open-calls',itemId:'a',replyStatus:'selected'}]};
 const [out]=applyReplies([radar],ledger);
 assert.equal(out.items[0].resultStatus,'not_selected');assert.equal(out.items[0].replyStatus,'not_selected');assert.equal(out.items[0].replyAt,'2026-10-26');
 assert.equal(out.items[1].resultStatus,undefined);assert.equal(out.items[1].applicationStatus,'not_applied');assert.equal(out.items[1].replyStatus,'selected');
 assert.equal(out.items[2].resultStatus,'awaiting');assert.equal(out.items[2].replyStatus,'meeting');
 const clean=sanitizeRadar(out);assert.equal(clean.items[2].replyNote,'');assert.equal(clean.items[0].replyNote,'기관 전형 결과 메일');
 assert.throws(()=>applyReplies([radar],{records:'x'}),/ledger/);assert.deepEqual(applyReplies([radar],null)[0].items[0].replyStatus,undefined);
});
test('the receivables ledger is validated, rounded and encrypted with the payload',async()=>{
 const ledger={schemaVersion:'receivables.v1',updatedAt:'2026-11-01T03:00:00Z',records:[{id:'x',counterparty:'RECV_SENTINEL',item:'강사료',amountKrw:1234.6,status:'pending',expectedAt:'2026-10-26',basis:'메일',nextAction:'입금 확인'},{id:'y',counterparty:'B',item:'',amountKrw:null,amountLabel:'미기재',status:'paid'}]};
 const clean=sanitizeReceivables(ledger);assert.equal(clean.records[0].amountKrw,1235);assert.equal(clean.records[1].amountKrw,null);
 assert.throws(()=>sanitizeReceivables({schemaVersion:'receivables.v1',records:[{id:'x',counterparty:'A',status:'weird'}]}),/receivable/);
 assert.throws(()=>sanitizeReceivables({schemaVersion:'receivables.v1',records:[{id:'x',counterparty:'A',status:'paid'},{id:'x',counterparty:'A',status:'paid'}]}),/receivable/);
 const key=await makeKeyConfig('fixture-receivables');const enc=await encryptDashboard([sanitizeRadar(radar)],key,{receivables:ledger});
 assert.ok(!JSON.stringify(enc).includes('RECV_SENTINEL'));const plain=await decryptDashboard(enc,'fixture-receivables');assert.equal(plain.receivables.records[0].counterparty,'RECV_SENTINEL');
});
