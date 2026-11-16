---
type: article
track: media-art
mediaArtCategory: 기술·제작
title: 선을 회전원으로 바꾸기, AI와 만드는 푸리에 드로잉
description: 닫힌 윤곽선을 푸리에 성분으로 나누고 회전원의 합으로 다시 그립니다. p5.js 실행 예제로 AI 코드의 부호와 정규화를 확인하고, 남길 성분 수가 형태에 미치는 영향을 비교합니다.
aliases:
  - Drawing with AI and Fourier Epicycles
author: 육대근
date created: 2026-11-17
date modified: 2026-11-17
tags:
  - article
  - media-art
  - generative-art
  - creative-coding
  - p5js
  - AI
thumbnail: images/fourier-cover.png
status: completed
akmLayer: output
akmType: output
akmRole: deliverable
trustLevel: reviewed
sourceType: synthesis
---

# 선을 회전원으로 바꾸기, AI와 만드는 푸리에 드로잉

![어두운 바탕 위 회전원 사슬과 산호색 윤곽선을 표현한 추상 일러스트](images/fourier-cover.png)

*표지는 GPT Image 2로 생성한 개념 이미지입니다. 아래 실행 화면은 본문 코드가 그린 결과입니다.*

손으로 그린 선을 여러 개의 원으로 바꿀 수 있다. 원의 중심에 다음 원을 이어 붙이고 서로 다른 속도로 회전시키면, 사슬 끝의 점이 다시 선을 그린다. 이번에는 불규칙한 닫힌 윤곽선을 재료로 삼아 **몇 개의 회전 성분만 남겨도 그 선의 성격이 살아 있는가**를 살펴본다.

완성할 것은 회전원의 한 순간과 전체 궤적을 함께 보여 주는 정지 드로잉이다. AI에는 좌표를 변환하는 코드와 검사를 만드는 일을 맡기고, 어느 정도의 변형을 작품에 남길지는 사람이 고른다. 실행 중 이미지를 추론하는 생성형 AI와, 수학적 규칙으로 좌표를 만드는 제너러티브 프로그램의 역할을 구별해 두면 수정할 부분도 명확해진다.

## 윤곽선의 모양과 그 선을 읽는 속도

