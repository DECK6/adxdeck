---
type: article
track: media-art
mediaArtCategory: 기술·제작
title: "AI와 만드는 반응 확산, 두 물질로 자라는 무늬"
description: "p5.js로 반응 확산 무늬를 만들고 AI를 구현 보조로 활용한다. 두 농도 배열의 갱신, 경계 처리, 공급·제거 비율과 계산 시간의 변화를 직접 실행하며 작품의 형태를 조절한다."
aliases:
  - Growing Reaction Diffusion Patterns with AI
author: 육대근
date created: 2026-11-13
date modified: 2026-11-13
tags:
  - article
  - media-art
  - generative-art
  - creative-coding
  - p5js
  - AI
thumbnail: images/reaction-diffusion-cover.png
status: completed
akmLayer: output
akmType: output
akmRole: deliverable
trustLevel: reviewed
sourceType: synthesis
---

# AI와 만드는 반응 확산, 두 물질로 자라는 무늬

![남색 바탕에서 크림색 점과 유기적인 띠가 이어지는 반응 확산 개념 이미지](images/reaction-diffusion-cover.png)

점을 놓고 선으로 연결하지 않았는데, 화면에서 둥근 띠가 자라나 서로 밀고 당긴다. 형태를 하나씩 그리는 대신, 각 위치의 작은 변화가 다음 위치에 영향을 주도록 만든 결과다. **반응 확산(reaction-diffusion)**은 이런 무늬를 만드는 방법이다.

이번에는 두 가상 물질의 농도를 계산하는 Gray–Scott 모델로 남색과 크림색의 화면을 만든다. 목표는 복잡한 시뮬레이션 프로그램을 완성하는 데 있지 않다. 계산 규칙을 이해할 수 있는 작은 예제를 만들고, 어떤 설정이 띠를 연결하고 어떤 설정이 점을 떨어뜨리는지 눈으로 비교하는 것이다.

생성형 AI는 이 과정에서 코드를 나누고 검사 조건을 정리하는 보조 역할을 맡는다. 완성된 무늬는 이미지 생성 모델이 매 프레임 그리는 것이 아니라, 정해진 수치 규칙을 반복한 결과다. 표지는 이 주제를 표현한 AI 생성 개념 이미지이며, 아래 실행 화면은 글의 코드를 실제로 돌린 결과다.

## 두 농도와 이웃의 차이로 시작하기

격자의 각 칸에는 A와 B라는 두 값이 있다. 주변과 농도가 다르면 확산하고, A와 B가 함께 있는 곳에서는 반응으로 A가 줄고 B가 늘어난다. 여기에 A를 보충하는 비율인 `feed`, B를 제거하는 데 관여하는 비율인 `kill`이 더해진다. 물질 입자를 하나씩 움직이는 대신 농도 배열을 갱신한다.

