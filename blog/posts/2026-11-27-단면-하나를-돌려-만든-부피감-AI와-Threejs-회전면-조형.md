---
type: article
track: media-art
mediaArtCategory: 기술·제작
title: "단면 하나를 돌려 만든 부피감, AI와 Three.js 회전면 조형"
description: "Three.js LatheGeometry로 단면을 회전시켜 열린 조형을 만든다. AI 제작 명세와 실행 코드, 부풀기 조절, 조명과 양면 재질, PNG 저장을 연결하고 화면의 부피감과 실제 두께를 구분한다."
aliases:
  - "Turning a Profile into Form with AI and Threejs"
author: 육대근
date created: 2026-11-27
date modified: 2026-11-27
tags:
  - article
  - media-art
  - generative-art
  - creative-coding
  - threejs
  - AI
thumbnail: images/lathe-profile-cover.png
status: completed
akmLayer: output
akmType: output
akmRole: deliverable
trustLevel: reviewed
sourceType: synthesis
---

# 단면 하나를 돌려 만든 부피감, AI와 Three.js 회전면 조형

![열린 입구와 부푼 몸체를 가진 회전 조형의 AI 생성 개념 표지](images/lathe-profile-cover.png)

입체를 만들기 위해 모든 방향의 점을 하나씩 설계할 필요는 없다. 옆에서 본 윤곽 하나를 세우고 수직축 주위로 돌리면, 선은 빛을 받는 면이 된다. 가운데를 조금 부풀리는 것만으로 가느다란 관이 몸통을 얻고, 카메라가 위로 올라가면 둥근 입구가 드러난다. 이번에 만들 것은 이런 변화 자체를 관찰할 수 있는 작은 회전 조형이다.

위 이미지는 AI로 생성한 **개념 표지**다. 아래 코드의 정확한 출력이나 실제 도자기를 촬영한 사진이 아니다. 표지의 입구 두께와 질감, 바닥 형태를 코드가 재현한다고 가정하면 안 된다. 예제는 위아래가 열린, 두께 없는 표면 한 장을 만든다. 불투명한 면에 빛이 맺혀 생기는 부피감과 실제로 속이 채워진 부피는 다르다.

![Three.js 예제에서 직접 저장한 갈색 회전면 조형의 실제 화면](images/lathe-profile-frame.png)

이 프레임은 아래 예제를 실행해 저장했다. AI는 형상을 대신 결정하는 마법 버튼보다, 선택한 윤곽을 코드로 옮기고 검증 조건을 정리하는 보조자로 쓰는 편이 유용하다. 생성형 AI의 이미지와 규칙으로 형상을 만드는 제너러티브 아트는 이 작업에서 서로 다른 역할을 맡는다.

## 선의 어느 부분을 부풀릴 것인가

