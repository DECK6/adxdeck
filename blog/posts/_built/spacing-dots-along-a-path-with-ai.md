---
type: article
track: media-art
mediaArtCategory: 기술·제작
title: "곡선을 따라 같은 간격으로, AI와 만드는 점의 리듬"
description: "p5.js와 AI 코딩 보조로 열린 경로 위의 점을 같은 거리 간격으로 재배치한다. 누적 길이와 선형 보간을 구현하고, 입력 점의 밀도가 작품의 리듬에 미치는 영향을 비교한다."
aliases:
  - "Spacing Dots Along a Path with AI"
author: 육대근
date created: 2026-11-24
date modified: 2026-11-24
tags:
  - article
  - media-art
  - generative-art
  - creative-coding
  - p5js
  - AI
thumbnail: images/arc-spacing-cover.png
status: completed
akmLayer: output
akmType: output
akmRole: deliverable
trustLevel: reviewed
sourceType: synthesis
---

# 곡선을 따라 같은 간격으로, AI와 만드는 점의 리듬

![물결치는 선 위에서 점의 밀도와 간격이 달라지는 모습을 표현한 개념 표지](images/arc-spacing-cover.png)

*표지는 GPT Image 2로 생성한 개념 이미지다. 아래 실습 화면은 코드로 직접 그린 결과다.*

선 위에 점을 찍었는데 한쪽은 덩어리처럼 뭉치고 다른 쪽은 휑하다. 점의 크기와 색은 같은데 리듬이 다르다. 입력 좌표가 불균일하게 놓여 있다면, 배열에서 같은 개수씩 건너뛰어 점을 골라도 화면의 간격은 고르지 않다. 손으로 그린 궤적을 장식하거나 곡선을 따라 작은 빛을 배열할 때 마주치는 문제다.

이번에는 **경로를 따라 이동한 거리가 같은 지점에 점을 놓는다.** 입력 선과 점 개수는 유지하고, 위치를 고르는 기준만 바꾼다. 결과는 같은 물결 모양 위에 놓인 두 개의 점 드로잉이다. 왼쪽에는 입력 좌표를 그대로, 오른쪽에는 경로의 누적 길이를 기준으로 재배치한 좌표를 표시한다.

AI는 이 거리 계산을 작은 함수로 나누고 경계 조건을 검사하는 코딩 보조로 쓸 수 있다. 실제 점의 위치는 아래 공개된 규칙으로 계산한다. 생성형 AI가 매번 점의 좌표를 추측하는 방식은 아니다. 같은 코드와 입력이면 같은 결과를 만드는 알고리즘 기반 제너러티브 작업이다.

## 배열의 순서에서 선을 따라 잰 거리로

두 좌표 사이의 길이를 차례로 더하면 시작점에서 각 꼭짓점까지의 누적 거리가 생긴다. 전체 길이가 `L`이고 양 끝을 포함해 `N`개 점을 놓는다면 목표 간격은 `L / (N - 1)`이다. 각 목표 거리가 어느 선분 안에 있는지 찾고, 그 선분의 두 끝점을 선형 보간한다.

가령 경로가 `(0, 0) → (3, 0) → (3, 4)`라면 전체 길이는 7이다. 점 3개를 배치할 목표 거리는 0, 3.5, 7이다. 가운데 점은 첫 선분을 지나 두 번째 선분으로 0.5만큼 들어간 `(3, 0.5)`가 된다. 시작점과 가운데 점의 직선거리는 3.5보다 짧다. **여기서 같은 것은 꺾인 경로를 따라 잰 거리이며, 점과 점 사이의 직선거리가 아니다.** 모서리 부근에서 점이 조금 더 가까워 보여도 이 조건을 위반한 것은 아니다.

