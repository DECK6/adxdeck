---
type: article
title: "기억을 한 파일에 가두지 않을 때 Hermes가 달라진다"
aliases:
  - "Hermes Memory Providers"
author:
  - "[[Deck]]"
date created: 2026-06-28
date modified: 2026-06-28
tags:
  - hermes
  - ai-agent
  - workflow
  - memory-providers
description: "A practical guide to Hermes Agent memory providers, including built-in memory, external provider plugins, Honcho, and when to use each layer."
thumbnail: images/hermes-memory-providers-cover.png
status: completed
series: hermes-notes
---

# 기억을 한 파일에 가두지 않을 때 Hermes가 달라진다

![Abstract memory-provider network cover](images/hermes-memory-providers-cover.png)

Hermes Agent의 Memory Provider는 “다음 세션에서도 무엇을 기억해야 하는가”라는 문제를 넓게 다룬다. 기본 memory는 짧고 확실한 사실을 `MEMORY.md`와 `USER.md`에 보관하지만, 외부 provider는 세션 흐름, 사용자 모델, 검색 가능한 결론처럼 더 큰 기억 계층을 붙인다. 핵심은 모든 것을 많이 저장하는 것이 아니라, 어떤 기억을 어느 층에 둘지 나누는 데 있다.

## 기능 개요

Hermes의 기본 기억은 항상 켜져 있다. 환경 사실, 선호, 반복되는 운영 규칙처럼 작고 신뢰도 높은 항목을 파일 기반으로 주입한다. 반면 Memory Provider는 plugin으로 추가되는 외부 기억 백엔드다. 공식 문서 기준으로 Honcho, OpenViking, Mem0, Hindsight, Holographic, RetainDB, ByteRover, Supermemory 같은 provider가 있으며, 한 번에 하나의 외부 provider만 활성화된다.

활성화된 provider는 기본 memory를 대체하지 않는다. Hermes는 built-in memory를 유지하면서 provider context를 프롬프트에 더하고, 지원 범위에 따라 대화 turn 동기화, 관련 memory prefetch, 세션 종료 시 추출, provider별 검색·저장 tool 노출을 수행한다. 즉 `MEMORY.md`는 작고 명시적인 기준점, provider는 더 넓은 장기 맥락 계층이다.

## 어떻게 설정하고 작동하는가

가장 안전한 시작점은 상태 확인이다.

```bash
hermes memory status
hermes memory setup
hermes memory off
```

`status`는 built-in memory가 활성인지, 현재 외부 provider가 무엇인지, 설치된 provider plugin이 무엇인지 보여 준다. 수동 설정은 `~/.hermes/config.yaml`의 `memory.provider`에서 한다.

```yaml
memory:
  provider: honcho   # 또는 openviking, mem0, hindsight 등
```

Honcho를 예로 들면, 단순 key-value 저장보다 “peer” 기반 사용자 모델과 dialectic reasoning에 초점을 둔다. `contextCadence`는 기본 context refresh 빈도, `dialecticCadence`는 reasoning 호출 빈도, `dialecticDepth`는 한 번의 reasoning을 몇 pass로 깊게 볼지 정한다. 설정 파일은 profile-local `$HERMES_HOME/honcho.json` 또는 전역 `~/.honcho/config.json`을 사용할 수 있고, API key나 self-hosted base URL은 공개 글이나 로그에 노출하지 않는다.

```json
{
  "hosts": {
    "hermes": {
      "enabled": true,
      "aiPeer": "hermes",
      "peerName": "your-name",
      "workspace": "hermes"
    }
  }
}
```

## 실제 사용 사이드바

이 사용자의 운영에서는 프로파일별 역할이 분리되어 있어, 모든 맥락을 한 agent 기억에 섞지 않는 것이 중요하다. Dev, PKM, Ops 성격의 세션이 각각 다른 일을 하므로 built-in memory에는 짧은 규칙만 남기고, provider 계층은 profile별 peer와 workspace 경계를 고려해 붙이는 방식이 더 안전하다. 특히 gateway에서 여러 사람이 들어오는 경우 `pinUserPeer`, `userPeerAliases`, `runtimePeerPrefix` 같은 identity mapping을 먼저 정해야 기억 오염을 피할 수 있다.

## 함정과 팁

첫째, Memory Provider는 session search가 아니다. session search는 과거 대화 DB를 찾아보는 검색 기능이고, provider는 다음 turn에 어떤 맥락을 자동으로 주입하거나 도구로 꺼낼지 결정하는 기억 계층이다.

둘째, provider를 켰다고 모든 것을 맡기면 안 된다. 계정명, 토큰, 민감한 상담·건강·재무 정보는 공개용 글, skill, memory 어디에도 그대로 옮기지 않는다. built-in memory도 char limit이 있으므로 오래된 작업 일지보다 반복 사용 가치가 있는 환경 사실과 선호를 우선한다.

셋째, gateway identity mapping은 나중에 바꾸기 어렵다. `pinUserPeer: true`에서 풀면 기존 peer에 쌓인 기억이 자동 이전되지 않는다. 혼자 쓰는 gateway인지, 다른 사용자나 다른 agent도 들어오는지 먼저 결정해야 한다.

## 언제 쓰면 좋은가

작고 확실한 규칙만 필요하면 built-in memory로 충분하다. 지난 대화를 찾아야 하면 session search를 쓴다. 여러 프로파일이 같은 사용자를 장기적으로 이해해야 하거나, 세션 요약·사용자 모델·semantic search가 필요한 환경이라면 Memory Provider를 붙일 차례다. Hermes에서 기억은 하나의 저장소가 아니라, 파일 memory, 세션 검색, 외부 provider를 목적별로 나누는 설계 문제다.
