import manifest from '../../ontology/study/downloads/resource-packs.json' with {type:'json'};

const h=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const prompts={
 'korean-construction':'README.md와 00-index.md를 읽고, apartment.json의 벽·개구부·문과 치수의 연결을 설명해줘. 모르는 값은 근거와 UNKNOWN을 보존해줘. 실습 사본에서 관계 하나를 바꾸고 검증 결과와 이유를 비교해줘.',
 'motion-rhythm':'SKILL.md를 읽고 온톨로지에서 느리지만 긴장감 있는 장면에 맞는 개념과 사례를 3개 이내로 찾아줘. 연결된 이미지를 실제로 열고, 속도·긴장·리듬을 구분한 12초 시간 악보를 작성해줘. 개념·장면 ID와 적용 구간을 남겨줘.'
};

export function resourcePacksPanel(full=false){return `<section class="panel" id="resource-packs" aria-labelledby="resource-heading">
 <p class="eyebrow">DOWNLOAD LIBRARY · ${h(manifest.revision)}</p>
 <h2 id="resource-heading">온톨로지를 내 작업에 가져오기</h2>
 <p>한국 주거 건축은 온톨로지 패키지로, 모션리듬은 <strong>스킬 + 온톨로지 한 세트</strong>로 받습니다. 압축을 풀고 README부터 시작하세요.</p>
 <div class="resource-grid">${manifest.packs.map(p=>`<article class="resource-card" id="pack-${h(p.id)}"><span class="resource-kind">${h(p.kind)}</span><h3>${h(p.title)}</h3><p>${h(p.summary)}</p><p class="tiny">${h(p.scope)}</p><a class="button primary" href="downloads/${h(p.file)}" download>${p.id==='motion-rhythm'?'스킬 + 온톨로지 세트 받기':'건축 온톨로지 받기'} ↓ <span>· ${(p.bytes/1024/1024).toFixed(1)} MB</span></a><p class="tiny">${h(p.version)} · ${p.fileCount}개 파일</p>${full?`<details><summary>받은 뒤 시작하기</summary><p>${h(p.start)}</p><p>${p.id==='motion-rhythm'?'motion-rhythm 폴더 전체를 함께 옮깁니다. SKILL.md와 ontology 폴더가 같은 세트 안에 있습니다. Python 3.10 이상에서 추가 패키지 없이 조회합니다.':'문서와 예제는 바로 읽을 수 있습니다. 검증 도구는 Python 3.11 이상과 requirements.txt의 패키지를 사용합니다.'}</p><pre><code>${h(prompts[p.id])}</code></pre><button class="button resource-copy" data-pack="${h(p.id)}">실습 요청문 복사</button><p class="tiny">SHA-256: <code class="resource-hash">${h(p.sha256)}</code></p></details>`:''}</article>`).join('')}</div>
 ${full?'<p class="tiny">Jev API는 내려받기와 기본 조회에 필요하지 않습니다. 작업에 사용할 때 스터디멤버의 자료와 브리프에 맞게 적용하세요.</p>':'<div class="small-actions"><a class="button" href="resources.html">구성과 시작 방법 보기 ↗</a></div>'}
 </section>`;}

export function resourcePage(){return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>온톨로지 자료실 · GPTers 24기</title><meta name="description" content="한국 주거 건축 온톨로지와 모션리듬 스킬·온톨로지 세트를 내려받고 내 자료에 적용합니다."><link rel="stylesheet" href="assets/style.css"></head><body><a class="skip" href="#main">본문으로 이동</a><main class="resource-shell" id="main"><a href="./">← 4주 실습실</a><header class="resource-header"><p class="eyebrow">GPTers 24 · RESOURCE LIBRARY</p><h1>지식 구조를<br>내 작업의 도구로.</h1><p class="lead">개념과 관계를 살펴보고, 근거를 조회하고, 에이전트의 작업에 연결합니다.</p><div class="small-actions"><a class="button" href="week1.html">1주차 교안 ↗</a><a class="button" href="my-topic.html">내 주제 실습실 ↗</a></div></header>${resourcePacksPanel(true)}<footer class="footer"><p>DECK · DEXA / GPTers 24기 · ${h(manifest.revision)}</p><a href="downloads/resource-packs.json">파일 목록·크기·해시</a></footer></main><script>document.querySelectorAll('.resource-copy').forEach(b=>b.addEventListener('click',async()=>{const text=b.previousElementSibling.textContent;try{await navigator.clipboard.writeText(text);b.textContent='복사했습니다';}catch{const r=document.createRange();r.selectNodeContents(b.previousElementSibling);const s=window.getSelection();s.removeAllRanges();s.addRange(r);b.textContent='요청문을 선택했습니다. 복사 단축키를 누르세요';}}));</script></body></html>`;}
