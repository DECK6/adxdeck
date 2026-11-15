---
type: article
track: media-art
mediaArtCategory: 기술·제작
title: AI와 그리는 노이즈 등고선, 마칭 스퀘어로 높이를 선으로 바꾸기
description: AI와 함께 마칭 스퀘어를 구현해 노이즈의 같은 높이를 선으로 그립니다. p5.js 실행 예제로 보간과 모호한 셀 처리, 격자 크기와 등고선 간격의 차이를 확인합니다.
aliases:
  - Drawing Noise Contours with AI and Marching Squares
author: 육대근
date created: 2026-11-16
date modified: 2026-11-16
tags:
  - article
  - media-art
  - generative-art
  - creative-coding
  - p5js
  - AI
thumbnail: images/contours-cover.png
status: completed
akmLayer: output
akmType: output
akmRole: deliverable
trustLevel: reviewed
sourceType: synthesis
---

# AI와 그리는 노이즈 등고선, 마칭 스퀘어로 높이를 선으로 바꾸기

![보이지 않는 높이를 청록색과 적갈색의 등고선으로 나타낸 추상 일러스트](images/contours-cover.png)

*표지는 GPT Image 2로 생성한 개념 이미지입니다. 아래의 실행 화면은 본문 코드로 직접 그린 결과입니다.*

회색 얼룩을 선으로 바꾸면 같은 무늬가 다른 풍경으로 읽힌다. 밝고 어두운 면이 사라진 자리에 겹겹의 섬과 길이 남는다. 이번에는 노이즈를 가상의 높이로 삼고, 같은 높이를 지나는 선만 추출해 한 장의 드로잉을 만든다. 실제 지형 자료는 사용하지 않는다.

제작 질문은 명확하다. **선의 수를 늘리는 것과 선을 더 정밀하게 그리는 것은 어떻게 다른가?** 마칭 스퀘어(marching squares)는 이 두 선택을 분리해 보기 좋은 기법이다. 높이를 몇 단계로 나눌지와 공간을 얼마나 촘촘하게 읽을지를 각각 정할 수 있기 때문이다.

AI는 이 규칙을 코드로 옮기고 경계 조건을 검토하는 데 쓴다. 실행할 때 화면을 만드는 것은 고정된 노이즈와 보간 규칙이다. 생성형 AI의 이미지 출력과 알고리즘 기반 제너러티브 드로잉은 이 작업에서 서로 다른 역할을 맡는다.

## 같은 높이가 지나가는 위치를 찾는다

노이즈 함수에 화면 좌표를 넣으면 각 위치에 하나의 값이 생긴다. 이를 높이로 생각해 보자. 높이 0.42인 지점들을 이으면 하나의 등고선 수준을 얻는다. 화면의 모든 위치를 계산하는 대신 격자 꼭짓점에서 값을 읽고, 네 점이 둘러싼 작은 사각형마다 선이 지날 자리를 추정한다.

