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
var M12_noise_dissolve_effect_exports = {};
__export(M12_noise_dissolve_effect_exports, {
  default: () => M12_noise_dissolve_effect_default
});
module.exports = __toCommonJS(M12_noise_dissolve_effect_exports);
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
uniform float u_scale;
uniform float u_edgeWidth;
uniform float u_grain;
uniform float u_mode;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 fade = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), fade.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), fade.x),
    fade.y
  );
}

float fbm(vec2 p) {
  float sum = valueNoise(p) * 0.57;
  sum += valueNoise(p * 2.03 + 7.1) * 0.28;
  sum += valueNoise(p * 4.07 - 3.8) * 0.15;
  return sum;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float coarse = fbm(p * u_scale + vec2(2.7, -1.4));
  float fine = valueNoise(p * u_scale * 3.2 + vec2(-4.1, 8.3));
  float dissolveField = mix(coarse, fine, u_grain * 0.38);

  float verticalField = mix(dissolveField, uv.y, 0.46);
  float radialField = mix(dissolveField, clamp(1.0 - length(p) * 1.4, 0.0, 1.0), 0.46);
  dissolveField = mix(dissolveField, verticalField, step(0.5, u_mode));
  dissolveField = mix(dissolveField, radialField, step(1.5, u_mode));

  float progress = 0.5 - 0.5 * cos(TAU * u_t);
  float threshold = mix(-u_edgeWidth, 1.0 + u_edgeWidth, progress);
  float softness = 0.012 + u_grain * 0.018;
  float visibleMask = smoothstep(threshold - softness, threshold + softness, dissolveField);
  float edge = 1.0 - smoothstep(u_edgeWidth * 0.35, u_edgeWidth, abs(dissolveField - threshold));
  edge *= step(-0.001, threshold) * step(threshold, 1.001);

  vec4 subject = texture2D(u_subject, uv);
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 subjectLayer = mix(background, subject.rgb, subject.a);
  vec3 color = mix(background, subjectLayer, visibleMask);
  color += u_signal * edge * (0.38 + subject.a * 0.46);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => {
      const mode = String(ctx.params.mode ?? "organic");
      return {
        u_scale: Math.min(14, Math.max(2, Number(ctx.params.scale ?? 6.5))),
        u_edgeWidth: Math.min(0.18, Math.max(0.01, Number(ctx.params.edgeWidth ?? 0.065))),
        u_grain: Math.min(1, Math.max(0, Number(ctx.params.grain ?? 0.42))),
        u_mode: mode === "vertical" ? 1 : mode === "radial" ? 2 : 0,
        u_signal: colorToRgb(ctx.params.signal)
      };
    }
  }
};
var M12_noise_dissolve_effect_default = kernel;
`;export{e as default};
