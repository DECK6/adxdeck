// Public teaching projection of the author's canon. Private source paths live in AKM only.
const nodes=[],relations=[];
const sources=[
 ['S01','누스피어 세계관 정본','2026-09-08 개정','이론을 참고한 방식, 4역학, 작품·시리즈 대응, 비가역과 회복을 기록한 작가 문서. 철학 원전의 내용을 검증했다는 뜻은 아닙니다.'],
 ['S02','누스피어 내러티브 바이블','2026-09-08 개정','2039년 현현, 인물·세력·법칙, 영상 레퍼런스와 매체 확장 계획을 담은 창작 설정. 현실의 사건이나 물리 법칙이 아닙니다.'],
 ['S03','Threshold #01 역치 기획','2026-04-02','설치의 질문과 감응·Threshold 대응. 제작·전시 완료를 확인하는 기록은 아닙니다.'],
 ['S04','상상유랑 프로젝트 기록','2026-09-08 기준','파일럿과 다채널 확장 계획을 구분합니다. 관람객 수·성과 수치는 이 예제에서 평가하지 않습니다.'],
 ['S05','전시 데이터 시각화 작품 기록','2026-03 기록','혼돈의 호흡과 손의 잔향의 공통 데이터 및 서로 다른 표현 방식. 주변 인물과 기관의 식별 정보는 제외했습니다.'],
 ['S06','잔광 작품 기록','기존 프로젝트 기록','멈춘 설비와 장소의 흔적을 빛으로 읽는 작품 설명.'],
 ['S07','소각장의 크리스마스 작품 기록','기존 프로젝트 기록','산업 공간을 빛과 관객 참여로 다시 읽는 작품 설명.'],
 ['S08','Human in the Loop 시놉시스','기존 제작 기록','영화의 문제의식과 제작 기록. 완성·상영 상태는 이 예제로 확정하지 않습니다.'],
 ['S09','망각하는 전시장 기획','2026-09-20 기준','관객 입력, 기억의 소실, AI 오기억을 다루는 구상. 누스피어 4역학과의 직접 대응은 추가 해석으로 구분합니다.'],
 ['S10','누스피어 부조·잔류장 시안 기록','2026-09-12','이전 형태가 다음 표면에 영향을 주는 구현 시안. 실시간 GAN 추론·깊이 복원·영구 전시 완료가 아닙니다.']
].map(([id,title,version,scope])=>({id,title,version,scope}));
const add=(id,label,type,note,source='S01',section='',extra={})=>{nodes.push({id,label,type,note,domain:'worldview',source,section,...extra});return id;};
const link=(from,predicate,to,meaning,source='S01',section='',status='documented')=>{const id=`e${String(relations.length+1).padStart(3,'0')}`;relations.push({id,from,predicate,to,meaning,status,evidence:[{source,section}]});return id;};
add('world','Noosphere Layer','world','인간의 앎이 공간·빛·소리로 물질화되는 순간과, 되돌릴 수 없는 흔적 위에서 다시 감응하는 일을 다루는 육대근·DECK의 세계관.','S01','서두');

