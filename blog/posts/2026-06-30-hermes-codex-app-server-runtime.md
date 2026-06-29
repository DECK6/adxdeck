---
type: article
title: "Hermes Codex 런타임은 에이전트 루프를 선택 가능한 실행층으로 만든다"
aliases:
  - "Hermes Codex App Server Runtime"
author:
  - "[[Deck]]"
date created: 2026-06-30
date modified: 2026-06-30
tags:
  - hermes
  - ai-agent
  - workflow
  - codex-runtime
description: "A feature guide to Hermes Agent's optional Codex app-server runtime: what changes, how to enable it, and when to prefer the default Hermes loop."
thumbnail: images/hermes-codex-app-server-runtime-cover.png
status: completed
series: hermes-notes
---

# Hermes Codex 런타임은 에이전트 루프를 선택 가능한 실행층으로 만든다

![Hermes Codex App Server Runtime cover](images/hermes-codex-app-server-runtime-cover.png)

Hermes Agent의 기본 실행 방식은 Hermes가 모델 호출, 도구 호출, 승인, 기록을 직접 조율하는 것이다. **Codex app-server runtime**은 이 구조에서 OpenAI/Codex 계열 턴만 선택적으로 Codex CLI의 app-server에 맡기는 기능이다. 문제는 단순하다. ChatGPT 구독 기반 Codex 도구·샌드박스·플러그인을 쓰고 싶지만, Hermes의 세션, gateway, skills, 일부 도구 생태계는 계속 유지하고 싶을 때가 있다.

## 기능 개요

이 기능은 OpenAI 또는 `openai-codex` 모델을 쓸 때만 의미가 있는 opt-in runtime이다. 켜면 모델의 한 턴이 Hermes 기본 tool loop 대신 `codex app-server` subprocess로 전달된다. 그 안에서 Codex는 `shell`, `apply_patch`, `update_plan`, `view_image`, 자체 `web_search` 같은 내장 도구를 사용하고, Hermes는 바깥 껍질로서 세션 DB, slash command, gateway, memory/skill review, 최종 응답 전달을 담당한다.

중요한 차이는 “Hermes가 Codex로 바뀐다”가 아니다. Hermes runtime을 하나 더 고르는 것이다. 기본값은 여전히 `auto`이며, 사용자가 켜지 않으면 기존 Hermes 도구 루프가 그대로 작동한다.

## 어떻게 설정하고 동작하나

전제는 Codex CLI와 별도 Codex 로그인이 준비되어 있어야 한다는 점이다.

```bash
npm i -g @openai/codex
codex --version
codex login
```

Hermes 세션에서는 slash command로 켠다.

```text
/codex-runtime codex_app_server
/codex-runtime
/codex-runtime auto
```

이 명령은 profile의 `~/.hermes/config.yaml`에 다음 값을 저장한다.

```yaml
model:
  openai_runtime: codex_app_server   # 기본값은 auto
```

켜는 순간 현재 캐시된 agent가 즉시 다른 실행층으로 바뀌는 것은 아니고, 다음 세션 또는 다음 agent 생성부터 적용된다. 활성화 과정에서는 Hermes MCP server 설정을 `~/.codex/config.toml`의 관리 블록으로 옮기고, Codex가 모르는 Hermes 도구를 호출할 수 있도록 `hermes-tools` MCP callback을 등록한다.

이 callback으로 `web_search`, `web_extract`, `browser_*`, `vision_analyze`, `image_generate`, `skill_view`, `skills_list`, `text_to_speech` 같은 도구는 계속 사용할 수 있다. 반대로 `delegate_task`, `memory`, `session_search`, `todo`는 실행 중인 Hermes agent context가 필요하므로 이 runtime에서는 직접 노출되지 않는다. 필요하면 `/codex-runtime auto`로 기본 runtime을 쓴다.

## 실제 사용 사이드바

이 사용자의 로컬 확인에서는 Hermes가 `openai-codex` provider를 쓰고 있었고, Codex CLI도 설치되어 있었다. 다만 profile config에는 `model.openai_runtime` 값이 보이지 않아 기본 `auto` 상태로 판단했다. 이런 셋업에서는 코딩 턴을 Codex app-server로 보내는 실험이 가능하지만, daily cron처럼 `delegate_task`나 `session_search` 의존이 있는 작업은 기본 Hermes runtime에 남겨 두는 편이 안전하다.

## 함정과 팁

첫째, `hermes auth login codex`와 `codex login`은 같은 것이 아니다. Codex runtime은 Codex CLI의 `~/.codex/auth.json`을 읽고, Hermes provider auth는 Hermes의 auth store를 쓴다. 둘 다 준비되어야 가장 덜 헷갈린다.

둘째, `~/.codex/config.toml`의 Hermes 관리 블록 안을 직접 고치지 않는다. runtime을 다시 켜거나 migrate하면 관리 블록은 재생성된다. 사용자 MCP server나 권한 profile을 추가해야 한다면 관리 블록 밖에 둔다.

셋째, Codex의 `:workspace` sandbox가 기본 권장값이다. `:danger-no-sandbox`는 편하지만 Hermes의 승인·격리 의미를 약하게 만들므로 일상 설정으로 두지 않는다.

넷째, Kanban worker나 gateway profile에 전역으로 이 값을 넣으면 하위 worker도 Codex runtime을 상속할 수 있다. 특히 `delegate_task`, memory, session search가 필요한 자동화는 profile을 분리하거나 기본 runtime으로 되돌리는 기준을 정해 둔다.

## 언제 이 기능을 고를까

Codex app-server runtime은 “Hermes 대신 Codex”가 아니라 “Hermes 안에서 Codex 실행층을 선택”하는 기능이다. Codex의 shell/apply_patch/sandbox와 ChatGPT 구독 기반 작업 흐름이 핵심이면 켠다. Hermes의 subagent, memory, session search, todo가 핵심인 운영 작업이면 기본 runtime을 유지한다. 둘을 profile별로 나누면 실험과 안정성을 동시에 잡을 수 있다.
