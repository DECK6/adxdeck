---
type: article
track: media-art
mediaArtCategory: 기술·제작
title: "AI와 줄이는 곡선, 남길 점을 고르는 RDP"
description: "AI의 도움으로 RDP 선 단순화를 구현하고 p5.js에서 곡선의 점 수를 줄인다. 허용 오차를 바꾸며 잔물결과 큰 굴곡 사이의 표현을 고르고, 끝점과 거리 조건을 실제로 검사한다."
aliases:
  - Simplifying Generative Curves with AI and RDP
author: 육대근
date created: 2026-11-15
date modified: 2026-11-15
tags:
  - article
  - media-art
  - generative-art
  - creative-coding
  - p5js
  - AI
thumbnail: images/rdp-cover.png
status: completed
akmLayer: output
akmType: output
akmRole: deliverable
trustLevel: reviewed
sourceType: synthesis
---

# AI와 줄이는 곡선, 남길 점을 고르는 RDP

![잔잔한 청록색 곡선이 황토색과 청록색의 간결한 꺾은선으로 이어지는 개념 이미지](images/rdp-cover.png)

제너러티브 드로잉에서 점을 촘촘하게 찍으면 부드러운 선을 만들 수 있다. 그런데 결과가 지나치게 잘게 떨리거나, 큰 형태보다 작은 굴곡이 먼저 보일 때도 있다. **이미 만든 선에서 어떤 점을 남길 것인가**를 정하면 같은 재료로 다른 리듬을 만들 수 있다.

이번에는 RDP(Ramer–Douglas–Peucker) 알고리즘으로 곡선의 점을 줄인다. p5.js에서 사인파를 겹쳐 선을 만들고, 허용 오차 안에서 일부 점만 남겨 다시 잇는다. 결과물은 크림색 바탕에 청록색과 황토색 선이 층층이 놓인 정지 이미지다. 기본 예제에서는 10,815개의 점이 490개로 줄었다. 점 수가 줄어든 비율보다 중요한 것은 작은 물결과 큰 굴곡 중 무엇이 남았는지다.

생성형 AI는 코드와 검사 조건을 작성하는 보조 도구로 쓴다. 화면의 선은 모델이 매번 그리는 이미지가 아니라 수학식과 선택 규칙의 실행 결과다. 표지는 이 제작 주제를 표현한 AI 생성 개념 이미지이며, 본문의 실행 이미지는 아래 코드를 실제로 돌려 저장한 것이다.

## 선을 다시 그리지 않고 남길 점 고르기

RDP는 점을 일정한 간격으로 하나씩 건너뛰는 방법과 다르다. 먼저 선의 첫 점과 마지막 점을 직선으로 연결한다. 그 선분에서 가장 멀리 떨어진 중간 점을 찾고, 거리가 허용 오차보다 크면 그 점을 남긴다. 남긴 점을 기준으로 구간을 둘로 나누어 같은 검사를 반복한다. 모든 중간 점이 허용 오차 안에 들어오는 구간에서는 양 끝점만 있으면 된다.

여기서 말하는 곡선은 순서대로 연결된 `[x, y]` 좌표 목록, 즉 폴리라인이다. 베지어 곡선의 제어점을 줄이는 예제는 아니다. RDP는 입력에 있던 점 중 일부를 고르며, 새로운 좌표를 만들어 곡선을 매끈하게 보정하지 않는다. 점이 줄면 오히려 꺾인 부분이 더 분명해질 수 있다. 이 변화 자체를 작품의 표현으로 삼을 수 있다.

