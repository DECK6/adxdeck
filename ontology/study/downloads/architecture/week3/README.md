# GPTers 24기 · 한국 주거 건축 · 3주차

관계를 따라 찾고, 근거를 함께 답하게 만듭니다.

FAMILY-02 가상 주택을 줄여 만든 학습용 모델입니다. 원 모델의 공간 좌표를 사용하며 건축 인허가·구조 안전·법규 적합 판정은 포함하지 않습니다.

## 시작

1. 공식 AKM https://github.com/DECK6/akm 을 새 폴더에 준비하세요. 에이전트에 “공식 AKM을 새 gpters24-architecture 폴더에 설치해줘”라고 요청하거나 GitHub의 Code → Download ZIP을 사용하세요. 기존 개인 볼트에서 시작하지 않는 것을 권장합니다.
2. 이 ZIP은 AKM 본체가 아니라 주차별 실습 자료입니다. 1주차에는 00-inbox와 practice를 새 AKM 폴더에 복사하세요. reference는 완성 예시입니다.
3. 2주차 이후에는 같은 사례 폴더를 이어 사용하세요. 직접 만든 파일은 먼저 별도 보관하고, 패키지의 완성 예시와 나란히 비교하세요. before 답변 기록을 덮어쓰지 마세요.
4. Obsidian에서 AKM 폴더를 볼트로 열고 Graph view를 확인하세요. 문서 링크망의 선은 관계의 의미까지 자동 검증하지 않습니다.

## 이번 주

1. 3주차 파일을 새 실습 AKM에 넣고 에이전트에서 그 폴더를 여세요.
2. 연결 프롬프트를 붙여 넣고 같은 질문 3개를 실행하세요.
3. 답의 문장마다 출처와 모르는 범위가 있는지 확인하세요.

결과물: 출처와 함께 답하는 에이전트 연결 데모

실제 에이전트의 답·출처·실패 장면을 담아 사례글 1편을 작성하세요.

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
