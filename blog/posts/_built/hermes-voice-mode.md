---
type: article
title: "Hermes Voice Mode는 채팅을 말하는 작업 루프로 바꾼다"
aliases:
  - hermes-voice-mode
author:
  - "[[육대근]]"
date created: 2026-05-24
date modified: 2026-05-24
tags:
  - hermes
  - ai-agent
  - workflow
  - voice
description: A practical guide to Hermes Agent Voice Mode, including CLI push-to-talk, gateway voice replies, Discord voice channels, STT/TTS providers, configuration, and common troubleshooting paths.
thumbnail: images/hermes-voice-mode-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-voice-mode-cover.png)

Hermes Agent의 Voice Mode는 에이전트와의 대화를 “타이핑하는 채팅”에서 “말하고 듣는 작업 루프”로 바꾼다. 해결하는 문제는 명확하다. 손이 코드를 치고 있거나, 휴대폰으로 빠르게 지시해야 하거나, Discord 음성 채널에서 같이 회의하듯 에이전트를 써야 할 때 텍스트 입력이 병목이 되지 않게 한다.

## 기능 개요 — STT, TTS, 세 가지 표면

Voice Mode는 한 기능처럼 보이지만 내부적으로는 STT와 TTS의 조합이다. STT는 사용자의 음성을 텍스트로 바꿔 일반 Hermes 대화 파이프라인에 넣고, TTS는 에이전트의 답을 다시 오디오로 만든다. 공식 문서 기준으로 Hermes는 CLI 마이크 루프, Telegram/Discord 음성 답장, Discord voice channel 봇이라는 세 가지 사용 표면을 제공한다.

CLI에서는 `Ctrl+B`로 녹음을 시작하고, Hermes가 침묵을 감지해 자동으로 녹음을 멈춘 뒤 Whisper 계열 STT로 전사한다. Gateway에서는 사용자가 보낸 voice message에 답하거나 모든 답변을 음성으로 보낼 수 있다. Discord VC 모드에서는 봇이 음성 채널에 들어가 사용자 발화를 듣고, 전사한 뒤, 일반 agent loop를 실행하고, 결과를 다시 말한다.

## 어떻게 작동하나

가장 먼저 텍스트 Hermes가 정상 동작해야 한다.

```bash
hermes
```

CLI 안에서는 다음 명령으로 켠다.

```text
/voice on
/voice tts
/voice status
/voice off
```

설정은 `~/.hermes/config.yaml`의 `voice`, `stt`, `tts` 블록이 담당한다. 로컬 설치에서도 기본값은 `ctrl+b`, local STT, Edge TTS 조합으로 확인된다.

```yaml
voice:
  record_key: "ctrl+b"
  max_recording_seconds: 120
  auto_tts: false
  beep_enabled: true
  silence_threshold: 200
  silence_duration: 3.0

stt:
  enabled: true
  provider: "local"
  local:
    model: "base"

tts:
  provider: "edge"
  edge:
    voice: "en-US-AriaNeural"
```

설치 쪽에서는 용도에 맞춰 extras와 시스템 패키지를 추가한다.

```bash
pip install "hermes-agent[voice]"
pip install "hermes-agent[messaging]"
pip install "hermes-agent[tts-premium]"
```

macOS에서는 `portaudio`, `ffmpeg`, `opus`가 중요하고, NeuTTS를 쓰려면 `espeak-ng`도 필요하다.

```bash
brew install portaudio ffmpeg opus
brew install espeak-ng
```

Provider 선택은 비용과 지연의 균형이다. STT는 local, Groq, OpenAI를 쓸 수 있고 local은 API key가 필요 없다. TTS는 Edge, ElevenLabs, OpenAI, NeuTTS, MiniMax 계열을 선택할 수 있으며 Edge와 NeuTTS는 key 없이 시작하기 좋다. `text_to_speech` 도구 자체는 `tts` toolset에 속해 있어, 단순히 텍스트를 오디오 파일로 렌더링하는 자동화에도 재사용된다.

Gateway에서는 텍스트 채널이나 DM에서 같은 slash command를 쓴다.

```text
/voice on   # voice message에만 음성 답장
/voice tts  # 모든 답변을 음성으로
```

Discord 음성 채널은 한 단계 더 복잡하다.

```text
/voice join
/voice leave
/voice status
```

이때 봇에는 Connect, Speak 권한과 Opus codec, `DISCORD_ALLOWED_USERS` 접근 제어가 필요하다. 음성 채널에서 나온 전사는 연결된 텍스트 채널에도 남아 디버깅과 회고가 가능하다.

## 짧은 실제 사용 사이드바

이 사용자의 운영에서는 Voice Mode를 모든 작업의 기본 입력 방식으로 두기보다, 이동 중 아이디어 캡처나 긴 설명을 빠르게 넘길 때의 보조 인터페이스로 보는 편이 안전하다. Dev/PKM/Ops처럼 작업 경계가 나뉜 환경에서는 음성 입력도 결국 해당 프로파일의 도구 권한과 세션 정책 안에서 실행된다. 그래서 “말로 지시한다”는 경험은 가벼워도, 실제 실행은 기존 Hermes의 toolset, memory, gateway 규칙을 그대로 따른다.

## Pitfalls / tips

첫째, 오디오는 LLM 문제처럼 보여도 대개 시스템 의존성 문제다. “No audio device found”는 PortAudio부터 확인하고, “전사는 되는데 말하지 않는다”는 TTS provider, quota, `ffmpeg` 변환 경로를 확인한다.

둘째, Whisper는 침묵이나 배경 소음에서 환각 문장을 만들 수 있다. Hermes는 알려진 반복 문구를 필터링하지만, 그래도 문제가 생기면 더 조용한 환경, 높은 `silence_threshold`, 다른 STT 모델을 순서대로 시도한다.

셋째, Discord 서버 채널에서만 반응하지 않는다면 음성 기능이 아니라 mention 정책일 수 있다. 기본적으로 서버 채널에서는 봇 사용자 `@mention`이 필요하고, DM에서는 이 제약이 없다.

## 언제 Voice Mode를 쓰나

Voice Mode는 Hermes를 “항상 말하는 비서”로 만드는 장식 기능이 아니다. 손을 떼기 어렵거나, 빠른 구술이 타이핑보다 정확하거나, 회의형 공간에서 에이전트를 참여시켜야 할 때 꺼내는 입력·출력 레이어다. 정밀한 코드 수정과 검증은 여전히 텍스트 로그가 강하고, 빠른 캡처와 피드백 루프는 음성이 강하다. 둘을 나눠 쓰면 Hermes는 터미널, 메신저, 음성 채널 사이에서 같은 작업 능력을 유지한 채 더 자연스러운 인터페이스를 얻는다.
