---
type: article
track: ai-ax
title: "한 작업을 두 에이전트가 잡았을 때 무엇이 무너지는가"
aliases:
  - "Why Agent Jobs Need Leases Heartbeats and Fencing Tokens"
author:
  - "[[육대근]]"
date created: 2026-09-06
date modified: 2026-09-06
tags:
  - article
  - AI
  - ai-agent
  - agent-runtime
  - distributed-systems
  - leases
  - concurrency-control
description: "장기 실행 queue에서 stale worker와 중복 처리를 막기 위해 lease, heartbeat, fencing token이 각각 어떤 소유권 경계를 만드는지 살펴본다."
thumbnail: images/agent-work-lease-heartbeat-fencing-cover.png
status: completed
---

# 한 작업을 두 에이전트가 잡았을 때 무엇이 무너지는가

![에이전트 작업 소유권을 추상화한 커버](images/agent-work-lease-heartbeat-fencing-cover.png)

대기열에는 작업이 하나뿐인데, 두 worker가 모두 자신이 처리 중이라고 믿는 순간이 생긴다. 먼저 시작한 프로세스가 네트워크 지연이나 긴 모델 호출 때문에 잠시 멈춘 사이, 다른 프로세스가 작업을 회수해서다. 둘 다 결과 파일을 쓰거나 메시지를 전송하면 단순한 중복 계산으로 끝나지 않는다. 어느 결과가 정본인지, 이미 수행된 외부 행동을 누가 책임지는지까지 흔들린다.

짧은 실행에서는 파일 잠금만으로 충분할 수 있다. 하지만 잠금 소유자가 죽었는지 아니면 단지 느린지 구분할 수 없고, 오래된 잠금을 회수한 뒤 과거 소유자가 돌아오는 상황도 막지 못한다. 오래 실행되는 agent runtime에서는 **누가 작업을 잡았는가**뿐 아니라 **그 소유권이 아직 유효한가**와 **새 소유자보다 오래된 쓰기를 거부할 수 있는가**를 함께 설계해야 한다.

## lock은 한 시점을 기록하고 lease는 소유권에 만료 시간을 붙인다

lease는 작업 소유권과 만료 시점을 함께 정하는 claim이다. 소유자는 만료 전에 heartbeat로 lease를 갱신하고, 갱신이 끊기면 다른 worker가 새 소유권을 얻을 수 있다. Kubernetes는 Lease API의 `spec.renewTime`을 node heartbeat마다 갱신해 가용성을 판단하고, 같은 Lease 개념을 component leader election에도 사용한다.[1]

이 원리를 agent queue에 적용하려면 최소한 `task_id`, `owner_id`, `lease_epoch`, `expires_at`, `heartbeat_at`을 각각 기록해야 한다. 단순한 `status: running`은 누가 언제까지 쓸 수 있는지 말해 주지 않는다. canonical output을 쓰기 직전에도 현재 epoch의 소유자인지 다시 확인해야 한다.

## heartbeat는 생존 신호이지 완료 증거가 아니다

Amazon SQS의 visibility timeout은 consumer가 message를 처리하는 동안 다른 consumer에게 잠시 숨긴다. 제한 시간 안에 message를 삭제하지 않으면 다시 보이게 되고, 다른 consumer가 가져갈 수 있다.[2] 처리가 길어지면 timeout을 연장할 수 있지만, SQS의 at-least-once delivery에서는 visibility timeout 동안에도 중복 전달이 절대 일어나지 않는다고 보장하지 않는다.[2]

agent runtime에서도 같은 구분이 필요하다. heartbeat가 계속 들어온다는 사실은 프로세스가 살아 있음을 보여 줄 뿐, 산출물이 진전됐거나 외부 행동이 한 번만 일어났음을 증명하지 않는다. 생존 기록과 진행 영수증을 나눠야 하는 이유다. heartbeat는 소유권 유지에 쓰고, 진행 상태는 단계별 artifact와 readback으로 따로 확인하는 편이 안전하다.

## fencing token은 돌아온 옛 소유자의 쓰기를 막는다

