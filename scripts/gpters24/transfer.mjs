export const transferExamples=[
 {domain:'콘텐츠 제작',scope:'다음에 게시할 글 3개의 자료 준비 확인',target:'게시할 글',resource:'필요한 자료',state:'내 자료 보관함',question:'지금 자료가 갖춰진 글은 무엇인가?',boundary:'자료가 있어도 사실 확인·게시 승인이 끝났다는 뜻은 아니다.'},
 {domain:'팀 업무',scope:'신입 온보딩 작업 3개의 준비 확인',target:'시작할 작업',resource:'필요한 문서',state:'프로젝트 자료함',question:'현재 문서가 준비된 작업은 무엇인가?',boundary:'문서 보유와 작업 완료는 별도의 상태다.'},
 {domain:'학습 계획',scope:'이번 단원 학습 활동 3개의 준비 확인',target:'진행할 활동',resource:'필요한 교재',state:'수업 준비물 목록',question:'지금 교재가 준비된 활동은 무엇인가?',boundary:'교재 보유와 학생의 이해 여부는 별도의 근거가 필요하다.'}
];
export function blankDomainPlan(){return {target:'',resource:'',state:'',relationMeaning:'',rule:'',unknown:'',change:'',expected:['','',''],evidence:['','','']};}
export function parseDomainPlan(value){
 const d={...blankDomainPlan(),...(value||{})};
 for(const k of ['target','resource','state','relationMeaning','rule','unknown','change'])if(typeof d[k]!=='string'||d[k].length>4000)throw Error('내 도메인 설계 문장을 확인하세요.');
 for(const k of ['expected','evidence'])if(!Array.isArray(d[k])||d[k].length!==3||d[k].some(x=>typeof x!=='string'||x.length>4000))throw Error('예상 답과 근거는 질문별 3개가 필요합니다.');
 return Object.fromEntries(Object.keys(blankDomainPlan()).map(k=>[k,d[k]]));
}
export function domainGuide(){return `# 요리 예제를 내 도메인으로 옮기기

## 1. 반복하는 판단 하나로 좁히기
‘회사 지식관리’보다 ‘신입 온보딩 작업 3개의 문서 준비 확인’처럼 정합니다.
첫 테스트는 자료 3–5개, 대상 5–8개, 종류 2–3개, 관계 2종을 목표로 합니다.
공식 공지의 준비 노트 10개 중 일부를 골라 작게 검증한 뒤 넓힐 수 있습니다.

## 2. 세 역할을 내 말로 설명하기
요리 → 내가 고르거나 판단할 대상 / 재료 → 필요한 조건·자원 / 보관함 → 현재 확인한 자료·상태.
관계의 뜻을 실제 업무에 맞게 정하고, 시작 종류 → 끝 종류와 근거 문장을 함께 기록합니다.
${transferExamples.map(e=>`- ${e.domain}: ${e.target} / ${e.resource} / ${e.state}. 질문: ${e.question} ${e.boundary}`).join('\n')}

## 3. 직접 확인할 질문 세 개 쓰기
Q1 현재 가능한 대상은? Q2 한 대상에 빠진 조건은? Q3 조건 하나를 바꾸면 무엇이 달라지는가?
이 틀이 맞지 않는 주제라면 실제 업무에서 확인할 질문으로 바꿉니다.
각 질문에 예상 답, 확인할 원문 문장, 보류할 조건을 미리 적습니다.
‘정보가 없다’와 ‘조건을 만족하지 않는다’를 구분합니다.

## 4. 작은 반례로 검증하기
원자료 → 문서 링크 → 의미 관계 → 질문의 답 순서로 확인합니다.
관계 하나를 잘못 연결해 검사하고, 조건 하나를 바꿔 예상한 답 변화와 비교합니다.
학생의 이해·승인 완료처럼 별도 근거가 필요한 상태를 자료 보유만으로 추정하지 않습니다.
`;
}
export function domainPlanMarkdown(p){const d=parseDomainPlan(p.domainPlan);return `# 내 도메인 설계 기록

주제: ${p.title}
범위: ${p.scope}

- 요리에 해당하는 판단 대상: ${d.target}
- 재료에 해당하는 조건·자원: ${d.resource}
- 보관함에 해당하는 확인된 상태: ${d.state}
- 내 관계의 뜻·방향·근거: ${d.relationMeaning}
- 답을 판단하는 규칙: ${d.rule}
- 모르면 보류할 조건: ${d.unknown}
- 바꿔 볼 조건 하나: ${d.change}
`;}
export function testDesignMarkdown(p){const d=parseDomainPlan(p.domainPlan);return `# 예상 답과 반례 — 평가 대상 에이전트에게 읽히지 않는 확인용 기록

${p.questions.map((q,i)=>`## Q${i+1}. ${q}\n예상 답: ${d.expected[i]}\n확인할 원문·문장: ${d.evidence[i]}`).join('\n\n')}

변경할 조건: ${d.change}
정보가 부족해 보류할 조건: ${d.unknown}

이 문서는 설계자가 적은 예상값입니다. 실제 LLM 실행 결과는 response-template.json에 별도로 기록합니다.
`;}
export function designPrompt(p){const d=parseDomainPlan(p.domainPlan);return `내 주제는 ${p.title||'[주제]'}이고, 범위는 ${p.scope||'[판단 하나]'}입니다.
내 판단 대상은 ${d.target||'[대상]'}, 조건·자원은 ${d.resource||'[자원]'}, 현재 확인한 상태는 ${d.state||'[상태]'}입니다.
관계의 뜻: ${d.relationMeaning||'[내 업무에서 두 대상을 잇는 말]'}
판단 규칙: ${d.rule||'[어떤 근거가 모이면 어떻게 답하는가]'}
보류 조건: ${d.unknown||'[무엇을 모르면 답할 수 없는가]'}

내 원자료 3–5개와 고정 질문 3개를 읽고 작은 온톨로지를 제안해 주세요.
종류 2–3개, 대상 5–8개, 관계 2종 정도부터 시작하고 자료에 없는 사실은 만들지 마세요.
각 관계는 시작 ID / 읽는 말 / 끝 ID / 근거 문서·문장으로 보여 주세요.
종류와 개별 대상을 구분하고 같은 대상에는 같은 ID를 사용하세요.
기존 personal-project.json의 model만 수정한 작업 복사본과 practice/model.json을 작성해 주세요. 질문·설계 기록·실제 평가 기록은 보존하세요.
웹에서 작업 복사본을 불러와 관계망과 검사를 확인하겠습니다.
${p.questions.map((q,i)=>`Q${i+1}. ${q||'[내 질문]'}`).join('\n')}`;}
