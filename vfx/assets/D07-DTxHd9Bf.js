const e=`var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var D07_mesh_warp_effect_exports = {};
__export(D07_mesh_warp_effect_exports, {
  default: () => D07_mesh_warp_effect_default
});
module.exports = __toCommonJS(D07_mesh_warp_effect_exports);
function colorToRgb(value) {
  const hex = String(value ?? "#5EE7F3").replace("#", "");
  const valid = /^[0-9a-f]{6}$/i.test(hex) ? hex : "5EE7F3";
  return [0, 2, 4].map((offset) => Number.parseInt(valid.slice(offset, offset + 2), 16) / 255);
}
const kernel = {
  kind: "webgl",
  shader: {
    frag: \`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_frame;
uniform float u_t;
uniform float u_strength;
uniform float u_columns;
uniform float u_fluidity;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec2 controlOffset(vec2 point, float phase) {
  float seedA = hash(point + 17.3);
  float seedB = hash(point.yx + 43.1);
  float angleA = phase * (0.65 + seedB * 0.7) + seedA * TAU;
  float angleB = -phase * (0.55 + seedA * 0.65) + seedB * TAU;
  return vec2(sin(angleA) + cos(angleB) * 0.45, cos(angleA) + sin(angleB) * 0.45) / 1.45;
}

void main() {
  float phase = u_t * TAU * u_speed;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 gridSize = vec2(u_columns, max(3.0, floor(u_columns / aspect + 0.5)));
  vec2 gridUv = v_uv * gridSize;
  vec2 cell = floor(gridUv);
  vec2 f = fract(gridUv);
  vec2 eased = f * f * (3.0 - 2.0 * f);

  vec2 a = controlOffset(cell, phase);
  vec2 b = controlOffset(cell + vec2(1.0, 0.0), phase);
  vec2 c = controlOffset(cell + vec2(0.0, 1.0), phase);
  vec2 d = controlOffset(cell + vec2(1.0, 1.0), phase);
  vec2 top = mix(a, b, eased.x);
  vec2 bottom = mix(c, d, eased.x);
  vec2 displacement = mix(top, bottom, eased.y) * u_strength * u_fluidity;
  displacement *= vec2(1.0, aspect);

  vec2 sampleUv = v_uv + displacement;
  float inside = step(0.0, sampleUv.x) * step(sampleUv.x, 1.0) * step(0.0, sampleUv.y) * step(sampleUv.y, 1.0);
  vec4 subject = texture2D(u_subject, clamp(sampleUv, 0.0, 1.0));
  vec4 edgeSample = texture2D(u_subject, clamp(sampleUv + displacement * 0.08 + vec2(0.002), 0.0, 1.0));
  float subjectEdge = abs(subject.a - edgeSample.a) + length(subject.rgb - edgeSample.rgb) * 0.3;

  vec2 gridDistance = abs(fract(gridUv + displacement * gridSize) - 0.5);
  float gridLine = 1.0 - smoothstep(0.465, 0.495, max(gridDistance.x, gridDistance.y));
  float nodes = 1.0 - smoothstep(0.02, 0.11, length(fract(gridUv) - 0.5));
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 field = background + u_signal * (gridLine * 0.025 + nodes * 0.055);
  vec3 color = mix(field, subject.rgb, subject.a * inside);
  color += u_signal * subjectEdge * inside * 0.38;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_strength: Math.min(0.18, Math.max(0.01, Number(ctx.params.strength ?? 0.085))),
      u_columns: Math.min(9, Math.max(3, Math.round(Number(ctx.params.columns ?? 5)))),
      u_fluidity: Math.min(1.4, Math.max(0.2, Number(ctx.params.fluidity ?? 0.8))),
      u_speed: Math.min(2, Math.max(0.5, Number(ctx.params.speed ?? 1))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var D07_mesh_warp_effect_default = kernel;
`;export{e as default};
