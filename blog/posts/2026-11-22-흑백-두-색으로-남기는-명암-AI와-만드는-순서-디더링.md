---
type: article
track: media-art
mediaArtCategory: 기술·제작
title: 흑백 두 색으로 남기는 명암, AI와 만드는 순서 디더링
description: 같은 회색 이미지를 고정 임계값과 베이어 행렬로 처리하며 흑백 픽셀의 배치로 명암을 만드는 방법을 살펴봅니다. AI에 요청할 계산 조건, p5.js 전체 예제, 저장과 출력에서 확인할 한계를 함께 다룹니다.
aliases:
  - Making Monochrome Tones with AI and Ordered Dithering
author: 육대근
date created: 2026-11-22
date modified: 2026-11-22
tags:
  - article
  - media-art
  - generative-art
  - creative-coding
  - p5js
  - AI
thumbnail: images/ordered-dither-cover.png
status: completed
akmLayer: output
akmType: output
akmRole: deliverable
trustLevel: reviewed
sourceType: synthesis
---

# 흑백 두 색으로 남기는 명암, AI와 만드는 순서 디더링

![흑백의 작은 정사각 픽셀로 원형 파동의 명암을 구성한 개념 이미지](images/ordered-dither-cover.png)

*표지는 GPT Image 2로 만든 개념 일러스트입니다. 본문 아래의 비교 이미지는 p5.js 예제를 실제 실행한 결과입니다.*

회색 이미지를 흑백 두 색으로 바꾸면 무엇이 사라질까. 모든 픽셀에 같은 기준을 적용하면 어두운 부분은 검정, 밝은 부분은 흰색이 된다. 윤곽은 선명해지지만, 완만하게 변하던 명암은 큰 덩어리로 잘린다. 단순해진 형태가 목적이라면 좋은 결과다. 그러나 빛이 번지는 느낌을 남기고 싶다면 다른 선택이 필요하다.

이번에는 픽셀마다 조금씩 다른 기준을 놓는다. 중간 밝기를 회색 한 칸으로 저장하는 대신 검정과 흰색 여러 칸의 배치로 표현한다. 가까이에서는 규칙적인 무늬가 보이고, 조금 떨어지면 명암의 변화로 읽힌다. 출력에 쓰인 색은 두 가지여도, 눈에 들어오는 형식은 두 덩어리에 머무르지 않는다.

AI에는 이 변환을 구현하고 비교하는 코드를 맡긴다. 이미지를 만드는 규칙과 결과를 고르는 판단은 분리한다. 생성형 AI가 매번 다른 그림을 그리는 방식이 아니라, AI의 도움으로 만든 결정론적 알고리즘을 작품의 도구로 쓰는 과정이다.

## 밝기를 버리는 대신 공간에 나누기

먼저 밝기를 `0`부터 `1` 사이의 값으로 표현한다. `0`은 검정, `1`은 흰색이다. 고정 임계값 방식은 값이 `0.5` 이상이면 흰색, 아니면 검정으로 정한다. 이때 `0.49`와 `0.01`은 모두 같은 검정이 된다. 작은 차이를 지우고 윤곽을 강조하는 방식이다.

