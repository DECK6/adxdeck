---
type: article
track: media-art
mediaArtCategory: 기술·제작
title: "윤곽의 오목함을 고르는 일, AI와 만드는 슈퍼포뮬러"
description: "슈퍼포뮬러의 지수 하나를 바꾸며 여섯 방향의 윤곽을 비교합니다. AI에 맡길 코드와 직접 확인할 수학을 나누고, p5.js로 반복 윤곽을 그려 PNG로 저장하는 제작 과정을 다룹니다."
aliases:
  - "Shaping Generative Contours with AI and the Superformula"
author: 육대근
date created: 2026-11-21
date modified: 2026-11-21
tags:
  - article
  - media-art
  - generative-art
  - creative-coding
  - p5js
  - AI
thumbnail: images/superformula-cover.png
status: completed
akmLayer: output
akmType: output
akmRole: deliverable
trustLevel: reviewed
sourceType: synthesis
---

# 윤곽의 오목함을 고르는 일, AI와 만드는 슈퍼포뮬러

![깊게 패인 형태에서 둥근 형태로 이어지는 반복 윤곽의 개념 이미지](images/superformula-cover.png)

*표지는 GPT Image 2로 만든 개념 일러스트입니다. 아래 비교 이미지는 본문 코드를 실행한 실제 결과입니다.*

AI에게 “유기적인 꽃 모양을 그려 줘”라고 부탁하면 모양을 쉽게 얻을 수 있다. 그러나 다음 결과를 조금 더 오목하게 만들고 싶을 때, 어떤 부분을 바꿔야 할지는 여전히 불분명하다. 꽃잎 수를 늘린 것인지, 중심을 좁힌 것인지, 전체 크기를 줄인 것인지가 섞이기 때문이다.

이번에는 여섯 방향으로 뻗는 윤곽의 바깥 크기를 고정하고, 그 사이가 안으로 들어가는 정도만 바꾼다. 같은 윤곽을 여러 크기로 겹치면 변수가 만드는 차이를 선의 간격에서도 읽을 수 있다. 목표는 복잡한 이미지를 한 번 얻는 것이 아니라, 마음에 드는 형식으로 다시 돌아올 수 있는 작은 조절 장치를 만드는 것이다.

AI는 수식을 코드로 옮기고 비교 화면을 구성하는 데 사용한다. 화면 자체는 난수나 생성형 모델 없이 정해진 수식으로 그린다. 생성형 AI를 제작 보조로 활용하면서, 완성 이미지의 형식은 알고리즘과 사람이 선택한 값으로 결정하는 제너러티브 아트다.

## 원의 반지름을 각도마다 다르게 정하기

원은 중심에서 어느 방향으로 가든 반지름이 같다. 각도에 따라 반지름을 달리 정하면 원 대신 들쭉날쭉한 윤곽이 나온다. 각도를 `theta`, 그 방향의 반지름을 `r`이라고 할 때 평면 좌표는 `x = r * cos(theta)`, `y = r * sin(theta)`로 옮긴다.

