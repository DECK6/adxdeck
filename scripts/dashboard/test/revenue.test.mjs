import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {makeKeyConfig,encryptDashboard} from '../lib.mjs';
import {decryptDashboard} from '../../../dash/core.mjs';
const revenue=await import('../revenue.mjs').catch(()=>null);
const build=await import('../build.mjs').catch(()=>null);
const temp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'dexa-dash-revenue-'));

const note=`---
description: "Revenue plan fixture"
date created: 2026-10-30
date modified: 2026-10-30T13:50:00+09:00
tags: [revenue]
---

# 수익 아이템과 기간별 기대수익 설계

> 기준일 2026-10-30. 조사 범위: 세션 전수.
> **표기 규칙**: \`확인\` = 읽은 값. \`가정\` = 추정값.

## 0. 결론 먼저

1. **12/31까지 가장 확실한 돈은 "이미 번 돈 회수"다.** 신규 영업보다 먼저 회수한다.
2. **단기 신규 수익의 축은 3개**다.

## 1. 확인된 수치 (근거 있는 값만)

### 1-1. 단가·금액

| 항목 | 값 | 출처 |
|---|---|---|
| 기업 온라인 라이브 강의 | 회당 50만원 세전 / 120분 | 제안 메일 9/17 |

### 1-2. 청중·자산 규모

| 채널 | 값 |
|---|---|
| Threads @fixture | 팔로워 1,210명 (두 번째 청중) |

## 2. 수익 아이템 16종 — 현재 상태와 기간별 기대수익

범례: 단기 = ~2026-12-31 입금 기준.

### A. 자문·컨설팅

| # | 아이템 | 현재 상태 | 단기 | H1 | H2 | 장기(연) | 준비물 |
|---|---|---|---|---|---|---|---|
| A1 | **FIXTURE_CLIENT 포털 자문** (중개자 프라임) | 계약 전. 최초 미팅으로 범위 확정 예정 | 0~500만 | 1,000~3,500만 (B안) | 1,000~5,000만 | 3,000만~1억 | 단가·계약주체 합의, NDA |

### B. 강의·교육

| # | 아이템 | 현재 상태 | 단기 | H1 | H2 | 장기(연) | 준비물 |
|---|---|---|---|---|---|---|---|
| B1 | **기업·공공 출강** | 지원 13곳 회신 0 | 50~200만 | 600~2,400만 | 1,500~3,000만 | 4,000~6,000만 | 신규 주제 2종 제출 |
| B2 | **NCA 4기 재계약** | 3기 12/17 종료 | [확정 대기] | [확정 대기] | [확정 대기] | — | 3기 성과 정리 |

### F. 즉시 회수 (신규 수익 아님, 현금)

| 항목 | 금액 | 상태 | 행동 |
|---|---|---|---|
| CES 영상비 | 350만 | **수령 완료** | 없음 |

## 3. 기간별 합계

| 기간 | 보수적 | 기준(Base) | 확장(Stretch) | 핵심 전제 |
|---|---|---|---|---|
| **~12/31 신규 입금** | 200만 | 400~700만 | 1,500만 | Base = 소형 건 합계 |
| **2027 H1** | 1,500만 | 3,000~6,000만 (월 500~1,000만) | 1억+ | Base = 자문 + 강의 |

마스터의 기존 목표는 H1 Base 하단이다.

## 4. 상충·충돌 분석

| # | 충돌 | 내용 | 해소안 |
|---|---|---|---|
| 1 | **시간: 11월 첫 2주 과밀** | 마감 7개 | 우선순위 조정 |

## 5. 이번 주 행동 (10/30~11/6)

1. **회수**: 계약·입금 확인. (반나절)
2. **회신 2통**: 미팅 수락. (1시간)

## 6. 필요한 것 (준비물 총괄)

| 분류 | 항목 | 상태 |
|---|---|---|
| 결제 인프라 | 크몽·Gumroad | 없음 |

## 7. 가정과 한계

- 모든 금액은 가정이다.

## 8. 근거 경로

- Gmail 전수 조사: 세션 FIXTURE_SESSION_ID (/Users/example/private.csv)
- 연락: fixture@example.org

## 9. 정정 이력

- 2026-10-30 정정 1건.

## 10. 결정 지점

| 날짜 | 결정 지점 | 비고 |
|---|---|---|
| 2026-11-04 | LED 미팅 16:00 | 이용료·정산 질문 |
| 2026-11-21 | 본선 | 예선 통과 시 |
`;

