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
var Q16_soap_film_effect_exports = {};
__export(Q16_soap_film_effect_exports, {
  default: () => Q16_soap_film_effect_default
});
module.exports = __toCommonJS(Q16_soap_film_effect_exports);
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
uniform float u_scale;
uniform float u_interference;
uniform float u_wobble;
uniform float u_refraction;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  float phase = TAU * u_t;
  vec2 centered = v_uv - 0.5;
  vec2 p = centered * vec2(aspect, 1.0);
  p += vec2(cos(phase), sin(phase)) * 0.018 * u_wobble;

  float angle = atan(p.y, p.x);
  float ripple = sin(angle * 3.0 + phase) * 0.018 + sin(angle * 5.0 - phase * 2.0) * 0.009;
  float radius = 0.405 * u_scale + ripple * u_wobble;
  float distanceToFilm = length(p) - radius;
  float mask = smoothstep(0.018, -0.018, distanceToFilm);
  float rim = smoothstep(0.025, 0.002, abs(distanceToFilm));

  float curvature = 1.0 - clamp(length(p) / max(radius, 0.001), 0.0, 1.0);
  float flow = sin(p.x * 14.0 + sin(p.y * 9.0 - phase) * 1.7 + phase);
  flow += cos(p.y * 17.0 - p.x * 5.0 + phase * 2.0) * 0.55;
  float thickness = curvature * 2.2 + flow * 0.24 * u_wobble;
  vec3 spectrum = 0.5 + 0.5 * cos(TAU * (thickness * u_interference + vec3(0.0, 0.33, 0.67)));
  spectrum = pow(spectrum, vec3(1.35));

  vec2 normal = length(p) > 0.001 ? normalize(p) / vec2(aspect, 1.0) : vec2(0.0);
  float lens = (0.25 + curvature * 0.75) * mask;
  vec2 sampleUv = clamp(v_uv - normal * u_refraction * lens + vec2(flow, -flow) * 0.0018, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);

  float highlight = pow(max(0.0, dot(normalize(vec3(p, 0.38)), normalize(vec3(-0.48, -0.62, 0.88)))), 18.0);
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 film = mix(u_signal * 0.12, spectrum, 0.82);
  film += vec3(1.0) * highlight * 0.72 + u_signal * rim * 0.64;
  vec3 behind = mix(background, subject.rgb, subject.a * 0.76);
  vec3 color = mix(behind, mix(subject.rgb, film, 0.48 + rim * 0.28), mask * (0.62 + subject.a * 0.18));
  color += u_signal * rim * 0.22;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_scale: Math.min(1.35, Math.max(0.7, Number(ctx.params.scale ?? 1))),
      u_interference: Math.min(2, Math.max(0.3, Number(ctx.params.interference ?? 1.15))),
      u_wobble: Math.min(1, Math.max(0, Number(ctx.params.wobble ?? 0.58))),
      u_refraction: Math.min(0.08, Math.max(0, Number(ctx.params.refraction ?? 0.026))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var Q16_soap_film_effect_default = kernel;
`;export{e as default};
