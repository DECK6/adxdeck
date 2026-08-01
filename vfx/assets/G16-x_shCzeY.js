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
var G16_chromatic_shear_effect_exports = {};
__export(G16_chromatic_shear_effect_exports, {
  default: () => G16_chromatic_shear_effect_default
});
module.exports = __toCommonJS(G16_chromatic_shear_effect_exports);
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
uniform float u_amount;
uniform float u_angle;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

vec2 shearUv(vec2 uv, float angle, float strength) {
  vec2 axis = vec2(cos(angle), sin(angle));
  vec2 normal = vec2(-axis.y, axis.x);
  vec2 centered = uv - 0.5;
  return uv + axis * dot(centered, normal) * strength;
}

void main() {
  float phase = u_t * TAU * u_speed;
  float breathe = 0.7 + 0.3 * cos(phase);
  float baseAngle = u_angle;
  vec2 redUv = clamp(shearUv(v_uv, baseAngle + 0.42, u_amount * breathe), 0.0, 1.0);
  vec2 greenUv = clamp(shearUv(v_uv, baseAngle - 0.18, -u_amount * 0.54 * breathe), 0.0, 1.0);
  vec2 blueUv = clamp(shearUv(v_uv, baseAngle - 0.68, u_amount * 0.82 * breathe), 0.0, 1.0);
  vec4 redTap = texture2D(u_subject, redUv);
  vec4 greenTap = texture2D(u_subject, greenUv);
  vec4 blueTap = texture2D(u_subject, blueUv);
  vec3 split = vec3(redTap.r, greenTap.g, blueTap.b);
  float alpha = max(redTap.a, max(greenTap.a, blueTap.a));

  vec4 center = texture2D(u_subject, v_uv);
  float fringe = clamp(abs(redTap.a - blueTap.a) + abs(redTap.r - blueTap.b) * 0.32, 0.0, 1.0);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 color = mix(background, split, alpha);
  color = mix(color, center.rgb, center.a * 0.18);
  color += u_signal * fringe * 0.16;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_amount: Math.min(0.18, Math.max(0, Number(ctx.params.amount ?? 0.075))),
      u_angle: Math.min(45, Math.max(-45, Number(ctx.params.angle ?? 18))) * (Math.PI / 180),
      u_speed: Math.min(3, Math.max(0.5, Number(ctx.params.speed ?? 1))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var G16_chromatic_shear_effect_default = kernel;
`;export{e as default};
