export const cycleSteps=[
 ['query · explore','모르는 지점이 다음 작업을 정합니다.','‘태조는 누구인가?’에서 왕조가 빠졌다면, 답을 늘리기 전에 구분할 맥락을 찾습니다. 내 목적에 도움이 되는 미답변 질문을 골라 둡니다.'],
 ['explore','질문에 필요한 근거만 찾습니다.','허용한 출처에서 근거와 반례를 조사합니다. 출처의 시점과 적용 범위를 확인하고, 찾지 못한 것은 미확인으로 남깁니다.'],
 ['ingest · grow','새 자료가 기존 설명을 갱신합니다.','원문을 보존하고 기존 주장과 일치·보강·충돌을 비교합니다. 기존 노트를 먼저 보강하고 필요한 새 개념과 노트를 추가합니다.'],
 ['connect · ontology · wiki','같은 의미로 연결합니다.','개념 ID와 관계의 방향·조건을 맞춥니다. 모델의 변경이 설명과 예제에도 반영되도록 연결하고 근거 없는 관계는 넣지 않습니다.'],
 ['lint · review · query','좋아졌는지 같은 질문으로 확인합니다.','구조 검사와 내용 검토를 함께 수행합니다. 답·출처·미확인·시간을 전후로 비교하고, 개선되지 않은 결과도 기록합니다.'],
 ['learn · context · maintain','다음 사이클은 달라진 상태에서 시작합니다.','검증된 지식과 수정한 절차, 남은 질문을 저장합니다. 다음에는 같은 정리를 반복하지 않고 이 상태에서 재개합니다. 새 근거가 없으면 멈춥니다.']
];
export function operatingMarkdown(values){
 const fields=[['목적과 도메인','purpose'],['더 잘 답할 질문','question'],['집중 범위와 제외 범위','scope'],['우선순위와 설명의 깊이','priority'],['확장 방식과 방향 점검 주기','growth'],['허용 자료와 신뢰 기준','sources'],['자동 수정 범위','autonomy'],['사람 검토 대상','review'],['사이클과 중단 기준','stop']];
 return '# 내 지식을 계속 관리해 주는 에이전트 · 운영 규칙 초안\n\n운영 인터뷰로 보완한 뒤 기존 지식공간의 규칙과 함께 적용합니다.\n\n'+fields.map(([label,key])=>'## '+label+'\n\n'+String(values[key]||'[인터뷰에서 정하기]').trim()).join('\n\n')+'\n\n## 사이클 결과와 재개\n\n- 시작 상태·실제로 읽은 자료·변경 이유·영향받은 주장과 질문을 기록한다.\n- 원문·기존 ID·이전 답변을 보존한다. 삭제가 필요하면 우선 폐기 후보로 표시하고 검토한다.\n- 근거가 없으면 변경 없음, 충돌이 남으면 보류한다.\n- 같은 질문 3개로 정확성·일관성·출처·미확인·시간을 비교한다.\n- 다음 작업과 재개 위치를 저장한다.\n- 예약 실행은 호스트 스케줄러에 별도로 등록·확인하기 전에는 활성화된 것으로 간주하지 않는다.\n';
}
if(typeof document!=='undefined'){
 const $=id=>document.getElementById(id);
 document.querySelectorAll('[data-cycle]').forEach(button=>button.addEventListener('click',()=>{
  const index=Number(button.dataset.cycle);const [skill,title,body]=cycleSteps[index];
  document.querySelectorAll('[data-cycle]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  $('cycle-skill').textContent=skill;$('cycle-title').textContent=title;$('cycle-body').textContent=body;
 }));
 $('platform').addEventListener('change',()=>document.querySelectorAll('[data-akm]').forEach(pre=>pre.textContent=pre.textContent.replace(/^(\$akm|\/akm:akm|\/akm)/,$('platform').value)));
 document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
  const pre=$(button.dataset.copy);
  try{await navigator.clipboard.writeText(pre.textContent);$('copy-status').textContent='요청문을 복사했습니다. 자기 지식공간을 연 에이전트에 붙여 넣으세요.';}
  catch{const range=document.createRange();range.selectNodeContents(pre);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);$('copy-status').textContent='자동 복사를 사용할 수 없어 요청문을 선택했습니다. 복사 단축키로 복사하세요.';}
 }));
 $('load-graph').addEventListener('click',()=>{
  const frame=$('galaxy-frame');frame.hidden=false;frame.src=frame.dataset.src;$('graph-cover').hidden=true;
  $('graph-status').textContent='3D 그래프를 불러오는 중입니다. 표시되지 않으면 아래 큰 창 또는 2D 경로 보기를 이용하세요.';
  frame.addEventListener('load',()=>{$('graph-status').textContent='그래프 문서를 열었습니다. 드래그로 회전하고 휠로 확대합니다. WebGL을 사용할 수 없으면 아래 2D 경로 보기를 이용하세요.';},{once:true});
 });
 $('operating-form').addEventListener('submit',event=>{
  event.preventDefault();const text=operatingMarkdown(Object.fromEntries(new FormData(event.currentTarget)));
  const url=URL.createObjectURL(new Blob([text],{type:'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='my-knowledge-operating-rules.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
  $('card-status').textContent='운영 규칙 파일의 다운로드를 요청했습니다. 다운로드한 파일을 지식공간에 두고 에이전트와 인터뷰로 보완하세요.';
 });
 fetch('downloads/week4/manifest.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
  document.querySelectorAll('[data-size]').forEach(el=>{const bytes=data.packages[el.dataset.size].bytes;el.textContent=(bytes/1048576).toFixed(1)+' MiB';});
 }).catch(()=>{});
}
