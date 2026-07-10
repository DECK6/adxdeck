---
type: article
title: "Hermes 1Password 연동은 키 회전을 한 번의 변경으로 만든다"
aliases:
  - Hermes 1Password Secret Source
author:
  - "Deck"
date created: 2026-07-11
date modified: 2026-07-11
tags: [hermes, ai-agent, workflow, secrets, 1password]
description: Hermes Agent can resolve provider credentials from 1Password references when each process starts. This guide explains setup, precedence, caching, and non-interactive authentication.
thumbnail: images/hermes-1password-secret-source-cover.png
status: completed
series: hermes-notes
---

# Hermes 1Password 연동은 키 회전을 한 번의 변경으로 만든다

![Hermes 1Password secret source cover](images/hermes-1password-secret-source-cover.png)

API 키를 여러 실행 환경에 복사하면 회전할 때마다 남은 사본을 찾아야 한다. Hermes Agent의 **1Password Secret Source**는 키 자체 대신 `op://vault/item/field` 참조만 설정에 두고, CLI·Gateway·Cron 프로세스가 시작될 때 1Password에서 값을 해석한다. 이 기능이 푸는 문제는 모델 선택이 아니라 자격 증명의 중앙 회전과 회수다.

## 기능 개요 — 키가 아니라 참조를 배포한다

Hermes에는 Bitwarden Secrets Manager와 1Password secret source가 내장되어 있다. 1Password 방식은 공식 `op` CLI를 쓰며, 환경변수마다 `op://` 참조를 명시하는 **mapped source**다. Hermes가 대신 로그인하거나 `op`를 자동 설치하지는 않는다. 노트북에서는 대화형 세션을, 서버와 CI에서는 service account token을 쓴다.

시작 순서는 단순하다. 먼저 `~/.hermes/.env`를 읽고, 다음으로 설정된 참조마다 `op read`를 실행해 결과를 현재 Hermes 프로세스의 환경변수에 넣는다. 기본값인 `override_existing: true`에서는 1Password 값이 기존 `.env` 값을 덮어 중앙 회전이 다음 시작에 반영된다. 로컬 값을 우선하려면 이를 `false`로 바꾼다.

## 어떻게 설정하고 작동하나

먼저 1Password CLI를 설치하고 인증 상태를 확인한 뒤 연동을 켠다.

```bash
op whoami
hermes secrets onepassword setup
hermes secrets onepassword set OPENROUTER_API_KEY \
  "op://Production/OpenRouter/credential"
hermes secrets onepassword sync
hermes secrets onepassword status
```

`sync`의 기본 동작은 값을 노출하지 않는 dry-run이다. 참조가 해석되는지와 적용 예정 환경변수만 확인하므로 실제 실행 전에 쓰기 좋다. 설정은 `~/.hermes/config.yaml`의 다음 블록에 저장된다.

```yaml
secrets:
  onepassword:
    enabled: true
    env:
      OPENROUTER_API_KEY: "op://Production/OpenRouter/credential"
    account: ""
    service_account_token_env: OP_SERVICE_ACCOUNT_TOKEN
    binary_path: ""
    cache_ttl_seconds: 300
    override_existing: true
```

서버·Cron처럼 비대화형인 환경에서는 bootstrap credential인 `OP_SERVICE_ACCOUNT_TOKEN`이 프로세스 시작 전에 보여야 한다. 일반 provider 키는 1Password에 남길 수 있지만, 이 토큰까지 `op://`로 가리키면 닭과 달걀 문제가 생긴다. `binary_path`에 절대경로를 지정하면 `PATH`에서 우연히 발견된 다른 `op`를 신뢰하지 않도록 고정할 수 있다.

성공한 전체 조회는 기본 300초 동안 메모리와 `~/.hermes/cache/op_cache.json`에 캐시된다. 파일은 `0600` 권한과 원자적 쓰기를 사용하며, 인증 재료는 지문으로 키에 반영된다. 저장을 원치 않으면 `cache_ttl_seconds: 0`으로 둔다.

## 실제 사용 사이드바

이 사용자의 셋업은 역할별 여러 프로파일과 Gateway·Cron을 함께 운용하므로, 중앙 회전의 이점이 큰 구조다. 다만 현재 로컬 점검에서는 1Password 연동이 꺼져 있고 `op` 바이너리와 참조도 없는 상태였다. 이는 고장이 아니라 opt-in 기능의 정상 초기 상태이며, 도입 시 `setup → set → sync → status` 순서로 준비도를 확인하면 된다.

## Pitfalls / tips

첫째, 누락된 `op`, 잠긴 세션, 만료된 token, 잘못된 참조는 Hermes 시작을 막지 않는다. 한 줄 경고를 남기고 기존 `.env` 자격 증명으로 계속되므로, 자동화 배포 전에는 반드시 `sync`와 `status`를 별도 점검한다.

둘째, service account에는 필요한 vault와 item의 읽기 권한만 준다. bootstrap token은 다른 모든 secret을 여는 열쇠가 될 수 있으므로 `config.yaml`이나 글·로그에 기록하지 않는다.

셋째, Bitwarden과 동시에 켤 수 있지만 같은 환경변수를 양쪽이 주장하지 않게 한다. 명시적 `op://` 매핑은 bulk source보다 우선하고, 같은 형태끼리는 `secrets.sources`에서 먼저 온 source가 이긴다.

## 닫기

한 대의 개인 머신에서 키 몇 개만 쓴다면 `.env`가 더 단순하다. 여러 머신, 공유 개발 환경, 장기 실행 Gateway, 반복 Cron에서 같은 키를 회전·회수해야 한다면 1Password Secret Source가 맞다. 모델 장애 복구는 fallback, 같은 provider 인증 순환은 credential pool, 키 보관과 배포는 secret source로 역할을 나누면 운영 경계가 선명해진다.