이 글의 계산식과 이웃 가중치는 [Karl Sims의 Reaction-Diffusion Tutorial](https://www.karlsims.com/rd.html)을 참고한다. A의 확산 계수는 1.0, B는 0.5이고 시간 간격은 1.0이다. 중심 칸에 -1, 상하좌우에 0.2, 대각선에 0.05를 곱해 더하면 이웃과의 차이를 얻는다. 가중치의 합은 0이므로 균일한 농도에서는 확산 항이 사라진다.

반응량은 `A * B * B`다. 이 값을 A에서 빼고 B에 더한다. A에는 `feed * (1 - A)`를 더하며, B에서는 `(kill + feed) * B`를 뺀다. 특히 B의 감소 항에서 `feed`를 빠뜨리면 같은 숫자를 넣어도 다른 모형이 된다. 이 식은 시각적 실험을 위한 수치 모델이며, 실제 생물 조직이나 특정 화학 반응을 그대로 재현한다는 뜻은 아니다.

AI에게는 원하는 이미지의 인상과 계산 조건을 함께 전달하면 좋다. 다음처럼 요청하면 검토할 지점이 분명해진다.

```text
p5.js로 Gray–Scott 반응 확산 무늬를 만들고 싶다.
농도 격자는 160×90, 출력은 960×540으로 한다.
A와 B의 현재 배열을 모두 읽은 뒤 별도 배열에 다음 상태를 써줘.
A 확산 계수 1.0, B 0.5, 시간 간격 1.0을 사용한다.
중심 -1, 상하좌우 0.2, 대각선 0.05인 라플라시안을 쓴다.
좌우·상하 경계를 각각 반대편과 연결하고, 4000회 계산 뒤 정지한다.
계산과 색 변환을 분리하고, 농도가 균일한 경우와 경계의 한 점을 검사해줘.
코드에 앞서 B 감소 항과 두 배열을 교환하는 이유를 설명해줘.
```

AI의 설명을 확인할 때는 “잘 작동한다”는 말보다 배열을 언제 읽고 쓰는지 본다. 한 배열을 순서대로 덮어쓰면 뒤쪽 칸은 이미 바뀐 이웃을 읽는다. 같은 순간을 계산하려던 화면에 스캔 방향의 영향이 섞일 수 있다. 모든 칸의 다음 값을 별도 배열에 쓴 뒤 한꺼번에 교환하는 이유다.

## 작은 격자를 실제 화면으로 옮기기

실행 환경은 웹 브라우저와 p5.js다. 이 예제는 작성 시점의 [공식 다운로드 페이지](https://p5js.org/download/)에서 제공한 **p5.js 2.4.0**으로 실행했다. 내려받은 `p5.min.js`와 아래의 `index.html`, `field.js`, `sketch.js`를 같은 폴더에 저장한다. 라이브러리의 버전을 고정해 두면 나중에 비교하기 쉽다.

`index.html`은 파일을 순서대로 불러온다.

```html
<!doctype html>
<html lang="ko">
<meta charset="utf-8">
<title>반응 확산 실습</title>
<script src="p5.min.js"></script>
<script src="field.js"></script>
<script src="sketch.js"></script>
<body></body>
</html>
```

`field.js`에는 농도 계산만 둔다. 처음에는 전체가 A=1, B=0이고, 정해진 다섯 위치의 작은 정사각형만 A=0, B=1로 바꾼다. 이 초기 배치는 예제를 위해 정한 선택이다. 난수를 쓰지 않아 같은 설정으로 시작하면 같은 계산을 반복한다.

```javascript
function createField(w, h, seeded = true) {
  const a = new Float64Array(w * h).fill(1);
  const b = new Float64Array(w * h);
  if (seeded) for (const [u, v] of [[.2,.3],[.5,.3],[.8,.3],[.35,.7],[.65,.7]]) {
    const cx = Math.floor(u * w), cy = Math.floor(v * h);
    for (let y = cy - 3; y <= cy + 3; y++)
      for (let x = cx - 3; x <= cx + 3; x++)
        { const i = ((y + h) % h) * w + (x + w) % w; a[i] = 0; b[i] = 1; }
  }
  return { w, h, a, b, nextA: new Float64Array(w*h), nextB: new Float64Array(w*h) };
}
function stepField(g, feed, kill) {
  const { w, h, a, b, nextA, nextB } = g;
  function lap(q, i, left, right, up, down) {
    return -q[i] + .2 * (q[left] + q[right] + q[up] + q[down])
      + .05 * (q[up - i + left] + q[up - i + right]
             + q[down - i + left] + q[down - i + right]);
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    const left = y*w + (x+w-1)%w, right = y*w + (x+1)%w;
    const up = ((y+h-1)%h)*w + x, down = ((y+1)%h)*w + x;
    const reaction = a[i] * b[i] * b[i];
    nextA[i] = a[i] + lap(a,i,left,right,up,down) - reaction + feed*(1-a[i]);
    nextB[i] = b[i] + .5*lap(b,i,left,right,up,down) + reaction - (kill+feed)*b[i];
  }
  g.a = nextA; g.b = nextB; g.nextA = a; g.nextB = b;
}
```

`left`, `right`, `up`, `down`은 배열 안의 이웃 위치다. 나머지 연산으로 화면 끝을 반대편과 연결한다. 오른쪽 끝을 넘은 농도가 왼쪽 끝에서 이어지는 **주기 경계**다. 이것은 공간의 경계를 정하는 방식이며, 영상의 마지막 프레임을 첫 프레임에 맞추는 시간 루프와는 다르다.

이어서 `sketch.js`에 표시와 저장을 넣는다. B가 많은 칸은 크림색, 적은 칸은 남색에 가까워진다. 농도 계산에는 색을 넣지 않는다.

```javascript
const W = 160, H = 90;
const FEED = .055, KILL = .062;
const TARGET = 4000, STEPS_PER_FRAME = 40;
let field, raster, steps = 0;
function setup() {
  createCanvas(960, 540);
  pixelDensity(1);
  noSmooth();
  raster = createImage(W, H);
  field = createField(W, H);
  describe('반응 확산으로 자라는 남색과 크림색 무늬');
}
function draw() {
  for (let n = 0; n < STEPS_PER_FRAME && steps < TARGET; n++, steps++)
    stepField(field, FEED, KILL);
  raster.loadPixels();
  for (let i = 0; i < W * H; i++) {
    const t = Math.max(0, Math.min(1, field.b[i] * 2.5));
    raster.pixels[4*i] = Math.round(12 + 230*t);
    raster.pixels[4*i+1] = Math.round(24 + 207*t);
    raster.pixels[4*i+2] = Math.round(48 + 156*t);
    raster.pixels[4*i+3] = 255;
  }
  raster.updatePixels();
  image(raster, 0, 0, width, height);
  if (steps === TARGET) noLoop();
}
function keyPressed() {
  if (key === 's' || key === 'S')
    saveCanvas(`reaction-diffusion-${steps}`, 'png');
}
```

Python 3가 설치되어 있다면 해당 폴더의 터미널에서 다음 명령으로 로컬 서버를 열고 브라우저에서 `http://localhost:8000/`에 접속한다.

```bash
python3 -m http.server 8000
```

시작하면 작은 영역에서 밝은 띠가 퍼지고, 4000회 계산한 뒤 정지한다. 화면을 클릭한 다음 S 키를 누르면 PNG를 저장한다. 계산 중에 누르면 그 시점의 화면을 저장하므로, 같은 결과를 비교할 때는 정지한 뒤 저장한다. 저장 방식은 p5.js의 [saveCanvas 문서](https://p5js.org/reference/p5/saveCanvas/)를 따른다.

![feed 0.055와 kill 0.062로 4000회 계산한 반응 확산 실행 화면](images/reaction-diffusion-frame.png)

위 이미지는 160×90 농도 격자를 960×540으로 확대한 실제 출력이다. 일부 경계에서 칸의 흔적이 보인다. `noSmooth()`로 확대 보간을 끈 선택이며, 계산 해상도가 낮은 것을 고해상도 시뮬레이션으로 감추지 않는다. 우선 작은 격자에서 형태를 고른 뒤 출력 방식을 결정할 수 있다.

## 같은 출발점에서 무엇을 바꿀 것인가

첫 비교에서는 초기 배치와 색을 그대로 두고 **계산 횟수**만 바꿨다. `TARGET`을 2000으로 줄였을 때는 분리된 고리 주변에 어두운 여백이 많이 남았다. 4000에서는 띠가 더 넓게 퍼지고, 인접한 영역 사이의 간격이 좁아졌다. 여기에 적은 관찰은 이 초기 조건에서의 결과다. 시간을 늘리면 언제나 더 좋은 화면이 되거나 복잡도가 계속 증가하는 것은 아니다.

다음 표의 설정도 같은 코드와 초기 배치로 실행했다. 각 값을 바꾼 뒤 새로고침해 처음부터 계산한다.

| FEED | KILL | TARGET | 실행 화면에서 확인한 변화 |
|---|---|---|---|
| 0.055 | 0.062 | 2000 | 분리된 고리와 큰 남색 여백이 남는다 |
| 0.055 | 0.062 | 4000 | 굽은 띠가 화면으로 퍼지며 서로 가까워진다 |
| 0.0367 | 0.0649 | 4000 | 띠 대신 떨어진 작은 밝은 덩어리들이 두드러진다 |
| 0.0545 | 0.062 | 4000 | 기본 설정과 비슷한 띠 구조에서 폭과 가장자리가 조금 달라진다 |

뒤의 두 계수 조합은 Sims의 설명에서 각각 분열과 산호 성장 예시에 쓰인 값이다. 그 영상과 이 실습은 초기 배치·격자·표시 방법이 다르므로 같은 장면을 복제하지는 않는다. 여기서는 직접 얻은 화면의 차이를 기준으로 비교한다.

`STEPS_PER_FRAME`은 한 번 화면을 그릴 때 수행할 계산 횟수다. 이 값을 늘리면 화면 사이에 더 많은 변화가 진행된다. 같은 `TARGET`에서 멈춘 농도 결과는 계산 순서가 같으면 같지만, 한 프레임의 작업량은 늘어난다. 재생 속도를 바꾸려는 목적과 무늬의 성질을 바꾸려는 목적을 구분해야 한다.

색을 바꾸고 싶다면 `raster.pixels`에 들어가는 값만 조절한다. `field.b[i] * 2.5`의 배수는 밝은 영역의 대비에 영향을 준다. 여기서 0~1로 제한하는 것은 **화면에 표시할 색 비율**이다. 농도 배열 자체를 잘라내지는 않는다. 색을 바꾼 결과와 반응 계수를 바꾼 결과를 섞어 비교하면 무엇이 형태를 바꾸었는지 읽기 어려워진다.

## AI가 만든 코드를 작품의 규칙으로 받아들이기 전에

이 예제에서는 A=1, B=0인 균일한 상태가 유지되는지, 경계의 한 점이 반대편 이웃으로 확산하는지, 한 단계 계산값이 식과 맞는지 검사했다. 초기 배열을 평행 이동한 경우에도 결과가 같은 만큼 이동하는지 확인해 갱신 순서의 영향을 살폈다. 위 계수 조합은 4000회 뒤 유한한 값을 유지했고, 같은 조건을 반복한 출력과 실제 PNG 저장 파일도 일치했다. 임의의 계수와 큰 시간 간격까지 안정성을 보증한 것은 아니다.

AI가 계산을 빠르게 작성해 주더라도 이 검사는 제작자의 일로 남는다. 검은 화면이 나왔다고 바로 색을 밝게 바꾸기 전에 농도가 모두 사라졌는지, 유효하지 않은 숫자가 생겼는지, 두 배열을 제대로 교환했는지 구분해야 한다. 원인을 모른 채 표시만 바꾸면 작품의 규칙을 설명할 수 없게 된다.

형태가 마음에 들기 시작하면 다섯 초기 위치를 비대칭으로 옮겨 보는 것이 다음 실험이 될 수 있다. 지금 화면의 좌우 균형은 초기 배치의 선택에서도 온다. 관객의 움직임을 B의 주입 위치로 연결하거나, 농도를 높이 값으로 삼아 입체 표면으로 표시하는 확장도 가능하다. 이 글에서 직접 실행한 범위는 고정 초기 조건의 2차원 계산과 PNG 출력까지다.

결과를 고를 때는 무늬의 복잡함만 보지 않는다. 떨어진 덩어리 사이의 간격이 필요한지, 이어지는 띠가 화면을 얼마나 채워야 하는지, 성장 중인 장면과 멈춘 장면 중 어느 쪽이 의도에 맞는지 본다. 같은 모델을 사용해도 초기 위치, 멈추는 시점, 색으로 읽히는 농도의 범위가 다른 화면을 만든다. AI와 함께 만든 코드가 작품이 되는 지점은 그 선택을 자기 언어로 설명할 수 있을 때다.
