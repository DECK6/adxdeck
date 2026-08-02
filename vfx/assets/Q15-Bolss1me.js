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
var Q15_lava_flow_effect_exports = {};
__export(Q15_lava_flow_effect_exports, {
  default: () => Q15_lava_flow_effect_default
});
module.exports = __toCommonJS(Q15_lava_flow_effect_exports);
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
uniform float u_viscosity;
uniform float u_heat;
uniform float u_crust;
uniform float u_scale;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float value = noise2(p) * 0.54;
  p = p * 2.04 + 7.3;
  value += noise2(p) * 0.27;
  p = p * 2.08 + 13.1;
  value += noise2(p) * 0.13;
  p = p * 2.02 + 3.7;
  value += noise2(p) * 0.06;
  return value;
}

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  float phase = u_t * TAU;
  vec2 orbit = vec2(cos(phase), sin(phase));
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0) * u_scale;
  float slow = mix(1.35, 0.42, u_viscosity);
  vec2 flowPoint = p + vec2(
    sin(p.y * 0.72 + phase) * 0.34,
    cos(p.x * 0.48 - phase) * 0.12
  ) * slow;
  float broad = fbm(flowPoint * 0.62 + orbit * slow);
  float folded = fbm(flowPoint * 1.18 - orbit.yx * (0.55 + slow * 0.4) + broad * 1.7);
  float fine = fbm(flowPoint * 2.3 + orbit * 0.38 + folded * 2.1);
  float temperature = clamp((broad * 0.54 + folded * 0.34 + fine * 0.12) * u_heat, 0.0, 1.0);
  float cooling = smoothstep(0.34, 0.88, fine * 0.58 + broad * 0.42 + u_crust * 0.34);
  float crack = smoothstep(0.075, 0.0, abs(folded - broad * 0.86 - 0.08));
  float hotChannel = crack * (1.0 - cooling * 0.62) + pow(temperature, 3.2) * 0.42;

  float e = 0.012;
  vec2 slope = vec2(
    fbm((flowPoint + vec2(e, 0.0)) * 0.62 + orbit * slow) - broad,
    fbm((flowPoint + vec2(0.0, e)) * 0.62 + orbit * slow) - broad
  ) / e;
  vec2 displacement = slope * 0.006 * (1.0 - u_viscosity * 0.52) / vec2(aspect, 1.0);
  vec4 subject = texture2D(u_subject, clamp(v_uv + displacement, 0.0, 1.0));
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 cooled = mix(background * 0.72, u_signal * 0.12, broad * 0.35);
  vec3 molten = u_signal * (0.24 + temperature * 0.86 + hotChannel * 0.72);
  vec3 lava = mix(molten, cooled, cooling * u_crust);
  lava += u_signal * hotChannel * u_heat * 0.48;
  vec3 subjectColor = mix(subject.rgb, lava, 0.16 + hotChannel * 0.28);
  vec3 color = mix(lava, subjectColor, subject.a * (0.58 + cooling * 0.24));
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_viscosity: Math.min(1, Math.max(0.2, Number(ctx.params.viscosity ?? 0.76))),
      u_heat: Math.min(1.3, Math.max(0.35, Number(ctx.params.heat ?? 0.9))),
      u_crust: Math.min(0.9, Math.max(0.1, Number(ctx.params.crust ?? 0.56))),
      u_scale: Math.min(7, Math.max(2, Number(ctx.params.scale ?? 4.3))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var Q15_lava_flow_effect_default = kernel;
`;export{e as default};