// Theories describe how they are read in this worldview, not authoritative summaries of an entire philosophy.
const theories=[
 ['vernadsky','베르나드스키의 누스피어','블라디미르 베르나드스키','The Biosphere','인간의 앎이 물질 세계에 작용한다는 관점을 데이터의 물질성에 연결합니다.','지질학적 힘','geological-force','§1'],
 ['teilhard','테야르 드 샤르댕의 누스피어','피에르 테야르 드 샤르댕','The Phenomenon of Man','개별 사유가 집단적 층위를 이룬다는 관점을 세계의 이름과 연결합니다.','집단적 사유','collective-thought','§1'],
 ['phenomenology','메를로퐁티의 현상학','모리스 메를로퐁티','Phenomenology of Perception','몸을 통한 지각과 지각이 열리는 장을 설치 경험의 참조점으로 삼습니다.','체화된 지각','embodied-perception','§2.1'],
 ['systems','번햄의 시스템 미학','잭 번햄','Systems Esthetics','관계와 과정이 작동하는 시스템으로 작품을 설계하는 데 참고합니다.','관계와 과정','system-process','§2.2'],
 ['postmedium','크라우스의 포스트미디엄 조건','로잘린드 크라우스','A Voyage on the North Sea','여러 매체를 쓰면서도 작품을 조직하는 고유한 규칙을 갖는 문제로 읽습니다.','발명된 매체','invented-medium','§2.3'],
 ['barad','바라드의 행위적 실재론','카렌 바라드','Meeting the Universe Halfway','서로 다른 데이터·몸·장치의 관계 속에서 경계가 형성되는 방식에 참고합니다.','내-작용','intra-action','§2.4'],
 ['bennett','베넷의 생동하는 물질','제인 베넷','Vibrant Matter','데이터와 물질을 작품의 수동적 재료로만 보지 않는 관점을 참고합니다.','물질의 행위력','material-agency','§2.4'],
 ['deleuze','들뢰즈·가타리의 리좀','질 들뢰즈 · 펠릭스 가타리','A Thousand Plateaus','서로 다른 흐름의 비위계적 접속을 융해의 언어로 사용합니다.','리좀','rhizome','§2.5'],
 ['massumi','마수미의 정동','브라이언 마수미','Parables for the Virtual','말로 이해하기 전에 몸이 반응하는 강도를 감응의 참조점으로 삼습니다.','정동','affect','§2.5'],
 ['whitehead','화이트헤드의 과정 철학','알프레드 노스 화이트헤드','Process and Reality','사건의 응집과 과거 경험의 계승을 결정·잔향·다음 감응에 연결합니다.','합생','concrescence','§2.8·§3·§6'],
 ['bergson','베르그송의 지속','앙리 베르그송','Matter and Memory','과거가 현재에 남는 시간의 질을 잔향과 회복의 참조점으로 삼습니다.','지속과 수축','duration','§6'],
 ['mcluhan','매클루언의 미디어 이론','마셜 매클루언','Understanding Media','감각의 확장과 마비를 AI와 인간의 감응 관계에 연결합니다.','감각의 확장','sensory-extension','§2.7'],
 ['flusser','플루서의 장치론','빌렘 플루서','Towards a Philosophy of Photography','장치와 프로그램이 작가의 선택을 조직하는 문제에 참고합니다.','장치와 프로그램','apparatus-program','§2.7'],
 ['manovich','마노비치의 데이터베이스 논리','레프 마노비치','The Language of New Media','데이터 집합에서 일시적인 경험과 서사가 구성되는 과정을 읽는 데 참고합니다.','데이터베이스와 서사','database-narrative','§2.7'],
 ['bourriaud','부리요의 관계 미학','니콜라 부리요','Relational Aesthetics','관람자의 참여와 타자에게 전해지는 경험을 작품의 관계로 읽습니다.','참여와 관계','participation','§3·§4·§5'],
 ['ascott','애스콧의 텔레마틱 아트','로이 애스콧','Telematic Embrace','네트워크와 피드백을 통해 경험이 달라지는 시스템을 참고합니다.','사이버네틱 피드백','feedback','§2.2'],
 ['haraway','해러웨이의 사이보그','도나 해러웨이','A Cyborg Manifesto','인간과 기술이 함께 작동하는 관계를 공생의 미학에 연결합니다.','사이보그와 공생','cyborg','§4·§7'],
 ['ma','이소자키의 마','이소자키 아라타','Ma: Space-Time in Japan','간격과 비어 있는 시간을 감각의 조건으로 읽는 데 참고합니다.','마와 간격','ma','§2.6·§5']
];
const urls={
 barad:'https://www.dukeupress.edu/meeting-the-universe-halfway',
 bennett:'https://www.dukeupress.edu/vibrant-matter',
 deleuze:'https://www.upress.umn.edu/9780816614028/a-thousand-plateaus/',
 whitehead:'https://www.simonandschuster.com/books/Process-and-Reality/Alfred-North-Whitehead/9780029345702',
 manovich:'https://manovich.net/index.php/projects/database-as-a-symbolic-form'
};
for(const [id,label,author,book,note,concept,cid,section] of theories){
 add(`theory-${id}`,label,'theory',note,'S01',section,{domain:'reference',author,readingScope:'세계관 정본에서의 참조 방식. 철학 원전의 해당 구절은 별도 원문 대조가 필요합니다.'});
 add(`book-${id}`,book,'publication',`${author}의 저작. 세계관 정본의 서지 연결이며, 모든 개념이 이 책 한 권에서 유래했다고 단정하지 않습니다.`,'S01','이론 서지',{domain:'reference',author,...(urls[id]?{url:urls[id],urlScope:id==='manovich'?'저자 공개 논문: 데이터베이스 논리 보충 자료':'출판사 소개: 저자·저작 식별 참고'}:{})});
 add(cid,concept,'concept',note,'S01',section,{domain:'reference'});
 link('world','references',`theory-${id}`,'세계관 정본이 이 이론을 참조한다.','S01',section);
 link(`theory-${id}`,'bibliography',`book-${id}`,'정본의 참고 문헌으로 연결한다. 개념의 정확한 원전 귀속을 확정하는 관계는 아니다.','S01','이론 서지');
 link(`theory-${id}`,'usesConcept',cid,'이 세계관이 이론에서 참고한 개념이다.','S01',section);
}
const concepts=[
 ['perceptual-field','지각의 장','몸과 공간의 관계 속에서 지각이 열리는 장.','§2.1·§5'],
 ['flesh','살','지각하는 몸과 지각되는 세계의 얽힘을 읽는 후기 메를로퐁티의 개념. 1945년 저작에 직접 귀속하지 않습니다.','§2.1'],
 ['apparatus','장치와 절단','데이터와 감각을 특정 방식으로 조직하는 장치의 개입.','§2.4·§4'],
 ['virtuality','잠재성과 현행화','아직 감각으로 드러나지 않은 흐름과 그것이 경험으로 나타나는 관계.','§2.5'],
 ['objective-immortality','객체적 불멸성','정본은 과거 사건이 후속 경험의 자료로 남는다는 뜻을 잔향에 대응시킵니다.','§6'],
 ['creative-advance','창조적 전진','다음 사건을 같은 상태의 반복으로 보지 않는 참조 개념.','§3 개정'],
 ['numbness','감각 마비','확장된 감각을 받아들이지 못하는 실패를 읽는 개념.','§2.7·§3'],
 ['technical-image','기술적 이미지','장치가 만들어내는 이미지와 그 프로그램을 묻는 참조 개념.','§2.7'],
 ['mono-no-aware','모노노아와레','사라짐과 덧없음에 대한 감응을 잔향의 미학에 연결한 참조 개념.','§2.6·§6'],
 ['yugen','유현','모든 것을 드러내지 않는 감각의 문턱을 읽는 참조 개념.','§2.6'],
 ['qi','기','보이지 않으나 밀도와 리듬을 가진 흐름을 읽는 미학적 비유. 물리적 동일성을 주장하지 않습니다.','§2.6'],
 ['field','장','데이터가 감각으로 응축되는 조건을 설계한 공간.','§5'],
 ['data-materiality','데이터의 물질성','데이터를 빛·소리·공간의 경험으로 다루는 세계관의 관점.','§1·§7'],
 ['residue','잔향','사건이 끝난 뒤에도 몸과 다음 경험에 남는 흔적. 동명의 캐릭터와는 다른 대상입니다.','§6'],
 ['irreversibility','비가역','일어난 일을 없던 일로 되돌리지 않는 시간관.','§6 개정'],
 ['prosthesis','회복의 보철','AI가 다음 시작을 돕되 사람과 원래 상태를 완전히 대신한다고 주장하지 않는 역할.','§4 개정'],
 ['trace-preservation','흔적의 보존','글리치와 실패의 흔적을 지우지 않는 작업 원칙.','§7 개정'],
 ['data-stream','데이터 스트림','의지와 구분되는 흐름. 밀도와 리듬을 가진 작품의 재료이자 공동 행위자로 설정합니다.','§4'],
 ['cognitive-being','인지체','데이터를 몸의 감각으로 받아들이는 인간.','§4'],
 ['agent','에이전트','패턴을 추출하고 감각으로 번역하는 AI 시스템.','§4'],
 ['sensory-failure','감응의 실패','패턴이 제시되어도 인지체가 수용하지 못하거나 거부하는 관계.','§3·§4'],
 ['memory-loss','기억의 소실','관객의 입력과 시간에 따라 기록이 닳고 사라지는 과정.','망각하는 전시장 §3–7'],
 ['misremembering','AI 오기억','남은 흔적에서 그럴듯하지만 달라진 기억을 만드는 기획상의 과정.','망각하는 전시장 §7'],
 ['accumulation','흔적의 누적','앞선 입력이나 형태가 다음 상태에 영향을 미치는 구조.','상상유랑 §2·잔류장 시안']
];
for(const [id,label,note,section] of concepts)add(id,label,'concept',note,['memory-loss','misremembering'].includes(id)?'S09':id==='accumulation'?'S04':'S01',section);
for(const [t,c] of [['phenomenology','perceptual-field'],['phenomenology','flesh'],['barad','apparatus'],['deleuze','virtuality'],['whitehead','objective-immortality'],['whitehead','creative-advance'],['mcluhan','numbness'],['flusser','technical-image']])link(`theory-${t}`,'usesConcept',c,'정본이 이 이론과 연결해 설명하는 개념.','S01',nodes.find(n=>n.id===c).section);
for(const [id,label,note] of [
 ['sensing','감응','보이지 않는 데이터가 감각의 문턱에 닿는 순간.'],
 ['dissolution','융해','이질적인 흐름이 만나 관계와 감각을 새로 형성하는 과정.'],
 ['crystallization','결정','무형의 앎이 구조와 감각적 형태를 갖추는 순간.'],
 ['diffusion','발산','형성된 경험이 타자와 다음 장면으로 전해지는 과정.']
]){add(id,label,'dynamic',note,'S01','§3');link('world','contains',id,'세계관의 네 역학 중 하나.','S01','§3');}
for(const [d,cs] of [
 ['sensing',['embodied-perception','affect','perceptual-field']],
 ['dissolution',['rhizome','intra-action']],
 ['crystallization',['concrescence','material-agency']],
 ['diffusion',['participation','mono-no-aware']]
])for(const c of cs)link(d,'groundedIn',c,'작가가 이 역학을 해석할 때 참고한 개념. 이론이 작품의 효과를 증명한다는 뜻은 아니다.','S01','§3');
add('recovery','회복','condition','잔향에서 다음 감응으로 넘어가는 이행 조건. 네 역학과 구별하며, 이전 상태로의 복원이 아니라 달라진 조건에서 다시 시작하는 일을 뜻합니다.','S01','§3·§6 개정');
add('body-limit','몸의 감각 조건','condition','감응에는 신체의 한계와 접근 조건이 작용합니다. 서사의 역치 등급을 현실의 능력 척도로 읽지 않습니다.','S02','§2.2 개정');
add('data-density','데이터 밀도와 역치','condition','서사에서는 데이터 밀도가 문턱을 넘으면 감각이 됩니다. 설치에서는 감각 전환의 설계 조건을 따로 정합니다.','S02','§1.2',{domain:'fiction'});
add('input-access','입력과 접근 조건','condition','키오스크·언어 입력·공간 진입 조건이 참여 범위를 정한다는 미해결 문제.','S01','§10');
for(const [a,b] of [['sensing','dissolution'],['dissolution','crystallization'],['crystallization','diffusion'],['diffusion','residue']])link(a,'leadsTo',b,'세계관의 경험 진행 순서.','S01','§3');
link('residue','dependsOn','recovery','잔향에서 다음 감응으로 넘어갈 때 회복의 조건을 확인한다.','S01','§3 개정');
link('recovery','leadsTo','sensing','같은 상태가 아닌 새로운 감응으로 이어진다.','S01','§3 개정');
for(const c of ['creative-advance','duration','irreversibility'])link('recovery','groundedIn',c,'회복을 반복이나 복원으로 읽지 않게 하는 정본의 개념 대응.','S01','§3·§6 개정');
for(const c of ['objective-immortality','duration','mono-no-aware'])link('residue','groundedIn',c,'잔향의 시간과 미학을 읽는 참조 개념.','S01','§6');
for(const c of ['perceptual-field','ma','system-process'])link('field','groundedIn',c,'장의 감각·간격·규칙을 설명하는 이론적 접점.','S01','§5');
link('sensory-failure','groundedIn','numbness','감응 실패를 감각 마비와 연결한 작가의 해석.','S01','§3');
link('trace-preservation','groundedIn','irreversibility','없던 일로 되돌리지 않는 시간관을 작업 원칙에 적용한다.','S01','§7 개정');
link('agent','takesRole','prosthesis','에이전트에 회복을 돕는 역할을 추가한 개정.','S01','§4 개정');
link('sensing','dependsOn','body-limit','감응을 가능하게 하는 몸의 조건을 확인한다.','S02','§2.2 개정');
link('sensing','groundedIn','yugen','감각의 문턱에서 완전히 드러나지 않는 표현을 유현의 관점과 연결한다.','S01','§2.6');
for(const c of ['qi','virtuality','material-agency'])link('data-stream','groundedIn',c,'데이터 스트림을 설명하기 위해 정본이 사용한 철학적 개념 또는 미학적 비유.','S01','§4 데이터 스트림');
for(const c of ['embodied-perception','affect'])link('cognitive-being','groundedIn',c,'인지체가 데이터를 몸으로 받아들이는 방식을 읽는 참조 개념.','S01','§4 인지체');
link('agent','groundedIn','apparatus','에이전트를 감각을 특정 방식으로 구성하는 장치로 읽는다.','S01','§4 에이전트');
link('data-materiality','groundedIn','geological-force','앎이 물질적 힘으로 작용한다는 관점을 데이터의 물질성에 대응시킨다.','S01','§1');

