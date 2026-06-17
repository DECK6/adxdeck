---
type: article
title: "Hermes Deliverable Mode는 파일 경로를 실제 첨부물로 바꾼다"
aliases:
  - "hermes-deliverable-mode-artifacts"
author:
  - "[[Deck]]"
date created: 2026-06-18
date modified: 2026-06-18
tags: [hermes, ai-agent, workflow, deliverable-mode]
description: "A practical guide to Hermes Agent Deliverable Mode: how generated files become native chat attachments through gateway path scanning, media routing, and safe delivery rules."
thumbnail: images/hermes-deliverable-mode-artifacts-cover.png
status: completed
series: hermes-notes
---

# Hermes Deliverable Mode는 파일 경로를 실제 첨부물로 바꾼다

![Hermes Deliverable Mode cover](images/hermes-deliverable-mode-artifacts-cover.png)

에이전트가 차트, PDF, CSV, 음성 파일을 만들었는데 사용자가 다시 서버에 접속해 경로를 복사해야 한다면 작업 흐름은 끊긴다. Hermes Agent의 Deliverable Mode는 이 문제를 게이트웨이 레벨에서 해결한다. 에이전트가 생성한 파일의 로컬 경로를 답변에 남기면, Telegram·Slack·Discord 같은 메시징 게이트웨이가 그 경로를 감지해 실제 첨부물로 업로드한다.

## 기능 개요 — 답변이 아니라 산출물을 보내는 모드

Deliverable Mode는 별도의 “전송 명령”이라기보다 게이트웨이 후처리 기능이다. 파일을 만드는 쪽은 `execute_code`, `image_generate`, `text_to_speech`, PowerPoint/PDF 관련 skill, 또는 일반 터미널 명령일 수 있다. 핵심은 파일이 디스크에 존재하고, 최종 응답에 절대 경로 또는 `~/` 경로가 평문으로 들어간다는 점이다.

지원 범위는 넓다. `.png`, `.jpg`, `.gif`, `.webp`, `.svg` 같은 이미지는 플랫폼이 허용하면 인라인으로 보이고, `.mp4`, `.mov`, `.webm`은 영상으로 처리된다. `.mp3`, `.wav`, `.ogg`, `.m4a`, `.flac`은 오디오/보이스 전송 후보가 되며, `.pdf`, `.docx`, `.xlsx`, `.csv`, `.json`, `.yaml`, `.pptx`, `.zip`, `.html` 같은 파일은 문서 첨부로 올라간다.

## 어떻게 작동하는가

사용자가 따로 `MEDIA:` 태그를 쓸 필요는 없다. Hermes는 최종 응답을 보낼 때 `gateway/platforms/base.py`의 추출기를 통해 로컬 파일 경로를 찾고, 게이트웨이 전송 루틴에서 이미지·비디오·오디오·문서로 나누어 업로드한다.

```text
분석 차트를 만들었습니다.
/tmp/q3-revenue.png
```

이런 답변이 게이트웨이에 도착하면 `/tmp/q3-revenue.png`는 사용자에게 보이는 문장에서 제거되고, 파일 자체가 첨부된다. 명시적으로 전송하고 싶을 때는 아래처럼 `MEDIA:`를 쓸 수도 있지만, 공식 문서 기준으로는 평문 경로만으로 충분하다.

```text
MEDIA:/tmp/q3-report.pdf
```

Kanban 작업에서도 같은 개념이 이어진다. 워커가 완료 이벤트에 산출물을 넣으면, 구독된 채팅방으로 완료 요약과 파일이 함께 전달된다.

```python
kanban_complete(
    summary="rendered Q3 revenue chart and report",
    artifacts=["/tmp/q3-revenue.png", "/tmp/q3-report.pdf"],
)
```

설정은 `~/.hermes/config.yaml`의 `gateway` 블록에서 조정한다. 개인 단일 사용자 게이트웨이는 기본값으로 충분하지만, 공개 봇처럼 다른 사용자의 프롬프트 주입이 파일 유출로 이어질 수 있는 환경에서는 strict 모드와 허용 디렉터리를 명시하는 편이 안전하다.

```yaml
gateway:
  strict: true
  media_delivery_allow_dirs:
    - ~/deliverables
  trust_recent_files: true
  trust_recent_files_seconds: 600
```

## 실제 사용 사이드바

이 사용자의 Hermes 운영에서는 블로그 커버 이미지, 음성 메모, 분석 결과처럼 “텍스트보다 파일이 결과물인 작업”이 자주 생긴다. 특히 Dev와 PKM 프로파일을 나누어 쓰는 구조에서는 작업 로그에는 경로를 남기고, 게이트웨이에서는 같은 산출물을 첨부로 받는 흐름이 유용하다. 로컬 확인 결과 Dev 프로파일은 게이트웨이 미디어 전송의 recency trust가 켜져 있고, Kanban dispatcher도 게이트웨이 안에서 동작하도록 설정되어 있다.

## 팁과 함정

첫째, 코드 예시 안의 경로는 자동 첨부되지 않는다. Hermes는 fenced code block과 inline code 안의 경로를 보호해서 예제 코드가 잘려 나가지 않게 한다. 둘째, 파일이 실제로 존재하지 않으면 첨부는 조용히 건너뛴다. “파일을 만들었다”는 말보다 `file`, `ls`, 빌드 로그 등으로 산출물 존재를 확인하는 습관이 중요하다.

셋째, 오래된 시스템 파일이나 자격 증명 경로를 첨부 대상으로 삼으면 안전 필터에 막힌다. 로컬 구현은 홈 아래 `.ssh`, `.aws`, `.gnupg`, Hermes의 `.env`와 `auth.json`, `/etc`, `/proc` 같은 경로를 거부한다. 넷째, Telegram에서는 오디오 확장자별로 보이스/오디오 전송 제약이 다를 수 있다. 음성 버블이 필요하면 `text_to_speech`처럼 해당 플랫폼 규칙을 아는 도구를 쓰는 편이 낫다.

## 언제 쓰면 좋은가

Deliverable Mode는 “대화로 설명”보다 “파일로 받기”가 자연스러운 결과에 맞다. 차트, 표 데이터, 보고서, 이미지, 음성, 압축본은 이 기능을 쓰면 사용자가 바로 저장하고 전달할 수 있다. 반대로 짧은 코드 조각이나 설정 예시는 첨부 파일보다 코드 블록이 안전하다. 산출물이 여러 단계의 장기 작업이라면 Kanban의 `artifacts`와 함께 쓰고, 단순한 한 번짜리 생성물이라면 최종 응답에 경로를 남기는 방식이면 충분하다.
