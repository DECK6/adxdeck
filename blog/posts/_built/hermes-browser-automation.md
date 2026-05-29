---
type: article
title: "Hermes Browser Automation은 웹페이지를 읽고 조작 가능한 작업장으로 바꾼다"
aliases:
  - hermes-browser-automation
author:
  - "[[육대근]]"
date created: 2026-05-30
date modified: 2026-05-30
tags: [hermes, ai-agent, workflow, browser]
description: A practical guide to Hermes Agent browser automation, including backend choices, accessibility snapshots, CDP connection, private URL routing, and safety tips.
thumbnail: images/hermes-browser-automation-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-browser-automation-cover.png)

Hermes Agent의 Browser Automation은 “웹사이트를 대신 열어 본다”보다 넓은 기능이다. 에이전트가 페이지 구조를 읽고, 버튼과 입력칸을 식별하고, 필요한 경우 스크린샷까지 해석해 웹을 실제 작업 표면으로 쓰게 만드는 장치다. 문제는 간단하다. 많은 업무가 API가 아니라 로그인된 관리자 화면, 검색 결과, 폼, 로컬 개발 서버 안에 남아 있다. Browser toolset은 그 간극을 메운다.

## 기능 개요 — 브라우저를 도구로 다루는 방식

Hermes의 브라우저 기능은 여러 backend를 지원한다. Browserbase, Browser Use, Firecrawl 같은 cloud browser를 붙일 수 있고, Camofox로 로컬 anti-detection 브라우징을 구성할 수 있으며, Chrome·Brave·Chromium·Edge 같은 로컬 Chromium 계열 브라우저에는 CDP로 연결할 수 있다. Nous Portal 사용자는 별도 키 없이 Tool Gateway 경유로 브라우저 자동화를 켤 수도 있다.

에이전트가 보는 기본 단위는 화면 픽셀만이 아니라 accessibility tree다. `browser_snapshot`은 페이지의 텍스트 구조와 클릭 가능한 요소를 `@e1`, `@e2` 같은 ref id로 보여 준다. 그래서 에이전트는 좌표를 추측하기보다 “검색창 ref에 입력하고, 제출 버튼 ref를 누른다”는 식으로 안정적으로 조작한다. 시각 정보가 필요할 때는 `browser_vision`이 스크린샷을 분석한다.

## 어떻게 작동하나

가장 먼저 browser toolset을 켜고 backend를 정한다.

```bash
hermes tools enable browser
hermes setup tools
# Browser Automation → Nous Subscription / Browserbase / Firecrawl / Camofox / Local
```

cloud backend를 쓰려면 `.env`에 해당 credential을 둔다. 예를 들어 Browserbase는 다음 두 값이 필요하다.

```bash
BROWSERBASE_API_KEY=***
BROWSERBASE_PROJECT_ID=your-project-id-here
```

로컬 Chromium을 직접 붙일 때는 대화 안에서 CDP 연결을 연다.

```text
/browser connect
/browser disconnect
```

설정은 `~/.hermes/config.yaml`의 `browser` 블록에서 조정한다. 이 환경의 dev profile도 `browser` toolset이 enabled 상태이고, local/private URL 자동 라우팅과 dialog 안전 정책이 기본값으로 들어 있다.

```yaml
browser:
  inactivity_timeout: 120
  command_timeout: 30
  allow_private_urls: false
  auto_local_for_private_urls: true
  dialog_policy: must_respond
  dialog_timeout_s: 300
  camofox:
    managed_persistence: false
```

특히 `auto_local_for_private_urls`가 중요하다. cloud provider를 쓰더라도 `localhost`, `127.0.0.1`, 사설망 주소로 가는 요청은 로컬 Chromium sidecar로 보내고, 공개 URL은 cloud backend로 보낼 수 있다. 개발 중인 대시보드는 로컬에서 보고, 외부 문서는 cloud browser로 여는 식의 혼합 흐름이 가능하다.

## 실제 사용 사이드바

이 사용자의 Hermes 운영에서는 Dev profile이 브라우저 도구를 켠 상태로 유지되어, 웹 문서 확인과 로컬 개발 화면 검증을 같은 작업 루프 안에서 처리할 수 있다. 다만 개인 운영 사건 자체를 글의 중심에 두지는 않는다. 여기서 중요한 사례는 “프로파일별로 browser 설정을 분리하고, 필요할 때만 실제 페이지 조작까지 허용한다”는 운영 패턴이다.

## Pitfalls / tips

- 브라우저 자동화는 web search와 다르다. 검색·추출이면 `web` toolset이 가볍고, 클릭·폼·로그인된 화면·스크린샷 검증이면 `browser`가 맞다.
- cloud browser는 로컬 네트워크에 직접 접근하지 못한다. private URL 자동 라우팅을 끄면 내부 주소가 차단되거나 도달하지 못할 수 있다.
- Camofox persistence는 `browser.camofox.managed_persistence` 아래에 둬야 한다. top-level `managed_persistence`는 무시된다.
- native dialog는 페이지를 멈출 수 있다. CDP backend에서는 supervisor가 dialog 상태를 snapshot에 노출하고, 기본 정책은 명시 응답을 기다리는 `must_respond`다.
- CAPTCHA, 2FA, 결제, 권한 프롬프트는 자동으로 넘기지 않는 것이 안전하다. Hermes는 도구를 갖고 있어도 사용자의 명시적 지시와 안전 경계를 따라야 한다.

마무리하면, Browser Automation은 웹을 “읽을 자료”가 아니라 “조작 가능한 인터페이스”로 다뤄야 할 때 꺼내는 기능이다. API가 있으면 API나 MCP가 더 안정적이다. 하지만 실제 업무가 브라우저 안에만 존재한다면, Hermes의 browser toolset은 에이전트를 관찰자에서 실행자로 바꿔 준다.
