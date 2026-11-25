---
type: article
track: media-art
mediaArtCategory: 기술·제작
title: "점으로 남긴 구의 안쪽, AI와 Three.js로 만드는 입자 조형"
description: "Three.js Points로 2,400개의 점을 구면에 배치하고, 점 크기와 카메라 시점으로 입자 조형의 밀도를 바꾼다. AI 제작 명세, 피보나치 구면 좌표, 실행 코드와 PNG 저장까지 연결한다."
aliases:
  - building-a-point-sphere-with-ai-and-threejs
author: 육대근
date created: 2026-11-26
date modified: 2026-11-26
tags:
  - article
  - media-art
  - generative-art
  - creative-coding
  - threejs
  - AI
thumbnail: images/point-sphere-cover.png
status: completed
akmLayer: output
akmType: output
akmRole: deliverable
trustLevel: reviewed
sourceType: synthesis
---

![작은 빛의 점들이 빈 구면을 이루는 AI 생성 개념 표지. 실제 예제 출력과는 구별되는 이미지다.](images/point-sphere-cover.png)

표면이 없는 구를 만들 수 있을까. 점을 충분히 놓으면 눈은 그 사이를 연결해 둥근 부피를 읽는다. 그러나 마우스로 시점을 돌리면 앞쪽 점 사이로 뒤쪽 점이 보이고, 조금 전 단단해 보이던 형태가 얇은 껍질처럼 느껴진다. 이번에는 Three.js로 이런 입자 조형을 만든다.

결과물은 반지름 3인 구면 위의 점 2,400개다. 점의 크기를 바꾸고 카메라를 회전한 다음, 마음에 드는 장면을 PNG로 저장한다. 물리 시뮬레이션이나 AI 이미지 생성 결과를 3D로 변환하는 작업은 아니다. 좌표 규칙으로 형태를 만들고, 렌더링 방식으로 그 형태의 인상을 조절하는 실습이다. 위 이미지는 AI 생성 개념 표지이며, 아래 이미지는 이 글의 코드를 실행해 저장한 실제 화면이다.

![Three.js 예제에서 출력한 2,400개 점의 구. 위쪽의 따뜻한 색과 아래쪽의 푸른색 사이로 빈 공간이 보인다.](images/point-sphere-frame.png)

## AI에게 맡길 것은 점의 개수보다 배치의 조건이다

“입자가 모인 구를 만들어 줘”라는 요청만으로도 그럴듯한 화면은 얻을 수 있다. 하지만 위도와 경도를 같은 간격으로 나누면 극 근처에 점이 몰리고, 무작위 배치는 우연히 생긴 덩어리와 빈틈 때문에 형태가 거칠어질 수 있다. 어느 쪽도 틀린 미학은 아니지만, 이번 목표는 극에 점이 과도하게 몰리지 않는 규칙적인 구면이다.

AI에는 결과의 분위기와 함께 확인 가능한 조건을 준다. 다음은 구현 초안을 요청할 때 사용할 제작 명세다. 특정 모델의 실제 응답을 인용한 것은 아니다.

```text
Three.js 0.187.0으로 점으로만 된 구면 조형물을 만들어라.
반지름은 3, 점은 2400개다. 모든 점은 구 내부가 아니라 표면에 있다.
y=1-2*(i+0.5)/n으로 높이를 정하고 황금각으로 둘레 방향을 바꿔라.
좌표 계산은 sphere.mjs로 분리하고 입력 범위를 검사해라.
BufferGeometry와 Points 하나로 그려라. 작은 구 Mesh를 복제하지 마라.
PointsMaterial의 점 크기는 3, sizeAttenuation은 false로 시작해라.
아래쪽은 푸른색, 위쪽은 따뜻한 색으로 보간해라.
카메라 회전, 점 크기 1~8 조절, 초기화, 960×540 PNG 저장을 넣어라.
텍스처·조명·투명 블렌딩·자동 재생은 넣지 마라.
index.html, sphere.mjs, app.mjs 세 파일로 만들고 검증할 수치를 설명해라.
```

이렇게 요청하면 AI의 역할은 분명해진다. 생성형 AI는 규칙을 코드로 옮기고 API 사용을 점검하는 보조 도구다. 실행 중에 점의 위치를 결정하는 것은 수학적 규칙이며, 예제는 AI API를 호출하지 않는다. 사람이 선택해야 할 것은 점들이 얼마나 떨어져 보일지, 어느 시점에서 구의 안쪽을 읽게 할지, 어떤 장면을 결과로 남길지다. 조건을 좁히면 AI가 제안한 구현을 검토하는 데 도움이 된다.

