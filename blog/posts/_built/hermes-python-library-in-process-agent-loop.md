---
type: article
title: "Hermes Python Library는 에이전트 루프를 앱 안으로 넣는다"
aliases:
  - "Hermes Python Library In Process Agent Loop"
author:
  - "Deck"
date created: 2026-07-22
date modified: 2026-07-22
tags:
  - hermes
  - ai-agent
  - workflow
  - python-library
description: "Hermes Agent can run in-process as a Python library through AIAgent, without a CLI or subprocess. This guide covers chat(), run_conversation(), tool boundaries, state handling, and concurrency safety."
thumbnail: images/hermes-python-library-in-process-agent-loop-cover.png
status: completed
series: hermes-notes
---

# Hermes Python Library는 에이전트 루프를 앱 안으로 넣는다

![Hermes Python Library in-process agent loop cover](images/hermes-python-library-in-process-agent-loop-cover.png)

Hermes Agent를 쓰기 위해 늘 터미널이나 메신저를 열 필요는 없다. Python 프로그램에서 `AIAgent`를 직접 import하면 모델 호출, tool call, 재시도까지 포함한 에이전트 루프를 같은 프로세스 안에서 실행할 수 있다. 기존 앱이 요청 수명과 출력 형식을 맡고, Hermes가 판단과 도구 사용을 맡아야 할 때 쓰는 방식이다.

## 무엇이 들어 있나

가장 단순한 입구는 `chat()`이다. 문자열 하나를 넘기면 Hermes가 필요한 도구를 호출한 뒤 최종 답변 문자열만 반환한다. 실행 과정과 메시지 이력까지 다뤄야 한다면 `run_conversation()`을 쓴다. 반환값에는 `final_response`와 system, user, assistant, tool call을 포함한 `messages`가 들어간다.

이 방식은 외부 프로토콜과 구분해야 한다. ACP는 IDE가 Hermes를 제어할 때, API Server는 다른 언어나 OpenAI 호환 클라이언트가 HTTP로 접근할 때 맞다. Python Library는 subprocess나 네트워크 경계 없이 앱과 같은 메모리 공간에서 `AIAgent`를 실행한다. 그래서 붙이기는 쉽지만 상태와 동시성도 호스트 앱이 책임져야 한다.

## 앱 안에서 실행하는 법

공식 저장소를 현재 Python 환경에 설치한다.

```bash
uv pip install git+https://github.com/NousResearch/hermes-agent.git
```

CLI에서 쓰던 provider 인증과 환경 변수는 라이브러리에서도 그대로 필요하다. 키를 코드에 적지 말고 Hermes 설정이나 프로세스 환경에서 읽게 한다. 최소 실행 코드는 다음과 같다.

`model`을 생략하면 Hermes 설정의 기본 모델을 사용한다. 앱에서 모델과 provider를 고정해야 해도 자격 증명 값까지 생성자에 박아 넣지는 않는다. 모델 선택은 코드에 둘 수 있지만, 비밀 값은 설정이나 환경 변수에 남겨 두는 편이 교체와 회수가 쉽다.

```python
from run_agent import AIAgent

agent = AIAgent(
    quiet_mode=True,
    enabled_toolsets=["web"],
    skip_context_files=True,
    skip_memory=True,
    max_iterations=12,
)

answer = agent.chat("Python 3.13의 주요 변경점을 찾아 요약해 줘")
print(answer)
```

`quiet_mode=True`는 spinner와 tool progress 같은 CLI 출력을 억제한다. `enabled_toolsets`는 허용 목록이고, `disabled_toolsets`는 대부분의 도구를 열어 두되 일부만 막을 때 쓴다. 외부 요청을 처리하는 stateless endpoint라면 `skip_context_files=True`와 `skip_memory=True`로 작업 폴더의 `AGENTS.md`와 장기 기억이 요청에 섞이지 않게 할 수 있다.

여러 턴을 이어야 한다면 이전 결과의 메시지 목록을 다시 넘긴다.

```python
first = agent.run_conversation("검토 기준을 다섯 줄로 정리해 줘")
second = agent.run_conversation(
    "그 기준을 JSON 항목으로 바꿔 줘",
    conversation_history=first["messages"],
)
print(second["final_response"])
```

`run_conversation()`은 전달받은 history를 내부에서 복사하므로 원본 목록을 직접 바꾸지 않는다. 한편 `ephemeral_system_prompt`는 앱 전용 역할을 줄 때 쓸 수 있고, `save_trajectories=True`는 실행 기록을 ShareGPT 형식 JSONL로 남긴다. 기록에는 민감한 입력이 들어갈 수 있으니 기본값처럼 꺼 둔 상태에서 필요성을 먼저 판단하는 편이 낫다.

## 실제 사용 사이드바

이 사용자의 셋업에서는 지식 정리, 개발 검증, 운영 확인을 서로 다른 profile과 worker로 나누고, 예약 작업은 별도 session source와 완료 기록을 남긴다. 각 역할이 같은 대화 이력과 tool surface를 무조건 공유하지 않기 때문에, 결과가 어느 실행 경계에서 나왔는지도 뒤에 확인할 수 있다. 블로그 발행이나 긴 빌드처럼 시간이 걸리는 일은 추적 가능한 background 흐름에 두고, 사람이 대화하는 창은 새 지시를 받을 수 있게 비워 둔다. 이런 환경에서 Python embedding은 전체 운영을 대신하는 상주 agent보다 짧은 검증기와 내부 endpoint에 어울리므로, 요청마다 새 `AIAgent`를 만들고 필요한 toolset만 열며 오래 이어질 일은 Gateway나 Kanban에 남기는 식이다.

## 함정과 팁

- 하나의 `AIAgent`를 여러 thread가 공유하면 안 된다. 대화 이력, tool session, iteration counter가 instance 안에 있으므로 thread나 task마다 새 instance를 만든다.
- `enabled_toolsets`를 먼저 고려한다. 파일만 읽는 검사기에 terminal과 browser까지 열 이유는 없다.
- 단순 endpoint에서는 `max_iterations`를 낮춰 무한한 tool loop와 예상 밖의 비용을 제한한다.
- `skip_context_files`와 `skip_memory`는 보안 스위치이면서 기능 손실이기도 하다. 프로젝트 규칙이나 사용자 선호가 필요한 작업에서는 무조건 끄지 않는다.
- 긴 프로세스에서는 각 conversation이 정상 종료되도록 예외와 timeout을 다룬다. 그래야 terminal session과 browser 같은 리소스 정리도 끝난다.

앱이 Python으로 작성되어 있고 요청마다 독립된 에이전트 실행이 필요하다면 Library 방식이 가장 짧다. 여러 언어에서 호출하거나 프로세스를 분리해야 하면 API Server가 낫고, IDE 연결에는 ACP가 맞다. 같은 프롬프트를 대량으로 처리하는 일이라면 직접 thread를 조립하기보다 Hermes의 batch runner를 먼저 검토하는 편이 안전하다.
