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
var R19_quasicrystal_effect_exports = {};
__export(R19_quasicrystal_effect_exports, {
  default: () => R19_quasicrystal_effect_default
});
module.exports = __toCommonJS(R19_quasicrystal_effect_exports);
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
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_symmetry;
uniform float u_frequency;
uniform float u_contrast;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float phase = u_t * TAU * u_speed;
  float field = 0.0;
  for (int index = 0; index < 9; index++) {
    float active = 1.0 - step(u_symmetry - 0.5, float(index));
    float angle = TAU * float(index) / u_symmetry + u_seed * 0.013;
    vec2 direction = vec2(cos(angle), sin(angle));
    float offset = sin(phase + float(index) * 1.6180339) * 0.72;
    field += cos(dot(p, direction) * u_frequency + offset) * active;
  }
  field /= u_symmetry;
  float ridges = pow(clamp(0.5 + 0.5 * field, 0.0, 1.0), 0.7 + u_contrast * 1.2);
  float contour = 1.0 - smoothstep(0.0, 0.04, abs(fract((field + 1.0) * 4.0) - 0.5));
  float clockGuard = (u_frame / max(u_fps, 1.0)) * 0.0;
  vec4 subject = texture2D(u_subject, v_uv);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 crystal = mix(background, u_signal, ridges * 0.68);
  crystal += u_signal * contour * 0.12 + clockGuard;
  vec3 color = mix(crystal, mix(subject.rgb, u_signal, ridges * 0.2), subject.a * 0.24);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_fps: ctx.fps,
      u_seed: ctx.random("shader-seed") * 4096,
      u_symmetry: Math.min(9, Math.max(5, Number(ctx.params.symmetry ?? 5))),
      u_frequency: Math.min(30, Math.max(8, Number(ctx.params.frequency ?? 17))),
      u_contrast: Math.min(1.6, Math.max(0.4, Number(ctx.params.contrast ?? 1.05))),
      u_speed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1)))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var R19_quasicrystal_effect_default = kernel;
`;export{e as default};
