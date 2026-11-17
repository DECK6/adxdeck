---
type: article
track: media-art
mediaArtCategory: 기술·제작
title: 색을 늘이지 않고 흐르게 하기, AI와 만드는 픽셀 정렬
description: 직접 만든 색면의 픽셀을 밝기 구간별로 재배열합니다. p5.js 실행 예제로 AI 코드의 행 경계와 색 보존을 확인하고, 임계값과 정렬 방향이 이미지의 흐름을 바꾸는 과정을 비교합니다.
aliases:
  - Reordering Color with AI and Pixel Sorting
author: 육대근
date created: 2026-11-18
date modified: 2026-11-18
tags:
  - article
  - media-art
  - generative-art
  - creative-coding
  - p5js
  - AI
thumbnail: images/pixel-sort-cover.png
status: completed
akmLayer: output
akmType: output
akmRole: deliverable
trustLevel: reviewed
sourceType: synthesis
---

# 색을 늘이지 않고 흐르게 하기, AI와 만드는 픽셀 정렬

![어두운 여백 사이로 산호색과 청록색 픽셀 띠가 수평으로 흐르는 추상 이미지](images/pixel-sort-cover.png)

*표지는 GPT Image 2로 생성한 개념 이미지입니다. 아래 비교 화면은 본문 코드의 실제 실행 결과입니다.*

색이 옆으로 흘러내린 듯한 이미지를 만들 때, 픽셀을 복제하거나 흐리게 섞을 필요는 없다. 이미 있는 색의 순서만 바꿔도 밝은 부분이 한쪽으로 몰리고 경계에 방향감이 생긴다. 이번에는 직접 만든 물결 색면을 재료로 삼아 **어디까지 재배열하고 어디를 그대로 남길지** 결정하는 픽셀 정렬을 구현한다.

결과물은 원본과 두 임계값을 나란히 놓은 정지 화면이다. AI는 규칙을 코드로 옮기고 작은 반례를 만드는 데 활용한다. 실행되는 그림은 생성형 AI의 추론 결과가 아니라 좌표와 정렬 규칙이 만드는 제너러티브 이미지다. 이렇게 역할을 나누면 마음에 들지 않는 결과가 나왔을 때 프롬프트뿐 아니라 구간·기준·방향을 직접 고칠 수 있다.

## 흐르는 색보다 먼저, 움직이지 않을 경계를 정한다

이 예제는 각 가로줄을 왼쪽부터 읽는다. 픽셀의 빨강·초록·파랑 중 가장 큰 값이 임계값 이상이면 정렬 구간에 넣고, 그보다 어두운 픽셀을 만나면 구간을 닫는다. 닫힌 구간 안에서만 색을 어두운 쪽부터 밝은 쪽으로 나열한다. 다음 줄로 넘어갈 때도 반드시 구간을 닫는다.

여기서 사용하는 밝기 기준은 `max(R, G, B)`다. 값의 범위는 0부터 255이며, 색의 한 채널이라도 강하면 높은 값이 된다. 이는 물리적 휘도나 사람이 느끼는 밝기를 정확히 나타내는 값이 아니다. 예를 들어 빨강이 강한 픽셀과 중간 회색의 순서는 다른 밝기 공식에서 달라질 수 있다. 이 글에서는 계산과 화면의 관계를 읽기 쉽게 한 기준으로 고정한다.

정렬할 때는 빨강·초록·파랑·알파를 하나의 묶음으로 옮긴다. 채널을 따로 정렬하면 원래 없던 색이 생긴다. 묶음을 그대로 옮기면 각 구간의 색 목록과 투명도는 보존되고 위치만 바뀐다. 임계값 아래의 픽셀은 제자리에 남으므로 어두운 틈이 움직임을 끊는 경계가 된다.

같은 구간 안에서는 모든 픽셀이 같은 규칙을 따른다. 그러나 구간의 길이와 시작 위치는 원본에 달려 있다. 제작자가 고르는 것은 단순히 효과의 세기가 아니라 **어느 부분을 하나의 흐름으로 취급할 것인가**다. 임계값을 아주 낮추면 서로 떨어져 보이던 색면까지 한 줄에서 섞인다.

