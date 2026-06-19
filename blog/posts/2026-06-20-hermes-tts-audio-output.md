---
type: article
title: "Hermes TTS는 답변을 실행 가능한 음성 산출물로 바꾼다"
aliases:
  - "hermes-tts-audio-output"
author:
  - "Deck"
date created: 2026-06-20
date modified: 2026-06-20
tags: [hermes, ai-agent, workflow, tts]
description: "A feature guide to Hermes Agent Text-to-Speech: providers, config keys, delivery formats, custom command providers, and common audio pitfalls."
thumbnail: images/hermes-tts-audio-output-cover.png
status: completed
series: hermes-notes
---

# Hermes TTS는 답변을 실행 가능한 음성 산출물로 바꾼다

![Hermes TTS cover](images/hermes-tts-audio-output-cover.png)

텍스트 답변은 읽어야 한다. 하지만 이동 중 알림, 긴 보고서의 청취 버전, Telegram voice bubble처럼 “파일이 아니라 말소리”로 받아야 하는 순간에는 텍스트가 병목이 된다. **Hermes Text-to-Speech(TTS)**는 에이전트의 답변이나 임의의 텍스트를 오디오 산출물로 렌더링하고, 플랫폼에 맞는 형식으로 전달하는 기능이다.

## 기능 개요 — provider, delivery, tool

Hermes의 TTS는 Voice Mode 안의 부품이면서 독립 도구이기도 하다. CLI에서는 `/voice tts`로 답변 낭독을 켤 수 있고, 도구 호출에서는 `text_to_speech`가 텍스트를 MP3/OGG/WAV 같은 파일로 만든다. Gateway에서는 Telegram은 voice bubble, Discord는 Opus/OGG 또는 첨부 파일, WhatsApp은 오디오 첨부처럼 플랫폼별 전달 방식이 달라진다.

공식 문서 기준 기본 provider는 `edge`다. 별도 API key 없이 시작할 수 있고, 품질이나 언어·목소리 요구가 커지면 ElevenLabs, OpenAI, MiniMax, Mistral, Gemini, xAI, NeuTTS, KittenTTS, Piper로 바꿀 수 있다. 핵심은 “TTS 기능”과 “TTS backend”를 분리해 두었다는 점이다. 같은 `text_to_speech` 호출이라도 `tts.provider` 설정에 따라 로컬 엔진, 클라우드 API, 구독형 Tool Gateway, 커스텀 명령으로 라우팅된다.

## 어떻게 설정하고 쓰는가

기본 설정 위치는 `~/.hermes/config.yaml`의 `tts:` 블록이다. 이번 로컬 확인에서는 Dev profile이 `edge` provider와 `en-US-AriaNeural` voice를 쓰고 있었고, `ffmpeg`도 설치되어 있었다. 간단한 smoke test는 `text_to_speech` 도구로 MP3를 생성해 통과했다.

```yaml
tts:
  provider: edge
  speed: 1.0
  edge:
    voice: en-US-AriaNeural
  openai:
    model: gpt-4o-mini-tts
    voice: alloy
  gemini:
    model: gemini-2.5-flash-preview-tts
    voice: Kore
    audio_tags: false
```

대화형 CLI에서는 음성 출력만 켤 수 있다.

```text
/voice tts
/voice status
```

자동화에서는 도구를 직접 쓴다. 긴 텍스트는 provider별 한도에 맞춰 Hermes가 잘라 보내며, 예를 들어 OpenAI는 기본 4096자, xAI는 15000자, Gemini는 32000자, Edge는 5000자 기준이다. provider별로 `max_text_length`를 지정해 보수적으로 낮출 수도 있다.

```yaml
tts:
  provider: piper
  piper:
    voice: en_US-lessac-medium
```

지원 목록에 없는 엔진도 붙일 수 있다. `tts.providers.<name>` 아래에 command provider를 선언하면 Hermes가 입력 텍스트를 임시 파일에 쓰고, 명령이 만든 오디오를 읽어 전달한다.

```yaml
tts:
  provider: my-local-voice
  providers:
    my-local-voice:
      command: "my-tts --text-file {input_path} --out {output_path}"
      output_format: mp3
      timeout: 120
      voice_compatible: true
```

## 실제 운용에서의 짧은 장면

이 사용자의 Hermes 운영에서는 텍스트 보고가 기본이지만, TTS는 “최종 답변을 파일 산출물로 넘기는” 계층과 잘 맞물린다. 예를 들어 예약 작업이 요약을 만든 뒤 메시징 플랫폼으로 전달할 때, 같은 원고를 읽을 수 있는 텍스트와 들을 수 있는 오디오로 나누어 보낼 수 있다. 개발 profile에서는 기본 Edge TTS로 빠르게 smoke test를 돌리고, 필요할 때 provider를 교체하는 식의 검증 흐름이 안전하다.

## Pitfalls / tips

첫째, Telegram voice bubble은 단순 MP3와 다르다. Edge, MiniMax, Gemini, xAI, 로컬 엔진이 만든 오디오는 보통 `ffmpeg` 변환이 필요하다. `ffmpeg`가 없으면 실패가 아니라 “일반 오디오 첨부”로 내려갈 수 있으니, 말풍선 UI가 꼭 필요하면 시스템 의존성을 먼저 확인해야 한다.

둘째, API key 이름이 provider마다 다르다. ElevenLabs는 `ELEVENLABS_API_KEY`, OpenAI 음성은 `VOICE_TOOLS_OPENAI_KEY`, Gemini는 `GEMINI_API_KEY`, xAI는 `XAI_API_KEY`를 본다. Nous Portal 구독자는 Tool Gateway 경로로 OpenAI TTS를 쓸 수 있지만, 이 경우도 실제 profile의 provider 라우팅을 확인해야 한다.

셋째, command provider는 강력하지만 로컬 shell 명령이다. placeholder 값은 Hermes가 quote하지만 명령 템플릿 자체는 신뢰된 로컬 설정으로 취급된다. timeout, 출력 형식, voice bubble 호환 여부를 명시해 두면 디버깅이 쉬워진다.

TTS는 “대화 자체를 음성으로 바꾸는” Voice Mode와 겹치지만 목적이 더 좁고 명확하다. 실시간 대화를 하고 싶으면 Voice Mode를 쓰고, 텍스트 결과를 오디오 산출물로 렌더링해 저장·전달·자동화하려면 TTS를 직접 쓰면 된다.
