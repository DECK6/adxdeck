---
type: article
track: media-art
mediaArtCategory: 기술·제작
title: 모서리를 얼마나 남길까, AI와 만드는 차이킨 곡선
description: 같은 다각형에 차이킨 모서리 깎기를 반복하며 부드러움과 형태 보존 사이의 차이를 살펴봅니다. AI에 전달할 계산 조건, p5.js 전체 예제, 점 개수와 면적 비교를 통해 작품의 윤곽을 고르는 방법을 다룹니다.
aliases:
  - Rounding Generative Polygons with AI and Chaikin
author: 육대근
date created: 2026-11-23
date modified: 2026-11-23
tags:
  - article
  - media-art
  - generative-art
  - creative-coding
  - p5js
  - AI
thumbnail: images/chaikin-cover.png
status: completed
akmLayer: output
akmType: output
akmRole: deliverable
trustLevel: reviewed
sourceType: synthesis
---

# 모서리를 얼마나 남길까, AI와 만드는 차이킨 곡선

![각진 다각형과 모서리를 다듬은 윤곽을 나란히 배치한 개념 일러스트](images/chaikin-cover.png)

*표지는 GPT Image 2로 만든 개념 일러스트입니다. 본문 아래의 비교 이미지는 p5.js 예제를 실제 실행한 결과입니다.*

AI에게 “이 선을 더 부드럽게 만들어 줘”라고 요청하면 매끈한 결과를 얻기는 쉽다. 그러나 그 과정에서 어떤 모서리가 사라졌는지, 원래 도형의 크기가 얼마나 달라졌는지는 놓치기 쉽다. 작품의 윤곽에서 꺾이는 지점은 오류일 수도 있지만, 긴장과 방향을 만드는 중요한 부분일 수도 있다.

이번에는 닫힌 다각형 하나를 정하고, 모서리를 깎는 규칙을 반복한다. 같은 원본을 그대로 둔 모습, 한 번 다듬은 모습, 네 번 다듬은 모습을 나란히 그린다. 세 그림의 축척을 같게 유지하면 부드러움뿐 아니라 안쪽으로 물러난 윤곽도 읽을 수 있다.

AI는 이 규칙을 구현하고 검사를 만드는 보조 도구로 사용한다. 화면의 좌표는 고정된 알고리즘이 계산한다. 생성형 AI에게 매번 새로운 실루엣을 받는 과정과, AI가 작성한 코드를 통해 같은 형태를 재현하는 과정은 구분해 두는 편이 좋다.

## 선을 더하는데 모서리는 줄어든다

차이킨(Chaikin)의 모서리 깎기는 각 선분 위에 두 점을 놓는 간단한 규칙에서 시작한다. 선분의 시작점을 `A`, 끝점을 `B`라고 하면 새 점은 `Q = 0.75A + 0.25B`, `R = 0.25A + 0.75B`다. 좌표의 가로·세로 성분에 같은 계산을 적용한다. 두 점은 선분의 `1/4`과 `3/4` 위치에 놓인다.

