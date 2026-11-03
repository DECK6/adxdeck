/*!
 * Local upper/full-body tracking using MediaPipe Pose 0.5.1675469404 (Lite/Full).
 * MIT License. Vendored MediaPipe assets retain their Apache-2.0 license.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(root);
  else root.BodyTracking = factory(root);
})(typeof self !== 'undefined' ? self : globalThis, function (root) {
  'use strict';
  const LOCAL_BASE = 'lib/vendor/pose/';
  const VISIBILITY = .55;
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

  /**
   * Input is unmirrored MediaPipe image coordinates (selfieMode:false).
   * Output names refer to the MIRRORED preview: anatomical LEFT 11/13/15
   * drives screen-left; anatomical RIGHT 12/14/16 drives screen-right.
   * Positive lean is clockwise shoulder tilt in that mirrored preview.
   * Invalid channels are zero with valid=false; callers must use the flag
   * to return that channel to idle/voice, rather than accept zero as a pose.
   */
  function measure(landmarks, aspect, world) {
    const out = { bodyLean: 0, leftArm: 0, rightArm: 0, leftElbow: 0, rightElbow: 0,
      leftValid: false, rightValid: false, torsoValid: false,
      hipX: 0, hipY: 0, torsoHeight: 0, hipValid: false, lowerValid: false,
      leftLegValid: false, rightLegValid: false, leftKnee: 0, rightKnee: 0,
      leftLift: 0, rightLift: 0, hipLean: 0 };
    const ar = Number.isFinite(aspect) && aspect > 0 ? aspect : 4 / 3;
    function point(index) {
      const p = landmarks && landmarks[index];
      if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y) ||
          !Number.isFinite(p.visibility) || p.visibility < VISIBILITY ||
          p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) return null;
      return { x: p.x * ar, y: p.y };
    }
    function arm(side, shoulderIndex, elbowIndex, wristIndex) {
      const s = point(shoulderIndex), e = point(elbowIndex), w = point(wristIndex);
      out[side+'UpperValid']=false;out[side+'ForeValid']=false;
      function direction(a,b){
        const wa=world?.[a],wb=world?.[b];let d;
        if(wa&&wb&&[wa.x,wa.y,wa.z,wb.x,wb.y,wb.z].every(Number.isFinite))d=[wa.x-wb.x,wa.y-wb.y,wa.z-wb.z];
        else {const a0=point(a),b0=point(b);d=[a0.x-b0.x,a0.y-b0.y,0];}
        const n=Math.hypot(...d);return n>1e-4?d.map(v=>v/n):null;
      }
      if(s&&e){const d=direction(shoulderIndex,elbowIndex);if(d){out[side+'UpperDir']=d;out[side+'UpperValid']=true;}}
      if(e&&w){const d=direction(elbowIndex,wristIndex);if(d){out[side+'ForeDir']=d;out[side+'ForeValid']=true;}}
      if (!s || !e) return;
      const upperLength=Math.hypot(e.x-s.x,e.y-s.y);
      if(upperLength>1e-4)out[side+'Arm']=Math.acos(clamp((e.y-s.y)/upperLength,-1,1))/Math.PI;
      if(!w)return;
      const ux = e.x - s.x, uy = e.y - s.y, fx = w.x - e.x, fy = w.y - e.y;
      const upper = Math.hypot(ux, uy), forearm = Math.hypot(fx, fy);
      if (upper < 1e-4 || forearm < 1e-4) return;
      // Downward=0, horizontal=.5, overhead=1. Bend: straight=0, 135°=1.
      out[side + 'Arm'] = Math.acos(clamp(uy / upper, -1, 1)) / Math.PI;
      out[side + 'Elbow'] = clamp(Math.acos(clamp((ux * fx + uy * fy) / (upper * forearm), -1, 1)) / (Math.PI * .75), 0, 1);
      out[side + 'Valid'] = true;
    }
    arm('left', 11, 13, 15); arm('right', 12, 14, 16);
    const left = point(11), right = point(12);
    if (left && right && Math.abs(left.x - right.x) > 1e-4) {
      out.bodyLean = clamp(Math.atan2(right.y - left.y, Math.abs(left.x - right.x)) / (Math.PI / 9), -1, 1);
      out.torsoValid = true;
    }
    const hipL = point(23), hipR = point(24);
    if (hipL && hipR && left && right) {
      out.hipX = (hipL.x + hipR.x) / (2 * ar);
      out.hipY = (hipL.y + hipR.y) / 2;
      out.torsoHeight = Math.hypot((hipL.x + hipR.x - left.x - right.x) / 2,
        out.hipY - (left.y + right.y) / 2);
      out.hipValid = out.torsoHeight > .05;
      out.hipLean = clamp(Math.atan2(hipR.y - hipL.y, Math.abs(hipL.x - hipR.x)) / (Math.PI / 6), -1, 1);
    }
    function leg(side, hip, kneeIndex, ankleIndex) {
      const knee = point(kneeIndex), ankle = point(ankleIndex);
      if (!out.hipValid || !hip || !knee || !ankle) return;
      const u = { x: knee.x - hip.x, y: knee.y - hip.y }, v = { x: ankle.x - knee.x, y: ankle.y - knee.y };
      const length = Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y);
      if (length < 1e-5) return;
      out[side + 'Knee'] = clamp(Math.acos(clamp((u.x*v.x + u.y*v.y) / length, -1, 1)) / (Math.PI * .65), 0, 1);
      out[side + 'LegValid'] = true;
    }
    leg('left', hipL, 25, 27); leg('right', hipR, 26, 28);
    out.lowerValid = out.leftLegValid && out.rightLegValid;
    if (out.lowerValid) {
      const delta = (point(28).y - point(27).y) / out.torsoHeight;
      out.leftLift = clamp(delta, 0, 1); out.rightLift = clamp(-delta, 0, 1);
    }
    return out;
  }

  function create(options) {
    const o = options || {};
    let generation = 0, session = null, cleanup = Promise.resolve();
    let state = { status: 'off', message: '상체 추적 꺼짐' };
    function notify(status, message) {
      state = { status, message };
      try { if (o.onState) o.onState(status, message); } catch (_) { /* Consumer errors cannot stop the shared camera. */ }
    }
    const current = s => session === s && s.token === generation;
    function closeSession(s) {
      if (!s) return cleanup;
      if (s.closing) return s.closing;
      if (s.cancelLoader) s.cancelLoader();
      s.closing = Promise.resolve(s.pending).catch(() => {}).then(async () => {
        try { if (s.pose) await s.pose.close(); }
        finally { if (s.frame) s.frame.remove(); s.pose = null; s.canvas = null; }
      }).catch(() => {});
      return s.closing;
    }
    function loadScript(s, doc, url) {
      return new Promise((resolve, reject) => {
        const script = doc.createElement('script');
        let timer, settled = false;
        const finish = error => {
          if (settled) return;
          settled = true; root.clearTimeout(timer); s.cancelLoader = null;
          script.onload = null; script.onerror = null;
          if (error) { script.remove(); reject(error); } else resolve();
        };
        script.src = url; script.async = true;
        script.onload = () => finish();
        script.onerror = () => finish(new Error('상체 추적 모델 파일을 읽을 수 없습니다'));
        s.cancelLoader = () => finish(new Error('상체 추적 시작 취소'));
        timer = root.setTimeout(() => finish(new Error('상체 추적 모델 로딩 시간 초과')), 20000);
        doc.head.appendChild(script);
      });
    }
    function start() {
      if (session) return session.startPromise;
      const s = { token: ++generation, pose: null, frame: null, canvas: null, pending: null,
        ready: false, busy: false, lastAt: -Infinity, nextAt: -Infinity, lastTime: null, aspect: 4 / 3 };
      session = s; notify('loading', '상체 추적 모델 준비 중');
      s.startPromise = (async () => {
        try {
          await cleanup;
          if (!current(s)) return false;
          if (!root.document) throw new Error('브라우저에서 상체 추적을 시작해 주세요');
          // Legacy FaceMesh and Pose overwrite identically named WASM globals.
          // Give Pose its own same-origin document and destroy it on stop.
          const frame = root.document.createElement('iframe'); s.frame = frame;
          frame.hidden = true; frame.title = '상체 추적 처리'; frame.setAttribute('aria-hidden', 'true');
          frame.src = 'about:blank';
          (root.document.body || root.document.documentElement).appendChild(frame);
          const realm = frame.contentWindow, doc = frame.contentDocument;
          if (!realm || !doc) throw new Error('상체 추적 처리 공간을 열 수 없습니다');
          const base = root.document.baseURI ? new URL(LOCAL_BASE, root.document.baseURI).href : LOCAL_BASE;
          if (!realm.Pose) {
            s.pending = loadScript(s, doc, base + 'pose.js');
            await s.pending;
          }
          if (!current(s)) return false;
          if (typeof realm.Pose !== 'function') throw new Error('상체 추적 모델이 준비되지 않았습니다');
          s.canvas = doc.createElement('canvas');
          s.pose = new realm.Pose({ locateFile: file => base + file });
          // The pinned graph exposes InferenceCalculator.use_cpu_inference.
          // CPU inference avoids competing with FaceMesh and the avatar
          // for the graphics queue, including software-WebGL environments.
          s.pose.setOptions({ useCpuInference: true, selfieMode: false, modelComplexity: o.modelComplexity === 1 ? 1 : 0, smoothLandmarks: o.smoothLandmarks !== false,
            enableSegmentation: false, smoothSegmentation: false,
            minDetectionConfidence: .55, minTrackingConfidence: .55 });
          s.pose.onResults(results => {
            if (!current(s) || !s.ready) return;
            const lm = results && results.poseLandmarks || null;
            const receivedAt = root.performance ? root.performance.now() : Date.now();
            const meta = { capturedAt: s.capturedAt, receivedAt, inferenceMs: receivedAt - s.capturedAt,
              sourceTime: s.lastTime, aspect: s.aspect };
            try { if (o.onResults) o.onResults(measure(lm, s.aspect, results && results.poseWorldLandmarks), lm, results && results.poseWorldLandmarks || null, meta); } catch (_) { /* Keep the shared camera alive. */ }
          });
          s.pending = Promise.resolve(s.pose.initialize());
          await s.pending;
          if (!current(s)) return false;
          s.ready = true; notify('on', '상체 추적 중'); return true;
        } catch (_) {
          if (current(s)) {
            session = null; generation++;
            notify('error', '상체 추적을 시작하지 못했습니다. 카메라를 다시 켜 주세요');
          }
          cleanup = closeSession(s); await cleanup; return false;
        }
      })();
      return s.startPromise;
    }
    async function feed(video) {
      const s = session;
      if (!s || !s.ready || s.busy || !video || (typeof video.readyState === 'number' && video.readyState < 2)) return false;
      const now = root.performance ? root.performance.now() : Date.now();
      const videoTime = Number.isFinite(video.currentTime) ? video.currentTime : null;
      if (videoTime !== null && s.lastTime !== null && videoTime < s.lastTime) {
        s.lastAt = s.nextAt = -Infinity; s.lastTime = null;
      }
      const fps = clamp(Number.isFinite(o.maxFps) ? o.maxFps : 15, 1, 30);
      // Anchor the 30fps deadline to camera time. Resetting the interval at
      // each accepted frame halves the rate when timestamps jitter ±2ms.
      const sourceClock = fps === 30 && videoTime !== null;
      const at = sourceClock ? videoTime * 1000 : now, interval = 1000 / fps;
      if ((sourceClock ? at < s.nextAt - .01 : at - s.lastAt < interval - .01) || (videoTime !== null && s.lastTime === videoTime)) return false;
      const width = video.videoWidth || video.naturalWidth || video.width;
      const height = video.videoHeight || video.naturalHeight || video.height;
      if (!(width > 0 && height > 0)) return false;
      s.busy = true; s.lastAt = at; s.lastTime = videoTime; s.aspect = width / height; s.capturedAt = now;
      s.nextAt = Number.isFinite(s.nextAt) ? Math.max(s.nextAt + interval, at) : at + interval;
      try {
        // Pose's instanceof HTMLVideoElement check is realm-local. Copy into
        // an owned canvas instead of passing a cross-realm video with width=0.
        const scale = Math.min(1, 640 / Math.max(width, height));
        const w = Math.max(1, Math.round(width * scale)), h = Math.max(1, Math.round(height * scale));
        if (s.canvas.width !== w) s.canvas.width = w;
        if (s.canvas.height !== h) s.canvas.height = h;
        s.canvas.getContext('2d').drawImage(video, 0, 0, w, h);
        s.pending = Promise.resolve().then(() => s.pose.send({ image: s.canvas }));
        await s.pending;
        return current(s);
      } catch (_) {
        if (current(s)) {
          session = null; generation++;
          notify('error', '상체 추적이 중지되었습니다. 카메라를 다시 켜 주세요');
          cleanup = closeSession(s);
        }
        return false;
      } finally { s.busy = false; }
    }
    function stop() {
      generation++; const s = session; session = null;
      cleanup = closeSession(s); notify('off', '상체 추적 꺼짐'); return cleanup;
    }
    return { start, feed, stop, get active() { return !!(session && session.ready); },
      get state() { return Object.assign({}, state); } };
  }
  return { measure, create, VERSION: '0.5.1675469404', VISIBILITY };
});
