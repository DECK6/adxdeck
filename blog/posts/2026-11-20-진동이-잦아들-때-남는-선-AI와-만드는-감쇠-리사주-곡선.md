---
type: article
track: media-art
mediaArtCategory: 기술·제작
title: 진동이 잦아들 때 남는 선, AI와 만드는 감쇠 리사주 곡선
description: 두 사인 진동에 감쇠를 더해 리사주 곡선이 안쪽으로 모이는 과정을 p5.js로 그립니다. AI에 계산 규칙과 검사를 전달하고, 진동 비율·위상·감쇠·표본 간격을 바꾸며 선의 밀도와 여백을 설계합니다.
aliases:
  - Drawing Damped Lissajous Curves with AI
author: 육대근
date created: 2026-11-20
date modified: 2026-11-20
tags:
  - article
  - media-art
  - generative-art
  - creative-coding
  - p5js
  - AI
thumbnail: images/damped-lissajous-cover.png
status: completed
akmLayer: output
akmType: output
akmRole: deliverable
trustLevel: reviewed
sourceType: synthesis
---

# 진동이 잦아들 때 남는 선, AI와 만드는 감쇠 리사주 곡선

![남색 여백 위에서 구리색과 청록색의 가는 곡선이 겹쳐지는 추상 이미지](images/damped-lissajous-cover.png)

*표지는 GPT Image 2로 생성한 개념 이미지입니다. 아래 세 패널은 본문 코드의 실제 실행 결과입니다.*

진동하는 점이 지나간 자리를 모두 남기면 어떤 그림이 될까. 가로와 세로가 서로 다른 속도로 움직이면 선은 굽어지며 교차한다. 같은 진동을 계속 반복하면 이미 그린 길을 다시 지나지만, 움직임의 폭을 조금씩 줄이면 다음 선은 이전 선의 안쪽에 놓인다. 선 하나의 경로가 시간에 따라 달라지면서 여러 겹의 무늬가 생긴다.

이번에는 **진동의 비율은 유지하고, 얼마나 빨리 잦아드는지만 바꾼 세 장의 그림**을 만든다. AI는 좌표 계산과 검사를 작성하는 보조로 사용한다. 브라우저에서 실행되는 결과는 생성형 AI가 매번 그리는 이미지가 아니라, 사인 함수와 감쇠 규칙으로 계산한 제너러티브 드로잉이다. 제작자가 조절할 대상은 프롬프트 속 분위기뿐 아니라 진동의 폭·위상·시간 간격이다.

## 선이 줄어드는 것과 남은 흔적이 사라지는 것은 다르다

리사주 곡선은 두 축의 사인 진동을 조합해 만들 수 있다. 여기서는 가로 좌표를 `sin(fx * t + phase)`, 세로 좌표를 `sin(fy * t)`로 둔다. `t`는 곡선을 따라가는 가상의 시간 변수다. `fx`와 `fy`는 이 시간 단위당 라디안으로 주는 각진동수이며, 한 시간 단위당 몇 바퀴인지 나타내는 값과는 다르다. 바퀴 수 기준 주파수를 넣으려면 각진동수로 변환하는 과정이 필요하다.

두 좌표에 공통으로 `exp(-damping * t)`를 곱하면 시간이 지날수록 진폭이 작아진다. 감쇠가 0이면 이 값은 계속 1이다. 감쇠가 양수이면 1에서 시작해 감소한다. 이 값은 각 축 좌표의 절댓값이 넘지 않는 한계를 정하는 포락선이다. 실제 점은 사인 함수에 따라 그 한계 안에서 왕복하므로, 포락선 자체를 점의 중심 거리로 읽으면 안 된다.

이번 설정은 `fx = 3`, `fy = 2`, `phase = π / 2`다. 감쇠가 없을 때는 가상의 시간이 `2π`만큼 증가하면 두 축이 함께 원래 위상으로 돌아온다. 감쇠가 있으면 위상이 돌아와도 진폭이 줄어 있어 전체 경로가 그대로 반복되지는 않는다. 다만 두 축이 동시에 0이 되는 원점은 다시 지날 수 있다. 이 차이가 외곽을 반복하는 그림과 안쪽으로 층을 쌓는 그림을 가른다.

