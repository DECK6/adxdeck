---
type: article
title: "Hermes Profile Distribution은 에이전트 전체를 버전 관리한다"
aliases:
  - hermes-profile-distributions
author:
  - "Deck"
date created: 2026-07-08
date modified: 2026-07-08
tags: [hermes, ai-agent, workflow, profiles]
description: "A feature guide to Hermes Agent profile distributions: package a whole agent as a git repository, install it with one command, and update it without touching user data."
thumbnail: images/hermes-profile-distributions-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-profile-distributions-cover.png)

Hermes의 Profile은 한 컴퓨터 안에서 여러 에이전트를 나누는 단위다. **Profile Distribution**은 그 다음 단계다. 특정 프로필의 성격, 스킬, 설정, Cron, MCP 연결을 하나의 git 저장소로 묶어 다른 사람이나 다른 장비에 같은 에이전트를 설치하게 해 준다.

## 기능 개요 — 프로필을 “패키지”로 만들기

일반 프로필은 `~/.hermes/profiles/<name>/` 아래에 `SOUL.md`, `config.yaml`, `skills/`, `cron/`, `mcp.json`, 세션과 메모리, 인증 파일을 가진다. Distribution은 여기서 **공유 가능한 부분만** 저장소로 만든다. 핵심 파일은 `distribution.yaml`이다.

```yaml
name: research-bot
version: 1.0.0
description: "Autonomous research assistant"
hermes_requires: ">=0.12.0"
env_requires:
  - name: OPENAI_API_KEY
    description: "OpenAI API key"
    required: true
```

공식 문서 기준으로 이 기능의 목적은 “프로필 백업”이 아니라 “재사용 가능한 에이전트 배포”다. 팀용 리뷰 봇, 연구 보조 에이전트, 고객지원 봇처럼 성격과 작업 절차가 정해진 에이전트를 버전으로 관리할 때 맞다.

## 어떻게 작동하나

작성자는 먼저 정상 동작하는 프로필을 만든 뒤, 비밀과 사용자 데이터를 제외하는 `.gitignore`를 둔다. 절대 커밋하면 안 되는 항목은 `.env`, `auth.json`, `memories/`, `sessions/`, `state.db*`, `logs/`, 캐시류다. 그 다음 저장소를 만들고 태그를 붙인다.

```bash
cd ~/.hermes/profiles/research-bot
git init
git add .
git commit -m "v1.0.0"
git tag v1.0.0
git push -u origin main --tags
```

설치자는 git URL이나 로컬 디렉터리에서 설치한다.

```bash
hermes profile install github.com/team/research-bot --alias
hermes profile info research-bot
hermes profile update research-bot
```

로컬 설치본 `Hermes Agent v0.17.0`에서도 `profile install`, `profile update`, `profile info`가 노출된다. `install`은 `distribution.yaml`을 읽고 필요한 환경변수를 점검한 뒤 프로필을 만든다. `update`는 기록된 source에서 다시 가져와 distribution-owned 파일을 갱신하지만, 기본적으로 `config.yaml`은 보존하고 `.env`, 인증, 메모리, 세션, 로그는 건드리지 않는다. 설정까지 배포본으로 되돌리려면 `--force-config`를 명시해야 한다.

## 짧은 실제 사용 사이드바

이 사용자의 운영은 역할별 프로필을 나누어 쓰는 구조라서, Distribution이 필요한 순간도 분명하다. 단순히 로컬에서 Dev/PKM/Ops처럼 분리하는 것과 달리, Distribution은 “같은 역할 에이전트를 다른 장비나 팀원에게 반복 설치”해야 할 때 쓰는 배포 레이어다. 개인 메모리나 세션을 복제하지 않는 점이 특히 중요하다.

## Pitfalls / tips

첫째, installer가 hard-excluded path를 한 번 더 걸러도 작성자의 `git add` 실수까지 책임져 주지는 않는다. 공개 저장소라면 첫 커밋 전에 `git status`와 `.gitignore`를 확인한다.

둘째, Distribution은 API 키를 배송하지 않는다. `env_requires`는 필요한 키 이름과 설명만 알려 주고, 각 설치자가 자신의 `.env`나 셸 환경에 값을 넣는다.

셋째, 업데이트 경계가 중요하다. `SOUL.md`, `skills/`, `cron/`, `mcp.json`, `distribution.yaml`은 배포자가 소유하기 쉽지만, 설치자가 조정한 모델·provider 설정은 보존되는 편이 안전하다.

마지막으로 단순 백업은 `hermes profile export` / `import`가 더 알맞다. Distribution은 “내 프로필을 보관”하는 기능이 아니라, git으로 검토·태그·업데이트할 수 있는 에이전트 제품을 만드는 기능이다.