푸리에 변환에 넣는 것은 그림 파일이 아니라 순서가 있는 좌표 목록이다. 각 점의 가로 좌표를 실수부, 세로 좌표를 허수부로 생각하면 한 바퀴의 선이 복소수 신호가 된다. 이를 이산 푸리에 변환, DFT로 분해하면 회전 속도·크기·시작 방향이 다른 성분들을 얻는다. 각 성분의 회전을 더해 원래 점들을 복원할 수 있다. 부호와 정규화의 선택은 [NumPy의 공식 DFT 설명](https://numpy.org/doc/stable/reference/routines.fft.html)에 정리되어 있다. 이 예제는 NumPy를 실행하지 않고 JavaScript로 직접 계산한다.

같은 윤곽선이라도 한 구간에 점이 몰려 있으면 다른 성분이 나온다. 목록을 일정한 속도로 읽을 때 그 구간에서 오래 머무르게 되기 때문이다. 따라서 꼭짓점 사이를 같은 개수로 나누지 않고, **둘레를 따라 같은 거리마다 점을 찍는다.** 마지막 점 뒤에는 첫 점으로 돌아가는 변도 포함한다. 시작점을 마지막에 다시 넣어 같은 위치를 두 번 표본으로 세지는 않는다.

이렇게 얻은 성분에서 진폭은 원의 반지름, 정수 주파수는 한 주기 동안의 회전 횟수에 해당한다. 음의 주파수는 반대 방향으로 돈다. 화면에서는 아래로 갈수록 세로 좌표가 커지므로 수학 교과서의 좌표축과 시각적 회전 방향이 다르다. 주파수 0인 성분은 회전하지 않는 위치 이동이어서 원을 그리지 않는다.

여기서는 진폭이 큰 성분부터 남긴다. **낮은 주파수부터 남기는 방식과는 다르다.** 크기가 큰 빠른 회전이 작은 느린 회전보다 먼저 선택될 수 있다. 목적은 흐릿한 원본을 만드는 데 있지 않고, 적은 성분으로 어떤 특징을 남길지 비교하는 데 있다.

## AI에게 줄 조건과 바로 실행할 코드

다음은 AI와 구현을 시작할 때 쓸 수 있는 요청 예시다. 반환 코드가 항상 같다는 뜻은 아니다. 아래에는 이 조건으로 작성하고 직접 실행한 구현을 실었다.

```text
p5.js 2.4.0에서 닫힌 다각형을 푸리에 드로잉으로 바꾸고 싶다.
둘레 길이를 기준으로 128개 점을 균등하게 재표본화해라.
복소 DFT는 분석할 때 1/N으로 나누고, 합성할 때 다시 나누지 마라.
음수 주파수를 복원하고 진폭 내림차순으로 성분을 정렬해라.
960×540 화면에 원본 윤곽선, 선택한 성분의 전체 궤적,
위상 0.17에서의 회전원 사슬을 정지 화면으로 그려라.
성분 수 KEEP은 9로 시작하고 S키로 PNG를 저장한다.
기하 계산과 화면 코드를 나누고 원·역방향 원·전체 복원 검사를 제안해라.
진폭 순 선택을 저주파 필터라고 설명하지 마라.
```

브라우저와 텍스트 편집기를 준비한다. [p5.js 공식 다운로드 페이지](https://p5js.org/download/)에서 확인한 2.4.0을 사용했다. 빈 폴더에 `index.html`, `fourier.js`, `sketch.js`를 만든다. 아래 HTML은 고정 버전 CDN을 사용하므로 첫 실행에 인터넷이 필요하다. 이번 검증에서는 같은 라이브러리 파일을 내려받아 로컬에서 불러왔다.

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>Fourier drawing</title>
  <script src="https://cdn.jsdelivr.net/npm/p5@2.4.0/lib/p5.min.js"></script>
  <script src="fourier.js"></script>
  <script src="sketch.js"></script>
</head>
<body></body>
</html>
```

`fourier.js`는 선의 표본과 회전 성분을 계산한다. 좌표는 유한한 숫자 쌍, 표본 수는 2 이상의 정수, 윤곽선 전체 길이는 양수라는 전제다. 길이가 없는 중복 변은 건너뛴다. 분석 단계에서 한 번만 표본 수로 나누며, 짝수 표본 수의 나이퀴스트 성분은 음의 주파수로 표기한다. 모든 성분이 정수 주파수이므로 주기 끝에서 시작 위치로 돌아온다.

```js
function resampleClosed(vertices, count) {
  const edges = [];
  let total = 0;
  for (let i = 0; i < vertices.length; i++) {
    const a = vertices[i], b = vertices[(i + 1) % vertices.length];
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (length > 0) {
      edges.push({a, b, start: total, length});
      total += length;
    }
  }
  if (total === 0) throw new Error('Outline needs positive length');
  return Array.from({length: count}, (_, i) => {
    const d = total * i / count;
    const e = edges.find(e => d < e.start + e.length) || edges.at(-1);
    const u = (d - e.start) / e.length;
    return [e.a[0] + u * (e.b[0] - e.a[0]),
            e.a[1] + u * (e.b[1] - e.a[1])];
  });
}

function coefficients(points) {
  const n = points.length;
  return points.map((_, k) => {
    let re = 0, im = 0;
    for (let j = 0; j < n; j++) {
      const a = 2 * Math.PI * k * j / n;
      const [x, y] = points[j];
      re += x * Math.cos(a) + y * Math.sin(a);
      im += y * Math.cos(a) - x * Math.sin(a);
    }
    re /= n; im /= n;
    const freq = k <= Math.floor((n - 1) / 2) ? k : k - n;
    return {freq, re, im, amp: Math.hypot(re, im)};
  }).sort((a, b) => b.amp - a.amp);
}

function pointAt(terms, t) {
  let x = 0, y = 0;
  for (const c of terms) {
    const a = 2 * Math.PI * c.freq * t;
    x += c.re * Math.cos(a) - c.im * Math.sin(a);
    y += c.re * Math.sin(a) + c.im * Math.cos(a);
  }
  return [x, y];
}
```

`sketch.js`는 그림의 재료와 화면을 맡는다. 회색 선이 원본 다각형, 산호색 선이 선택한 성분의 합성 궤적, 금색 원과 선이 특정 위상에서의 사슬이다. `KEEP`은 위치 이동 성분까지 포함한 개수이므로 보이는 원 개수와 항상 같지는 않다. `PHASE`는 한 주기를 0부터 1로 나타낸 위치다. 지금은 자동으로 움직이지 않고 그 위치의 사슬만 표시한다.

```js
const OUTLINE = [[-190,-60],[-80,-170],[30,-70],[190,-110],
                 [125,35],[170,145],[-15,100],[-135,155],[-100,20]];
const SAMPLE_COUNT = 128;
let KEEP = 9;
let PHASE = 0.17;
let samples, terms;

function setup() {
  createCanvas(960, 540);
  pixelDensity(1);
  noLoop();
  samples = resampleClosed(OUTLINE, SAMPLE_COUNT);
  terms = coefficients(samples);
  describe('A coral closed Fourier curve, a gray source outline, and a chain of gold circles.');
}

function draw() {
  background('#101d30');
  translate(width / 2, height / 2);
  noFill();
  stroke('#3a5266'); strokeWeight(1);
  beginShape();
  for (const p of OUTLINE) vertex(...p);
  endShape(CLOSE);
  const selected = terms.slice(0, KEEP);
  stroke('#ff8f78'); strokeWeight(2.5);
  beginShape();
  for (let i = 0; i < 512; i++) vertex(...pointAt(selected, i / 512));
  endShape(CLOSE);
  let x = 0, y = 0;
  for (const c of selected) {
    const [dx, dy] = pointAt([c], PHASE);
    stroke('#b8a36b'); strokeWeight(0.7);
    if (c.freq !== 0) circle(x, y, 2 * c.amp);
    line(x, y, x + dx, y + dy);
    x += dx; y += dy;
  }
  noStroke(); fill('#fff2c5'); circle(x, y, 7);
  const squared = samples.reduce((sum, p, i) => {
    const q = pointAt(selected, i / SAMPLE_COUNT);
    return sum + (p[0]-q[0])**2 + (p[1]-q[1])**2;
  }, 0);
  window.result = {keep: KEEP, phase: PHASE, samples: SAMPLE_COUNT,
    rms: Math.sqrt(squared / SAMPLE_COUNT), endpoint: [x,y]};
}

function keyPressed() {
  if (key === 's' || key === 'S') saveCanvas('fourier-drawing', 'png');
}
```

Python 3가 설치되어 있다면 파일을 저장한 폴더에서 다음 명령을 실행하고 `http://localhost:8000/`을 연다. 종료는 터미널에서 Ctrl+C다. 그림을 클릭하고 S키를 누르면 [saveCanvas](https://p5js.org/reference/p5/saveCanvas/)가 PNG 저장을 요청한다. 브라우저 설정에 따라 다운로드되거나 저장 대화상자가 열린다.

```bash
python3 -m http.server 8000
```

![9개 푸리에 성분으로 복원한 산호색 윤곽선과 금색 회전원 사슬의 실제 실행 화면](images/fourier-frame.png)

*128개 표본, KEEP 9, PHASE 0.17로 그린 960×540 실행 결과. 같은 설정의 재실행과 S키 저장 파일이 일치함을 확인했다.*

## 성분을 줄이면 무엇이 남는가

`KEEP`을 바꾸고 새로고침하면 같은 다각형의 다른 해석이 나온다. 아래 수치는 실제 실행에서 얻었다. RMS 오차는 원본 표본과 같은 순서의 합성 좌표 사이 거리 제곱을 평균한 뒤 제곱근을 취한 값이다. 현재 좌표를 화면에 그대로 그리므로 단위는 픽셀이다. 인접한 선까지의 최단거리나 사람의 시각적 유사도를 뜻하지 않는다.

| KEEP | 표본 위치의 RMS 오차 | 화면에서 본 차이 |
|---|---:|---|
| 3 | 약 25.73px | 큰 굴곡은 남지만 안으로 들어간 부분이 많이 사라진다 |
| 9 | 약 10.34px | 여러 굴곡이 드러나면서 꼭짓점이 둥글게 바뀐다 |
| 31 | 약 1.51px | 원본의 모서리와 오목한 부분에 더 가까워진다 |
| 128 | 0.000000001px 미만 | 표본 위치를 부동소수점 오차 수준에서 복원한다 |

전체 성분을 썼다고 원본 다각형의 모든 위치가 똑같아지는 것은 아니다. 검증한 복원 대상은 128개 표본이다. 표본 사이에는 삼각함수로 보간한 곡선이 놓이고, 화면은 그것을 다시 512개 점의 선분으로 그린다. 모서리 근처의 작은 흔들림까지 원본의 일부라고 오해하지 않아야 한다.

`PHASE`를 바꾸면 전체 산호색 궤적은 유지되고 사슬과 끝점이 옮겨 간다. 애니메이션을 만든다면 이 값을 시간에 따라 증가시키는 것이 다음 단계다. 이 글에서는 영상 내보내기나 재생 성능을 검증하지 않았다. 우선 정지 화면에서 사슬이 어떤 구조인지 보고, 원을 숨길 때 선 자체가 충분히 흥미로운지 판단해 볼 수 있다.

`OUTLINE`의 꼭짓점은 자신의 닫힌 스케치로 바꿀 수 있다. 시작과 끝이 떨어진 열린 선을 넣으면 코드가 그 사이를 직선으로 닫는다. 그 선도 변환 대상에 포함되므로 의도하지 않은 가로지름이 생길 수 있다. 여러 개의 떨어진 획을 한 목록으로 이어 붙이는 경우도 마찬가지다. 한 획의 닫힌 외곽부터 시작하는 편이 결과를 읽기 쉽다.

## 그럴듯한 원보다 복원되는 점을 확인한다

AI가 그린 원 사슬은 계산이 틀려도 설득력 있어 보일 수 있다. 정규화를 두 번 하면 그림이 너무 작아지고, 변환 부호를 바꾸면 다른 방향으로 진행한다. 특히 배열의 뒤쪽 성분을 모두 큰 양의 주파수로 해석하면 원래 표본에서는 맞아 보여도 표본 사이에서 불필요하게 여러 번 회전한다. 그래서 역방향 원의 중간 위치까지 확인해야 한다.

이 구현은 직사각형의 거리별 표본, 중복 꼭짓점 처리, 정방향 원과 역방향 원, 전체 좌표 복원과 주기 연결, 성분 추가에 따른 표본 RMS 오차 감소를 검사했다. 계산 검사 6개와 브라우저의 성분 수 비교, 반복 PNG 일치, 실제 저장 동작을 확인했다. 사용자가 바꾼 모든 윤곽선의 모양이나 전시 환경의 성능까지 보장하는 검사는 아니다.

계산량도 작품의 규모에 맞춰 생각해야 한다. 이 코드는 이해하기 쉬운 직접 DFT라 표본 수의 제곱에 비례해 계산이 늘어난다. 현재 128개 표본에서는 한 번 계산하고 정지 화면을 그리지만, 매우 긴 손그림을 실시간으로 분석하려면 표본 수와 계산 방식을 다시 정해야 한다.

오차를 줄이는 것만이 제작 목표는 아니다. 이 예제의 9개 성분은 원본의 모서리를 잃는 대신 부드러운 긴장을 만든다. 더 많은 원을 붙이는 선택과, 선의 성격이 살아 있는 지점에서 멈추는 선택은 다른 작품으로 이어진다. AI가 계산을 도와줄수록, 무엇을 정확히 복원하고 무엇을 일부러 덜어낼지 결정하는 일이 더 또렷해진다.
