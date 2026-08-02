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
var H02_aurora_veil_effect_exports = {};
__export(H02_aurora_veil_effect_exports, {
  default: () => H02_aurora_veil_effect_default
});
module.exports = __toCommonJS(H02_aurora_veil_effect_exports);
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
uniform float u_curtains;
uniform float u_width;
uniform float u_glow;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float verticalVeil(vec2 uv, float index, float phase) {
  float center = (index + 0.5) / u_curtains;
  float bend = sin(uv.y * TAU * 1.15 + phase + index * 1.7) * 0.035;
  bend += sin(uv.y * TAU * 2.7 - phase + index * 0.8) * 0.012;
  float distanceToCurtain = abs(uv.x - center - bend);
  float body = exp(-distanceToCurtain / u_width);
  float pleat = 0.58 + 0.42 * sin((uv.x - center) * 135.0 + uv.y * 9.0 + phase * 1.6);
  float verticalFade = smoothstep(0.02, 0.24, uv.y) * (1.0 - smoothstep(0.62, 1.08, uv.y));
  return body * (0.55 + pleat * 0.45) * verticalFade;
}

void main() {
  float phase = u_t * TAU * u_speed;
  vec2 uv = v_uv;
  float light = 0.0;
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    float enabled = 1.0 - step(u_curtains, fi + 0.5);
    light += verticalVeil(uv, fi, phase + u_seed * TAU) * enabled;
  }
  light = clamp(light / max(u_curtains * 0.42, 1.0), 0.0, 1.0);

  vec3 ink = vec3(0.05098, 0.05490, 0.06275);
  vec3 violet = mix(u_signal, vec3(0.46, 0.2, 0.62), 0.48);
  float hueShift = 0.5 + 0.5 * sin(uv.y * 5.0 - phase + uv.x * 2.0);
  vec3 aurora = mix(violet, u_signal, hueShift * 0.72);
  vec3 field = ink + aurora * light * u_glow * 0.52;
  field += u_signal * light * light * u_glow * 0.14;

  vec4 subject = texture2D(u_subject, uv);
  vec3 color = mix(field, subject.rgb, subject.a * 0.25);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_resolution: [ctx.width, ctx.height],
      u_frame: ctx.frame,
      u_t: ctx.t,
      u_fps: ctx.fps,
      u_seed: ctx.random("shader-seed"),
      u_curtains: Math.min(7, Math.max(3, Math.round(Number(ctx.params.curtains ?? 5)))),
      u_width: Math.min(0.26, Math.max(0.08, Number(ctx.params.width ?? 0.16))),
      u_glow: Math.min(1, Math.max(0.25, Number(ctx.params.glow ?? 0.68))),
      u_speed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1)))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var H02_aurora_veil_effect_default = kernel;
`;export{e as default};
