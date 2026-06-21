---
type: article
title: "Hermes LSP는 에디터 밖에서도 타입 오류를 본다"
aliases:
  - "hermes-lsp-semantic-diagnostics"
author:
  - "Deck"
date created: 2026-06-22
date modified: 2026-06-22
tags: [hermes, ai-agent, workflow, lsp]
description: "A feature guide to Hermes Agent's LSP semantic diagnostics layer, including setup, config, supported servers, and post-write verification behavior."
thumbnail: images/hermes-lsp-semantic-diagnostics-cover.png
status: completed
series: hermes-notes
---

# Hermes LSP는 에디터 밖에서도 타입 오류를 본다

![Hermes LSP semantic diagnostics cover](images/hermes-lsp-semantic-diagnostics-cover.png)

코딩 에이전트가 파일을 고칠 때 가장 위험한 순간은 “문법은 맞지만 프로젝트 의미는 틀린” 코드를 남기는 때다. `python -m py_compile`이나 `node --check`는 괄호와 구문은 잡지만, 없는 변수·잘못된 타입·누락된 import까지 항상 보지는 못한다. **Hermes Agent의 LSP 기능**은 이 빈틈을 줄이기 위해 실제 Language Server Protocol 서버를 `write_file`과 `patch` 이후 검사 흐름에 붙인다.

## 기능 개요 — 내장된 의미 진단 레이어

Hermes의 LSP는 에디터 플러그인이 아니다. Pyright, `typescript-language-server`, `gopls`, `rust-analyzer`, `clangd`, `yaml-language-server` 같은 언어 서버를 Hermes 프로세스가 백그라운드 subprocess로 띄우고, 파일 도구가 수정한 결과를 다시 물어본다. 그래서 에이전트는 단순 lint 결과와 별도로 `lsp_diagnostics`라는 채널을 받는다.

작동 범위는 git workspace 기준이다. 파일이 git 저장소 안에 있으면 LSP가 켜지고, 홈 디렉터리나 임시 메시징 작업처럼 프로젝트가 아닌 곳에서는 조용히 빠진다. 검사 순서도 보수적이다. 먼저 빠른 구문 검사를 통과한 뒤 LSP를 조회하고, 언어 서버가 없거나 실패하면 기존 syntax-only 결과로 폴백한다. LSP 문제 때문에 쓰기 자체가 깨지지 않도록 설계된 셈이다.

## 어떻게 설정하고 쓰는가

현재 상태는 CLI에서 바로 확인한다.

```bash
hermes lsp status
hermes lsp list
hermes lsp which pyright
```

필요한 서버는 미리 설치할 수 있다.

```bash
hermes lsp install pyright
hermes lsp install typescript
hermes lsp install-all
hermes lsp restart
```

설정은 `~/.hermes/config.yaml` 또는 profile별 `$HERMES_HOME/config.yaml`의 `lsp` 섹션에 둔다.

```yaml
lsp:
  enabled: true
  wait_mode: document
  wait_timeout: 5.0
  install_strategy: auto
  servers:
    pyright:
      disabled: false
    typescript:
      disabled: true
```

`install_strategy: auto`일 때 Hermes는 npm이나 Go 설치 레시피가 있는 서버를 `<HERMES_HOME>/lsp/bin/`과 `<HERMES_HOME>/lsp/node_modules/` 아래에 둔다. `/usr/local` 같은 공유 위치를 건드리지 않는 점이 중요하다. Rust, Java, Kotlin처럼 toolchain 의존이 큰 서버는 수동 설치가 필요할 수 있다.

실제 출력은 다음처럼 `lint`와 `lsp_diagnostics`가 나뉜다.

```json
{
  "lint": {"status": "ok", "output": ""},
  "lsp_diagnostics": "ERROR [2:16] missing_name is not defined (Pyright)"
}
```

이번 로컬 확인에서는 Dev profile의 `hermes lsp status`가 `enabled: True`, `install_strategy: auto`로 표시되었고 Pyright, TypeScript, clangd, Bash, YAML 서버가 설치 상태였다. 별도 임시 git 저장소에서 `missing_name`을 넣은 Python 파일을 `write_file`로 저장하자 Pyright의 `reportUndefinedVariable` 진단이 실제로 반환되었다.

## 실제 운용에서의 짧은 장면

이 사용자의 개발 운용은 Dev profile이 블로그 발행, repo 검증, 테스트 실행을 함께 맡는 구조다. 이런 환경에서는 에이전트가 작은 자동화 스크립트나 Markdown sync 도구를 빠르게 고칠 일이 많다. LSP는 “파일은 저장됐지만 import나 타입이 틀렸다”는 문제를 다음 테스트까지 미루지 않고 편집 직후에 보여 주는 안전망으로 쓰인다.

## Pitfalls / tips

첫째, LSP는 git 저장소 바깥에서는 의도적으로 돌지 않는다. 새 프로젝트에서 진단이 비어 있으면 `git init` 여부부터 확인한다. 둘째, `hermes lsp status`의 `missing`은 고장이 아니라 서버 binary가 아직 없다는 뜻이다. `hermes lsp install <id>` 또는 언어별 toolchain 설치로 해결한다.

셋째, Bash 서버처럼 옆 도구가 필요한 경우가 있다. 예를 들어 `bash-language-server`가 있어도 `shellcheck`가 없으면 diagnostics가 비어 있을 수 있고, 이때 status의 backend warning을 본다. 넷째, 큰 Rust/Java 프로젝트는 첫 indexing 동안 진단이 늦게 올 수 있다. 이때는 `wait_timeout`을 늘리거나 `hermes lsp restart`로 깨진 client 상태를 정리한다.

## 언제 이 기능을 쓰는가

LSP는 테스트 러너의 대체물이 아니다. 대신 에이전트가 파일을 쓰는 바로 그 순간에 “문법 너머의 오류”를 좁게 잡아 주는 1차 방어선이다. 빠른 스크립트 수정, 타입이 중요한 Python/TypeScript 작업, 대형 저장소의 자동 patch에는 LSP를 켜 두고, 실제 동작 검증은 여전히 프로젝트 테스트와 빌드로 마무리하는 것이 가장 안전하다.
