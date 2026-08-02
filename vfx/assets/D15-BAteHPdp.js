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
var D15_heat_haze_effect_exports = {};
__export(D15_heat_haze_effect_exports, {
  default: () => D15_heat_haze_effect_default
});
module.exports = __toCommonJS(D15_heat_haze_effect_exports);
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
uniform float u_strength;
uniform float u_scale;
uniform float u_rise;
uniform float u_height;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  p += u_seed * 0.013;
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise2(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  vec2 eased = local * local * (3.0 - 2.0 * local);
  return mix(
    mix(hash(cell), hash(cell + vec2(1.0, 0.0)), eased.x),
    mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), eased.x),
    eased.y
  );
}

float heatField(vec2 p, vec2 orbit) {
  float broad = noise2(p + orbit * 0.82);
  float detail = noise2(p * 2.07 - orbit.yx * 1.23 + 4.6);
  return broad * 0.68 + detail * 0.32;
}

void main() {
  float phase = u_t * TAU * u_rise;
  vec2 orbit = vec2(sin(phase), cos(phase));
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = vec2(v_uv.x * aspect, v_uv.y) * u_scale;
  float field = heatField(p, orbit);
  float fieldX = heatField(p + vec2(0.07, 0.0), orbit);
  float fieldY = heatField(p + vec2(0.0, 0.07), orbit);
  vec2 gradient = vec2(fieldX - field, fieldY - field) / 0.07;

  float lowerAir = 1.0 - smoothstep(u_height, min(1.0, u_height + 0.18), v_uv.y);
  lowerAir *= smoothstep(0.0, 0.08, v_uv.y);
  float risingBands = sin(p.y * 2.7 - phase * 2.0 + field * 7.0);
  vec2 refraction = vec2(gradient.x + risingBands * 0.38, gradient.y * 0.18);
  refraction *= u_strength * lowerAir;

  vec2 sampleUv = clamp(v_uv + refraction, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);
  vec4 fringe = texture2D(u_subject, clamp(sampleUv + vec2(u_strength * 0.18, 0.0), 0.0, 1.0));
  float refractedEdge = clamp(abs(subject.a - fringe.a) + length(subject.rgb - fringe.rgb) * 0.32, 0.0, 1.0);
  float shimmer = pow(max(0.0, 0.5 + 0.5 * risingBands), 9.0) * lowerAir;

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 color = mix(background, subject.rgb, subject.a);
  color += u_signal * (refractedEdge * 0.34 + shimmer * 0.035);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_fps: ctx.fps,
      u_seed: ctx.random("shader-seed") * 1e3,
      u_strength: Math.min(0.06, Math.max(2e-3, Number(ctx.params.strength ?? 0.024))),
      u_scale: Math.min(14, Math.max(3, Number(ctx.params.scale ?? 7.5))),
      u_rise: Math.min(3, Math.max(1, Math.round(Number(ctx.params.rise ?? 2)))),
      u_height: Math.min(1, Math.max(0.25, Number(ctx.params.height ?? 0.72))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var D15_heat_haze_effect_default = kernel;
`;export{e as default};
