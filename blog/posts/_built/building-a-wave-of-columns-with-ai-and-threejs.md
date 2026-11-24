---
type: article
track: media-art
mediaArtCategory: 기술·제작
title: "400개의 기둥으로 만드는 파동, AI와 Three.js 인스턴싱"
description: "Three.js InstancedMesh로 400개의 기둥을 배치하고, 높이·색·시점을 조절해 파동 조형물을 만든다. AI에 전달할 제작 조건부터 실행 가능한 코드, 실제 렌더 호출과 PNG 저장 검증까지 살펴본다."
aliases:
  - building-a-wave-of-columns-with-ai-and-threejs
author: 육대근
date created: 2026-11-25
date modified: 2026-11-25
tags:
  - article
  - media-art
  - generative-art
  - creative-coding
  - threejs
  - AI
thumbnail: images/instanced-wave-cover.png
status: completed
akmLayer: output
akmType: output
akmRole: deliverable
trustLevel: reviewed
sourceType: synthesis
---

![같은 바닥에서 높낮이가 바뀌며 동심원 파동을 이루는 기둥 조형물의 AI 생성 개념 표지.](images/instanced-wave-cover.png)

넓은 바닥에 같은 모양의 기둥을 세운다. 높이가 조금씩 달라지면 평범한 격자가 능선과 골짜기를 가진 조형물로 바뀐다. 관객이 시점을 돌리면 앞쪽 기둥에 가려졌던 낮은 부분이 드러나고, 옆면의 밝기가 바뀌면서 파동의 굴곡을 읽게 된다. 이번에는 Three.js로 이런 작은 입체 작품을 만든다.

목표는 20×20, 모두 400개의 기둥이다. 슬라이더로 파동의 위상을 바꾸고, 마우스로 둘러본 뒤 마음에 드는 장면을 960×540 PNG로 저장한다. 단순한 도형 반복을 3차원 공간에서 어떻게 구성하고 확인하는지 배우는 예제다. 위 표지는 개념을 표현한 AI 생성 이미지이며, 아래 이미지는 이 글의 코드를 실제 브라우저에서 실행해 저장한 결과다.

![Three.js 코드로 렌더한 400개 기둥의 파동. 낮은 곳은 청록색, 높은 곳은 복숭아색이며 같은 바닥에 놓여 있다.](images/instanced-wave-frame.png)

## AI에게는 장면보다 제작 조건을 먼저 준다

“멋진 3D 파동을 만들어 줘”라고 요청하면 조명 효과와 애니메이션은 풍성해져도, 기둥을 어떻게 배치했는지 파악하기 어려울 수 있다. 먼저 반복 단위, 높이 규칙, 조작 방법, 확인할 숫자를 고정하면 AI가 만든 코드를 검토하기 수월하다. 다음은 코드 초안을 요청할 때 쓸 수 있는 제작 명세다. 특정 모델의 응답을 인용한 문장이 아니다.

```text
Three.js 0.187.0으로 작은 제너러티브 조형물을 만들고 싶다.
20×20 격자에 밑면 0.55×0.55인 기둥 400개를 놓아라.
격자 간격은 0.8이고 전체 격자의 중심은 x=z=0이다.
높이는 h=1.5+1.2*sin(0.9*hypot(x,z)-phase)로 계산한다.
기둥의 밑면은 모두 y=0에 있어야 한다.
기둥들은 하나의 InstancedMesh로 만들고 높이에 따라 색을 바꿔라.
정사영 카메라, OrbitControls, 위상 슬라이더, 초기화, PNG 저장을 넣어라.
자동 재생과 그림자 효과는 넣지 말고 조작할 때만 다시 그려라.
위치·높이 계산은 field.mjs로 분리하고 입력 검증을 넣어라.
index.html, field.mjs, app.mjs 세 파일과 실행 방법을 제시하라.
행렬·색 갱신 플래그와 경계 구 재계산이 필요한 이유도 설명하라.
```

이 과정에서 생성형 AI는 규칙을 코드로 옮기고 오류를 찾는 보조 도구다. 실제 조형물을 생성하는 것은 거리와 사인 함수, 반복 배치라는 알고리즘이다. 예제 자체는 AI API를 호출하지 않는다. 화면을 바꾸는 권한을 명확한 변수 몇 개에 두면 결과를 비교하고 자신의 조형 언어로 발전시키는 데 도움이 된다.

## 높이만 늘리면 기둥이 바닥을 뚫는다