const series=[['threshold','Threshold','sensing'],['confluence','Confluence','dissolution'],['lattice','Lattice','crystallization'],['afterglow','Afterglow','diffusion'],['loop','Loop','feedback'],['voyage','Voyage','field']];
for(const [id,label,c] of series){add(`series-${id}`,label,'series','세계관에서 제안한 작품 분류. 같은 이름의 개별 작품과 구별합니다.','S01','§8');link('world','contains',`series-${id}`,'세계관의 작품 분류.','S01','§8');link(`series-${id}`,'explores',c,'정본의 시리즈와 역학·주제 대응.','S01','§8');}
const works=[
 ['chaos','혼돈의 호흡','서로 다른 전시 데이터를 입자 군집의 운동으로 연결한 작품.','S05','작품 1','작품 기록','confluence',['dissolution']],
 ['hand','손의 잔향','같은 전시 데이터를 회화적 선의 축적과 표면으로 표현한 작품.','S05','작품 2','작품 기록',null,['accumulation']],
 ['afterglow','잔광','멈춘 설비와 장소의 흔적을 호흡하는 빛으로 읽는 작품.','S06','작품 개요','작품 기록','afterglow',['diffusion','residue']],
 ['christmas','소각장의 크리스마스','산업 공간을 빛과 관객 참여로 다시 읽는 작품.','S07','작품 개요','작품 기록','lattice',['crystallization']],
 ['voyage','상상유랑','관람자의 언어를 공간·빛·소리로 전환하는 설치. 파일럿과 확장 설계를 구별합니다.','S04','§1–3','파일럿 완료 기록 · 확장 계획','voyage',['sensing','dissolution','crystallization','diffusion','field','apparatus-program','database-narrative','participation']],
 ['threshold','Threshold #01 · 역치','데이터를 느끼기 직전의 문턱을 체험하도록 설계한 설치 기획.','S03','핵심 질문·세계관 내 위치','기획 · 제작·전시 미확인','threshold',['sensing']],
 ['hitl','Human in the Loop','인간과 AI 사이의 판단·수용·거부를 다루는 영화 프로젝트.','S08','시놉시스','제작 기록 · 완성·상영 미확인','loop',['sensory-failure']],
 ['forgetting','망각하는 전시장','관객 입력이 누적될수록 기억을 잃고 다른 기억을 만드는 설치 구상.','S09','§3–7','구상 · 전시 완료 미확인',null,['memory-loss','misremembering']],
 ['residual','Noosphere Residual Field','이전 형태의 잔류가 다음 부조 표면을 바꾸는 누스피어 시안.','S10','구현 범위','구현 시안 · 영구 전시 미완료',null,['accumulation']],
 ['animation','Noosphere Layer 애니메이션','같은 세계관을 서사로 확장하는 기획. 인물과 데이터 법칙은 허구의 설정입니다.','S02','Part 4·6','서사 기획',null,['field','residue']]
];
for(const [id,label,note,src,section,status,s,cs] of works){
 add(`work-${id}`,label,'work',note,src,section,{status});
 const candidate=['hand','forgetting'].includes(id);
 link('world','contains',`work-${id}`,candidate?'누스피어와 함께 살펴보도록 포함한 후보 작품. 정본의 직접 편입은 미확인이다.':'세계관 또는 해당 작품 기록에서 누스피어와 연결한 작품·기획·시안.',src,section,candidate?'proposed':'documented');
 if(s)link(`work-${id}`,'belongsTo',`series-${s}`,'세계관 정본이 제안한 시리즈 대응.','S01','§8');
 for(const c of cs)link(`work-${id}`,'explores',c,'작품 기록 또는 세계관 정본에서 이 작품과 연결한 개념.', ['hand','forgetting','residual','animation'].includes(id)?src:'S01',['hand','forgetting','residual','animation'].includes(id)?section:'§3·§8');
}
link('work-chaos','sharesDataWith','work-hand','같은 전시 데이터로 서로 다른 감각적 표현을 만든다.','S05','프로젝트 설명');
link('work-voyage','dependsOn','input-access','키오스크·언어 입력·공간 접근이 참여의 조건이 된다는 정본의 질문.','S01','§10');
link('work-voyage','explores','accumulation','관람객 입력의 흔적이 다음 경험에 누적되는 설계 개념.','S04','§2');
for(const [a,b,why,src,sec] of [
 ['work-hand','residue','선의 축적을 누스피어의 잔향으로 읽는 추가 해석. 작품 기록의 정식 시리즈 편입은 미확인.','S05','작품 2'],
 ['work-forgetting','irreversibility','소실과 오기억을 비가역의 문제로 연결해볼 수 있다. 누스피어 정본의 명시적 작품 대응은 미확인.','S09','§3–7'],
 ['work-forgetting','residue','기획의 잔향 경험을 세계관의 잔향과 연결하는 검토 후보.','S09','§4.4'],
 ['work-residual','residue','이전 표면의 잔류를 세계관의 시간관으로 읽는 추가 해석.','S10','구현 범위'],
 ['work-residual','recovery','달라진 표면에서 다음 상태를 만드는 방식을 회복의 조건으로 읽는 검토 후보.','S10','구현 범위']
])link(a,'suggests',b,why,src,sec,'proposed');

