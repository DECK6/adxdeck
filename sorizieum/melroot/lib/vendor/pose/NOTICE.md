# MediaPipe Pose (vendored)

- Package: `@mediapipe/pose` version `0.5.1675469404`
- Publisher/copyright: Google LLC
- License: Apache License 2.0; see [LICENSE](LICENSE).
- Official source: https://github.com/google-ai-edge/mediapipe
- API documentation: https://chuoling.github.io/mediapipe/solutions/pose.html
- Exact npm archive: https://registry.npmjs.org/@mediapipe/pose/-/pose-0.5.1675469404.tgz
- Registry archive integrity (verified before extraction): `sha512-DFZsNWTsSphRIZppnUCuunzBiHP2FdJXR9ehc7mMi4KG+oPaOH0Em3d6kr7Py+TSyTXC1doH88KcF28k2sBxsQ==`

Unmodified runtime files plus Lite and Full landmark models are bundled locally.
Both SIMD and non-SIMD WASM runtimes are included. Lite (`modelComplexity: 0`)
is available for low-cost callers; the CRT app uses Full
(`modelComplexity: 1`). Heavy is not bundled. No remote model URL or inference
service is used. The added Full file is the unchanged pinned publisher asset:
https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_landmark_full.tflite

The pinned JavaScript API's `useCpuInference: true` option selects the graph's
`InferenceCalculator.use_cpu_inference` path. Pose runs landmark inference locally
on CPU, preserving the graphics queue for FaceMesh and avatar rendering. The
legacy solution still needs a WebGL context for image preprocessing/output.

The tracker loads these files only when `start()` is called. A hidden same-origin
iframe isolates the legacy WASM globals from FaceMesh. `feed(video)` copies an
existing shared video into an iframe-owned canvas (longest edge at most 640 px);
the iframe never opens a camera. Stop waits for in-flight work, closes Pose, and
removes the iframe. CRT requests up to30fps with internal smoothing disabled;
the source-time deadline tolerates camera timestamp jitter without queuing.
The optional fourth results argument provides capturedAt/receivedAt/inferenceMs,
sourceTime and actual source aspect. Capture time includes the canvas copy and
model processing; it is not a sensor-to-screen latency measurement.

## Coordinate contract

Pose receives unmirrored frames with `selfieMode: false`. Avatar left/right mean
screen-left/screen-right of a mirrored preview: anatomical left (11/13/15) drives
`leftArm`/`leftElbow`; anatomical right (12/14/16) drives `rightArm`/`rightElbow`.
This is an intentional mirror. Arms map down/horizontal/up to 0/0.5/1. Elbow bend
maps straight/90 degrees/135 degrees to 0/0.667/1. Positive `bodyLean` means a
clockwise shoulder line in the mirrored preview; 20 degrees maps to 1.

All required joints must be inside the image and have visibility >= 0.55. Missing
or invalid joints disable only the affected channel using the returned valid
flag. Numeric zero on an invalid channel is a placeholder, not a neutral pose.
The consuming mixer owns smoothing, camera strength, idle/voice fallback, and
animation limits.

## Browser smoke check (no physical camera required)

Serve the project over localhost. In a browser that has loaded
`lib/body-tracking.js`, create a canvas or load a same-origin human-pose fixture
and run `const t = BodyTracking.create({onResults: console.log, onState: console.log});
await t.start(); await t.feed(canvasOrImage); await t.stop();`. A blank canvas
should yield all validity flags false; a human fixture should yield 33 raw
landmarks. Repeat start/feed/stop while FaceMesh runs on a prerecorded fixture:
both models should continue returning results, no parent MediaPipe global should
change, all Pose requests should be same-origin, and no iframe should remain
after stop. No webcam permission is needed for this smoke check.

## Runtime file integrity

| File | Bytes | SHA-256 |
|---|---:|---|
| `pose.js` | 47089 | `fcb703afcce65d0a1c540f6a70c3bb45fc84521498c21a9d4160265dde648ab4` |
| `pose_web.binarypb` | 1007 | `dc8efd1c2d62007b34278467407fda5f70847f41310e0e39f0f59fc17b1d01f7` |
| `pose_solution_packed_assets_loader.js` | 8002 | `d7aa29b7d8e11b5c97a58d719e982dd15c2de72995d95112d60492b854840a36` |
| `pose_solution_packed_assets.data` | 2962288 | `a63c614bef30d35947f13be361820b1e4e3bec9cfeebf4d11216a18373108e85` |
| `pose_solution_simd_wasm_bin.js` | 276478 | `3983d1dca31d945d81abb70b18dd61f28ef4736e112463d7cfb1cbadef588127` |
| `pose_solution_simd_wasm_bin.wasm` | 6104372 | `195a929430e2ce130b3efb82e64ba27c8e68cb0f6bad870b715688060ea6f7e2` |
| `pose_solution_simd_wasm_bin.data` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `pose_solution_wasm_bin.js` | 276473 | `3fcfd9574a04fcf4a0b9271b9b4429c6b9a70278300a5e54c45ddf2001e41422` |
| `pose_solution_wasm_bin.wasm` | 5994571 | `a5589369289e1f1e007c106e8ffb26e85a5be762c6db9551ed36213f8f58378d` |
| `pose_landmark_lite.tflite` | 2819824 | `f17bfbecadb61c3be1baa8b8d851cc6619c870a87167b32848ad20db306b9d61` |

| `pose_landmark_full.tflite` | 6440512 | `e9a5c5cb17f736fafd4c2ec1da3b3d331d6edbe8a0d32395855aeb2cdfd64b9f` |
