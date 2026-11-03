# 출처와 라이선스

- 캐릭터: 김수린 제출 `projector-tree-textured-checkpoint.blend`의 Character_Clean 장면. 외형과 텍스처를 보존하고 런타임 스킨 가중치를 보정한 파생 GLB입니다. 학생 작품의 저작권은 원저작자에게 있습니다.
- DEXA CRT 추적 측정기: `body-tracking.js`, `face-features.js`. MIT, `lib/DEXA-CRT-LICENSE` 참조.
- Three.js: 기존 DEXA CRT의 고정 로컬 배포본. MIT, `lib/vendor/three/LICENSE` 참조.
- MediaPipe Face Mesh 0.4.1633559619 및 Pose 0.5.1675469404: Google LLC, Apache 2.0. 각 vendor 폴더의 NOTICE와 LICENSE 참조. 이 앱의 locateFile은 로컬 경로만 반환하며, FaceMesh는 포함된 SIMD 런타임을 요구합니다. 기존 FaceMesh NOTICE에 적힌 CDN fallback은 이 앱에서 사용하지 않습니다.
- `tests/fixtures/pose.jpg`: 기존 DEXA CRT 검증용 fixture의 복사본. 테스트에만 사용하며 관객 화면에는 표시하지 않습니다.

- `tests/fixtures/face.png`: NASA Eileen Collins 공개 영역 사진에서 유래한 DEXA CRT 테스트 프레임. 출처는 `tests/fixtures/README.md` 참조.
- MediaPipe Tasks Vision 1.2.0 / Hand Landmarker: Google LLC, Apache 2.0. 기존 소리지음 `artworks/public/vision` 및 `models`에서 고정 로컬 배포본을 복사했습니다. `lib/vendor/hand/NOTICE.md`, `LICENSE`, `provenance.json` 참조. 두 손을 별도 CPU worker에서 추론합니다.
- `tests/fixtures/hands.jpg`: Google MediaPipe 공식 Hand Landmarker 예제 이미지. `tests/fixtures/README.md`에 원 URL을 기록했습니다. 테스트 전용입니다.
- 최적화 파생 GLB: 원본과 동일한 텍스처·15개 뼈대를 유지하고 메쉬를 줄였으며 손목 위치와 가중치를 보정했습니다. 뿌리·가지 손 변형과 렌즈 셔터는 앱에서 구성합니다.
