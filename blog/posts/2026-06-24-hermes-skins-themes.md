---
type: article
title: "Hermes Skins는 에이전트의 말투가 아니라 작업 화면을 바꾼다"
aliases:
  - "hermes-skins-themes"
author:
  - "Deck"
date created: 2026-06-24
date modified: 2026-06-24
tags:
  - hermes
  - ai-agent
  - workflow
  - skins
description: "A practical guide to Hermes Agent Skins and Themes: how CLI appearance, built-in themes, custom YAML skins, and persistent display.skin settings work without changing the agent personality."
thumbnail: images/hermes-skins-themes-cover.png
status: completed
series: hermes-notes
featureTopic: "Skins and Themes"
officialDocs:
  - "https://hermes-agent.nousresearch.com/docs/user-guide/features/skins"
localVerification:
  - "hermes --version"
  - "hermes --help"
  - "hermes config path"
  - "active profile display.skin"
---

# Hermes Skins는 에이전트의 말투가 아니라 작업 화면을 바꾼다

![Hermes Skins cover](images/hermes-skins-themes-cover.png)

Hermes를 오래 쓰다 보면 모델, 도구, 메모리만큼 자주 보게 되는 것이 터미널 화면입니다. Skins & Themes는 이 화면의 색, 배너, 스피너, 응답 박스 라벨, 도구 출력 접두사를 바꾸는 기능입니다. 핵심은 간단합니다. **personality는 에이전트가 어떻게 말하는지를 바꾸고, skin은 CLI가 어떻게 보이는지를 바꿉니다.**

## 기능 개요: 시각 스타일을 별도 레이어로 분리하기

Skin은 Hermes CLI의 표시 레이어입니다. 공식 문서 기준으로 skin은 banner colors, spinner faces and verbs, response-box labels, branding text, tool activity prefix를 제어합니다. `default`, `ares`, `mono`, `slate`, `daylight`, `warm-lightmode`, `poseidon`, `sisyphus`, `charizard` 같은 내장 skin이 있고, 사용자 정의 YAML 파일도 만들 수 있습니다.

이 기능이 중요한 이유는 운영 맥락을 화면에서 빠르게 구분할 수 있기 때문입니다. 예를 들어 밝은 터미널에서는 `daylight`나 `warm-lightmode`가 읽기 좋고, 녹화나 문서화에는 색을 줄인 `mono`가 적합합니다. 반대로 브랜드성 있는 내부 도구처럼 쓰고 싶다면 `branding.agent_name`, `response_label`, `banner_logo`를 바꾸어 CLI의 정체성을 분리할 수 있습니다.

## 어떻게 동작하나: `/skin`, `display.skin`, YAML

현재 세션에서 skin을 바꾸는 가장 빠른 방법은 CLI 안에서 `/skin`을 쓰는 것입니다.

```bash
/skin
/skin ares
/skin mono
```

`/skin`은 현재 skin과 사용 가능한 skin을 보여주고, 이름을 붙이면 즉시 현재 세션의 표시 스타일을 바꿉니다. 다만 이 변경은 세션 한정입니다. 기본값으로 고정하려면 Hermes 설정 파일에 `display.skin`을 지정합니다.

```yaml
display:
  skin: default
```

사용자 정의 skin은 다음 위치에 YAML로 둡니다.

```text
~/.hermes/skins/mytheme.yaml
```

프로파일을 쓰는 환경에서는 해당 프로파일의 Hermes home 아래 `skins/`가 기준이 됩니다. 사용자 skin은 빠진 값을 내장 `default`에서 상속하므로 전체 템플릿을 복사할 필요는 없습니다.

```yaml
name: cyberpunk
description: Neon terminal theme

colors:
  banner_border: "#FF00FF"
  banner_title: "#00FFFF"
  banner_accent: "#FF1493"

spinner:
  thinking_verbs: ["jacking in", "decrypting", "uploading"]

branding:
  agent_name: "Cyber Agent"
  response_label: " ⚡ Cyber "

tool_prefix: "▏"
```

색상은 `colors:` 아래에서 배너, 프롬프트, 응답 박스, 상태 바, completion menu까지 세밀하게 나뉩니다. `spinner:`는 대기 중 얼굴, reasoning 표시, 동사, 장식 괄호를 담당합니다. `branding:`은 agent name, welcome/goodbye 문구, prompt symbol, help header 등을 바꿉니다. `tool_emojis`로 도구별 진행 표시 이모지도 지정할 수 있습니다.

## 짧은 실제 사용 사이드바

이 사용자의 Hermes 운영은 프로파일별로 역할과 도구 표면이 나뉘어 있습니다. 그런 환경에서 skin은 기능 권한을 바꾸는 보안 장치가 아니라, “지금 어떤 작업 표면을 보고 있는가”를 덜 헷갈리게 만드는 시각 표지에 가깝습니다. 실제 권한 분리는 profiles, toolsets, gateway routing에서 하고, skin은 사람이 읽는 콘솔의 문맥 신호로 쓰는 편이 안전합니다.

## Pitfalls / Tips

첫째, skin을 personality와 혼동하지 마세요. `display.personality`나 `/personality`는 말투와 응답 스타일에 관여하지만, skin은 화면 요소만 바꿉니다. “친절하게 말하게 하기”를 기대하고 skin을 바꾸면 원하는 결과가 나오지 않습니다.

둘째, `/skin`으로 바꾼 값은 현재 세션용입니다. 새 세션에서도 유지하려면 `hermes config edit` 또는 `hermes config set display.skin <name>`으로 설정에 남겨야 합니다.

셋째, 커스텀 skin 이름이 내장 skin과 같으면 사용자 skin이 우선합니다. 의도치 않게 `default.yaml` 같은 이름을 만들면 기본 테마가 바뀐 것처럼 보일 수 있습니다. 문제가 생기면 `~/.hermes/skins/`의 YAML 이름과 `display.skin` 값을 먼저 확인하세요.

넷째, 알 수 없는 skin 이름은 `default`로 fallback됩니다. 화면이 바뀌지 않는다면 오타, 프로파일별 Hermes home, YAML 문법 오류를 순서대로 점검하는 것이 좋습니다.

## 마무리

Skins는 Hermes의 능력을 늘리는 기능은 아닙니다. 대신 매일 보는 CLI를 작업 환경에 맞게 정리하는 기능입니다. 대화의 성격을 바꾸고 싶다면 personality를, 도구 접근을 바꾸고 싶다면 toolsets/profiles를, 화면의 색과 표식을 바꾸고 싶다면 skins를 선택하면 됩니다.