test('the revenue plan note parses into structured items, totals, actions and milestones without raw markup',()=>{
 assert.ok(revenue,'revenue plan parser is not implemented');
 const plan=revenue.parseRevenuePlan(note);
 assert.equal(plan.title,'수익 아이템과 기간별 기대수익 설계');
 assert.equal(plan.baseDate,'2026-10-30');
 assert.equal(plan.noteModified,'2026-10-30T13:50:00+09:00');
 assert.equal(plan.conclusions.length,2);assert.ok(!plan.conclusions[0].includes('**'));
 assert.deepEqual(plan.items.map(i=>i.code),['A1','B1','B2']);
 assert.equal(plan.items[0].category,'A');assert.equal(plan.items[0].categoryLabel,'자문·컨설팅');
 assert.equal(plan.items[0].name,'FIXTURE_CLIENT 포털 자문 (중개자 프라임)');
 assert.equal(plan.items[0].h1,'1,000~3,500만 (B안)');assert.equal(plan.items[0].tag,'계약 전');
 assert.equal(plan.items[1].radar,'lectures');assert.equal(plan.items[2].h1,'[확정 대기]');assert.equal(plan.items[2].tag,'확정 대기');
 assert.equal(plan.recoveries[0].status,'수령 완료');
 assert.equal(plan.kpis.length,2);assert.equal(plan.kpis[1].label,'2027 H1');assert.equal(plan.kpis[1].base,'3,000~6,000만 (월 500~1,000만)');
 assert.equal(plan.conflicts[0].title,'시간: 11월 첫 2주 과밀');
 assert.deepEqual(plan.actions[0],{n:1,label:'회수',text:'계약·입금 확인. (반나절)'});
 assert.equal(plan.preparations[0].item,'크몽·Gumroad');assert.equal(plan.audience[0].value,'팔로워 1,210명 (두 번째 청중)');
 assert.deepEqual(plan.milestones[0],{date:'2026-11-04',label:'LED 미팅 16:00',note:'이용료·정산 질문'});
});

test('exported full text drops the frontmatter and the private evidence-path section',()=>{
 const plan=revenue.parseRevenuePlan(note);
 assert.ok(!plan.markdown.startsWith('---'));
 assert.ok(plan.markdown.includes('## 9. 정정 이력'));
 assert.ok(!plan.markdown.includes('FIXTURE_SESSION_ID'));assert.ok(!plan.markdown.includes('/Users/example'));assert.ok(!plan.markdown.includes('fixture@example.org'));
 assert.doesNotThrow(()=>build.assertPrivateExport([revenue.sanitizeRevenue(plan)]));
});

test('the revenue block is encrypted with the radars and never leaves a plaintext sentinel',async()=>{
 const key=await makeKeyConfig('fixture-revenue-tab');
 const plan=revenue.sanitizeRevenue(revenue.parseRevenuePlan(note));
 const radar={schemaVersion:'radar.v1',id:'open-calls',title:'공모',updatedAt:'2026-11-01T03:00:00Z',occurrenceId:'one',runStatus:'HOLD',summary:'',items:[]};
 const enc=await encryptDashboard([radar],key,{revenue:plan});
 assert.ok(!JSON.stringify(enc).includes('FIXTURE_CLIENT'));
 const plain=await decryptDashboard(enc,'fixture-revenue-tab');
 assert.equal(plain.revenue.schemaVersion,'revenue-plan.v1');assert.equal(plain.revenue.items[0].code,'A1');assert.equal(plain.revenue.kpis.length,2);
 await assert.rejects(encryptDashboard([radar],key,{revenue:{...plan,items:'bad'}}));
 const without=await decryptDashboard(await encryptDashboard([radar],key),'fixture-revenue-tab');assert.equal('revenue' in without,false);
});