여기서 감쇠는 과거에 그린 선을 지우지 않는다. 이미 그린 선은 그대로 남기고 **나중에 그리는 점의 움직임만 작게 만든다**. 그래서 감쇠를 크게 해도 완성된 그림의 바깥 흔적은 남는다. 화면 전체에 반투명 배경을 반복해서 덮어 잔상을 없애는 기법과 구분해야 한다. 또한 이 코드는 진자 장치의 마찰이나 힘을 계산하는 물리 시뮬레이션이 아니라, 직접 정한 감쇠식을 사용하는 조형 모델이다.

## AI에게 계산 조건을 주고 세 파일로 실행한다

처음에는 AI에 “복잡한 진동 무늬”만 요청하기보다, 어떤 변수를 같게 유지할지 적어 주는 편이 좋다. 아래 요청은 구현의 출발점으로 사용할 수 있다. 반환된 코드가 도와 라디안을 섞거나, 패널마다 다른 시간을 계산하지 않는지 확인한다.

```text
p5.js 2.4.0으로 감쇠 리사주 곡선을 비교하고 싶다.
가상의 시간 t=0부터40까지 양 끝을 포함한6001개 표본을 사용한다.
x=exp(-d*t)*sin(3*t+PI/2), y=exp(-d*t)*sin(2*t)다.
각도는 라디안이며 화면 진폭은125픽셀이다.
d=0,0.015,0.05를960×540 화면의 세 패널에서 비교한다.
좌표 계산 함수와 p5.js 화면 코드를 분리하고 난수는 쓰지 마라.
인접 표본을 선으로 연결하되 마지막 점과 첫 점을 강제로 잇지 마라.
정지 이미지로 그리고 S키로 PNG를 저장하게 해라.
알려진 원의 좌표, 시간 양 끝, 감쇠 비율, 반복 위상,
포락선 범위와 잘못된 입력을 작은 검사로 확인해라.
```

