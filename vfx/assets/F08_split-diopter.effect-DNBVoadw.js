function u(e){const a=String(e??"#5EE7F3").replace("#",""),t=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(r=>Number.parseInt(t.slice(r,r+2),16)/255)}const s={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_split;
uniform float u_nearZoom;
uniform float u_blur;
uniform float u_feather;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU;
  float split = u_split + sin(phase) * 0.035;
  float breathing = 1.0 + (0.5 - 0.5 * cos(phase)) * 0.025;
  vec2 pivot = vec2(split, 0.5);
  vec2 nearUv = (v_uv - pivot) / (u_nearZoom * breathing) + pivot;
  vec2 farUv = (v_uv - 0.5) * 1.035 + 0.5;
  float nearMask = 1.0 - smoothstep(split - u_feather, split + u_feather, v_uv.x);
  vec2 selectedUv = mix(farUv, nearUv, nearMask);

  vec4 nearSharp = texture2D(u_subject, clamp(nearUv, 0.0, 1.0));
  vec4 farSharp = texture2D(u_subject, clamp(farUv, 0.0, 1.0));
  vec4 sharp = mix(farSharp, nearSharp, nearMask);
  float seamDistance = abs(v_uv.x - split);
  float seamBlur = exp(-seamDistance * seamDistance / max(0.0001, u_feather * u_feather * 0.52));
  vec2 px = vec2(u_resolution.y / max(u_resolution.x, 1.0), 1.0) * u_blur;

  vec4 blurred = texture2D(u_subject, clamp(selectedUv, 0.0, 1.0)) * 0.20;
  blurred += texture2D(u_subject, clamp(selectedUv + vec2(px.x, 0.0), 0.0, 1.0)) * 0.12;
  blurred += texture2D(u_subject, clamp(selectedUv - vec2(px.x, 0.0), 0.0, 1.0)) * 0.12;
  blurred += texture2D(u_subject, clamp(selectedUv + vec2(0.0, px.y), 0.0, 1.0)) * 0.12;
  blurred += texture2D(u_subject, clamp(selectedUv - vec2(0.0, px.y), 0.0, 1.0)) * 0.12;
  blurred += texture2D(u_subject, clamp(selectedUv + px * 0.72, 0.0, 1.0)) * 0.08;
  blurred += texture2D(u_subject, clamp(selectedUv - px * 0.72, 0.0, 1.0)) * 0.08;
  blurred += texture2D(u_subject, clamp(selectedUv + vec2(px.x, -px.y) * 0.72, 0.0, 1.0)) * 0.08;
  blurred += texture2D(u_subject, clamp(selectedUv + vec2(-px.x, px.y) * 0.72, 0.0, 1.0)) * 0.08;

  vec4 focused = mix(sharp, blurred, seamBlur * 0.9);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 color = mix(background, focused.rgb, focused.a);
  float seamLine = exp(-seamDistance * 90.0) * (0.35 + 0.15 * cos(phase));
  color += u_signal * seamLine * 0.16;
  float nearEdge = smoothstep(0.0, 0.02, nearUv.x) * smoothstep(1.0, 0.98, nearUv.x);
  color += u_signal * (1.0 - nearEdge) * nearMask * 0.025;
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_split:Math.min(.75,Math.max(.25,Number(e.params.split??.5))),u_nearZoom:Math.min(1.65,Math.max(1.05,Number(e.params.nearZoom??1.3))),u_blur:Math.min(.035,Math.max(.002,Number(e.params.blur??.016))),u_feather:Math.min(.18,Math.max(.01,Number(e.params.feather??.07))),u_signal:u(e.params.signal)})}};export{s as default};
