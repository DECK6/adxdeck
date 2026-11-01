import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {makeKeyConfig,encryptDashboard} from '../lib.mjs';
import {decryptDashboard,busyOn} from '../../../dash/core.mjs';
const calendar=await import('../calendar.mjs').catch(()=>null);
const temp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'dexa-dash-calendar-'));

const raw={schemaVersion:'calendar-busy.v1',updatedAt:'2026-11-01T06:47:51.316Z',from:'2026-11-01',to:'2026-12-31',timeZone:'Asia/Seoul',
 calendars:[{id:'fixture@example.org',summary:'개인'},{id:'abc123@group.calendar.google.com',summary:'DEXA'}],
 busy:[{start:'2026-11-04T15:00:00+09:00',end:'2026-11-04T17:30:00+09:00',calendarId:'fixture@example.org',allDay:false,summary:'비밀 미팅'},
  {start:'2026-11-04T23:00:00+09:00',end:'2026-11-05T01:00:00+09:00',calendarId:'fixture@example.org',allDay:false},
  {start:'2026-11-06T00:00:00+09:00',end:'2026-11-07T00:00:00+09:00',calendarId:'abc123@group.calendar.google.com',allDay:true}]};

test('the calendar block keeps only busy intervals and a calendar count, never ids, names, titles or attendees',()=>{
 assert.ok(calendar,'calendar sanitizer is not implemented');
 const clean=calendar.sanitizeCalendar(raw);
 assert.equal(clean.schemaVersion,'calendar-busy.v1');assert.equal(clean.updatedAt,raw.updatedAt);assert.equal(clean.from,'2026-11-01');assert.equal(clean.to,'2026-12-31');
 assert.equal(clean.calendarCount,2);assert.equal('calendars' in clean,false);assert.ok(!JSON.stringify(clean).includes('DEXA'));
 assert.deepEqual(clean.busy[0],{start:'2026-11-04T15:00:00+09:00',end:'2026-11-04T17:30:00+09:00',allDay:false});
 assert.ok(!JSON.stringify(clean).includes('fixture@example.org'));assert.ok(!JSON.stringify(clean).includes('비밀 미팅'));
 assert.throws(()=>calendar.sanitizeCalendar({...raw,schemaVersion:'other'}),/calendar/i);
 assert.throws(()=>calendar.sanitizeCalendar({...raw,busy:[{start:'nope',end:'2026-11-04T17:30:00+09:00',allDay:false}]}),/busy/i);
 assert.throws(()=>calendar.sanitizeCalendar({...raw,busy:[{start:'2026-11-04T18:00:00+09:00',end:'2026-11-04T17:30:00+09:00',allDay:false}]}),/busy/i);
});

test('busyOn counts the intervals that touch a KST day and sums only the timed hours inside it',()=>{
 const busy=calendar.sanitizeCalendar(raw).busy;
 assert.deepEqual(busyOn('2026-11-04',busy),{count:2,hours:3.5,allDay:false});
 assert.deepEqual(busyOn('2026-11-05',busy),{count:1,hours:1,allDay:false});
 assert.deepEqual(busyOn('2026-11-06',busy),{count:1,hours:0,allDay:true});
 assert.deepEqual(busyOn('2026-11-07',busy),{count:0,hours:0,allDay:false});
 assert.deepEqual(busyOn('2026-11-04',[]),{count:0,hours:0,allDay:false});
});

test('the calendar block is encrypted with the radars and absent when no calendar file exists',async()=>{
 const key=await makeKeyConfig('fixture-calendar');
 const radar={schemaVersion:'radar.v1',id:'open-calls',title:'공모',updatedAt:'2026-11-01T03:00:00Z',occurrenceId:'one',runStatus:'HOLD',summary:'',items:[]};
 const enc=await encryptDashboard([radar],key,{calendar:calendar.sanitizeCalendar(raw)});
 assert.ok(!JSON.stringify(enc).includes('2026-11-04T15:00'));
 const plain=await decryptDashboard(enc,'fixture-calendar');
 assert.equal(plain.calendar.busy.length,3);assert.equal('summary' in plain.calendar.busy[0],false);
 await assert.rejects(encryptDashboard([radar],key,{calendar:{...raw,schemaVersion:'x'}}));
 const without=await decryptDashboard(await encryptDashboard([radar],key),'fixture-calendar');assert.equal('calendar' in without,false);
});

test('the real build CLI reads the vault calendar ledger and reports its interval count',async()=>{
 const dir=temp(),vault=path.join(dir,'vault'),key=path.join(dir,'key.json'),out=path.join(dir,'data.enc.json'),preload=path.join(dir,'transport.mjs');
 fs.writeFileSync(key,JSON.stringify(await makeKeyConfig('fixture-calendar-cli')),{mode:0o600});
 const calls=path.join(vault,'60-actions/runs/media-art-open-call-radar/one'),lectures=path.join(vault,'60-actions/runs/lecture-opportunity-radar/one'),cal=path.join(vault,'60-actions/runs/radar-dashboard/calendar');
 for(const d of [calls,lectures,cal])fs.mkdirSync(d,{recursive:true});
 for(const [file,data] of Object.entries({'candidate-state.json':{occurrence_id:'one',generated_at:'2026-11-01T00:00:00Z',candidates:[]},'checkpoint.json':{occurrence_id:'one',status:'complete'},'receipt.json':{occurrence_id:'one',purpose_status:'VERIFIED'}}))fs.writeFileSync(path.join(calls,file),JSON.stringify(data));
 fs.writeFileSync(path.join(lectures,'lecture-radar.v1.json'),JSON.stringify({schemaVersion:'radar.v1',id:'lectures',title:'lectures',updatedAt:'2026-10-31T22:00:00+09:00',occurrenceId:'l:1',runStatus:'HOLD',summary:'Test',items:[]}));
 fs.writeFileSync(path.join(cal,'latest.json'),JSON.stringify(raw));
 fs.writeFileSync(preload,'globalThis.fetch=async()=>new Response(JSON.stringify({records:[]}));');
 const result=spawnSync(process.execPath,['--import',preload,'scripts/dashboard/build.mjs','--vault',vault,'--key-file',key,'--out',out],{cwd:new URL('../../../',import.meta.url),encoding:'utf8',timeout:10000});
 assert.equal(result.status,0,result.stderr);
 const summary=JSON.parse(result.stdout);assert.deepEqual(summary.calendar,{busy:3,from:'2026-11-01',to:'2026-12-31',updatedAt:raw.updatedAt});
 const plain=await decryptDashboard(JSON.parse(fs.readFileSync(out)),'fixture-calendar-cli');assert.equal(plain.calendar.busy.length,3);assert.ok(!JSON.stringify(plain.calendar).includes('fixture@example.org'));
});