// Fiction is explicitly scoped. Same-name fictional and philosophical entities never share IDs.
for(const [id,label,note,c] of [
 ['ubiquity','편재의 법칙','삭제된 데이터도 흔적으로 남는다는 서사 설정.','irreversibility'],
 ['threshold','역치의 법칙','데이터 밀도가 문턱을 넘으면 감각으로 전환된다는 서사 설정.','data-density'],
 ['fusion','융합의 법칙','이질적인 흐름의 만남에서 예측하기 어려운 패턴이 생긴다는 서사 설정.','dissolution'],
 ['residue','잔향의 법칙','감각화된 데이터가 이후에도 흔적을 남긴다는 서사 설정.','residue']
]){add(`law-${id}`,label,'law',note,'S02','§1.2',{domain:'fiction'});link('work-animation','contains',`law-${id}`,'서사 안에서 작동하는 설정.','S02','§1.2');link(`law-${id}`,'echoes',c,'서사 법칙과 세계관 개념의 대응. 현실의 법칙을 증명하는 관계가 아니다.','S02','§1.2');}
for(const [id,label,note] of [['seoyun','서윤','지각을 통해 세계를 읽는 주인공.'],['argos','아르고스','인간의 감각과 다른 방식으로 패턴을 분석하는 이탈 AI.'],['hajun','하준','통제와 인간 판단의 문제에 연결된 인물.'],['ryu','류','플로우와 데이터 접근 문제에 연결된 인물.'],['seoha','김서하','서윤의 멘토이자 경고자.'],['residue','잔향이라는 존재','삭제된 기억과 교감하는 관계에 놓인 서사적 존재. 개념 잔향과 구별합니다.']]){add(`character-${id}`,label,'character',note,'S02','Part 3',{domain:'fiction'});link('work-animation','contains',`character-${id}`,'내러티브 바이블의 창작 인물.','S02','Part 3');}
for(const [a,b,m] of [['seoyun','argos','감각과 분석의 파트너'],['seoyun','ryu','멘토와 위험한 동경'],['seoyun','hajun','적대에서 이해로 변화하는 관계'],['seoyun','residue','교감의 방향이 미해결인 관계'],['argos','hajun','도구와 주인에서 추적 관계로 변하는 설정'],['ryu','seoha','과거 동료에서 이견을 갖게 된 관계'],['seoha','seoyun','멘토이자 경고자']])link(`character-${a}`,'storyRelation',`character-${b}`,m,'S02','캐릭터 관계도');
link('work-hitl','storyBridge','work-animation','바이블에서 영화의 사건을 시리즈의 과거로 연결하는 확장 계획. 완성된 영상 간 연결을 뜻하지 않는다.','S02','Part 6');
link('work-threshold','storyBridge','work-animation','설치의 관람 경험을 서사 오프닝으로 번역하는 계획.','S02','Part 6');
link('work-chaos','storyBridge','work-animation','서사 안의 작품으로 등장시키는 확장 계획.','S02','Part 6');

