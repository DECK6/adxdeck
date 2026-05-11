---
type: article
title: "Hermes Gateway Topic Routing: 여러 플랫폼의 대화를 작업 경계로 바꾸는 법"
aliases:
  - "Hermes Gateway Topic Routing"
description: "Explains how the Hermes Agent gateway turns messaging platforms, topics, and mention rules into safer routing boundaries. Use this article to design quieter multi-agent conversations across chat surfaces."
author:
  - "[[Deck]]"
date created: 2026-05-11
date modified: 2026-05-11
tags:
  - article
  - hermes
  - ai-agent
  - workflow
series: hermes-notes
thumbnail: images/2026-05-11-hermes-gateway-topic-routing-cover.png
status: completed
published: true
publishedAt: 2026-05-11
publishSlug: "hermes-gateway-topic-routing"
featureTopic: "Gateway and topic routing"
officialDocs:
  - "https://hermes-agent.nousresearch.com/docs/user-guide/messaging/"
localChecks:
  - "hermes gateway --help"
  - "hermes gateway status"
publicSafetyStatus: reviewed
---

# Hermes Gateway Topic Routing: 여러 플랫폼의 대화를 작업 경계로 바꾸는 법

![Abstract cover for Hermes gateway topic routing](images/2026-05-11-hermes-gateway-topic-routing-cover.png)

## Lede

AI 에이전트가 터미널 안에만 있을 때는 대화의 경계가 비교적 단순하다. 한 사람이 한 창에 요청을 입력하고, 에이전트가 그 세션 안에서 답한다. 하지만 Telegram, Discord, Slack, WhatsApp, Signal, Matrix, Email 같은 메시징 표면으로 에이전트가 들어오면 상황이 달라진다. 같은 사람이 여러 공간에서 부르고, 여러 봇이 같은 메시지를 볼 수 있으며, 자동화 알림과 사람의 지시가 한 타임라인에 섞인다.

Hermes Gateway는 이 메시징 표면을 단순한 채팅 연결이 아니라 작업 입구로 다룬다. `hermes gateway setup`, `hermes gateway run`, `hermes gateway status` 같은 명령은 플랫폼 연결과 실행 상태를 관리하고, Gateway는 들어온 메시지를 프로필, 세션, topic 또는 thread의 맥락으로 라우팅한다. 그래서 중요한 질문은 “어디서 대화할 수 있는가”가 아니라 “어떤 대화가 어떤 에이전트의 일로 해석되는가”가 된다.

## 개념

Gateway의 핵심은 멀티 플랫폼 접근성보다 경계 설계에 있다. 메시징 앱은 사람에게 익숙한 인터페이스지만, 에이전트에게는 입력 채널이다. 채널과 topic, thread를 작업 맥락으로 해석하면 한 플랫폼 안에서도 일반 대화, 지식 정리, 개발 요청, 운영 알림을 서로 다른 흐름으로 나눌 수 있다. 이렇게 나눠야 에이전트가 모든 메시지를 자기 일로 오해하지 않는다.

특히 여러 에이전트가 같은 플랫폼에 연결될 때는 mention rule이 안전장치가 된다. 호출받지 않은 봇은 기다리고, 실제 사람의 지시와 bot-to-bot 조율 메시지를 구분해야 한다. 이 원칙이 없으면 한 봇의 상태 보고가 다른 봇의 새 작업으로 오해되고, 다시 그 응답이 또 다른 봇을 깨우는 echo loop가 생긴다. Gateway topic routing은 말을 더 많이 하게 만드는 장치가 아니라, 말해야 할 때와 침묵해야 할 때를 가르는 장치다.

## 사용법

먼저 플랫폼 연결은 Gateway 명령 표면에서 점검한다. `hermes gateway setup`은 연결 설정의 출발점이고, `hermes gateway run` 또는 background service는 Gateway를 실행한다. 운영 중에는 `hermes gateway status`로 상태를 확인한다. 공개 글이나 팀 문서에는 bot token, 실제 channel ID, 내부 account 값 같은 식별자를 남기지 않는 편이 안전하다. 필요한 것은 값 자체가 아니라 어떤 표면이 어떤 역할로 라우팅되는지에 대한 규칙이다.

그 다음 topic 또는 thread를 역할별 회의실처럼 설계한다. 넓은 대화 공간은 최종 질문과 응답을 위한 곳으로 두고, 지식 정리, 개발, 운영 알림 같은 흐름은 별도의 topic 또는 thread로 나눈다. 각 공간에는 응답 가능한 프로필, 반드시 mention이 필요한지, bot 메시지를 어떻게 취급할지, 완료 보고 형식을 정한다. 이 규칙은 코드보다 문서가 먼저다. 사람이 읽어도 “이 메시지는 누가 처리해야 하는가”를 알 수 있어야 한다.

## 짧은 사이드바

한 운영 사례에서는 여러 역할의 봇이 같은 메시징 플랫폼에 들어오면서 소음이 먼저 늘어났다. 해결책은 더 강한 모델이 아니라 더 단순한 출입 규칙이었다. 실제 사람의 직접 지시만 새 작업으로 보고, 다른 봇의 요약이나 알림은 명시적 위임이 없는 한 맥락으로만 취급했다. 그 뒤부터 멀티봇 대화는 합창이 아니라 회의실 운영에 가까워졌다.

## Pitfalls

첫 번째 함정은 topic을 이름표로만 쓰는 것이다. topic이 라우팅 규칙과 연결되지 않으면 예쁜 폴더일 뿐이다. 두 번째 함정은 bot 메시지를 사람의 지시와 같은 무게로 처리하는 것이다. 이는 echo loop와 role drift의 가장 빠른 원인이다. 세 번째 함정은 공개 문서에 실제 식별자를 남기는 것이다. topic 번호나 channel 값 자체보다 중요한 것은 역할, mention rule, handoff 형식이다.

## 클로징

Hermes Gateway를 잘 쓰면 메시징 앱은 단순한 원격 채팅창이 아니라 작업 경계가 된다. 어디서든 에이전트를 부를 수 있다는 장점은, 어디서든 아무 봇이나 깨어나도 된다는 뜻이 아니다. 좋은 Gateway 설계는 필요한 메시지를 정확한 프로필에게 보내고, 나머지 에이전트가 조용히 기다리게 만든다. 멀티 플랫폼 운영의 성숙도는 연결 수가 아니라 라우팅의 침묵에서 드러난다.