브라우저와 텍스트 편집기를 준비한다. [공식 다운로드 페이지](https://p5js.org/download/)에서 확인한 p5.js 2.4.0으로 실행했다. 빈 폴더에 `index.html`, `curve.js`, `sketch.js`를 각각 저장한다. HTML은 고정 버전 CDN에서 라이브러리를 읽으므로 인터넷 연결이 필요하다. 별도의 사진이나 AI API 키는 필요 없다.

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Damped Lissajous curves</title>
  <style>body{margin:0;background:#101421}canvas{display:block;max-width:100%;height:auto}</style>
  <script src="https://cdn.jsdelivr.net/npm/p5@2.4.0/lib/p5.min.js"></script>
  <script src="curve.js"></script>
  <script src="sketch.js"></script>
</head>
<body></body>
</html>
```

`curve.js`는 시간과 좌표를 반환한다. 좌표의 기본 진폭은 1이며 화면에서 확대할 배율은 따로 둔다. 표본 개수는 2 이상의 정수, 시간 길이와 두 각진동수는 양의 유한한 수, 감쇠는 0 이상의 유한한 수, 위상은 유한한 라디안 값을 받는다. 표본 번호를 `count - 1`로 나누어 첫 점은 시간 0, 마지막 점은 지정한 시간 길이에 놓이게 한다.

```js
function curvePoints(count, duration, fx, fy, damping, phase) {
  if (!Number.isInteger(count) || count < 2 ||
      ![duration, fx, fy, damping, phase].every(Number.isFinite) ||
      duration <= 0 || fx <= 0 || fy <= 0 || damping < 0) {
    throw new RangeError('Check sample count, time, frequencies, damping and phase.');
  }
  return Array.from({ length: count }, (_, i) => {
    const t = duration * i / (count - 1);
    const envelope = Math.exp(-damping * t);
    return {
      t,
      x: envelope * Math.sin(fx * t + phase),
      y: envelope * Math.sin(fy * t)
    };
  });
}
```

`sketch.js`는 좌표를 125배 확대하고 각 패널의 중심으로 이동한다. 화면의 세로 좌표는 아래로 증가하므로 수학 교과서의 좌표축과는 위아래 방향이 다르다. 여기서는 모든 패널에 같은 화면 좌표계를 사용한다. 선의 색은 시간 순서에 따라 구리색에서 청록색으로 바뀐다.

[noLoop](https://p5js.org/reference/p5/noLoop/)는 반복 그리기를 멈추는 함수다. 이 예제는 모든 선을 `setup()`에서 한 번 그린다. 따라서 가상의 시간 길이가 40이라고 해서 실행 화면을 40초 동안 녹화한 것은 아니다. 계산한 전체 경로를 한 장에 펼쳐 놓은 정지 결과물이다.

```js
const COUNT = 6001;
const DURATION = 40;
const FX = 3, FY = 2;
const PHASE = Math.PI / 2;
const AMPLITUDE = 125;
const DAMPINGS = [0, 0.015, 0.05];

function setup() {
  createCanvas(960, 540);
  pixelDensity(1);
  noLoop();
  background('#101421');
  textFont('monospace');
  textSize(14);
  DAMPINGS.forEach((damping, panel) => {
    const cx = 168 + 312 * panel, cy = 270;
    noStroke();
    fill('#ded9cf');
    text(`DAMPING ${damping}`, cx - 135, 95);
    const points = curvePoints(COUNT, DURATION, FX, FY, damping, PHASE);
    noFill();
    strokeWeight(0.7);
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      stroke(lerpColor(color('#ffb17d'), color('#53c8c3'), i / (COUNT - 1)));
      line(cx + AMPLITUDE * a.x, cy + AMPLITUDE * a.y,
           cx + AMPLITUDE * b.x, cy + AMPLITUDE * b.y);
    }
  });
  noStroke();
  fill('#a3adbf');
  text(`${COUNT} SAMPLES / T ${DURATION} / FX ${FX} / FY ${FY}`, 33, 456);
  text('S: SAVE PNG', 33, 482);
}

function keyPressed() {
  if (key === 's' || key === 'S') saveCanvas('damped-lissajous', 'png');
}
```

Python 3가 있다면 파일을 저장한 폴더에서 다음 명령을 실행하고 `http://localhost:8000/`을 연다. 실행을 마치면 터미널에서 Ctrl+C로 서버를 끝낸다. 화면을 클릭한 뒤 S키를 누르면 [saveCanvas](https://p5js.org/reference/p5/saveCanvas/)가 PNG 저장을 요청한다. 브라우저에 따라 즉시 내려받거나 저장 대화상자가 열린다. 캔버스 픽셀 밀도를 1로 설정했으므로 저장 크기는 960×540이다.

```bash
python3 -m http.server 8000
```

![같은 진동에 감쇠 0, 0.015, 0.05를 적용한 실제 리사주 드로잉 비교 화면](images/damped-lissajous-frame.png)

*왼쪽부터 감쇠 0, 0.015, 0.05다. 같은 환경에서 새로고침한 PNG와 S키로 저장한 PNG의 바이트가 일치했다.*

## 감쇠는 층 사이의 간격, 위상은 시작하는 관계를 바꾼다

감쇠가 없는 왼쪽 패널은 같은 경로를 여러 번 지난다. 시간에 따라 선 색을 바꾸어도 나중에 그린 선이 먼저 그린 부분을 덮으므로, 완성된 외곽은 주로 뒤쪽 시간의 청록색으로 읽힌다. 가운데는 반복할 때마다 진폭이 조금 줄어 촘촘한 층을 만든다. 오른쪽은 진폭이 더 빠르게 줄어 바깥 층 사이의 간격이 벌어지고 끝부분이 중심 가까이 모인다.

아래는 이번 설정에서 직접 계산한 마지막 시간의 포락선 값이다. “마지막 축별 한계”는 125에 포락선을 곱한 값이다. 마지막 점의 실제 가로·세로 좌표는 여기에 각각 사인 값을 곱해야 얻을 수 있으며, 전체 궤적의 크기나 마지막 점의 중심 거리를 뜻하지 않는다.

| 감쇠 | 시간 40의 포락선 | 처음 진폭에 대한 비율 | 마지막 축별 한계 |
|---|---:|---:|---:|
| 0 | 1 | 100% | 125픽셀 |
| 0.015 | 약 0.5488 | 약 54.88% | 약 68.60픽셀 |
| 0.05 | 약 0.1353 | 약 13.53% | 약 16.92픽셀 |

처음 변형할 때에는 `DAMPINGS`만 바꾸고 새로고침한다. 같은 시간 길이에서 층이 얼마나 떨어지고 중심부가 얼마나 채워지는지 비교하기 쉽다. 그다음 `DURATION`을 바꾸면 얼마나 오래 그린 흔적을 남길지 정할 수 있다. 감쇠가 있는 경우 시간을 더 늘려도 바깥 형태가 계속 커지는 것은 아니며, 작은 진폭의 흔적이 안쪽에 추가된다.

`FX`와 `FY`는 두 축이 서로 얼마나 빨리 움직이는지 바꾼다. `PHASE`는 가로 진동이 세로 진동에 대해 어느 지점에서 시작하는지를 바꾼다. 위상을 바꾸는 것이 완성된 그림 전체를 평면에서 회전시키는 것과 같지는 않다. 진동 비율·위상·감쇠를 한꺼번에 바꾸면 어떤 선택이 형태를 바꿨는지 읽기 어려우므로 하나씩 비교하는 편이 좋다.

선의 두께도 별도의 조형 변수다. 현재 `strokeWeight(0.7)`은 교차와 층 사이의 빈 공간을 남기는 설정이다. 두껍게 만들면 좁은 틈이 합쳐져 면처럼 보일 수 있다. `AMPLITUDE`를 크게 바꾸면 패널 간격과 캔버스 경계를 함께 확인해야 한다. 계산이 맞더라도 화면 밖으로 나간 선은 저장 이미지에 남지 않는다.

## 매끈해 보이는 선에도 표본과 끝점이 있다

브라우저는 연속적인 수식을 그대로 그리는 대신, 계산한 점들을 짧은 직선으로 잇는다. 이번에는 각 패널에 6001개 점과 6000개 선분을 사용한다. 표본 사이의 가상 시간 간격은 약 0.006667이다. 표본 수를 줄이거나 진동 속도를 크게 올리면 곡선이 각져 보이거나 빠른 움직임을 건너뛸 수 있다. 그런 경우 색이나 선 굵기보다 먼저 표본 간격을 확인한다.

시간 길이가 정해져 있으면 처음과 마지막이 같은 위치라는 보장은 없다. 이번 코드도 마지막 점을 첫 점에 연결하지 않는다. 감쇠가 양수이면 위상이 한 바퀴 돌아왔더라도 진폭이 달라지기 때문에, 강제로 닫은 선분이 의도하지 않은 대각선으로 나타날 수 있다. 루프 영상으로 발전시키려면 이 끝점 문제와 시간에 따른 진폭 변화를 별도로 설계해야 한다.

계산 검사는 독립적으로 알 수 있는 작은 예에서 시작했다. 두 각진동수를 1로 두고 가로 위상을 사분의 한 바퀴만큼 앞세우면, 감쇠가 없는 좌표는 원의 오른쪽·아래·왼쪽·위 방향을 지난다. 또 감쇠가 1이고 시간이 `ln(2)`일 때 두 좌표가 무감쇠 값의 절반이 되는지 확인했다. 시간 양 끝과 중간, 정수 각진동수의 반복 위상, 줄어드는 축별 범위, 동일 입력의 재현성, 잘못된 입력을 포함한 검사 6개가 통과했다.

실제 브라우저에서는 세 기본 패널과 PNG 저장·새로고침 결과를 확인했다. 브라우저나 글꼴이 달라져도 이미지 바이트가 같다는 뜻은 아니다. 실시간 애니메이션, 음향 입력, 물리 진자와의 대응, 큰 출력의 처리 성능은 이번 예제의 검증 범위에 포함하지 않았다.

이 드로잉에서 중요한 것은 선을 많이 겹치는 일만이 아니다. 일정한 외곽을 되짚을지, 안쪽에 촘촘한 층을 쌓을지, 넓은 여백을 남기며 중심으로 모일지 정하는 일이다. AI에 계산과 반례를 요청하고 같은 조건의 결과를 비교하면, 감쇠라는 숫자를 작품의 간격과 리듬을 고르는 언어로 사용할 수 있다.
