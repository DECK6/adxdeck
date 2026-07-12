---
type: article
title: "Hermes DM Pairing은 Gateway 접근 승인을 일회용 코드로 바꾼다"
aliases:
  - "Hermes DM Pairing Access Control"
author:
  - "Deck"
date created: 2026-07-13
date modified: 2026-07-13
tags: [hermes, ai-agent, workflow, pairing, security]
description: Hermes Agent can approve messaging users with short-lived pairing codes instead of collecting platform IDs in advance. This guide explains the authorization flow, CLI commands, storage, and operational boundaries.
thumbnail: images/hermes-dm-pairing-access-control-cover.png
status: completed
series: hermes-notes
---

# Hermes DM Pairing은 Gateway 접근 승인을 일회용 코드로 바꾼다

![Hermes DM pairing access control cover](images/hermes-dm-pairing-access-control-cover.png)

Telegram이나 Discord에 Hermes Gateway를 열 때 첫 문제는 모델이 아니라 출입 권한이다. 모든 사용자의 플랫폼 ID를 미리 받아 allowlist에 적는 방식은 작은 개인 봇에는 충분하지만, 팀원이 늘거나 여러 메시징 채널을 운영하면 갱신 비용이 커진다. Hermes의 **DM Pairing**은 낯선 사용자가 받은 일회용 코드를 운영자가 승인하는 흐름으로 이 문제를 푼다.

## 기능 개요 — 연결과 실행 권한 사이의 첫 관문

Pairing은 “누가 봇과 대화할 수 있는가”를 정하는 Gateway 인증 기능이다. 모르는 사용자가 봇에 DM을 보내면 Hermes는 8자리 코드를 돌려주고, 운영자가 CLI에서 그 코드를 승인한다. 승인은 플랫폼 단위로 유지되며 재시작 뒤에도 남는다. 미리 사용자 ID를 수집할 필요가 없고 Gateway를 재시작하지 않아도 승인 결과가 즉시 적용되는 것이 핵심이다.

이 기능은 topic routing, `require_mention`, 위험 명령 approval과 역할이 다르다. Pairing은 사용자의 입장을 허용하고, topic과 mention 규칙은 메시지가 어느 세션으로 갈지 정하며, command approval은 허용된 사용자의 요청이라도 위험한 실행을 다시 멈춘다.

Gateway의 사용자 확인은 허용된 pairing 목록과 플랫폼별·전역 allowlist를 함께 본다. 어떤 허용 규칙에도 맞지 않으면 기본값은 deny다. Pairing은 `ALLOW_ALL`을 켜는 편의 기능이 아니라, 필요한 사람만 점진적으로 추가하는 대안이다.

## 어떻게 작동하고 설정하나

기본 흐름은 네 단계다.

```bash
# 1. 사용자가 봇에 DM을 보내 코드를 받는다
# 2. 운영자가 대기 요청과 승인 사용자를 확인한다
hermes pairing list

# 3. 플랫폼과 코드를 지정해 승인한다
hermes pairing approve telegram ABC12DEF

# 4. 더 이상 필요 없는 사용자의 접근을 회수한다
hermes pairing revoke telegram <user-id>
```

승인되지 않은 DM의 처리 방식은 `~/.hermes/config.yaml`에서 정한다.

```yaml
unauthorized_dm_behavior: pair

whatsapp:
  unauthorized_dm_behavior: ignore
```

`pair`는 채팅형 DM 플랫폼의 기본 동작으로, 낯선 사용자에게 코드를 보낸다. `ignore`는 조용히 버린다. 이메일은 관련 없는 발신자에게 자동 응답할 위험이 있어 기본적으로 `ignore`이며, 플랫폼별 설정이 전역값보다 우선한다. 남은 대기 코드를 모두 없애려면 다음 명령을 쓴다.

```bash
hermes pairing clear-pending
```

Pairing 코드는 혼동하기 쉬운 `0/O/1/I`를 제외한 문자로 생성되고 1시간 뒤 만료된다. 사용자별 요청 간격은 10분, 플랫폼별 대기 코드는 최대 3개이며, 승인 실패가 5회 누적되면 1시간 잠긴다. 데이터 파일은 `0600` 권한으로 저장되고 코드는 표준 출력 로그에 기록되지 않는다.

공식 문서는 저장소를 `~/.hermes/pairing/`로 설명한다. 최신 설치는 프로파일 격리와 경로 마이그레이션을 위해 `$HERMES_HOME/platforms/pairing/` 또는 프로파일별 저장소를 해석할 수 있다. 경로 차이를 따라 JSON을 직접 고치기보다 `hermes pairing` 명령을 사용하는 편이 버전과 프로파일에 안전하다.

## 짧은 실제 사용 사이드바

한 운영 셋업에서는 지식·개발·운영 역할을 서로 다른 프로파일과 메시징 토픽으로 분리한다. 이때 Pairing은 각 Gateway에 들어올 사람만 정하고, 토픽 라우팅과 mention 규칙은 들어온 메시지의 담당자를 정한다. 두 경계를 분리하면 “접근이 허용됨”을 “모든 작업을 실행해도 됨”으로 오해하지 않게 된다.

## Pitfalls / tips

첫째, 코드를 승인하기 전에 요청자를 다른 채널로 확인한다. Pairing 코드는 신원을 증명하지 않고 특정 요청을 승인 목록에 연결할 뿐이다. 둘째, `clear-pending`은 대기 코드만 지우며 이미 승인된 사용자는 `revoke`해야 한다. 셋째, Docker에서는 Gateway와 같은 OS 사용자로 승인 명령을 실행한다.

```bash
docker exec -u hermes hermes-agent \
  hermes pairing approve telegram ABC12DEF
```

root로 만든 `0600` 파일은 비권한 Gateway가 읽지 못해 승인이 무시될 수 있다. 마지막으로 `GATEWAY_ALLOW_ALL_USERS=true`를 켜 두면 Pairing의 제한 효과가 사라지므로, 터미널 도구가 열린 봇에서는 공개 접근 플래그를 피한다.

## 닫기

사용자가 한두 명이고 ID가 고정돼 있다면 정적 allowlist가 더 단순하다. 팀원이 수시로 합류하거나 여러 메시징 플랫폼에서 운영자 승인 흐름이 필요하다면 DM Pairing이 적합하다. Pairing으로 입장을 관리하고, routing으로 대화를 분리하며, toolset과 command approval로 실행 범위를 다시 제한하는 것이 Hermes Gateway를 안전하게 여는 순서다.
