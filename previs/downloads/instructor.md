# 3D 프리비즈를 이용한 AI 영상 제작 — 공개 사례 수업

개정: 2026-10-29. 웹 교안: https://dexa.art/previs/

## 강사용 진행 원고

영상 입문자·3D 초보자 대상, 120분을 가정한 편집 가능한 안입니다.

## 설명·시연 본문

01 / WHY PREVIS

예쁜 한 장보다 먼저,\
무슨 일이 일어나는지 정합니다.
------------------------------

프리비즈(previsualization)는 촬영 전에 만드는 장면의 시각적 초안입니다. AI에게 줄 공간·카메라·행동 정보를 영상으로 구체화합니다.

배울 것 01

### 장면을 사건으로 나누기

시나리오를 숏, 행동, 카메라, 접촉 시점으로 바꾸고 자연어 지시를 검수 가능한 변경으로 만듭니다.

배울 것 02

### 입력의 역할 나누기

프리비즈 영상에는 구도와 동작을, 캐릭터·소품 이미지에는 외형과 정체성을 맡깁니다.

배울 것 03

### 틀린 결과를 고치기

사진처럼 보이는지와 연출을 지키는지를 따로 평가하고, 영향받는 단계만 다시 만듭니다.

01 / DIRECTION**숏 설계**행동 · 카메라 · 접촉

02 / MOTION**3D → MP4**배치 · 동작 · 타이밍

03 / APPEARANCE**외형 참조**인물 · 소품 · 환경

04 / GENERATION**영상 + 참조**지원하는 모드에 결합

05 / REVIEW**같은 시간 비교**지킨 것 · 틀린 것 기록

### 큐브만으로 충분한 것

방의 크기, 탁자 위치, 인물 간 거리, 카메라 이동은 단순한 상자와 대역으로도 전달할 수 있습니다. 재질보다 **카메라 → 배치 → 스케일 → 동작 타이밍**을 먼저 정합니다.

### 형상을 더 남겨야 하는 것

손이 어느 면을 잡는지, 소품의 앞뒤, 손잡이와 노즐, 발의 지지면은 식별 가능해야 합니다. 실루엣·관절·접점이 사라지면 AI가 관계를 추측합니다. 접촉부만 자세히 만들 수도 있습니다.

상세 모델링은 필수 선행조건이 아닙니다. 반대로 모든 큐브가 충분한 것도 아닙니다. AI에 넘기기 전에 숨은 손, 관통, 떠 있는 소품, 잘못된 투명도와 가림 순서를 프리비즈 자체에서 먼저 확인하세요.

02 / PUBLIC CASE STUDIES

영상에 레퍼런스를 입히는\
실제 공개 과정
-------------------------

Autodesk 공식 시연과 Michael James Owusu의 제작 기록을 사용합니다. 각 자료의 입력·생성 이미지·영상 결과가 어느 단계인지 표시했습니다.

### A. 눈길 로봇 — Autodesk Flow Studio

대역 캐릭터로 연기를 배치하고 3D 카메라를 연출합니다. 렌더한 영상을 Canvas에 보내 환경 이미지와 로봇 앞·뒤 참조를 연결한 뒤, 최종 영상을 생성합니다. 이 사례의 3D 도구는 Flow Studio이며, 수업에서는 같은 역할 분리를 Three.js 작업에 적용합니다.

<img src="https://blogs.autodesk.com/media-and-entertainment/wp-content/uploads/sites/162/Image-3-1024x575.jpeg" loading="lazy" width="1024" height="575" alt="공식 Canvas 화면. 왼쪽 눈길 참조 사진에서 오른쪽 회색 와이어프레임 블록아웃 이미지가 생성됩니다." />

<strong>① 생성 이미지</strong>환경 참조 → 블록아웃 이미지.<br />
이 이미지를 바탕으로 3D 환경을 만듭니다.

<img src="https://blogs.autodesk.com/media-and-entertainment/wp-content/uploads/sites/162/Image-8-4-1024x576.jpg" loading="lazy" width="1024" height="576" alt="단순화한 눈길 3D 환경에 대역 인물과 카메라, 타임라인이 놓인 공식 편집기 화면" />

