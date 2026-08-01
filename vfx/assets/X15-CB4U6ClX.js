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
var X15_luma_wipe_effect_exports = {};
__export(X15_luma_wipe_effect_exports, {
  default: () => X15_luma_wipe_effect_default
});
module.exports = __toCommonJS(X15_luma_wipe_effect_exports);
function colorToRgb(value) {
  const hex = String(value ?? "#5EE7F3").replace("#", "");
  const valid = /^[0-9a-f]{6}$/i.test(hex) ? hex : "5EE7F3";
  return [0, 2, 4].map((offset) => Number.parseInt(valid.slice(offset, offset + 2), 16) / 255);
}
function directionValue(value) {
  if (value === "horizontal") return 0;
  if (value === "vertical") return 1;
  return 2;
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
uniform float u_softness;
uniform float u_detail;
uniform float u_direction;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU * u_speed;
  vec2 axis = vec2(0.70710678);
  if (u_direction < 0.5) axis = vec2(1.0, 0.0);
  else if (u_direction < 1.5) axis = vec2(0.0, 1.0);

  vec2 centered = v_uv - 0.5;
  float ramp = dot(centered, axis) + 0.5;
  float waves = sin(dot(v_uv, vec2(1.0, 0.37)) * u_detail * TAU + phase) * 0.16;
  waves += sin(dot(v_uv, vec2(-0.41, 1.0)) * u_detail * 1.7 * TAU - phase * 2.0) * 0.09;
  waves += cos(length(centered) * u_detail * 9.0 + phase * 3.0) * 0.055;
  float lumaField = clamp(ramp + waves, 0.0, 1.0);

  float progress = mix(-0.18, 1.18, 0.5 - 0.5 * cos(phase));
  float mask = smoothstep(lumaField - u_softness, lumaField + u_softness, progress);
  float edge = 1.0 - smoothstep(u_softness, u_softness * 2.6, abs(progress - lumaField));
  vec4 subject = texture2D(u_subject, v_uv);
  float subjectLuma = dot(subject.rgb, vec3(0.2126, 0.7152, 0.0722));
  mask *= smoothstep(-0.08, 0.22, progress - lumaField + subjectLuma * 0.18);

  vec3 background = vec3(0.051, 0.055, 0.063);
  float ambient = 0.018 + 0.025 * (0.5 + 0.5 * sin(lumaField * 18.0 - phase));
  vec3 base = background + u_signal * ambient;
  vec3 subjectColor = mix(base, subject.rgb, subject.a);
  vec3 color = mix(base, subjectColor, mask);
  color += u_signal * edge * (0.28 + subject.a * 0.3);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_softness: Math.min(0.25, Math.max(0.01, Number(ctx.params.softness ?? 0.085))),
      u_detail: Math.min(8, Math.max(1, Number(ctx.params.detail ?? 4.6))),
      u_direction: directionValue(ctx.params.direction),
      u_speed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1)))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var X15_luma_wipe_effect_default = kernel;
`;export{e as default};