lease가 만료된 뒤에도 과거 worker가 다시 살아나 자신이 여전히 owner라고 생각할 수 있다. Hazelcast의 FencedLock 문서는 긴 GC pause로 heartbeat를 놓친 client가 소유권을 잃은 뒤 돌아오는 사례를 설명한다. 해결책은 새 owner가 생길 때마다 증가하는 monotonic fencing token을 발급하고, 외부 resource가 더 낮은 token의 요청을 거부하게 하는 것이다.[3]

예를 들어 epoch `42`의 결과를 받은 canonical writer는 나중에 도착한 epoch `41`의 쓰기를 거부한다. token을 발급하는 것만으로는 부족하다. 외부 행동을 적용하는 실제 파일 저장소, database, publish API가 token을 비교해야 한다. downstream이 오래된 epoch를 거부하지 않으면 fencing token은 로그에 남은 숫자일 뿐이다.

## AKM 적용: 선언된 owner를 runtime에서 지키는 법

공개 AKM 저장소의 현재 `main`에 있는 Task Contract Schema는 범위를 정한 작업마다 one canonical path와 one primary owner를 선언하도록 요구한다.[4] 다만 이 schema가 lease나 fencing을 구현한다는 뜻은 아니다. 여러 agent가 같은 canonical note를 다루는 실행 환경이라면, 선언된 ownership을 runtime guard로 이어 갈 수 있다.

실행 계약에는 다음 값을 함께 둘 수 있다.

- `task_id`: 재시도와 회수 뒤에도 유지되는 작업 identity
- `owner_id`: 현재 쓰기 권한을 가진 worker
- `lease_epoch`: 소유권이 바뀔 때 증가하는 fencing value
- `expires_at`과 `heartbeat_at`: 회수 가능 시점과 마지막 생존 신호
- `canonical_output`: 최종 쓰기가 허용된 단일 경로
- `completion_receipt`: 정본 readback과 검증 결과

새 worker가 claim을 얻으면 이전 epoch의 쓰기를 차단한다. 완료 뒤에는 canonical output을 다시 읽어 receipt를 닫는다. 이렇게 하면 agent의 자기보고와 실제 정본 상태를 분리할 수 있다.

## 짧은 lease도 긴 lease도 비용이 있다

lease가 너무 짧으면 긴 모델 호출, GC pause, 일시적인 network partition 때문에 worker가 죽었다고 오인해 불필요한 takeover가 생긴다. 너무 길면 실제 장애 뒤 회수가 늦어진다. heartbeat 주기를 촘촘하게 잡을수록 coordination store의 쓰기 부하도 늘어난다. 만료 판정은 각 worker의 local clock보다 queue나 coordination service의 권위 있는 시계를 기준으로 삼아야 한다.

fencing도 만능은 아니다. 모든 downstream이 token 비교를 지원해야 하고, email이나 외부 게시처럼 한번 실행된 행동은 오래된 요청을 사후에 되돌리기 어렵다. 이런 외부 행동에는 fencing 외에도 idempotency key, provider receipt, 상태 readback이 필요하다. lease는 작업 소유권을 다루고, 멱등성은 행동의 중복을 다룬다. 둘은 같은 문제가 아니다.

설계를 검토할 때는 다음을 확인해야 한다. claim의 유효 기간은 어디에 기록되는가. heartbeat가 끊겼을 때 누가 회수를 결정하는가. 새 epoch가 발급된 뒤 오래된 쓰기는 어느 layer에서 거부되는가. 마지막으로 agent의 완료 문장이 아니라 어떤 canonical readback이 작업을 닫는가. 이 질문에 분명히 답할 수 있어야 agent 수를 늘려도 처리량이 확장되고, 정본 충돌만 커지는 일을 피할 수 있다.

## Sources

[1] [Leases | Kubernetes](https://kubernetes.io/docs/concepts/architecture/leases/)
[2] [Amazon SQS visibility timeout](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html)
[3] [FencedLock | Hazelcast Documentation](https://docs.hazelcast.com/hazelcast/5.5/data-structures/fencedlock)
[4] [AKM Task Contract Schema](https://github.com/DECK6/akm/blob/f26ace2a16caba724b24db12cbee238ebb52498f/99-system/TASK-CONTRACT-SCHEMA.md)