Three.js의 [LatheGeometry](https://threejs.org/docs/#LatheGeometry)는 입력한 단면 점들을 Y축 주위로 회전시켜 축대칭 면을 만든다. 단면의 x값은 축에서 떨어진 거리, y값은 높이로 해석하면 된다. 공식 문서는 입력 x값이 양수여야 한다고 설명한다. 이번에는 모든 반지름을 양수로 유지하고 단면의 양 끝을 축에 붙이지 않는다.

높이를 나타내는 t를 0부터 1까지 움직이며 반지름을 `0.65 + bulge × sin(πt)`, 높이를 `−2 + 4t`로 정한다. 기본 부풀기 값은 0.8이다. 맨 아래와 위의 반지름은 0.65이고, 가운데는 1.45가 된다. 높이는 전체 4다. 사인 함수의 반 주기를 쓰므로 가운데가 가장 넓고 위아래는 같은 폭으로 좁아진다. 부풀기를 0으로 낮추면 반지름이 일정한 관으로 돌아간다.

여기서 조형적 선택은 “그럴듯한 항아리”라는 이름보다 구체적이다. 입구의 폭은 고정하고 배만 넓힐 것인지, 높이까지 함께 늘릴 것인지에 따라 형태가 달라진다. 이번에는 높이와 입구를 유지해 부풀기의 효과만 비교한다. 이렇게 변수를 분리하면 AI에 수정을 요청할 때도 무엇을 보존해야 하는지 분명해진다. 다음은 특정 모델의 실제 응답을 인용한 것이 아니라, 제작에 사용할 수 있는 요청 예시다.

```text
Three.js로 위아래가 열린 축대칭 조형을 만들어 주세요.
단면은 33개 점, 높이는 -2부터 2, 반지름은 0.65 + bulge*sin(PI*t)입니다.
bulge는 0부터 1.2이고 기본값은 0.8입니다.
LatheGeometry의 둘레 분할은 64로 고정하고 Y축으로 한 바퀴 회전합니다.
슬라이더는 단면만 바꾸고, 이전 geometry는 dispose하세요.
양면 재질은 면의 뒷면을 보이게 하는 용도이며 벽 두께를 만들지 않습니다.
OrbitControls, 처음 시점 복원, 960×540 PNG 저장을 넣어 주세요.
임의의 바닥, 뚜껑, 텍스처, 그림자, 자동 회전은 추가하지 마세요.
```

## 단면과 조명까지 한 번에 실행하기

WebGL을 사용할 수 있는 브라우저와 Python 3, CDN 파일을 받을 인터넷 연결이 필요하다. 빈 폴더에 아래 세 파일을 같은 이름으로 저장한다. Three.js 본체와 addons는 모두 0.187.0으로 고정했다. 직접 실행한 환경에서는 revision 187을 확인했다. 여기서 버전 고정은 예제 조건을 맞추는 것이며 모든 브라우저나 GPU에서 같은 픽셀을 보장하지 않는다.

먼저 `index.html`이다. 화면의 부풀기 슬라이더는 0부터 120까지 움직이고, 코드가 이를 100으로 나눠 0부터 1.2로 바꾼다.

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Three.js 회전면 조형</title>
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
<label>배의 부풀기 <input id="bulge" type="range" min="0" max="120" value="80" step="1"></label>
<button id="reset">처음 시점</button><button id="save">PNG 저장</button>
</div>
<p>드래그로 둘러보고 휠로 확대합니다. 단면을 바꾸며 실루엣을 관찰합니다.</p>
<p id="stats" aria-live="polite"></p>
</main><script type="module" src="app.mjs"></script></body>
</html>
```

`profile.mjs`는 렌더러와 분리한 단면 생성 함수다. 단면 점 수와 부풀기 값이 범위를 벗어나면 오류를 내므로 잘못된 값이 조용히 형상에 섞이지 않는다. n은 끝점을 포함한 표본 수다. 기본 33개 점 사이에는 세로 방향으로 32개 구간이 생긴다.

```javascript
export function makeProfile(n = 33, bulge = 0.8) {
  if (!Number.isInteger(n) || n < 2 || n > 256)
    throw new RangeError('n must be an integer from 2 to 256');
  if (!Number.isFinite(bulge) || bulge < 0 || bulge > 1.2)
    throw new RangeError('bulge must be from 0 to 1.2');
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return [0.65 + bulge * Math.sin(Math.PI * t), -2 + 4 * t];
  });
}
```

마지막 `app.mjs`는 단면을 실제 면으로 바꾸고 조명을 연결한다. [MeshStandardMaterial](https://threejs.org/docs/#MeshStandardMaterial)의 거칠기와 금속성은 표면이 빛에 반응하는 방식을 조절한다. 이 예제는 거칠기 0.4, 금속성 0.1과 두 조명만 사용한다. 환경 맵이나 그림자는 사용하지 않으므로 사실적인 도자기 재질을 완성했다고 보기는 어렵다. 밝은 부분과 어두운 부분의 이동으로 곡률을 읽기 위한 간단한 설정이다.

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeProfile } from './profile.mjs';

const slider = document.querySelector('#bulge');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#101a24');
const camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 100);
camera.position.set(5, 3, 7);
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(960, 540);
document.querySelector('#view').appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = false;
controls.minDistance = 5;
controls.maxDistance = 16;
controls.update();
controls.saveState();
scene.add(new THREE.HemisphereLight('#d6eaff', '#28333f', 2));
const key = new THREE.DirectionalLight('#ffe0c2', 3);
key.position.set(4, 5, 3);
scene.add(key);
const material = new THREE.MeshStandardMaterial({
  color: '#c77d55', roughness: 0.4, metalness: 0.1, side: THREE.DoubleSide
});
function geometryFor(bulge) {
  return new THREE.LatheGeometry(
    makeProfile(33, bulge).map(([x, y]) => new THREE.Vector2(x, y)), 64
  );
}
const sculpture = new THREE.Mesh(geometryFor(0.8), material);
scene.add(sculpture);
function render() {
  renderer.render(scene, camera);
  document.querySelector('#stats').textContent =
    `부풀기 ${(Number(slider.value) / 100).toFixed(2)} · 삼각형 ${renderer.info.render.triangles}`;
}
function rebuild() {
  const old = sculpture.geometry;
  sculpture.geometry = geometryFor(Number(slider.value) / 100);
  old.dispose();
  render();
}
slider.addEventListener('input', rebuild);
controls.addEventListener('change', render);
document.querySelector('#reset').addEventListener('click', () => {
  slider.value = '80';
  controls.reset();
  rebuild();
});
document.querySelector('#save').addEventListener('click', () => {
  render();
  const a = document.createElement('a');
  a.download = 'lathe-profile.png';
  a.href = renderer.domElement.toDataURL('image/png');
  a.click();
});
render();
window.artwork = { THREE, renderer, sculpture, material, camera, controls };
```

