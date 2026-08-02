function t(e){const o=String(e??"#5EE7F3").replace("#",""),r=/^[0-9a-f]{6}$/i.test(o)?o:"5EE7F3";return[0,2,4].map(a=>Number.parseInt(r.slice(a,a+2),16)/255)}const i={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_horizon;
uniform float u_perspective;
uniform float u_turn;
uniform float u_tileScale;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  float phase = u_t * TAU * u_turn;
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec4 centeredSubject = texture2D(u_subject, v_uv);
  vec3 sky = mix(background, centeredSubject.rgb, centeredSubject.a * 0.18);
  float skyBands = 0.5 + 0.5 * sin((v_uv.y - u_horizon) * 62.0 - phase);
  sky += u_signal * skyBands * 0.018 * smoothstep(u_horizon, 1.0, v_uv.y);

  float depth = max(0.003, u_horizon - v_uv.y);
  float floorMask = 1.0 - step(u_horizon, v_uv.y);
  float inverseDepth = u_perspective / depth;
  vec2 plane = vec2((v_uv.x - 0.5) * aspect * inverseDepth, inverseDepth * 0.24);
  mat2 rotation = mat2(cos(phase), -sin(phase), sin(phase), cos(phase));
  plane = rotation * plane;
  plane += vec2(cos(phase), sin(phase)) * 1.8;
  vec2 tileUv = fract(plane / u_tileScale + 0.5);
  vec4 tile = texture2D(u_subject, tileUv);

  vec2 gridCoord = plane / u_tileScale;
  vec2 gridDistance = abs(fract(gridCoord) - 0.5);
  float grid = smoothstep(0.455, 0.5, max(gridDistance.x, gridDistance.y));
  float horizonGlow = exp(-abs(v_uv.y - u_horizon) * 92.0);
  float distanceFade = smoothstep(0.0, 0.28, depth);
  vec3 floorColor = background + u_signal * grid * (0.08 + distanceFade * 0.16);
  floorColor = mix(floorColor, tile.rgb, tile.a * (0.42 + distanceFade * 0.48));
  floorColor += u_signal * horizonGlow * 0.48;
  vec3 color = mix(sky, floorColor, floorMask);
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_horizon:Math.min(.62,Math.max(.3,Number(e.params.horizon??.46))),u_perspective:Math.min(1.4,Math.max(.4,Number(e.params.perspective??.86))),u_turn:Math.min(4,Math.max(1,Math.round(Number(e.params.turn??1)))),u_tileScale:Math.min(7,Math.max(1.5,Number(e.params.tileScale??3.8))),u_signal:t(e.params.signal)})}};export{i as default};