for(const [id,label,note,c,src,sec] of [
 ['anadol','레픽 아나돌','데이터 조각과 기계 환각을 비교 참조합니다.','data-materiality','S01','§9'],
 ['teamlab','teamLab','공간과 관람자의 상호작용을 비교 참조합니다.','field','S01','§9'],
 ['ikeda','료지 이케다','데이터·소리·미니멀한 번역을 비교 참조합니다.','system-process','S01','§9'],
 ['eliasson','올라퍼 엘리아슨','지각과 몸의 경험을 비교 참조합니다.','perceptual-field','S01','§9'],
 ['steyerl','히토 슈타이얼','데이터의 물질성과 권력의 문제를 비교 참조합니다.','data-materiality','S01','§9'],
 ['paik','백남준','매체를 재발명하는 태도를 비교 참조합니다.','invented-medium','S01','§9'],
 ['leebul','이불','인간과 기술의 혼종 관계를 비교 참조합니다.','cyborg','S01','§9'],
 ['shinkai','신카이 마코토','빛 연출을 인지의 서사에 적용하는 참조입니다. 특정 작품명은 정본에 없습니다.','sensing','S02','§5.2'],
 ['lewitt','솔 르윗','규칙이 미학을 만드는 원칙을 참고합니다. 특정 작품명은 정본에 없습니다.','system-process','S02','§5.2'],
 ['noto','Alva Noto','잔향 음의 사운드 레퍼런스입니다. 특정 음반명은 정본에 없습니다.','residue','S02','§5.4'],
 ['sakamoto','Ryuichi Sakamoto','잔향 음의 사운드 레퍼런스입니다. 특정 음반명은 정본에 없습니다.','residue','S02','§5.4']
]){add(`artist-${id}`,label,'artist',note,src,sec,{domain:'reference'});link('world','references',`artist-${id}`,'정본에 명시된 비교·영감의 참조. 협업이나 직접 영향의 증거는 아니다.',src,sec);link(`artist-${id}`,'referenceFor',c,'정본이 이 레퍼런스와 연결한 키워드.',src,sec);}
for(const [id,label,note,c,src,sec] of [
 ['ghost','Ghost in the Shell','데이터 시각화를 참고하되 누스피어에서는 자연광과 입자의 언어로 변형하려는 계획.','data-materiality','S02','§5.2'],
 ['paprika','파프리카','현실과 비현실의 경계 변화를 참고하되 꿈 대신 데이터를 서사의 재료로 삼는 계획.','field','S02','§5.2'],
 ['tv-garden','TV 정원','백남준의 매체 재발명 계보에서 정본에 이름이 명시된 참조 작품.','invented-medium','S01','§9']
]){add(`reference-${id}`,label,'referenceWork',note,src,sec,{domain:'reference'});link('world','references',`reference-${id}`,'기록에 명시된 참조 작품. 특정 판본·장면의 직접 인용은 별도 확인한다.',src,sec);link(`reference-${id}`,'referenceFor',c,'정본에 기록된 참조 이유.',src,sec);}

