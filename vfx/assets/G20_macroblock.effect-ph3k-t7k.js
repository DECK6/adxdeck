function c(o){const e=String(o??"#5EE7F3").replace("#",""),r=/^[0-9a-f]{6}$/i.test(e)?e:"5EE7F3";return[0,2,4].map(a=>Number.parseInt(r.slice(a,a+2),16)/255)}const t={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_blockSize;
uniform float u_corruption;
uniform float u_motion;
uniform vec3 u_signal;

float hash21(vec2 p) {
  return fract(sin(dot(p + u_seed, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec2 grid = max(floor(u_resolution / u_blockSize), vec2(1.0));
  vec2 blockId = floor(v_uv * grid);
  vec2 local = fract(v_uv * grid);
  float tick = floor(mod(u_t, 1.0) * 12.0);
  float runId = floor(blockId.x / 3.0);
  float runNoise = hash21(vec2(runId, blockId.y + tick * 17.0));
  float active = step(1.0 - u_corruption, runNoise);
  float direction = step(0.5, hash21(vec2(runId + 9.0, blockId.y + tick))) * 2.0 - 1.0;
  float vectorLength = (0.3 + hash21(blockId + tick * 3.0) * 0.7) * u_motion;
  vec2 vectorUv = vec2(direction * vectorLength, (hash21(blockId + 41.0) - 0.5) * vectorLength * 0.32) / max(u_resolution, vec2(1.0));
  vec2 movedUv = clamp(v_uv + vectorUv * active, 0.0, 1.0);

  vec4 center = texture2D(u_subject, movedUv);
  vec4 chromaA = texture2D(u_subject, clamp(movedUv + vectorUv * 0.34, 0.0, 1.0));
  vec4 chromaB = texture2D(u_subject, clamp(movedUv - vectorUv * 0.22, 0.0, 1.0));
  float y = dot(center.rgb, vec3(0.299, 0.587, 0.114));
  vec3 contaminated = vec3(y + (chromaA.r - y) * 0.72, y + (center.g - y) * 0.48, y + (chromaB.b - y) * 0.76);
  vec3 sourceColor = mix(center.rgb, contaminated, active * 0.82);
  float alpha = max(center.a, max(chromaA.a, chromaB.a) * active);

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 color = mix(background, sourceColor, alpha);
  float boundary = max(step(0.94, local.x), step(0.94, local.y));
  float vectorHead = step(0.76, local.x) * (1.0 - step(0.18, abs(local.y - 0.5)));
  color += u_signal * boundary * active * 0.12;
  color += u_signal * vectorHead * active * 0.18;
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:o=>({u_blockSize:Math.min(48,Math.max(8,Math.round(Number(o.params.blockSize??20)))),u_corruption:Math.min(.9,Math.max(.05,Number(o.params.corruption??.46))),u_motion:Math.min(40,Math.max(2,Number(o.params.motion??18))),u_signal:c(o.params.signal),u_fps:o.fps,u_seed:o.random("shader-seed")*4096})}};export{t as default};
