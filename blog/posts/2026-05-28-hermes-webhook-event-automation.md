---
type: article
title: "Hermes Webhook은 외부 이벤트를 에이전트 실행으로 바꾼다"
aliases:
  - hermes-webhook-event-automation
author:
  - "[[육대근]]"
date created: 2026-05-28
date modified: 2026-05-28
tags:
  - hermes
  - ai-agent
  - workflow
  - webhook
description: A practical guide to Hermes Agent webhooks: enabling the adapter, defining routes or dynamic subscriptions, securing payloads, and deciding when event-driven automation beats cron.
thumbnail: images/hermes-webhook-event-automation-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-webhook-event-automation-cover.png)

Hermes Webhook은 “사람이 말을 걸 때만 작동하는 에이전트”를 외부 시스템의 사건 흐름 안으로 넣는 기능이다. GitHub PR, GitLab merge request, 결제 이벤트, 모니터링 알림처럼 어떤 서비스가 HTTP POST를 보내면 Hermes가 payload를 읽고 agent run, 메시지 전달, 로그 기록으로 이어 줄 수 있다. 문제가 “몇 시에 반복할까”가 아니라 “어떤 사건이 발생했는가”라면 Cron보다 webhook이 자연스럽다.

## 기능 개요

Webhook adapter는 gateway 안에서 작은 HTTP 서버처럼 동작한다. 외부 서비스가 `/webhooks/<route-name>`으로 JSON payload를 보내면 Hermes는 서명과 event type을 확인하고 route 설정에 맞는 prompt를 만든다. route에는 event 목록, HMAC secret, prompt template, skills, delivery target이 들어간다.

공식 문서 기준 delivery는 `log`, `telegram`, `discord`, `slack`, `github_comment` 등을 지원한다. `deliver_only: true`를 쓰면 LLM 호출 없이 template을 바로 전달한다. 즉 webhook은 외부 사건을 Hermes의 라우팅·전달 계층에 연결하는 인터페이스다.

## 어떻게 작동하나

먼저 webhook platform을 켠다. wizard를 쓰거나 profile의 `config.yaml`에 직접 넣을 수 있다.

```bash
hermes gateway setup
```

```yaml
platforms:
  webhook:
    enabled: true
    extra:
      host: "0.0.0.0"
      port: 8644
      secret: "your-global-hmac-secret"
```

gateway 실행 후 health endpoint를 확인한다.

```bash
hermes gateway run
curl http://localhost:8644/health
```

정적 route는 `platforms.webhook.extra.routes`에 둔다.

```yaml
routes:
  github-pr-review:
    events: ["pull_request"]
    secret: "github-webhook-secret"
    prompt: |
      Review this pull request:
      Repository: {repository.full_name}
      PR #{number}: {pull_request.title}
      URL: {pull_request.html_url}
    skills: ["github-code-review"]
    deliver: "github_comment"
    deliver_extra:
      repo: "{repository.full_name}"
      pr_number: "{number}"
```

중첩 payload는 `{pull_request.title}`처럼 dot notation으로 꺼내고, 전체 payload가 필요하면 `{__raw__}`를 쓴다. 동적 subscription은 CLI로 만든다.

```bash
hermes webhook subscribe github-issues \
  --events "issues" \
  --prompt "New issue #{issue.number}: {issue.title}" \
  --skills "github-issues" \
  --deliver telegram

hermes webhook list
hermes webhook test github-issues --payload '{"issue":{"number":1}}'
```

이 로컬 설치에서는 `hermes webhook list`가 webhook platform이 아직 enabled가 아니라고 보고했다. 그래서 첫 진단은 route 작성이 아니라 gateway 설정, port, secret, health check다.

## 실제 사용 사이드바

이 사용자의 운영에서는 Cron이 매일 정해진 시각의 발행·점검을 맡고, webhook은 외부 사건을 즉시 Hermes로 밀어 넣는 후보로 분리된다. “시간이 되면 확인”은 Cron, “PR이 열리면 검토 흐름 시작”은 webhook에 가깝다. 핵심은 기능을 많이 켜는 것이 아니라 route별 신뢰 범위와 delivery 대상을 좁히는 것이다.

## Pitfalls / tips

첫째, webhook payload는 외부 입력이다. PR 제목, commit message, form body에는 prompt injection이 들어갈 수 있으므로 secret, event allowlist, rate limit, sandboxed backend를 함께 고려한다.

둘째, GitHub payload에는 코드 diff가 없다. PR review route라면 prompt에서 `gh pr diff {number} --repo {repository.full_name}`처럼 실제 diff를 가져오는 절차를 명시한다.

셋째, 로컬 테스트에는 외부 서비스가 접근할 public URL이 필요하다. `ngrok http 8644` 같은 tunnel을 쓸 수 있지만 URL 변경과 접근 권한을 확인해야 한다.

처음에는 `deliver: log`, 테스트 payload, 작은 event allowlist로 시작한다. 정해진 시간 반복은 Cron, 대화형 운영은 Gateway, 외부 도구 노출은 MCP가 맞다. 외부 시스템이 “지금 일이 생겼다”고 알려 주고 그 사건을 Hermes가 판단·전달·기록해야 할 때 webhook을 쓴다.
