---
type: article
title: "Hermes Session Export는 대화 기록을 검증 가능한 파일로 꺼낸다"
aliases:
  - "Hermes Session Export Portable Records"
author:
  - "Deck"
date created: 2026-07-17
date modified: 2026-07-17
tags:
  - hermes
  - ai-agent
  - workflow
  - session-export
description: Hermes Agent can export saved sessions as JSONL, Markdown, QMD, HTML, or agent traces. This guide explains filters, redaction, lineage handling, and safe cleanup boundaries.
thumbnail: images/hermes-session-export-portable-records-cover.png
status: completed
series: hermes-notes
---

# Hermes Session Export는 대화 기록을 검증 가능한 파일로 꺼낸다

![Hermes Session Export portable records cover](images/hermes-session-export-portable-records-cover.png)

에이전트와 나눈 대화가 로컬 데이터베이스에만 남아 있으면 다시 이어 가기에는 편하지만, 백업·감사·공유·장기 보관에는 다루기 어렵다. Hermes Agent의 **Session Export**는 저장된 세션을 목적에 맞는 파일 형식으로 꺼내고, 어떤 기록을 내보냈는지 검증할 수 있게 한다.

## 기능 개요 — 세션 저장소와 전달 파일을 분리한다

Hermes는 CLI, Gateway, Cron, API 등에서 생긴 대화를 `~/.hermes/state.db`에 세션으로 저장한다. 여기에는 제목, source, 모델, 메시지, tool call과 결과, token·시간 정보가 함께 들어간다. `hermes sessions export`는 이 원본 저장소를 직접 복사하는 대신 선택한 세션을 이식 가능한 표현으로 만든다.

형식은 용도별로 나뉜다. 기본 `jsonl`은 세션마다 JSON 객체 하나를 기록해 백업과 기계 처리가 쉽다. `md`와 `qmd`는 사람이 읽을 파일을 세션별로 만들고, `manifest.jsonl`에 파일 경로·메시지 수·lineage ID·SHA-256을 남긴다. `html`은 외부 의존성 없는 단일 열람 페이지를 만들고, `trace`는 에이전트 실행 분석 도구가 읽는 Claude Code JSONL 형태를 사용한다.

압축이나 정리와 역할도 다르다. `/compress`는 현재 모델이 읽는 context를 줄이고, `archive`는 목록에서 기록을 숨기며, `prune`과 `delete`는 저장소에서 행을 제거한다. Export는 그보다 앞에서 기록을 파일로 보존하는 단계다.

## 어떻게 내보내는가

먼저 목록에서 source와 session ID를 확인한다.

```bash
hermes sessions list --source cron --limit 30
```

시간·source·제목·모델·작업 디렉터리·메시지 수 필터를 조합할 수 있다. 파일을 쓰기 전 `--dry-run`으로 대상을 확인하고, 공유 가능성이 있으면 `--redact`를 붙인다.

```bash
hermes sessions export cron-archive.jsonl \
  --source cron --older-than 30 --redact --dry-run

hermes sessions export cron-archive.jsonl \
  --source cron --older-than 30 --redact
```

하나의 긴 작업이 압축으로 여러 세션에 이어졌다면 Markdown export에서 `--lineage logical`을 사용해 한 논리적 기록으로 묶을 수 있다.

```bash
hermes sessions export --format md \
  --session-id <session-id> --lineage logical --redact \
  ~/archives/hermes-sessions
```

검토용 단일 파일에는 HTML이 맞다. 실행 분석용 trace는 외부 반출을 고려해 기본 redaction이 적용된다.

```bash
hermes sessions export --format html \
  --session-id <session-id> --redact session-review.html

hermes sessions export --format trace \
  --session-id <session-id> session-trace.jsonl
```

별도 설정은 필요 없다. 각 프로파일의 `state.db`는 독립적이므로 기록이 있는 프로파일에서 실행한다.

## 짧은 실제 사용 사이드바

한 운영 셋업에서는 지식·개발·운영 역할과 예약 작업이 서로 다른 프로파일과 source로 기록된다. 오래된 예약 작업을 정리할 때는 먼저 source와 기간으로 `--dry-run`하고, 필요한 기록을 redacted Markdown과 manifest로 보존한 뒤에만 정리 대상을 판단한다. 진행 로그를 장기 memory에 억지로 넣지 않으면서도 근거는 다시 열어 볼 수 있는 방식이다.

## Pitfalls / tips

- **Redaction을 최종 익명화로 오해하지 않는다.** `--redact`는 키·토큰·자격 증명 패턴을 가리지만, 사람 이름이나 업무 문맥까지 판단하지 않는다. 외부 공유 전에는 생성 파일을 다시 읽는다.
- **필터 없는 bulk export를 습관화하지 않는다.** active session까지 포함될 수 있으므로 source·기간·제목을 좁히고 `--dry-run` 결과를 확인한다.
- **Export와 삭제를 한 단계로 붙이지 않는다.** `--delete-after-verified`는 단일 session의 Markdown/QMD export에서만 제한적으로 제공된다. manifest와 파일을 확인하기 전에는 `prune`이나 `delete`를 실행하지 않는다.
- **Trace upload는 외부 작업이다.** 공개 옵션을 쓰기 전 권한과 redaction 결과를 검토한다.

대화를 잠깐 이어 갈 목적이면 `--continue`나 `--resume`이면 충분하고, 과거 내용을 찾는 일은 `session_search`가 더 빠르다. 세션을 사람이 읽거나 다른 도구로 분석하고, 정리 전 보존 근거까지 남겨야 할 때 Session Export가 기록을 검증 가능한 산출물로 바꿔 준다.