## AI에게 규칙을 주고, 작은 화면에서 실행한다

다음 요청은 구현을 시작할 때 사용할 수 있는 예시다. 반환 코드를 그대로 믿기보다, 행 마지막 픽셀과 어두운 경계가 어떻게 처리되는지 함께 확인하는 편이 좋다.

```text
p5.js 2.4.0에서 픽셀 정렬 비교 화면을 만들고 싶다.
사진 대신 사인·코사인 함수로 240×240 RGBA 색면을 만들어라.
각 행에서 max(R,G,B)가 임계값 이상인 연속 구간만 정렬한다.
기본 방향은 오름차순이며 내림차순도 선택할 수 있게 해라.
RGBA 묶음은 보존하고 원본 배열은 수정하지 마라.
행 끝과 이미지 마지막에서 구간을 빠뜨리지 마라.
원본과 임계값 112, 184를 960×540 화면에 나란히 보여 주고
S키로 PNG를 저장하게 해라. 정렬 계산과 화면 코드는 나눠라.
임계값과 같은 픽셀, 한 픽셀 구간, 마지막 열, 같은 밝기를 검사해라.
```

브라우저와 텍스트 편집기를 준비한다. [공식 다운로드 페이지](https://p5js.org/download/)에서 확인한 p5.js 2.4.0으로 실행했다. 빈 폴더에 `index.html`, `sort.js`, `sketch.js`를 만든다. 아래 HTML은 고정 버전 CDN에서 라이브러리를 읽으므로 인터넷 연결이 필요하다. 별도 이미지 파일이나 AI API 키는 필요 없다.

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pixel sorting triptych</title>
  <style>body{margin:0;background:#10111b}canvas{display:block;max-width:100%;height:auto}</style>
  <script src="https://cdn.jsdelivr.net/npm/p5@2.4.0/lib/p5.min.js"></script>
  <script src="sort.js"></script>
  <script src="sketch.js"></script>
</head>
<body></body>
</html>
```

`sort.js`에는 화면과 무관한 계산을 넣는다. 입력은 픽셀마다 0부터 255까지의 RGBA 값이 차례로 들어 있는 배열이다. 가로·세로는 양의 정수이고 배열 길이는 가로×세로×4여야 한다. 임계값은 0부터 255까지의 유한한 수다. 같은 밝기의 픽셀은 원래 순서를 유지한다. 알파 값은 정렬 기준에는 넣지 않고 색과 함께 이동시킨다.

```js
function sortRows(source, width, height, threshold, descending = false) {
  if (!Number.isInteger(width) || !Number.isInteger(height) ||
      width < 1 || height < 1 || source.length !== width * height * 4 ||
      !Number.isFinite(threshold) || threshold < 0 || threshold > 255) {
    throw new RangeError('Check dimensions and threshold (0..255).');
  }
  const out = new Uint8ClampedArray(source);
  const value = i => Math.max(source[i], source[i + 1], source[i + 2]);
  for (let y = 0; y < height; y++) {
    let x = 0;
    while (x < width) {
      if (value(4 * (y * width + x)) < threshold) { x++; continue; }
      const start = x;
      const run = [];
      while (x < width && value(4 * (y * width + x)) >= threshold) {
        const i = 4 * (y * width + x);
        run.push([source[i], source[i + 1], source[i + 2], source[i + 3]]);
        x++;
      }
      run.sort((a, b) => (descending ? -1 : 1) *
        (Math.max(a[0], a[1], a[2]) - Math.max(b[0], b[1], b[2])));
      run.forEach((rgba, k) => out.set(rgba, 4 * (y * width + start + k)));
    }
  }
  return out;
}
```

`sketch.js`는 원본 색면을 만들고 세 장의 이미지를 배치한다. `makeField()`가 좌표마다 색을 계산하므로 외부 사진과 난수가 없어 같은 조건에서 같은 입력을 얻는다. 각 패널의 실제 데이터는 240×240이고 화면에는 288×288로 표시된다. 화면 전체 PNG는 960×540이다.

이미지의 픽셀 배열을 다루기 전에는 [loadPixels](https://p5js.org/reference/p5.Image/loadPixels/)를 호출하고 변경 뒤에는 `updatePixels()`를 호출한다. [이미지의 pixelDensity](https://p5js.org/reference/p5.Image/pixelDensity/)와 캔버스 밀도를 1로 맞춰 데이터의 크기와 출력 크기를 분명히 했다. 화면을 크게 표시하는 것과 원본 데이터의 해상도를 높이는 것은 다른 작업이다.

```js
const SIZE = 240;
const LOW = 112, HIGH = 184;
const DESCENDING = false;

function makeField(n) {
  const rgba = new Uint8ClampedArray(n * n * 4);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const u = x / n, v = y / n;
      const bend = u + 0.15 * Math.sin(v * 9);
      const light = 0.12 + 0.88 * Math.pow(
        0.5 + 0.5 * Math.sin(bend * 24 + v * 7), 1.6);
      const phase = bend * 7 - v * 5;
      const rgb = [0, 2.1, 4.2].map(offset =>
        Math.round(255 * light * (0.32 + 0.68 * (0.5 + 0.5 * Math.cos(phase + offset)))));
      rgba.set([...rgb, 255], 4 * (y * n + x));
    }
  }
  return rgba;
}