[CRAN의 smoothr 공식 문서](https://search.r-project.org/CRAN/refmans/smoothr/html/smooth_chaikin.html)는 이 반복 방식과 닫힌 도형의 끝을 연결하는 처리를 설명한다. 아래 예제는 R 패키지를 실행하는 대신 같은 기본 규칙을 JavaScript로 구현한다. 열린 선의 끝점 처리까지 다루지 않고, 시작점을 중복해서 넣지 않은 닫힌 다각형으로 범위를 제한한다.

각 변에서 나온 `Q`, `R`을 순서대로 연결하면 원래 꼭짓점의 양쪽이 잘린다. 마지막 변도 마지막 점에서 첫 점으로 이어지므로 틈 없이 한 바퀴를 돈다. 이 결과에 같은 계산을 다시 적용하면 짧은 선분이 늘고 모서리 변화는 작아진다. 화면에서는 곡선처럼 보이지만, 이 코드가 실제로 그리는 것은 유한 개의 직선 조각이다.

새 점의 가중치는 모두 양수이고 합이 `1`이다. 따라서 새 점은 계산에 사용한 선분 위에 놓이며, 반복해도 원본 점들을 둘러싼 볼록껍질 밖으로 나가지 않는다. 하지만 원래 꼭짓점을 통과하도록 보존하는 방식은 아니다. 특히 이번 볼록 다각형에서는 모서리 부근의 면적이 줄어든다. 도형의 크기를 매번 다시 맞추면 이 변화가 가려지므로, 비교 그림에서는 자동 크기 보정을 하지 않는다.

## AI에게 부드러움 대신 비교 조건을 건네기

구현을 요청할 때는 “매끈한 곡선”이라는 결과 설명에 계산 조건을 더한다. 입력 좌표를 덮어쓰지 않을 것, 닫힌 마지막 변을 처리할 것, 각 단계에서 나온 점을 다음 단계의 입력으로 사용할 것이 핵심이다. 원본을 바꿔 버리면 나중에 그리는 비교 패널도 이미 다듬어진 형태에서 출발할 수 있다.

다음은 독자가 활용할 수 있도록 정리한 요청 예시다. 특정 모델의 실제 응답을 그대로 옮긴 인용문은 아니다.

```text
p5.js 2.4.0으로 960×540 정지 비교 화면을 만들어 줘.
동일한 닫힌 8점 다각형을 0회, 1회, 4회 다듬어 나란히 보여 줘.
차이킨 규칙은 각 변에서 1/4, 3/4 위치의 점을 만드는 것으로 고정해 줘.
마지막 점에서 첫 점으로 가는 변도 처리하고 입력 배열은 바꾸지 마.
각 패널에 회색 원본 윤곽과 색이 있는 결과 윤곽을 같은 축척으로 그려 줘.
점 개수와 원본 대비 면적 비율을 표시하되 자동 크기 보정은 하지 마.
계산 함수는 별도 파일에 두고 S 키로 전체 화면을 PNG로 저장해 줘.
```

작은 사각형으로 계산을 먼저 확인하면 화면만 볼 때 놓치는 오류를 찾기 쉽다. `(0,0)`에서 `(10,0)`으로 가는 변의 새 점은 `(2.5,0)`, `(7.5,0)`이다. 한 변이 `10`인 정사각형 전체를 한 번 다듬으면 네 모서리에서 직각삼각형이 잘린다. 면적은 `100`에서 `87.5`가 된다. 이 수치는 어떤 다각형에나 적용되는 비율이 아니라 이 정사각형의 검사값이다.

이번 구현은 좌표와 닫힘, 복사본의 독립성, 점 개수, 정사각형 면적, 이동·확대와 계산의 일관성, 입력 거부와 좌표 범위를 묶은 검사 `6`개를 통과했다. 검사는 규칙을 잘 옮겼는지 확인한다. 어느 단계가 작품에 더 어울리는지는 실제 크기로 비교해야 한다.

## 원본을 남긴 채 세 단계 그리기

빈 폴더에 아래 세 파일을 저장한다. [p5.js 공식 다운로드 페이지](https://p5js.org/download/)에서 확인한 권장 버전 `2.4.0`을 고정했다. 라이브러리를 처음 읽을 때 인터넷 연결이 필요하다. 별도 이미지나 유료 생성 서비스 없이 실행할 수 있다.

`index.html`은 p5.js와 계산 함수, 화면 코드를 순서대로 불러온다.

```html
<!doctype html>
<html lang="ko">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Chaikin corner study</title>
<style>body{margin:0;background:#14212b}canvas{display:block;max-width:100%;height:auto;margin:auto}</style>
<main></main>
<script src="https://cdn.jsdelivr.net/npm/p5@2.4.0/lib/p5.min.js"></script>
<script src="chaikin.js"></script>
<script src="sketch.js"></script>
</html>
```

`chaikin.js`는 좌표 배열을 받아 새 배열을 돌려준다. 시작점을 끝에 한 번 더 넣으면 길이가 0인 변이 추가되므로 이 구현에서는 거부한다. 반복 횟수는 `0`부터 `8`까지 정수로 제한했다. 임의로 큰 반복을 요청해 점이 급격히 늘어나는 일을 줄이기 위한 예제의 제한이다. 입력 다각형의 자기 교차까지 판정하는 함수는 아니다.

```javascript
function refineClosed(points, rounds) {
  if (!Number.isInteger(rounds) || rounds < 0 || rounds > 8) {
    throw new RangeError('Use 0 to 8 whole rounds.');
  }
  if (!Array.isArray(points) || points.length < 3 ||
      !points.every(p => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite)) ||
      (points[0][0] === points.at(-1)[0] && points[0][1] === points.at(-1)[1])) {
    throw new TypeError('Use at least 3 finite points; do not repeat the first point.');
  }
  let current = points.map(p => [...p]);
  for (let step = 0; step < rounds; step++) {
    const next = [];
    for (let i = 0; i < current.length; i++) {
      const a = current[i];
      const b = current[(i + 1) % current.length];
      next.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]]);
      next.push([0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
    }
    current = next;
  }
  return current;
}
```

`sketch.js`에서는 원본 점 `8`개와 반복 횟수만 정한다. [beginShape()](https://p5js.org/reference/p5/beginShape/)와 `vertex()`로 선을 연결하고, [endShape(CLOSE)](https://p5js.org/reference/p5/endShape/)로 마지막 선분을 닫는다. 이동은 도형을 그리기 전에 적용한다. 면적 계산은 인접 좌표의 외적을 더하는 방식이며, 아래처럼 자기 교차가 없는 단순 다각형의 면적 비교에 사용한다.

```javascript
const CONTROL = [[0,-110],[80,-80],[120,0],[85,95],
                 [0,120],[-95,65],[-115,-15],[-65,-95]];
const ROUNDS = [0, 1, 4];
function polygonArea(points) {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    sum += a[0] * b[1] - a[1] * b[0];
  }
  return Math.abs(sum) / 2;
}
function outline(points) {
  beginShape();
  for (const [x, y] of points) vertex(x, y);
  endShape(CLOSE);
}
function setup() {
  createCanvas(960, 540).parent(document.querySelector('main'));
  pixelDensity(1);
  noLoop();
  describe('One polygon shown with zero, one and four corner-cutting rounds.');
}
function draw() {
  background('#14212b');
  textFont('monospace'); textAlign(CENTER, CENTER);
  noStroke(); fill('#f1ecdf'); textSize(20);
  text('HOW MUCH CORNER SHOULD REMAIN?', width / 2, 58);
  const colors = ['#e7b780', '#73c9c2', '#ef9a86'];
  ROUNDS.forEach((rounds, i) => {
    const points = refineClosed(CONTROL, rounds);
    push(); translate(160 + i * 320, 260);
    noFill(); stroke('#50616c'); strokeWeight(1); outline(CONTROL);
    stroke(colors[i]); strokeWeight(2.5); outline(points);
    if (rounds <= 1) {
      noStroke(); fill(colors[i]);
      for (const [x, y] of points) circle(x, y, 5);
    }
    pop();
    noStroke(); fill(colors[i]); textSize(16);
    text('ROUNDS ' + rounds + ' / ' + points.length + ' POINTS', 160 + i * 320, 426);
    fill('#b6c6cf'); textSize(13);
    const ratio = 100 * polygonArea(points) / polygonArea(CONTROL);
    text('AREA ' + ratio.toFixed(2) + '%', 160 + i * 320, 458);
  });
  fill('#b6c6cf'); textSize(12);
  text('Same scale / Gray: original outline / S: save PNG', width / 2, 506);
}
function keyPressed() {
  if (key === 's' || key === 'S') saveCanvas('chaikin-study', 'png');
}
```

Python 3이 있다면 세 파일이 들어 있는 폴더에서 아래 명령을 실행하고 `http://127.0.0.1:8000`을 연다.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

화면의 회색 선은 각 패널의 원본이다. 색이 있는 선은 해당 반복 횟수의 결과다. 앞의 두 패널에는 점도 표시하고, 점이 촘촘해지는 마지막 패널에서는 선의 흐름을 보기 위해 점 표시를 생략했다. 캔버스를 클릭하고 `S`를 누르면 [saveCanvas()](https://p5js.org/reference/p5/saveCanvas/)로 `chaikin-study.png`가 저장된다. 픽셀 밀도를 `1`로 고정해 저장 크기는 `960×540`이다. 웹페이지에서 작게 표시되는 크기와 파일의 픽셀 크기는 다를 수 있다.

## 매끈함을 얻는 만큼 무엇을 잃었는가

![같은 팔각형의 원본과 차이킨 1회·4회 결과를 같은 축척으로 비교한 실제 실행 화면](images/chaikin-frame.png)

실제 실행에서 얻은 값은 다음과 같다. 면적 비율은 좌표로 계산한 원본 면적 `38700`을 기준으로 소수 둘째 자리까지 표시했다. 선의 두께나 화면의 안티앨리어싱 픽셀을 세어 얻은 수치는 아니다.

| 반복 횟수 | 점 개수 | 원본 대비 면적 |
|---|---:|---:|
| 0 | 8 | 100.00% |
| 1 | 16 | 96.31% |
| 4 | 128 | 95.09% |

한 번만 적용한 가운데 그림에는 아직 평평한 부분이 보인다. 원래의 방향 전환을 남기면서 모서리의 날카로움만 줄인 형태다. 네 번 적용한 오른쪽에서는 선이 훨씬 연속적으로 보이지만, 원본 꼭짓점이 갖던 방향감은 약해진다. 면적 차이가 작아 보여도 윤곽의 성격은 분명히 달라진다.

처음에는 `ROUNDS`의 마지막 값을 바꾸어 보자. 점 수는 닫힌 도형에서 매회 두 배가 되므로 원본이 `N`개이고 반복이 `k`회이면 `N × 2^k`개다. 이 예제의 `8`점을 `8`회 처리하면 `2048`점이 된다. 표시 크기에서 차이가 거의 보이지 않는데 반복만 더하는 것은 좋은 선택이 아닐 수 있다. 기존 RDP 방식으로 점을 덜어내는 일과 달리, 여기서는 점을 늘리며 원래 형상도 바꾼다.

다음에는 `CONTROL`의 점 하나를 옮겨 국소적인 돌출을 만들 수 있다. 원본에서 두드러진 방향이 반복 후 어느 정도 남는지 관찰한다. 손으로 그린 윤곽을 넣을 때도 같은 방법을 시도할 수 있지만, 점의 순서와 밀도, 중복된 시작점, 자기 교차를 먼저 살펴야 한다. 표의 면적 비율을 다른 입력에도 그대로 적용해서는 안 된다.

이 실행에서는 정지 화면과 `S` 저장을 확인했고, 같은 브라우저에서 새로고침한 PNG도 동일한 바이트로 재현됐다. 다른 브라우저의 글꼴과 선 렌더링, SVG 내보내기, 레이저 커팅이나 실제 출력 장비는 검증하지 않았다. 원본 꼭짓점을 정확히 통과해야 하는 로고나 치수가 중요한 도면이라면 이 방식이 요구를 충족하는지부터 따로 판단해야 한다.

작품의 윤곽에는 부드러운 부분과 멈칫하는 부분이 함께 있을 수 있다. AI에게 더 많은 반복을 주문하기보다, 같은 축척의 원본을 옆에 남겨 두고 어느 모서리를 잃어도 되는지 고르는 편이 도움이 된다.
