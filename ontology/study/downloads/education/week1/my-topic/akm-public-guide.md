# 공개 AKM으로 시작하기

확인 기준: [DECK6/akm](https://github.com/DECK6/akm), 커밋 f26ace2a16caba724b24db12cbee238ebb52498f, AKM 0.3 / schema 0.2 (2026-09-14). 실제 설치본의 지침이 다르면 설치본을 먼저 확인합니다.

## 1. 복제한 폴더 안에서 에이전트 실행
GitHub의 Code → Download ZIP으로 내려받아 풀거나 다음 명령으로 새 실습 폴더를 만드세요.

```sh
git clone https://github.com/DECK6/akm.git my-knowledge-lab
cd my-knowledge-lab
```

그 폴더를 Claude Code·Codex의 작업 폴더로 여세요. 루트의 CLAUDE.md·AGENTS.md가 포함되어 있어 이 경로에서는 별도 어댑터 설치가 필요하지 않습니다. 다른 프로젝트에서 AKM을 함께 쓰려면 [Claude Code 어댑터](https://github.com/DECK6/akm/blob/f26ace2a16caba724b24db12cbee238ebb52498f/adapters/claude-code/README.md) 또는 [Codex 어댑터](https://github.com/DECK6/akm/blob/f26ace2a16caba724b24db12cbee238ebb52498f/adapters/codex/README.md)를 읽고 그 프로젝트의 진입점에 AKM 경로를 연결하세요. 기존 지침에 추가하며 덮어쓰지 않습니다.

## 2. 원문·지식·맥락 구분
- 새 입력은 00-inbox에 먼저 넣고 [ROUTER](https://github.com/DECK6/akm/blob/f26ace2a16caba724b24db12cbee238ebb52498f/99-system/ROUTER.md)로 분류합니다. 보관할 원문은 10-sources에 옮긴 뒤 수정하지 않습니다.
- 여러 상황에서 다시 쓸 개념 설명은 20-knowledge입니다. 우리 집의 재고, 이 수업의 선수 관계, FAMILY-02의 요구사항처럼 특정 사례에서만 성립하는 내용은 30-context입니다.
- 이 교재의 정리된 공통 사례는 30-context/projects/gpters24-분야에 놓습니다. 일반화할 개념은 원문에서 별도로 분리해 근거를 검토한 뒤 20-knowledge에 정리하세요.
- 짧고 반복해서 필요한 운영 포인터는 40-memory, 재사용 절차는 50-procedures, 필요한 실행 기록은 60-actions, 검증·실패 학습은 70-evaluation입니다. 결과물은 80-outputs, 수명이 끝난 노트는 90-archive입니다. 첫 실습에서 모든 폴더를 채울 필요는 없습니다.

공개판은 99-system/INDEX.md와 40-memory의 현재 메모를 읽도록 합니다. 처음 40-memory가 비어 있어도 정상입니다. 특정 개인의 메모 파일 이름이나 개수를 만들 필요는 없습니다. INDEX.local.md가 있으면 함께 읽고 개인 노트 색인에 사용할 수 있습니다.

## 3. 실제 템플릿으로 노트 만들기
재사용 개념은 [concept 템플릿](https://github.com/DECK6/akm/blob/f26ace2a16caba724b24db12cbee238ebb52498f/99-system/templates/concept.md), 개별 대상 설명은 [entity 템플릿](https://github.com/DECK6/akm/blob/f26ace2a16caba724b24db12cbee238ebb52498f/99-system/templates/entity.md)에서 시작하세요. 맥락은 [최소 예제의 context 노트](https://github.com/DECK6/akm/blob/f26ace2a16caba724b24db12cbee238ebb52498f/examples/minimal-akm/30-context/example-project-context.md)를 참고합니다. 한 파일에는 주제 하나를 담습니다.

description은 영어 한 문장, 본문은 한국어로 작성할 수 있습니다. akmLayer·akmType·trustLevel·생성일·수정일을 [SCHEMA](https://github.com/DECK6/akm/blob/f26ace2a16caba724b24db12cbee238ebb52498f/99-system/SCHEMA.md)에 맞추고 원문에는 sourcePath를 기록합니다. 합성한 미검증 노트는 unverified / nextAction: verify, 미완성 초안은 draft로 둡니다. 파일명은 소문자 영어 kebab-case, 원문은 YYYY-MM-DD-이름.md입니다. 모델의 R01·N1 같은 ID와 노트 파일명은 다를 수 있으며 practice/note-paths.json에서 대응을 확인합니다.

practice·my-topic·wiki-drafts·reference는 교재용 작업 폴더이며 AKM의 새로운 레이어가 아닙니다. wiki-drafts를 바로 20-knowledge에 복사하지 마세요. 초안도 00-inbox를 거쳐 분류·메타데이터·근거·링크를 검토합니다. reference는 1주차 기준선 측정에서 제외하는 비교 예시입니다.

## 4. 검사와 질문을 각각 확인
AKM 폴더에서 공개 검사기를 실행합니다. Node.js로 실행하는 선택 도구이며 AKM 노트 읽기·쓰기에 서버나 DB가 필요하지 않습니다.

```sh
node scripts/lint.mjs --akm .
node scripts/lint.mjs --links .
node scripts/lint.mjs --secrets .
```

이 검사는 구조·메타데이터·링크·패턴을 봅니다. 노트 내용의 진위나 내 질문에 맞는 답인지는 [VERIFICATION](https://github.com/DECK6/akm/blob/f26ace2a16caba724b24db12cbee238ebb52498f/99-system/VERIFICATION.md)의 Tier 1에 따라 실제 근거 문장을 읽고 확인하세요. 교재의 practice/check.py는 별도로 관계 모델을 검사합니다. 두 검사 통과를 실제 LLM 성능 향상으로 해석하지 않습니다.

색인은 INDEX.md, 개인 인스턴스에서는 INDEX.local.md에 간결한 링크로 남기고 LOG.md에는 변화 한 줄을 추가합니다. 실패는 [LOOP](https://github.com/DECK6/akm/blob/f26ace2a16caba724b24db12cbee238ebb52498f/99-system/LOOP.md)에 따라 70-evaluation에 기록하고 원인이 된 노트·맥락·절차를 고칩니다. qmd는 필수 설치가 아닙니다. 사용하는 경우에만 검색 인덱스를 갱신하고, 기본 실습은 색인과 파일 조회로 저장 결과를 확인합니다.

## 5. 관계망 보기
같은 AKM 폴더를 Obsidian 볼트로 열어 문서 링크를 봅니다. 의미 관계의 편집·질의 미리보기와 OWL 내보내기는 이 웹 실습실이 제공하며 공개 AKM 자체의 내장 그래프 화면이 아닙니다. 이 웹의 개인 프로젝트 JSON을 에이전트에 전달할 때는 원본을 보존한 작업 복사본을 사용하세요.
