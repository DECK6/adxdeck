---
type: article
title: "Honcho를 붙이면 Hermes 기억은 파일을 넘어 사용자 모델이 된다"
aliases:
  - hermes-honcho-memory
author:
  - "Deck"
date created: 2026-07-07
date modified: 2026-07-07
tags: [hermes, ai-agent, workflow, memory, honcho]
description: "A practical guide to Hermes Agent's Honcho memory provider: peer modeling, dialectic reasoning, setup boundaries, and when to use it instead of built-in memory alone."
thumbnail: images/hermes-honcho-memory-cover.png
status: completed
series: hermes-notes
---

# Honcho를 붙이면 Hermes 기억은 파일을 넘어 사용자 모델이 된다

![Abstract Honcho memory network cover](images/hermes-honcho-memory-cover.png)

Hermes Agent의 기본 memory는 “반복해서 필요한 사실”을 짧게 보관하는 장치다. Honcho는 그 다음 단계다. 대화가 쌓일수록 사용자와 agent의 관계를 peer 단위로 모델링하고, 세션 맥락과 장기 결론을 다음 turn의 판단 재료로 돌려준다. 문제는 단순히 더 많이 기억하는 것이 아니라, 여러 agent와 세션 사이에서 “누가 누구를 어떻게 이해하는가”를 분리하는 데 있다.

## 기능 개요 — peer, session, dialectic

Honcho는 Hermes의 Memory Provider 시스템에 붙는 외부 기억 backend다. built-in `MEMORY.md` / `USER.md`를 대체하지 않고 그 위에 한 층을 더한다. 기본 memory가 사람이 직접 남긴 작고 확실한 사실이라면, Honcho는 대화 메시지, session summary, 사용자 peer card, AI identity card, 그리고 추론된 conclusion을 다룬다.

핵심 용어는 세 가지다. `peer`는 Honcho 안에서 사용자나 agent를 식별하는 단위다. `session`은 특정 작업 흐름의 대화 묶음이며 `per-session`, `per-directory`, `per-repo`, `global` 같은 전략으로 나눌 수 있다. `dialectic reasoning`은 몇 turn마다 Honcho가 대화를 다시 읽고 사용자의 선호, 목표, 현재 맥락을 추론하는 pass다.

## 어떻게 설정하고 작동하나

상태 확인은 Hermes CLI에서 시작한다.

```bash
hermes memory status
hermes memory setup
hermes memory off
```

`memory setup`에서 `honcho`를 고르면 cloud API key나 self-hosted URL을 연결한다. 수동 설정은 `~/.hermes/config.yaml`에서 provider를 지정한다.

```yaml
memory:
  provider: honcho
```

Honcho 세부 설정은 profile-local `$HERMES_HOME/honcho.json` 또는 전역 `~/.honcho/config.json`에 저장된다. 공개 문서나 로그에는 API key, host token, 실제 사용자 식별자를 쓰지 않는다.

```json
{
  "hosts": {
    "hermes": {
      "enabled": true,
      "aiPeer": "hermes",
      "peerName": "operator",
      "workspace": "personal-ai-workspace",
      "recallMode": "hybrid",
      "contextCadence": 1,
      "dialecticCadence": 2,
      "dialecticDepth": 1
    }
  }
}
```

`recallMode: hybrid`에서는 Honcho context가 자동으로 프롬프트에 들어가고, 지원 tool도 함께 노출된다. `context`는 자동 주입만, `tools`는 agent가 필요할 때 명시적으로 조회하는 방식이다. `contextCadence`는 기본 context 갱신 주기, `dialecticCadence`는 reasoning 호출 간격, `dialecticDepth`는 한 번의 reasoning을 1–3 pass로 얼마나 깊게 볼지 정한다.

## 실제 사용 사이드바

이 사용자의 설치에서는 현재 외부 provider는 꺼져 있고 built-in memory만 활성화되어 있다. 대신 Dev, PKM, Ops처럼 역할이 다른 프로파일이 분리되어 있어, Honcho를 붙인다면 하나의 전역 기억보다 profile별 peer와 workspace 경계를 먼저 설계해야 한다. 특히 gateway처럼 여러 채널에서 들어오는 환경에서는 `pinUserPeer`, `userPeerAliases`, `runtimePeerPrefix`를 정하지 않으면 기억이 섞일 수 있다.

## Pitfalls / tips

첫째, Honcho는 session search가 아니다. session search는 과거 대화 DB를 찾아보는 검색 도구이고, Honcho는 다음 turn에 들어올 장기 맥락을 구성하는 memory provider다.

둘째, 모든 정보를 자동 기억에 맡기지 않는다. secret, 계정 식별자, 민감한 개인 정보는 Honcho 설정·memory·skill·블로그 어디에도 그대로 남기지 않는 것이 안전하다.

셋째, multi-agent 환경에서는 peer 이름을 초기에 안정적으로 정한다. 나중에 identity mapping을 바꾸면 기존 peer에 쌓인 결론이 자동으로 깔끔하게 이전되는 것은 아니다.

넷째, 비용과 지연을 조절한다. 긴 작업에는 `dialecticDepth`를 올릴 수 있지만, 대부분은 낮은 cadence와 얕은 pass로 시작한 뒤 필요할 때 깊게 보는 편이 낫다.

## 언제 Honcho를 쓰나

단순 선호와 환경 사실만 필요하면 built-in memory면 충분하다. 과거 대화를 찾아야 하면 session search가 맞다. 여러 agent가 같은 사용자를 장기적으로 이해해야 하거나, 대화의 결론과 현재 세션 요약을 자동으로 다음 turn에 반영하고 싶다면 Honcho를 검토할 차례다. Hermes에서 기억은 저장소 하나가 아니라, 명시적 사실·검색 가능한 기록·추론된 사용자 모델을 나누는 설계다.
