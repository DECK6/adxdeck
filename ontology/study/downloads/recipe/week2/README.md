# GPTers 24기 · 요리와 보유 재료 · 2주차

링크가 있다는 것에서, 어떤 관계인지 아는 것으로.

학습용으로 정한 필수 재료의 보유 여부만 확인합니다. 기본 시나리오는 보유 목록을 전부 확인한 상태이며, 목록이 미완료이면 미기록 재료는 보류합니다.

## 시작

1. 공식 AKM https://github.com/DECK6/akm 을 새 폴더에 준비하고 그 폴더에서 에이전트를 여세요. 루트 CLAUDE.md·AGENTS.md가 포함되어 있습니다. 에이전트에 “공식 AKM을 새 gpters24-recipe 폴더에 설치해줘”라고 요청하거나 GitHub의 Code → Download ZIP을 사용하세요. 기존 개인 볼트에서 시작하지 않는 것을 권장합니다.
2. 이 ZIP은 AKM 본체가 아니라 주차별 실습 자료입니다. 1주차에는 00-inbox와 practice를 새 AKM 폴더에 복사하세요. reference는 완성 예시입니다.
3. 2주차 이후에는 같은 사례 폴더를 이어 사용하세요. 직접 만든 파일은 먼저 별도 보관하고, 패키지의 정리 예시와 나란히 비교하세요. 기존 INDEX.local.md는 덮어쓰지 말고 필요한 항목만 합치세요. before 답변 기록을 덮어쓰지 마세요.
4. Obsidian에서 AKM 폴더를 볼트로 열고 Graph view를 확인하세요. 문서 링크망의 선은 관계의 의미까지 자동 검증하지 않습니다.

## 이번 주

1. 문서 링크만으로 답하기 어려운 질문을 하나 고르세요.
2. 아래 만들기 도구에서 대상과 관계를 추가하고 원문을 연결하세요.
3. 검사 오류를 확인하고 JSON·OWL 파일과 설계 노트를 내보내세요.

결과물: 내 도메인 온톨로지 스키마 v1

추가한 관계가 어떤 질문을 해결하는지 사례글 1편으로 설명하세요.

## 파일 안내

- practice/questions.json: 4주간 동일하게 사용할 질문 3개
- practice/model.json: 웹과 동일한 완성 참고 모델
- practice/response-template.json: 실제 에이전트 응답 기록용 빈 양식
- practice/agent-prompt.md: 에이전트에 연결하는 요청문
- practice/evaluation.csv: 답·출처·평가를 기록하는 빈 표
- reference 또는 30-context/projects: 비교용 사례 맥락
- my-topic/akm-public-guide.md: 공개 AKM 설치·분류·템플릿·검사 안내
- practice/note-paths.json: 문서 ID와 실제 파일 경로 대응

## 모델 검사

practice 폴더에서 `python3 check.py model.json`을 실행하세요. 정상 모델은 valid: true, `python3 check.py model-error.json`은 의도한 오류를 반환합니다. expected-answers.json은 비교용 참고 답변이며 LLM 실행 결과가 아닙니다.

웹에서 보인 참고 답변은 실제 LLM 실행 성적이 아닙니다.