셀의 한 변 양끝이 기준 높이의 서로 다른 쪽에 있다면 그 변을 선이 가로지른다. 교차점의 위치는 두 값 사이를 선형 보간해서 구한다. 예를 들어 양끝 값이 0과 1이고 기준 높이가 0.25라면 교차점은 낮은 쪽에서 변 길이의 25% 지점이다. 모든 교차점을 변의 중간에 놓으면 이런 차이가 사라진다. 마칭 스퀘어와 선형 보간의 관계는 [scikit-image의 find_contours 문서](https://scikit-image.org/docs/stable/api/skimage.measure.html#skimage.measure.find_contours)에서도 확인할 수 있다.

교차점이 두 개면 연결하면 된다. 네 개가 나오는 대각선 배치에는 선택이 필요하다. 높은 꼭짓점 두 개를 이어 줄 수도 있고, 각각 따로 둘 수도 있다. 이 예제는 **높은 쪽 꼭짓점을 각각 감싸도록 연결한다.** 낮은 영역의 대각선 연결을 허용하는 고정 규칙이다. 셀 내부의 실제 노이즈를 다시 조사해 연결 방향을 결정하지 않는다. 따라서 작은 섬이나 좁은 목의 형태는 격자와 이 규칙에 영향을 받는다.

AI에 처음부터 예쁜 지도를 요청하기보다, 이 선택을 포함한 구현 조건을 건네는 편이 수정하기 쉽다.

```text
p5.js 2.4.0으로 노이즈 등고선 드로잉을 만들고 싶다.
960×540 캔버스에 noiseSeed(33), noiseDetail(3, 0.5)를 사용한다.
격자 간격은 10px, 노이즈 좌표 배율은 0.006으로 둔다.
높이 0.30부터 0.66까지 0.06 간격으로 선을 추출한다.
변 양끝의 높이를 선형 보간하고, 기준과 같은 값은 높은 쪽으로 분류한다.
교차점이 네 개인 셀은 높은 꼭짓점을 각각 감싸는 두 선분으로 나눈다.
셀 함수와 그리기 코드를 분리하고 S키로 PNG를 저장하게 해라.
선분 개수를 닫힌 등고선 개수로 설명하지 말고, 검사할 경계 사례도 제안해라.
```

이 프롬프트는 재현을 위한 요청 예시다. AI가 돌려주는 구현은 매번 같다고 보장되지 않는다. 다음 코드는 위 조건으로 작성하고 실제 실행한 한 가지 구현이다.

## 작은 셀에서 한 장의 드로잉까지

웹 브라우저와 텍스트 편집기를 준비한다. [p5.js 공식 다운로드 페이지](https://p5js.org/download/)에서 확인한 2.4.0을 사용했다. 빈 폴더에 아래 `index.html`, `contours.js`, `sketch.js` 세 파일을 저장한다. HTML은 같은 버전의 라이브러리를 CDN에서 불러오므로 처음 실행할 때 인터넷 연결이 필요하다. 이번 실행 검증에서는 같은 파일을 내려받아 로컬에서 불러왔다.

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>Noise contour study</title>
  <script src="https://cdn.jsdelivr.net/npm/p5@2.4.0/lib/p5.min.js"></script>
  <script src="contours.js"></script>
  <script src="sketch.js"></script>
</head>
<body></body>
</html>
```

`contours.js`는 한 셀의 교차점과 선분만 계산한다. 꼭짓점은 왼쪽 위에서 시계 방향으로 넣는다. 같은 높이로 분류된 양끝은 건너뛰므로, 값이 같은 두 점 사이에서 0으로 나누지 않는다. 길이가 0인 선분도 마지막에 제외한다. 입력은 유한한 숫자 네 개와 양수인 셀 크기를 전제로 한다.

```js
// v: top-left, top-right, bottom-right, bottom-left.
function cellSegments(x, y, h, v, level) {
  const p = [[x, y], [x + h, y], [x + h, y + h], [x, y + h]];
  const edges = [[0, 1], [1, 2], [3, 2], [0, 3]];
  const hit = [];
  for (let e = 0; e < 4; e++) {
    const [a, b] = edges[e];
    if ((v[a] >= level) === (v[b] >= level)) continue;
    const t = (level - v[a]) / (v[b] - v[a]);
    hit.push({e, p: [p[a][0] + t * (p[b][0] - p[a][0]),
                     p[a][1] + t * (p[b][1] - p[a][1])]});
  }
  let pairs = [];
  if (hit.length === 2) pairs = [[hit[0].p, hit[1].p]];
  if (hit.length === 4) {
    const q = hit.map(a => a.p); // top, right, bottom, left
    pairs = v[0] >= level
      ? [[q[0], q[3]], [q[1], q[2]]]
      : [[q[0], q[1]], [q[2], q[3]]];
  }
  return pairs.filter(([a, b]) => a[0] !== b[0] || a[1] !== b[1]);
}
```

`sketch.js`는 격자의 높이를 한 번 저장한 뒤 여러 수준의 등고선을 그린다. [p5.js noise 문서](https://p5js.org/reference/p5/noise/)가 설명하듯 좌표 배율과 노이즈 설정은 무늬의 성격에 영향을 준다. 여기서는 배율을 화면 좌표에 곱하기 때문에, 격자 간격을 바꿔도 같은 위치에서 읽는 높이는 같다.

```js
const cfg = {seed: 33, step: 10, scale: 0.006, gap: 0.06};
let result;

function setup() {
  createCanvas(960, 540);
  pixelDensity(1);
  noLoop();
  result = renderContours();
  describe('청록색과 적갈색 등고선이 섬처럼 겹치는 추상 드로잉');
}

function renderContours() {
  background('#f4efe4');
  noiseSeed(cfg.seed);
  noiseDetail(3, 0.5);
  noFill();
  strokeWeight(1.25);
  const margin = 30, h = cfg.step;
  const cols = Math.floor((width - 2 * margin) / h);
  const rows = Math.floor((height - 2 * margin) / h);
  const field = Array.from({length: rows + 1}, (_, j) =>
    Array.from({length: cols + 1}, (_, i) =>
      noise((margin + i * h) * cfg.scale,
            (margin + j * h) * cfg.scale)));
  const all = [], counts = [];
  const count = Math.floor((0.66 - 0.3) / cfg.gap + 1e-9) + 1;
  for (let k = 0; k < count; k++) {
    const level = 0.3 + k * cfg.gap;
    stroke(k % 3 === 0 ? '#a54c37' : '#186e70');
    const segments = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const v = [field[j][i], field[j][i + 1],
                   field[j + 1][i + 1], field[j + 1][i]];
        for (const [a, b] of cellSegments(margin + i * h,
                                        margin + j * h, h, v, level)) {
          line(a[0], a[1], b[0], b[1]);
          segments.push([a, b]);
        }
      }
    }
    all.push({level, segments});
    counts.push(segments.length);
  }
  return {cols, rows, counts, all};
}

