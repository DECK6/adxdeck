import test from 'node:test';import assert from 'node:assert/strict';
import {makeKeyConfig,encryptDashboard} from '../lib.mjs';import {decryptDashboard} from '../../../dash/core.mjs';
test('NARA data and request capability stay encrypted behind the common password',async()=>{
 const key=await makeKeyConfig('fixture-nara-bridge');const nara={v:2,items:[{title:'NARA_PRIVATE_SENTINEL',drafts:[]}],recommendations:[],requestApi:{url:'https://example.com',token:'FIXTURE_REQUEST_CAPABILITY'}};
 const enc=await encryptDashboard([{schemaVersion:'radar.v1',id:'open-calls',title:'공모',updatedAt:'2026-11-01T03:00:00Z',occurrenceId:'one',runStatus:'HOLD',summary:'',items:[]}],key,{nara});
 assert.ok(!JSON.stringify(enc).includes('NARA_PRIVATE_SENTINEL'));assert.ok(!JSON.stringify(enc).includes('FIXTURE_REQUEST_CAPABILITY'));
 const plain=await decryptDashboard(enc,'fixture-nara-bridge');assert.equal(plain.nara.items[0].title,'NARA_PRIVATE_SENTINEL');assert.equal(plain.nara.requestApi.token,'FIXTURE_REQUEST_CAPABILITY');
});
