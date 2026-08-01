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
var A09_amplitude_warp_effect_exports = {};
__export(A09_amplitude_warp_effect_exports, {
  default: () => A09_amplitude_warp_effect_default
});
module.exports = __toCommonJS(A09_amplitude_warp_effect_exports);
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
uniform float u_t;
uniform float u_energy;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_mode;
uniform float u_chroma;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

vec2 warpUv(vec2 uv, float energy) {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float radius = length(p);
  float angle = atan(p.y, p.x);
  float phase = TAU * u_t;
  vec2 displacement;
  if (u_mode < 0.5) {
    displacement = normalize(p + vec2(0.0001))
      * sin(radius * 34.0 - phase * 4.0) * energy * 0.045;
  } else if (u_mode < 1.5) {
    displacement = vec2(
      sin(p.y * 22.0 + phase * 3.0 + u_mid * 4.0),
      cos(p.x * 17.0 - phase * 2.0)
    ) * energy * 0.034;
  } else {
    float twist = energy * (1.0 - smoothstep(0.05, 0.72, radius)) * 1.1;
    float a = angle + twist * sin(phase + radius * 9.0);
    displacement = vec2(cos(a), sin(a)) * radius - p;
  }
  return clamp(uv + displacement / vec2(aspect, 1.0), 0.0, 1.0);
}

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float radius = length(p);
  float energy = clamp(u_energy + u_bass * 0.16, 0.0, 1.0);
  vec2 warped = warpUv(v_uv, energy);
  vec2 channelShift = normalize(p + vec2(0.0001)) * u_chroma * energy * 0.009 / vec2(aspect, 1.0);
  vec4 centerSample = texture2D(u_subject, warped);
  float red = texture2D(u_subject, clamp(warped + channelShift, 0.0, 1.0)).r;
  float blue = texture2D(u_subject, clamp(warped - channelShift, 0.0, 1.0)).b;
  vec3 subjectColor = vec3(red, centerSample.g, blue);

  float phase = TAU * u_t;
  float ring = pow(max(0.0, 0.5 + 0.5 * sin(radius * (38.0 + u_treble * 18.0) - phase * 3.0)), 12.0);
  ring *= smoothstep(0.62, 0.08, radius) * (0.2 + energy * 0.8);
  float core = smoothstep(0.46 + energy * 0.08, 0.06, radius);
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 field = background + u_signal * (ring * 0.5 + core * energy * 0.1);
  subjectColor = mix(subjectColor, u_signal, ring * 0.22);
  vec3 color = mix(field, subjectColor, centerSample.a * (0.78 + energy * 0.22));
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => {
      const bands = ctx.audio?.bands ?? [];
      const rms = Math.min(1, Math.max(0, ctx.audio?.rms ?? 0));
      const bass = Math.min(1, Math.max(0, ((bands[0] ?? 0) + (bands[1] ?? 0) + (bands[2] ?? 0)) / 3));
      const mid = Math.min(1, Math.max(0, ((bands[3] ?? 0) + (bands[4] ?? 0) + (bands[5] ?? 0)) / 3));
      const treble = Math.min(1, Math.max(0, ((bands[6] ?? 0) + (bands[7] ?? 0)) / 2));
      const sensitivity = Math.min(2.5, Math.max(0.2, Number(ctx.params.sensitivity ?? 1.25)));
      const bassWeight = Math.min(1, Math.max(0, Number(ctx.params.bassWeight ?? 0.68)));
      const mode = String(ctx.params.warpMode ?? "radial");
      return {
        u_energy: Math.min(1, (rms * (1 - bassWeight) + bass * bassWeight) * sensitivity),
        u_bass: bass,
        u_mid: mid,
        u_treble: treble,
        u_mode: mode === "ribbon" ? 1 : mode === "twist" ? 2 : 0,
        u_chroma: Math.min(1, Math.max(0, Number(ctx.params.chroma ?? 0.42))),
        u_signal: colorToRgb(ctx.params.signal)
      };
    }
  }
};
var A09_amplitude_warp_effect_default = kernel;
`;export{e as default};
