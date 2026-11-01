import test from 'node:test';import assert from 'node:assert/strict';
import {applyLinkOverrides} from '../build.mjs';
const radar={id:'open-calls',items:[{id:'a',title:'A',officialUrl:null,fields:[]},{id:'b',title:'B',officialUrl:'https://org.example/b',fields:[]}]};
test('the link ledger fills missing official links, keeps existing ones unless forced, and records the source',()=>{
 const out=applyLinkOverrides([radar],{schemaVersion:'radar-link-overrides.v1',records:[{radarId:'open-calls',itemId:'a',officialUrl:'https://org.example/a',note:'2026-11-01 공식 공고 확인'},{radarId:'open-calls',itemId:'b',officialUrl:'https://other.example/b'},{radarId:'lectures',itemId:'a',officialUrl:'https://wrong.example'}]});
 assert.equal(out[0].items[0].officialUrl,'https://org.example/a');assert.equal(out[0].items[0].fields.at(-1).value,'2026-11-01 공식 공고 확인');
 assert.equal(out[0].items[1].officialUrl,'https://org.example/b');
 const forced=applyLinkOverrides([radar],{schemaVersion:'radar-link-overrides.v1',records:[{radarId:'open-calls',itemId:'b',officialUrl:'https://other.example/b',force:true}]});
 assert.equal(forced[0].items[1].officialUrl,'https://other.example/b');
 assert.equal(applyLinkOverrides([radar],null)[0].items[0].officialUrl,null);
 assert.throws(()=>applyLinkOverrides([radar],{records:'x'}),/ledger/);
});