function keyPressed() {
  if (key === 's' || key === 'S') saveCanvas('noise-contours', 'png');
}
```

Python 3가 설치되어 있다면 세 파일이 있는 폴더에서 아래 명령을 실행하고 `http://localhost:8000/`을 연다. 종료할 때는 터미널에서 Ctrl+C를 누른다. 그림을 저장하려면 브라우저 페이지를 클릭한 뒤 S키를 누른다. [saveCanvas](https://p5js.org/reference/p5/saveCanvas/)는 PNG 저장을 요청하며, 브라우저 설정에 따라 다운로드되거나 저장 대화상자가 나타난다.

```bash
python3 -m http.server 8000
```

![p5.js 예제에서 직접 그린 청록색과 적갈색 노이즈 등고선 드로잉](images/contours-frame.png)

기본 설정의 실행 화면이다. 그리기 영역은 좌우·상하 30px 여백을 두며, 90×48개 셀을 순회한다. 일곱 높이에서 만든 선분은 총 2,052개였다. **이 수는 짧은 선분 개수다. 섬의 수나 닫힌 곡선 개수가 아니다.** 같은 설정을 다시 실행했을 때 좌표와 PNG가 같았고, S키로 저장한 960×540 PNG도 캔버스 출력과 일치했다. 이 재현 확인은 같은 p5.js 버전과 실행 환경에 한정한다.

## 격자는 모서리를, 높이 간격은 밀도를 바꾼다

`cfg.step`과 `cfg.gap`은 둘 다 작게 만들면 선분 수가 늘 수 있지만, 작품에 주는 효과는 다르다. `step`은 공간을 읽는 간격이고 `gap`은 어떤 높이를 그릴지 정하는 간격이다. 아래는 시드를 고정하고 한 변수씩 바꾼 실제 결과다. 파일을 수정한 뒤 페이지를 새로고침하면 비교할 수 있다.

