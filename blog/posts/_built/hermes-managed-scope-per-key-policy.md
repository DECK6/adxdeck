---
type: article
title: "Hermes Managed Scope는 한 키만 고정하고 나머지 설정은 열어 둔다"
aliases:
  - "Hermes Managed Scope Per Key Policy"
author:
  - "Deck"
date created: 2026-07-20
date modified: 2026-07-20
tags:
  - hermes
  - ai-agent
  - workflow
  - managed-scope
description: Hermes Agent Managed Scope lets administrators pin selected configuration and environment keys without locking every user setting. This guide explains precedence, setup, write guards, and the POSIX-first security boundary.
thumbnail: images/hermes-managed-scope-per-key-policy-cover.png
status: completed
series: hermes-notes
---

# Hermes Managed Scope는 한 키만 고정하고 나머지 설정은 열어 둔다

![Hermes Managed Scope per-key policy cover](images/hermes-managed-scope-per-key-policy-cover.png)

여러 사람이 같은 머신에서 Hermes Agent를 쓰면 “권장 설정”만으로는 부족할 때가 있다. 보안 옵션이나 조직의 모델 provider는 고정하되, 각 사용자의 화면·도구·fallback 설정까지 잠그고 싶지는 않다. **Managed Scope**는 관리자가 선택한 키만 변경 불가능한 기준선으로 올리는 기능이다.

## 기능 개요 — 전체 잠금이 아니라 leaf 단위 정책

기본 관리 위치는 `/etc/hermes/`다. `config.yaml`은 일반 설정을, `.env`는 환경변수를 제공한다. 관리 레이어에 적힌 값은 사용자의 `~/.hermes/config.yaml`, `~/.hermes/.env`, 해당 키의 shell 환경변수보다 우선한다. 하지만 병합은 leaf 단위다. `model.provider`를 고정해도 `model.default`나 `model.fallback`까지 자동으로 잠기지는 않는다.

이는 package manager가 설정 변경 전체를 막는 설치 잠금과 다르다. Profiles도 상태를 분리할 뿐 조직 정책을 강제하지 않는다. Managed Scope는 “어느 사용자·profile로 실행해도 이 몇 개의 값만은 같다”는 경계를 만든다.

## 어떻게 설정하고 확인하나

관리자는 root 소유 디렉터리와 파일을 준비한다.

```bash
sudo mkdir -p /etc/hermes
sudo tee /etc/hermes/config.yaml >/dev/null <<'YAML'
model:
  provider: nous
security:
  redact_secrets: true
YAML
sudo chmod 0755 /etc/hermes
sudo chmod 0644 /etc/hermes/config.yaml
```

이 예시는 `model.provider`와 `security.redact_secrets`만 고정한다. 다른 설정은 사용자가 계속 바꿀 수 있다. 적용 상태는 다음 두 명령에서 확인한다.

```bash
hermes config
hermes doctor
```

`hermes config`는 관리 소스와 고정된 dotted key를 표시하고, `hermes doctor`는 해석된 관리 디렉터리와 config/env 키 개수를 보고한다. 사용자가 고정 키를 바꾸면 쓰기 전에 거부된다.

```bash
hermes config set model.provider openrouter
# Cannot set 'model.provider': it is managed by your administrator
```

컨테이너처럼 `/etc/hermes`를 쓰기 어려운 배포는 시작 환경에 `HERMES_MANAGED_DIR`을 지정할 수 있다. 이 변수 자체를 사용자가 바꿀 수 있으면 정책 디렉터리를 우회할 수 있으므로 service unit이나 container image에서 함께 고정해야 한다.

## 짧은 실제 사용 사이드바

한 운영 셋업은 역할별 여러 profile을 사용하지만 현재 Managed Scope는 활성화하지 않은 상태다. 개인 머신에서는 profile별 설정 자유도가 더 중요하기 때문이다. 같은 구성을 팀 공용 머신으로 옮긴다면 보안 키 몇 개만 관리 레이어에 두고, 역할별 모델과 도구 선택은 각 profile에 남기는 방식이 적합하다.

## Pitfalls / tips

- **v1은 Linux/POSIX 우선 기능이다.** macOS와 Windows의 native 관리 위치는 아직 별도 지원 범위가 아니다.
- **강제력은 파일 권한에서 온다.** 관리 디렉터리에 쓰기 권한이 있거나 Hermes를 root로 실행하면 경계가 약해진다.
- **관리 `.env`를 비밀 금고로 오해하지 않는다.** 공식 권장 mode `0644`는 로컬 사용자가 읽을 수 있으므로 공유 API base URL 같은 비민감 값에 한정하고, 민감 키는 Secret Source를 쓴다.
- **완전한 sandbox가 아니다.** 관리 env 값은 시작 시 적용되지만 agent가 자신의 subprocess 환경을 바꾸는 것까지 막지는 않는다.
- **잘못된 관리 파일은 fail-open이다.** 시작을 막지는 않고 경고와 함께 무시되므로 변경 뒤 `hermes doctor` 확인이 필수다.

조직이 소수의 설정을 모든 사용자에게 동일하게 강제해야 할 때는 Managed Scope가 맞다. 역할과 기억을 나누려면 Profiles, 위험 명령을 멈추려면 approvals, 자격 증명을 중앙 회전하려면 Secret Source를 써야 한다. 전체 설정을 잠그지 않고 필요한 키만 정책으로 승격하는 것이 이 기능의 정확한 용도다.
