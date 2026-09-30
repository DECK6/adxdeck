import content from './week1-content.json' with {type:'json'};

export function weekOneFiles(week){
 if(week!==1)return {};
 return Object.fromEntries(Object.entries(content.documents)
  .filter(([name])=>name!=='04-instructor.md')
  .map(([name,text])=>['week1/'+name,text]));
}

export function weekOnePanel(){return `<section class="panel week1-entry" id="week1-jev" aria-labelledby="week1-heading">
 <p class="eyebrow">WEEK 01 · 최신 개정 ${content.revision}</p>
 <h2 id="week1-heading">AKM × Jev, 근거를 고르고 정의를 다듬기</h2>
 <p>내 자료 3–5개와 질문 3개로 LLM Wiki v1을 만듭니다. GitHub의 두 사례를 읽고 원문·판단 기록을 나눈 뒤, 15분 동안 분류 정의 한 곳을 검토합니다.</p>
 <div class="week1-cases"><div><h3>01 · kb-jev</h3><p>원문 보존 → 분류 → 사람 검토 → 교정 기록. 검색 성능 향상은 아직 실측되지 않았습니다.</p></div><div><h3>02 · Ontology + Jev</h3><p>정의 → 분류 → 모호함 검토 → 정의 수정 → 별도 자료 확인. 확신도 상승과 정답률 개선을 구분합니다.</p></div></div>
 <div class="small-actions"><a class="button primary" href="week1.html">1주차 사례·실습 전체 읽기 ↗</a><a class="button" href="week1.html#workshop">15분 정의 검토 실습 ↗</a><a class="button" href="downloads/jev-week1-student.zip" download>1주차 교안 ZIP ↓</a></div>
 <p class="tiny">API 실행은 선택입니다. 기존 관계망의 R 자료 4개와 Jev 실습의 N 자료 5개는 별도 예제입니다. 이번 1주차 본 실습은 N 자료로 진행합니다. 최초 교안 9월 26일 · 이번 개정 9월 30일.</p>
 </section>`;}
