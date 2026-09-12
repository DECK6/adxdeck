# GPTers 24기 · 한국 주거 건축 · 1주차

흩어진 노트 10개를, AI가 찾아 읽는 지식으로.

FAMILY-02 가상 주택을 줄여 만든 학습용 모델입니다. 원 모델의 공간 좌표를 사용하며 건축 인허가·구조 안전·법규 적합 판정은 포함하지 않습니다.

## 시작

1. 공식 AKM https://github.com/DECK6/akm 을 새 폴더에 준비하세요. 에이전트에 “공식 AKM을 새 gpters24-architecture 폴더에 설치해줘”라고 요청하거나 GitHub의 Code → Download ZIP을 사용하세요. 기존 개인 볼트에서 시작하지 않는 것을 권장합니다.
2. 이 ZIP은 AKM 본체가 아니라 주차별 실습 자료입니다. 1주차에는 00-inbox와 practice를 새 AKM 폴더에 복사하세요. reference는 완성 예시입니다.
3. 2주차 이후에는 같은 사례 폴더를 이어 사용하세요. 직접 만든 파일은 먼저 별도 보관하고, 패키지의 완성 예시와 나란히 비교하세요. before 답변 기록을 덮어쓰지 마세요.
4. Obsidian에서 AKM 폴더를 볼트로 열고 Graph view를 확인하세요. 문서 링크망의 선은 관계의 의미까지 자동 검증하지 않습니다.

## 이번 주

1. 자료 10개를 읽고 내 도메인의 범위를 한 문장으로 정하세요.
2. 질문 3개에 대한 현재 에이전트의 답과 출처를 기록하세요.
3. AKM에 원본과 정리한 지식을 나눠 넣고 관계망을 확인하세요.

결과물: 도메인 정의서 · 진단 기록 · LLM Wiki v1

대표 노트를 재구조화한 과정과 달라진 점을 사례글 1편으로 남기세요.

## 파일 안내

- practice/questions.json: 4주간 동일하게 사용할 질문 3개
- practice/model.json: 웹과 동일한 완성 참고 모델
- practice/response-template.json: 실제 에이전트 응답 기록용 빈 양식
- practice/agent-prompt.md: 에이전트에 연결하는 요청문
- practice/evaluation.csv: 답·출처·평가를 기록하는 빈 표
- reference 또는 20-knowledge: 비교용 합성 지식

웹에서 보인 참고 답변은 실제 LLM 실행 성적이 아닙니다.
