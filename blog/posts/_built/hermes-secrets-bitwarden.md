---
type: article
title: "Hermes Secrets는 API 키 관리를 실행 시작 시점의 동기화 문제로 바꾼다"
aliases:
  - "hermes-secrets-bitwarden"
  - "Hermes Secrets Bitwarden"
author:
  - "Deck"
date created: 2026-07-05
date modified: 2026-07-05
tags:
  - hermes
  - ai-agent
  - workflow
  - secrets
  - bitwarden
description: "A feature guide to Hermes Agent's Bitwarden Secrets Manager integration: how it loads provider keys at startup, which config keys matter, and when not to use it."
thumbnail: images/hermes-secrets-bitwarden-cover.png
status: completed
series: hermes-notes
---

# Hermes Secrets는 API 키 관리를 실행 시작 시점의 동기화 문제로 바꾼다

![Hermes Secrets cover](images/hermes-secrets-bitwarden-cover.png)

Hermes Agent를 여러 프로필, 게이트웨이, 크론 작업에서 쓰기 시작하면 가장 먼저 불편해지는 것은 모델이 아니라 키 관리다. `~/.hermes/.env`에 provider 키를 직접 넣는 방식은 단순하지만, 머신이 늘어나고 키를 회전해야 하는 순간부터 “어디에 어떤 값이 남아 있는가”가 운영 리스크가 된다. `hermes secrets`는 이 문제를 Bitwarden Secrets Manager에서 시작 시점에 환경변수를 가져오는 구조로 바꾼다.

## 기능 개요

현재 Hermes의 외부 secret source는 Bitwarden Secrets Manager다. 사용자는 Bitwarden에서 machine account를 만들고, 읽기 권한이 있는 project에 `OPENROUTER_API_KEY`, `ANTHROPIC_API_KEY` 같은 이름의 secret을 둔다. Hermes는 실행될 때 bootstrap token 하나를 읽어 `bws secret list <project_id>`를 호출하고, 반환된 secret 이름을 환경변수로 주입한다.

핵심은 “키를 Hermes 설정 파일에 모두 복제하지 않는다”는 점이다. `config.yaml`에는 어떤 project를 읽을지, 캐시와 override 정책이 무엇인지가 들어가고, 실제 bootstrap token은 `.env`의 `BWS_ACCESS_TOKEN`에 둔다. provider 키를 바꾸고 싶을 때는 Bitwarden 웹앱에서 한 번 회전하고 Hermes 프로세스를 다시 시작하면 된다.

## 어떻게 설정하고 확인하나

기본 진입점은 다음 명령이다.

```bash
hermes secrets bitwarden setup
hermes secrets bitwarden status
hermes secrets bitwarden sync
```

`setup`은 `bws` 바이너리를 `~/.hermes/bin/` 아래에 내려받고 검증한 뒤, access token, Bitwarden region, project id를 설정한다. 비대화형 환경에서는 다음처럼 플래그를 줄 수 있다.

```bash
hermes secrets bitwarden setup \
  --access-token "$BWS_ACCESS_TOKEN" \
  --server-url https://vault.bitwarden.eu \
  --project-id <project-uuid>
```

관련 설정은 `~/.hermes/config.yaml`의 `secrets.bitwarden` 아래에 있다.

```yaml
secrets:
  bitwarden:
    enabled: false
    access_token_env: BWS_ACCESS_TOKEN
    project_id: ""
    server_url: ""
    cache_ttl_seconds: 300
    override_existing: true
    auto_install: true
```

`override_existing: true`이면 Bitwarden 값이 기존 환경변수보다 우선한다. 키 회전을 중앙에서 통제하려는 운영에는 이쪽이 자연스럽다. 반대로 로컬 실험에서 `.env` 값을 우선하고 싶으면 `false`로 바꾼다. `cache_ttl_seconds`는 한 프로세스 안에서 fetch 결과를 재사용하는 시간이며, 새 Hermes 프로세스는 다시 읽는다.

## 실제 운영에서의 짧은 사례

이 사용자의 셋업처럼 프로필이 여러 개이고 크론·게이트웨이·개발 세션이 함께 움직이면, 같은 provider 키가 여러 실행 표면에 필요해진다. 이때 secret source를 중앙화하면 각 프로필의 설정은 역할과 도구 범위에 집중하고, 키 교체는 Bitwarden 쪽에서 처리하는 식으로 책임을 나눌 수 있다. 공개 글이나 로그에는 실제 project id, token, 로컬 경로를 남기지 않는 것이 원칙이다.

## 주의할 점

첫째, Bitwarden token은 “키 하나로 모든 키를 읽는 권한”이므로 일반 API 키보다 가볍게 취급하면 안 된다. Hermes 문서도 machine account token이 2FA 프롬프트 없이 동작한다고 설명한다. 유출이 의심되면 웹앱에서 즉시 revoke하고 다시 발급해야 한다.

둘째, Secret Manager는 Hermes 시작을 막지 않는다. token 누락, 잘못된 region, 네트워크 지연, `bws` 문제는 경고로 남고 Hermes는 기존 `.env` 값으로 계속 진행한다. 그래서 `hermes secrets bitwarden status`와 `sync`를 배포 전 점검 루틴에 넣는 편이 좋다.

셋째, 모든 환경에 필요한 기능은 아니다. 개인용 한 대의 노트북에서만 쓴다면 `.env`가 더 단순하다. 반대로 여러 머신, VPS 게이트웨이, 팀 공유 개발 박스, 주기적 키 회전이 있는 환경에서는 `hermes secrets`가 설정 복제를 줄이고 회수·폐기 경로를 명확하게 만든다.

## 언제 이 기능을 선택할까

provider 선택, fallback, credential pool은 “어떤 모델 호출을 어디로 보낼 것인가”의 문제다. `hermes secrets`는 그보다 아래층에서 “그 호출에 필요한 비밀 값을 어디서 가져올 것인가”를 다룬다. 키가 한 파일에 머물러도 괜찮으면 `.env`로 충분하다. 키가 여러 실행면에 퍼지기 시작했다면, Bitwarden Secrets Manager 연동을 먼저 검토할 만하다.