세 파일이 있는 폴더에서 다음 명령을 실행하고 브라우저에서 `http://localhost:8000/`을 연다. 파일을 더블클릭해 여는 대신 로컬 서버를 쓰는 이유는 모듈을 HTTP로 불러오기 위해서다.

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

슬라이더를 움직이면 같은 높이에서 배가 좁아지거나 넓어진다. 캔버스를 드래그하면 카메라가 돌아가고, 휠로 거리를 바꾼다. `처음 시점`은 카메라와 부풀기를 함께 초기화한다. `PNG 저장`은 현재 시점의 이미지를 960×540으로 내려받는다. 페이지가 좁아져 캔버스가 CSS로 작게 표시되더라도 저장 픽셀 수는 유지된다. PNG에는 페이지의 슬라이더나 설명 문구가 포함되지 않는다.

## 양면으로 보이는 것과 두께가 있는 것

`DoubleSide`를 켜면 면의 앞과 뒤를 모두 그린다. [Material 문서](https://threejs.org/docs/#Material)의 side 설정이 결정하는 것은 어느 면을 렌더링할지다. 입구 안쪽이 보인다고 해서 안쪽 벽을 별도로 생성한 것은 아니다. 이 예제에는 벽 두께, 바닥판, 입구를 연결하는 테두리가 없다. 둘레를 한 바퀴 잇는 것과 위아래 구멍까지 닫는 것도 서로 다른 일이다. 3D 프린트용 그릇이나 물이 담기는 용기의 모델로 곧바로 사용할 수 없다.

기본 단면 33개와 둘레 64분할은 2,145개의 저장 정점과 4,096개의 삼각형을 만든다. 둘레의 시작과 끝에 같은 위치를 갖는 정점 열이 있으므로 저장 정점 수를 모두 서로 다른 공간 위치의 수로 읽으면 안 된다. 예제 브라우저에서도 이 수와 렌더 호출 1회를 확인했다. 이것은 이번 장면의 관찰값이며 복잡한 전시 장면의 속도나 장치별 성능을 예측하는 수치는 아니다.

단면 생성 함수의 테스트 6개로 끝점·가운데 반지름, 일정한 높이 간격, 위아래 대칭, 값 범위와 잘못된 입력을 확인했다. 실제 화면에서는 부풀기를 0.8에서 0.6으로 바꿨을 때 최대 반지름이 약 1.45에서 1.25로 줄고 높이는 유지됐다. 카메라 드래그, 초기화, PNG 저장도 확인했다. 형상을 교체한 뒤 렌더러가 보고하는 geometry 수는 1로 유지됐다. 다만 이 짧은 조작 검사가 장시간 메모리 누수 검증을 대신하지는 않는다.

슬라이더가 움직일 때는 기존 geometry의 파라미터 숫자만 바꾸지 않고 새 geometry를 만든다. 생성 이후 `.parameters`를 바꾸는 것만으로 면이 다시 만들어지지는 않는다는 점은 LatheGeometry 문서에도 명시되어 있다. 이전 geometry는 `dispose()`로 GPU 자원을 해제하도록 요청한다. 점이 많거나 움직임이 매우 잦은 작업에는 다른 갱신 방식이 더 적합할 수 있지만, 이 작은 예제에서는 구조를 명확히 읽는 데 도움이 된다.

## 형태보다 먼저 바꿀 기준

가장 먼저 바꿔 볼 것은 분할 수보다 단면의 규칙이다. 가운데를 크게 부풀리는 것과 입구 가까이에 작은 어깨를 만드는 것은 서로 다른 실루엣을 낳는다. 다만 반지름이 음수가 되지 않는지, 점 순서가 높이에 따라 유지되는지부터 확인해야 한다. 기본 예제 이외의 단면 함수는 여기서 실행한 결과가 아니므로 각자 만든 변형으로 검증해야 한다.

둘레 분할을 줄이면 회전 방향의 윤곽이 각져 보이고, 단면 표본을 줄이면 세로 곡선도 거친 구간으로 바뀐다. 둘은 같은 해상도 손잡이가 아니다. 매끈한 하이라이트를 원한다면 형상의 분할과 재질을 함께 살펴야 하고, 면의 각을 드러내려면 낮은 분할 자체가 표현 수단이 될 수 있다. 먼저 같은 카메라·조명에서 비교해야 원인을 구분하기 쉽다.

AI에 “더 아름답게”라고 요구하기 전에, 고정할 것과 움직일 것을 말로 나눠 보자. 입구와 높이는 유지하면서 가운데 반지름만 줄이는 요청은 결과를 판단할 수 있다. 이 예제에서 중요한 것은 항아리처럼 보이는 이미지 한 장보다, 선의 변화가 면과 빛의 변화로 이어지는 과정을 스스로 조절할 수 있다는 점이다.