function asImage(rgba) {
  const img = createImage(SIZE, SIZE);
  img.pixelDensity(1);
  img.loadPixels();
  img.pixels.set(rgba);
  img.updatePixels();
  return img;
}

function setup() {
  createCanvas(960, 540);
  pixelDensity(1);
  noSmooth();
  noLoop();
  background('#10111b');
  const source = makeField(SIZE);
  const panels = [source,
    sortRows(source, SIZE, SIZE, LOW, DESCENDING),
    sortRows(source, SIZE, SIZE, HIGH, DESCENDING)];
  const labels = ['ORIGINAL', `THRESHOLD ${LOW}`, `THRESHOLD ${HIGH}`];
  fill('#e4e2dd');
  noStroke();
  textFont('monospace');
  textSize(14);
  panels.forEach((rgba, i) => {
    const left = 24 + i * 312;
    image(asImage(rgba), left, 126, 288, 288);
    text(labels[i], left, 103);
  });
  fill('#a2a5b5');
  text(DESCENDING ? 'BRIGHT TO DARK' : 'DARK TO BRIGHT', 24, 459);
  text('S: SAVE PNG', 24, 486);
}

function keyPressed() {
  if (key === 's' || key === 'S') saveCanvas('pixel-sorting', 'png');
}
```

Python 3가 있다면 파일을 저장한 폴더에서 다음 명령을 실행하고 `http://localhost:8000/`을 연다. 실행을 마치면 터미널에서 Ctrl+C로 서버를 끝낸다. 화면을 클릭한 뒤 S키를 누르면 [saveCanvas](https://p5js.org/reference/p5/saveCanvas/)가 PNG 저장을 요청한다. 브라우저에 따라 바로 내려받거나 저장 대화상자가 열릴 수 있다.

```bash
python3 -m http.server 8000
```

![원본 물결 색면과 임계값 112 및 184로 픽셀을 정렬한 세 패널의 실제 실행 화면](images/pixel-sort-frame.png)

*왼쪽은 원본, 가운데는 임계값 112, 오른쪽은 184다. 같은 환경에서 새로고침한 PNG와 S키로 저장한 PNG가 일치함을 확인했다.*

## 임계값은 움직이는 영역, 방향은 빛의 위치를 바꾼다

`LOW`와 `HIGH`를 바꾸고 새로고침하면 다른 두 임계값을 비교할 수 있다. 아래는 현재 원본의 57,600개 픽셀에서 직접 계산한 값이다. 정렬 대상으로 선택됐더라도 이미 순서가 맞거나 같은 색끼리 바뀌면 화면의 색은 달라지지 않는다. 따라서 선택된 수와 실제 RGB 값이 달라진 위치 수를 구분했다.

| 임계값 | 정렬 대상 픽셀 | RGB가 달라진 위치 | 이 원본에서의 결과 |
|---|---:|---:|---|
| 0 | 57,600 | 57,349 | 행 전체가 한 구간이 되어 물결의 어두운 경계도 사라진다 |
| 112 | 26,471 | 24,651 | 밝은 띠의 넓은 부분이 재배열되어 한쪽 가장자리가 또렷해진다 |
| 184 | 15,649 | 14,542 | 더 밝은 중심부에 변화가 모이고 주변의 원본이 많이 남는다 |
| 255 | 101 | 0 | 최고 값인 픽셀은 선택되지만 이 입력에서는 색 변화가 없다 |