## 높이를 나누고, 황금각으로 둘레를 돌린다

피보나치 구면 배치의 한 방식은 점마다 높이를 조금씩 낮추고, 다음 점의 둘레 방향을 황금각만큼 돌리는 것이다. 황금각은 π(3−√5), 약 2.399963라디안이다. 여기서는 i가 0부터 n−1까지 변할 때 단위 구의 높이를 y=1−2(i+0.5)/n으로 정한다. 양 끝에 정확한 극점을 넣지 않고 각 높이 구간의 가운데를 택한다.

높이가 y인 수평 원의 반지름은 √(1−y²)다. 이 값을 ring이라 하고 θ=i×황금각이라 두면 단위 구의 좌표는 (ring cosθ, y, ring sinθ)가 된다. 세 좌표를 원하는 반지름으로 곱하면 완성이다. x²+y²+z²가 반지름의 제곱과 같아야 한다는 조건으로 결과를 점검할 수 있다.

왜 각도가 아니라 높이를 같은 간격으로 나눌까. 반지름 R인 구에서 높이 차이가 ΔY인 구면 띠의 면적은 2πRΔY다. 높이를 같은 간격으로 나누면 각 띠의 면적도 같아진다. 이번 배치는 각 띠에 점 하나를 두고, 둘레 방향을 황금각으로 분산한다. 다만 이 방법이 모든 이웃 점 사이의 거리를 정확히 같게 만들거나 최적의 구면 포장을 보장하는 것은 아니다.

또한 구면 위에서 고르게 놓았다고 화면에서도 같은 간격으로 보이지는 않는다. 가장자리에서는 표면을 비스듬히 보므로 점들이 더 가까워 보이고, 앞뒤 점이 겹쳐 보이기도 한다. 이런 밀도의 차이는 오류라기보다 입체 형태를 읽게 하는 단서다. 화면상 간격까지 같게 만들려면 별도의 투영 문제를 풀어야 한다.

## 면 대신 점을 렌더링한다