참고한 [Simplify.js 공식 설명](https://mourner.github.io/simplify-js/)은 허용 오차를 좌표와 같은 단위로 지정한다. 기본 동작에는 거리 기반 전처리와 Douglas–Peucker 처리가 함께 들어가고, `highQuality` 옵션은 그 전처리를 생략한다. 아래 예제는 원리를 분리해서 보기 위해 **거리 전처리 없이 RDP만 직접 구현**한다. Simplify.js를 불러오는 코드가 아니며, 기본 옵션의 결과와 같다고 가정하지 않는다.

허용 오차는 아래 코드에서 `epsilon`이다. 캔버스 좌표를 픽셀로 만들었으므로 `epsilon = 2`는 좌표계에서 2픽셀이다. 브라우저가 그림을 작게 표시하더라도 계산은 원래 캔버스 좌표를 기준으로 한다. 다른 크기로 좌표 자체를 확대하면 같은 숫자가 같은 비율의 오차를 뜻하지는 않는다.

AI에게는 “선을 깔끔하게 해줘”보다 입력과 보존할 조건을 함께 전달한다. 다음은 이 실습에 사용할 수 있는 요청문이다.

```text
p5.js로 만든 여러 폴리라인의 점을 RDP 방식으로 줄이고 싶다.
JavaScript 함수 simplifyLine(points, epsilon)을 작성해줘.
points는 유한한 [x, y] 좌표가 순서대로 들어 있는 배열이다.
입력을 수정하지 않고, 원래 순서를 유지한 부분 배열을 반환한다.
첫 점과 마지막 점은 남긴다. 빈 배열과 점 하나, 점 둘도 처리한다.
epsilon은 좌표와 같은 단위이며 0 이상의 유한한 값만 허용한다.
무한 직선이 아닌 양 끝이 있는 선분까지의 거리를 계산해줘.
양 끝점이 같은 구간도 처리하고, 허용 오차와 같은 거리는 허용한다.
거리 기반 전처리는 넣지 말고, 재귀 대신 구간 스택을 사용한다.
직선, 뾰족한 굴곡, 뒤로 되돌아오는 선, 같은 시작·끝점을 검사해줘.
```

특히 **무한 직선과 선분의 차이**를 확인해야 한다. `(0, 0)`에서 `(2, 0)`으로 갔다가 `(1, 0)`으로 돌아오는 선을 생각해 보자. 세 점은 같은 직선 위에 있지만, 시작과 끝을 이은 선분은 x가 0부터 1까지다. 가운데 점은 그 선분에서 1만큼 떨어져 있다. 무한 직선까지의 거리만 계산하면 이 되돌아가는 움직임을 오차 없이 지울 수 있다고 잘못 판단한다.

## p5.js에서 곡선을 만들고 단순화하기

환경은 웹 브라우저와 **p5.js 2.4.0**이다. [공식 다운로드 페이지](https://p5js.org/download/)에서 이 버전의 `p5.min.js`를 받아 아래 세 파일과 같은 폴더에 둔다. 이 글의 실행과 저장은 해당 버전으로 확인했다.

먼저 `index.html`을 저장한다. 라이브러리, 선 단순화 함수, 화면 코드 순서로 불러온다.

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>RDP 곡선 실습</title>
  <style>body { margin: 0; background: #f4efdf; } canvas { display: block; max-width: 100%; height: auto !important; }</style>
</head>
<body>
  <script src="p5.min.js"></script>
  <script src="rdp.js"></script>
  <script src="sketch.js"></script>
</body>
</html>
```

다음은 `rdp.js`다. 선분 위에서 가장 가까운 위치를 나타내는 `t`를 0부터 1 사이로 제한한다. 두 끝점이 같으면 그 점까지의 거리를 쓴다. 거리의 제곱끼리 비교하므로 중간 검사마다 제곱근을 구할 필요가 없다. [Simplify.js의 공개 구현](https://github.com/mourner/simplify-js/blob/master/simplify.js)에서도 선분 거리와 분할 과정을 확인할 수 있다.

```javascript
function segmentDistanceSquared(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const length2 = dx * dx + dy * dy;
  const t = length2 === 0 ? 0 : Math.max(0, Math.min(1,
    ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / length2));
  const ex = p[0] - (a[0] + t * dx);
  const ey = p[1] - (a[1] + t * dy);
  return ex * ex + ey * ey;
}

function simplifyLine(points, epsilon) {
  if (!Number.isFinite(epsilon) || epsilon < 0) {
    throw new RangeError('epsilon must be finite and nonnegative');
  }
  if (points.length < 3) return points.slice();
  const keep = new Array(points.length).fill(false);
  keep[0] = keep[points.length - 1] = true;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let farthest = -1, maxDistance2 = epsilon * epsilon;
    for (let i = first + 1; i < last; i++) {
      const d2 = segmentDistanceSquared(points[i], points[first], points[last]);
      if (d2 > maxDistance2) {
        maxDistance2 = d2;
        farthest = i;
      }
    }
    if (farthest !== -1) {
      keep[farthest] = true;
      stack.push([first, farthest], [farthest, last]);
    }
  }
  return points.filter((_, i) => keep[i]);
}
```

`stack`에는 아직 조사하지 않은 구간의 시작·끝 번호가 들어간다. `keep`에는 남길 점을 표시한다. 마지막에 원래 배열의 순서대로 골라 내므로 스택에서 구간을 꺼내는 순서가 출력의 점 순서를 뒤집지 않는다. 반환 배열은 새 배열이지만 각 좌표 배열은 원본과 공유한다. 결과 좌표를 나중에 직접 수정할 계획이라면 좌표도 별도로 복사해야 한다.

이 함수는 유한한 좌표가 들어온다는 전제로 만든 작은 제작 예제다. 손상된 외부 파일을 읽는 파서, 아주 큰 좌표의 수치 안정성 처리, 폐곡선의 위상 보존 기능은 포함하지 않는다. `epsilon = 0`도 모든 점을 그대로 돌려준다는 뜻은 아니다. 같은 선분 위에 놓인 불필요한 중간 점은 제거될 수 있다.

`sketch.js`에서는 큰 물결과 작은 물결을 더한다. 한 줄에 721개씩, 모두 15줄을 만든다. 각 줄의 위상을 조금씩 바꿔 같은 봉우리가 완벽히 수직으로 정렬되지 않도록 했다. 난수를 사용하지 않으므로 같은 설정과 코드로 다시 실행하면 같은 좌표가 나온다.

```javascript
const SETTINGS = { epsilon: 2, detail: 5, showPoints: false };
let lines = [];

function makeLine(row) {
  return Array.from({ length: 721 }, (_, i) => {
    const t = i / 720 * Math.PI * 2;
    return [60 + i / 720 * 840,
      70 + row * 27 + 22 * Math.sin(t * 2.4 + row * 0.22)
      + SETTINGS.detail * Math.sin(t * 15 + row * 0.6)];
  });
}

function setup() {
  createCanvas(960, 540);
  pixelDensity(1);
  noLoop();
}

function draw() {
  background('#f4efdf');
  noFill();
  strokeJoin(ROUND);
  lines = [];
  for (let row = 0; row < 15; row++) {
    const original = makeLine(row);
    const reduced = simplifyLine(original, SETTINGS.epsilon);
    lines.push({ original, reduced });
    stroke(row < 9 ? '#155b61' : '#b86b38');
    strokeWeight(2);
    beginShape();
    for (const [x, y] of reduced) vertex(x, y);
    endShape();
    if (SETTINGS.showPoints) {
      strokeWeight(5);
      for (const [x, y] of reduced) point(x, y);
    }
  }
}

function keyPressed() {
  if (key === 's' || key === 'S') saveCanvas('rdp-curves', 'png');
}
```

Python 3가 설치되어 있다면 파일이 있는 폴더에서 다음 명령을 실행하고 `http://localhost:8000/`을 연다.

```bash
python3 -m http.server 8000
```

화면을 클릭한 뒤 S 키를 누르면 PNG가 저장된다. p5.js의 [saveCanvas](https://p5js.org/reference/p5/saveCanvas/)를 사용하며, `pixelDensity(1)`로 지정한 이 예제의 저장 크기는 960×540이다. `noLoop()`로 한 번만 그리므로 설정을 바꾼 뒤에는 새로고침한다.

![허용 오차 2픽셀로 단순화한 청록색 아홉 줄과 황토색 여섯 줄의 실제 실행 화면](images/rdp-frame.png)

기본 화면에서는 작은 물결의 봉우리와 골짜기가 짧은 직선으로 이어진다. 큰 물결의 흐름 안에 작게 꺾이는 리듬이 남아 있다. 청록색 아홉 줄과 황토색 여섯 줄의 경계는 행 번호로 정한 색 선택이며, 단순화 알고리즘이 두 종류의 선을 분류한 결과는 아니다.

## 허용 오차와 원래 굴곡을 따로 바꾸기

먼저 `detail`은 5로 두고 `epsilon`만 바꿔 보자. 허용 오차가 0.5일 때는 작은 굴곡을 더 촘촘하게 따른다. 2에서는 점 수가 크게 줄지만 잔물결이 남는다. 12에서는 긴 선분과 큰 방향 전환이 화면을 지배한다. 이 변화는 단순히 해상도가 떨어지는 현상이 아니라, 어떤 규모의 굴곡을 표현할지 선택한 결과다.

아래 표는 같은 브라우저에서 직접 실행한 값이다. 점 수는 15줄 전체의 합이다. 최대 오차는 각 원래 점에서 **그 점이 속했던 구간을 대체한 선분**까지의 거리를 별도 계산한 값이며, 표에서는 소수 셋째 자리까지 반올림했다.

| 허용 오차 `epsilon` | 잔물결 진폭 `detail` | 남은 점 수 | 측정한 최대 오차 |
|---:|---:|---:|---:|
| 0.5 | 5 | 1,429 | 0.497픽셀 |
| 2 | 5 | 490 | 1.994픽셀 |
| 6 | 5 | 417 | 5.984픽셀 |
| 12 | 5 | 120 | 11.781픽셀 |
| 2 | 10 | 857 | 1.999픽셀 |

원래 점 수는 모든 경우에 10,815개다. 오차를 2에서 6으로 세 배 늘렸다고 점 수가 세 배 줄어들지는 않았다. 남길 점은 굴곡의 위치와 크기에 따라 정해진다. 원하는 점 개수를 정확히 맞추는 장치로 생각하기보다, 형태의 차이를 어느 정도 허용할지 정하는 변수로 다루는 편이 맞다.

`detail`은 다른 역할을 한다. 이것은 단순화하기 전 작은 물결의 진폭이다. `epsilon`을 2로 고정하고 `detail`을 5에서 10으로 높였더니 남은 점이 490개에서 857개로 늘었다. 같은 오차 안에서 더 큰 잔물결을 따라가려면 더 많은 점이 필요했던 것이다. 원래 선을 바꾸는 일과 이미 만든 선에서 점을 고르는 일을 분리해야 차이가 분명해진다.

남은 점이 어디인지 보고 싶으면 `showPoints`를 `true`로 바꾼다. 각 점을 두껍게 표시할 뿐 좌표나 선택 결과는 바꾸지 않는다. 직선이 길게 이어지는 부분과 방향이 바뀌는 부분의 점 간격을 비교할 수 있다. 이 표시를 끄면 다시 선만 보인다.

기본 이미지에서는 허용 오차 2를 선택했다. 큰 물결 위에 작은 꺾임이 반복되어, 여러 줄이 비슷한 방향으로 움직이면서도 서로 다른 박자를 갖기 때문이다. 더 정적인 지형의 윤곽처럼 보이게 하고 싶다면 12의 긴 선분이 어울릴 수 있다. 점이 적다는 사실만으로 더 좋은 결과가 되지는 않는다.

## AI 코드가 지운 것까지 확인하기

실행 화면이 그럴듯해도 검사할 것은 남아 있다. 이 예제는 직선의 중간 점 제거, 허용 오차 경계, 되돌아오는 선, 같은 시작·끝점, 작은 입력과 원본 보존, 잘못된 허용 오차 거부를 여섯 검사로 확인했다. 앞서 든 되돌아오는 선에 허용 오차 0.5를 주면 가운데 `(2, 0)`이 남아야 한다. 이 짧은 예제가 선분 거리 계산의 실수를 드러낸다.

실제 그림에서도 각 줄의 첫 점과 마지막 점이 유지되는지, 남은 점이 원래 좌표 목록의 순서 있는 일부인지 확인했다. 그다음 단순화 함수와 별도의 거리 계산으로 원래 점과 대체 선분 사이의 최대 오차를 측정했다. 기본값의 최대 오차는 약 1.994픽셀로 2픽셀 이내였다. 동일 설정을 다시 실행한 좌표와 PNG가 일치했고, S 키로 내려받은 파일도 캔버스에서 얻은 PNG와 같았다.

이 검사는 원래 사인 함수의 연속 곡선 전체나 선의 두께까지 평가하는 것은 아니다. 여기서 입력으로 사용한 721개의 점과 그것들을 연결한 폴리라인을 대상으로 한다. 또 오차 조건을 만족한다고 해서 선끼리 교차하지 않는다거나, 닫힌 도형의 면적과 구멍이 보존된다거나, 가능한 최소 점 수를 찾았다고 할 수는 없다. AI가 이런 성질까지 보장한다고 설명하면 별도의 조건과 검사가 있는지 확인해야 한다.

점이 줄어든 비율을 PNG 용량 감소율로 읽어서도 안 된다. PNG는 좌표 목록이 아니라 래스터 이미지다. 이 실습은 실제 파일 용량을 줄이는 압축 실험이 아니다. 벡터 경로의 저장이나 펜 플로터 제작으로 확장할 수는 있지만, SVG 내보내기와 장비 실행은 이번 코드에 포함하지 않았고 직접 검증하지도 않았다.

다음 작업에서는 같은 함수에 손으로 그린 열린 선의 좌표를 넣어 볼 수 있다. 그때도 먼저 입력 좌표의 단위와 순서를 확인하고, 원본을 따로 보존한 뒤 작은 허용 오차부터 비교하면 된다. 선이 달라질 때마다 새로 생성하라고 AI에게 요청하는 대신, **원래 재료와 변형 규칙을 따로 남겨 두면** 어떤 선택이 화면을 바꿨는지 되짚어 볼 수 있다. 제작자가 고르는 것은 단지 줄어든 점의 수가 아니라, 작품 안에 남겨 둘 굴곡의 크기다.
