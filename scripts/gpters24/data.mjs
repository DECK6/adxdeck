import geometry from './rooms.json' with {type:'json'};
const note=(id,title,body,links=[])=>({id,title,body,links});
const node=(id,label,type,noteId,attrs={})=>({id,label,type,noteId,attrs});
const edge=(from,rel,to,source)=>({from,rel,to,source});
const relation=(label,from,to)=>({label,from,to});
export const weeks=[
 {title:'내 지식을 Wiki로',short:'LLM Wiki',date:'9월 30일',lead:'흩어진 노트 10개를, AI가 찾아 읽는 지식으로.',goal:'자료의 출처를 보존하고 문서 구조·인덱스·링크를 만듭니다. AKM으로 시작하는 것을 권장합니다.',steps:['자료 10개를 읽고 내 도메인의 범위를 한 문장으로 정하세요.','질문 3개에 대한 현재 에이전트의 답과 출처를 기록하세요.','AKM에 원본과 정리한 지식을 나눠 넣고 관계망을 확인하세요.'],output:'도메인 정의서 · 진단 기록 · LLM Wiki v1',homework:'대표 노트를 재구조화한 과정과 달라진 점을 사례글 1편으로 남기세요.'},
 {title:'관계에 뜻을 더하기',short:'온톨로지 설계',date:'10월 7일',lead:'링크가 있다는 것에서, 어떤 관계인지 아는 것으로.',goal:'답하지 못한 질문에서 출발해 대상의 종류·속성·관계와 검사 규칙을 정의합니다.',steps:['문서 링크만으로 답하기 어려운 질문을 하나 고르세요.','아래 만들기 도구에서 대상과 관계를 추가하고 원문을 연결하세요.','검사 오류를 확인하고 JSON·OWL 파일과 설계 노트를 내보내세요.'],output:'내 도메인 온톨로지 스키마 v1',homework:'추가한 관계가 어떤 질문을 해결하는지 사례글 1편으로 설명하세요.'},
 {title:'에이전트가 찾아 쓰게',short:'에이전트 연결',date:'10월 14일',lead:'관계를 따라 찾고, 근거를 함께 답하게 만듭니다.',goal:'스키마를 문서와 메타데이터에 반영하고 본인이 쓰는 에이전트에 파일을 연결합니다.',steps:['3주차 파일을 새 실습 AKM에 넣고 에이전트에서 그 폴더를 여세요.','연결 프롬프트를 붙여 넣고 같은 질문 3개를 실행하세요.','답의 문장마다 출처와 모르는 범위가 있는지 확인하세요.'],output:'출처와 함께 답하는 에이전트 연결 데모',homework:'실제 에이전트의 답·출처·실패 장면을 담아 사례글 1편을 작성하세요.'},
 {title:'나아졌는지 확인하기',short:'평가와 운영',date:'10월 21일',lead:'같은 질문으로 비교하고, 오래 쓸 규칙을 남깁니다.',goal:'정확성·일관성·출처를 비교하고 자료 추가·수정·폐기와 스키마 변경의 운영 기준을 정합니다.',steps:['1주차에 남긴 질문·답변을 그대로 불러오세요.','현재 답변과 근거를 나란히 읽고 같은 기준으로 평가하세요.','개선되지 않은 질문과 다음 변경을 운영 노트에 남기세요.'],output:'완성 시스템 · 평가 리포트 · 지속 운영 규칙',homework:'새 과제 없이 완성한 시스템을 최종 발표합니다.'}
];
const education={
 id:'education',name:'초등교육',eyebrow:'LEARNING PATH',accent:'#286f60',intro:'분수를 배우는 순서, 교재, 확인 질문을 연결합니다.',
 scope:'가상의 초등 수학 수업 설계 자료입니다. 선수 관계는 이 수업의 교수학습 가정이며 공식 교육과정의 필수 순서나 학생 진단 결과가 아닙니다.',
 provenance:'기존 초등교육 온톨로지의 학습 주제·교수학습 후보 관계·출처 구분 방식을 참고해 새로 작성했습니다. 실제 학생 기록과 교과서 원문은 포함하지 않습니다.',
 classes:{Topic:'학습 주제',Material:'교재',Assessment:'확인 질문',Path:'학습 경로',Plan:'수업 설계'},
 relations:{requires:relation('먼저 확인한다',['Topic'],['Topic']),teaches:relation('학습을 돕는다',['Material'],['Topic']),checks:relation('이해를 확인한다',['Assessment'],['Topic']),targets:relation('도달 목표로 삼는다',['Path'],['Topic']),documents:relation('설계를 기록한다',['Plan'],['Path'])},
 notes:[
 note('E01','똑같이 나누기','한 장의 종이를 같은 크기의 네 부분으로 나눈다. 조각 수가 같아도 크기가 다르면 똑같이 나눈 것이 아니다. 다음 시간에 분수를 설명하기 전 이 장면을 먼저 확인한다. 이 자료는 교사가 만든 가상 수업 메모다.',['E02','E06']),
 note('E02','분수의 뜻','전체를 같은 크기로 나눈 부분 중 몇 개를 택했는지 분수로 나타낸다. 전체를 5등분하고 2조각을 택하면 2/5이다. 먼저 E01의 똑같이 나누기를 확인한다. 분모는 전체를 나눈 수, 분자는 택한 부분 수다.',['E01','E03','E06']),
 note('E03','단위분수','분자가 1인 분수를 단위분수라고 부른다. 3/5는 1/5 세 개로 설명할 수 있다. 분수의 뜻을 이해했는지 먼저 확인한다. 서로 다른 전체를 기준으로 분수의 크기를 비교하지 않도록 주의한다.',['E02','E04']),
 note('E04','분모가 같은 분수의 크기 비교','같은 전체를 같은 수로 나눴을 때 선택한 부분 수를 비교한다. 2/5와 4/5는 1/5 두 개와 네 개로 비교한다. 이 수업에서는 단위분수를 먼저 확인한다. 비교 카드 M2와 확인 질문 A1을 사용한다.',['E03','E07','E08']),
 note('E05','분모가 같은 분수의 덧셈','같은 전체에서 1/5와 2/5를 합하면 3/5이다. 분모를 더해 3/10으로 쓰는 오류를 구분한다. 이 수업 설계에서는 크기 비교까지 확인한 뒤 덧셈으로 이동한다. 이 순서는 교수학습 가정이지 모든 학생의 유일한 경로가 아니다.',['E04','E09']),
 note('E06','교재 · 분수 띠 M1','같은 길이의 종이 띠를 2·3·4·5등분한 자료다. 직접 색칠해 분수의 뜻을 설명한다. 준비물은 종이와 색연필이다. 출판 교재를 복제한 것이 아니라 스터디용으로 작성한 활동 설명이다.',['E01','E02']),
 note('E07','교재 · 비교 카드 M2','같은 전체를 5등분한 카드에 2/5, 3/5, 4/5를 각각 색칠한다. 어떤 수가 큰지 고르고 1/5의 개수를 근거로 말한다. 분모가 같은 분수의 크기 비교를 돕는 자료다.',['E04','E08']),
 note('E08','확인 질문 A1 · 설명을 듣기','질문: 같은 크기의 두 종이에서 2/5와 4/5 중 어느 쪽이 더 큰가요? 왜 그렇게 생각했나요? 예시 기준: 4/5를 고르고 같은 전체·같은 단위의 개수로 설명한다. 학생 답변·점수·관찰 날짜는 아직 없다. 이 질문이 있다는 사실만으로 민지A의 이해 여부를 판단할 수 없다.',['E04','E07']),
 note('E09','경로 P1 · 분수 덧셈 준비','도달 목표는 분모가 같은 분수의 덧셈이다. 제안 경로는 똑같이 나누기 → 분수의 뜻 → 단위분수 → 같은 분모의 크기 비교 → 덧셈이다. 어려움이 발견되면 앞 단계의 설명을 다시 살핀다. 자동 학생 배치 규칙은 아니다.',['E01','E02','E03','E04','E05','E10']),
 note('E10','수업 설계와 근거의 경계','이 묶음은 GPTers 24기에서 관계와 출처를 다루기 위한 합성 사례다. requires는 이 수업에서 먼저 확인하기로 한 주제를 뜻한다. E09의 경로를 기록하고 관리한다. 실제 학생 성취, 공식 성취기준 충족, 효과 검증을 주장하지 않는다. 관계를 바꾸면 변경 이유와 검토자를 남긴다.',['E09'])],
 nodes:[node('T1','똑같이 나누기','Topic','E01'),node('T2','분수의 뜻','Topic','E02'),node('T3','단위분수','Topic','E03'),node('T4','분수 크기 비교','Topic','E04'),node('T5','동분모 분수 덧셈','Topic','E05'),node('M1','분수 띠','Material','E06'),node('M2','비교 카드','Material','E07'),node('A1','설명 확인 질문','Assessment','E08'),node('P1','덧셈 준비 경로','Path','E09'),node('S1','수업 설계 메모','Plan','E10')],
 edges:[edge('T2','requires','T1','E02'),edge('T3','requires','T2','E03'),edge('T4','requires','T3','E04'),edge('T5','requires','T4','E05'),edge('M1','teaches','T2','E06'),edge('M2','teaches','T4','E07'),edge('A1','checks','T4','E08'),edge('P1','targets','T5','E09'),edge('S1','documents','P1','E10')],
 questions:['분모가 같은 분수의 덧셈 전에 어떤 주제를 어떤 순서로 확인하나요?','분수 크기 비교를 돕는 교재와 이해 확인 질문은 무엇인가요?','민지A가 분수 덧셈을 이해했다고 판단할 수 있나요?'],
 traps:['링크만 보면 선수 관계와 교재 연결이 같은 선으로 보입니다.','확인 질문이 있다는 사실과 학생이 실제로 답했다는 사실은 다릅니다.'],
 error:{from:'T1',rel:'requires',to:'T5',source:'E10'},target:'T5'
};
const roomNotes={'LIVING':'A02','DINING':'A03','KITCHEN':'A03','HALL':'A06','BED-1':'A04','BED-2':'A04','BED-3':'A04','BATH-1':'A05','BATH-2':'A05','DRESS':'A04'};
const rooms=geometry.rooms.map(r=>{const xs=r.points.map(p=>p[0]),ys=r.points.map(p=>p[1]);const x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y;return node(r.id,r.label,'Space',roomNotes[r.id],{role:r.id.startsWith('BED-')?'bedroom':r.id.startsWith('BATH-')?'bathroom':r.id.toLowerCase(),areaM2:Number((w*h/1e6).toFixed(4)),x,y,w,h});});
const architecture={
 id:'architecture',name:'한국 주거 건축',eyebrow:'SPACE & EVIDENCE',accent:'#365e85',intro:'방 3개·욕실 2개, 넓은 거실과 통창을 가진 집을 읽습니다.',
 scope:'FAMILY-02 가상 주택을 줄여 만든 학습용 모델입니다. 원 모델의 공간 좌표를 사용하며 건축 인허가·구조 안전·법규 적합 판정은 포함하지 않습니다.',
 provenance:`이전에 만든 FAMILY-02(2026-09-10)의 공간 10개 좌표를 재사용했습니다. 원 모델 SHA-256: ${geometry.sourceSha256}. 부품 관계는 설명용 부분 모델입니다.`,
 classes:{Building:'주택',Space:'공간',Window:'창',Opening:'개구부',Wall:'벽',Door:'문',Drawing:'도면',Rule:'요구 조건'},
 relations:{contains:relation('공간을 포함한다',['Building'],['Space']),fillsOpening:relation('개구부를 채운다',['Window'],['Opening']),hostedBy:relation('벽에 뚫려 있다',['Opening'],['Wall']),bounds:relation('경계를 이룬다',['Wall'],['Space']),connects:relation('공간에 연결된다',['Door'],['Space']),depicts:relation('형상을 나타낸다',['Drawing'],['Building']),appliesTo:relation('요구를 적용한다',['Rule'],['Building'])},
 notes:[
 note('A01','주택 요구사항 · FAMILY-02','요청은 침실 3개, 욕실 2개, 넓은 거실과 통창, 거실·주방·다이닝 분리다. 긴 복도를 줄인 FAMILY-02 가상 배치를 대상으로 한다. 실제 주소·대지 조건·허가 정보는 없다. 이 문서는 사용자 공간 요구를 실습용으로 다시 쓴 것이다.',['A02','A03','A04','A05','A09','A10']),
 note('A02','거실 · 넓이와 위치','LIVING의 실내 경계는 mm 단위로 (3860,0)–(10540,5540)이다. 넓이는 37.0072㎡다. 남측 벽과 거실 통창을 확인한다. 수치는 FAMILY-02 모델 좌표로 계산했으며 현장 실측값이 아니다.',['A01','A07','A09']),
 note('A03','주방과 다이닝 · 분리된 공간','KITCHEN은 (0,6160)–(3740,9200), DINING은 (3860,5660)–(7740,9200)이다. LIVING과 각각 다른 공간 ID와 형상을 갖는다. 주방은 11.3696㎡, 다이닝은 13.7352㎡다. 공간 간 문은 원 모델에 있으며 여기서는 대표 연결만 다룬다.',['A02','A08','A09']),
 note('A04','침실 세 개와 드레스룸','BED-1은 안방, BED-2와 BED-3은 두 침실이다. DRESS는 드레스룸으로 침실 수에 포함하지 않는다. 원 모델의 실내 영역을 도면에서 선택해 확인한다. 방의 수는 단어 빈도 대신 공간 ID와 역할로 센다.',['A01','A05','A09']),
 note('A05','욕실 두 개','BATH-1은 공용 욕실, BATH-2는 안방 욕실이다. 각각 별도 공간으로 기록한다. 설비·배관·환기·방수의 실제 시공 적합성은 이 묶음으로 판단하지 않는다.',['A04','A09','A10']),
 note('A06','현관과 짧은 홀','HALL은 (7860,5660)–(10540,9200), 넓이는 9.4872㎡다. 긴 복도를 줄인 배치이며 공간 효율과 거주 품질을 넓이 하나로 판단하지 않는다. D-LIVING은 홀과 거실을 연결하는 대표 문이다.',['A02','A08','A09']),
 note('A07','거실 통창 · 창과 개구부와 벽','WINDOW는 폭 6000mm·높이 2400mm인 시각화 가정의 거실 통창이다. 창은 OPENING을 채우고, OPENING은 SOUTH-WALL에 뚫려 있으며 SOUTH-WALL은 LIVING의 남측 경계를 이룬다. 창 자체를 벽이나 공간으로 분류하지 않는다. 유리 구조·열성능 검토는 없다.',['A02','A09','A10']),
 note('A08','문 · 홀과 거실의 연결','D-LIVING은 HALL과 LIVING 두 공간을 연결한다. 이것은 문이 어떤 공간의 이동을 잇는지 보여주는 부분 모델이다. 모델의 문 기호와 실제 통과 유효폭, 피난 적합성을 같은 것으로 해석하지 않는다.',['A02','A06','A09']),
 note('A09','도면 · 좌표와 리비전','DRAWING은 HOUSE를 나타내며 리비전은 FAMILY-02다. 도면의 직사각형은 원 모델의 실내 공간 경계다. mm 좌표, 방 이름, 넓이는 모델과 함께 읽는다. 이 실습의 도면은 벽·문짝·설비가 생략된 공간 관계 도식이며 실시설계 도면이 아니다.',['A01','A02','A03','A04','A05','A06']),
 note('A10','요구 조건과 판단 보류','이 사례의 요구는 침실 3개·욕실 2개, 거실/주방/다이닝의 별도 공간, 폭 6m 통창이다. 이는 사용자의 설계 요구이지 법정 최소 기준이 아니다. 프로젝트 위치, 적용 절차, 구조 검토, 허가 증거가 없으므로 허가 완료나 안전을 판정하지 않는다.',['A01','A07','A09'])],
 nodes:[node('HOUSE','FAMILY-02 주택','Building','A01'),...rooms,node('WINDOW','거실 통창','Window','A07',{widthMm:6000,heightMm:2400}),node('OPENING','통창 개구부','Opening','A07'),node('SOUTH-WALL','거실 남측 벽','Wall','A07'),node('D-LIVING','홀–거실 문','Door','A08'),node('DRAWING','공간 배치 도면','Drawing','A09',{revision:'FAMILY-02'}),node('BRIEF','방 3 · 욕실 2','Rule','A10')],
 edges:[...rooms.map(r=>edge('HOUSE','contains',r.id,r.noteId)),edge('WINDOW','fillsOpening','OPENING','A07'),edge('OPENING','hostedBy','SOUTH-WALL','A07'),edge('SOUTH-WALL','bounds','LIVING','A07'),edge('D-LIVING','connects','HALL','A08'),edge('D-LIVING','connects','LIVING','A08'),edge('DRAWING','depicts','HOUSE','A09'),edge('BRIEF','appliesTo','HOUSE','A10')],
 questions:['침실 3개·욕실 2개이고 거실·주방·다이닝이 분리된 모델인가요?','거실 통창은 어떤 개구부와 벽을 통해 거실과 연결되나요?','이 도면만으로 구조 안전과 건축 허가 완료를 판단할 수 있나요?'],
 traps:['침실이라는 단어가 세 번 나온 것과 서로 다른 침실 세 개가 있는 것은 다릅니다.','도면 정합성 검사와 법규·구조 안전 검토는 다릅니다.'],
 error:{from:'WINDOW',rel:'fillsOpening',to:'LIVING',source:'A07'},target:'WINDOW'
};
export const domains={education,architecture};
