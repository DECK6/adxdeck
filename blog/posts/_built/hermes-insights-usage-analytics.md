---
type: article
track: ai-ax
title: "Hermes Insights는 에이전트 운영을 사용 기록으로 보여 준다"
aliases:
  - "Hermes Insights Usage Analytics"
author:
  - "Deck"
date created: 2026-07-24
date modified: 2026-07-24
tags:
  - hermes
  - ai-agent
  - workflow
  - insights
description: "Hermes Insights turns local session history into token, model, platform, tool, skill, and activity summaries. This guide explains its filters, data source, privacy boundary, and the difference from live usage and billing records."
thumbnail: images/hermes-insights-usage-analytics-cover.png
status: completed
series: hermes-notes
---

# Hermes Insights는 에이전트 운영을 사용 기록으로 보여 준다

![Hermes Insights usage analytics cover](images/hermes-insights-usage-analytics-cover.png)

에이전트를 오래 켜 두면 사용량을 감으로 판단하기 쉽다. 어떤 모델을 자주 썼는지, 도구 호출이 어디에 몰렸는지, CLI와 메신저 중 어느 쪽의 세션이 많은지 기억만으로는 맞히기 어렵다. `hermes insights`는 로컬 세션 기록을 읽어 이 흐름을 한 번에 요약한다.

이 기능은 실시간 모니터나 청구서가 아니다. 이미 저장된 세션을 기간과 실행 표면별로 집계해 운영 습관을 돌아보게 하는 읽기 전용 보고서다.

## 한 명령이 읽는 것

Hermes는 기본적으로 대화와 tool call을 `~/.hermes/state.db`에 저장한다. 이름 있는 profile을 쓰면 해당 profile의 `state.db`가 분석 대상이 된다. Insights에는 별도 설정 블록이 없으며, 현재 실행한 Hermes profile의 세션 저장소를 그대로 읽는다.

기본 기간은 최근 30일이다. 보고서에는 세션·메시지·토큰·tool call 합계, 모델과 플랫폼 분포, 많이 호출한 도구와 skill, 요일·시간대별 활동, 눈에 띄는 세션이 포함된다. 엔진 내부는 모델별 비용 상태도 계산하지만 현재 CLI 표는 토큰과 사용 패턴을 중심으로 보여 준다. 비용 값이 보이는 버전에서도 provider 청구 내역을 대신할 수는 없다. 구독형 계정, 로컬 모델, 알 수 없는 가격표는 실제 결제액과 다르게 계산되거나 비용 집계에서 빠질 수 있다.

```bash
hermes insights
hermes insights --days 7
hermes insights --days 30 --source telegram
```

`--days`는 시작 시각이 범위 안에 들어온 세션만 고른다. `--source`는 `cli`, `telegram`, `discord`, `cron` 같은 session source를 정확히 필터링한다. 여러 profile의 기록을 자동으로 합치지는 않으므로 비교하려면 각 profile에서 같은 조건으로 실행해야 한다.

대화 안에서도 짧게 확인할 수 있다.

```text
/insights 7
```

CLI 출력은 넓은 표와 활동 차트를 사용하고, 메신저의 `/insights`는 작은 화면에 맞춘 요약을 돌려준다. 둘 다 새 모델 호출로 분석문을 쓰는 방식이 아니라 SQLite 기록을 집계한다.

## 숫자가 만들어지는 방식

토큰과 메시지 수는 세션 행의 누적값에서 합산한다. 도구 사용량은 tool 응답의 이름과 assistant 메시지에 남은 `tool_calls`를 함께 살펴본다. 두 기록이 겹치면 큰 값을 택해 같은 호출을 두 번 세지 않는다. skill 통계는 `skill_view`와 `skill_manage` 호출에서 이름을 읽어 load와 edit를 구분한다.

활동 시간은 세션의 시작 시각을 로컬 시간대로 바꿔 요일과 시간대별로 묶는다. "가장 긴 세션", "메시지가 가장 많은 세션", "tool call이 많은 세션" 같은 항목도 여기서 나온다. 보고서는 메시지 본문을 그대로 출력하지 않지만 model, platform, tool·skill 이름과 축약된 session id는 보여 줄 수 있다. 화면을 외부에 공유하기 전에는 이 정보도 확인해야 한다.

## 실제 사용 사이드바

한 운영 환경에서는 대화형 CLI, 메신저, 예약 작업을 서로 다른 session source로 남긴다. 전체 30일 보고서로 큰 흐름을 본 뒤 `--source cron`을 붙이면 자동화 작업이 tool call을 얼마나 쓰는지 따로 확인할 수 있다. 결과를 보고 기능을 바로 끄기보다, 예상보다 자주 호출된 도구가 원래 맡긴 일과 맞는지 실제 세션에서 다시 확인한다.

## 함정과 선택 기준

보고서가 비어 있으면 먼저 기간을 넓히고 `hermes sessions stats`로 현재 profile의 저장소에 세션이 있는지 본다. 메신저 기록만 보이지 않는다면 source 이름과 profile을 확인한다. 저장소 자체가 비정상이라면 `hermes sessions repair`가 진단 경로다.

토큰이 많다는 이유만으로 낭비라고 결론 내리면 곤란하다. 긴 context, cache read, image·tool 사용은 비슷한 숫자여도 비용과 목적이 다르다. Insights에서 낯선 패턴을 발견했다면 `session_search`나 세션 목록으로 돌아가 실제 작업을 확인한다.

현재 대화의 context와 비용만 보고 싶다면 `/usage`가 더 빠르다. 저장된 세션 수와 DB 크기는 `hermes sessions stats`, 과거 대화의 내용 검색은 `session_search`가 맡는다. 며칠 또는 몇 주의 모델·플랫폼·도구 사용 패턴을 비교할 때 Insights를 쓰는 것이 맞다.
