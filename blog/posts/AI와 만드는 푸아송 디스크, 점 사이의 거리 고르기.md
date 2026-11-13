---
type: article
track: media-art
mediaArtCategory: 기술·제작
title: "AI와 만드는 푸아송 디스크, 점 사이의 거리 고르기"
description: "p5.js와 푸아송 디스크 샘플링으로 간격이 있는 선 무늬를 만든다. AI에 구현 조건을 전달하고 최소 거리, 시드, 선 길이를 따로 바꾸며 화면의 밀도와 여백을 조절한다."
aliases:
  - Spacing Generative Marks with AI and Poisson Disk
author: 육대근
date created: 2026-11-14
date modified: 2026-11-14
tags:
  - article
  - media-art
  - generative-art
  - creative-coding
  - p5js
  - AI
thumbnail: images/poisson-disk-cover.png
status: completed
akmLayer: output
akmType: output
akmRole: deliverable
trustLevel: reviewed
sourceType: synthesis
---

# AI와 만드는 푸아송 디스크, 점 사이의 거리 고르기

![여백을 두고 놓인 청록색과 황토색 짧은 선이 물결을 이루는 개념 이미지](images/poisson-disk-cover.png)

화면에 작은 선을 무작위로 놓으면 어떤 곳은 빽빽하고 어떤 곳은 크게 빈다. 격자에 맞추면 간격은 안정되지만 줄과 열이 먼저 보인다. **위치는 조금씩 어긋나되 서로 너무 가까이 붙지는 않는 무늬**를 만들려면 무엇을 정해야 할까.

이번에는 푸아송 디스크 샘플링(Poisson-disk sampling)으로 선의 중심점을 배치한다. 점 사이에 최소 거리를 두고, 그 점마다 짧은 선을 그린다. 결과물은 크림색 바탕 위에서 청록색과 황토색 선이 느슨하게 물결치는 한 장의 이미지다. 핵심은 **배치의 간격과 선 자체의 크기를 따로 조절하는 데** 있다.

생성형 AI는 배치 알고리즘을 코드로 옮기고 검사 조건을 정리하는 보조 도구로 사용한다. 실행 화면은 이미지 모델이 그리는 것이 아니라 난수와 거리 규칙으로 만들어진다. 표지는 주제를 표현한 AI 생성 개념 이미지이며, 본문의 실행 이미지는 아래 코드를 실제로 돌린 결과다.

## 무작위 배치에 거리라는 조건 더하기

여기서는 Robert Bridson의 [Fast Poisson Disk Sampling in Arbitrary Dimensions](https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf)에 나온 방법을 2차원으로 구현한다. 처음에 점 하나를 놓고, 이미 놓인 점 중 하나를 골라 그 주변에 새 후보를 만든다. 모든 기존 점과의 거리가 `r` 이상이면 받아들이고, 너무 가까우면 버린다.

후보는 기준점에서 거리 `r`부터 `2r`까지인 고리 안에 놓는다. 후보를 찾을 수 있는 점들을 목록에 두고, 한 점에서 `k`번 시도해도 새 점을 못 찾으면 그 점을 목록에서 뺀다. 목록이 비면 배치를 마친다. 이 예제의 기본값은 `r = 28`, `k = 30`이다. 유한한 횟수만 시도하므로 빈 곳을 빠짐없이 채웠다는 보장은 없다.

가까운 점을 찾을 때 매번 모든 점을 비교하면 비효율적이다. 그래서 화면을 한 변이 `r / √2`인 정사각형 칸으로 나누고, 각 칸에 들어간 점의 번호를 저장한다. 이 크기에서는 같은 칸 안에 최소 거리 조건을 만족하는 두 점이 들어갈 수 없다. 새 후보는 자기 칸에서 가로·세로 두 칸 이내만 조사한다. 격자는 검사를 돕는 자료 구조이며, 점이 격자 교차점에 놓인다는 뜻은 아니다.

서로 다른 크기의 원을 빈 곳에 끼워 넣는 서클 패킹과도 제작 질문이 다르다. 여기서는 모든 중심점에 같은 최소 거리 하나를 적용한다. 무엇을 그릴지는 배치가 끝난 다음 결정한다. 그 자리에 원, 짧은 선, 작은 이미지 조각을 올릴 수 있지만, 중심점 간격이 곧 도형 가장자리 사이의 간격은 아니다.

AI에게 요청할 때도 이 둘을 분리한다. 다음은 이 실습의 구현 조건을 전달하는 프롬프트다.

