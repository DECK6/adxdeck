---
type: article
title: "도구가 너무 많을 때 Hermes는 먼저 검색하게 한다"
aliases:
  - "Hermes Tool Search Progressive Tools"
author: Deck
date created: 2026-06-16
date modified: 2026-06-16
tags: [hermes, ai-agent, workflow, tool-search]
description: "A practical guide to Hermes Agent Tool Search, the progressive-disclosure layer that keeps large MCP and plugin tool catalogs out of the prompt until needed."
thumbnail: images/hermes-tool-search-progressive-tools-cover.png
status: completed
series: hermes-notes
---

# 도구가 너무 많을 때 Hermes는 먼저 검색하게 한다

![Abstract dark technology cover for Hermes Tool Search](images/hermes-tool-search-progressive-tools-cover.png)

Hermes Agent에 MCP 서버와 플러그인을 붙이다 보면 에이전트가 실제로 쓰지 않을 도구의 JSON schema까지 매 턴 모델 컨텍스트에 들어간다. **Tool Search**는 이 낭비를 줄이는 점진 공개(progressive disclosure) 기능이다. 모든 도구를 처음부터 보여주는 대신, 필요한 도구를 먼저 검색하고 설명을 불러온 뒤 호출하게 만든다.

## 기능 개요: 도구 목록을 “카탈로그”로 접는다

Tool Search가 다루는 대상은 Hermes 내장 핵심 도구가 아니라, MCP 서버와 비핵심 플러그인이 제공하는 도구다. `terminal`, `read_file`, `patch`, `web_search`, `delegate_task`, `memory` 같은 핵심 도구는 항상 직접 노출된다. 반면 GitHub MCP, 사내 API MCP, 특수 플러그인처럼 개수가 빠르게 늘어나는 도구들은 지연 노출 후보가 된다.

활성화되면 모델이 보는 도구 배열에는 원래의 수십 개 schema 대신 세 가지 브리지 도구가 들어간다.

```text
tool_search(query, limit?)
tool_describe(name)
tool_call(name, arguments)
```

즉 “이슈를 만들 도구가 필요하다”는 상황에서 먼저 `tool_search("create github issue")`로 후보를 찾고, `tool_describe("mcp_github_create_issue")`로 인자 구조를 확인한 다음, `tool_call(...)`로 실제 도구를 실행한다. Hermes는 이 호출을 내부에서 원래 도구 이름으로 풀어 dispatch하므로 승인 프롬프트, hook, guardrail, 로그 표시는 실제 도구 기준으로 동작한다.

## 어떻게 설정하고 동작하는가

기본값은 `auto`다. 지연 가능한 도구 schema가 현재 모델 컨텍스트의 10% 이상을 차지할 때만 Tool Search가 켜진다. 작은 도구셋에서는 아무 일도 하지 않고, MCP 서버가 많아질 때만 prompt 비용을 줄이는 쪽으로 전환한다.

```yaml
tools:
  tool_search:
    enabled: auto       # auto, on, off
    threshold_pct: 10
    search_default_limit: 5
    max_search_limit: 20
```

상태 확인은 일반 Hermes 설정/도구 명령과 함께 보면 된다.

```bash
hermes config path
hermes tools list
hermes config set tools.tool_search.enabled auto
```

이 로컬 설치에서는 `tools.tool_search.enabled: auto`, `threshold_pct: 10`으로 설정되어 있고, CLI 기본 toolset은 `hermes-cli`다. 또한 MCP 서버가 붙어 있어 도구 수가 늘어날 때 Tool Search가 개입할 조건을 갖춘 상태였다.

> **짧은 실제 사용 사례**  
> 이 사용자의 운영 환경은 프로파일별로 Dev, PKM, Ops 역할을 나누고, 필요에 따라 MCP·브라우저·파일·터미널 도구를 함께 쓴다. 이런 셋업에서는 매 턴 모든 확장 도구를 모델에 보여주는 것보다, 핵심 도구는 직접 두고 확장 도구만 검색식으로 접는 편이 컨텍스트 관리에 유리하다.

## 팁과 함정

첫째, Tool Search는 “도구 권한 상승” 기능이 아니다. 브리지 도구는 현재 세션에 허용된 toolset 안의 지연 후보만 검색하고 호출한다. 제한된 subagent나 gateway 세션이 이 기능으로 비활성 도구를 몰래 발견할 수는 없다.

둘째, `enabled: on`은 항상 이득이 아니다. 브리지 schema 자체도 약 300토큰 정도의 고정 비용이 있고, 처음 쓰는 도구는 검색·설명·호출의 추가 왕복이 생긴다. 도구가 몇 개 없는 환경이라면 `auto`가 안전한 기본값이다.

셋째, 검색 품질은 모델이 좋은 질의를 만들 수 있는지에 좌우된다. Hermes는 도구 이름, 설명, 파라미터 이름을 BM25로 검색하고 필요하면 이름 substring match로 보완하지만, 모델이 엉뚱한 검색어를 넣으면 한 번 더 찾아야 한다.

넷째, 도구셋을 세션 중간에 크게 바꾸면 prompt cache도 흔들린다. Tool Search의 카탈로그는 현재 도구 배열에서 매번 재구성되므로, MCP 서버 추가·제거는 다음 조립 시점부터 반영된다.

## 언제 쓰면 좋은가

Tool Search는 “많은 확장 도구 중 일부만 가끔 쓰는” 환경에 맞다. MCP 서버를 여러 개 연결하거나 플러그인 도구가 많은 프로파일에서는 컨텍스트 절약 효과가 크다. 반대로 내장 도구 위주의 단순 CLI 작업, 혹은 항상 같은 몇 개 도구만 쓰는 세션에서는 직접 노출이 더 빠르다. 핵심은 도구를 감추는 것이 아니라, 모델이 필요한 schema만 제때 꺼내도록 Hermes가 도구 표면적을 조절한다는 점이다.
