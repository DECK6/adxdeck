# 개인 온톨로지 데이터 규약

이 규약은 GPTers 24기 2주차 웹 실습실과 파일을 주고받기 위한 경량 형식이다. OWL 추론 결과나 외부 사실 검증 증명서가 아니다. 실행 가능한 정의는 `scripts/model.mjs`에 있고 `node scripts/ontology.mjs schema`로 필요한 종류·관계를 확인할 수 있다.

## 최소 구조

```json
{
  "version": 1,
  "title": "나를 둘러싼 세계",
  "question": "내가 답하고 싶은 질문",
  "nodes": [{"id":"self","label":"사용자가 정한 이름","type":"person","note":"인터뷰에서 확인한 소개"}],
  "relations": [],
  "actualAnswer": "",
  "reflection": ""
}
```

`self`는 항상 본인을 뜻하는 인물 ID다. 이름을 바꿔도 ID는 유지한다. 다른 대상에는 고유한 영문·숫자·하이픈 ID를 쓴다. 실명이나 기관명이 들어간 ID를 익명 표기로 착각하지 않는다.

## 종류와 관계

종류: `person` 인물, `organization` 기관, `occupation` 직업, `role` 역할, `project` 프로젝트, `artwork` 작품, `task` 작업, `concept` 개념, `resource` 자료, `experience` 경력·학습·선정 기록.

| 관계 | 방향 | 읽는 법 |
|---|---|---|
| hasOccupation | 인물 → 직업 | 직업·활동 정체성 |
| hasRole | 인물 → 역할 | `scope`의 프로젝트·작품·경력에서 기록한 역할 |
| participates | 인물 → 프로젝트 | 참여, 담당·승인과는 구별 |
| documentsWork | 인물 → 작품 | 본인의 작품 기록. 제작·전시 단계는 설명에 명시 |
| produces | 프로젝트 → 작품 | 그 프로젝트가 포함하는 작품 |
| includes | 프로젝트 → 작업 | 구체적으로 할 일 |
| responsible / reviews | 인물 → 작업 | 담당 / 검토 |
| discusses / collaborates | 인물 → 인물 | 작업 논의 / 협업 |
| knows / familyOf / friendOf / mentors | 인물 → 인물 | 지인 / 가족 / 친구 / 멘토링. 사용자가 밝힌 관계만 기록 |
| uses / references | 작업 → 개념 / 자료 | 활용 개념 / 참고 자료 |
| expresses / documentedBy | 작품 → 개념 / 자료 | 표현 개념 / 설명 문서 |
| hasExperience | 인물 → 경력·이력 | 재직·학습·위촉 등의 기록 |
| experienceProject | 경력·이력 → 프로젝트 | 경력과 연결되는 활동 |
| projectTopic / artworkTopic / experienceTopic | 프로젝트 / 작품 / 경력 → 개념 | 주제 분류. 숙련도·완료를 의미하지 않음 |
| associatedOrg / artOrg / experienceOrg | 기관 → 프로젝트 / 작품 / 경력 | 기관과의 연결. 고용·발주·소유 권한을 자동 부여하지 않음 |
| interestedIn | 인물 → 개념 | 관심 |
| explains / relatedTo | 자료 → 개념 / 개념 → 개념 | 설명 / 관련 개념 |

관계 예:

```json
{"id":"r1","from":"self","predicate":"hasRole","to":"role-1","scope":"project-1","source":"인터뷰 I003: 이 프로젝트에서 기획을 맡았다고 설명함.","status":"confirmed","validFrom":"","validTo":""}
```

`status`: `confirmed` 근거에서 확인한 진술, `hypothesis` 해석·가설, `unknown` 미확인. `source`는 진술·원문의 위치와 필요한 발췌다. 질문을 못 했다고 에이전트가 임의로 채우지 않는다. `scope`는 `hasRole`에서 필수이며 해당 프로젝트·작품·경력 ID를 가리킨다. 기간이 분명할 때 `YYYY-MM-DD`로 `validFrom`·`validTo`를 적고, 모르는 날짜는 빈 문자열로 남긴다.

작업의 `status`: `예정`, `진행 중`, `완료`, `보류`, `상태 미확인` 중 하나. 다른 대상의 제작 단계·경력 기간은 `note`와 선택 속성에 적는다.

선택 대상 속성: `group` 활동 분야, `period` 원문 정밀도를 보존한 기간, `evidence` 근거 종류, `sourceCodes` 출처 ID 배열, `topics` 주제명 배열. 날짜가 연도나 월까지만 알려져 있으면 일자를 만들어내지 않는다.

## 질문과 검사

`validate`는 ID·종류·관계 방향·범위·날짜 형식을 검사한다. 사실의 진위를 판정하지 않는다. `query`는 근거가 있고 확인된 기간 내 관계만 따라간다.

```bash
node scripts/ontology.mjs query personal-ontology/ontology.json --kind work --date 2026-10-07
node scripts/ontology.mjs query personal-ontology/ontology.json --kind people --task task-1 --date 2026-10-07
node scripts/ontology.mjs query personal-ontology/ontology.json --kind career --topic 미디어아트 --date 2026-10-07
```

조회 종류: `work` 내 진행 작업, `people` 작업에 연결된 인물, `reuse` 같은 개념을 사용한 완료 작업, `artworks` 내 작품 기록, `career` 같은 주제로 연결되는 활동. 이 결과를 에이전트가 근거로 읽어 실제 질문에 답하고, 규칙 조회 결과와 자신의 답변을 구별해 기록한다.