Three.js의 기본 박스는 중심을 기준으로 만들어진다. 높이가 1인 박스를 y축으로 h배 늘리면 아래쪽은 −h/2, 위쪽은 h/2가 된다. 이 상태로 중심을 y=0에 놓으면 기둥의 절반이 바닥 아래로 들어간다. 따라서 높이를 h로 바꿀 때 중심도 y=h/2로 올린다. 그러면 밑면은 h/2−h/2=0, 윗면은 h가 된다.

높이 식에서 중심까지의 거리는 r=√(x²+z²)다. 사인 값의 범위가 −1부터 1이므로 높이 h는 0.3부터 2.7 사이에 머문다. 1.5는 기준 높이(사인파의 중심값), 1.2는 높낮이의 폭, 0.9는 공간에서 파동이 얼마나 촘촘하게 반복되는지를 정한다. phase는 그 패턴의 진행 위치다. 같은 phase에서 중심까지 거리가 같은 기둥은 같은 높이를 갖는다.

20칸처럼 짝수 개를 배치하면 원점은 가운데 네 기둥 사이에 놓인다. 이 예제에는 정확히 원점에 선 기둥이 없다. 좌표의 양끝은 약 −7.6과 7.6이며, 폭 0.55인 기둥 사이에는 0.25만큼의 간격이 남는다. 이 틈 덕분에 파동이 매끈한 표면과 개별 기둥의 집합으로 번갈아 보인다.

## 같은 모양을 400번 그리는 방법