<strong>② 프리비즈 영상 만들기</strong>대역의 연기·위치·크기와 카메라 키프레임을 정한 뒤 영상으로 렌더합니다.

<img src="https://blogs.autodesk.com/media-and-entertainment/wp-content/uploads/sites/162/Image-8-7-1024x576.jpg" loading="lazy" width="1024" height="576" alt="프리비즈 영상과 로봇 앞뒤 이미지, 환경 참조 이미지가 영상 생성 노드로 연결된 공식 Canvas 화면" />

<strong>③ 영상 + 외형 참조</strong>영상은 구도·동작, 환경 사진과 로봇 이미지는 외형. 최종 결과는 아래 13:48부터 봅니다.

이미지: Autodesk 공식 튜토리얼 화면, 원본 서버 연결. <a href="https://blogs.autodesk.com/media-and-entertainment/2026/10/06/getting-started-with-3d-editor-canvas-in-autodesk-flow-studio-how-to-build-your-first-scene/" target="_blank" rel="noopener">2026-10-06 게시 글 ↗</a>

이 사례에서 확인되는 이미지의 순서는 **환경 참조 → 생성 블록아웃 이미지 → 3D**입니다. “프리비즈에서 실사 시작 이미지를 만든 사례”로 바꾸어 설명하지 않습니다. 아래 실습의 f0 이미지 제작은 별도의 확장 경로입니다.

