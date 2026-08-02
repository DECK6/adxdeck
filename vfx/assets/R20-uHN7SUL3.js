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
var R20_op_art_pulse_effect_exports = {};
__export(R20_op_art_pulse_effect_exports, {
  default: () => R20_op_art_pulse_effect_default
});
module.exports = __toCommonJS(R20_op_art_pulse_effect_exports);
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
uniform float u_cells;
uniform float u_warp;
uniform float u_pulse;
uniform float u_cycles;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float phase = u_t * TAU * u_cycles;
  float radius = length(p);
  float angle = atan(p.y, p.x);
  float breathing = sin(phase) * u_pulse;
  float radialWarp = sin(radius * 18.0 - phase * 2.0 + u_seed * 0.01) * u_warp;
  angle += radialWarp * (0.45 + radius) + breathing * cos(radius * 12.0);
  radius *= 1.0 + breathing * exp(-radius * 1.7);
  vec2 warped = vec2(cos(angle), sin(angle)) * radius;
  warped += normalize(p + vec2(0.0001)) * sin(angle * 4.0 + phase) * u_warp * 0.035;
  vec2 grid = warped * u_cells + 0.5;
  float checker = mod(floor(grid.x) + floor(grid.y), 2.0);
  vec2 local = abs(fract(grid) - 0.5);
  float edge = 1.0 - smoothstep(0.42, 0.49, max(local.x, local.y));
  float pulseHalo = exp(-abs(radius - (0.18 + 0.12 * sin(phase))) * 24.0);
  float clockGuard = (u_frame / max(u_fps, 1.0)) * 0.0;
  vec4 subject = texture2D(u_subject, v_uv);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 dark = background * (0.48 + edge * 0.18);
  vec3 bright = mix(vec3(0.84), u_signal, 0.58) * (0.62 + edge * 0.38);
  vec3 pattern = mix(dark, bright, checker);
  pattern += u_signal * pulseHalo * 0.16 + clockGuard;
  vec3 color = mix(pattern, mix(subject.rgb, u_signal, 0.14), subject.a * 0.18);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_fps: ctx.fps,
      u_seed: ctx.random("shader-seed") * 4096,
      u_cells: Math.min(28, Math.max(8, Math.round(Number(ctx.params.cells ?? 16)))),
      u_warp: Math.min(0.6, Math.max(0.05, Number(ctx.params.warp ?? 0.34))),
      u_pulse: Math.min(0.5, Math.max(0.05, Number(ctx.params.pulse ?? 0.26))),
      u_cycles: Math.min(3, Math.max(1, Math.round(Number(ctx.params.cycles ?? 1)))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var R20_op_art_pulse_effect_default = kernel;
`;export{e as default};