이 작업은 곡선을 부드럽게 만드는 처리와도 다르다. [차이킨 곡선 실습](https://dexa.art/blog/posts/rounding-generative-polygons-with-ai-and-chaikin/)은 모서리를 잘라 윤곽을 바꿨다. 이번 함수는 입력 선분 위에서 표시할 위치를 찾는다. 출력 점만 다시 직선으로 연결하면 중간 꼭짓점을 건너뛰어 모서리를 자를 수 있으므로, 비교 화면의 가는 선은 두 패널 모두 원래 경로로 그린다.

AI에게 요청할 때도 이 차이를 먼저 적으면 도움이 된다.

```text
p5.js에서 쓸 열린 2차원 폴리라인 재샘플링 함수를 작성해 줘.
입력은 유한한 [x, y] 좌표 배열과 양 끝을 포함한 점 개수다.
누적 선분 길이에 따라 같은 경로 거리 간격으로 점을 배치하고,
입력 배열을 바꾸지 마. 연속 중복 좌표는 건너뛰어 줘.
빈 배열은 빈 배열, 움직임이 없는 경로는 점 하나를 반환해 줘.
그리기와 거리 계산을 분리하고, 꺾인 경로의 손계산 예제로 검증해 줘.
보간으로 원래 곡선의 곡률을 복원했다고 설명하지 마.
```

프롬프트는 요구 조건이다. AI가 돌려준 함수가 그 조건을 만족하는지는 작은 숫자로 먼저 확인한다. 위의 직각 경로에서 가운데 점이 `(1.5, 2)`로 나오면 양 끝을 곧장 보간한 것이고, `(3, 0)`으로 나오면 거리 대신 입력 배열의 가운데 원소를 고른 것이다.

## 같은 경로에 점 41개를 놓아 보기

이 예제는 브라우저와 p5.js만 사용한다. [공식 다운로드 페이지](https://p5js.org/download/)에서 확인한 p5.js 2.4.0을 고정했다. 아래 세 파일을 같은 폴더에 저장한다. CDN으로 라이브러리를 읽으므로 처음 실행할 때 인터넷 연결이 필요하다. 마우스 입력 UI는 포함하지 않고, 불균일하게 샘플링한 물결 좌표를 코드로 만들어 비교한다.

먼저 `index.html`이다.

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>곡선을 따라 점 배치하기</title>
<style>body{margin:0;background:#111b25}canvas{display:block;max-width:100%;height:auto!important}</style>
<script src="https://cdn.jsdelivr.net/npm/p5@2.4.0/lib/p5.min.js"></script>
<script src="resample.js"></script>
<script src="sketch.js"></script>
</head>
<body></body>
</html>
```

다음은 `resample.js`다. 연속해서 같은 좌표가 들어오면 길이가 0인 선분을 제거한다. 사용할 점 개수는 2부터 5000까지로 제한했다. 빈 경로와 위치가 하나뿐인 경로에서는 요청한 개수를 억지로 채우지 않는다.

```javascript
function resample(points, count) {
  if (!Number.isInteger(count) || count < 2 || count > 5000) {
    throw new RangeError('count must be an integer from 2 to 5000');
  }
  if (!Array.isArray(points)) {
    throw new TypeError('points must be an array');
  }
  for (const p of points) {
    if (!Array.isArray(p) || p.length !== 2 ||
      !Number.isFinite(p[0]) || !Number.isFinite(p[1])) {
      throw new TypeError('points must contain finite [x, y] pairs');
    }
  }
  const p = points.filter((v, i) => i === 0 ||
    v[0] !== points[i - 1][0] || v[1] !== points[i - 1][1]);
  if (p.length < 2) return p.map(v => [...v]);
  const lengths = [0];
  for (let i = 1; i < p.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(
      p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
  }
  const total = lengths[lengths.length - 1];
  if (!Number.isFinite(total) || total === 0) {
    throw new RangeError('path length is outside the usable numeric range');
  }
  const out = [[...p[0]]];
  let j = 1;
  for (let k = 1; k < count - 1; k++) {
    const distance = total * (k / (count - 1));
    while (j < p.length - 1 && lengths[j] < distance) j++;
    const t = (distance - lengths[j - 1]) /
      (lengths[j] - lengths[j - 1]);
    out.push([
      p[j - 1][0] + t * (p[j][0] - p[j - 1][0]),
      p[j - 1][1] + t * (p[j][1] - p[j - 1][1])
    ]);
  }
  out.push([...p[p.length - 1]]);
  return out;
}
```

마지막은 `sketch.js`다. 입력 좌표의 매개변수에 제곱을 적용해 시작 쪽을 촘촘하게 만들었다. 양쪽의 가는 선은 동일한 입력 좌표로 그리며, 오른쪽 점만 `resample()`의 결과를 쓴다. [beginShape() 공식 문서](https://p5js.org/reference/p5/beginShape/)에 설명된 꼭짓점 경로 그리기를 사용한다.

```javascript
const COUNT = 41;
let original, spaced;
function setup() {
  createCanvas(960, 540);
  pixelDensity(1);
  noLoop();
  original = Array.from({ length: COUNT }, (_, i) => {
    const u = (i / (COUNT - 1)) ** 2;
    return [-175 + 350 * u,
      75 * Math.sin(2 * Math.PI * u) + 22 * Math.sin(6 * Math.PI * u)];
  });
  spaced = resample(original, COUNT);
  describe('The same wavy open path shown twice: clustered coral dots on the left and evenly path-spaced teal dots on the right.');
}
function draw() {
  background('#111b25');
  stroke('#314250');
  line(480, 80, 480, 460);
  panel(240, original, '#ff997f', 'INPUT SAMPLES');
  panel(720, spaced, '#78dfcf', 'EQUAL PATH DISTANCE');
}
function panel(cx, dots, ink, label) {
  push();
  translate(cx, 270);
  noFill();
  stroke('#536271');
  strokeWeight(1);
  beginShape();
  for (const p of original) vertex(p[0], p[1]);
  endShape();
  noStroke();
  fill(ink);
  for (const p of dots) circle(p[0], p[1], 6);
  textAlign(CENTER, CENTER);
  textSize(13);
  text(label, 0, -165);
  fill('#b9c7d2');
  text(`${dots.length} marks / same open path`, 0, 165);
  pop();
}
function keyPressed() {
  if (key === 's' || key === 'S') saveCanvas('arc-spacing', 'png');
}
```

파일을 둔 폴더에서 로컬 서버를 실행한다. 아래 명령은 Python 3가 설치된 환경을 전제로 한다.

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:8000/`을 연다. 그림을 한 번 클릭한 뒤 `S`를 누르면 `arc-spacing.png`가 저장된다. [saveCanvas() 공식 문서](https://p5js.org/reference/p5/saveCanvas/)의 PNG 저장 방식을 사용했다. 브라우저의 다운로드 설정에 따라 저장 확인 창이 나타날 수 있다.

![같은 물결 경로의 왼쪽에는 불균일한 입력 점 41개, 오른쪽에는 경로 거리를 기준으로 재배치한 점 41개가 놓인 실제 실행 화면](images/arc-spacing-frame.png)

위 화면은 p5.js 2.4.0에서 직접 실행한 960×540 결과다. 입력 경로의 길이는 약 522.506이며, 오른쪽의 목표 간격은 약 13.063이다. 왼쪽 시작 부분은 점이 겹치고 끝으로 갈수록 벌어진다. 오른쪽은 점의 지름과 개수를 바꾸지 않아도 선을 따라 반복되는 박자가 더 일정해진다.

직선·직각 경로, 중복 좌표, 빈 경로와 정지 경로, 잘못된 입력, 같은 선분을 다르게 나눈 입력을 다루는 테스트 6개를 통과했다. 브라우저에서는 양쪽 점 개수, 양 끝점, 960×540 출력과 `S` 저장을 확인했다. 직접 저장한 PNG와 새로고침 후 PNG의 해시도 같았다. 손그림 입력 장치나 실제 전시장 출력을 시험한 것은 아니다.

## 고른 박자를 어디까지 유지할 것인가

간격을 고르게 하면 입력 장치나 매개변수의 우연한 밀도 차이를 줄일 수 있다. 빛의 작은 단위가 같은 보폭으로 이동하는 인상을 만들거나, 선을 따라 놓는 반복 무늬의 기준점을 정할 때 유용하다. 반대로 원래 좌표가 손의 속도를 담은 기록이라면 재배치 과정에서 그 밀도 정보가 사라진다. 왼쪽의 뭉침이 긴장이나 머뭇거림으로 읽힌다면, 그것을 남기는 편이 작품에 더 맞을 수 있다.

이 예제의 `COUNT`를 바꾸면 입력 경로의 샘플 수도 함께 달라진다. 재배치할 점의 밀도만 비교하려면 입력은 그대로 두고 `spaced = resample(original, 81)`처럼 두 번째 인자만 바꾼다. 점을 많이 놓을수록 매끈한 선처럼 보이고, 적게 놓을수록 각각의 위치와 사이의 빈 공간이 두드러진다. 점의 크기를 키워 겹치게 만들기 전에 간격과 지름의 관계부터 살펴보는 편이 좋다.

입력 좌표가 성긴 경우에는 점을 많이 추가해도 잃어버린 곡선이 돌아오지 않는다. 함수는 입력 폴리라인의 길이를 계산한다. 그 뒤에 있다고 상상하는 매끈한 원곡선의 정확한 호 길이를 구한 것은 아니다. 먼저 입력을 충분히 촘촘하게 만들지, 각진 흔적을 그대로 쓸지 결정해야 한다. 닫힌 고리에서는 마지막 점과 첫 점 사이의 길이, 시작점 중복 여부까지 별도로 정해야 하므로 이 열린 경로 예제를 그대로 적용하지 않는다.

AI에게 다음 변형을 맡긴다면 색이나 효과를 한꺼번에 추가하기보다, 같은 거리 간격의 점을 작은 획으로 바꾸고 각 획을 경로의 진행 방향에 맞춰 회전시키는 것부터 시도할 수 있다. 그때는 모서리에서 방향을 어떻게 정할지가 새로운 선택이 된다. 이번 결과에서 먼저 볼 것은 점의 개수가 아니라, 어떤 거리 기준을 선택했을 때 선의 리듬이 작품의 의도에 가까워지는가이다.
