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
var C08_tilt_shift_effect_exports = {};
__export(C08_tilt_shift_effect_exports, {
  default: () => C08_tilt_shift_effect_default
});
module.exports = __toCommonJS(C08_tilt_shift_effect_exports);
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
uniform float u_focus;
uniform float u_bandWidth;
uniform float u_blur;
uniform float u_angle;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU;
  float cs = cos(u_angle);
  float sn = sin(u_angle);
  vec2 axis = vec2(-sn, cs);
  float movingFocus = u_focus + sin(phase) * 0.17;
  float bandDistance = abs(dot(v_uv - vec2(0.5, movingFocus), axis));
  float blurAmount = smoothstep(u_bandWidth * 0.42, u_bandWidth, bandDistance);
  float radius = u_blur * blurAmount * (0.82 + 0.18 * cos(phase * 2.0));
  vec2 aspectFix = vec2(u_resolution.y / max(u_resolution.x, 1.0), 1.0);

  vec4 sum = texture2D(u_subject, v_uv) * 0.2;
  sum += texture2D(u_subject, clamp(v_uv + vec2(1.0, 0.0) * aspectFix * radius, 0.0, 1.0)) * 0.1;
  sum += texture2D(u_subject, clamp(v_uv + vec2(-1.0, 0.0) * aspectFix * radius, 0.0, 1.0)) * 0.1;
  sum += texture2D(u_subject, clamp(v_uv + vec2(0.0, 1.0) * aspectFix * radius, 0.0, 1.0)) * 0.1;
  sum += texture2D(u_subject, clamp(v_uv + vec2(0.0, -1.0) * aspectFix * radius, 0.0, 1.0)) * 0.1;
  sum += texture2D(u_subject, clamp(v_uv + vec2(0.707, 0.707) * aspectFix * radius, 0.0, 1.0)) * 0.1;
  sum += texture2D(u_subject, clamp(v_uv + vec2(-0.707, 0.707) * aspectFix * radius, 0.0, 1.0)) * 0.1;
  sum += texture2D(u_subject, clamp(v_uv + vec2(0.707, -0.707) * aspectFix * radius, 0.0, 1.0)) * 0.1;
  sum += texture2D(u_subject, clamp(v_uv + vec2(-0.707, -0.707) * aspectFix * radius, 0.0, 1.0)) * 0.1;

  vec3 background = vec3(0.051, 0.055, 0.063);
  float focusGlow = exp(-bandDistance * bandDistance / max(0.002, u_bandWidth * u_bandWidth * 0.18));
  float travelingGrain = 0.5 + 0.5 * sin(dot(v_uv, vec2(31.0, 17.0)) + phase * 2.0);
  vec3 base = background + u_signal * focusGlow * (0.018 + travelingGrain * 0.016);
  vec3 subjectColor = mix(base, sum.rgb, sum.a);
  subjectColor = mix(subjectColor, subjectColor * subjectColor * (3.0 - 2.0 * subjectColor), 0.32);
  subjectColor += u_signal * focusGlow * sum.a * 0.035;
  gl_FragColor = vec4(subjectColor, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_focus: Math.min(0.8, Math.max(0.2, Number(ctx.params.focus ?? 0.5))),
      u_bandWidth: Math.min(0.42, Math.max(0.08, Number(ctx.params.bandWidth ?? 0.2))),
      u_blur: Math.min(0.035, Math.max(4e-3, Number(ctx.params.blur ?? 0.022))),
      u_angle: Math.min(35, Math.max(-35, Number(ctx.params.angle ?? -8))) * (Math.PI / 180),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var C08_tilt_shift_effect_default = kernel;
`;export{e as default};