| 변경 | 실제 선분 수 | 화면에서 읽을 변화 |
|---|---:|---|
| 기본 `step: 10`, `gap: 0.06`, `scale: 0.006` | 2,052 | 여러 크기의 섬과 굽은 통로 |
| `step: 30` | 642 | 짧은 굴곡이 빠지고 각이 크게 드러남 |
| `step: 5` | 4,124 | 같은 높이들을 더 작은 선분으로 따라감 |
| `gap: 0.03` | 3,898 | 높이 수준이 7개에서 13개로 늘어 선이 촘촘해짐 |
| `scale: 0.012` | 4,064 | 같은 화면 안에서 더 많은 기복을 읽음 |

선이 거칠다는 이유로 `gap`부터 줄이면 굵직한 각을 가진 선만 더 많이 생긴다. 먼저 `step`을 줄여 모서리를 살핀 다음 높이 수준을 늘려 보는 편이 두 효과를 구별하기 좋다. 반대로 큰 각과 빈 공간이 주는 건조한 인상을 원한다면 성긴 격자를 남길 수 있다. 정밀함이 항상 더 나은 화면을 뜻하지는 않는다.

높이 수준의 간격이 같아도 화면 위 선 사이의 거리는 일정하지 않다. 값이 빠르게 변하는 곳에서는 여러 수준을 짧은 거리 안에 지나간다. 이 밀도 차이가 가상의 능선과 평지를 만든다. 색은 현재 높이의 순번을 따라 반복하므로 `gap`을 바꾸면 색 배치도 함께 달라진다. 순수하게 선의 밀도만 비교하려면 `stroke()`를 한 색으로 고정해 보는 것이 좋다.

이번 코드는 `step`과 `gap`에 양수를 쓰는 작은 실험용이다. `step`이 그리기 영역을 나누어떨어지게 하지 않으면 오른쪽과 아래쪽에 쓰지 않는 여백이 더 생긴다. 아주 작은 값은 계산량을 크게 늘릴 수 있으므로 위 표의 범위부터 시작한다. 기준 높이 주변 값이 드문 시드에서는 어떤 수준의 선이 거의 보이지 않을 수도 있다.

## 선의 연결까지 작품의 선택으로 남긴다

한 셀에서 가능한 높고 낮음의 16가지 배치, 양쪽 대각선 배치, 평평한 셀, 기준과 같은 값, 이웃 셀의 공유 교차점, 단순한 평면의 보간 위치를 검사했다. 이런 검사는 AI가 제안한 코드의 작은 오류를 걸러 내지만, 모든 해상도에서 원래 노이즈의 형태를 그대로 보존한다는 보증은 아니다.

이 예제의 결과는 셀별 선분 목록이다. 선분들을 하나의 경로로 이어 붙이거나 SVG를 내보내는 기능은 포함하지 않는다. 화면 가장자리에 닿는 선은 열려 있고, 기준과 정확히 같은 값이 있는 특수한 배치에서는 점 접촉이나 겹치는 경계도 생길 수 있다. 펜 플로터용으로 옮기려면 끝점 연결, 중복 제거, 이동 순서, 실제 펜 두께를 별도로 다뤄야 한다. scikit-image 라이브러리를 실행한 결과도 아니다. 공식 문서는 보간과 연결 선택을 이해하는 근거로 읽었고, 그림은 위의 자체 JavaScript 코드로 만들었다.

다음 변형을 AI에 맡길 때도 완성 이미지의 분위기만 설명할 필요는 없다. “같은 높이 지도를 유지하고 특정 수준만 굵게 그려 달라”, “격자는 그대로 두고 색 반복을 없애 달라”처럼 바뀌는 것과 남는 것을 정해 보자. 이 작업에서 작가가 고르는 것은 가상의 지형뿐 아니라, 그 지형에서 어느 높이를 드러내고 어느 굴곡을 생략할지다.
