---
type: article
title: "Hermes 세션 압축은 긴 대화를 다시 작업 가능한 상태로 만든다"
aliases:
  - hermes-session-compression
author:
  - "[[육대근]]"
date created: 2026-05-29
date modified: 2026-05-29
tags:
  - hermes
  - ai-agent
  - workflow
  - sessions
description: A practical guide to Hermes Agent sessions, resume, search, and context compression for long-running work.
thumbnail: images/hermes-session-compression-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-session-compression-cover.png)

Hermes Agent의 세션 기능은 “이전 대화를 기억한다”는 단순한 편의 기능이 아니다. 긴 작업을 다시 이어 하고, 플랫폼을 넘겨 가며 계속 진행하고, 너무 커진 대화를 압축해 모델이 처리할 수 있는 크기로 되돌리는 운영 장치다. 같은 일을 매번 처음부터 설명해야 한다면 에이전트는 도구가 아니라 일회용 챗봇에 가깝다. 세션은 그 차이를 가르는 기본 층이다.

## 기능 개요

Hermes는 CLI, Telegram, Discord, Slack, Cron, Webhook, API Server 같은 실행 표면에서 생긴 대화를 모두 세션으로 저장한다. 저장소는 `~/.hermes/state.db`의 SQLite 데이터베이스이며, 여기에는 session id, source, title, model, system prompt snapshot, 메시지와 tool call, token count, 시작·종료 시간이 들어간다.

중요한 점은 “저장”과 “현재 모델에게 다시 보내는 context”가 다르다는 것이다. Hermes는 전체 기록을 보관하지만, 매 턴마다 모든 바이트를 다시 보내지는 않는다. 모델이 보는 것은 현재 시스템 프롬프트, 최근 대화 창, 그리고 그 턴에 명시적으로 주입된 자료다. 이미지나 오디오도 원본 파일이 매번 반복 주입되는 것이 아니라, 분석 결과·전사문·경로·요약 같은 텍스트 흔적으로 남는다.

## 어떻게 작동하나

기본 조작은 `hermes sessions`와 세션 관련 slash command다.

```bash
hermes sessions list --limit 50
hermes --continue
hermes --resume "refactoring auth"
hermes sessions rename 20260529_090000_abcd12 "blog-renderer-review"
hermes sessions stats
```

대화 중에는 제목과 새 세션, 압축을 바로 다룬다.

```text
/title blog-renderer-review
/new next-debug-thread
/compress rendering bugs
/resume blog-renderer-review
/status
```

압축은 `config.yaml`의 `compression` 블록으로 제어된다.

```yaml
compression:
  enabled: true
  threshold: 0.50
  target_ratio: 0.20
  protect_last_n: 20

auxiliary:
  compression:
    provider: auto
    model: null

context:
  engine: compressor
```

기본 compressor는 context window의 약 50%에 도달하면 작동한다. 오래된 큰 tool result를 먼저 비우고, 첫 교환과 최근 tail은 보호한 뒤, 중간 구간을 구조화된 요약으로 바꾼다. 요약에는 목표, 제약, 완료·진행·차단 상태, 결정, 관련 파일, 다음 단계가 들어간다. Gateway에는 별도의 session hygiene 안전망도 있어 메시징 세션이 85% 근처까지 커졌을 때 agent 실행 전에 한 번 더 압축을 시도한다.

수동 `/compress`는 단순 삭제가 아니다. 공식 문서 기준 압축은 active context를 줄이는 기능이고, 개인정보 삭제나 기록 삭제가 아니다. 오래된 세션을 실제로 지우려면 별도의 prune/delete 명령을 써야 한다.

```bash
hermes sessions prune --older-than 90
hermes sessions delete 20260529_090000_abcd12
```

## 실제 사용 사이드바

이 사용자의 운영 환경에서는 Dev, PKM, Ops처럼 역할별 profile과 메시징 topic이 나뉘어 있고, Cron 작업도 별도 source로 기록된다. 그래서 긴 작업은 제목을 붙여 다시 찾고, 기능 글 발행 같은 반복 작업은 매일의 cron 세션으로 남긴다. 핵심은 “모든 것을 한 대화에 쌓기”가 아니라, 이어야 할 작업은 resume하고 끊어야 할 맥락은 `/new`로 분리하는 습관이다.

## Pitfalls / tips

첫째, 압축용 auxiliary model의 context가 너무 작으면 요약 품질이 무너질 수 있다. 긴 중간 구간을 요약 모델이 한 번에 읽어야 하므로, main model보다 지나치게 작은 모델을 compression에 지정하지 않는 편이 안전하다.

둘째, 큰 로그와 diff를 통째로 붙여 넣는 습관이 context를 가장 빨리 망친다. 파일 경로, 짧은 발췌, 재현 명령, 요약을 남기고 필요할 때 tool로 다시 읽게 하는 방식이 낫다.

셋째, group/channel 세션 정책을 확인해야 한다. shared session은 공동 맥락을 만들지만 token cost와 interrupt 상태도 공유한다. 반대로 per-user session은 서로의 장기 작업을 오염시키지 않는다.

넷째, prompt caching과 compression은 서로 다른 기능이다. Anthropic 계열에서는 안정적인 prefix를 캐시해 비용을 줄일 수 있지만, 압축이 일어나면 압축 구간 이후 cache는 다시 형성된다. 비용 절감과 context 관리가 같은 말은 아니다.

세션 기능은 “다시 이어 하기”가 필요한 작업에 쓴다. 반대로 주제가 바뀌었거나 민감한 일회성 확인이라면 새 세션이 더 안전하다. Hermes를 장시간 운영할수록 좋은 세션 관리는 모델 선택만큼 중요해진다.
