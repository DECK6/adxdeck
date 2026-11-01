import {createHash} from 'node:crypto';
// Only material call facts participate; a fresh check time or user state does not stale a review.
const factKeys=['id','title','deadline_kst','deadline_date','qualification','rights_gate','cost_gate','work_fit','submission','benefit','benefits','presence','application_fee','carried_spec','deadline_conflict'];
export function candidateFingerprint(candidate){return createHash('sha256').update(JSON.stringify(Object.fromEntries(factKeys.map(k=>[k,candidate[k]??null])))).digest('hex');}
const unknown='미확인 · 공식 조건 재확인 필요';
export function withKoreanAnalysis(item,candidate,overlay){
 const entry=overlay?.items?.find(x=>x.id===item.id),valid=entry&&entry.sourceFingerprint===candidateFingerprint(candidate);
 const a=valid?entry:{summary:'지원 분야와 세부 조건을 공식 자료에서 다시 확인해야 하는 공모입니다.',review:entry?'공식 조건이 기존 분석 이후 바뀌어 한국어 검토 갱신이 필요합니다. 이전 상금·참여 조건을 재사용하지 않습니다.':'세부 분석이 아직 없습니다. 자격·권리·비용을 확인하기 전에는 지원을 확정하지 않습니다.'};
 const highlights=[['지원 분야','applicationType'],['상금·지원금','prize'],['방문 의무','travel'],['항공·체류비','livingSupport'],['참가·제작비','fee']].map(([label,key])=>({label,value:a[key]||unknown}));
 highlights.push({label:'검토 의견',value:a.review});
 const fields=[...highlights,{label:'제출물·규격',value:a.requirements||unknown},{label:'지원 자격',value:a.eligibility||unknown},{label:'권리·활용 조건',value:a.rights||unknown},{label:'장소',value:a.location||unknown},{label:'행사·발표 일정',value:a.schedule||unknown},{label:'분석 근거',value:valid?`${a.basis||'기존 공식 확인 기록을 한국어로 정리'} · 분석 ${a.verifiedAt} · 원문 확인 ${candidate.last_official_check||'시점 미확인'}`:'공식 확인 후 한국어 분석 갱신 필요'}];
 // A submitted item keeps its authoritative submission proof and follow-up, not a fresh application recommendation.
 if(item.applicationStatus==='submitted')fields.unshift(...item.fields.filter(f=>['제출 확인','제출 근거','확인 범위','진행 구분'].includes(f.label)));
 return {...item,summary:item.applicationStatus==='submitted'?item.summary+' '+a.summary:a.summary,highlights,fields,nextAction:item.applicationStatus==='submitted'?'중복 지원하지 않고 발표·회신 및 확정 계약 조건을 확인합니다.':a.nextAction||a.review,deadlineLabel:item.deadlineAt?'':item.deadlineDate?'공식 날짜만 확인 · 정확한 마감 시각 미확인':'마감 시각 미확인'};
}
