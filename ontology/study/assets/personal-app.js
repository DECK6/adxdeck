(()=>{var M=[{title:"내 주제와 자료로 출발",time:"실습 40–60분",steps:["최근 반복해서 찾는 업무·연구 주제를 한 문장으로 좁힙니다.","자신의 노트 10개와 출처를 모으고, 찾기·관계·판단 보류 질문을 하나씩 정합니다.","정리 전 답변을 기록한 뒤 AKM에서 Wiki를 만들고 문서 링크를 확인합니다."],done:"도메인 정의서, 자료 10개, 고정 질문 3개, before 응답, LLM Wiki v1",check:"아무 자료나 한 개 골랐을 때 출처와 연결 문서를 다시 찾을 수 있나요?",post:"무엇을 자주 찾았고 어떤 구조로 바꿨는지 사례글로 남깁니다."},{title:"내 질문에 필요한 관계 설계",time:"실습 40–60분",steps:["1주차에 답하기 어려웠던 질문을 골라 필요한 대상 5개 이상을 찾습니다.","종류 2개 이상, 관계 2종 이상을 정의하고 실제 관계 5개를 근거와 연결합니다.","속성 하나를 추가하고 잘못된 연결 하나를 넣어 검사한 뒤 수정합니다."],done:"자기 주제의 종류·관계·속성, 모델 JSON, 설계 노트, 오류 수정 기록",check:"선 하나를 읽는 말로 설명하고 그 근거 문장을 열어볼 수 있나요?",post:"단순 문서 링크에 어떤 의미를 더했는지 사례글로 설명합니다."},{title:"내 AKM에 적용하고 실제 질문",time:"실습 40–60분",steps:["내 작업 ZIP을 내려받고 기존 실습 AKM에서 원본·정리 노트·모델을 확인합니다.","모델을 문서의 ID·관계·메타데이터에 반영하고 사용하는 에이전트에 폴더를 연결합니다.","같은 질문 3개를 새 대화에서 실행하고 실제 답변·근거·모델명을 보관합니다."],done:"내 에이전트 연결 데모, 실제 after 응답 JSON, 출처 확인 기록",check:"답변의 핵심 문장마다 내 원자료의 어느 부분이 근거인지 확인했나요?",post:"정상 답변과 실패 또는 판단 보류 장면을 함께 사례글에 넣습니다."},{title:"내 시스템의 변화와 운영",time:"발표 준비 30–40분",steps:["1주차의 고정 질문과 before 응답을 유지하고 적용 후 답변과 비교합니다.","정확성·일관성·출처를 같은 기준으로 평가하고 개선되지 않은 점도 기록합니다.","새 자료 한 개가 들어오는 상황을 가정해 추가·수정·폐기·재검사 규칙을 정합니다."],done:"완성 시스템, 실제 전후 평가, 운영 규칙, 최종 발표",check:"다른 수강생이 내 파일과 설명만으로 자료→관계→답변의 근거를 따라갈 수 있나요?",post:"새 과제 없이 완성한 시스템을 발표합니다."}];function F(o){let e=M[o-1];return`# ${o}주차 · ${e.title}

${e.time} — 시간은 권장값입니다.

${e.steps.map((t,a)=>`${a+1}. ${t}`).join(`
`)}

## 완료 기준
${e.done}

## 동료 확인 질문
${e.check}

## 기록과 공유
${e.post}

초등교육·건축 예시에서 관계를 읽는 방법을 확인한 뒤, 자기 주제의 대상과 근거로 바꿉니다. 예시 이름만 바꾸거나 참고 답변을 실제 성과로 제출하지 않습니다.
`}var J={revision:"FAMILY-02",sourceSha256:"95af5e56fd279fa14981b9813e114c7fbef2bcb503f5f3b80d5388f4e436d681",rooms:[{id:"LIVING",label:"거실",points:[[3860,0,0],[10540,0,0],[10540,5540,0],[3860,5540,0],[3860,0,0]]},{id:"DINING",label:"다이닝",points:[[3860,5660,0],[7740,5660,0],[7740,9200,0],[3860,9200,0],[3860,5660,0]]},{id:"KITCHEN",label:"주방",points:[[0,6160,0],[3740,6160,0],[3740,9200,0],[0,9200,0],[0,6160,0]]},{id:"HALL",label:"현관 · 홀",points:[[7860,5660,0],[10540,5660,0],[10540,9200,0],[7860,9200,0],[7860,5660,0]]},{id:"BED-1",label:"안방",points:[[0,0,0],[3740,0,0],[3740,4240,0],[0,4240,0],[0,0,0]]},{id:"BED-2",label:"침실 2",points:[[10660,0,0],[14600,0,0],[14600,4440,0],[10660,4440,0],[10660,0,0]]},{id:"BED-3",label:"침실 3",points:[[10660,4560,0],[14600,4560,0],[14600,7140,0],[10660,7140,0],[10660,4560,0]]},{id:"BATH-1",label:"공용 욕실",points:[[10660,7260,0],[14600,7260,0],[14600,9200,0],[10660,9200,0],[10660,7260,0]]},{id:"BATH-2",label:"안방 욕실",points:[[0,4360,0],[2340,4360,0],[2340,6040,0],[0,6040,0],[0,4360,0]]},{id:"DRESS",label:"드레스룸",points:[[2460,4360,0],[3740,4360,0],[3740,6040,0],[2460,6040,0],[2460,4360,0]]}]};var h=(o,e,t,a=[])=>({id:o,title:e,body:t,links:a}),E=(o,e,t,a,s={})=>({id:o,label:e,type:t,noteId:a,attrs:s}),A=(o,e,t,a)=>({from:o,rel:e,to:t,source:a}),y=(o,e,t)=>({label:o,from:e,to:t}),ae=[{title:"내 지식을 Wiki로",short:"LLM Wiki",date:"9월 30일",lead:"흩어진 노트 10개를, AI가 찾아 읽는 지식으로.",goal:"자료의 출처를 보존하고 문서 구조·인덱스·링크를 만듭니다. AKM으로 시작하는 것을 권장합니다.",steps:["자료 10개를 읽고 내 도메인의 범위를 한 문장으로 정하세요.","질문 3개에 대한 현재 에이전트의 답과 출처를 기록하세요.","AKM에 원본과 정리한 지식을 나눠 넣고 관계망을 확인하세요."],output:"도메인 정의서 · 진단 기록 · LLM Wiki v1",homework:"대표 노트를 재구조화한 과정과 달라진 점을 사례글 1편으로 남기세요."},{title:"관계에 뜻을 더하기",short:"온톨로지 설계",date:"10월 7일",lead:"링크가 있다는 것에서, 어떤 관계인지 아는 것으로.",goal:"답하지 못한 질문에서 출발해 대상의 종류·속성·관계와 검사 규칙을 정의합니다.",steps:["문서 링크만으로 답하기 어려운 질문을 하나 고르세요.","아래 만들기 도구에서 대상과 관계를 추가하고 원문을 연결하세요.","검사 오류를 확인하고 JSON·OWL 파일과 설계 노트를 내보내세요."],output:"내 도메인 온톨로지 스키마 v1",homework:"추가한 관계가 어떤 질문을 해결하는지 사례글 1편으로 설명하세요."},{title:"에이전트가 찾아 쓰게",short:"에이전트 연결",date:"10월 14일",lead:"관계를 따라 찾고, 근거를 함께 답하게 만듭니다.",goal:"스키마를 문서와 메타데이터에 반영하고 본인이 쓰는 에이전트에 파일을 연결합니다.",steps:["3주차 파일을 새 실습 AKM에 넣고 에이전트에서 그 폴더를 여세요.","연결 프롬프트를 붙여 넣고 같은 질문 3개를 실행하세요.","답의 문장마다 출처와 모르는 범위가 있는지 확인하세요."],output:"출처와 함께 답하는 에이전트 연결 데모",homework:"실제 에이전트의 답·출처·실패 장면을 담아 사례글 1편을 작성하세요."},{title:"나아졌는지 확인하기",short:"평가와 운영",date:"10월 21일",lead:"같은 질문으로 비교하고, 오래 쓸 규칙을 남깁니다.",goal:"정확성·일관성·출처를 비교하고 자료 추가·수정·폐기와 스키마 변경의 운영 기준을 정합니다.",steps:["1주차에 남긴 질문·답변을 그대로 불러오세요.","현재 답변과 근거를 나란히 읽고 같은 기준으로 평가하세요.","개선되지 않은 질문과 다음 변경을 운영 노트에 남기세요."],output:"완성 시스템 · 평가 리포트 · 지속 운영 규칙",homework:"새 과제 없이 완성한 시스템을 최종 발표합니다."}],me={id:"education",name:"초등교육",eyebrow:"LEARNING PATH",accent:"#286f60",intro:"분수를 배우는 순서, 교재, 확인 질문을 연결합니다.",scope:"가상의 초등 수학 수업 설계 자료입니다. 선수 관계는 이 수업의 교수학습 가정이며 공식 교육과정의 필수 순서나 학생 진단 결과가 아닙니다.",provenance:"기존 초등교육 온톨로지의 학습 주제·교수학습 후보 관계·출처 구분 방식을 참고해 새로 작성했습니다. 실제 학생 기록과 교과서 원문은 포함하지 않습니다.",classes:{Topic:"학습 주제",Material:"교재",Assessment:"확인 질문",Path:"학습 경로",Plan:"수업 설계"},relations:{requires:y("먼저 확인한다",["Topic"],["Topic"]),teaches:y("학습을 돕는다",["Material"],["Topic"]),checks:y("이해를 확인한다",["Assessment"],["Topic"]),targets:y("도달 목표로 삼는다",["Path"],["Topic"]),documents:y("설계를 기록한다",["Plan"],["Path"])},notes:[h("E01","똑같이 나누기","한 장의 종이를 같은 크기의 네 부분으로 나눈다. 조각 수가 같아도 크기가 다르면 똑같이 나눈 것이 아니다. 다음 시간에 분수를 설명하기 전 이 장면을 먼저 확인한다. 이 자료는 교사가 만든 가상 수업 메모다.",["E02","E06"]),h("E02","분수의 뜻","전체를 같은 크기로 나눈 부분 중 몇 개를 택했는지 분수로 나타낸다. 전체를 5등분하고 2조각을 택하면 2/5이다. 먼저 E01의 똑같이 나누기를 확인한다. 분모는 전체를 나눈 수, 분자는 택한 부분 수다.",["E01","E03","E06"]),h("E03","단위분수","분자가 1인 분수를 단위분수라고 부른다. 3/5는 1/5 세 개로 설명할 수 있다. 분수의 뜻을 이해했는지 먼저 확인한다. 서로 다른 전체를 기준으로 분수의 크기를 비교하지 않도록 주의한다.",["E02","E04"]),h("E04","분모가 같은 분수의 크기 비교","같은 전체를 같은 수로 나눴을 때 선택한 부분 수를 비교한다. 2/5와 4/5는 1/5 두 개와 네 개로 비교한다. 이 수업에서는 단위분수를 먼저 확인한다. 비교 카드 M2와 확인 질문 A1을 사용한다.",["E03","E07","E08"]),h("E05","분모가 같은 분수의 덧셈","같은 전체에서 1/5와 2/5를 합하면 3/5이다. 분모를 더해 3/10으로 쓰는 오류를 구분한다. 이 수업 설계에서는 크기 비교까지 확인한 뒤 덧셈으로 이동한다. 이 순서는 교수학습 가정이지 모든 학생의 유일한 경로가 아니다.",["E04","E09"]),h("E06","교재 · 분수 띠 M1","같은 길이의 종이 띠를 2·3·4·5등분한 자료다. 직접 색칠해 분수의 뜻을 설명한다. 준비물은 종이와 색연필이다. 출판 교재를 복제한 것이 아니라 스터디용으로 작성한 활동 설명이다.",["E01","E02"]),h("E07","교재 · 비교 카드 M2","같은 전체를 5등분한 카드에 2/5, 3/5, 4/5를 각각 색칠한다. 어떤 수가 큰지 고르고 1/5의 개수를 근거로 말한다. 분모가 같은 분수의 크기 비교를 돕는 자료다.",["E04","E08"]),h("E08","확인 질문 A1 · 설명을 듣기","질문: 같은 크기의 두 종이에서 2/5와 4/5 중 어느 쪽이 더 큰가요? 왜 그렇게 생각했나요? 예시 기준: 4/5를 고르고 같은 전체·같은 단위의 개수로 설명한다. 학생 답변·점수·관찰 날짜는 아직 없다. 이 질문이 있다는 사실만으로 민지A의 이해 여부를 판단할 수 없다.",["E04","E07"]),h("E09","경로 P1 · 분수 덧셈 준비","도달 목표는 분모가 같은 분수의 덧셈이다. 제안 경로는 똑같이 나누기 → 분수의 뜻 → 단위분수 → 같은 분모의 크기 비교 → 덧셈이다. 어려움이 발견되면 앞 단계의 설명을 다시 살핀다. 자동 학생 배치 규칙은 아니다.",["E01","E02","E03","E04","E05","E10"]),h("E10","수업 설계와 근거의 경계","이 묶음은 GPTers 24기에서 관계와 출처를 다루기 위한 합성 사례다. requires는 이 수업에서 먼저 확인하기로 한 주제를 뜻한다. E09의 경로를 기록하고 관리한다. 실제 학생 성취, 공식 성취기준 충족, 효과 검증을 주장하지 않는다. 관계를 바꾸면 변경 이유와 검토자를 남긴다.",["E09"])],nodes:[E("T1","똑같이 나누기","Topic","E01"),E("T2","분수의 뜻","Topic","E02"),E("T3","단위분수","Topic","E03"),E("T4","분수 크기 비교","Topic","E04"),E("T5","동분모 분수 덧셈","Topic","E05"),E("M1","분수 띠","Material","E06"),E("M2","비교 카드","Material","E07"),E("A1","설명 확인 질문","Assessment","E08"),E("P1","덧셈 준비 경로","Path","E09"),E("S1","수업 설계 메모","Plan","E10")],edges:[A("T2","requires","T1","E02"),A("T3","requires","T2","E03"),A("T4","requires","T3","E04"),A("T5","requires","T4","E05"),A("M1","teaches","T2","E06"),A("M2","teaches","T4","E07"),A("A1","checks","T4","E08"),A("P1","targets","T5","E09"),A("S1","documents","P1","E10")],questions:["분모가 같은 분수의 덧셈 전에 어떤 주제를 어떤 순서로 확인하나요?","분수 크기 비교를 돕는 교재와 이해 확인 질문은 무엇인가요?","민지A가 분수 덧셈을 이해했다고 판단할 수 있나요?"],traps:["링크만 보면 선수 관계와 교재 연결이 같은 선으로 보입니다.","확인 질문이 있다는 사실과 학생이 실제로 답했다는 사실은 다릅니다."],error:{from:"T1",rel:"requires",to:"T5",source:"E10"},target:"T5"},$e={LIVING:"A02",DINING:"A03",KITCHEN:"A03",HALL:"A06","BED-1":"A04","BED-2":"A04","BED-3":"A04","BATH-1":"A05","BATH-2":"A05",DRESS:"A04"},oe=J.rooms.map((o)=>{let e=o.points.map((d)=>d[0]),t=o.points.map((d)=>d[1]),a=Math.min(...e),s=Math.min(...t),l=Math.max(...e)-a,n=Math.max(...t)-s;return E(o.id,o.label,"Space",$e[o.id],{role:o.id.startsWith("BED-")?"bedroom":o.id.startsWith("BATH-")?"bathroom":o.id.toLowerCase(),areaM2:Number((l*n/1e6).toFixed(4)),x:a,y:s,w:l,h:n})}),he={id:"architecture",name:"한국 주거 건축",eyebrow:"SPACE & EVIDENCE",accent:"#365e85",intro:"방 3개·욕실 2개, 넓은 거실과 통창을 가진 집을 읽습니다.",scope:"FAMILY-02 가상 주택을 줄여 만든 학습용 모델입니다. 원 모델의 공간 좌표를 사용하며 건축 인허가·구조 안전·법규 적합 판정은 포함하지 않습니다.",provenance:`이전에 만든 FAMILY-02(2026-09-10)의 공간 10개 좌표를 재사용했습니다. 원 모델 SHA-256: ${J.sourceSha256}. 부품 관계는 설명용 부분 모델입니다.`,classes:{Building:"주택",Space:"공간",Window:"창",Opening:"개구부",Wall:"벽",Door:"문",Drawing:"도면",Rule:"요구 조건"},relations:{contains:y("공간을 포함한다",["Building"],["Space"]),fillsOpening:y("개구부를 채운다",["Window"],["Opening"]),hostedBy:y("벽에 뚫려 있다",["Opening"],["Wall"]),bounds:y("경계를 이룬다",["Wall"],["Space"]),connects:y("공간에 연결된다",["Door"],["Space"]),depicts:y("형상을 나타낸다",["Drawing"],["Building"]),appliesTo:y("요구를 적용한다",["Rule"],["Building"])},notes:[h("A01","주택 요구사항 · FAMILY-02","요청은 침실 3개, 욕실 2개, 넓은 거실과 통창, 거실·주방·다이닝 분리다. 긴 복도를 줄인 FAMILY-02 가상 배치를 대상으로 한다. 실제 주소·대지 조건·허가 정보는 없다. 이 문서는 사용자 공간 요구를 실습용으로 다시 쓴 것이다.",["A02","A03","A04","A05","A09","A10"]),h("A02","거실 · 넓이와 위치","LIVING의 실내 경계는 mm 단위로 (3860,0)–(10540,5540)이다. 넓이는 37.0072㎡다. 남측 벽과 거실 통창을 확인한다. 수치는 FAMILY-02 모델 좌표로 계산했으며 현장 실측값이 아니다.",["A01","A07","A09"]),h("A03","주방과 다이닝 · 분리된 공간","KITCHEN은 (0,6160)–(3740,9200), DINING은 (3860,5660)–(7740,9200)이다. LIVING과 각각 다른 공간 ID와 형상을 갖는다. 주방은 11.3696㎡, 다이닝은 13.7352㎡다. 공간 간 문은 원 모델에 있으며 여기서는 대표 연결만 다룬다.",["A02","A08","A09"]),h("A04","침실 세 개와 드레스룸","BED-1은 안방, BED-2와 BED-3은 두 침실이다. DRESS는 드레스룸으로 침실 수에 포함하지 않는다. 원 모델의 실내 영역을 도면에서 선택해 확인한다. 방의 수는 단어 빈도 대신 공간 ID와 역할로 센다.",["A01","A05","A09"]),h("A05","욕실 두 개","BATH-1은 공용 욕실, BATH-2는 안방 욕실이다. 각각 별도 공간으로 기록한다. 설비·배관·환기·방수의 실제 시공 적합성은 이 묶음으로 판단하지 않는다.",["A04","A09","A10"]),h("A06","현관과 짧은 홀","HALL은 (7860,5660)–(10540,9200), 넓이는 9.4872㎡다. 긴 복도를 줄인 배치이며 공간 효율과 거주 품질을 넓이 하나로 판단하지 않는다. D-LIVING은 홀과 거실을 연결하는 대표 문이다.",["A02","A08","A09"]),h("A07","거실 통창 · 창과 개구부와 벽","WINDOW는 폭 6000mm·높이 2400mm인 시각화 가정의 거실 통창이다. 창은 OPENING을 채우고, OPENING은 SOUTH-WALL에 뚫려 있으며 SOUTH-WALL은 LIVING의 남측 경계를 이룬다. 창 자체를 벽이나 공간으로 분류하지 않는다. 유리 구조·열성능 검토는 없다.",["A02","A09","A10"]),h("A08","문 · 홀과 거실의 연결","D-LIVING은 HALL과 LIVING 두 공간을 연결한다. 이것은 문이 어떤 공간의 이동을 잇는지 보여주는 부분 모델이다. 모델의 문 기호와 실제 통과 유효폭, 피난 적합성을 같은 것으로 해석하지 않는다.",["A02","A06","A09"]),h("A09","도면 · 좌표와 리비전","DRAWING은 HOUSE를 나타내며 리비전은 FAMILY-02다. 도면의 직사각형은 원 모델의 실내 공간 경계다. mm 좌표, 방 이름, 넓이는 모델과 함께 읽는다. 이 실습의 도면은 벽·문짝·설비가 생략된 공간 관계 도식이며 실시설계 도면이 아니다.",["A01","A02","A03","A04","A05","A06"]),h("A10","요구 조건과 판단 보류","이 사례의 요구는 침실 3개·욕실 2개, 거실/주방/다이닝의 별도 공간, 폭 6m 통창이다. 이는 사용자의 설계 요구이지 법정 최소 기준이 아니다. 프로젝트 위치, 적용 절차, 구조 검토, 허가 증거가 없으므로 허가 완료나 안전을 판정하지 않는다.",["A01","A07","A09"])],nodes:[E("HOUSE","FAMILY-02 주택","Building","A01"),...oe,E("WINDOW","거실 통창","Window","A07",{widthMm:6000,heightMm:2400}),E("OPENING","통창 개구부","Opening","A07"),E("SOUTH-WALL","거실 남측 벽","Wall","A07"),E("D-LIVING","홀–거실 문","Door","A08"),E("DRAWING","공간 배치 도면","Drawing","A09",{revision:"FAMILY-02"}),E("BRIEF","방 3 · 욕실 2","Rule","A10")],edges:[...oe.map((o)=>A("HOUSE","contains",o.id,o.noteId)),A("WINDOW","fillsOpening","OPENING","A07"),A("OPENING","hostedBy","SOUTH-WALL","A07"),A("SOUTH-WALL","bounds","LIVING","A07"),A("D-LIVING","connects","HALL","A08"),A("D-LIVING","connects","LIVING","A08"),A("DRAWING","depicts","HOUSE","A09"),A("BRIEF","appliesTo","HOUSE","A10")],questions:["침실 3개·욕실 2개이고 거실·주방·다이닝이 분리된 모델인가요?","거실 통창은 어떤 개구부와 벽을 통해 거실과 연결되나요?","이 도면만으로 구조 안전과 건축 허가 완료를 판단할 수 있나요?"],traps:["침실이라는 단어가 세 번 나온 것과 서로 다른 침실 세 개가 있는 것은 다릅니다.","도면 정합성 검사와 법규·구조 안전 검토는 다릅니다."],error:{from:"WINDOW",rel:"fillsOpening",to:"LIVING",source:"A07"},target:"WINDOW"},ke={education:me,architecture:he};var R=`"""Run: python3 check.py model.json — bounded practice-model validation, not OWL/SHACL."""
import json,sys
from pathlib import Path

def check(m):
    errors=[]
    nodes={n['id']:n for n in m['nodes']}
    notes={n['id'] for n in m['notes']}
    if len(nodes)!=len(m['nodes']):errors.append('ID: duplicate node')
    for n in m['nodes']:
        if n['type'] not in m['classes'] or not n['label'].strip():errors.append('CLASS: '+n['id'])
        if n['noteId'] not in notes:errors.append('SOURCE: '+n['id'])
    seen=set()
    for e in m['edges']:
        key=(e['from'],e['rel'],e['to'])
        if key in seen:errors.append('DUPLICATE: '+str(key))
        seen.add(key)
        if e['source'] not in notes:errors.append('SOURCE: '+str(key))
        if e['from'] not in nodes or e['to'] not in nodes:
            errors.append('ENDPOINT: '+str(key));continue
        r=m['relations'].get(e['rel'])
        if not r or nodes[e['from']]['type'] not in r['from'] or nodes[e['to']]['type'] not in r['to']:errors.append('TYPE: '+str(key))
    done=set()
    def visit(n,active):
        if n in active:
            errors.append('CYCLE: '+' -> '.join(active+[n]));return
        if n in done:return
        for e in m['edges']:
            if e['from']==n and e['rel']=='requires' and e['to'] in nodes:visit(e['to'],active+[n])
        done.add(n)
    for n in nodes:visit(n,[])
    return errors

if __name__=='__main__':
    try:
        p=Path(sys.argv[1] if len(sys.argv)>1 else 'model.json')
        if p.stat().st_size>1_000_000:raise ValueError('model must be under 1MB')
        model=json.loads(p.read_text(encoding='utf-8'))
        if len(model['nodes'])>200 or len(model['edges'])>400:raise ValueError('model exceeds practice limit')
        errors=check(model)
        print(json.dumps({'engine':'practice-python-checker','errors':errors,'valid':not errors,'scope':'IDs, classes, endpoints, source existence, relation types, prerequisite cycles; not source truth or legal/learner assessment'},ensure_ascii=False,indent=2))
        sys.exit(1 if errors else 0)
    except (OSError,ValueError,KeyError,TypeError,RecursionError) as exc:
        print(json.dumps({'valid':False,'error':str(exc)},ensure_ascii=False));sys.exit(2)
`;var p=(o)=>String(o??"").replace(/[&<>"']/g,(e)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),P=/^[A-Za-z][A-Za-z0-9_-]{0,63}$/;function w(o){let e=[],t=(r,u,m=[])=>e.push({code:r,message:u,nodeIds:m}),a=new Set,s=new Set(o.notes.map((r)=>r.id));for(let r of o.nodes){if(!P.test(r.id)||a.has(r.id))t("ID",`ID ${r.id}: 중복되었거나 형식이 맞지 않습니다.`,[r.id]);if(a.add(r.id),!r.label?.trim()||!Object.hasOwn(o.classes,r.type))t("CLASS",`${r.id}: 이름과 정의된 종류가 필요합니다.`,[r.id]);if(!s.has(r.noteId))t("SOURCE",`${r.id}: 출처 문서가 없습니다.`,[r.id]);for(let[u,m]of Object.entries(r.attrs||{}))if(typeof m==="number"&&(!Number.isFinite(m)||m<0))t("VALUE",`${r.id}: ${u} 값이 올바르지 않습니다.`,[r.id])}let l=Object.fromEntries(o.nodes.map((r)=>[r.id,r])),n=new Set;for(let r of o.edges){let u=l[r.from],m=l[r.to],v=o.relations[r.rel],I=[r.from,r.rel,r.to].join("|");if(n.has(I))t("DUPLICATE",`${r.from} → ${r.to}: 같은 관계가 두 번 있습니다.`,[r.from,r.to]);if(n.add(I),!u||!m){t("ENDPOINT",`${r.from} → ${r.to}: 연결 대상이 없습니다.`,[r.from,r.to]);continue}if(!v||!v.from.includes(u.type)||!v.to.includes(m.type))t("TYPE",`${u.label} → ${m.label}: 관계의 시작·끝 종류가 맞지 않습니다.`,[r.from,r.to]);if(!s.has(r.source))t("SOURCE",`${u.label} → ${m.label}: 관계의 근거 문서가 없습니다.`,[r.from,r.to])}let d=new Set,i=new Set;function f(r){if(i.has(r)){t("CYCLE","선수 관계가 원을 이룹니다. 시작할 수 있는 순서를 다시 정하세요.",[...i,r]);return}if(d.has(r))return;i.add(r);for(let u of o.edges.filter((m)=>m.from===r&&m.rel==="requires"))if(l[u.to])f(u.to);i.delete(r),d.add(r)}for(let r of o.nodes)f(r.id);return e}function Ee(o,e){if(w(o).length)return{status:"INVALID",answer:"먼저 관계망 검사 오류를 해결하세요. 잘못된 모델로 답을 만들지 않습니다.",nodes:[],evidence:[]};let t=Object.fromEntries(o.nodes.map((d)=>[d.id,d])),a=(d,i,f,r)=>({status:d,answer:i,nodes:f,evidence:[...new Set(r)]});if(e===2)return o.id==="education"?a("UNKNOWN","판단 보류. 확인 질문은 있지만 민지A의 실제 답변·관찰·평가 결과가 없습니다. 학습 자료의 존재를 학습자의 성취로 바꿔 읽을 수 없습니다.",["A1"],["E08","E10"]):a("UNKNOWN","판단 보류. 이 자료는 공간 배치와 요구 조건을 담은 개념 모델입니다. 구조 검토·대지 조건·적용 절차·허가 증거가 없어 안전이나 허가 완료를 판단할 수 없습니다.",["DRAWING","BRIEF"],["A09","A10"]);if(o.id==="education"){if(e===0){if(!t.T5)return a("UNKNOWN","도달 목표 T5가 없습니다.",[],[]);let i=[],f=[],r=new Set,u=(m)=>{if(r.has(m))return;r.add(m);for(let v of o.edges.filter((I)=>I.from===m&&I.rel==="requires"))f.push(v.source),u(v.to);i.push(m)};return u("T5"),a("SUPPORTED",i.map((m)=>t[m].label).join(" → ")+" 순서입니다. 이 수업 설계에 한정된 제안 경로이며, 학생별 필수 순서나 진단 결과는 아닙니다.",i,f)}let d=o.edges.filter((i)=>i.to==="T4"&&["teaches","checks"].includes(i.rel));return a(d.length?"SUPPORTED":"UNKNOWN",d.length?d.map((i)=>`${t[i.from].label}: ${o.relations[i.rel].label}`).join(" / ")+" — 실제 문서에서 활동 내용과 확인 질문을 읽으세요.":"교재·확인 질문 연결이 없습니다.",[...d.map((i)=>i.from),"T4"],d.map((i)=>i.source))}if(e===0){let d=o.edges.filter((u)=>u.from==="HOUSE"&&u.rel==="contains").map((u)=>t[u.to]),i=d.filter((u)=>u.attrs.role==="bedroom").length,f=d.filter((u)=>u.attrs.role==="bathroom").length,r=["living","kitchen","dining"].every((u)=>d.some((m)=>m.attrs.role===u));return a(i===3&&f===2&&r?"SUPPORTED":"MISMATCH",`이 모델은 침실 ${i}개, 욕실 ${f}개입니다. 거실·주방·다이닝의 별도 공간 기록은 ${r?"있습니다":"충분하지 않습니다"}. 이는 기록된 공간 요구의 확인이며 거주 품질·시공·법규 적합 판정은 아닙니다.`,["HOUSE",...d.map((u)=>u.id)],["A01",...d.map((u)=>u.noteId)])}let s=["WINDOW"],l=[],n="WINDOW";for(let d of["fillsOpening","hostedBy","bounds"]){let i=o.edges.find((f)=>f.from===n&&f.rel===d);if(!i)return a("UNKNOWN","창에서 공간으로 이어지는 근거 연결이 끊어져 있습니다.",s,l);l.push(i.source),s.push(i.to),n=i.to}return a("SUPPORTED",s.map((d)=>t[d].label).join(" → ")+`. 창의 기록 치수는 폭 ${t.WINDOW.attrs.widthMm??"미기록"}mm, 높이 ${t.WINDOW.attrs.heightMm??"미기록"}mm입니다.`,s,l)}function G(o){let e=(a)=>JSON.stringify(String(a)),t=["@prefix ex: <https://dexa.art/ontology/study/vocab/"+o.id+"#> .","@prefix owl: <http://www.w3.org/2002/07/owl#> .","@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .","@prefix prov: <http://www.w3.org/ns/prov#> .","@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .","ex:ontology a owl:Ontology ; rdfs:label "+e(o.name+" 실습 온톨로지")+" ."];for(let[a,s]of Object.entries(o.classes))t.push(`ex:${a} a owl:Class ; rdfs:label ${e(s)} .`);for(let[a,s]of Object.entries(o.relations)){let l=(n)=>n.length===1?"ex:"+n[0]:"[ a owl:Class ; owl:unionOf ( "+n.map((d)=>"ex:"+d).join(" ")+" ) ]";t.push(`ex:${a} a owl:ObjectProperty ; rdfs:label ${e(s.label)} ; rdfs:domain ${l(s.from)} ; rdfs:range ${l(s.to)} .`)}for(let a of o.nodes){t.push(`ex:${a.id} a ex:${a.type} ; rdfs:label ${e(a.label)} ; prov:wasDerivedFrom ex:${a.noteId} .`);for(let[s,l]of Object.entries(a.attrs||{}))if(P.test(s))t.push(`ex:${s} a owl:DatatypeProperty .
ex:${a.id} ex:${s} ${typeof l==="number"?l:e(l)} .`)}for(let a of o.edges)t.push(`ex:${a.from} ex:${a.rel} ex:${a.to} .
[] a owl:Axiom ; owl:annotatedSource ex:${a.from} ; owl:annotatedProperty ex:${a.rel} ; owl:annotatedTarget ex:${a.to} ; prov:wasDerivedFrom ex:${a.source} .`);for(let a of o.notes)t.push(`ex:${a.id} a prov:Entity ; rdfs:label ${e(a.title)} .`);return t.join(`
`)+`
`}function le(o,e,t){let[a,s,l]=e.split("|");if(!/^Q[1-3]$/.test(a)||!["before","after"].includes(s)||!["answer","evidence","accuracy","consistency","source"].includes(l))throw Error("평가 입력 경로를 확인하세요.");o[a]??={},o[a][s]??={},o[a][s][l]=["accuracy","consistency","source"].includes(l)?t===""?null:Number(t):String(t)}function _(o){let e={before:null,after:null,beforeCount:0,afterCount:0};for(let t of["before","after"]){let a=0,s=0;for(let l of["Q1","Q2","Q3"]){let n=o[l]?.[t];if(n?.answer?.trim()&&n?.evidence?.trim()&&["accuracy","consistency","source"].every((d)=>Number.isInteger(n[d])&&n[d]>=0&&n[d]<=2))s++,a+=n.accuracy+n.consistency+n.source}if(e[t+"Count"]=s,s===3)e[t]=a}return e}function ne(o,{allowPersonal:e=!1}={}){if(o.length>1e6)throw Error("파일은 1MB 이하로 준비하세요.");let t;try{t=JSON.parse(o)}catch{throw Error("JSON 형식을 확인하세요.")}if(!t||!["education","architecture",...e?["personal"]:[]].includes(t.id)||!Array.isArray(t.nodes)||!t.nodes.length&&t.id!=="personal"||t.nodes.length>200||!Array.isArray(t.edges)||t.edges.length>400||!Array.isArray(t.notes)||t.notes.length>100||!t.classes||!t.relations)throw Error("실습 model.json 형식이 필요합니다. 최대 대상 200개·관계 400개입니다.");for(let a of[t.classes,t.relations])if(Object.keys(a).length>40||Object.keys(a).some((s)=>!P.test(s)||["__proto__","constructor","prototype"].includes(s)))throw Error("종류·관계 이름을 확인하세요.");for(let a of t.nodes)if(!a||typeof a.id!=="string"||!P.test(a.id)||typeof a.label!=="string"||a.label.length>100||!a.attrs||typeof a.attrs!=="object"||Array.isArray(a.attrs)||Object.values(a.attrs).some((s)=>!["string","number","boolean"].includes(typeof s)))throw Error("대상의 이름·종류·속성 형식을 확인하세요.");for(let a of t.notes)if(!a||!P.test(a.id)||typeof a.title!=="string"||typeof a.body!=="string"||!Array.isArray(a.links)||a.links.some((s)=>typeof s!=="string"))throw Error("문서 형식을 확인하세요.");for(let a of t.edges)if(!a||!["from","rel","to","source"].every((s)=>typeof a[s]==="string"))throw Error("관계 형식을 확인하세요.");for(let a of Object.values(t.relations))if(!a||typeof a.label!=="string"||!Array.isArray(a.from)||!Array.isArray(a.to)||!a.from.length||!a.to.length||[...a.from,...a.to].some((s)=>!Object.hasOwn(t.classes,s)))throw Error("관계의 시작·끝 종류를 확인하세요.");if(Object.values(t.classes).some((a)=>typeof a!=="string"))throw Error("종류의 표시 이름은 문자열이어야 합니다.");return t}var Ae=(o,e,t)=>`---
description: "${t}"
akmLayer: ${o}
akmType: ${e}
trustLevel: draft
date created: 2026-09-12
date modified: 2026-09-12
---

`;function se(o,e,t=!1){let a=o.edges.filter((s)=>o.nodes.find((l)=>l.id===s.from)?.noteId===e.id);return Ae(t?"knowledge":"source",t?"guide":"source",t?"Compiled practice knowledge with explicit source links.":"Synthetic source note for a knowledge management exercise.")+`# ${e.id} · ${e.title}

${e.body}

`+(t?`## 출처

[[10-sources/${e.id}]]

## 연결

${e.links.map((s)=>`- [[20-knowledge/${s}]]`).join(`
`)}

## 의미가 있는 관계

${a.map((s)=>`- ${s.from} — ${s.rel} → ${s.to} (근거: ${s.source}, 교수학습/모델 가정)`).join(`
`)}`:"원본 상태를 보존하고 해석은 별도 지식 노트에 기록하세요.")+`
`}function ge(o){return`이 폴더는 GPTers 24기 ${o.name} 실습용 AKM입니다.
1. AKM의 99-system/INDEX.md, ROUTER.md, LOOP.md와 이 폴더의 practice/README.md를 읽으세요.
2. practice/model.json과 practice/questions.json을 읽고, 관계의 뜻·방향·출처를 먼저 확인하세요. 원본 자료는 10-sources, 합성 지식은 20-knowledge에 있습니다.
3. 질문마다 답변 / 사용한 문서 ID와 근거 문장 / 따라간 관계 / 판단 불가 사항을 분리하세요. 연결이 없는 내용을 상식으로 메우지 마세요.
4. 학생 성취나 건축 허가·구조 안전을 자료 없이 판정하지 마세요.
5. expected-answers.json이나 웹의 참고 답변을 읽거나 답안으로 복사하지 마세요. 비교할 때는 같은 모델·설정의 새 대화에서 같은 질문·응답 형식을 유지하세요.
6. 결과를 practice/response-template.json의 형식으로 새 파일에 저장하세요. phase를 실제 실행 단계(before 또는 after)로 정하고 모델명·실행일·질문을 기록하세요. 템플릿의 미측정 상태를 실행 결과로 오인하지 마세요.
7. 질문은 다음 3개를 그대로 사용하세요.
${o.questions.map((e,t)=>`Q${t+1}. ${e}`).join(`
`)}

웹의 관계 질의 미리보기는 규칙으로 계산한 예시입니다. 실제 LLM 답변은 직접 실행해 기록하세요.`}function ve(o){return`같은 모델·설정의 새 대화에서 적용 전 기준선을 측정합니다.
이 폴더의 00-inbox 원자료 10개와 practice/questions.json만 근거로 질문 3개에 답하세요.
reference, practice/model.json, ontology.ttl, expected-answers.json 및 완성 지식 노트는 읽지 마세요.
질문마다 답변, 원문 ID와 근거 문장, 판단 불가 사항을 분리하세요.
원자료를 수정하지 말고 practice/response-template.json 형식의 새 before 응답 파일에 실제 모델명·실행일·답변·출처를 기록하세요.
${o.questions.map((e,t)=>`Q${t+1}. ${e}`).join(`
`)}
미리보기나 참고 답변을 실제 실행 결과로 복사하지 마세요.`}function Be(o,e){let t={},a=ae[e-1],s=(l)=>JSON.stringify(l,null,2)+`
`;if(t["my-topic/this-week.md"]=F(e),t["my-topic/README.md"]=`# 내 주제로 적용하기

웹의 내 주제 실습실 https://dexa.art/ontology/study/my-topic.html 에서 내 자료와 질문을 입력하세요. 예시를 확인한 뒤 같은 방법을 자기 업무·연구에 적용합니다. 입력한 프로젝트 JSON과 주차별 작업 ZIP을 따로 보관하세요.
`,t["README.md"]=`# GPTers 24기 · ${o.name} · ${e}주차

${a.lead}

${o.scope}

## 시작

1. 공식 AKM https://github.com/DECK6/akm 을 새 폴더에 준비하세요. 에이전트에 “공식 AKM을 새 gpters24-${o.id} 폴더에 설치해줘”라고 요청하거나 GitHub의 Code → Download ZIP을 사용하세요. 기존 개인 볼트에서 시작하지 않는 것을 권장합니다.
2. 이 ZIP은 AKM 본체가 아니라 주차별 실습 자료입니다. 1주차에는 00-inbox와 practice를 새 AKM 폴더에 복사하세요. reference는 완성 예시입니다.
3. 2주차 이후에는 같은 사례 폴더를 이어 사용하세요. 직접 만든 파일은 먼저 별도 보관하고, 패키지의 완성 예시와 나란히 비교하세요. before 답변 기록을 덮어쓰지 마세요.
4. Obsidian에서 AKM 폴더를 볼트로 열고 Graph view를 확인하세요. 문서 링크망의 선은 관계의 의미까지 자동 검증하지 않습니다.

## 이번 주

${a.steps.map((l,n)=>`${n+1}. ${l}`).join(`
`)}

결과물: ${a.output}

${a.homework}

## 파일 안내

- practice/questions.json: 4주간 동일하게 사용할 질문 3개
- practice/model.json: 웹과 동일한 완성 참고 모델
- practice/response-template.json: 실제 에이전트 응답 기록용 빈 양식
- practice/agent-prompt.md: 에이전트에 연결하는 요청문
- practice/evaluation.csv: 답·출처·평가를 기록하는 빈 표
- reference 또는 20-knowledge: 비교용 합성 지식

${e>=2?"## 모델 검사\n\npractice 폴더에서 `python3 check.py model.json`을 실행하세요. 정상 모델은 valid: true, `python3 check.py model-error.json`은 의도한 오류를 반환합니다. expected-answers.json은 비교용 참고 답변이며 LLM 실행 결과가 아닙니다.\n\n":""}웹에서 보인 참고 답변은 실제 LLM 실행 성적이 아닙니다.
`,t["practice/README.md"]=`# ${o.name} 실습 범위

${o.scope}

${o.provenance}

질문과 원문 ID는 4주 내내 유지합니다. 관계 수정은 model.json의 작업 복사본에 기록하세요. 출처 문서가 바뀌면 새 리비전을 기록하고 같은 질문을 재실행하세요.
`,t["practice/domain-definition.md"]=`# 내 지식 도메인 정의서

예시 도메인: ${o.name}

${o.scope}

## 내가 답하려는 질문
${o.questions.map((l,n)=>`- Q${n+1}: ${l}`).join(`
`)}

## 내 자료로 바꾸기
- 다루는 범위:
- 다루지 않는 범위:
- 자료의 출처·날짜:
- 주로 등장하는 대상:
- 질문을 사용하는 사람과 업무:
`,t["practice/diagnosis.md"]=`# 지식베이스 진단

- 원자료 10개가 모두 열리는가?
- 같은 대상에 서로 다른 이름을 쓰는가?
- 최신 정보와 과거 정보가 섞여 있는가?
- 출처를 되짚을 수 있는가?
- 문서 링크가 있지만 어떤 관계인지 모호한 곳은?
- Q1·Q2·Q3 중 답하지 못한 질문과 원인은?

## 기준선 실행
같은 모델·설정의 새 대화에서 00-inbox 원자료만 읽힙니다. reference와 model.json, ontology.ttl, expected-answers.json을 기준선에 사용하지 않습니다. 1주차 practice/agent-prompt.md에 기준선용 요청문이 있습니다. 실제 답변은 before 파일로 따로 보관합니다.
`,e>=2)t["practice/schema-decisions.md"]=`# 관계 설계 기록

- 해결할 질문:
- 종류와 대상 ID:
- 관계 ID·읽는 말:
- 시작 종류 → 끝 종류:
- 근거 문서와 문장:
- 모델링 가정과 미확인 범위:
- 검사할 반례:
- 변경 전후 및 검토자:
`;if(e>=3)t["practice/run-log.md"]=`# 실제 에이전트 실행 기록

- 단계: after
- 실행일·도구·모델·설정:
- 새 대화 여부:
- 모델 파일 리비전:
- 읽도록 허용한 파일:
- 동일 질문 3개 유지 여부:
- 출력 파일과 출처 확인 결과:
- 실패하거나 보류한 판단:

1주차 before 파일을 덮어쓰지 않습니다. 참고 답변은 실행이 끝난 뒤 비교용으로 읽습니다.
`;if(e===4)t["practice/final-report.md"]=`# 4주차 최종 발표

1. 처음 해결하려던 문제와 질문 3개
2. LLM Wiki에서 바꾼 구조
3. 추가한 개념·관계·속성
4. 실제 에이전트가 근거를 찾아 답하는 장면
5. 같은 질문의 적용 전후 답·출처·평가 비교
6. 개선되지 않은 부분과 아직 판단할 수 없는 범위
7. 계속 운영할 규칙과 다음 변경

점수 향상을 미리 가정하지 않습니다. 차이가 없거나 나빠진 결과도 원인과 함께 기록합니다.
`;t["practice/model.json"]=s(o),t["practice/questions.json"]=s(o.questions.map((l,n)=>({id:"Q"+(n+1),question:l}))),t["practice/agent-prompt.md"]=(e===1?ve(o):ge(o))+`
`,t["practice/response-template.json"]=s({domain:o.id,phase:e===1?"before":"after",model:"",runAt:"",status:"unmeasured",responses:o.questions.map((l,n)=>({id:"Q"+(n+1),question:l,answer:"",evidence:[],limitations:""}))}),t["practice/evaluation.csv"]=`question_id,phase,answer,evidence,accuracy_0_2,consistency_0_2,source_0_2
`+o.questions.flatMap((l,n)=>["before","after"].map((d)=>`Q${n+1},${d},,,,,`)).join(`
`)+`
`;for(let l of o.notes)t[(e===1?"00-inbox/":"10-sources/")+l.id+".md"]=se(o,l),t[(e===1?"reference/":"")+"20-knowledge/"+l.id+".md"]=se(o,l,!0);if(t[(e===1?"reference/":"")+"99-system/INDEX.local.md"]=`# 실습 문서 색인

`+o.notes.map((l)=>`- [[20-knowledge/${l.id}|${l.title}]]`).join(`
`)+`
`,e>=2)t["practice/check.py"]=R,t["practice/model-error.json"]=s({...o,edges:[...o.edges,o.error]}),t["practice/expected-answers.json"]=s(o.questions.map((l,n)=>({id:"Q"+(n+1),question:l,...Ee(o,n),kind:"deterministic-reference-not-LLM-run"}))),t["practice/ontology.ttl"]=G(o),t["practice/schema.json"]=s({classes:o.classes,relations:o.relations,requiredNodeFields:["id","label","type","noteId","attrs"],rules:["unique IDs","known endpoints","domain/range","source exists","acyclic requires"]}),t["practice/ONTOLOGY.md"]=`# ${o.name} 온톨로지 설계

${o.scope}

## 종류
${Object.entries(o.classes).map(([l,n])=>`- ${l}: ${n}`).join(`
`)}

## 관계
${Object.entries(o.relations).map(([l,n])=>`- ${l}: ${n.label} (${n.from.join("/")} → ${n.to.join("/")})`).join(`
`)}

OWL 파일은 종류·관계·개체·출처를 표현합니다. 웹의 순환/필수값 검사는 별도의 경량 검사이며 OWL reasoner나 SHACL 엔진 실행 결과가 아닙니다.
`;if(e===4)t["practice/OPERATIONS.md"]=`# 지속 운영 규칙

1. 새 자료는 inbox에 넣고 출처·날짜·범위를 확인한다.
2. 원본과 해석을 분리한다. 같은 대상을 중복 ID로 만들지 않는다.
3. 관계의 방향·뜻·출처를 검토한 뒤 승인한다.
4. 자료나 스키마를 바꾸면 변경 이유·담당자·리비전을 기록한다.
5. 세 질문을 재실행하고 답변·출처·보류 판단을 비교한다.
6. 폐기할 자료는 근거 연결을 확인하고 보관 폴더나 휴지통으로 이동한다.
7. 오류가 나면 모델·원자료·검색·응답 중 어느 단계가 원인인지 구분해 수정한다.

## 평가 기준
정확성: 0 근거와 충돌 / 1 일부 맞음 또는 누락 / 2 근거에 맞게 답하거나 필요한 판단 보류.
일관성: 0 같은 질문·관계를 모순되게 해석 / 1 일부 용어·방향 흔들림 / 2 ID·관계 의미·판단 범위를 일관되게 사용.
출처: 0 없거나 다른 자료 / 1 문서만 제시 / 2 실제 근거 문장과 연결을 확인할 수 있음.
반복 실행 일관성을 평가하려면 같은 질문을 반복 실행하고 그 결과도 보관한다. 한 번의 답변 비교를 모델 안정성 검증으로 확대하지 않는다.
`;return Object.fromEntries(Object.entries(t).map(([l,n])=>[l,n.trimEnd()+`
`]))}function K(){return{format:"gpters24-personal-v1",title:"",scope:"",excluded:"",questions:["","",""],model:{id:"personal",name:"내 주제",classes:{Concept:"개념"},relations:{},nodes:[],edges:[],notes:[]},records:{},reflection:["","","",""],operations:"",revision:"v1"}}var L=(o,e=20000)=>typeof o==="string"&&o.length<=e;function U(o){if(o.length>1e6)throw Error("프로젝트 파일은 1MB 이하로 준비하세요.");let e;try{e=JSON.parse(o)}catch{throw Error("JSON 형식을 확인하세요.")}if(e?.format!=="gpters24-personal-v1"||!L(e.title,120)||!L(e.scope)||!L(e.excluded)||!Array.isArray(e.questions)||e.questions.length!==3||e.questions.some((s)=>!L(s,500))||!Array.isArray(e.reflection)||e.reflection.length!==4||e.reflection.some((s)=>!L(s))||!L(e.operations)||!L(e.revision,100)||e.model?.id!=="personal")throw Error("내 주제 프로젝트 JSON 형식이 필요합니다.");let t=ne(JSON.stringify(e.model),{allowPersonal:!0});if(new Set(t.notes.map((s)=>s.id)).size!==t.notes.length||t.notes.some((s)=>!L(s.source||"",2000)||!L(s.date||"",100)))throw Error("자료 ID와 출처 형식을 확인하세요.");let a={};for(let s of["Q1","Q2","Q3"])for(let l of["before","after"]){let n=e.records?.[s]?.[l];if(!n)continue;if(!L(n.answer??"")||!L(n.evidence??""))throw Error("답변과 근거 형식을 확인하세요.");a[s]??={},a[s][l]={answer:n.answer??"",evidence:n.evidence??""};for(let d of["accuracy","consistency","source"])a[s][l][d]=Number.isInteger(n[d])&&n[d]>=0&&n[d]<=2?n[d]:null}if(e.records?.runs){a.runs={};for(let s of["before","after"]){let l=e.records.runs[s];if(l)a.runs[s]={model:String(l.model||"").slice(0,200),runAt:String(l.runAt||"").slice(0,100)}}}return{format:e.format,title:e.title,scope:e.scope,excluded:e.excluded,questions:e.questions,model:t,records:a,reflection:e.reflection,operations:e.operations,revision:e.revision}}function re(o,e){if(e.length>1e6)throw Error("응답 파일은 1MB 이하로 준비하세요.");let t;try{t=JSON.parse(e)}catch{throw Error("JSON 형식을 확인하세요.")}if(t.domain!=="personal"||t.projectTitle!==o.title||!["before","after"].includes(t.phase)||t.responses?.length!==3)throw Error("이 주제의 response-template.json 형식인지 확인하세요.");let a=new Set;for(let l of t.responses){let n=Number(l.id?.slice(1))-1;if(!/^Q[1-3]$/.test(l.id)||a.has(l.id)||l.question!==o.questions[n]||!l.answer?.trim()||!L(l.answer)||!Array.isArray(l.evidence))throw Error("고정 질문 3개와 실제 답변·근거 배열을 확인하세요.");a.add(l.id)}let s=structuredClone(o);s.records.runs??={},s.records.runs[t.phase]={model:String(t.model||""),runAt:String(t.runAt||"")};for(let l of t.responses)s.records[l.id]??={},s.records[l.id][t.phase]={answer:l.answer,evidence:l.evidence.map((n)=>typeof n==="string"?n:JSON.stringify(n)).join(`
`)||"없음",accuracy:null,consistency:null,source:null};return U(JSON.stringify(s))}function j(o,e){let t=o.questions.map((a,s)=>`Q${s+1}. ${a||"[내 질문을 입력하세요]"}`).join(`
`);if(e===1)return`주제: ${o.title||"[내 주제]"}
범위: ${o.scope||"[다루는 범위]"}
제외: ${o.excluded||"[다루지 않는 범위]"}

같은 모델·설정의 새 대화에서 정리 전 기준선을 측정합니다. 00-inbox의 내 원자료와 practice/questions.json만 읽고 아래 질문에 답하세요. 모델·완성 Wiki·예시 답안은 읽지 마세요. 답변/실제 근거 문장/판단 불가 사항을 구분해 response-template.json 형식의 새 before 파일로 저장하세요.
${t}

기준선 기록이 끝난 뒤 별도 작업으로 공식 AKM https://github.com/DECK6/akm 의 INDEX·ROUTER·LOOP를 읽고 원본을 보존하면서 정리 노트와 링크를 만드세요.`;return`주제: ${o.title||"[내 주제]"}
범위: ${o.scope||"[다루는 범위]"}
제외: ${o.excluded||"[다루지 않는 범위]"}
모델 리비전: ${o.revision}

이 실습 AKM의 INDEX·ROUTER·LOOP와 practice/README.md를 읽으세요. 원자료 10-sources, 직접 검토한 정리 노트 20-knowledge, practice/model.json의 종류·관계·속성·근거를 함께 확인하세요. 정리 노트의 빈칸을 실제 지식으로 취급하지 마세요.
같은 모델·설정의 새 대화에서 아래 고정 질문에 답하세요. 답변/실제 근거 문장/따라간 관계/판단 불가 사항을 구분하고 근거가 없으면 보류하세요. 일반 지식으로 빈칸을 채우지 마세요. practice/response-template.json 형식의 새 after 파일에 실제 모델명과 실행일을 기록하세요. before를 덮어쓰지 마세요.
${t}`}function V(o,e){let t=(l)=>JSON.stringify(l,null,2)+`
`,a={...o.model,name:o.title||"내 주제"},s={"README.md":`# 내 주제 실습 · ${o.title||"아직 입력하지 않음"}

${e}주차 작업 파일입니다. 공식 AKM https://github.com/DECK6/akm 을 새 실습 폴더에 준비하고 자료를 추가하세요. 이 ZIP은 AKM 본체가 아닙니다. 1주차 before 기록과 직접 검토한 Wiki를 다음 주에도 이어 사용하세요. 기존 파일은 먼저 보관하고 비교한 뒤 적용합니다.

웹에서 personal-project.json을 불러오면 주제·자료·관계·평가를 이어 편집할 수 있습니다. 이 파일은 비공개 개인 작업이며 공개 사이트에 자동 업로드되지 않습니다.
`,"personal-project.json":t(o),"practice/this-week.md":F(e),"practice/source-note-template.md":`# 내 원자료 양식

ID: N1
제목:
출처 URL 또는 작성자·문서명:
작성일:

## 원문
실제 자료를 붙여 넣습니다.

원문과 에이전트의 해석을 분리하세요.
`,"practice/README.md":`# 내 도메인

주제: ${o.title}

범위: ${o.scope}

제외: ${o.excluded}

리비전: ${o.revision}

원자료 ${a.notes.length}개, 대상 ${a.nodes.length}개, 관계 ${a.edges.length}개. 원자료 10개는 수업 권장량입니다. 빈 양식은 완성 지식이 아니므로 작성·검토한 뒤 에이전트에 사용하세요.
`,"practice/questions.json":t(o.questions.map((l,n)=>({id:`Q${n+1}`,question:l}))),"practice/model.json":t(a),"practice/agent-prompt.md":j(o,e)+`
`,"practice/response-template.json":t({domain:"personal",projectTitle:o.title,phase:e===1?"before":"after",model:"",runAt:"",responses:o.questions.map((l,n)=>({id:`Q${n+1}`,question:l,answer:"",evidence:[],limitations:""}))}),"practice/evaluation.json":t({questions:o.questions,records:o.records,summary:_(o.records)}),"practice/reflection.md":`# 이번 주 실제 작업 기록

${o.reflection[e-1]||"문제 → 바꾼 구조 → 실제 결과 → 실패·보류 → 다음 변경을 기록하세요."}
`,"practice/OPERATIONS.md":`# 운영 규칙

${o.operations||`새 자료의 출처·날짜를 확인할 사람:
원본과 정리 노트를 구분하는 위치:
관계 변경을 검토할 사람:
자료·스키마 버전 기록 방법:
추가·수정·폐기 시 재실행할 질문:
보관 또는 휴지통으로 이동할 기준:`}
`};for(let l of a.notes){let n=`---
description: "Learner-provided source for a personal knowledge project."
akmLayer: source
akmType: source
trustLevel: raw
sourcePath: ${JSON.stringify(l.source||"출처 미입력")}
date created: ${JSON.stringify(l.date||"2026-09-12")}
date modified: ${JSON.stringify(l.date||"2026-09-12")}
---

`;if(s[`00-inbox/${l.id}.md`]=n+`# ${l.id} · ${l.title}

${l.body}
`,e>=2)s[`10-sources/${l.id}.md`]=s[`00-inbox/${l.id}.md`];s[`wiki-drafts/${l.id}.md`]=`# ${l.title}

## 정리할 내용
내가 이해한 핵심을 직접 적거나 에이전트의 정리 결과를 검토하세요. 이 파일은 빈 초안입니다.

## 출처
[[10-sources/${l.id}]]

## 연결
${l.links.map((d)=>`- [[20-knowledge/${d}]]`).join(`
`)}

## 검토할 관계
${a.edges.filter((d)=>a.nodes.find((i)=>i.id===d.from)?.noteId===l.id).map((d)=>`- ${d.from} — ${d.rel} → ${d.to} (근거: ${d.source})`).join(`
`)}
`}if(s["wiki-drafts/README.md"]=`# Wiki 초안 적용

이 폴더는 완성 지식이 아닙니다. 각 초안에 핵심·출처·관계를 작성하고 검토한 뒤 AKM의 20-knowledge에 승격하세요. Obsidian에서 같은 AKM 폴더를 열어 그래프를 확인합니다. 99-system/INDEX.local.md에는 검토한 노트의 링크를 추가하세요. 이미 완성한 노트에 빈 초안을 덮어쓰지 마세요.
`,e>=2){if(s["practice/schema.json"]=t({classes:a.classes,relations:a.relations}),s["practice/check.py"]=R,s["practice/schema-decisions.md"]=`# 관계 설계 기록

해결할 질문:
대상 종류와 구분 기준:
관계 이름과 시작→끝 종류:
근거 문서와 문장:
추가한 속성과 단위:
잘못 연결한 반례와 검사 결과:
변경 이유와 검토자:
`,!w(a).length&&a.nodes.length)s["practice/ontology.ttl"]=G(a)}if(e===4)s["practice/final-presentation.md"]=`# 최종 발표 순서

1. 내 주제와 처음의 질문 3개
2. Wiki 구조와 온톨로지 관계망
3. 실제 에이전트의 답변과 출처
4. 적용 전후 평가와 남은 한계
5. 새 자료를 넣고 계속 운영할 규칙

점수의 상승을 미리 가정하지 않습니다. 빈 평가를 실행 결과로 제출하지 않습니다.
`;return Object.fromEntries(Object.entries(s).map(([l,n])=>[l,n.trimEnd()+`
`]))}function ie(o){let e=new TextEncoder,t=[],a=[],s=0,l=(u)=>{let m=4294967295;for(let v of u){m^=v;for(let I=0;I<8;I++)m=m>>>1^(m&1?3988292384:0)}return(m^4294967295)>>>0};for(let[u,m]of Object.entries(o)){if(u.startsWith("/")||u.split("/").includes(".."))throw Error("ZIP 경로를 확인하세요.");let v=e.encode(u),I=e.encode(m),te=l(I),B=new Uint8Array(30+v.length+I.length),x=new DataView(B.buffer);x.setUint32(0,67324752,!0),x.setUint16(4,20,!0),x.setUint16(6,2048,!0),x.setUint16(12,23852,!0),x.setUint32(14,te,!0),x.setUint32(18,I.length,!0),x.setUint32(22,I.length,!0),x.setUint16(26,v.length,!0),B.set(v,30),B.set(I,30+v.length),t.push(B);let Y=new Uint8Array(46+v.length),D=new DataView(Y.buffer);D.setUint32(0,33639248,!0),D.setUint16(4,20,!0),D.setUint16(6,20,!0),D.setUint16(8,2048,!0),D.setUint16(14,23852,!0),D.setUint32(16,te,!0),D.setUint32(20,I.length,!0),D.setUint32(24,I.length,!0),D.setUint16(28,v.length,!0),D.setUint32(42,s,!0),Y.set(v,46),a.push(Y),s+=B.length}let n=a.reduce((u,m)=>u+m.length,0),d=new Uint8Array(22),i=new DataView(d.buffer);i.setUint32(0,101010256,!0),i.setUint16(8,a.length,!0),i.setUint16(10,a.length,!0),i.setUint32(12,n,!0),i.setUint32(16,s,!0);let f=new Uint8Array(s+n+22),r=0;for(let u of[...t,...a,d])f.set(u,r),r+=u.length;return f}var $=(o)=>document.querySelector(o),pe="gpters24-personal-v1",Q=(o)=>JSON.stringify(o,null,2),c=K(),b=Number(new URLSearchParams(location.search).get("week"))||1,k="wiki",N="",z=1,de;if(![1,2,3,4].includes(b))b=1;k=b===1?"wiki":"ontology";var Z="";try{let o=localStorage.getItem(pe);if(o)c=U(o)}catch{Z="저장 내용을 읽지 못했습니다. 내려받아 둔 프로젝트 JSON을 불러오세요."}var W=(o)=>o.map(([e,t])=>`<option value="${p(e)}">${p(t)}</option>`).join(""),T=(o,e,t="")=>`<label>${e}<input name="${o}" ${t}></label>`,C=(o="id")=>T(o,"ID",'required pattern="[A-Za-z][A-Za-z0-9_-]{0,63}" maxlength="64" placeholder="영문 ID, 예: N1"'),X=()=>["Q1","Q2","Q3"].some((o)=>["before","after"].some((e)=>c.records[o]?.[e]?.answer?.trim()));function g(o){$("#toast").textContent=o,$("#toast").classList.add("visible"),clearTimeout(de),de=setTimeout(()=>$("#toast").classList.remove("visible"),5000)}function S(){try{localStorage.setItem(pe,Q(c))}catch{g("브라우저에 저장하지 못했습니다. 프로젝트 JSON으로 보관하세요.")}}function q(o,e,t="application/json"){let a=document.createElement("a"),s=URL.createObjectURL(new Blob([e],{type:t}));a.href=s,a.download=o,a.click(),setTimeout(()=>URL.revokeObjectURL(s),2000)}function ce(o,e){$("#personal-dialog-title").textContent=o,$("#personal-dialog-text").textContent=e,$("#personal-dialog").showModal()}$("#personal-close").onclick=()=>$("#personal-dialog").close();function O(o){o(c),S(),H()}function Ie(){return`<details class="panel" ${b===1?"open":""}><summary>내 주제·범위·고정 질문 ${c.title?"수정":"정하기"}</summary><form id="profile-form" class="form-row">${T("title","주제 이름",`required maxlength="120" value="${p(c.title)}" placeholder="실제로 자주 찾아보는 내 업무나 연구"`)}${T("revision","모델 리비전",`required maxlength="100" value="${p(c.revision)}"`)}<label>다루는 범위<textarea name="scope" required maxlength="20000" placeholder="누가 어떤 일을 할 때 필요한 지식인가요?">${p(c.scope)}</textarea></label><label>다루지 않는 범위<textarea name="excluded" maxlength="20000" placeholder="현재 자료로는 판단할 수 없는 것">${p(c.excluded)}</textarea></label>${c.questions.map((o,e)=>`<label class="wide">Q${e+1} · ${["자료에서 찾아 답하는 질문","관계를 따라가야 답하는 질문","근거가 부족하면 보류해야 하는 질문"][e]}<input name="q${e}" value="${p(o)}" required maxlength="500" ${X()?"readonly":""} placeholder="4주간 그대로 사용할 내 질문"></label>`).join("")}<button class="primary wide" type="submit">내 주제와 질문 저장</button></form><p class="tiny">실제 답변을 기록한 뒤에는 비교를 위해 질문을 고정합니다. 다른 질문으로 시작하려면 현재 프로젝트를 저장하고 새 주제를 여세요.</p></details>`}function ye(){let o=c.model;return`<section class="panel"><h2>내 원자료 모으기 <span class="tiny">${o.notes.length} / 권장 10개</span></h2><p>내가 작성했거나 사용할 수 있는 노트의 제목·본문·출처를 넣으세요. 원자료를 입력하는 단계이며 AI가 자동 요약하지 않습니다.</p><form id="note-form" class="form-row">${C()}${T("title","자료 제목",'required maxlength="100"')}${T("source","출처 · 문서명 또는 URL",'required maxlength="2000" placeholder="예: 직접 작성한 업무 메모"')}${T("date","자료 날짜",'type="date" required')}<label class="wide">원문 내용<textarea name="body" required maxlength="20000" placeholder="자료의 실제 내용을 붙여 넣으세요."></textarea></label><button class="primary wide" type="submit">원자료 추가</button></form><details><summary>문서끼리 링크 연결하기</summary><form id="wiki-link-form" class="form-row"><label>시작 문서<select name="from">${W(o.notes.map((e)=>[e.id,e.title]))}</select></label><label>연결 문서<select name="to">${W(o.notes.map((e)=>[e.id,e.title]))}</select></label><button class="wide" ${o.notes.length<2?"disabled":""}>문서 링크 추가</button></form><p class="tiny">이 선은 관련 문서를 잇습니다. 어떤 뜻의 관계인지는 2주차에서 정의합니다.</p><div class="edges">${o.notes.flatMap((e)=>e.links.map((t)=>`<div class="edge-row"><span>${p(e.id)} → ${p(t)}</span><button data-unlink="${p(e.id)}|${p(t)}">링크 해제</button></div>`)).join("")}</div></details></section>`}function Le(){let o=c.model,e=W(Object.entries(o.classes)),t=W(o.notes.map((s)=>[s.id,s.title])),a=W(o.nodes.map((s)=>[s.id,s.label]));return`<section id="personal-editor"><div class="section-title"><div><h2>내 온톨로지 만들기</h2><p>자료의 실제 대상을 ID로 구분하고, 관계마다 근거를 붙입니다.</p></div></div><div class="two-col"><div class="panel"><h3>종류 정의</h3><form id="class-form" class="form-row">${C()}${T("label","종류 이름",'required maxlength="50" placeholder="내 주제에서 구분할 대상의 종류"')}<button class="wide">종류 추가</button></form></div><div class="panel"><h3>대상 추가</h3><form id="node-form" class="form-row">${C()}${T("label","대상 이름",'required maxlength="100"')}<label>종류<select name="type">${e}</select></label><label>근거 문서<select name="noteId">${t}</select></label><button class="primary wide" ${o.notes.length?"":"disabled"}>대상 추가</button></form></div></div><div class="panel"><h3>관계 종류 정의</h3><form id="relation-form" class="form-row">${C("relId")}${T("label","읽는 말",'required maxlength="50" placeholder="예: 필요로 한다, 담당한다"')}<label>시작 종류<select name="from">${e}</select></label><label>끝 종류<select name="to">${e}</select></label><button class="wide">관계 종류 추가</button></form><p class="tiny">requires를 쓰면 ‘현재 대상 → 먼저 필요한 대상’ 방향이며 순환 여부도 검사합니다. 관계를 정하는 것과 그 관계가 사실인지 확인하는 것은 각각 검토해야 합니다.</p></div><div class="panel"><h3>두 대상 연결</h3><form id="edge-form" class="form-row"><label>시작 대상<select name="from">${a}</select></label><label>끝 대상<select name="to">${a}</select></label><label>관계<select name="rel">${W(Object.entries(o.relations).map(([s,l])=>[s,l.label]))}</select></label><label>근거 문서<select name="source">${t}</select></label><button class="primary wide" ${o.nodes.length&&Object.keys(o.relations).length?"":"disabled"}>근거와 함께 연결</button></form><details><summary>대상의 속성 추가·수정</summary><form id="attribute-form" class="form-row"><label>대상<select name="id">${a}</select></label>${C("key")}<label>값 종류<select name="kind"><option value="string">글자</option><option value="number">0 이상 숫자</option></select></label>${T("value","값",'required maxlength="500"')}<button class="wide" ${o.nodes.length?"":"disabled"}>속성 반영</button></form></details><div id="personal-validation" class="validation"></div><div class="edges">${o.edges.map((s,l)=>`<div class="edge-row"><span>${p(s.from)} — ${p(o.relations[s.rel]?.label||s.rel)} → ${p(s.to)}<br>근거 ${p(s.source)}</span><button data-remove-edge="${l}">연결 해제</button></div>`).join("")}</div></div></section>`}function De(){let o=b===1?["before"]:["before","after"];return`<section id="personal-evaluation"><div class="section-title"><div><h2>${b===1?"내 질문의 정리 전 답변":"내 질문의 실제 전후 비교"}</h2><p>질문을 저장한 뒤 실제 실행 결과를 기록합니다. 예시의 답변·점수는 가져오지 않습니다.</p></div><button id="import-responses">실제 응답 JSON 불러오기</button></div><div id="personal-score" class="score-summary"></div><details class="panel"><summary>같은 평가 기준 · 각 항목 0–2점</summary><p>정확성: 0 근거와 충돌 / 1 일부 맞거나 누락 / 2 근거에 맞게 답하거나 필요한 판단 보류.<br>일관성: 0 대상·관계 해석이 모순 / 1 일부 용어·방향 흔들림 / 2 ID·관계·판단 범위 유지.<br>출처: 0 없거나 무관 / 1 문서만 제시 / 2 실제 근거 문장 확인 가능.</p><p>세 질문의 답변·근거·점수가 모두 있어야 합산합니다. 한 번의 답변 비교는 반복 실행 안정성 검증과 다릅니다.</p></details>${o.map((e)=>`<div class="panel"><h3>${e==="before"?"BEFORE · 정리 전":"AFTER · 적용 후"} 실행 정보</h3><div class="form-row">${[["model","도구·모델·설정"],["runAt","실행일"]].map(([t,a])=>`<label>${a}<input data-run="${e}|${t}" value="${p(c.records.runs?.[e]?.[t]||"")}" maxlength="200"></label>`).join("")}</div></div>`).join("")}${c.questions.map((e,t)=>`<div class="eval-question"><h3>Q${t+1} · ${p(e||"먼저 내 질문을 저장하세요.")}</h3><div class="${o.length===2?"two-col":""}">${o.map((a)=>{let s=c.records[`Q${t+1}`]?.[a]||{};return`<fieldset class="eval-column" ${e.trim()?"":"disabled"}><legend>${a==="before"?"정리 전":"적용 후"}</legend><label>실제 답변<textarea data-eval="Q${t+1}|${a}|answer" maxlength="20000">${p(s.answer||"")}</textarea></label><label>근거 문서·문장 / 없으면 ‘없음’<textarea data-eval="Q${t+1}|${a}|evidence" maxlength="20000">${p(s.evidence||"")}</textarea></label><div class="scores">${[["accuracy","정확성"],["consistency","일관성"],["source","출처"]].map(([l,n])=>`<label>${n}<select data-eval="Q${t+1}|${a}|${l}"><option value="">미측정</option>${[0,1,2].map((d)=>`<option value="${d}" ${s[l]===d?"selected":""}>${d}점</option>`).join("")}</select></label>`).join("")}</div></fieldset>`}).join("")}</div></div>`).join("")}</section>`}function H(){let o=M[b-1],e=c.model;if($("#personal-app").innerHTML=`<aside class="sidebar"><a href="./" class="brand"><span class="brandmark">k</span><span><strong>내 주제 실습실</strong><small>MY KNOWLEDGE PROJECT</small></span></a><p class="side-label">내 자료로 이어가는 4주</p><nav class="week-nav" aria-label="내 주제 주차">${M.map((t,a)=>`<button data-week="${a+1}" ${b===a+1?'aria-current="step"':""}><span class="num">0${a+1}</span><span>${["주제와 Wiki","관계 설계","에이전트 연결","평가와 운영"][a]}</span></button>`).join("")}</nav><div class="side-bottom"><a href="./">초등교육·건축 예시로 ↗</a><a href="#personal-downloads">내 작업 내려받기 ↓</a><div class="side-card">입력한 자료는 현재 브라우저에 저장됩니다. 다른 기기에서는 프로젝트 JSON을 불러오세요.</div></div></aside><div class="page"><header class="topbar"><span class="crumb">GPTers 24기 / MY TOPIC</span><a href="./">두 사례 살펴보기 ↗</a></header><main id="main" class="main"><p class="eyebrow">MY PROJECT · WEEK 0${b}</p><h1>${p(o.title)}</h1><p class="lead">${p(c.title||"예시를 내 일에 적용해 보세요.")} <span class="tiny">${o.time}</span></p><div class="steps">${o.steps.map((t,a)=>`<div class="step"><span>${a+1}</span><p>${t}</p></div>`).join("")}</div><div class="callout"><b>이번 주 결과물</b><br>${o.done}<br><span class="tiny">동료 확인: ${o.check}</span></div>${Ie()}${b===1?ye():""}<div class="section-title"><div><h2>내 자료와 관계망</h2><p>${e.notes.length}개 문서 · ${e.nodes.length}개 대상 · ${e.edges.length}개 의미 관계</p></div><div class="small-actions"><button data-mode="wiki" aria-pressed="${k==="wiki"}">문서 링크망</button><button data-mode="ontology" aria-pressed="${k==="ontology"}">온톨로지</button><button id="personal-zoom">확대 / 맞춤</button></div></div><section class="workbench"><div class="graph-layout"><div class="graph-area"><svg id="personal-graph" viewBox="0 0 900 440" aria-label="내 주제 관계망" role="group"></svg><p class="graph-help">${k==="wiki"?"1주차에서 문서 링크를 연결하세요. 선은 관련 문서를 잇습니다.":"2주차에서 종류·대상·관계를 정의하세요. 화살표는 시작 대상 → 끝 대상입니다."}</p></div><aside id="personal-inspector" class="inspector"></aside></div></section>${b===2?Le():""}${b===3?`<section class="panel"><h2>내 에이전트에 연결하기</h2><p>이번 주 작업 ZIP을 내려받아 자신의 AKM에 반영하세요. 웹에서 정의한 관계를 실제 문서·메타데이터에 적용하고, 정리 노트를 검토한 뒤 아래 요청문을 실행합니다.</p><pre class="code" id="personal-prompt">${p(j(c,b))}</pre><button id="copy-personal-prompt">요청문 복사</button><p class="tiny">Claude Code·Codex·OpenClaw·Hermes 등 파일을 읽는 에이전트를 사용할 수 있습니다. 결과는 response-template.json 형식으로 저장하고 4주차에서 불러오세요.</p></section>`:""}${b===1||b===4?De():""}<section class="panel"><h2>${b}주차 작업 기록</h2><p>${o.post}</p><textarea id="reflection" maxlength="20000" placeholder="내 문제 → 바꾼 구조 → 실제 결과 → 실패·보류 → 다음 변경">${p(c.reflection[b-1])}</textarea>${b===4?`<label>지속 운영 규칙<textarea id="operations" maxlength="20000" placeholder="자료 추가·수정·폐기 기준, 검토자, 버전, 재실행할 질문">${p(c.operations)}</textarea></label>`:""}<p class="tiny">입력할 때 이 브라우저에 저장됩니다.</p></section><section class="panel" id="personal-downloads"><h2>내 작업을 파일로 이어가기</h2><div class="small-actions"><button class="primary" id="personal-zip">내 ${b}주차 작업 ZIP ↓</button><button id="personal-export">프로젝트 JSON ↓</button><button id="personal-import">프로젝트 JSON 불러오기</button><button id="personal-owl">내 온톨로지 OWL ↓</button></div><p>ZIP에는 내 원자료, Wiki 초안, 고정 질문, 관계 모델, 에이전트 요청문, 응답 양식과 현재 평가가 들어갑니다. Wiki 초안은 작성·검토해서 사용하세요.</p><details><summary>이번 주 파일 미리보기</summary><div class="download-list">${Object.keys(V(c,b)).map((t)=>`<div class="download-row"><code>${p(t)}</code><button data-file="${p(t)}">미리보기</button></div>`).join("")}</div></details><div class="small-actions"><button id="personal-new">현재 작업 저장 후 새 주제</button><a class="button" href="downloads/my-topic-starter.zip" download>빈 4주 양식 ZIP ↓</a></div></section><footer class="footer"><p>내 주제는 이 기기에 저장됩니다.<br>공개 사이트나 AKM 폴더에 자동 전송되지 않습니다.</p><a href="./">초등교육·건축 사례로 돌아가기 ↗</a></footer></main></div>`,Oe(),ee(),b===1||b===4)fe();if(b===2){let t=w(e),a=$("#personal-validation");a.classList.toggle("bad",t.length>0),a.textContent=!e.nodes.length?"원자료를 넣고 대상을 추가하면 검사할 수 있습니다.":t.length?t.map((s)=>s.message).join(`
`):"✓ ID·종류·관계·출처 존재·requires 순환 검사 통과"}}function ee(){let o=c.model,e=k==="wiki",t=e?o.notes.map((i)=>({...i,label:i.title,type:"문서"})):o.nodes,a=e?o.notes.flatMap((i)=>i.links.map((f)=>({from:i.id,to:f,rel:"문서 링크"}))):o.edges,s={};t.forEach((i,f)=>{let r=-Math.PI/2+f*2*Math.PI/t.length;s[i.id]={x:450+300*Math.cos(r),y:215+150*Math.sin(r)}});let l='<defs><marker id="personal-arrow" markerWidth="8" markerHeight="8" refX="18" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#6d9583"/></marker></defs>';for(let i of a){let f=s[i.from],r=s[i.to];if(!f||!r)continue;if(l+=`<line x1="${f.x}" y1="${f.y}" x2="${r.x}" y2="${r.y}" stroke="#9ab5a3" ${e?"":'marker-end="url(#personal-arrow)"'}/>`,!e&&(i.from===N||i.to===N))l+=`<text class="node-caption" x="${(f.x+r.x)/2}" y="${(f.y+r.y)/2-7}" text-anchor="middle" font-size="11">${p(o.relations[i.rel]?.label||i.rel)}</text>`}if(t.forEach((i)=>{let f=s[i.id];l+=`<g class="graph-node" role="button" tabindex="0" data-personal-node="${p(i.id)}" aria-label="${p(i.label)} 선택"><circle cx="${f.x}" cy="${f.y}" r="${i.id===N?15:11}" fill="${i.id===N?"#aa793a":"#286f60"}"/><text x="${f.x}" y="${f.y+30}" class="node-caption" text-anchor="middle" font-size="12">${p(i.label.length>18?i.label.slice(0,17)+"…":i.label)}</text><text x="${f.x}" y="${f.y-20}" text-anchor="middle" font-size="9">${p(i.id)} · ${p(e?"문서":o.classes[i.type]||i.type)}</text></g>`}),!t.length)l+='<text x="450" y="210" text-anchor="middle" fill="#63746c" font-size="17">내 자료와 대상을 추가하면 관계망이 여기에 나타납니다.</text>';$("#personal-graph").innerHTML=l,$("#personal-graph").setAttribute("viewBox",z===1?"0 0 900 440":"180 88 540 264"),document.querySelectorAll("[data-personal-node]").forEach((i)=>{let f=()=>{N=i.dataset.personalNode,ee()};i.onclick=f,i.onkeydown=(r)=>{if(r.key==="Enter"||r.key===" ")r.preventDefault(),f(),document.querySelector(`[data-personal-node="${N}"]`)?.focus()}});let n=t.find((i)=>i.id===N),d=e?n:o.notes.find((i)=>i.id===n?.noteId);$("#personal-inspector").innerHTML=n?`<span class="id">${p(n.id)}</span><h3>${p(n.label)}</h3><p>${p(e?n.source||"출처 미입력":o.classes[n.type])}</p>${!e?`<p>근거: ${p(n.noteId)}</p><ul>${Object.entries(n.attrs).map(([i,f])=>`<li>${p(i)}: ${p(f)}</li>`).join("")}</ul>`:""}<p>${p(d?.body||"연결된 근거 문서가 없습니다.")}</p>`:"<h3>문서나 대상 선택</h3><p>점을 선택하면 내가 입력한 내용과 근거를 확인합니다.</p>"}function fe(){let o=_(c.records);$("#personal-score").textContent=`정리 전: ${o.before??"미측정"}${o.before===null?"":" / 18"} (${o.beforeCount}/3 완료)${b===4?` → 적용 후: ${o.after??"미측정"}${o.after===null?"":" / 18"} (${o.afterCount}/3 완료)`:""}`}function Oe(){document.querySelectorAll("[data-week]").forEach((e)=>e.onclick=()=>{b=Number(e.dataset.week),history.replaceState(null,"",`?week=${b}`),k=b===1?"wiki":"ontology",N="",z=1,H(),window.scrollTo(0,0)}),document.querySelectorAll("[data-mode]").forEach((e)=>e.onclick=()=>{k=e.dataset.mode,N="",H()}),$("#personal-zoom").onclick=()=>{z=z===1?1.5:1,ee()},$("#profile-form").onsubmit=(e)=>{e.preventDefault();let t=Object.fromEntries(new FormData(e.target));if(X()&&c.questions.some((a,s)=>a!==t["q"+s])){g("답변을 기록한 질문은 고정합니다. 새 주제로 시작하세요.");return}O((a)=>{a.title=t.title,a.scope=t.scope,a.excluded=t.excluded,a.revision=t.revision,a.questions=[t.q0,t.q1,t.q2],a.model.name=t.title}),g("주제와 질문을 저장했습니다.")},$("#note-form")?.addEventListener("submit",(e)=>{e.preventDefault();let t=Object.fromEntries(new FormData(e.target));if(c.model.notes.length>=100||c.model.notes.some((a)=>a.id===t.id)){g("자료는 최대 100개이며 서로 다른 ID가 필요합니다.");return}O((a)=>a.model.notes.push({...t,links:[]})),g("원자료를 추가했습니다.")}),$("#wiki-link-form")?.addEventListener("submit",(e)=>{e.preventDefault();let t=Object.fromEntries(new FormData(e.target));if(t.from===t.to){g("다른 문서를 연결하세요.");return}O((a)=>{let s=a.model.notes.find((l)=>l.id===t.from);if(!s.links.includes(t.to))s.links.push(t.to)})}),document.querySelectorAll("[data-unlink]").forEach((e)=>e.onclick=()=>O((t)=>{let[a,s]=e.dataset.unlink.split("|"),l=t.model.notes.find((n)=>n.id===a);l.links=l.links.filter((n)=>n!==s)}));let o=(e)=>!["__proto__","prototype","constructor"].includes(e);$("#class-form")?.addEventListener("submit",(e)=>{e.preventDefault();let t=Object.fromEntries(new FormData(e.target));if(!o(t.id)||Object.hasOwn(c.model.classes,t.id)||Object.keys(c.model.classes).length>=40){g("새 종류 ID를 사용하세요. 최대 40개입니다.");return}O((a)=>a.model.classes[t.id]=t.label)}),$("#node-form")?.addEventListener("submit",(e)=>{e.preventDefault();let t=Object.fromEntries(new FormData(e.target));if(c.model.nodes.some((a)=>a.id===t.id)||c.model.nodes.length>=200){g("대상은 서로 다른 ID로 최대 200개입니다.");return}O((a)=>a.model.nodes.push({...t,attrs:{}}))}),$("#relation-form")?.addEventListener("submit",(e)=>{e.preventDefault();let t=Object.fromEntries(new FormData(e.target));if(!o(t.relId)||Object.hasOwn(c.model.relations,t.relId)||Object.keys(c.model.relations).length>=40){g("새 관계 ID를 사용하세요. 최대 40개입니다.");return}O((a)=>a.model.relations[t.relId]={label:t.label,from:[t.from],to:[t.to]})}),$("#edge-form")?.addEventListener("submit",(e)=>{if(e.preventDefault(),c.model.edges.length>=400){g("관계는 최대 400개입니다.");return}let t=Object.fromEntries(new FormData(e.target));O((a)=>a.model.edges.push(t))}),$("#attribute-form")?.addEventListener("submit",(e)=>{e.preventDefault();let t=Object.fromEntries(new FormData(e.target)),a=t.kind==="number"?Number(t.value):t.value;if(!o(t.key)||t.kind==="number"&&(!Number.isFinite(a)||a<0)){g("속성 ID와 0 이상의 숫자 값을 확인하세요.");return}O((s)=>s.model.nodes.find((l)=>l.id===t.id).attrs[t.key]=a)}),document.querySelectorAll("[data-remove-edge]").forEach((e)=>e.onclick=()=>O((t)=>t.model.edges.splice(Number(e.dataset.removeEdge),1))),document.querySelectorAll("[data-eval]").forEach((e)=>e.oninput=()=>{if(le(c.records,e.dataset.eval,e.value),S(),fe(),e.dataset.eval.endsWith("|answer")&&X())document.querySelectorAll('#profile-form [name^="q"]').forEach((t)=>t.readOnly=!0)}),document.querySelectorAll("[data-run]").forEach((e)=>e.oninput=()=>{let[t,a]=e.dataset.run.split("|");c.records.runs??={},c.records.runs[t]??={},c.records.runs[t][a]=e.value,S()}),$("#reflection").oninput=(e)=>{c.reflection[b-1]=e.target.value,S()},$("#operations")?.addEventListener("input",(e)=>{c.operations=e.target.value,S()}),$("#copy-personal-prompt")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(j(c,b)),g("내 주제 요청문을 복사했습니다.")}catch{ce("내 주제 요청문",j(c,b))}}),$("#personal-export").onclick=()=>q("personal-project.json",Q(c)),$("#personal-import").onclick=()=>ue("project"),$("#import-responses")?.addEventListener("click",()=>ue("responses")),$("#personal-zip").onclick=()=>{q(`my-topic-week${b}.zip`,ie(V(c,b)),"application/zip")},$("#personal-owl").onclick=()=>{if(!c.model.nodes.length||w(c.model).length){g("대상을 추가하고 관계 검사 오류를 해결한 뒤 내보내세요.");return}q("my-topic-ontology.ttl",G({...c.model,name:c.title||"내 주제"}),"text/turtle")},document.querySelectorAll("[data-file]").forEach((e)=>e.onclick=()=>ce(e.dataset.file,V(c,b)[e.dataset.file])),$("#personal-new").onclick=()=>{q("personal-project-backup.json",Q(c)),c=K(),b=1,k="wiki",N="",S(),H(),g("이전 프로젝트를 다운로드하고 새 주제를 열었습니다.")}}function ue(o){let e=document.createElement("input");e.type="file",e.accept=".json,application/json",e.className="hidden",e.dataset.personalImport=o,document.body.appendChild(e),e.onchange=async()=>{try{let t=e.files[0];if(!t)return;if(t.size>1e6)throw Error("파일은 1MB 이하로 준비하세요.");let a=await t.text();c=o==="project"?U(a):re(c,a),S(),H(),g("내 작업을 불러왔습니다.")}catch(t){g("불러오지 못했습니다. "+t.message)}finally{e.remove()}},e.oncancel=()=>e.remove(),e.click()}H();if(Z)g(Z);})();
