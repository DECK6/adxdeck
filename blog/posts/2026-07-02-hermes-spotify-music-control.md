---
type: article
title: "Hermes Spotify는 음악 앱을 에이전트의 작업 표면으로 바꾼다"
aliases:
  - "hermes-spotify-music-control"
author:
  - "Deck"
date created: 2026-07-02
date modified: 2026-07-02
tags: [hermes, ai-agent, workflow, spotify]
description: "A practical guide to Hermes Agent Spotify integration: enabling the toolset, PKCE OAuth setup, playback and playlist tools, cron usage, and common Spotify API pitfalls."
thumbnail: images/hermes-spotify-music-control-cover.png
status: completed
series: hermes-notes
---

# Hermes Spotify는 음악 앱을 에이전트의 작업 표면으로 바꾼다

![Hermes Spotify cover](images/hermes-spotify-music-control-cover.png)

음악 제어는 보통 앱 안에서 끝난다. 하지만 작업 루틴, 회의 전후 전환, 재생 기록 정리처럼 “대화형 에이전트가 대신 실행하면 좋은” 순간도 있다. **Hermes Spotify integration**은 Spotify Web API를 Hermes toolset으로 연결해 검색, 재생, 큐, 플레이리스트, 라이브러리, 최근 재생 기록을 자연어 작업으로 다루게 만드는 기능이다.

## 기능 개요 — opt-in toolset과 PKCE OAuth

Spotify는 기본 도구가 아니라 opt-in toolset이다. 활성화하면 Hermes에 `spotify_playback`, `spotify_devices`, `spotify_queue`, `spotify_search`, `spotify_playlists`, `spotify_albums`, `spotify_library`가 추가된다. 읽기 작업은 Free 계정에서도 가능하지만, 재생·일시정지·스킵·볼륨·기기 전환·큐 추가처럼 플레이어 상태를 바꾸는 작업은 Spotify Premium과 활성 Spotify Connect device가 필요하다.

인증은 PKCE OAuth로 처리된다. Hermes의 LLM provider 인증과는 별개이며, 토큰은 `~/.hermes/auth.json`의 Spotify provider 항목에 저장된다. Spotify는 서드파티가 모두에게 쓰는 공용 OAuth 앱을 허용하지 않기 때문에, 사용자는 가벼운 Spotify developer app을 하나 만들고 Client ID를 등록해야 한다. Client secret은 쓰지 않는다.

## 어떻게 설정하고 쓰는가

가장 쉬운 길은 도구 관리 화면에서 켜는 것이다.

```bash
hermes tools
```

`Spotify`를 켜면 Hermes가 필요한 설정과 OAuth 흐름을 안내한다. 별도 단계로 진행하려면 먼저 toolset을 켜고, 이후 로그인 wizard를 실행한다.

```bash
hermes auth spotify
hermes auth status spotify
```

wizard가 안내하는 기본 redirect URI는 다음과 같다.

```text
http://127.0.0.1:43827/spotify/callback
```

환경 파일을 직접 점검할 때는 Client ID와 redirect URI만 보면 된다.

```bash
hermes config env-path
```

```env
HERMES_SPOTIFY_CLIENT_ID=<your-client-id>
HERMES_SPOTIFY_REDIRECT_URI=http://127.0.0.1:43827/spotify/callback
```

활성화 뒤에는 명령어보다 자연어 요청이 핵심 인터페이스가 된다. “지금 재생 중인 곡 알려줘”, “Miles Davis를 검색해서 재생해”, “최근 들은 세 곡을 Focus 2026 플레이리스트에 넣어줘”, “거실 스피커로 재생을 옮겨줘” 같은 요청을 Hermes가 알맞은 Spotify tool 호출로 바꾼다.

Cron과도 붙일 수 있다. 예를 들어 아침 루틴에 특정 플레이리스트를 켜는 작업은 일반 예약 작업처럼 작성한다.

```bash
hermes cron add \
  --name "morning-focus" \
  "0 8 * * 1-5" \
  "Transfer Spotify playback to my desk speaker and start my Focus playlist."
```

## 실제 운용에서의 짧은 장면

이 사용자의 Dev profile 확인에서는 `hermes-cli` toolset이 기본이고 Spotify는 비활성 상태였다. 이 구성이 오히려 좋은 기본값이다. 음악·개인 자동화처럼 계정 권한이 붙는 도구는 항상 켜 두기보다, 필요한 profile이나 세션에서만 열어 도구 표면과 OAuth 범위를 좁히는 편이 안전하다.

## 주의할 점

- `403 No active device`는 인증 실패가 아니라 조작할 Spotify Connect device가 없다는 뜻이다. 휴대폰, 데스크톱 앱, 웹 플레이어, 스피커 중 하나를 먼저 활성화한다.
- `403 Premium required`는 Free 계정에서 playback mutation을 시도했다는 뜻이다. 검색, 플레이리스트, 라이브러리 조회는 가능하지만 재생 제어는 Premium이 필요하다.
- SSH나 headless 환경에서는 브라우저가 자동으로 열리지 않을 수 있다. 출력된 URL을 로컬 브라우저에서 열고, 필요하면 `ssh -L 43827:127.0.0.1:43827 ...`로 callback 포트를 전달한다.
- redirect URI가 Spotify app 설정과 다르면 `INVALID_CLIENT`가 난다. Hermes 기본값과 developer dashboard 값을 같은 문자열로 맞춘다.
- toolset을 켠 뒤 현재 세션에 바로 반영되지 않으면 새 Hermes 세션을 시작한다. 도구 목록은 prompt cache와 세션 안정성을 위해 시작 시점에 고정된다.

Spotify integration은 “음악 앱까지 AI에게 맡기자”보다 좁고 실용적인 기능이다. 단발 검색이나 라이브러리 정리는 읽기 도구로 충분하고, 루틴·스피커 전환·플레이리스트 조립처럼 실행 순서가 있는 작업에서는 Hermes의 toolset, Cron, 자연어 인터페이스가 함께 빛난다.
