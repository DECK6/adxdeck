# 한국 역사 — 자동 확장 결과

초기 3편을 보존한 복사본에서 자동 확장 1회를 실행했다. 새 노트 2편을 추가하고 기존 N1·N3의 설명·연결과 온톨로지를 함께 갱신했다.
한국사 전체 중 **조선 초기의 사건·인물·수도·사료 구별**을 첫 범위로 삼았다. 인터뷰는 역할극이며 역사 지식은 실제 기관 자료를 읽어 작성했다. 실제 마스터의 개인 기록이 아니다.

## 읽기 순서

1. [가상 인터뷰](interview.md) — 연결된 질문 묶음을 따라 7라운드를 진행한 기록.
2. [도메인 브리프](domain-brief.md) — 왜 이 범위와 구조를 택했는가.
3. 아래 위키 — 질문에 대한 설명과 근거.
4. [온톨로지 읽기](ontology.md) / [JSON 정본](ontology.json) — 같은 개념·관계·주장 ID.
5. [질문 응답 검토](verification/question-checks.md) / [의미 검토](verification/semantic-review.md).

## 위키

| 노트 | 질문 | 읽기 |
| --- | --- | --- |
| N1 | Q1, Q2 | [1392·1393·1394 — 건국을 한 사건으로 뭉치지 않기](wiki/01-founding-events.md) |
| N2 | Q3 | [태조는 한 사람의 고유 ID가 아니다](wiki/02-two-taejo.md) |
| N3 | Q4 | [실록의 사건일과 편찬일을 구별해 읽기](wiki/03-reading-annals.md) |
| N4 | Q5 | [한양은 1394년부터 계속 수도였을까](wiki/04-capital-returns.md) |
| N5 | Q6 | [한양 천도와 경복궁 창건을 구별하기](wiki/05-palace-and-capital.md) |

## 현재 범위

노트 5편, 타입 7개, 개념·개체 24개, 관계 종류 12개, 출처 연결 주장 27개. 실제 역사 출처 7개와 별도의 가상 인터뷰 1개를 보존한다.
질문 8개 중 6개 답변, 2개 보류다. Q7의 사회 전체 영향과 Q8의 국호 월 표기 차이는 해결하지 않았다.

## 검증과 재개

이 폴더 하나를 옮겨도 노트·출처·모델·상태와 Python 검사기가 함께 따라간다. AKM 볼트의 디렉터리 구조나 외부 파일 링크에 의존하지 않는다. `tools/knowledge.py`는 공개 AKM 리비전 `70e99b51b4e6b075dc98aab8754c9ef16f602dfe`에서 복사했으며 [MIT 라이선스](tools/LICENSE)를 함께 둔다. Python 3.9 이상에서 이 폴더를 작업 디렉터리로 실행한다.

```sh
python3 tools/knowledge.py lint --root . --map knowledge-map.json
python3 tools/knowledge.py coverage --root . --map knowledge-map.json
python3 tools/knowledge.py frontier --root . --map knowledge-map.json
python3 tools/knowledge.py impact --root . --map knowledge-map.json --id S004
```

[검사 출력](verification/lint.json) · [질문 커버리지](verification/coverage.json) · [다음 조사 후보](verification/frontier.json) · [변경 영향](verification/impact-S004.json)

기계 검사는 ID·타입·참조·해시·등록된 질문 검토를 확인한다. 사실의 진위나 한국사 전체의 완결성을 증명하지 않는다. [확장 실행 기록](operations/cycle-01.md)과 [state.json](state.json)에 작업 결과와 재개 지점이 있다.
