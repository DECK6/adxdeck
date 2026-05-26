---
type: article
title: "Hermes 확장은 플러그인을 켜고, 훅으로 흐름을 잡고, 큐레이터로 정리한다"
aliases:
  - hermes-plugins-hooks-curator
author:
  - "Deck"
date created: 2026-05-27
date modified: 2026-05-27
tags: [hermes, ai-agent, workflow, plugins]
description: A practical guide to Hermes Agent plugins, lifecycle hooks, and the Curator that keeps agent-created skills from becoming stale.
thumbnail: images/hermes-plugins-hooks-curator-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-plugins-hooks-curator-cover.png)

Hermes Agent를 오래 쓰면 “내 작업 환경의 규칙을 어디에 붙일 것인가”가 중요해진다. 플러그인은 새 도구와 통합을 붙이는 확장면이고, 훅은 실행 흐름에 코드를 끼워 넣는 장치이며, 큐레이터는 에이전트가 만든 스킬 라이브러리를 정리하는 유지보수 기능이다.

## 기능 개요 — 세 가지 확장면

플러그인은 `~/.hermes/plugins/` 또는 bundled `plugins/`에서 발견된다. 일반 플러그인은 `plugin.yaml`과 Python `register(ctx)`를 갖고, `ctx.register_tool()`, `ctx.register_hook()` 같은 API로 Hermes 표면을 넓힌다. 이미지 생성, 모델 provider, 메모리 provider처럼 하위 디렉터리와 선택 규칙을 가진 backend 플러그인도 있다.

훅은 세 계층이다. Gateway event hook은 `~/.hermes/hooks/<name>/HOOK.yaml`과 `handler.py`로 메시징 이벤트를 듣는다. Plugin hook은 `pre_tool_call`, `post_tool_call`, `pre_llm_call`, `on_session_end`, `subagent_stop`, `pre_gateway_dispatch` 같은 lifecycle에 붙는다. Shell hook은 `config.yaml`의 `hooks:` 블록으로 CLI 스크립트를 연결한다.

큐레이터는 스킬 청소부다. 에이전트가 만든 skill의 조회·사용·패치 횟수를 기록하고, 미사용 항목을 `active → stale → archived`로 옮긴다. 번들·hub 스킬은 대상이 아니며, 자동 삭제도 하지 않는다.

## 어떻게 작동하나

플러그인은 발견과 활성화가 분리되어 있다. 설치되어 보인다고 곧바로 실행되는 것이 아니다.

```bash
hermes plugins list
hermes plugins enable disk-cleanup
hermes plugins disable disk-cleanup
```

설정 파일에서는 allow-list로 관리된다.

```yaml
plugins:
  enabled:
    - disk-cleanup
    - observability/langfuse
  disabled:
    - noisy-plugin
```

서브 카테고리 플러그인은 `observability/langfuse`, `image_gen/openai-codex`, `platforms/discord`처럼 목록의 전체 key를 쓴다. 다만 provider 계열은 “켜기”와 “선택”이 다르다. 이미지 backend는 `image_gen.provider`가 실제 사용 backend를 정한다.

```yaml
image_gen:
  provider: openai-codex
  model: gpt-image-2-medium
```

큐레이터는 별도 명령으로 상태를 보고 수동 실행할 수 있다.

```bash
hermes curator status
hermes curator run --dry-run
hermes curator pin my-important-skill
hermes curator rollback --list
```

기본값은 7일 간격, 2시간 idle, 30/90일 stale/archive다.

```yaml
curator:
  enabled: true
  interval_hours: 168
  min_idle_hours: 2
  stale_after_days: 30
  archive_after_days: 90
```

## 짧은 실제 사용 사이드바

이 사용자의 설치에서는 `hermes plugins list`가 다수의 bundled provider와 platform plugin을 보여 주지만 대부분은 `not enabled` 상태다. 반대로 큐레이터는 좁은 스킬을 umbrella skill로 통합하고 보고서를 남긴다. 확장은 “필요할 때 켜고, 오래된 절차는 정리한다”에 가깝다.

## Pitfalls / tips

첫째, project-local plugin은 신뢰 경계가 다르다. `./.hermes/plugins/`는 비활성이고, 신뢰한 repo에서만 `HERMES_ENABLE_PROJECT_PLUGINS=true`로 켠다.

둘째, 훅은 시스템 프롬프트를 바꾸는 장소가 아니다. `pre_llm_call` context injection도 현재 user message에 임시로 붙는다. prompt cache와 대화 기록을 지키기 위한 설계다.

셋째, `plugins.enabled`는 모든 backend를 동일하게 제어하지 않는다. bundled platform/backend, memory provider, model provider는 각자의 선택 키와 discovery 규칙이 있다.

넷째, 큐레이터가 손대면 안 되는 수작업 스킬은 첫 실행 전에 `pin`한다. dry-run 보고서를 보고 pin하거나, `curator.enabled: false`를 둘 수 있다.

## 언제 이 기능을 쓰나

새 tool, slash command, gateway adapter, observability, provider backend를 붙이고 싶다면 plugin을 쓴다. 메시지 수신, tool 호출, 세션 종료 같은 순간에 정책·로그·알림을 넣고 싶다면 hook을 쓴다. 스킬 중복과 오래된 절차가 문제라면 curator를 켠다. 단순 외부 API 연결은 먼저 MCP를 검토하고, 내부 동작 확장은 플러그인과 훅으로 내려가는 편이 안전하다.
