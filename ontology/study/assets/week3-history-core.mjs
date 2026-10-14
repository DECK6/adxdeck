export const topics = {
  taejo: {label:'이름이 같으면 같은 사람일까?', claims:['A04','A05','A06','A07'], initial:'A06'},
  capital: {label:'한 번 천도하면 계속 수도일까?', claims:['A10','A19','A22'], initial:'A10'},
  record: {label:'사건일과 편찬일은 같은 날짜일까?', claims:['A12','A13'], initial:'A13'}
};

export function stats(d){
  return {notes:d.notes.length,concepts:d.concepts.length,claims:d.claims.length,
    sources:d.sources.filter(s=>s.kind!=='synthetic-interview').length,
    answered:d.questions.filter(q=>q.status==='answered').length,
    deferred:d.questions.filter(q=>q.status==='deferred').length};
}

export function validateClaim(d,a){
  const s=d.concepts.find(x=>x.id===a.subject),o=d.concepts.find(x=>x.id===a.object);
  const r=d.relations.find(x=>x.id===a.predicate);
  if(!s||!o||!r)return {valid:false,reason:'대상 또는 관계 정의가 없습니다.'};
  if(!s.type_ids.some(t=>r.domain_types.includes(t))||!o.type_ids.some(t=>r.range_types.includes(t)))
    return {valid:false,reason:'이 관계에 지정한 주어·목적어 타입과 맞지 않습니다.'};
  if(a.status!=='current'||a.basis!=='source-supported'||!a.conditions?.trim()||!a.evidence?.length)
    return {valid:false,reason:'현재 근거와 적용 조건을 확인해야 합니다.'};
  if(!a.evidence.every(e=>e.locator?.trim()&&d.sources.some(s=>s.id===e.source_id&&s.read&&s.kind!=='synthetic-interview')))
    return {valid:false,reason:'읽은 출처와 근거 위치가 부족합니다.'};
  return {valid:true,reason:'타입·조건·등록 출처 대응 확인. 내용의 참을 보증하는 판정은 아닙니다.'};
}

export function comparison(d,topic){
  const selected=d.claims.filter(a=>topics[topic].claims.includes(a.id));
  const nodeIds=new Set(selected.flatMap(a=>[a.subject,a.object]));
  const relations=d.relations.filter(r=>selected.some(a=>a.predicate===r.id));
  const typeIds=new Set(relations.flatMap(r=>[...r.domain_types,...r.range_types]));
  return {
    facts:{nodes:d.concepts.filter(c=>nodeIds.has(c.id)),edges:selected.map(a=>({...a,from:a.subject,to:a.object,label:d.relations.find(r=>r.id===a.predicate).label}))},
    schema:{nodes:d.types.filter(t=>typeIds.has(t.id)),edges:relations.map(r=>({...r,from:r.domain_types[0],to:r.range_types[0]}))}
  };
}

export function answerQuestion(d,key){
  const required={capital:['A10','A11','A19','A20','A22','A23'],palace:['A10','A11','A25','A26'],taejo:['A04','A05','A06','A07'],date:['A23'],conflict:['A09']};
  const ids=required[key]||[];
  const claims=ids.map(id=>d.claims.find(a=>a.id===id)).filter(Boolean);
  const sourceIds=[...new Set(claims.flatMap(a=>a.evidence.map(e=>e.source_id)))].filter(id=>d.sources.some(s=>s.id===id));
  const base={claimIds:claims.map(a=>a.id),sourceIds};
  if(!ids.length||claims.length!==ids.length||!claims.every(a=>validateClaim(d,a).valid))
    return {...base,status:'unknown',answer:'현재 자료로는 이 질문에 충분히 답할 수 없습니다. 필요한 사건·조건·출처를 더 읽어야 합니다.',next:'미답변을 남기고 추가 조사를 요청합니다.'};
  const year=aid=>d.concepts.find(c=>c.id===d.claims.find(a=>a.id===aid).object).year;
  const label=cid=>d.concepts.find(c=>c.id===cid).label;
  if(key==='taejo')return {...base,status:'ambiguous',answer:`‘태조’만으로 한 사람을 고를 수 없습니다. ${label('C01')}는 조선, ${label('C02')}은 고려와 연결됩니다. 같은 호칭을 공유해도 두 인물 ID는 합치지 않습니다.`,next:'어느 왕조의 태조인지 맥락을 확인합니다.'};
  if(key==='capital')return {...base,status:'supported',answer:`${year('A11')}년 한양 천도 뒤 ${year('A20')}년 개경 환도, ${year('A23')}년 한양 재천도가 있습니다. 따라서 처음 천도한 뒤 계속 한양이었다고 할 수 없습니다.`,next:'이동 사건의 목적지와 영구 수도 상태를 구별합니다.'};
  if(key==='palace')return {...base,status:'supported',answer:`한양 천도는 ${year('A11')}년, 경복궁 창건은 ${year('A26')}년입니다. C10과 C23은 별개의 사건이며 한양과 경복궁도 같은 장소 ID가 아닙니다.`,next:'천도·창건·현존 건물의 연대를 각각 구별합니다.'};
  if(key==='date')return {...base,status:'unknown',answer:'1405년 재천도는 연도 정밀도로 저장했습니다. 이 자료만으로 정확한 현대 양력 월·일을 답할 수 없습니다.',next:'없는 월·일을 채우지 않고 더 정밀한 근거를 찾습니다.'};
  return {...base,sourceIds:['S003','S005'].filter(id=>d.sources.some(s=>s.id===id)),status:'unknown',answer:'국호 변경을 다룬 기사와 해제의 월 표기가 다릅니다. CF1은 미해결이며, 역법 차이나 오탈자로 임의 결론 내리지 않았습니다.',next:'Q8을 보류하고 차이의 원인을 설명할 자료를 조사합니다.'};
}