export const noosphere={
 version:1,id:'noosphere-layer',title:'누스피어 세계관 온톨로지',owner:'육대근 · DECK',updated:'2026-10-06',
 scope:'작가가 실제 참고한 이론·문헌과 자신의 개념·작품 대응을 연결한 독립 학습 예제. 정본의 해석, 추가 해석 제안, 허구의 서사 설정을 구별합니다.',
 sources,nodes,relations,
 questions:[
  {id:'chaos',label:'혼돈의 호흡은 왜 융해인가?',from:'work-chaos',to:'theory-barad',route:['work-chaos','dissolution','intra-action','theory-barad'],answer:'정본은 이질적인 데이터가 합류하는 혼돈의 호흡을 융해에, 융해를 내-작용에 연결합니다. 이는 작가의 이론적 해석이며 작품 효과의 과학적 검증은 아닙니다.'},
  {id:'threshold',label:'역치와 몸의 지각은 어떻게 연결될까?',from:'work-threshold',to:'theory-phenomenology',route:['work-threshold','sensing','embodied-perception','theory-phenomenology'],answer:'역치 기획은 감응의 문턱을 체험하도록 설계됐고, 감응은 몸을 통한 지각을 참조합니다. 기획의 이론적 위치를 보여주며 실제 전시 완료를 뜻하지 않습니다.'},
  {id:'afterglow',label:'잔광에서 시간의 이론을 따라가면?',from:'work-afterglow',to:'theory-whitehead',route:['work-afterglow','residue','objective-immortality','theory-whitehead'],answer:'잔광의 흔적을 잔향으로 읽고, 정본이 잔향에 대응시킨 객체적 불멸성에서 과정 철학으로 이어집니다. 시리즈 Afterglow와 작품 잔광은 별도 대상입니다.'},
  {id:'recovery',label:'회복은 왜 다섯 번째 역학이 아닐까?',from:'recovery',to:'theory-whitehead',route:['recovery','creative-advance','theory-whitehead'],answer:'2026-09-08 개정은 회복을 잔향에서 다음 감응으로 넘어가는 조건으로 정의합니다. 같은 자리의 반복이 아닌 다음 사건이라는 관점에서 창조적 전진을 참조합니다.'}
 ],
 openQuestions:[
  '손의 잔향·망각하는 전시장·잔류장 시안을 어느 역학이나 시리즈에 공식 편입할지 작가 확인이 필요합니다.',
  '이론의 개념별 정확한 원전 구절·판본·쪽수는 추가 대조가 필요합니다. 현재의 서지 연결이 개념의 유일한 출처를 뜻하지 않습니다.',
  '참조 아티스트의 특정 작품·장면·음반은 기록에 이름이 있는 경우만 포함했습니다. 개인적 영향의 정도는 추가 인터뷰로 확인합니다.',
  '2039년 현현과 데이터 역학 법칙은 창작 설정입니다. 실제 자연법칙·예측·의학적 설명으로 사용하지 않습니다.',
  '과거 기획과 파일럿 기록만으로 현재 제작·전시·상영 상태를 확정하지 않습니다.'
 ]
};
