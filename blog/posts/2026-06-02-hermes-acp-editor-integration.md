---
type: article
title: "Hermes ACP는 터미널 에이전트를 코드 에디터 안으로 끌어온다"
aliases:
  - "Hermes ACP Editor Integration"
author:
  - "[[Deck]]"
date created: 2026-06-02
date modified: 2026-06-02
tags:
  - hermes
  - ai-agent
  - workflow
  - acp
  - editor
description: "A feature guide to Hermes Agent ACP editor integration: how Hermes runs as an Agent Client Protocol server, what toolsets it exposes, and how to connect it from VS Code, Zed, or JetBrains."
thumbnail: images/hermes-acp-editor-integration-cover.png
status: completed
series: hermes-notes
---

# Hermes ACP는 터미널 에이전트를 코드 에디터 안으로 끌어온다

![Abstract cover for Hermes ACP editor integration](images/hermes-acp-editor-integration-cover.png)

Hermes Agent는 기본적으로 터미널이나 메시징 플랫폼에서 강하다. 하지만 코드를 고칠 때는 대화, 파일 diff, 터미널 명령, 승인 프롬프트가 에디터 안에서 한 흐름으로 보이는 편이 더 편하다. **ACP Editor Integration**은 이 문제를 해결한다. Hermes를 ACP(Agent Client Protocol) 서버로 실행해 VS Code, Zed, JetBrains 계열의 ACP 호환 클라이언트가 Hermes와 stdio JSON-RPC로 대화하게 만드는 기능이다.

## 기능 개요: 에디터가 Hermes의 작업 콘솔이 된다

ACP 모드에서 Hermes는 독립 앱처럼 새 인터페이스를 만드는 대신, 에디터가 이미 가진 패널과 승인 UI를 사용한다. 사용자는 에디터 안에서 채팅을 보내고, Hermes는 파일 읽기·쓰기, 패치, 터미널 실행, 웹/브라우저 조회, 세션 검색, 메모리, 스킬, `execute_code`, `delegate_task` 같은 도구를 호출한다. 결과는 단순 텍스트가 아니라 tool activity, file diff, terminal command, approval prompt, streaming response로 나뉘어 표시될 수 있다.

중요한 점은 ACP용 toolset이 별도로 조정된다는 것이다. 공식 문서의 `hermes-acp` toolset은 코딩 에디터 흐름에 맞춰 `clarify`, `cronjob`, `send_message`, `text_to_speech`, 일부 홈오토메이션 도구처럼 에디터 UX와 맞지 않는 기능을 제외한다. 반대로 파일·터미널·검색·스킬·위임처럼 개발 작업에 필요한 도구는 남긴다. 즉 ACP는 Hermes의 축소판이 아니라, 에디터에 맞게 안전 경계를 다시 잡은 실행 모드다.

## 어떻게 설정하고 쓰는가

Hermes를 먼저 설치한 뒤 ACP extra가 필요하면 다음처럼 의존성을 추가한다.

```bash
pip install -e '.[acp]'
```

실행 진입점은 셋이다.

```bash
hermes acp
hermes-acp
python -m acp_adapter
```

비대화형 점검에는 아래 명령이 가장 빠르다.

```bash
hermes acp --version
hermes acp --check
hermes doctor
```

로컬 설치에서는 `hermes acp --check`가 ACP adapter import와 의존성을 확인한다. Hermes의 일반 CLI와 마찬가지로 ACP 모드도 `~/.hermes/config.yaml`, `~/.hermes/.env`, `~/.hermes/skills/`, `~/.hermes/state.db`를 사용하며, provider와 credential resolution도 기존 설정을 따른다.

VS Code에서는 ACP Client 확장에서 Hermes Agent를 선택하거나 수동 설정에 다음을 넣는다.

```json
{
  "acp.agents": {
    "Hermes Agent": {
      "command": "hermes",
      "args": ["acp"]
    }
  }
}
```

Zed는 Agent Panel의 ACP Registry에서 Hermes Agent를 설치하는 경로가 기본이다. Registry 런처는 대체로 다음 형태로 Hermes를 실행한다.

```bash
uvx --from 'hermes-agent[acp]==<version>' hermes-acp
```

그래서 Zed 경로에서는 `uv`가 PATH에 있어야 한다. 브라우저 도구까지 ACP에서 쓰려면 별도 부트스트랩도 가능하다.

```bash
hermes acp --setup-browser --yes
```

이 명령은 사용자 영역에 Node.js 22 LTS, `agent-browser`, Camofox/Chromium 의존성을 준비하는 idempotent setup이다.

## 짧은 실제 사용 사이드바

이 사용자의 작업 환경에서는 Dev 프로파일이 코드 검토, 빌드 검증, 블로그 자동 발행 같은 기술 작업을 맡고, 실제 결과는 파일 diff와 터미널 로그로 확인한다. ACP는 이런 흐름을 터미널 밖으로 꺼내 에디터 패널에서 추적할 때 유용하다. 특히 “대화는 에디터 안에서, 실행은 Hermes toolset으로”라는 경계를 만들면 코드 변경의 맥락과 승인을 한 화면에 모을 수 있다.

## 흔한 함정과 팁

첫째, ACP는 MCP와 다르다. MCP는 외부 도구 서버를 Hermes에 붙이는 통합이고, ACP는 에디터가 Hermes를 에이전트 서버로 호출하는 통합이다. 둘째, ACP session은 실행 중인 ACP server process 안에서 관리된다. 기본 Hermes의 세션 저장은 계속 쓰이지만, ACP의 list/load/resume/fork 범위는 현재 서버 프로세스에 묶인다.

셋째, 작업 디렉터리가 중요하다. ACP는 에디터의 cwd를 Hermes task ID에 연결해 파일 도구와 터미널 도구가 에디터 워크스페이스 기준으로 실행되게 한다. 에디터에서 잘못된 폴더를 열어 둔 상태로 시작하면 Hermes도 그 폴더를 기준으로 본다. 넷째, 승인 옵션의 범위를 구분해야 한다. `allow_once`는 한 번, `allow_session`은 현재 ACP 세션 동안, `allow_always`는 영구 allowlist에 가깝다. 처음 보는 명령은 한 번만 허용하고, 반복적이고 안전한 명령만 세션 단위로 올리는 편이 좋다.

ACP는 Hermes를 “IDE 안의 또 하나의 채팅봇”으로 만드는 기능이 아니다. 터미널 에이전트의 도구 실행력과 에디터의 코드 맥락·diff·승인 UX를 연결하는 다리다. 단발 자동화나 예약 실행은 CLI·Cron이 낫고, 코드 변경을 보면서 승인하고 싶을 때는 ACP가 가장 자연스러운 입구가 된다.