순서 디더링(ordered dithering)은 위치에 따라 임계값을 바꾼다. 작은 임계값 배열을 이미지 전체에 반복해 깔고, 각 픽셀의 밝기를 그 위치의 값과 비교한다. [ImageMagick의 공식 설명](https://imagemagick.org/command-line-options/#ordered-dither)도 공간 임계값 맵을 이용하는 이 방식을 다룬다. 아래 코드는 그 명령을 호출하지 않고, 브라우저에서 원리를 살펴볼 수 있도록 직접 구현한 예제다.

여기서는 `4×4` 베이어(Bayer) 행렬을 쓴다. 행렬 안에는 `0`부터 `15`까지의 순위가 한 번씩 들어 있다. 순위가 낮은 위치부터 흰색으로 켜진다. 각 위치의 임계값은 `(순위 + 0.5) / 16`으로 정한다. 가장 낮은 값은 `1/32`, 가장 높은 값은 `31/32`다. 따라서 입력이 완전히 검거나 흴 때 끝값을 그대로 유지할 수 있다.

밝기가 같은 `4×4` 영역을 생각해 보자. 입력이 `0.25`이면 `16`칸 중 `4`칸, `0.5`이면 `8`칸, `0.75`이면 `12`칸이 흰색이 된다. 각 칸에 회색이 생긴 것은 아니다. 흰색이 차지하는 비율이 달라지면서 중간 밝기처럼 보이는 것이다.

이 설명은 균일한 밝기가 한 타일 안에 유지될 때 정확하다. 실제 이미지에서는 같은 타일 안에서도 밝기가 달라지므로, 모든 작은 영역의 평균이 원본과 정확히 같아진다고 보장하지 않는다. 또 수치의 평균과 사람이 느끼는 밝기는 같지 않다. 화면의 감마와 대비, 출력 크기까지 포함한 결과를 보고 판단해야 한다.

## AI에게 전달할 것은 필터 이름보다 비교 조건이다

“레트로한 흑백 이미지로 바꿔 줘”라는 요청만으로는 어떤 손실을 받아들일지 정하기 어렵다. AI가 임계값을 바꾸거나 노이즈를 추가하고, 원본까지 대비가 강하게 보정하면 결과 차이의 이유를 추적하기 어렵다. 입력을 하나로 고정하고 변환만 나누면 판단이 쉬워진다.

아래는 이번 예제를 바탕으로 독자가 사용할 수 있도록 정리한 요청이다. 특정 모델에서 그대로 받은 응답을 인용한 것은 아니다.

```text
p5.js 2.4.0으로 960×540 정지 비교 화면을 만들어 줘.
외부 사진 없이 원형 파동과 수평 그라데이션을 합친
256×256 회색 이미지를 계산해 같은 입력으로 사용해 줘.
왼쪽에는 원본, 가운데에는 임계값 0.5의 흑백 변환,
오른쪽에는 4×4 베이어 순서 디더링을 보여 줘.
임계값은 (행렬 순위 + 0.5) / 16으로 계산하고
입력이 임계값 이상이면 255, 아니면 0을 출력해 줘.
계산 함수를 화면 코드와 분리해 검사할 수 있게 해 줘.
난수는 쓰지 말고 S 키로 전체 비교 화면을 PNG로 저장해 줘.
```

코드가 나오면 눈으로 무늬를 보기 전에 작은 입력부터 확인한다. 검정이 검정으로 남는지, 흰색이 흰색으로 남는지, 절반 밝기에서 흰 칸이 절반인지 본다. 행과 열을 바꾸어 읽거나 나머지 연산을 잘못 쓰면 그럴듯하지만 의도와 다른 패턴이 생길 수 있다.

이번 예제에서는 좌표별 임계값과 순위 집합, 흑백 끝값, 중간 밝기의 흰 픽셀 수, 절반 밝기의 체커보드, 반복 주기와 경계 비교, 잘못된 입력 거부를 묶은 검사 `6`개를 실행했다. 검사는 계산 조건을 확인한다. 작품에 이 무늬를 남길지, 더 거칠게 드러낼지까지 결정해 주지는 않는다.

## 회색장 하나를 세 가지 방식으로 그리기

빈 폴더에 아래 세 파일을 저장한다. 제작 시 [공식 다운로드 페이지](https://p5js.org/download/)에서 확인한 권장 버전 `2.4.0`을 고정했다. 처음 p5.js를 불러올 때 인터넷 연결이 필요하며, 별도 사진이나 이미지 생성 서비스는 필요 없다.

`index.html`은 라이브러리와 두 스크립트를 순서대로 읽는다.

```html
<!doctype html>
<html lang="ko">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ordered dithering study</title>
<style>body{margin:0;background:#14212b}canvas{display:block;max-width:100%;height:auto}</style>
<script src="https://cdn.jsdelivr.net/npm/p5@2.4.0/lib/p5.min.js"></script>
<script src="dither.js"></script>
<script src="sketch.js"></script>
</html>
```

`dither.js`에는 행렬과 변환 규칙만 넣는다. 좌표는 이미지 왼쪽 위를 기준으로 한 음수가 아닌 정수다. 나머지 연산으로 가로·세로 `4`칸마다 같은 임계값을 반복한다. 같은 밝기와 같은 좌표가 들어오면 언제나 같은 결과가 나온다.

```javascript
const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

function thresholdAt(x, y) {
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0) {
    throw new RangeError('Use nonnegative integer coordinates.');
  }
  return (BAYER4[y % 4][x % 4] + 0.5) / 16;
}

function orderedPixel(value, x, y) {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError('Brightness must be between 0 and 1.');
  }
  return value >= thresholdAt(x, y) ? 255 : 0;
}
```

`sketch.js`는 같은 회색장을 세 번 계산하되 출력 방식만 바꾼다. 중심에서의 거리에 코사인을 적용해 고리를 만들고, 수평 방향의 변화도 더한다. 원본 패널은 값을 `0`부터 `255`까지 반올림해 표시하지만, 두 변환 패널의 판단에는 반올림 전의 같은 값을 사용한다. 가운데 패널과 오른쪽 패널의 이미지 픽셀은 오직 `0` 또는 `255`다. 배경과 글자까지 포함한 전체 비교 화면이 두 색뿐이라는 뜻은 아니다.

```javascript
const N = 256;
const FREQUENCY = 0.12;

function grayAt(x, y) {
  const radius = Math.hypot(x - (N - 1) / 2, y - (N - 1) / 2);
  const value = 0.5 + 0.32 * Math.cos(radius * FREQUENCY) +
                0.18 * (2 * x / (N - 1) - 1);
  return Math.max(0, Math.min(1, value));
}

function makePanel(mode) {
  const img = createImage(N, N);
  img.pixelDensity(1);
  img.loadPixels();
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const value = grayAt(x, y);
      const gray = mode === 0 ? Math.round(255 * value) :
                   mode === 1 ? (value >= 0.5 ? 255 : 0) :
                   orderedPixel(value, x, y);
      const i = 4 * (y * N + x);
      img.pixels[i] = img.pixels[i + 1] = img.pixels[i + 2] = gray;
      img.pixels[i + 3] = 255;
    }
  }
  img.updatePixels();
  return img;
}

function setup() {
  createCanvas(960, 540);
  pixelDensity(1);
  noLoop();
  noSmooth();
  describe('One grayscale ring field compared with a fixed binary threshold and ordered dithering.');
}

function draw() {
  background('#14212b');
  textFont('monospace');
  textAlign(CENTER, CENTER);
  fill('#eee8db');
  noStroke();
  textSize(19);
  text('TWO COLORS / MANY TONES', width / 2, 65);
  ['GRAYSCALE', 'THRESHOLD 0.5', 'BAYER 4 x 4'].forEach((label, mode) => {
    image(makePanel(mode), 32 + mode * 320, 142);
    textSize(15);
    text(label, 160 + mode * 320, 441);
  });
  textSize(12);
  fill('#a3b3bc');
  text('Same input field / 256 x 256 pixels each / S: save PNG', width / 2, 501);
}

function keyPressed() {
  if (key === 's' || key === 'S') saveCanvas('ordered-dither-study', 'png');
}
```

픽셀 배열을 바꾸기 전에는 [img.loadPixels()](https://p5js.org/reference/p5.Image/loadPixels/)를 호출하고, 바꾼 뒤에는 [img.updatePixels()](https://p5js.org/reference/p5.Image/updatePixels/)로 반영한다. 배열은 빨강·초록·파랑·알파가 한 픽셀당 `4`개 값으로 이어진다. 세 색 채널에 같은 값을 넣고 알파를 `255`로 고정해 불투명한 회색 또는 흑백 이미지를 만든다.

Python 3이 있다면 파일을 저장한 폴더에서 아래 명령을 실행하고 `http://127.0.0.1:8000`을 연다.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

캔버스를 클릭한 뒤 `S`를 누르면 [saveCanvas()](https://p5js.org/reference/p5/saveCanvas/)로 `ordered-dither-study.png`가 저장된다. 이미지와 캔버스의 픽셀 밀도를 `1`로 맞췄으므로 전체 결과는 `960×540`, 각 입력과 변환 이미지는 `256×256`이다. 코드에서 이미지를 확대하지 않고 배치했기 때문에 원본 한 픽셀은 캔버스 한 픽셀에 대응한다. 웹페이지에서 그림을 축소해 볼 때의 표시 결과와 저장된 픽셀은 구별해야 한다.

## 선명한 덩어리와 남아 있는 결 사이에서

![같은 원형 회색장을 원본, 고정 임계값, 베이어 디더링으로 비교한 실제 실행 결과](images/ordered-dither-frame.png)

가운데 패널에서는 명암이 큰 흑백 고리로 나뉜다. 오른쪽에서는 같은 고리의 경계 주변에 작은 픽셀 무늬가 퍼지면서 밝기의 차이가 더 이어져 보인다. 순서 디더링의 특징은 그 무늬가 우연한 잡음이 아니라 순서가 정해져 있다는 점이다. 반복 무늬를 감추는 대신 드러내면, 이미지의 표면 자체가 작품의 리듬이 될 수 있다.

다음 표는 실제 장면 전체의 평균이 아니라, 밝기가 일정한 한 타일에 대한 검사 결과다.

| 입력값 | 흰 픽셀 수 / 전체 16칸 | 흰 면적 비율 |
|---|---:|---:|
| 0 | 0 / 16 | 0% |
| 0.25 | 4 / 16 | 25% |
| 0.5 | 8 / 16 | 50% |
| 0.75 | 12 / 16 | 75% |
| 1 | 16 / 16 | 100% |

균일한 타일에서 흰 픽셀 수는 `0`부터 `16`까지 바뀔 수 있으므로 면적 비율은 `17`단계다. 이를 픽셀 하나가 `17`가지 회색을 갖는다고 해석하면 안 된다. 같은 두 색의 공간 배치가 달라지는 것이다. 작은 사진의 미세한 선이나 글자를 처리하면 디더링 무늬와 대상의 형태가 경쟁할 수 있다.

이전의 면적 하프톤처럼 원의 크기를 바꾸는 방식과도 다르다. 여기서는 고정된 정사각 픽셀을 켜거나 끈다. 또한 이웃 픽셀로 양자화 오차를 넘기는 오차 확산 방식도 아니다. 각 위치는 자기 입력값과 반복 임계값만으로 결정된다. 그 덕분에 규칙은 단순하지만, 규칙적인 결이 눈에 띄는 대가를 받아들여야 한다.

처음 변형할 때는 `FREQUENCY`를 바꿔 고리 간격을 비교해 볼 수 있다. 임계값 방식은 그대로 두고 입력의 공간 주파수만 바꾸는 것이다. 반대로 무늬 자체를 크게 보이고 싶다면 계산한 작은 이미지를 정수 배율로 확대하고 보간을 끈다. 캔버스와 패널 배치도 함께 바꿔야 한다. 이미지를 그냥 흐리게 확대하면 검정과 흰색 사이에 새로운 회색이 생겨, 이진 픽셀을 쓰려던 조건이 달라진다.

실제 브라우저에서는 정지 화면과 `S` 저장을 확인했고, 같은 환경에서 새로고침한 PNG도 동일한 바이트로 재현됐다. 다른 브라우저의 글꼴 렌더링이나 인쇄기의 망점까지 같다는 뜻은 아니다. 실제 사진을 넣는 경우에는 색 공간과 회색 변환 방식을 별도로 정해야 하며, 이 예제는 절차적으로 만든 회색 수치를 그대로 사용한다. 단색 디스플레이나 인쇄물로 옮기는 단계는 여기서 실행하지 않았다.

두 색만 쓰겠다는 제약은 단순히 색을 줄이는 설정이 아니다. 어디에서 선을 끊고 어디에 작은 결을 남길 것인지 고르는 작업이다. AI가 변환 코드를 빠르게 만들어 주더라도, 고정 임계값의 날카로움을 택할지 디더링의 반복 무늬를 택할지는 실제 크기로 본 결과에서 결정해야 한다.