test('the latest revenue note is located by its modification date and a vault without one yields no block',()=>{
 const vault=temp();
 assert.equal(revenue.latestRevenuePlan(vault),null);
 fs.mkdirSync(path.join(vault,'00-inbox'),{recursive:true});fs.mkdirSync(path.join(vault,'80-outputs/revenue'),{recursive:true});
 fs.writeFileSync(path.join(vault,'00-inbox/2026-10-30-revenue-plan-2026q4-2027.md'),note);
 fs.writeFileSync(path.join(vault,'80-outputs/revenue/2026-09-01-revenue-plan-old.md'),note.replace('date modified: 2026-10-30T13:50:00+09:00','date modified: 2026-09-01T00:00:00+09:00'));
 const found=revenue.latestRevenuePlan(vault);
 assert.match(found.path,/00-inbox\/2026-10-30-revenue-plan-2026q4-2027\.md$/);assert.equal(found.data.noteModified,'2026-10-30T13:50:00+09:00');
});

test('the real build CLI includes the revenue plan from the vault note alongside both radars',async()=>{
 const dir=temp(),vault=path.join(dir,'vault'),key=path.join(dir,'key.json'),out=path.join(dir,'data.enc.json'),preload=path.join(dir,'transport.mjs');
 fs.writeFileSync(key,JSON.stringify(await makeKeyConfig('fixture-revenue-cli')),{mode:0o600});
 const calls=path.join(vault,'60-actions/runs/media-art-open-call-radar/one'),lectures=path.join(vault,'60-actions/runs/lecture-opportunity-radar/one');fs.mkdirSync(calls,{recursive:true});fs.mkdirSync(lectures,{recursive:true});fs.mkdirSync(path.join(vault,'00-inbox'),{recursive:true});
 for(const [file,data] of Object.entries({'candidate-state.json':{occurrence_id:'one',generated_at:'2026-11-01T00:00:00Z',candidates:[]},'checkpoint.json':{occurrence_id:'one',status:'complete'},'receipt.json':{occurrence_id:'one',purpose_status:'VERIFIED'}}))fs.writeFileSync(path.join(calls,file),JSON.stringify(data));
 fs.writeFileSync(path.join(lectures,'lecture-radar.v1.json'),JSON.stringify({schemaVersion:'radar.v1',id:'lectures',title:'lectures',updatedAt:'2026-10-31T22:00:00+09:00',occurrenceId:'l:1',runStatus:'HOLD',summary:'Test',items:[]}));
 fs.writeFileSync(path.join(vault,'00-inbox/2026-10-30-revenue-plan-2026q4-2027.md'),note);
 fs.writeFileSync(preload,'globalThis.fetch=async()=>new Response(JSON.stringify({records:[]}));');
 const result=spawnSync(process.execPath,['--import',preload,'scripts/dashboard/build.mjs','--vault',vault,'--key-file',key,'--out',out],{cwd:new URL('../../../',import.meta.url),encoding:'utf8',timeout:10000});
 assert.equal(result.status,0,result.stderr);
 const summary=JSON.parse(result.stdout);assert.equal(summary.revenue.items,3);assert.equal(summary.revenue.noteModified,'2026-10-30T13:50:00+09:00');
 const plain=await decryptDashboard(JSON.parse(fs.readFileSync(out)),'fixture-revenue-cli');assert.equal(plain.radars.length,2);assert.equal(plain.revenue.milestones.length,2);
});
