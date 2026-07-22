---
type: article
track: ai-ax
title: "Hermes send는 LLM 없이 스크립트 출력을 메신저로 보낸다"
aliases:
  - "Hermes Send Script Output Delivery"
author:
  - "Deck"
date created: 2026-07-23
date modified: 2026-07-23
tags:
  - hermes
  - ai-agent
  - workflow
  - messaging
description: "Hermes send delivers script output to configured messaging platforms without starting an LLM or agent loop. This guide covers target discovery, stdin and file input, exit codes, and when to use Cron instead."
thumbnail: images/hermes-send-script-output-delivery-cover.png
status: completed
series: hermes-notes
---

# Hermes send는 LLM 없이 스크립트 출력을 메신저로 보낸다

![Hermes send script output delivery cover](images/hermes-send-script-output-delivery-cover.png)

셸 스크립트가 끝난 뒤 결과 한 줄을 Telegram이나 Slack으로 보내려면 보통 플랫폼마다 API 호출을 따로 작성해야 한다. `hermes send`는 이미 설정된 Hermes 메시징 연결을 재사용해 문자열, 표준 입력, 텍스트 파일을 지정한 채널로 보낸다. 이 과정에서는 모델도 에이전트 루프도 시작되지 않는다.

이 명령이 해결하는 문제는 단순하다. 판단은 이미 스크립트가 끝냈고, 남은 일은 결과를 옮기는 것뿐일 때 플랫폼별 전송 코드를 다시 만들지 않아도 된다.

## 기능 개요: 에이전트 없는 전달 경로

`hermes send`는 Gateway와 같은 플랫폼 어댑터를 쓰는 독립 CLI다. `~/.hermes/.env`의 자격 증명과 `~/.hermes/config.yaml`의 메시징 설정을 읽지만, 별도의 `send:` 설정 블록은 두지 않는다. Telegram, Discord, Slack처럼 bot token으로 전송하는 플랫폼은 대개 Gateway가 꺼져 있어도 REST endpoint로 바로 보낼 수 있다. 지속 연결을 쓰는 plugin 플랫폼은 실행 중인 Gateway가 필요할 수 있다.

대상은 `platform`, `platform:chat_id`, `platform:chat_id:thread_id`, `platform:#channel` 형식으로 쓴다. 플랫폼 이름만 주면 설정된 home channel을 사용한다. 사람이 읽는 채널 이름은 `~/.hermes/channel_directory.json`에서 찾는다. 이 파일은 Gateway가 채널을 발견할 때 갱신하므로 먼저 목록을 확인하는 편이 안전하다.

```bash
hermes send --list
hermes send --list telegram
hermes send --list --json
```

`--list`는 메시지를 보내지 않는다. 사람이 읽는 목록이나 JSON을 출력할 뿐이라 자동화 스크립트의 사전 점검에도 쓸 수 있다. 이름으로 채널을 지정해야 한다면 Gateway를 한 번 실행해 directory를 채운 뒤 `--list --json` 결과에서 대상이 실제로 보이는지 확인한다. 숫자 ID를 스크립트 여러 곳에 복사하는 것보다 채널 이름과 공용 directory를 쓰는 쪽이 변경에 덜 취약하다.

## 문자열, 파일, 파이프를 보내는 법

가장 짧은 호출은 대상과 문자열을 함께 주는 방식이다.

```bash
hermes send --to telegram "build completed"
```

이미 다른 명령이 결과를 출력한다면 표준 입력을 연결한다. `--subject`는 본문 앞에 제목 줄을 붙인다.

```bash
printf '%s\n' "tests: 148 passed" \
  | hermes send --to slack:#builds --subject "CI result"
```

로그나 Markdown처럼 텍스트 파일에 결과가 있다면 `--file`을 쓴다.

```bash
hermes send --to discord:#ops --file ./report.md
```

메시지 본문은 위치 인자, `--file`, piped stdin 순서로 결정된다. 여러 입력을 함께 주면 앞선 항목이 뒤의 항목을 덮으므로 한 방식만 고르는 편이 분명하다. 입력이 없고 stdin이 TTY라면 기다리며 멈추지 않고 사용 오류를 반환한다. `--subject`는 플랫폼별 제목 metadata가 아니라 본문 첫 줄을 붙이는 기능이다. `--quiet`는 성공 시 stdout을 비우고 exit code만 남긴다. `--json`은 플랫폼 응답을 기계가 읽을 수 있는 형태로 내보낸다.

```bash
run_checks | hermes send --to telegram --quiet
case $? in
  0) echo "delivered" ;;
  1) echo "delivery failed" >&2 ;;
  2) echo "usage or config error" >&2 ;;
esac
```

## 실제 사용 사이드바

한 사용자의 셋업에서는 지식 작업, 개발, 운영이 서로 다른 profile과 메시징 topic으로 나뉘고, 긴 빌드와 발행은 추적 가능한 background 작업으로 실행된다. 모델이 조사하고 작성해야 하는 보고서는 Cron의 `deliver`가 맡고, 테스트 프로세스가 이미 만든 완료·실패 문자열은 `hermes send`로 바로 보낼 수 있으며, 이미지나 문서 산출물은 별도의 첨부 경로로 다룬다. 전송 명령의 exit code도 원래 실행 로그에 남겨 작업 성공과 알림 성공을 따로 확인하고, 알림 target은 해당 역할의 topic으로 고정해 다른 대화에 섞이지 않게 한다. 이런 분리는 단순 알림 때문에 새 agent session을 열거나 작업 topic에 중간 로그가 계속 쌓이는 일을 줄이고, 사람이 새 지시를 보낼 대화창도 비워 둔다.

## 함정과 선택 기준

`--file`은 텍스트 본문을 읽는 옵션이다. 이미지나 문서를 첨부할 때는 현재 CLI 도움말에 나온 `MEDIA:<path>` 형식을 사용하고, 실제 파일이 존재하는지 먼저 확인한다. 알림 내용에 token이나 개인 정보를 넣으면 그대로 외부 플랫폼에 전송된다. 짧은 문자열은 shell history에도 남을 수 있으므로 민감한 본문은 권한을 제한한 파일이나 stdin으로 넘긴다.

채널 이름이 목록에 없으면 Gateway를 한 번 실행해 `channel_directory.json`을 갱신한다. 대상 형식이나 설정 오류는 exit code 2, 플랫폼 인증·권한·네트워크 실패는 1이므로 자동화에서는 반드시 분기한다.

메모리 부족이나 디스크 고갈처럼 Python 자체가 뜨지 못할 수 있는 경보는 최소한의 `curl` 경로를 따로 두는 편이 낫다. `hermes send`는 내용을 요약하거나 다음 행동을 판단하지 않는다. 정해진 문자열을 지금 보내는 일에는 `send`, 정해진 시간에 모델이 내용을 만들어야 하는 일에는 Cron, 살아 있는 대화를 다른 플랫폼에서 이어야 하는 일에는 Session Handoff가 맞다.
