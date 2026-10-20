"""Bundle the authored operating templates and RDF examples; no model calls."""
from html.parser import HTMLParser
from pathlib import Path
import json, zipfile, hashlib
SITE=Path(__file__).resolve().parents[2]/'ontology/study';KIT=SITE/'downloads/week4'
class Prompts(HTMLParser):
    def __init__(self):super().__init__();self.current=None;self.prompts={}
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='pre' and a.get('id','').startswith('prompt-'):
            self.current=a['id'];self.prompts[self.current]=''
    def handle_data(self,data):
        if self.current:self.prompts[self.current]+=data
    def handle_endtag(self,tag):
        if tag=='pre':self.current=None
p=Prompts();p.feed((SITE/'week4.html').read_text())
files={
'START-HERE.md':'''# 내 지식을 계속 관리해 주는 에이전트 만들기

1. 기존 자기 지식공간과 1주차 질문·답변 3개를 준비합니다.
2. AKM 설치·업데이트: https://github.com/DECK6/akm/tree/main/skill-suite
3. prompts.md의 운영 인터뷰 → 점검 → 한 사이클 확장 → 평가 요청을 실행합니다. 목적에 맞게 방향 유도·넓은 범위 확장·재개·방향 재점검 요청도 사용합니다.
4. growth-guide.md로 계속 확장하는 방법을 읽고, coverage-map.md의 범위 점검표·대기 질문을 자기 분야에 맞게 채웁니다. operating-rules.md, cycle-record.md, evaluation.md를 기존 구조에 맞게 저장합니다.
5. final-presentation.md로 5분 발표를 준비합니다. 새 과제는 없습니다.

Codex는 $akm, Claude Code 직접 설치는 /akm, Claude 플러그인은 /akm:akm으로 요청합니다.
스킬 설치는 예약 실행을 시작하지 않습니다. 이 실습은 현재 에이전트의 한 사이클입니다.

species-example.ttl과 species-example.owl은 같은 작은 RDF/OWL 모델의 다른 직렬화입니다. Turtle은 텍스트로 읽을 수 있고 .owl은 RDF/XML을 읽는 온톨로지 도구로 열 수 있습니다. 전체 생물종 실험을 RDF/OWL로 변환한 것은 아닙니다.

교안·실험·두 지식베이스 ZIP: https://dexa.art/ontology/study/week4.html
''',
'operating-rules.md':'''# 내 지식 운영 규칙

- 목적·도메인: [내 목적]
- 더 잘 답할 질문: [질문 1개]
- 집중 범위 / 제외 범위: [시대·지역·주제·대상]
- 우선순위 / 설명의 깊이: [막힌 질문 → 핵심 → 인접 분야 / 개요·조건·반례·해석 비교]
- 확장 방식: [깊게 파기 / 옆으로 넓히기 / 분야 사이 연결하기]
- 넓은 범위의 관리: 대표 질문·답·출처·검토일을 범위 점검표에 연결한다.
- 방향 점검: [예: 3사이클 뒤] 목적과 실제 작업을 비교하고 대기 질문 순서를 조정한다.
- 반대 근거: 관심 방향을 원하는 결론으로 해석하지 않고 반례·다른 해석을 보존한다.
- 자료가 들어오는 경로: [폴더·웹·메모 등]
- 신뢰할 출처·시점·검토 기준: [기준]
- 자동 수정 허용: 출처가 명확한 연결 보완·기존 설명 보강. 원문·ID 보존.
- 사람 검토: 핵심 정의 변경·상충 근거·범위 확대·폐기 후보.
- 한 사이클: 질문 1개, 새 출처 최대 3개, 작업 최대 3개 또는 15분.
- 연속 실행 전체 한도: [최대 사이클 수·전체 출처 수·작업 수·시간을 지정할 때만 연속 실행]
- 중단: 새 근거 없음, 미해결 충돌, 예산 소진, 사용자 중단 요청.
- 기록: 읽은 자료·변경 이유·영향받은 답·미확인·다음 재개 지점.
- 재실행: [내가 실행할 시점]. 예약은 별도 등록·확인 전에는 미활성.

운영 인터뷰에서 내 기준으로 수정하고 기존 지식공간의 운영 규칙과 합칩니다.
''',
'cycle-record.md':'''# 지식 운영 사이클 기록

- 실행일 / 에이전트·모델 / 시작 리비전:
- 목표 질문 / 허용 범위 / 예산:
- 확장 방식 / 대상 영역 / 질문 선정 이유:
- 이전 미완료 작업과 이번에 재개할 근거:
- 실제로 읽은 자료와 출처 위치:
- 기존 주장과 일치·보강·충돌:
- 바꾼 파일·ID·관계 / 변경 이유 / 근거:
- 구조 검사 / 내용·출처 검토:
- 전후 답변에서 달라진 것:
- 바뀌지 않은 것 / 미확인 / 보류:
- 사람 검토가 필요한 변경:
- 실제 소요 시간 / 사용량(확인할 수 있을 때):
- 중단 이유 / 다음 질문 / 재개 위치:
- 범위 점검표의 상태 변화 / 우선순위 변경 여부:

새 근거가 없으면 ‘변경 없음’으로 기록합니다. 원문·이전 답변을 덮어쓰지 않습니다.
''',
'evaluation.md':'''# 같은 질문 3개 · 전후 평가

각 질문을 아래 형식으로 별도 기록합니다. 기존 답변을 보존하고 개선이 없어도 남깁니다.

## Q1 / Q2 / Q3
- 원래 질문 전문:
- 조건: 모델·추론 수준·도구·자료 범위·시간 제한:
- 1주차 답 / 출처 / 미확인 / 시간:
- 4주차 답 / 출처 / 미확인 / 시간:
- 정확성: 근거로 확인되는 사실과 틀린·누락된 것:
- 일관성: 같은 정의·조건에서 답이 달라지는지:
- 출처: 원문 위치까지 찾아갈 수 있는지:
- 변경을 설명하는 근거 / 비교의 한계:
- 평가자·검토일:

원래 실행 시간을 기록하지 않았다면 ‘미측정’으로 남깁니다. 서로 다른 조건의 시간을 직접적인 속도 개선으로 표현하지 않습니다.
''',
'final-presentation.md':'''# 마지막 5분 발표

1. 30초 · 내 도메인·목적과 도움받을 판단.
2. 90초 · 같은 질문의 전후 답·출처·시간. 개선과 한계.
3. 90초 · 새 자료 하나가 주장·노트·관계를 바꾸는 실제 데모.
4. 60초 · 에이전트에 맡긴 범위, 사람 검토와 중단·재개 기준.
5. 30초 · 다음 사이클의 질문 하나.

남길 결과: 완성 시스템 + 평가 리포트 + 지속 운영 규칙.
새 과제 없이 수업에서 마무리합니다.
''',
'prompts.md':'# 4주차 실행 요청문\n\n'+'\n\n'.join('## '+name+'\n\n'+body for name,body in p.prompts.items())+'\n'
}
for name,text in files.items():(KIT/name).write_text(text,encoding='utf-8')
names=list(files)+['growth-guide.md','coverage-map.md','species-example.ttl','species-example.owl','PROVENANCE.md','questions.json']
out=SITE/'downloads/week4-agent-kit.zip'
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
    for name in sorted(names):
        info=zipfile.ZipInfo('week4-agent-kit/'+name,(2026,10,20,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16
        z.writestr(info,(KIT/name).read_bytes())
manifest=json.loads((KIT/'manifest.json').read_text())
old=manifest.get('operating_kit',{})
manifest['operating_kit']={'file':out.name,'bytes':out.stat().st_size,'sha256':hashlib.sha256(out.read_bytes()).hexdigest()}
if old.get('sha256')==manifest['operating_kit']['sha256'] and old.get('download_url'):
    manifest['operating_kit']['download_url']=old['download_url']
(KIT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(KIT/'SHA256SUMS.txt').write_text(''.join(f"{v['sha256']}  {v['file']}\n" for v in [*manifest['packages'].values(),manifest['operating_kit'],*([manifest['akm_skills']] if 'akm_skills' in manifest else [])]))
print(out.name,out.stat().st_size)