```text
p5.js로 여백이 있는 짧은 선 무늬를 만들고 싶다.
Bridson 방식의 2차원 푸아송 디스크 샘플러를 JavaScript로 작성해줘.
입력은 폭, 높이, 최소 거리 r, 후보 시도 횟수 k, 난수 함수다.
출력은 [x, y] 좌표 목록이며 모든 점 쌍의 거리는 r 이상이어야 한다.
0 이상 폭 미만, 0 이상 높이 미만인 범위만 허용한다.
후보는 r~2r 고리의 면적에 균일하게 분포하게 하고,
격자 한 변은 r / sqrt(2), 이웃 검사는 가로·세로 두 칸으로 한다.
활성 목록에서 점을 뺄 때 마지막 항목과 교환하고 pop을 사용해줘.
배치와 그리기를 분리해 선 길이를 바꿔도 좌표는 그대로 유지한다.
같은 시드 재현, 모든 점 쌍 거리, 가늘고 긴 영역의 경계를 검사해줘.
```

고리의 반지름을 단순히 `r`부터 `2r`까지 균일하게 뽑으면 면적에 균일한 분포가 되지 않는다. 바깥쪽일수록 같은 두께의 띠가 넓기 때문이다. 아래 코드는 0 이상 1 미만인 난수 `u`에 대해 `r * sqrt(1 + 3u)`를 쓰고 각도는 한 바퀴에서 균일하게 뽑는다. AI가 설명한 “균일함”이 반지름인지 면적인지 확인할 지점이다.

## 중심점을 만들고 짧은 선으로 그리기

