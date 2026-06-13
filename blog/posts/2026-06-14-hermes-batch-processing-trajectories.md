---
type: article
title: Hermes Batch Processing은 에이전트 실행을 데이터셋 단위로 확장한다
aliases:
  - hermes-batch-processing-trajectories
author: DECK
date created: 2026-06-14
date modified: 2026-06-14
tags: [hermes, ai-agent, workflow, batch-processing]
description: "A feature guide to Hermes Agent Batch Processing: JSONL datasets, parallel workers, toolset distributions, checkpoints, and trajectory outputs for training or evaluation."
thumbnail: images/hermes-batch-processing-trajectories-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-batch-processing-trajectories-cover.png)

# Hermes Batch Processing은 에이전트 실행을 데이터셋 단위로 확장한다

대화형 에이전트는 한 번에 하나의 요청을 처리할 때 가장 자연스럽습니다. 하지만 모델 평가나 툴 사용 데이터셋을 만들 때는 같은 에이전트 루프를 수백 개 프롬프트에 반복 적용해야 합니다. Hermes Agent의 Batch Processing은 이 과정을 `batch_runner.py`로 묶어 JSONL 입력, 병렬 워커, checkpoint, trajectory 산출물까지 관리하는 기능입니다.

## 기능 개요

입력은 한 줄에 하나의 JSON 객체가 들어 있는 JSONL 파일입니다. 각 줄은 최소한 `prompt` 필드를 가지며, 필요하면 프롬프트별 `image` 또는 `docker_image`, `cwd`를 붙여 서로 다른 실행 환경을 지정할 수 있습니다. Hermes는 각 프롬프트를 독립된 에이전트 세션으로 실행하고, 대화 기록과 도구 호출 통계, 완료 여부, reasoning coverage를 ShareGPT에 가까운 형식으로 저장합니다.

핵심은 세 가지입니다. `--num_workers`는 여러 프롬프트를 병렬 처리하고, `--distribution`은 프롬프트마다 활성화할 toolset 조합을 샘플링하며, `--resume`은 중단된 긴 실행을 이어 줍니다. 일반 채팅이나 Cron이 “일을 수행”하는 쪽이라면 Batch Processing은 “에이전트 실행 데이터를 대량 생산하고 검증”하는 쪽에 가깝습니다.

## 어떻게 동작하나

가장 작은 입력 파일은 다음처럼 생겼습니다.

```jsonl
{"prompt": "Write a Python function that finds the longest palindromic substring"}
{"prompt": "Debug this TypeError and explain the fix"}
```

Hermes 소스 트리에서 실행 예시는 다음과 같습니다.

```bash
python batch_runner.py \
  --dataset_file=data/prompts.jsonl \
  --batch_size=10 \
  --run_name=coding_eval_v1 \
  --model=anthropic/claude-sonnet-4.6 \
  --num_workers=4 \
  --distribution=development
```

중단된 실행은 같은 `run_name`으로 이어 갈 수 있습니다.

```bash
python batch_runner.py \
  --dataset_file=data/prompts.jsonl \
  --batch_size=10 \
  --run_name=coding_eval_v1 \
  --resume
```

산출물은 `data/<run_name>/` 아래에 쌓입니다. `batch_0.jsonl` 같은 배치별 결과가 먼저 생기고, 마지막에 `trajectories.jsonl`, `checkpoint.json`, `statistics.json`이 정리됩니다. 각 trajectory에는 `conversations`, `toolsets_used`, `tool_stats`, `tool_error_counts`, `completed`, `partial` 같은 필드가 들어갑니다.

toolset distribution은 `default`, `development`, `research`, `image_gen`, `safe`, `terminal_only`, `browser_tasks`처럼 목적별로 나뉩니다. 공식 문서 기준으로 distribution은 고정 조합 하나를 고르는 방식이 아니라 각 toolset의 확률을 독립적으로 샘플링한 뒤 최소 하나의 toolset을 보장하는 방식입니다.

## 실제 운영 사이드바

이 사용자의 Hermes 운영에서는 일상 자동화와 블로그 발행은 Cron과 profile 분리로 처리하고, 개발 검증은 Dev 쪽 실행·리뷰 루프로 다룹니다. Batch Processing은 그런 운영형 자동화가 아니라 “여러 프롬프트에서 에이전트가 어떻게 행동했는지”를 모으는 실험·평가용 생산 라인에 가깝습니다.

## 주의할 점과 팁

Batch 실행은 모델 호출과 도구 호출을 많이 발생시키므로 비용과 rate limit을 먼저 계산해야 합니다. `--max_samples`로 작은 샘플부터 돌리고, `--max_turns`, `--max_tokens`, `--reasoning_effort`를 명시해 실행 폭을 제한하는 편이 안전합니다.

프롬프트별 컨테이너 이미지를 쓰는 경우 Docker, Modal, Singularity 같은 backend에서 이미지 접근성을 먼저 확인해야 합니다. `--resume`은 완료된 프롬프트의 실제 텍스트를 기준으로 재개하므로 데이터셋 순서가 바뀌어도 비교적 안전하지만, prompt 내용을 수정하면 새 샘플처럼 처리될 수 있습니다. 로컬에서 distribution 이름이 필요하면 `toolset_distributions.py`도 함께 확인하는 것이 좋습니다.

## 언제 써야 하나

Batch Processing은 반복 알림이나 장기 작업 관리용 기능이 아닙니다. 그런 작업은 Cron, Kanban, delegation이 더 적합합니다. 대신 툴 사용 trajectory를 만들거나, 모델별 에이전트 행동을 비교하거나, 같은 과제를 다양한 toolset 조합으로 평가해야 할 때 Batch Processing이 가장 직접적인 선택입니다.
