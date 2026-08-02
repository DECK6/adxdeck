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
var H12_silk_waves_effect_exports = {};
__export(H12_silk_waves_effect_exports, {
  default: () => H12_silk_waves_effect_default
});
module.exports = __toCommonJS(H12_silk_waves_effect_exports);
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
uniform float u_folds;
uniform float u_flow;
uniform float u_sheen;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  float phase = u_t * TAU;
  float loopX = cos(phase) * 0.38 * u_flow;
  float loopY = sin(phase) * 0.24 * u_flow;
  float waveA = sin((uv.x * u_folds + loopX + u_seed * 0.17) * TAU);
  float waveB = sin((uv.x * (u_folds * 0.53 + 1.0) - loopY) * TAU + 1.7);
  float center = 0.5 + waveA * 0.12 + waveB * 0.055;
  float distanceToFold = uv.y - center;
  float ribbons = exp(-abs(distanceToFold) * 9.0);
  ribbons += exp(-abs(distanceToFold - 0.23 - waveB * 0.035) * 12.0) * 0.72;
  ribbons += exp(-abs(distanceToFold + 0.25 + waveA * 0.025) * 11.0) * 0.62;
  float normals = 0.5 + 0.5 * sin(distanceToFold * 68.0 + waveA * 2.8 - waveB * 1.7);
  float specular = pow(normals, 7.0) * ribbons * u_sheen;
  float edge = pow(1.0 - abs(uv.y - 0.5) * 1.65, 2.0);

  vec3 background = vec3(0.025, 0.043, 0.055);
  vec3 deep = mix(background, u_signal * 0.17, ribbons * 0.56);
  vec3 color = deep + u_signal * specular * 0.56 + u_signal * edge * 0.025;
  color += u_signal * (0.5 + 0.5 * cos((uv.x * aspect + uv.y) * 12.0 + phase)) * 0.012;

  vec4 subject = texture2D(u_subject, uv);
  color = mix(color, subject.rgb, subject.a * 0.26);
  color += u_signal * subject.a * specular * 0.08;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_resolution: [ctx.width, ctx.height],
      u_frame: ctx.frame,
      u_t: ctx.t,
      u_fps: ctx.fps,
      u_seed: ctx.random("silk-seed"),
      u_folds: Math.min(8, Math.max(2, Math.round(Number(ctx.params.folds ?? 5)))),
      u_flow: Math.min(1.5, Math.max(0.3, Number(ctx.params.flow ?? 0.8))),
      u_sheen: Math.min(1, Math.max(0.2, Number(ctx.params.sheen ?? 0.72))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var H12_silk_waves_effect_default = kernel;
`;export{e as default};