Three.js의 Points는 점 또는 점군을 표시하는 객체다. BufferGeometry에 위치를 넣고 PointsMaterial로 모습을 정한다. 이번 예제에는 삼각형으로 연결된 구의 표면도, 작은 구 Mesh 2,400개도 없다. [Points 공식 문서](https://threejs.org/docs/#Points), [BufferGeometry 공식 문서](https://threejs.org/docs/#BufferGeometry)

텍스처를 주지 않은 기본 점은 화면에 정렬된 작은 사각형으로 보인다. 카메라를 돌려도 각 점이 입체 큐브처럼 옆면을 드러내지는 않는다. 대신 점들의 3차원 위치가 달리 투영되어 구의 인상이 바뀐다. 조명을 추가하지 않아도 색이 보이는 점 재질을 사용하므로, 빛과 그림자에 의한 입체감보다 배치·겹침·색에 집중할 수 있다.

PointsMaterial의 size는 점 크기를 지정하며 하드웨어의 점 크기 범위에 제한될 수 있다. sizeAttenuation은 원근 카메라에서 깊이에 따라 점 크기를 줄일지 정하는 옵션이다. 여기서는 false로 두어 가까운 점과 먼 점의 화면상 크기를 같게 시작한다. 실제 점이 덮는 픽셀과 표시 크기는 렌더러 해상도·CSS 축소·기기의 래스터 처리까지 영향을 받는다. [PointsMaterial 공식 문서](https://threejs.org/docs/#PointsMaterial)

빈 공간이 보인다고 재질이 반투명한 것은 아니다. 이 코드는 transparent를 켜지 않고 기본 깊이 검사를 사용한다. 점이 없는 부분으로 뒤쪽 점을 볼 수 있으며, 같은 화면 위치에서 겹친 점은 깊이에 따라 가려진다. 점 크기를 키우면 빈틈이 줄고, 작게 하면 형태가 더 흩어진다. 투명도 슬라이더와는 다른 조형 제어다.

### 세 파일을 같은 폴더에 저장한다

WebGL을 지원하는 브라우저와 Python 3가 필요하다. 아래 코드는 Three.js core와 addons를 모두 0.187.0으로 고정했다. 라이브러리를 CDN에서 가져오므로 인터넷 연결이 필요하다. 다른 버전으로 바꾸는 실험은 두 경로를 함께 바꾸고 별도로 검증한다.

먼저 `index.html`을 만든다. 캔버스는 내부적으로 960×540을 유지하고, CSS는 화면에서 보이는 너비만 줄인다.

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Three.js 점의 구</title>
<style>
body{margin:0;background:#101a24;color:#e5eee8;font:15px sans-serif}
main{max-width:960px;margin:24px auto}canvas{display:block;width:100%;height:auto}
.controls{display:flex;gap:16px;align-items:center;flex-wrap:wrap;padding:16px}
button{padding:8px 12px}input{width:220px}p{padding:0 16px}
</style>
<script type="importmap">
{"imports":{
  "three":"https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js",
  "three/addons/":"https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/"
}}
</script>
</head>
<body><main>
<div id="view"></div>
<div class="controls">
<label>점 크기 <input id="size" type="range" min="1" max="8" value="3" step="1"></label>
<button id="reset">처음 시점</button><button id="save">PNG 저장</button>
</div>
<p>드래그로 둘러보고 휠로 확대합니다. 점 크기를 바꾸며 틈을 관찰합니다.</p>
<p id="stats" aria-live="polite"></p>
</main><script type="module" src="app.mjs"></script></body>
</html>
```

다음은 좌표만 계산하는 `sphere.mjs`다. 함수의 최대 점 개수와 반지름은 잘못된 입력을 제한하기 위한 값이다. 그 상한까지 현재 카메라 구도가 적합하거나 모든 기기에서 빠르게 그려진다는 보장은 아니다. 완성 예제는 점 2,400개와 반지름 3에 맞춰져 있다.

```javascript
export function makeSphere(n = 2400, radius = 3) {
  if (!Number.isInteger(n) || n < 1 || n > 20000) {
    throw new RangeError('n must be an integer from 1 to 20000');
  }
  if (!Number.isFinite(radius) || radius <= 0 || radius > 100) {
    throw new RangeError('radius must be finite, positive and at most 100');
  }
  const angle = Math.PI * (3 - Math.sqrt(5));
  const points = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - 2 * (i + 0.5) / n;
    const ring = Math.sqrt(1 - y * y);
    const theta = i * angle;
    points.push([
      radius * ring * Math.cos(theta),
      radius * y,
      radius * ring * Math.sin(theta)
    ]);
  }
  return points;
}
```

마지막으로 `app.mjs`를 만든다. position 속성은 x, y, z 세 값씩 묶이고, color 속성도 r, g, b 세 값씩 묶인다. Float32BufferAttribute에 전달할 때 계산 결과가 32비트 부동소수점 값으로 저장되므로, 수학 함수의 원래 값과 완전히 같은 비트 표현이라고 생각하지 않는다.

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeSphere } from './sphere.mjs';

const radius = 3;
const positions = makeSphere(2400, radius);
const scene = new THREE.Scene();
scene.background = new THREE.Color('#101a24');
const camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 100);
camera.position.set(5, 3, 7);
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(960, 540);
document.querySelector('#view').append(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = false;
controls.minDistance = 5;
controls.maxDistance = 16;
controls.update();
controls.saveState();
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions.flat(), 3));
const low = new THREE.Color('#3c8fba');
const high = new THREE.Color('#ffcf9d');
const color = new THREE.Color();
const colors = [];
for (const [, y] of positions) {
  color.copy(low).lerp(high, (y / radius + 1) / 2);
  colors.push(color.r, color.g, color.b);
}
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
geometry.computeBoundingSphere();
const material = new THREE.PointsMaterial({
  size: 3, sizeAttenuation: false, vertexColors: true
});
const cloud = new THREE.Points(geometry, material);
scene.add(cloud);
function render() {
  renderer.render(scene, camera);
  document.querySelector('#stats').textContent =
    `${positions.length}개 점 · 크기 ${material.size} · 렌더 호출 ${renderer.info.render.calls}회`;
}
const slider = document.querySelector('#size');
slider.addEventListener('input', () => {
  material.size = Number(slider.value);
  render();
});
controls.addEventListener('change', render);
document.querySelector('#reset').addEventListener('click', () => {
  slider.value = '3';
  material.size = 3;
  controls.reset();
  render();
});
document.querySelector('#save').addEventListener('click', () => {
  render();
  const link = document.createElement('a');
  link.download = 'point-sphere.png';
  link.href = renderer.domElement.toDataURL('image/png');
  link.click();
});
render();
window.artwork = { THREE, renderer, geometry, material, cloud, camera, controls };
```

색은 실제 높이로 보간한다. y가 −radius에 가까우면 푸른색, +radius에 가까우면 따뜻한 색이 된다. 점을 카메라 쪽으로 돌렸다고 색을 다시 계산하지 않으므로 색 띠는 조형물의 위아래에 남는다. 위치를 만들 때 경계 구도 계산한다. 이 예제는 좌표를 이후에 바꾸지 않고 재질의 점 크기와 카메라만 바꾼다.

OrbitControls의 감쇠와 자동 회전은 사용하지 않는다. 카메라 change 이벤트나 점 크기 input 이벤트가 생길 때 다시 그리는 구성이다. PNG 저장 직전에도 한 번 렌더한다. preserveDrawingBuffer는 이 작은 예제의 저장 경로를 단순하게 하기 위한 설정이며, 큰 실시간 작품의 최적화 기본값으로 일반화하지 않는다.

세 파일이 들어 있는 폴더의 터미널에서 다음 명령을 실행하고 `http://127.0.0.1:8000/`을 연다. HTML 파일을 직접 더블클릭해서 여는 방식과 구분한다.

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

처음에는 점 크기 3의 구가 보인다. 슬라이더를 가운데로 옮겨 점 크기를 5로 바꿔 본다. 좌표와 개수는 그대로인데 점 사이의 빈틈이 줄어든다. 드래그로 시점을 돌리고, `처음 시점`으로 카메라와 크기를 되돌릴 수 있다. `PNG 저장`은 현재 시점의 장면을 저장한다. 자동 재생이나 시간에 따른 입자 이동은 넣지 않았다.

## 저장한 장면에서 무엇을 확인할까

좌표 함수에는 점의 개수·유한성·반지름, 작은 입력의 분석값과 황금각, 높이 간격과 극점 회피, 높이 평균, 반지름 비례와 반환값 독립성, 잘못된 입력 거부를 확인하는 6개 테스트를 실행했다. 높이 평균이 0이라는 조건은 y축에 관한 것이며, 유한한 점 집합의 x와 z 평균까지 정확히 0이라는 주장은 아니다.

브라우저에서는 Three.js revision 187, 위치 속성 2,400개, 렌더 통계의 점 2,400개와 호출 1회를 확인했다. 점 크기를 3에서 5로 바꾸는 조작, 카메라 회전, 초기화, PNG 다운로드도 검사했다. 같은 실행 환경에서 최초 프레임·저장 버튼 결과·초기화·새로고침 후 PNG가 같은지 대조했다. 다른 GPU나 브라우저에서도 픽셀이 완전히 같다는 의미는 아니다. 렌더 호출 1회라는 숫자만으로 대규모 입자 시스템의 성능을 입증한 것도 아니다.

처음 결과를 바꿀 때는 점 개수보다 점 크기를 먼저 움직여 보는 편이 좋다. 이미 만들어진 공간 배치를 유지하면서 열린 껍질과 촘촘한 표면 사이의 차이를 볼 수 있기 때문이다. 다음은 기본 장면 이후의 변형 방향이며 모든 조합을 실행 검증했다는 뜻은 아니다.

| 바꿀 요소 | 관찰할 변화 | 주의할 경계 |
| --- | --- | --- |
| 점 크기 | 빈틈의 비율과 덩어리감 | 큰 값은 하드웨어 제한을 받을 수 있다 |
| 점 개수 | 구면을 읽는 매끄러움과 중첩 | 개수만 늘리면 화면이 과밀해질 수 있다 |
| 카메라 위치 | 앞뒤 겹침과 색 띠의 방향 | 확대하면 구 일부가 화면 밖으로 나갈 수 있다 |
| sizeAttenuation | 앞뒤 점 크기의 원근 차이 | true로 바꾸면 size도 다시 조정해야 한다 |
| 위아래 색 | 온도감과 공간의 방향성 | 밝기 차이가 너무 작으면 색 띠가 약해진다 |

AI에 후속 수정을 맡길 때도 한 번에 하나만 요청한다. “점의 위치와 개수는 유지하고 크기만 바꿔 비교하자”처럼 변하지 않을 조건을 먼저 적는다. 작은 차이를 저장해 나란히 보면, 이 작품의 재료가 점 자체뿐 아니라 점 사이에 남겨 둔 공간이라는 사실이 더 분명해진다.