이 반지름을 정하는 방법으로 요한 힐리스(Johan Gielis)의 슈퍼포뮬러를 사용한다. [Paul Bourke의 설명과 구현](https://paulbourke.net/geometry/supershape/)은 매개변수에 따라 다양한 윤곽을 만드는 방법을 보여 준다. 여기서는 모든 경우를 다루지 않고, 두 축의 계수 `a = b = 1`인 제한된 형태를 사용한다.

계산은 `r = (abs(cos(m * theta / 4)) ** n2 + abs(sin(m * theta / 4)) ** n3) ** (-1 / n1)`이다. 절댓값을 취한 뒤 거듭제곱하는 순서와 마지막의 음수 지수를 확인해야 한다. AI가 코드를 줄이면서 이 순서를 바꾸면 비슷해 보이는 다른 도형이 나올 수 있다.

이번 비교에서는 `m = 6`, `n2 = n3 = 1`을 유지하고 `n1`만 바꾼다. `theta = 0`에서는 반지름이 항상 `1`이다. 그다음 골짜기인 `theta = π / 6`에서는 두 삼각함수의 절댓값이 같아져, 반지름이 `2 ** (-1 / (2 * n1))`이 된다. `n1`이 작을수록 골짜기가 깊어지지만 바깥 꼭짓점의 반지름은 그대로다.

반대로 `n2 = n3 = 2`로 두면 제곱한 코사인과 사인의 합이 `1`이 된다. 이 설정에서는 `n1`을 바꿔도 모두 원이다. “지수를 바꿨으니 모양도 달라질 것”이라는 예상부터 확인해야 하는 이유다. 숫자가 움직이는 것과 작품의 형식이 변하는 것은 같은 일이 아니다.

## AI에게는 비교할 조건까지 함께 주기

코드 생성을 요청할 때 완성 이미지의 분위기와 계산 조건을 한 문장에 섞지 않는 편이 좋다. 먼저 무엇을 고정하고 무엇을 비교할지 지정한 뒤, 출력 형식을 덧붙인다. 아래 요청은 이번 예제를 바탕으로 독자가 변형할 수 있도록 정리한 프롬프트다.

```text
p5.js 2.4.0으로 960×540 정지 화면을 만들어 줘.
슈퍼포뮬러에서 a=b=1, m=6, n2=n3=1을 고정하고
n1=0.35, 1, 3을 왼쪽부터 비교해 줘.
각 윤곽은 한 바퀴를 720개 각도로 샘플링하고,
같은 윤곽을 10단계로 확대해 겹쳐 그려 줘.
세 패널의 최대 반지름은 모두 126픽셀로 같게 해 줘.
반지름 계산은 p5.js와 독립된 함수로 분리하고,
축 방향 반지름과 골짜기 반지름의 기대값을 설명해 줘.
난수와 애니메이션은 쓰지 말고 S 키로 PNG를 저장하게 해 줘.
```

AI가 돌려준 그림만 보고 승인하지 말고 함수와 기준점도 읽는다. 바깥 크기가 같아야 오목함을 비교할 수 있고, 선의 수가 같아야 밀도의 인상을 비교할 수 있다. 자동으로 패널마다 도형을 꽉 차게 확대하거나 각기 다른 색을 쓰면 변화의 원인을 읽기 어려워진다.

이 예제의 검사는 축 방향 반지름, 골짜기의 계산값, 회전 대칭, 원으로 퇴화하는 설정, 표본의 개수와 범위, 잘못된 입력 거부를 다뤘다. 작은 수학 검사를 통과했다고 미적 판단까지 끝나는 것은 아니다. 다만 코드 오류 때문에 마음에 드는 형태를 놓치거나, 우연한 오류를 변수의 효과로 오해할 가능성을 줄여 준다.

## 세 파일로 그리는 반복 윤곽

브라우저와 간단한 로컬 웹 서버를 사용한다. 제작 시 확인한 [p5.js 공식 다운로드 페이지](https://p5js.org/download/)의 권장 버전은 `2.4.0`이며, 예제도 그 버전을 고정한다. 빈 폴더에 `index.html`, `shape.js`, `sketch.js`를 아래 내용으로 저장한다. 외부 이미지나 별도 데이터는 필요 없지만, 처음 라이브러리를 불러올 때 인터넷 연결이 필요하다.

`index.html`은 라이브러리, 계산 함수, 화면 코드 순으로 읽는다.

```html
<!doctype html>
<html lang="ko">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Superformula contour study</title>
<style>body{margin:0;background:#101c28}canvas{display:block;max-width:100%;height:auto}</style>
<script src="https://cdn.jsdelivr.net/npm/p5@2.4.0/lib/p5.min.js"></script>
<script src="shape.js"></script>
<script src="sketch.js"></script>
</html>
```

`shape.js`는 반지름과 좌표를 계산한다. `contourPoints()`는 이 예제에서 닫힌 윤곽을 다루기 쉽도록 양의 짝수 `m`만 받는다. `n2`, `n3`는 기본값 `1`을 사용한다. 슈퍼포뮬러 전체의 모든 매개변수 조합을 지원하는 도구가 아니라, 아래 비교를 위한 작은 구현이다.

```javascript
function superRadius(theta, m, n1, n2 = 1, n3 = 1) {
  if (![theta, m, n1, n2, n3].every(Number.isFinite) ||
      n1 <= 0 || n2 <= 0 || n3 <= 0) {
    throw new RangeError('Use finite values and positive exponents.');
  }
  const phase = m * theta / 4;
  const sum = Math.abs(Math.cos(phase)) ** n2 +
              Math.abs(Math.sin(phase)) ** n3;
  return sum ** (-1 / n1);
}

function contourPoints(count, m, n1) {
  if (!Number.isInteger(count) || count < 3 ||
      !Number.isInteger(m) || m <= 0 || m % 2 !== 0) {
    throw new RangeError('Use at least 3 samples and a positive even m.');
  }
  return Array.from({ length: count }, (_, i) => {
    const theta = 2 * Math.PI * i / count;
    const r = superRadius(theta, m, n1);
    return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
  });
}
```

표본은 `0`부터 한 바퀴 직전까지 만든다. 시작점과 같은 점을 마지막에 중복해 넣는 대신, 화면 코드의 `endShape(CLOSE)`가 마지막 표본과 첫 표본을 잇는다. 연속 수식을 유한한 직선 조각으로 근사하므로 표본을 지나치게 줄이면 윤곽이 각져 보인다.

`sketch.js`는 같은 윤곽을 `10`번 크기만 달리해 그린다. 안쪽 선은 바깥 선을 축소한 것이며, 일정한 간격만큼 안으로 이동한 평행 곡선은 아니다. 그래서 중심에서 같은 비율로 벌어지더라도 골짜기와 꼭짓점에서 보이는 선 사이의 거리는 다르다.

```javascript
const EXPONENTS = [0.35, 1, 3];
const M = 6;
const SAMPLES = 720;
const OUTER_RADIUS = 126;

function setup() {
  createCanvas(960, 540);
  pixelDensity(1);
  noLoop();
  describe('Three nested sixfold contours, changing from deeply indented to nearly round.');
}

function draw() {
  background('#101c28');
  textFont('monospace');
  textAlign(CENTER, CENTER);
  noStroke();
  fill('#dce5e4');
  textSize(18);
  text('ONE RULE / THREE CONTOURS', width / 2, 66);
  EXPONENTS.forEach((n1, panel) => {
    const points = contourPoints(SAMPLES, M, n1);
    push();
    translate(160 + panel * 320, 278);
    noFill();
    strokeWeight(1.3);
    for (let layer = 1; layer <= 10; layer++) {
      const scale = OUTER_RADIUS * layer / 10;
      stroke(lerpColor(color('#365e68'), color('#edbf84'), layer / 10));
      beginShape();
      points.forEach(p => vertex(scale * p.x, scale * p.y));
      endShape(CLOSE);
    }
    pop();
    noStroke();
    fill('#dce5e4');
    textSize(16);
    text(`n1 = ${n1}`, 160 + panel * 320, 453);
  });
  textSize(12);
  fill('#93a9b0');
  text('m = 6   n2 = n3 = 1   720 samples   S: save PNG', width / 2, 506);
}

function keyPressed() {
  if (key === 's' || key === 'S') saveCanvas('superformula-study', 'png');
}
```

Python 3이 설치되어 있다면 세 파일이 있는 폴더에서 다음 명령을 실행하고 `http://127.0.0.1:8000`을 연다.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

정지 그림에는 [noLoop()](https://p5js.org/reference/p5/noLoop/)를 사용한다. 캔버스를 한 번 클릭한 뒤 `S`를 누르면 [saveCanvas()](https://p5js.org/reference/p5/saveCanvas/)가 `superformula-study.png`를 저장한다. `pixelDensity(1)`을 지정했으므로 이 예제의 저장 크기는 화면 설계와 같은 `960×540`이다. 고해상도로 만들 때는 캔버스만 키우지 말고 중심 위치, 반지름, 선 두께와 글자 크기도 함께 조정해야 한다.

## 숫자보다 먼저 고를 것은 선의 성격이다

![n1이 0.35, 1, 3인 세 슈퍼포뮬러 윤곽의 실제 p5.js 실행 결과](images/superformula-frame.png)

실제 실행 결과는 왼쪽에서 안쪽으로 깊게 패이고, 오른쪽으로 갈수록 바깥 둘레에 가까워진다. 세 패널은 동일한 최대 반지름과 선의 수를 갖는다. 아래 수치는 바깥 윤곽의 골짜기까지 중심에서 잰 거리다. 인접한 선 사이의 간격이나 도형의 면적을 뜻하지 않는다.

| `n1` | 골짜기의 무차원 반지름 | 최대 반지름이 126픽셀일 때 |
|---|---:|---:|
| 0.35 | 0.371499 | 약 46.81픽셀 |
| 1 | 0.707107 | 약 89.10픽셀 |
| 3 | 0.890899 | 약 112.25픽셀 |

왼쪽 형태는 중심 쪽으로 긴 통로를 만든다. 선을 더 쌓으면 그 통로가 어둡고 빽빽해지는 반면, 바깥 꼭짓점 사이의 여백은 크게 남는다. 오른쪽 형태는 둘레를 따라 선이 고르게 둘러서는 인상이 강해진다. `n1 = 3`도 완전한 원은 아니다. 완만한 요철을 남길지, 아예 원으로 바꿀지는 서로 다른 선택이다.

이번에는 난수를 쓰지 않았고, 같은 브라우저에서 새로고침한 캔버스와 `S`로 저장한 PNG가 같은 바이트인지도 확인했다. 다른 운영체제나 브라우저에서 글꼴과 안티앨리어싱까지 동일하다는 뜻은 아니다. 도형의 계산과 이미지 파일의 재현 범위를 구분해 두면 작품을 옮길 때 확인할 부분이 선명해진다.

변형은 한 번에 하나씩 한다. 먼저 `n1`을 세 값 사이에서 움직이며 골짜기를 고른다. 그다음 `M`을 `4`, `8`처럼 다른 짝수로 바꾸면 반복 방향의 수를 비교할 수 있다. 마지막으로 선의 수와 색을 조정한다. `n1`을 극단적으로 작게 잡으면 골짜기가 중심에 몰리고 수치가 매우 작아질 수 있으므로, 예제에서 확인한 범위부터 탐색하는 편이 좋다. 일반식의 비정수 `m`을 그대로 넣고 한 바퀴만 그리면 항상 자연스럽게 닫힌다고 가정해서도 안 된다.

이 결과는 정지 이미지 제작까지 확인한 것이다. 시간에 따라 지수를 움직이는 영상, 입체 출력, 레이저 커팅 등으로 옮기려면 각각의 출력 조건을 따로 확인해야 한다. 특히 이 이미지는 선을 확대·축소해 겹친 래스터 출력이지, 가공기에 바로 전달할 벡터 설계도는 아니다.

AI에게 형태를 많이 만들어 달라고 할 수도 있다. 그러나 작품을 발전시킬 때는 어떤 차이를 남기고 싶은지 설명할 수 있는 편이 유용하다. 깊이 패인 통로, 둥근 둘레, 중심에 모이는 선 중 무엇을 고를 것인가. 수식은 그 선택을 반복해서 시험할 수 있게 해 주고, AI는 선택을 실행 가능한 도구로 옮기는 일을 돕는다.
