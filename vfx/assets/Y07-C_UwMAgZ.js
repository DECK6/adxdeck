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
var Y07_ink_outline_effect_exports = {};
__export(Y07_ink_outline_effect_exports, {
  default: () => Y07_ink_outline_effect_default
});
module.exports = __toCommonJS(Y07_ink_outline_effect_exports);
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
uniform float u_edgeWidth;
uniform float u_ink;
uniform float u_toneScale;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float energy(vec4 sampleColor) {
  return max(sampleColor.a, dot(sampleColor.rgb, vec3(0.2126, 0.7152, 0.0722)) * sampleColor.a);
}

void main() {
  vec2 pixel = 1.0 / max(u_resolution, vec2(1.0));
  vec2 dx = vec2(pixel.x * u_edgeWidth, 0.0);
  vec2 dy = vec2(0.0, pixel.y * u_edgeWidth);
  vec4 subject = texture2D(u_subject, v_uv);
  float left = energy(texture2D(u_subject, clamp(v_uv - dx, 0.0, 1.0)));
  float right = energy(texture2D(u_subject, clamp(v_uv + dx, 0.0, 1.0)));
  float down = energy(texture2D(u_subject, clamp(v_uv - dy, 0.0, 1.0)));
  float up = energy(texture2D(u_subject, clamp(v_uv + dy, 0.0, 1.0)));
  float edge = smoothstep(0.035, 0.28, length(vec2(right - left, up - down)) * u_ink);

  vec2 toneCell = fract(v_uv * u_resolution / u_toneScale) - 0.5;
  float luma = dot(subject.rgb, vec3(0.2126, 0.7152, 0.0722));
  float dotRadius = mix(0.08, 0.36, clamp(1.0 - luma, 0.0, 1.0));
  float screenTone = 1.0 - smoothstep(dotRadius, dotRadius + 0.08, length(toneCell));
  screenTone *= subject.a * smoothstep(0.18, 0.72, 1.0 - luma);

  float phase = u_t * TAU;
  float pressSweep = 1.0 - smoothstep(0.0, 0.16, abs(v_uv.x - (0.5 + 0.46 * sin(phase))));
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 mutedSubject = mix(background, subject.rgb, subject.a * 0.48);
  vec3 paperInk = mix(mutedSubject, background * 0.42, screenTone * 0.78);
  vec3 color = mix(paperInk, mix(background * 0.2, u_signal * 0.18, 0.38), edge);
  color += u_signal * edge * (0.38 + pressSweep * 0.34);
  color += u_signal * screenTone * 0.08;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_resolution: [ctx.width, ctx.height],
      u_frame: ctx.frame,
      u_t: ctx.t,
      u_fps: ctx.fps,
      u_seed: ctx.random("shader-seed"),
      u_edgeWidth: Math.min(3.5, Math.max(0.5, Number(ctx.params.edgeWidth ?? 1.6))),
      u_ink: Math.min(1.4, Math.max(0.2, Number(ctx.params.ink ?? 0.9))),
      u_toneScale: Math.min(18, Math.max(5, Number(ctx.params.toneScale ?? 10))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var Y07_ink_outline_effect_default = kernel;
`;export{e as default};