각 기둥을 별도의 Mesh로 만들 수도 있지만, 이번에는 같은 박스 형상과 재질을 공유하는 InstancedMesh 하나를 사용한다. 기둥마다 위치·크기 행렬과 색만 달리 준다. Three.js 공식 문서도 같은 형상과 재질을 가진 여러 대상을 서로 다른 변환으로 그릴 때 InstancedMesh를 사용하면 렌더 호출 수를 줄일 수 있다고 설명한다. [InstancedMesh 공식 문서](https://threejs.org/docs/#InstancedMesh)

여기서 “한 번에 그린다”는 말을 “계산이 사라진다”로 받아들이면 안 된다. 이 예제는 JavaScript가 400개의 높이와 행렬을 계산한다. GPU에는 공유 형상과 각 인스턴스의 정보가 전달된다. 이번 장면에서 관측한 렌더 호출은 기둥 묶음과 바닥을 합쳐 2회였지만, 이것이 일반 Mesh보다 400배 빠르다는 뜻은 아니다. 프레임 속도 비교 실험도 하지 않았다.

## 세 파일로 실행하기

빈 폴더에 다음 세 파일을 같은 이름으로 저장한다. Python 3가 설치된 환경에서 로컬 서버를 실행하고, WebGL을 지원하는 브라우저로 연다. 라이브러리는 CDN에서 불러오므로 첫 실행에는 인터넷 연결이 필요하다. HTML을 파일 탐색기에서 직접 여는 방식 대신 로컬 서버를 사용한다.

이 예제는 Three.js 0.187.0을 고정해 검증했다. core와 addons를 같은 버전으로 맞추는 것이 중요하다. import map으로 CDN을 연결하는 방식과 로컬 서버 사용법은 공식 설치 안내에서 확인할 수 있다. [Three.js 설치 안내](https://threejs.org/manual/#installation)

### 1. index.html — 화면과 조작부

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Three.js 기둥 파동</title>
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
<label>위상 <input id="phase" type="range" min="0" max="1000" value="0" step="1"></label>
<button id="reset">처음 시점</button><button id="save">PNG 저장</button>
</div>
<p>드래그로 둘러보고, 휠로 확대합니다. 슬라이더로 파동의 위상을 바꿉니다.</p>
<p id="stats" aria-live="polite"></p>
</main><script type="module" src="app.mjs"></script></body>
</html>
```

캔버스의 내부 출력 크기는 960×540으로 고정하고 CSS로 표시 너비를 줄인다. 화면에서 작게 보더라도 PNG는 같은 픽셀 크기로 저장된다. 휴대전화에 맞춘 고해상도 출력이나 임의 비율의 캔버스 리사이즈는 이 예제의 범위에 넣지 않았다.

### 2. field.mjs — 위치와 높이

```javascript
export function makeField(n = 20, phase = 0) {
  if (!Number.isInteger(n) || n < 1 || n > 80) {
    throw new RangeError('n must be an integer from 1 to 80');
  }
  if (!Number.isFinite(phase) || Math.abs(phase) > 1e6) {
    throw new RangeError('phase must be finite and within ±1e6');
  }
  const result = [];
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const x = (col - (n - 1) / 2) * 0.8;
      const z = (row - (n - 1) / 2) * 0.8;
      const h = 1.5 + 1.2 * Math.sin(0.9 * Math.hypot(x, z) - phase);
      result.push({ x, z, h, y: h / 2 });
    }
  }
  return result;
}
```

그리기와 계산을 분리하면 AI에게 수정 요청을 할 때도 범위를 좁힐 수 있다. “모든 기둥의 밑면이 0인지 검사해 줘”, “phase에 2π를 더해도 같은 높이인지 확인해 줘”처럼 결과가 분명한 질문을 만들 수 있다. n의 상한 80은 계산 함수의 입력 제한일 뿐, 현재 카메라와 바닥이 모든 크기의 격자를 담는다는 보장은 아니다. 아래 완성 장면은 N=20에 맞춰져 있다.

### 3. app.mjs — 입체로 배치하고 저장하기

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeField } from './field.mjs';

const N = 20;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#101a24');
const camera = new THREE.OrthographicCamera(-160/9, 160/9, 10, -10, 0.1, 100);
camera.position.set(18, 17, 22);
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(960, 540);
document.querySelector('#view').append(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.enablePan = false;
controls.enableDamping = false;
controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.minZoom = 0.6;
controls.maxZoom = 2;
controls.update();
controls.saveState();
scene.add(new THREE.HemisphereLight(0xd8f4ff, 0x263132, 2));
const light = new THREE.DirectionalLight(0xffeed8, 3);
light.position.set(5, 12, 8);
scene.add(light);
const material = new THREE.MeshStandardMaterial({ roughness: 0.65, metalness: 0 });
const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.55, 1, 0.55), material, N*N);
scene.add(mesh);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 18),
  new THREE.MeshStandardMaterial({ color: 0x182b34, roughness: 1 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.01;
scene.add(floor);
const dummy = new THREE.Object3D();
const low = new THREE.Color('#2a787f');
const high = new THREE.Color('#ffba83');
const color = new THREE.Color();
const slider = document.querySelector('#phase');
let field;
function render() {
  renderer.render(scene, camera);
  document.querySelector('#stats').textContent =
    `${N*N}개 기둥 · 현재 렌더 호출 ${renderer.info.render.calls}회`;
}
function applyPhase() {
  const phase = Number(slider.value) / 1000 * Math.PI * 2;
  field = makeField(N, phase);
  field.forEach((v, i) => {
    dummy.position.set(v.x, v.y, v.z);
    dummy.scale.set(1, v.h, 1);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    color.copy(low).lerp(high, (v.h - 0.3) / 2.4);
    mesh.setColorAt(i, color);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.instanceColor.needsUpdate = true;
  mesh.computeBoundingSphere();
  render();
}
slider.addEventListener('input', applyPhase);
controls.addEventListener('change', render);
document.querySelector('#reset').addEventListener('click', () => {
  slider.value = '0';
  controls.reset();
  applyPhase();
});
document.querySelector('#save').addEventListener('click', () => {
  render();
  const link = document.createElement('a');
  link.download = 'instanced-wave.png';
  link.href = renderer.domElement.toDataURL('image/png');
  link.click();
});
applyPhase();
// 개발자 도구에서 실제 행렬과 렌더 통계를 확인할 수 있다.
window.artwork = { THREE, renderer, mesh, camera, controls, getField: () => field };
```

코드가 길어 보여도 중심 흐름은 짧다. makeField가 숫자를 만들고, 임시 Object3D가 각 기둥의 위치와 크기를 행렬로 바꾼다. setMatrixAt은 그 행렬을 해당 인스턴스에 저장한다. setColorAt은 높이에 맞춘 색을 저장한다. 마지막에 instanceMatrix와 instanceColor의 needsUpdate를 켜 갱신된 정보를 렌더러에 전달한다. 변환으로 장면의 범위가 달라질 수 있으므로 computeBoundingSphere도 다시 호출한다. 이는 위 공식 문서의 갱신 조건을 따른 구성이다.

정사영 카메라는 가까운 기둥과 먼 기둥의 원근에 따른 크기 차이를 없앤다. 작은 건축 모형을 보는 듯한 인상을 주는 선택이다. 다만 가림 현상은 그대로 남는다. 카메라를 낮추면 앞쪽 기둥이 뒤쪽 골짜기를 가리고, 높이면 격자의 원형 패턴이 선명해진다.

