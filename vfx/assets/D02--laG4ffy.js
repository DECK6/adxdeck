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
var D02_ripple_circle_effect_exports = {};
__export(D02_ripple_circle_effect_exports, {
  default: () => D02_ripple_circle_effect_default
});
module.exports = __toCommonJS(D02_ripple_circle_effect_exports);
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
uniform float u_strength;
uniform float u_frequency;
uniform float u_radius;
uniform vec3 u_signal;

void main() {
  const float TAU = 6.28318530718;
  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  vec2 centered = (v_uv - 0.5) * aspect;
  float distanceFromCenter = length(centered);
  vec2 direction = centered / max(distanceFromCenter, 0.0001);
  float reach = 1.0 - smoothstep(u_radius * 0.72, u_radius, distanceFromCenter);
  float originFade = smoothstep(0.015, 0.08, distanceFromCenter);
  float phase = distanceFromCenter * u_frequency * TAU - u_t * TAU * 3.0;
  float ripple = sin(phase);
  vec2 displacement = direction * ripple * u_strength * reach * originFade;
  displacement /= aspect;

  vec2 sampleUv = clamp(v_uv + displacement, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);
  vec4 edgeSample = texture2D(u_subject, clamp(sampleUv + direction / aspect * 0.004, 0.0, 1.0));
  float subjectEdge = abs(subject.a - edgeSample.a) + length(subject.rgb - edgeSample.rgb) * 0.35;
  float crest = pow(max(0.0, 0.5 + 0.5 * ripple), 10.0) * reach;
  float highlight = clamp(crest * 0.13 + subjectEdge * 1.5, 0.0, 1.0);

  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 color = mix(background, subject.rgb, subject.a);
  color = mix(color, u_signal, highlight * (0.2 + subject.a * 0.45));
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_strength: Math.min(0.12, Math.max(0, Number(ctx.params.strength ?? 0.045))),
      u_frequency: Math.min(16, Math.max(3, Number(ctx.params.frequency ?? 9))),
      u_radius: Math.min(1.2, Math.max(0.25, Number(ctx.params.radius ?? 0.82))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var D02_ripple_circle_effect_default = kernel;
`;export{e as default};
