---
type: article
title: "Hermes Security Audit은 venv 밖의 확장면까지 검사한다"
aliases:
  - "Hermes Security Audit Supply Chain"
author:
  - "Deck"
date created: 2026-07-18
date modified: 2026-07-18
tags:
  - hermes
  - ai-agent
  - workflow
  - security-audit
description: Hermes Agent can audit its active Python environment, plugin dependency pins, and version-pinned MCP servers against OSV.dev. This guide explains scope, exit thresholds, automation, and the boundaries that still need manual review.
thumbnail: images/hermes-security-audit-supply-chain-cover.png
status: completed
series: hermes-notes
---

# Hermes Security Audit은 venv 밖의 확장면까지 검사한다

![Hermes Security Audit supply-chain cover](images/hermes-security-audit-supply-chain-cover.png)

에이전트의 공급망은 본체 패키지에서 끝나지 않는다. 플러그인이 별도 의존성을 선언하고 MCP 서버가 실행 시 패키지를 내려받는다면, 코어만 최신이어도 확장면에는 알려진 취약점이 남을 수 있다. Hermes Agent의 **Security Audit**은 이 세 표면을 한 번에 수집해 OSV.dev의 공개 취약점 데이터와 대조한다.

## 기능 개요 — 설치 환경, 플러그인, MCP를 같은 목록으로 본다

`hermes security audit`은 실행 중인 Hermes Python venv의 PyPI 배포판, `~/.hermes/plugins/` 아래 플러그인이 선언한 Python 의존성, `~/.hermes/config.yaml`에 등록된 MCP 서버를 검사한다. 결과에는 패키지와 버전, 출처, OSV 또는 GHSA 식별자, 심각도, 알려진 수정 버전이 함께 나온다.

플러그인과 MCP는 **정확한 버전 핀**이 있어야 안정적으로 조회된다. 플러그인은 `requirements.txt`, `requirements-dev.txt`, `pyproject.toml`에서 `name==version` 형태를 읽는다. MCP는 `npx package@version` 또는 `uvx package==version`처럼 고정된 패키지만 인식한다. 범위 추정이나 `latest`를 임의의 버전으로 바꾸지 않는 것은 오탐보다 명시적 미검사를 택한 설계다.

이 명령은 설치를 바꾸거나 패키지를 자동 업데이트하지 않는 **요청 시점의 읽기 전용 감사**다. 전역 pip/npm 패키지, 브라우저·에디터 확장, 로컬 경로로 실행하는 MCP, 버전이 고정되지 않은 선언은 범위 밖이다. 위험한 셸 명령을 막는 approval이나 설정 상태를 점검하는 `hermes doctor`와도 역할이 다르다.

## 어떻게 실행하고 자동화하는가

가장 먼저 사람이 읽는 기본 보고서를 확인한다.

```bash
hermes security audit
```

자동화에서는 JSON과 실패 임계값을 함께 쓴다. 기본 임계값은 `critical`이며, 지정한 등급 이상이 하나라도 있으면 종료 코드 1을 반환한다. OSV 조회 자체가 실패하면 종료 코드 2로 구분된다.

```bash
hermes security audit --json --fail-on high > hermes-audit.json
```

CI나 정기 점검에서 `--fail-on high`를 사용하면 HIGH·CRITICAL 발견을 실패 신호로 만들 수 있다. 조사 범위를 나눌 때는 아래 옵션을 조합한다.

```bash
hermes security audit --skip-venv
hermes security audit --skip-plugins
hermes security audit --skip-mcp
```

전체 감사에서 원인을 찾은 뒤 한 표면만 제외해 비교하는 용도다. 세 옵션을 모두 쓰면 검사 대상이 없으므로 성공으로 끝난다.

## 짧은 실제 사용 사이드바

한 운영 셋업에서는 역할별 프로파일이 분리되어 있어도 각 프로파일이 서로 다른 플러그인과 MCP 구성을 가질 수 있다. 그래서 확장 기능을 추가하거나 Hermes를 업데이트한 뒤, 해당 프로파일에서 읽기 전용 감사를 실행하고 JSON 결과를 보존한다. 실제 패키지 목록이나 발견 건수는 공개 로그가 아니라 제한된 유지보수 기록에만 남긴다.

## Pitfalls / tips

- **발견 건수만으로 침해를 단정하지 않는다.** 사용하지 않는 코드 경로인지, 외부에 노출되는 서비스인지, 수정 버전으로 올릴 수 있는지까지 함께 판단한다.
- **핀 없는 항목은 안전 판정이 아니라 미검사다.** 재현성과 감사 가능성이 중요하면 MCP와 플러그인 의존성을 정확한 버전으로 고정한다.
- **JSON을 그대로 공개하지 않는다.** 설치 패키지와 확장 이름은 운영 표면을 드러낼 수 있다. 외부 보고에는 필요한 식별자와 조치만 추린다.
- **네트워크 실패와 무취약점을 구분한다.** OSV.dev에 도달하지 못한 감사는 깨끗한 결과가 아니라 종료 코드 2의 실패다.

의심스러운 명령 실행을 막고 싶다면 approval과 sandbox를, 설정·인증·의존성 상태를 폭넓게 점검하려면 `hermes doctor`를 먼저 쓴다. 설치된 공급망과 공개 취약점의 교집합을 확인하고 배포 기준에 종료 코드를 연결해야 할 때 Security Audit이 맞는 도구다.
