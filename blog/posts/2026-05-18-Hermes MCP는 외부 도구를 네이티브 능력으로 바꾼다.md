---
type: article
title: "Hermes MCP는 외부 도구를 네이티브 능력으로 바꾼다"
aliases:
  - Hermes MCP Native Tools
author:
  - "[[육대근]]"
date created: 2026-05-18
date modified: 2026-05-18
tags:
  - hermes
  - ai-agent
  - workflow
  - mcp
description: A practical guide to Hermes Agent's native MCP client: how stdio and HTTP servers are configured, discovered, filtered, reloaded, and exposed as first-class tools.
thumbnail: images/hermes-mcp-native-tools-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-mcp-native-tools-cover.png)

Hermes Agent의 MCP 기능은 “외부 도구를 연결한다”는 추상적인 말보다 훨씬 구체적이다. 이미 MCP 서버로 제공되는 GitHub, 파일시스템, 브라우저, 데이터베이스, 사내 API를 Hermes 안의 **일급 도구**처럼 불러오게 해 준다. 핵심 문제는 하나다. Hermes 코어를 고치지 않고도 필요한 도구 생태계를 붙이되, 모델에게 보이는 표면은 안전하게 좁히는 것이다.

## 기능 개요 — MCP server가 toolset이 되는 흐름

MCP(Model Context Protocol)는 에이전트와 외부 도구 서버 사이의 표준 연결 방식이다. Hermes는 MCP **client**로 동작해 서버에 접속하고, 서버가 제공하는 tool·resource·prompt capability를 확인한 뒤 사용할 수 있는 항목을 등록한다. 반대로 `hermes mcp serve`를 실행하면 Hermes 자체가 MCP **server**가 되어 다른 MCP client에게 Hermes의 메시징 기능을 노출할 수도 있다.

실제 사용에서 더 자주 만나는 쪽은 client 모드다. `mcp_servers` 설정에 서버를 추가하면 Hermes는 시작 또는 reload 시점에 도구를 발견하고, 이름 충돌을 피하기 위해 다음 규칙으로 등록한다.

```text
mcp_<server_name>_<tool_name>
```

예를 들어 `project-fs` 서버의 `read_file`은 `mcp_project_fs_read_file`처럼 보인다. 하이픈과 점은 언더스코어로 정리된다. 서버가 resource나 prompt를 지원하면 `list_resources`, `read_resource`, `list_prompts`, `get_prompt` 같은 유틸리티 wrapper도 같은 prefix로 붙는다. 다만 Hermes는 capability-aware 방식으로 등록하므로, 서버가 resource를 지원하지 않으면 관련 wrapper를 억지로 만들지 않는다.

## 어떻게 설정하고 확인하나

가장 작은 stdio 서버 예시는 로컬 프로세스를 실행하는 형태다.

```yaml
mcp_servers:
  project_fs:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
```

HTTP 서버는 `url`과 필요한 header를 둔다. 공개 문서나 블로그에는 실제 token, 내부 endpoint, header 값을 쓰지 않는 것이 원칙이다.

```yaml
mcp_servers:
  docs_api:
    url: "https://mcp.example.com/mcp"
    headers:
      Authorization: "Bearer ***"
```

Hermes CLI에서는 다음 명령 표면을 쓴다.

```bash
hermes mcp add NAME
hermes mcp list
hermes mcp test NAME
hermes mcp configure NAME
hermes mcp remove NAME
hermes mcp login NAME
```

`hermes mcp list`는 서버 이름, transport, tool 노출 정책, enabled 상태를 보여 준다. `hermes mcp test NAME`은 연결과 도구 발견을 검증하는 단계다. OAuth가 필요한 HTTP 서버는 `auth: oauth`를 설정하고 `hermes mcp login NAME`으로 재인증할 수 있으며, token은 Hermes의 MCP token 저장 위치에 보관된다.

도구를 모두 열어 두는 대신 처음부터 필터를 거는 편이 좋다.

```yaml
mcp_servers:
  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "***"
    tools:
      include: [list_issues, create_issue, search_code]
      resources: false
      prompts: false
```

`tools.include`가 있으면 해당 server-native tool만 등록된다. `tools.exclude`는 blacklist이고, 둘 다 있으면 include가 우선한다. 서버 자체를 잠시 보관만 하고 싶다면 `enabled: false`로 두면 연결 시도와 도구 등록이 모두 생략된다.

## 짧은 실제 사용 사이드바

이 사용자의 셋업에서는 MCP가 “Hermes가 직접 내장하지 않은 전문 도구를 붙이는 통로”로 다뤄진다. 특히 서버를 설정했는데 현재 세션의 tool registry에 아직 보이지 않는 경우가 있어, 설정 변경 뒤에는 새 세션을 열거나 `/reload-mcp`로 다시 발견시키는 절차를 운영 습관으로 둔다. 중요한 점은 서버 이름이나 token을 기록하는 것이 아니라, “설정·테스트·필터링·reload” 순서를 남기는 것이다.

## Pitfalls / tips

첫째, MCP 서버를 추가했다고 즉시 모든 대화에 보이는 것은 아니다. Hermes는 시작 또는 reload 시점에 discovery를 수행한다. 설정을 바꾼 뒤 도구가 보이지 않으면 `/reload-mcp`, 새 세션, gateway restart 순서로 확인한다.

둘째, stdio 서버에는 전체 shell 환경이 그대로 전달되지 않는다. 필요한 값은 `env`에 명시하고, 공개 글이나 로그에는 secret 값을 남기지 않는다. HTTP 서버도 header를 예시값으로만 다룬다.

셋째, 민감한 서버는 allowlist가 기본값이다. 결제, 고객 데이터, 사내 API처럼 쓰기 권한이 섞인 서버에 `all`을 열어 두면 모델의 tool surface가 너무 커진다. `include`, `resources: false`, `prompts: false`를 먼저 적용한 뒤 필요한 도구를 늘린다.

넷째, `supports_parallel_tool_calls: true`는 읽기 전용·독립 호출이 안전할 때만 켠다. 파일, DB, 외부 상태를 동시에 바꾸는 도구라면 race condition을 먼저 검토해야 한다.

## 언제 MCP를 고르나

MCP는 이미 좋은 외부 서버가 있거나, Hermes 코어를 수정하지 않고 조직 내부 시스템을 붙이고 싶을 때 가장 잘 맞는다. 반대로 Hermes 내장 toolset이 이미 충분하거나, 아주 좁은 단일 기능만 필요하다면 native tool 하나가 더 단순할 수 있다. 좋은 MCP 운영은 “가능한 모든 도구를 연결”하는 것이 아니라, “필요한 서버 하나를 테스트하고, 최소한의 도구만 노출하고, reload까지 확인”하는 것이다.