환경은 웹 브라우저와 **p5.js 2.4.0**이다. [공식 다운로드 페이지](https://p5js.org/download/)에서 해당 버전의 `p5.min.js`를 받고, 아래 세 파일과 같은 폴더에 둔다. 이 글은 이 버전의 라이브러리로 실행과 PNG 저장을 확인했다.

먼저 `index.html`을 저장한다. 라이브러리, 배치 함수, 그리기 코드 순서로 읽는다.

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Poisson disk marks</title>
  <style>body{margin:0;background:#f3ede0}canvas{display:block;max-width:100%;height:auto!important}</style>
</head>
<body>
  <script src="p5.min.js"></script>
  <script src="poisson.js"></script>
  <script src="sketch.js"></script>
</body>
</html>
```

다음은 `poisson.js`다. 격자의 `-1`은 아직 점이 없는 칸을 뜻한다. `active`에는 다음 후보를 만들 수 있는 점의 번호가 들어간다. 거리가 정확히 `r`인 경우는 허용하며, 오른쪽과 아래쪽 끝 좌표는 범위에서 제외한다.

```javascript
function poisson(w, h, r, k = 30, rng = Math.random) {
  if (![w, h, r].every(v => Number.isFinite(v) && v > 0) ||
      !Number.isInteger(k) || k < 1) throw new RangeError('Invalid geometry or k');
  const cell = r / Math.sqrt(2);
  const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
  const grid = new Int32Array(cols * rows).fill(-1);
  const points = [], active = [];
  function add(x, y) {
    const id = points.length;
    points.push([x, y]);
    active.push(id);
    grid[Math.floor(x / cell) + Math.floor(y / cell) * cols] = id;
  }
  add(rng() * w, rng() * h);
  while (active.length) {
    const slot = Math.floor(rng() * active.length);
    const [px, py] = points[active[slot]];
    let found = false;
    for (let attempt = 0; attempt < k; attempt++) {
      const angle = 2 * Math.PI * rng();
      const radius = r * Math.sqrt(1 + 3 * rng());
      const x = px + radius * Math.cos(angle);
      const y = py + radius * Math.sin(angle);
      if (x < 0 || x >= w || y < 0 || y >= h) continue;
      const gx = Math.floor(x / cell), gy = Math.floor(y / cell);
      let valid = true;
      for (let j = Math.max(0, gy - 2); j <= Math.min(rows - 1, gy + 2); j++) {
        for (let i = Math.max(0, gx - 2); i <= Math.min(cols - 1, gx + 2); i++) {
          const id = grid[i + j * cols];
          if (id < 0) continue;
          const dx = x - points[id][0], dy = y - points[id][1];
          if (dx * dx + dy * dy < r * r) valid = false;
        }
      }
      if (!valid) continue;
      add(x, y);
      found = true;
      break;
    }
    if (!found) {
      active[slot] = active[active.length - 1];
      active.pop();
    }
  }
  return points;
}
```

`Math.sqrt(1 + 3 * rng())`가 고리 안의 후보 거리를 만든다. 난수 함수는 호출할 때마다 0 이상 1 미만인 값을 반환해야 한다. 브라우저에서는 p5.js의 `random()`을 전달한다. 이 코드는 이 글의 작은 화면 실습용이며, 극단적으로 작은 `r`과 아주 큰 캔버스에 대한 메모리 제한 처리는 포함하지 않았다.

`sketch.js`는 점마다 선을 하나씩 그린다. 캔버스는 960×540이고 사방에 32픽셀 여유를 둬, 실제 중심점을 만드는 영역은 896×476이다. 선의 방향은 위치에 사인·코사인 함수를 적용해 정한다. 점이나 입자가 흐르는 시뮬레이션은 아니며, 방향이 조금씩 달라지는 정지 화면이다.

```javascript
const SETTINGS = { r: 28, k: 30, seed: 31, length: 18 };
let points = [];
function setup() {
  createCanvas(960, 540);
  pixelDensity(1);
  noLoop();
  renderMarks();
}
function renderMarks(settings = SETTINGS) {
  const { r, k, seed, length } = settings;
  randomSeed(seed);
  points = poisson(width - 64, height - 64, r, k, () => random());
  background('#f3ede0');
  strokeWeight(2.4);
  strokeCap(ROUND);
  for (const [x, y] of points) {
    const angle = 0.5 * sin(x / 140) + 0.8 * cos(y / 100);
    const dx = cos(angle) * length / 2;
    const dy = sin(angle) * length / 2;
    stroke(x < 560 ? '#245e61' : '#b97836');
    line(x + 32 - dx, y + 32 - dy, x + 32 + dx, y + 32 + dy);
  }
}
function keyPressed() {
  if (key === 's' || key === 'S') saveCanvas('poisson-disk', 'png');
}
```

Python 3가 설치되어 있다면 파일이 있는 폴더의 터미널에서 다음 명령을 실행하고 `http://localhost:8000/`을 연다.

```bash
python3 -m http.server 8000
```

화면이 그려지면 페이지를 클릭하고 S 키를 눌러 PNG를 저장한다. `pixelDensity(1)`을 사용했으므로 이 예제의 저장 파일은 960×540이다. 저장은 p5.js의 [saveCanvas](https://p5js.org/reference/p5/saveCanvas/)를 사용한다. 화면은 한 번 계산하고 멈추며, `SETTINGS`를 수정한 뒤 새로고침하면 처음부터 다시 만든다.

![최소 거리 28픽셀과 길이 18픽셀로 그린 청록색·황토색 선 357개의 실제 실행 화면](images/poisson-disk-frame.png)

기본 화면에는 357개의 선이 놓였다. 모든 중심점 쌍을 따로 비교했을 때 가장 짧은 거리는 약 28.003픽셀이었다. 각 선 사이의 여백은 일정하지 않지만, 지나치게 가까운 중심점은 없다. 왼쪽의 청록색에서 오른쪽의 황토색으로 바뀌는 경계는 색 선택으로 만든 것이며, 샘플링 규칙이 영역을 분리한 결과는 아니다.

## 간격과 길이를 하나씩 바꿔 보기

첫 번째 변수는 `r`이다. 다른 값을 그대로 두고 28에서 42로 바꾸면 같은 화면에 놓인 점이 357개에서 161개로 줄었다. 짧은 선이 더 넓은 여백을 사이에 두고 흩어진다. 점 개수를 직접 지정한 결과가 아니므로 목표 개수와 정확히 맞추는 용도로 쓰지는 않는다.

두 번째 변수는 `length`다. 이를 18에서 32로 늘렸을 때 중심점 357개의 좌표는 전부 그대로였다. 대신 선 끝이 이웃 선 쪽으로 뻗어, 독립된 작은 흔적보다 이어지는 가닥처럼 읽히는 곳이 생겼다. **최소 중심 거리를 지켰다는 사실만으로 선끼리 닿거나 겹치지 않는다고 할 수 없다.** 방향과 길이, 선 두께를 함께 봐야 한다.

아래는 같은 브라우저에서 직접 실행한 비교다. 표에 적지 않은 값은 기본 설정을 유지했다. 최소 거리는 반올림했으며, 다른 시드나 구현에서는 개수와 세부 배치가 달라질 수 있다.

| 바꾼 설정 | 점 개수 | 측정한 최소 중심 거리 | 비교할 지점 |
|---|---:|---:|---|
| 기본값 `r: 28, length: 18, seed: 31, k: 30` | 357 | 28.003픽셀 | 짧은 선과 그 사이의 여백 |
| `r: 42` | 161 | 42.099픽셀 | 배치 자체가 성기게 바뀜 |
| `length: 32` | 357 | 28.003픽셀 | 좌표는 같고 선이 차지하는 면적만 커짐 |
| `seed: 32` | 352 | 28.043픽셀 | 같은 규칙으로 다른 위치를 얻음 |
| `k: 1` | 4 | 29.812픽셀 | 후보 탐색이 일찍 끊겨 큰 빈 영역이 남음 |

`k`는 선명도나 미적 완성도를 직접 높이는 값이 아니다. 한 점에서 허용하는 후보 시도 횟수다. 이번에 `k = 1`로 줄였을 때는 점 네 개만 남았지만, 네 점도 최소 거리 조건은 지켰다. 이것은 알고리즘이 “빈틈을 전부 채울 때까지” 작동하는 것이 아님을 보여 준다. 계산량을 줄이려면 이런 결과 변화도 함께 확인해야 한다.

시드를 고정하는 이유는 변수를 비교하기 위해서다. p5.js의 [randomSeed 문서](https://p5js.org/reference/p5/randomSeed/)에 따라 같은 값을 주면 같은 난수열을 반복할 수 있다. 다만 코드에서 난수를 호출하는 순서까지 같아야 한다. 색을 고를 때도 `random()`을 호출하도록 샘플링 함수 안에 끼워 넣으면 뒤의 후보 좌표가 바뀔 수 있다. 이 예제는 먼저 좌표를 모두 만든 뒤, 난수 없이 위치로 방향과 색을 정한다.

기본 출력에서는 길이 18을 선택했다. 선 끝 사이에 빈 공간이 남아 각 흔적이 따로 보이면서도 방향의 변화는 이어지기 때문이다. 길이 32도 가능한 결과지만, 화면이 가닥으로 묶이는 인상이 더 강하다. 값을 고르기 전에 이번 작품에서 개별 흔적을 보고 싶은지, 이어지는 결을 보고 싶은지 정할 수 있다.

## AI가 작성한 배치 규칙을 확인하는 방법

화면만 보면 최소 거리 위반 몇 개는 놓치기 쉽다. 그래서 이 예제는 격자 검사와 별도로 **모든 점 쌍의 실제 거리**를 비교했다. 가로·세로 길이가 다른 영역, 여러 시드, 작은 후보 횟수에서도 경계와 거리 조건을 확인했다. 같은 시드로 두 번 만든 좌표와 PNG가 일치했고, S 키로 내려받은 파일도 캔버스에서 얻은 PNG와 같았다.

경계 검사는 의도적으로 좁은 영역에서도 수행했다. 높이가 1이고 폭이 100인 영역에서 최소 거리를 20으로 두고 일정한 난수를 공급하면, 왼쪽 끝에서 시작해 20씩 떨어진 점이 나와야 한다. 이때 오른쪽 끝 100은 포함하지 않는다. 일반적인 화면에서는 드러나지 않는 끝점 처리 오류를 작은 조건으로 찾아볼 수 있다.

AI 코드의 오류를 찾았을 때는 간격을 키워 화면에서 감추기보다 어느 조건이 어긋났는지부터 본다. 너무 가까운 두 점이 발견되면 그 두 좌표, 들어간 격자 번호, 조사한 이웃 칸을 출력한다. 같은 시드인데 결과가 달라지면 난수를 호출하는 위치와 횟수를 비교한다. 예쁜 결과 한 장을 얻는 것과 다시 만들 수 있는 규칙을 확보하는 것은 서로 다른 확인 과정이다.

응용할 때는 중심점에 작은 이미지나 글리프를 올리거나, 특정 영역에서만 색을 바꾸는 실험부터 시작할 수 있다. 위치마다 `r`을 바꾸는 가변 밀도 배치는 이 코드의 상수만 배열로 바꾸면 끝나는 수정이 아니다. 격자 크기와 두 점 사이에 적용할 거리 기준도 다시 설계해야 한다. 이번에 직접 확인한 범위는 **고정 최소 거리의 2차원 배치, 정지 선 무늬, PNG 출력**까지다.

무작위라는 말만으로 화면의 질서를 설명할 필요는 없다. 어떤 거리는 허용하고 어떤 거리는 거절할지, 같은 점에 얼마나 긴 선을 올릴지, 여백을 어디까지 남길지 정할 수 있다. AI는 그 조건을 구현하는 일을 돕고, 제작자는 실제로 나온 흔적과 빈 공간을 보며 조건을 조절한다. 이 구분에서 반복 가능한 제작 과정이 시작된다.
