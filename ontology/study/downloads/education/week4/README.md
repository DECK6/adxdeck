# GPTers 24기 · 초등교육 · 4주차

같은 질문으로 비교하고, 오래 쓸 규칙을 남깁니다.

가상의 초등 수학 수업 설계 자료입니다. 선수 관계는 이 수업의 교수학습 가정이며 공식 교육과정의 필수 순서나 학생 진단 결과가 아닙니다.

## 시작

1. 공식 AKM https://github.com/DECK6/akm 을 새 폴더에 준비하세요. 에이전트에 “공식 AKM을 새 gpters24-education 폴더에 설치해줘”라고 요청하거나 GitHub의 Code → Download ZIP을 사용하세요. 기존 개인 볼트에서 시작하지 않는 것을 권장합니다.
2. 이 ZIP은 AKM 본체가 아니라 주차별 실습 자료입니다. 1주차에는 00-inbox와 practice를 새 AKM 폴더에 복사하세요. reference는 완성 예시입니다.
3. 2주차 이후에는 같은 사례 폴더를 이어 사용하세요. 직접 만든 파일은 먼저 별도 보관하고, 패키지의 완성 예시와 나란히 비교하세요. before 답변 기록을 덮어쓰지 마세요.
4. Obsidian에서 AKM 폴더를 볼트로 열고 Graph view를 확인하세요. 문서 링크망의 선은 관계의 의미까지 자동 검증하지 않습니다.

## 이번 주

1. 1주차에 남긴 질문·답변을 그대로 불러오세요.
2. 현재 답변과 근거를 나란히 읽고 같은 기준으로 평가하세요.
3. 개선되지 않은 질문과 다음 변경을 운영 노트에 남기세요.

결과물: 완성 시스템 · 평가 리포트 · 지속 운영 규칙

새 과제 없이 완성한 시스템을 최종 발표합니다.

## 파일 안내

- practice/questions.json: 4주간 동일하게 사용할 질문 3개
- practice/model.json: 웹과 동일한 완성 참고 모델
- practice/response-template.json: 실제 에이전트 응답 기록용 빈 양식
- practice/agent-prompt.md: 에이전트에 연결하는 요청문
- practice/evaluation.csv: 답·출처·평가를 기록하는 빈 표
- reference 또는 20-knowledge: 비교용 합성 지식

## 모델 검사

practice 폴더에서 `python3 check.py model.json`을 실행하세요. 정상 모델은 valid: true, `python3 check.py model-error.json`은 의도한 오류를 반환합니다. expected-answers.json은 비교용 참고 답변이며 LLM 실행 결과가 아닙니다.

웹에서 보인 참고 답변은 실제 LLM 실행 성적이 아닙니다.
