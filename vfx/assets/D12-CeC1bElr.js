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
var D12_kaleidoscope_effect_exports = {};
__export(D12_kaleidoscope_effect_exports, {
  default: () => D12_kaleidoscope_effect_default
});
module.exports = __toCommonJS(D12_kaleidoscope_effect_exports);
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
uniform float u_segments;
uniform float u_zoom;
uniform float u_speed;
uniform vec3 u_signal;

const float PI = 3.14159265359;
const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU * u_speed;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float radius = length(p);
  float slice = TAU / u_segments;
  float angle = atan(p.y, p.x) + phase;
  float folded = abs(mod(angle + slice * 0.5, slice) - slice * 0.5);
  float breathingZoom = u_zoom * (0.92 + 0.08 * cos(phase));
  vec2 mirrored = vec2(cos(folded), sin(folded)) * radius / breathingZoom;
  float orbit = phase * 0.5;
  vec2 samplePoint = mirrored;
  samplePoint += vec2(cos(orbit), sin(orbit)) * 0.055;
  vec2 sampleUv = clamp(samplePoint / vec2(aspect, 1.0) + 0.5, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);

  float spokeDistance = min(folded, slice - folded) * max(radius, 0.08);
  float seam = 1.0 - smoothstep(0.002, 0.012, spokeDistance);
  float rings = 0.5 + 0.5 * sin(radius * 42.0 - phase * 3.0);
  float sweep = 0.5 + 0.5 * sin(folded * u_segments * 3.0 + radius * 24.0 + phase * 2.0);
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 field = background + u_signal * (rings * 0.055 + sweep * 0.035 + seam * 0.16);
  vec3 color = mix(field, subject.rgb, subject.a);

  vec2 edgeOffset = vec2(cos(folded), sin(folded)) / max(u_resolution, vec2(1.0)) * 3.0;
  vec4 edgeSample = texture2D(u_subject, clamp(sampleUv + edgeOffset, 0.0, 1.0));
  float edge = clamp(abs(subject.a - edgeSample.a) + length(subject.rgb - edgeSample.rgb) * 0.3, 0.0, 1.0);
  color += u_signal * edge * 0.48;
  float vignette = smoothstep(0.82, 0.25, radius);
  color = mix(background, color, 0.76 + vignette * 0.24);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_segments: Math.min(16, Math.max(4, Math.round(Number(ctx.params.segments ?? 8)))),
      u_zoom: Math.min(1.5, Math.max(0.65, Number(ctx.params.zoom ?? 1.05))),
      u_speed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1)))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var D12_kaleidoscope_effect_default = kernel;
`;export{e as default};