공식 영상: [Autodesk 시연](https://www.youtube.com/watch?v=5oEblqjwQYs). 웹 교안에서 구간 이동 가능.

공식 영상의 장·자막을 대조한 시연 구간입니다. <a href="https://www.youtube.com/watch?v=5oEblqjwQYs&amp;t=591s" target="_blank" rel="noopener">YouTube에서 직접 열기 ↗</a>

| 연결한 입력 | 맡기는 역할 | 검수할 충돌 |
|----|----|----|
| `@video1` 3D 렌더 영상 | 카메라, 화면 배치, 연기·타이밍 | 사진 레퍼런스의 카메라로 바뀌지 않았는가? |
| `@image1` 환경 이미지 | 눈길·건물·분위기의 외형 | 환경을 바꾸면서 인물 위치까지 움직이지 않았는가? |
| `@image2 / @image3` 로봇 앞·뒤 | 캐릭터 디자인·정체성 | 서 있는 참조 자세가 원래 연기를 덮지 않았는가? |


공식 시연 모드: Seedance 2.5 Reference. 표는 해당 시연의 참조 순서입니다. 일반 외형 참조이며, 이미지가 시간 0에 고정되는 키프레임 계약과 다릅니다. 선별된 시연 하나가 반복 성공률을 증명하지는 않습니다.

### B. PIP — 단순화한 3D를 제품 영상으로

<img src="https://michaelowusu.com/media/img/pip-model-press-a-960.webp" class="reference-photo" loading="lazy" width="960" height="1192" alt="PIP 캠페인 생성 스틸. 땋은 머리와 주황색 상의를 한 인물이 PRESS 병을 얼굴 옆에 들고 있습니다." />

<strong>같은 캠페인의 생성 스틸</strong> — 외형과 소품을 관찰할 자료.<br />
<a href="https://michaelowusu.com/campaigns/pip/" target="_blank" rel="noopener">Michael James Owusu, PIP 캠페인 ↗</a><br />
제작자는 캠페인 스틸을 영상으로 이어 썼다고 설명합니다. 이 이미지가 특정 테이크에 제출된 정확한 입력 파일인지는 공개 기록만으로 확정하지 않습니다.

CREATOR BREAKDOWN / 2026.09

### 두 숏, 여덟 초, 한 번의 전환

PRESS 병을 렌즈 쪽으로 밀고, 다음 숏에서 WASH 튜브를 뒤로 뺍니다. 제작자는 Blender 프리비즈를 두 숏의 직접 모션 입력으로 사용했다고 기록했습니다.

완성본은 720×1280, 24fps, 무음입니다. **프리비즈가 움직임을, 승인 스틸이 외형을 맡는** 제작 구조를 공개했습니다.

시도 기록도 남아 있습니다. Kling 3 Pro Motion Control은 이 프리비즈에서 온전한 상반신을 검출하지 못해 거절됐고, Wan 3.0 Prime Reference로 시험·선택을 이어 갔습니다. WASH는 여러 테이크 중 하나를 골랐습니다.

<a href="#compare" class="btn primary">실제 동기 비교 보기 ↓</a>

<a href="https://michaelowusu.com/films/pip/" target="_blank" rel="noopener">제작·테이크 기록</a> · <a href="https://michaelowusu.com/systems/commercial-production-pipeline/" target="_blank" rel="noopener">제작 파이프라인</a>\
제작자의 자발적 콘셉트 작품입니다. 특정 입력의 실패를 모델 전체의 성능 순위로 해석하지 않습니다.

03 / DIRECT WITH LANGUAGE

“더 자연스럽게”를\
바꿀 수 있는 명세로
-------------------

기본 실습은 공개 사례 관찰과 설계·검수 기록입니다. Three.js 편집 실습은 LLM이 파일을 수정하고 렌더할 수 있는 준비된 환경에서 확장합니다.

### 시나리오를 숏·행동·카메라·접촉으로 분해합니다.

PIP를 한 번 본 뒤 “제품을 보여 준다”를 더 작은 사건으로 풀어 쓰세요. **어느 손이 어느 면을 잡고, 언제 움직이고, 언제 가려지는지**가 필요합니다. 가려진 접촉은 확인됐다고 적지 않습니다.

| 숏 | 행동과 컷 연결 | 3D에 남길 정보 | 관찰 과제 |
|----|----|----|----|
| PRESS · 0–4초 | 얼굴 옆 제품 → 렌즈 쪽으로 이동 | 병의 축·뚜껑, 잡는 손, 얼굴과 제품의 거리 | 얼굴 크기가 바뀌는가? 제품이 커지는 이유가 전진인가, 카메라 이동인가? |
| WASH · 4–8초 | 전환을 이어받아 제품을 뒤로 빼기 | 튜브 앞면, 손의 접점, 시작과 종료 화면 점유율 | 컷 전후 이동 방향과 제품 크기가 전환 의도를 잇는가? |

**산출물:** 숏 설계표 2행 + 관측한 사건 3개. **통과 기준:** 직접 본 시점과 추정한 카메라 원인을 구분했습니다.

### LLM에게 장면 편집을 맡기고 변경·유지를 분리합니다.

아래는 PIP에서 배운 연출 원리를 자신의 권한 있는 제품 장면에 적용하는 **수업용 지시**입니다. 원 제작자가 사용한 프롬프트가 아닙니다. Three.js 장면 파일을 다룰 수 있는 LLM에게 전달하고, 실행된 파일·프레임으로 답을 확인하세요.

초기 장면 지시 · Three.js

```
현재 Three.js 작업 환경에서 제품을 보여 주는 6초 숏 S01을 구성해 주세요.
24fps, 1280×720, f0–f143입니다. 인물 1명과 병 1개를 단순 형상으로 배치합니다.
얼굴과 제품이 함께 보이는 고정 카메라를 사용합니다.
병의 앞면과 뚜껑, 잡는 손의 접점이 식별 가능해야 합니다.
f0–23: 얼굴 옆에 병을 들고 대기.
f24–71: 손과 병이 함께 렌즈 쪽으로 이동.
f72–95: 멈춤. f96–131: 원래 위치로 복귀. f132–143: 정지.
병을 복제하거나 손에서 미끄러뜨리지 마세요.
먼저 숏·카메라·사건 프레임과 지원하지 않는 제약을 설명한 뒤 장면에 적용하세요.
적용한 파일과 f0, f24, f72, f96, f143 비교 화면을 보여 주세요.
```

수정 지시 · 바꿀 것 / 유지할 것

```
변경: 전진 시작과 도착을 12프레임 늦춰 주세요(24→36, 72→84).
복귀 시작·완료와 전체 길이는 유지하여 도착 후 정지만 24→12프레임으로 줄입니다.
유지: f0 포즈, 카메라 위치·방향·화각, 인물·제품 수와 크기,
손-병 접점, 이동 경로, 복귀 시작 f96, 복귀 완료 f132, 마지막 f143.
확인: 수정 전후 f0, f24, f36, f72, f84, f96을 같은 카메라로 비교하세요.
자연어 답변만 하지 말고 실제 포즈·키프레임 변경과 미적용 항목을 보고하세요.
```

기존 장면을 먼저 저장하고 수정 전·후를 같은 프레임에서 비교하세요. f0는 같아야 하고, f24는 수정 후 아직 대기 중이어야 합니다. LLM의 “완료” 문장과 실제 장면은 별개입니다.

**산출물:** 변경·유지 목록과 전후 프레임 기록. **환경이 없으면:** 명세를 작성하고 적용 상태를 ‘미실시’로 남깁니다. 이 웹 교안은 3D 편집기가 아닙니다.

### 고정 FPS MP4를 출력하고 그 파일에서 프레임을 뽑습니다.

각 프레임의 시간을 `t = n / 24`로 평가해 렌더합니다. 6초라면 f0–f143, 총 144프레임입니다. Three.js에서는 같은 시간에 동작·카메라·물체 변환을 모두 평가하도록 LLM에 요청하세요. 실시간 미리보기의 `requestAnimationFrame` 실행 횟수를 출력 프레임 수로 세지 않습니다.

LLM 출력 지시와 FFmpeg 명령 보기

“기존 출력 기능으로 f0–f143을 결정적인 시간에 평가해 PNG 시퀀스로 저장하세요. 프레임 누락·중복과 카메라를 확인한 뒤 아래 명령으로 MP4를 만들고, 실제 MP4에서 f0와 사건 프레임을 추출하세요.” 파일명은 자신의 출력에 맞춥니다. FFmpeg 설치가 필요합니다.

``` code
# PNG 시퀀스가 이미 있는 경우. 기존 파일을 덮어쓰지 않도록 -n 사용.
ffmpeg -n -framerate 24 -start_number 0 -i frames/frame-%04d.png -frames:v 144 -c:v libx264 -pix_fmt yuv420p -movflags +faststart previs.mp4

# 실제 인코딩 결과 확인
ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=width,height,avg_frame_rate,r_frame_rate,nb_read_frames,duration -of json previs.mp4

# 실제 첫 프레임과 중간 기준 프레임을 구분해 추출
ffmpeg -n -i previs.mp4 -vf "select=eq(n\,0)" -frames:v 1 start-f0000.png
ffmpeg -n -i previs.mp4 -vf "select=eq(n\,72)" -frames:v 1 anchor-f0072.png
```

24fps에서 f72는 3초입니다. **f72로 만든 이미지는 시작 이미지가 아닙니다.** 타임라인 화면의 PNG와 MP4에서 추출한 PNG가 같다고 가정하지 마세요. 이미 FPS가 다른 영상을 단순히 24로 표시하는 것도 고정 시간 렌더를 대신하지 못합니다.

**산출물:** MP4, FPS·프레임 수, f0와 중간 프레임, 역할표. **통과 기준:** 실제 인코딩 파일을 검사했고 시간 기준이 분명합니다.

### 이미지에는 무엇을 가져올지, 무엇을 유지할지 적습니다.

영상+일반 참조 모드라면 인물·제품·환경 이미지를 역할별로 연결합니다. 시간 지정 키프레임 모드라면 실제 f0에서 외형 이미지를 만든 뒤 **구도·정체성·접촉을 검수해 시작 이미지로 승인**합니다. 이미지를 먼저 승인했다고 이후 영상까지 승인되는 것은 아닙니다.

확장 실습 · f0 → 외형 이미지

```
A는 실제 프리비즈 MP4의 f0입니다. A의 카메라, 인물·병의 위치와 화면 크기,
병의 방향, 잡는 손과 접촉 면, 인물 1명·병 1개를 유지하세요.
B에서는 얼굴·머리·의상의 정체성만 가져옵니다. B의 자세·배경은 가져오지 않습니다.
C에서는 제품의 형상·재질·라벨만 가져옵니다. C의 촬영 각도·크기는 따라가지 않습니다.
A의 단순 형상을 최종 외형으로 바꾸되 새 손·소품·가구를 추가하지 마세요.
같은 카메라에서 촬영한 장면으로 만드세요.
```

A/B/C는 설명용 이름입니다. 실제 서비스가 받는 슬롯 수와 표기법으로 바꾸세요. 참조를 많이 넣으면 다른 카메라·자세가 혼입될 수 있습니다. 최소 참조나 크롭은 혼입을 줄이는 방법이지만, 스케일·접촉·뒷면 정보까지 없애면 또 다른 오류가 생깁니다.

**산출물:** 참조마다 역할·허용 변화·유지 조건 1행. **통과 기준:** 일반 외형 참조와 시간 0 이미지가 구분됩니다.

04 / VIDEO + REFERENCES

영상 입력을 받는 모드인지\
먼저 확인합니다.
--------------------------

“이미지로 영상 만들기”와 “프리비즈 영상을 변환하기”는 다른 작업입니다. 모델 이름뿐 아니라 서비스·모드·실제 슬롯을 함께 기록하세요.

### I2V

시작 이미지 + 글 → 이후 움직임 생성. MP4 입력이 없으면 프리비즈의 전체 동작을 전달한 것이 아닙니다.

### 영상 + 외형 참조

프리비즈 MP4 + 인물·소품 이미지. 영상에서 움직임을, 이미지에서 외형을 가져오도록 지시합니다. 일반 참조가 첫 프레임 고정을 뜻하지는 않습니다.

### 영상 + 시간 지정 이미지

MP4 + 특정 시점의 승인 이미지. 실제 f0에 대응하는 이미지를 0초에 지정할 수 있는 계약을 확인합니다.

| 공식 확인 경로 2026-10-29 | 받는 입력·실행 순서 | 수업에서의 적용 |
|----|----|----|
| <a href="https://blogs.autodesk.com/media-and-entertainment/2026/10/06/getting-started-with-3d-editor-canvas-in-autodesk-flow-studio-how-to-build-your-first-scene/" target="_blank" rel="noopener">Flow Studio Canvas</a> Seedance 2.5 Reference | 3D Editor에서 카메라·해상도·FPS 선택 → Send to Canvas → 렌더 영상과 환경·캐릭터 이미지 연결 → 역할별 지시 → 생성 | 공개 시연으로 확인한 영상+일반 참조 흐름. 카메라 애니메이션 범위가 출력 길이를 정하므로 앞뒤 누락을 확인합니다. |
| <a href="https://docs.dev.runwayml.com/api#tag/Start-generating/paths/~1v1~1video_to_video/post" target="_blank" rel="noopener">Runway Aleph 2 API</a> `video_to_video` | `videoUri` + `keyframes` 1–5개. 각 이미지에 `seconds` 또는 `at`. 영상 최대 30초. | **외부 승인 이미지와 영상의 동시 입력**을 문서로 확인한 경로. `seconds: 0`으로 시작 지정. `at`은 0–1 비율이므로 초와 구분합니다. |
| <a href="https://help.runwayml.com/hc/en-us/articles/51683104370451-Creating-with-Edit-Studio" target="_blank" rel="noopener">Runway 웹 Edit Studio</a> Aleph 2.0 | 영상 업로드 → Single edit → 프레임 선택·이미지 수정 → 승인 버전으로 Generate video. 안내 규격 480p–1080p, 24–30fps. | 웹 내부에서 프레임을 편집하는 경로. 외부 승인 PNG를 그대로 넣는 슬롯은 이번 문서 확인에서 확정하지 않았습니다. 길이 경계 표현 차이가 있어 5–6초로 연습합니다. |


공식 문서·공개 시연의 확인과 이 수업에서 새로 실행한 생성은 다릅니다. 현재 계정의 접근 권한, 파일 형식·길이·비율, 영상/이미지 슬롯, 표시 비용을 실행 전에 확인하세요. API 지원을 같은 이름의 웹 UI 지원으로 옮겨 해석하지 않습니다.

영상 지시 · 실제 슬롯 이름에 맞게 바꾸기

```
V는 동작과 구도의 기준 영상입니다. 카메라 경로, 피사체의 화면 크기,
제품 이동 방향·속도, 잡는 손의 접점과 사건 순서를 V에 맞추세요.
R-character는 인물 외형만, R-product는 제품 외형만 제공합니다.
참조 이미지의 자세·촬영 각도·배경으로 V를 바꾸지 마세요.
인물 1명·제품 1개를 유지하고 새 컷과 추가 카메라 움직임을 만들지 마세요.
[시간 지정 키프레임 모드에서만] 승인 이미지 K0를 실제 입력 슬롯의 0초로 지정합니다.
```

선택 실습: 실제 이미지·영상 생성 순서

1.  자신의 사용 권한이 있는 장면과 참조를 준비하고 표시 비용·시도 한도를 정합니다.
2.  프리비즈 MP4의 규격·첫 프레임·접촉을 검수합니다. f0 이미지 경로라면 이미지 후보를 만들고 승인합니다.
3.  영상과 참조를 실제 지원 슬롯에 연결합니다. 업로드 수락, 역할, 모델·모드, 프롬프트, 파일 버전·해시를 기록합니다.
4.  한 테이크를 생성하고 원본을 회수합니다. 제출 ID를 보존해 기다리는 동안 중복 제출하지 않습니다.
5.  실제 청구액은 계정 내역으로 확인합니다. 확인할 수 없으면 ‘미확인’으로 기록합니다.
6.  입력과 결과를 공통 시간으로 비교해 통과·실패·미확인을 판정하고 한 원인 후보씩 고칩니다.

공개 사례를 보는 기본 수업은 생성 크레딧을 쓰지 않습니다. 확장 실습의 생성 대기 시간과 비용은 120분 안의 완성을 보장하지 않습니다. 제3자 공개 이미지를 새 생성에 재사용할 권한은 공개 열람 가능 여부와 별도로 확인하세요.

05 / OBSERVE, COMPARE, REVISE

같은 순간을 멈춰 보면\
무엇이 달라졌는지 보입니다.
---------------------------

왼쪽 프리비즈와 오른쪽 AI 결과가 하나의 영상에 함께 들어 있습니다. 별도 플레이어 두 개를 맞출 필요 없이 같은 시간에서 비교할 수 있습니다.

[PIP 실제 동기 비교 MP4](https://michaelowusu.com/media/video/pip-previs-final.mp4)

영상: Michael James Owusu, PIP. 원본 서버에서 재생합니다.\
<a href="https://michaelowusu.com/films/pip/" target="_blank" rel="noopener">제작자 원문</a> · <a href="https://michaelowusu.com/media/video/pip-previs-final.mp4" target="_blank" rel="noopener">동기 비교 MP4</a> · <a href="https://michaelowusu.com/media/video/pip-film.mp4" target="_blank" rel="noopener">완성본 MP4</a>

먼저 직접 보기 / 5 MIN

### 세 지점만 먼저 체크하세요.

1.  **0초:** 얼굴·병의 화면 크기, 손의 위치, 시선은 같은가요?
2.  **2초와 컷 직전:** 제품의 전진 시점과 가림 정도가 같은가요? 얼굴 크기도 함께 달라지나요?
3.  **4초와 6초:** 새 제품의 방향, 뒤로 빠지는 움직임, 잡는 손이 이어지나요?

숏마다 0초부터 다시 센 시간과 전체 영상 시간을 구분하세요. 이 비교 영상에서 두 번째 숏의 시작은 전체 4초입니다.

관찰 뒤 해설 열기

공개 프레임 표에서 결과의 얼굴·손 자세는 프리비즈와 완전히 같지 않습니다. 3D에 비해 자연스러운 피부·머리카락이 생겼지만, 이것만으로 동작 정확도를 통과시킬 수 없습니다.

제작자도 빠르거나 불명확한 움직임에서 모델이 즉흥적으로 움직였고 타이밍이 최대 약 1초 어긋난 경험을 기록합니다. 이는 해당 제작자의 경험이며, 모든 결과의 고정 오차가 아닙니다.

WASH의 한 테이크에서 일부 프레임을 잘라내는 편집도 시도했으나 선택하지 않았습니다. 실패를 편집으로 감추는 것과 접촉·연속성을 고치는 것은 구분해야 합니다.

### 실사감과 지시 준수는 별도 점수

실사감 4/5라도 제품 수·접촉이 틀리면 제작 검수는 실패입니다. 보이지 않는 면은 ‘미확인’, 실행하지 않은 생성은 ‘미실시’로 남깁니다.

| 검수 항목 | 보는 방법 | 문제가 있으면 먼저 고칠 것 |
|----|----|----|
| 구도·시점 | 얼굴·제품 중심을 x/폭, y/높이로 비교. 크롭으로 억지로 맞추지 않기 | 프리비즈 카메라, 참조 사진의 카메라 혼입, 출력 비율 |
| 정체성·수·방향 | 얼굴·의상·제품 디자인, 손·제품 개수, 앞뒤·라벨 방향 | 참조 역할·필요 각도·구별 가능한 프록시 형상 |
| 접촉·지지 | 잡는 손과 소품의 상대 위치, 미끄러짐·관통·부유 | 원 프리비즈의 접점·가림. 원본이 맞으면 생성 단계 수정 |
| 시간·컷 연속성 | 접촉·정지·놓기·컷 전후를 공통 초 단위로 비교 | 키프레임·동작 속도·컷의 시작/종료 상태 |

### 바뀐 원인에 해당하는 단계만 다시 만듭니다.

#### 동작 타이밍만 변경

프리비즈 MP4 → 영상 재생성. f0와 참조가 같다면 승인 시작 이미지 재사용을 검토합니다.

#### 카메라·배치 변경

프리비즈 → f0 이미지 재검수/재생성 → 영상. 이전 시작 이미지를 그대로 쓰지 않습니다.

#### 외형 참조만 변경

공간·동작이 같다면 MP4 재사용. 외형 이미지와 영상을 다시 만들고 컷 사이 정체성을 확인합니다.

SOURCES / VERIFIED 2026.10.29

## 출처와 확인 범위

1.  <a href="https://blogs.autodesk.com/media-and-entertainment/2026/10/06/getting-started-with-3d-editor-canvas-in-autodesk-flow-studio-how-to-build-your-first-scene/" target="_blank" rel="noopener">Autodesk — How to Build Your First Scene</a>공식 글 · 2026-10-06. 블록아웃 이미지 생성, 3D 연출·출력, 영상+환경·캐릭터 참조 연결.
2.  <a href="https://www.youtube.com/watch?v=5oEblqjwQYs" target="_blank" rel="noopener">Autodesk Media &amp; Entertainment — How to Direct Cinematic Scenes with 3D Editor + Canvas</a>공식 영상 · 14분 32초. 채널 메타데이터·챕터·자막으로 시연 구간 확인.
3.  <a href="https://michaelowusu.com/films/pip/" target="_blank" rel="noopener">Michael James Owusu — PIP: PRESS &amp; WASH</a>제작자 1차 기록 · 2026-09-11 연출 변경·테이크 기록. 비교 MP4 직접 검사: 8초, 24fps, 192프레임, 1464×1280. 좌우를 합친 비교본 크기는 완성본 720×1280과 다릅니다.
4.  <a href="https://michaelowusu.com/campaigns/pip/" target="_blank" rel="noopener">PIP 캠페인</a> · <a href="https://michaelowusu.com/systems/commercial-production-pipeline/" target="_blank" rel="noopener">AI commercial production pipeline</a>생성 스틸·참조 제작과 영상 파이프라인, 실패·개선 기록. 캠페인 스틸과 특정 영상 테이크의 입력 바이트 동일성은 미확인.
5.  <a href="https://docs.dev.runwayml.com/api#tag/Start-generating/paths/~1v1~1video_to_video/post" target="_blank" rel="noopener">Runway API — Video to video / aleph2</a> · <a href="https://help.runwayml.com/hc/en-us/articles/51683104370451-Creating-with-Edit-Studio" target="_blank" rel="noopener">Creating with Edit Studio</a>공식 입력 계약과 웹 작업 순서. 이 교안 제작에서 해당 API의 유료 생성·결과 품질을 시험한 것은 아닙니다.

교육 설명·프롬프트·평가 기준은 DEXA의 수업용 구성입니다. 사례 이미지·영상의 제작 주체는 각 캡션의 원저작자이며 외부 원본을 연결합니다. 외부 자료의 지속 제공·새 생성에 대한 재사용 허락을 보장하지 않습니다. 공개 시연과 제작자 기록을 검토했으며, 단일 성공이나 선택된 결과를 반복 안정성으로 주장하지 않습니다.
