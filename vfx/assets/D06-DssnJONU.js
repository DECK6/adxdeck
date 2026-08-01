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
var D06_lens_barrel_effect_exports = {};
__export(D06_lens_barrel_effect_exports, {
  default: () => D06_lens_barrel_effect_default
});
module.exports = __toCommonJS(D06_lens_barrel_effect_exports);
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
uniform float u_curvature;
uniform float u_zoom;
uniform float u_aberration;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

vec2 barrelUv(vec2 uv, vec2 center, float aspect, float curvature, float zoom) {
  vec2 p = (uv - center) * vec2(aspect, 1.0) / zoom;
  float radius2 = dot(p, p);
  p *= 1.0 + curvature * radius2;
  return center + p / vec2(aspect, 1.0);
}

void main() {
  float phase = u_t * TAU * u_speed;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 center = vec2(0.5) + vec2(cos(phase), sin(phase)) * 0.024;
  float animatedCurvature = u_curvature * (0.72 + 0.28 * sin(phase - 0.7));
  float animatedZoom = u_zoom * (0.985 + 0.015 * cos(phase));
  vec2 sampleUv = barrelUv(v_uv, center, aspect, animatedCurvature, animatedZoom);
  vec2 fromCenter = sampleUv - center;
  float radialScale = u_aberration * (0.35 + dot(fromCenter, fromCenter) * 2.4);
  vec2 redUv = clamp(sampleUv + fromCenter * radialScale, 0.0, 1.0);
  vec2 blueUv = clamp(sampleUv - fromCenter * radialScale, 0.0, 1.0);
  vec4 middle = texture2D(u_subject, clamp(sampleUv, 0.0, 1.0));
  vec4 redSample = texture2D(u_subject, redUv);
  vec4 blueSample = texture2D(u_subject, blueUv);
  float alpha = max(middle.a, max(redSample.a, blueSample.a));
  vec3 refracted = vec3(redSample.r, middle.g, blueSample.b);

  vec2 q = (v_uv - center) * vec2(aspect, 1.0);
  float radius = length(q);
  float lensRim = 1.0 - smoothstep(0.0, 0.018, abs(radius - 0.52));
  float scan = pow(0.5 + 0.5 * sin(radius * 38.0 - phase * 2.0), 10.0);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 field = background + u_signal * (lensRim * 0.07 + scan * 0.018);
  vec3 color = mix(field, refracted, alpha);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_curvature: Math.min(0.85, Math.max(-0.65, Number(ctx.params.curvature ?? 0.48))),
      u_zoom: Math.min(1.15, Math.max(0.72, Number(ctx.params.zoom ?? 0.9))),
      u_aberration: Math.min(0.018, Math.max(0, Number(ctx.params.aberration ?? 6e-3))),
      u_speed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1)))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var D06_lens_barrel_effect_default = kernel;
`;export{e as default};