OrbitControls는 별도로 가져오는 addon이다. 이 예제는 왼쪽 드래그로 회전하고 휠로 확대하며, 이동 기능은 꺼 두었다. 감쇠와 자동 회전도 껐으므로 change 이벤트가 발생할 때만 다시 그린다. 감쇠나 자동 회전을 추가한다면 반복적인 update 호출을 포함한 렌더 루프가 필요하다. [OrbitControls 공식 문서](https://threejs.org/docs/#OrbitControls)

밝은 방향광과 부드러운 반구광은 기둥의 윗면과 옆면을 구분해 준다. 이 코드에는 그림자 맵이 없다. 표지에서 보이는 풍부한 음영을 모두 재현한다고 기대하기보다, 실제 출력 이미지에서 면의 밝기와 가림이 만드는 깊이를 살펴보면 좋다.

### 4. 실행과 확인

세 파일이 들어 있는 폴더의 터미널에서 실행한다.

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:8000/`을 열면 기둥 파동과 조작부가 나타난다. 슬라이더를 가운데로 옮기면 위상이 π가 되어 높고 낮은 부분이 뒤바뀐다. 양 끝은 각각 0과 2π이므로 같은 패턴으로 돌아온다. 자동 재생은 없으며, 손으로 위상을 움직이며 장면을 탐색하는 방식이다.

마우스로 시점을 돌린 뒤 `PNG 저장`을 누르면 현재 장면을 저장한다. `처음 시점`은 카메라와 위상을 함께 초기화한다. 저장 직전에 다시 렌더하고 preserveDrawingBuffer를 켜 둔 것은 이 작은 예제의 PNG 추출을 단순하게 하기 위한 선택이다. 대형 실시간 작품의 최적화 설정으로 그대로 일반화하지 않는다.

실제 브라우저에서는 Three.js revision 187, 인스턴스 400개, 렌더 호출 2회, 삼각형 4,802개를 관측했다. 400개 박스의 삼각형 4,800개와 바닥의 삼각형 2개가 합쳐진 값이다. 인스턴스 행렬로 다시 계산한 밑면 높이의 최대 오차는 0이었다. 위상 조절·카메라 회전·초기화와 PNG 다운로드도 확인했다. 같은 브라우저에서 초기화와 새로고침으로 얻은 초기 PNG가 최초 저장 이미지와 같은지도 대조했다. 이는 해당 실행 환경에서의 확인이며, 모든 GPU에서 픽셀 단위로 같은 결과를 보장한다는 뜻은 아니다.

## 무엇을 바꾸면 작품의 인상이 달라질까

처음에는 하나의 변수만 바꿔 같은 시점에서 저장해 본다. 결과가 달라진 이유를 설명할 수 있을 때 변수를 더 늘리는 편이 좋다.

| 바꿀 요소 | 눈여겨볼 변화 | 함께 확인할 것 |
| --- | --- | --- |
| 높이 식의 0.9 | 동심원 능선 사이의 간격 | 너무 촘촘하면 격자가 파동을 충분히 표현하지 못한다 |
| 높이 폭 1.2 | 골짜기의 깊이와 앞뒤 가림 | 평균 높이보다 크게 만들면 음수 높이가 생길 수 있다 |
| 박스 폭 0.55 | 개별 기둥과 연속 표면 사이의 인상 | 격자 간격 0.8보다 커지면 이웃 기둥이 겹친다 |
| 낮은 색과 높은 색 | 높이를 읽는 명확함과 정서 | 같은 밝기의 두 색은 형태 구별을 약하게 만들 수 있다 |
| 카메라 높이 | 패턴을 내려다보는 느낌과 공간 안을 보는 느낌 | 낮은 시점에서는 뒤쪽 구조가 더 많이 가려진다 |

이 표의 변형은 후속 실험 제안이며, 위에서 검증한 기본 장면과 구분해야 한다. 특히 높이 범위를 바꾸면 색 보간식의 0.3과 2.4도 새 최솟값과 높이 폭에 맞춰 조절해야 한다. 한 숫자의 변화가 다른 규칙에 미치는 영향을 AI에게 함께 점검하게 할 수 있다.

기둥을 정사각 격자에 세운 것은 시작점이다. 입체 작품에서는 규칙뿐 아니라 관객이 어디에서 보고 무엇을 가려 보는지도 재료가 된다. 같은 파동을 높은 시점과 낮은 시점에서 저장해 나란히 놓아 보면, 수식은 그대로인데도 전혀 다른 장면을 만들 수 있다는 것을 확인할 수 있다.
