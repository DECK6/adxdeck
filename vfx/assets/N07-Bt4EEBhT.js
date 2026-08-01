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
var N07_aurora_wave_effect_exports = {};
__export(N07_aurora_wave_effect_exports, {
  default: () => N07_aurora_wave_effect_default
});
module.exports = __toCommonJS(N07_aurora_wave_effect_exports);
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
uniform float u_intensity;
uniform float u_curtains;
uniform float u_bend;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float ribbon(float x, float y, float offset, float phase) {
  float path = 0.55
    + sin(x * 3.4 + phase + offset) * 0.13 * u_bend
    + sin(x * 7.1 - phase * 2.0 + offset * 2.7) * 0.045 * u_bend;
  float width = 0.018 + 0.012 * (0.5 + 0.5 * sin(x * 5.0 - phase + offset));
  float core = exp(-abs(y - path) / width);
  float tail = smoothstep(path - 0.52, path, y) * smoothstep(path + 0.08, path - 0.06, y);
  return core * 0.68 + tail * 0.22;
}

void main() {
  vec2 uv = v_uv;
  float phase = TAU * u_t * u_speed;
  float light = 0.0;
  float active = max(2.0, u_curtains);
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    float enabled = 1.0 - step(active, fi + 0.5);
    float offset = fi * 1.37;
    float x = uv.x + fi * 0.071;
    float y = uv.y - (fi - (active - 1.0) * 0.5) * 0.047;
    light += ribbon(x, y, offset, phase) * enabled * (0.88 - fi * 0.055);
  }

  float verticalShimmer = 0.72 + 0.28 * sin(uv.x * 42.0 + phase * 3.0 + sin(uv.y * 9.0));
  float horizonFade = smoothstep(0.03, 0.32, uv.y) * smoothstep(1.03, 0.64, uv.y);
  light = clamp(light * verticalShimmer * horizonFade * u_intensity, 0.0, 1.0);

  vec4 subject = texture2D(u_subject, uv);
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 violet = mix(u_signal, vec3(0.45, 0.24, 0.72), 0.38);
  vec3 aurora = mix(violet, u_signal, smoothstep(0.15, 0.85, uv.x + 0.16 * sin(phase)));
  vec3 field = background + aurora * light * 0.76 + u_signal * light * light * 0.28;
  vec3 subjectColor = subject.rgb + aurora * light * 0.18;
  vec3 color = mix(field, subjectColor, subject.a);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_intensity: Math.min(1, Math.max(0.2, Number(ctx.params.intensity ?? 0.78))),
      u_curtains: Math.min(7, Math.max(2, Math.round(Number(ctx.params.curtains ?? 4)))),
      u_bend: Math.min(1.4, Math.max(0.2, Number(ctx.params.bend ?? 0.82))),
      u_speed: Math.min(2, Math.max(0.5, Number(ctx.params.speed ?? 1))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var N07_aurora_wave_effect_default = kernel;
`;export{e as default};