임계값 255에서는 최대 채널 값이 255인 픽셀만 선택된다. 서로 다른 색이어도 정렬 값은 모두 같고, 이 구현은 같은 값의 순서를 유지하므로 원본이 바뀌지 않는다. 이는 현재의 최대 채널 기준과 안정적인 정렬에 따른 결과다. 다른 기준을 추가하거나 같은 값의 순서를 섞는 방식으로 바꾸면 다시 확인해야 한다.

`DESCENDING`을 `true`로 바꾸면 밝은 픽셀이 각 구간의 왼쪽으로 모인다. 기본값에서는 오른쪽으로 모인다. 원본 전체를 좌우 반전하는 기능은 아니다. 어두운 경계의 위치는 유지한 채 구간 내부의 진행 방향을 바꾸므로, 같은 물결이 서로 다른 쪽에서 빛을 받는 듯한 인상을 줄 수 있다. 내림차순 화면도 직접 실행해 비교했다.

`makeField()` 안의 `bend`는 물결의 휘어짐, `light`는 밝고 어두운 띠, `phase`는 색의 변화를 만든다. 처음에는 이 셋을 동시에 바꾸지 말고 정렬 임계값부터 비교해 보는 편이 좋다. 원본과 규칙을 함께 바꾸면 무엇 때문에 결과가 달라졌는지 판단하기 어렵다.

사진으로 확장하려면 원본을 불러오고 같은 크기의 RGBA 배열을 얻는 과정이 추가로 필요하다. 투명한 이미지에서는 화면에 보이는 밝기와 원시 RGB의 최대값이 다를 수 있어 배경 합성 여부도 정해야 한다. 이번 예제와 검증은 불투명한 절차적 색면에 한정하며, 사진 입력·세로 정렬·영상 처리는 구현하지 않았다.

## AI 코드가 색을 보존했는지 확인한다

픽셀 효과는 작은 오류도 그럴듯한 무늬로 보인다. 마지막 열을 빼먹으면 가장자리만 덜 변하고, 행 구분을 잊으면 다음 줄의 색이 섞인다. 원본 배열을 직접 정렬한 뒤 두 번째 임계값을 적용하면 두 패널이 서로 다른 출발점에서 계산된다. 이런 오류는 보기 좋은 화면 하나만으로 알아채기 어렵다.

이 구현은 짧은 수열을 사용해 행 끝과 마지막 구간, 임계값과 같은 값, 어두운 경계, 한 픽셀 구간을 검사했다. RGBA 묶음과 원본 배열의 보존, 내림차순에서 같은 밝기의 순서, 최대 채널 기준, 잘못된 크기와 임계값도 확인했다. 계산 검사 6개가 통과했고 브라우저에서 기본값·내림차순·극단 임계값, 반복 실행과 PNG 저장을 확인했다. 서로 다른 브라우저나 폰트 환경까지 PNG 바이트가 같다고 주장하는 검증은 아니다.

크기가 커지면 계산 부담도 달라진다. 이 구현은 구간마다 픽셀 묶음을 만들고 정렬하며, 결과 배열을 별도로 유지한다. 작은 정지 이미지에서 동작을 읽기 위한 구현이다. 큰 영상에 매 프레임 적용하려면 프레임 처리 시간과 메모리를 따로 측정해야 한다. 지금 얻은 정지 화면을 전시용 실시간 성능의 근거로 쓰지는 않는다.

좋은 결과가 언제나 더 많이 뒤섞인 화면인 것은 아니다. 이 색면에서는 어두운 틈을 남길 때 원래 물결과 재배열된 가장자리의 차이가 읽힌다. 틈을 지우면 색의 분포 자체가 전면에 나온다. AI에 맡길 수 있는 정렬 계산과, 작품에서 남기고 싶은 경계를 고르는 판단은 서로 이어지지만 같은 일은 아니다.
