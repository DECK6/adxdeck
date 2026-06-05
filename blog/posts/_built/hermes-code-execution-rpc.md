---
type: article
title: "Hermes Code Execution은 여러 도구 호출을 하나의 검증 가능한 스크립트로 묶는다"
aliases:
  - "Hermes Code Execution RPC"
author:
  - "[[Deck]]"
date created: 2026-06-06
date modified: 2026-06-06
tags:
  - hermes
  - ai-agent
  - workflow
  - code-execution
  - automation
description: "A feature guide to Hermes Agent Code Execution: how execute_code runs Python with RPC-backed tool access, when to use it, and what safety limits matter."
thumbnail: images/hermes-code-execution-rpc-cover.png
status: completed
series: hermes-notes
---

# Hermes Code Execution은 여러 도구 호출을 하나의 검증 가능한 스크립트로 묶는다

![Abstract cover for Hermes Code Execution](images/hermes-code-execution-rpc-cover.png)

Hermes Agent가 파일을 찾고, 여러 문서를 읽고, 결과를 필터링한 뒤 요약해야 할 때 매 단계의 원본 출력이 전부 대화 컨텍스트로 들어오면 금방 무거워진다. **Code Execution**은 이 문제를 줄이는 기능이다. `execute_code` 도구는 Python 스크립트 안에서 Hermes 도구를 RPC로 호출하게 해, 중간 데이터는 스크립트 안에서 처리하고 최종 `print()` 결과만 모델에게 돌려준다.

## 기능 개요: Python 스크립트 + Hermes 도구 RPC

Code Execution은 “임의의 셸을 더 강하게 실행하는 기능”이 아니라, 반복·분기·집계가 필요한 도구 호출을 Python 프로그램으로 접는 장치다. 스크립트는 `from hermes_tools import ...`로 `web_search`, `web_extract`, `read_file`, `write_file`, `search_files`, `patch`, `terminal` 같은 허용된 도구를 가져온다. Hermes는 임시 `hermes_tools.py` stub을 만들고 Unix domain socket RPC 리스너를 열어, 스크립트의 도구 호출을 부모 에이전트의 일반 tool call처럼 처리한다.

핵심 차이는 컨텍스트 절약이다. 일반 대화에서는 검색 결과 20개, 파일 10개, 빌드 로그 일부가 모두 모델 입력으로 쌓일 수 있다. Code Execution에서는 스크립트가 그 결과를 필터링하고 필요한 10줄만 출력한다. 그래서 “3개 이상 도구 호출 + 중간 처리 로직”이 있는 작업에 특히 맞다.

## 어떻게 작동하고 설정하는가

가장 전형적인 패턴은 파일 검색, 읽기, 요약용 집계를 한 번에 묶는 것이다.

```python
from hermes_tools import search_files, read_file
import json

matches = search_files("code_execution", path=".", file_glob="*.md", limit=20)
rows = []
for item in matches.get("matches", []):
    note = read_file(item["path"], limit=80)
    rows.append({"path": item["path"], "preview": note["content"][:300]})

print(json.dumps(rows, ensure_ascii=False, indent=2))
```

CLI에서 별도로 켜야 하는 이름은 `code_execution` toolset이다.

```bash
hermes chat --toolsets file,terminal,code_execution
hermes tools list
```

설정은 `~/.hermes/config.yaml`의 `code_execution` 섹션에서 조정한다.

```yaml
code_execution:
  mode: project   # project 또는 strict
  timeout: 300
  max_tool_calls: 50
```

`project` 모드는 현재 작업 디렉터리와 활성 Python 환경을 사용한다. 프로젝트 패키지를 import하거나 상대 경로를 다뤄야 하면 이쪽이 자연스럽다. `strict` 모드는 임시 staging 디렉터리와 Hermes 자체 Python에 더 가깝게 격리되어 재현성과 격리를 우선한다. 두 모드 모두 스크립트 파일과 RPC stub은 임시 위치에 만들어지고 실행 뒤 정리된다.

## 짧은 실제 사용 사이드바

이 사용자의 개발 프로파일에서는 `code_execution` toolset이 활성화되어 있고, 로컬 설정은 `mode: project`, `timeout: 300`으로 확인된다. 블로그 발행처럼 중복 글 검사, 여러 마크다운 파일 스캔, 정적 산출물 검증을 한 번에 줄여야 하는 작업에서 유용하다. 다만 실제 빌드나 장시간 서버 실행은 여전히 `terminal`과 `process`가 더 맞다.

## Pitfalls / tips

첫째, Code Execution은 Linux와 macOS에서 동작한다. 공식 문서는 Unix domain socket을 전제로 하며 Windows에서는 자동 비활성화된다고 설명한다. Windows 환경에서는 순차 tool call이나 터미널 기반 스크립트 실행으로 우회해야 한다.

둘째, 보안 모델을 과신하면 안 된다. child process는 최소 환경으로 실행되고 `KEY`, `TOKEN`, `SECRET`, `PASSWORD`, `CREDENTIAL`, `AUTH` 같은 이름의 환경 변수는 기본적으로 빠진다. 특정 skill이 frontmatter에 필요한 환경 변수를 선언하거나 `terminal.env_passthrough`에 명시한 경우만 예외로 통과한다.

셋째, 모든 일을 `execute_code`로 밀어 넣지 않는다. 테스트 실행, 패키지 설치, 서버 구동, background process, PTY가 필요한 대화형 명령은 `terminal`이 맞다. 반대로 검색 결과를 반복 처리하거나 파일 목록을 읽고 구조화된 요약만 뽑는 일은 Code Execution이 훨씬 깔끔하다.

## 언제 이 기능을 잡을까

Code Execution은 Hermes가 “생각”을 잘하게 만드는 기능이라기보다, 도구 사용의 중간 소음을 줄이는 실행 레이어다. 한두 개 명령이면 일반 도구 호출이 빠르고, 장수명 작업이면 Cron·Kanban·terminal background가 낫다. 하지만 여러 도구 호출을 반복하고, 조건문으로 걸러내고, 최종 근거만 남겨야 한다면 `execute_code`는 긴 작업을 하나의 검증 가능한 Python 루프로 바꿔준다.
