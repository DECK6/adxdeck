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
var F09_whip_pan_effect_exports = {};
__export(F09_whip_pan_effect_exports, {
  default: () => F09_whip_pan_effect_default
});
module.exports = __toCommonJS(F09_whip_pan_effect_exports);
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
uniform float u_direction;
uniform float u_strength;
uniform float u_shutter;
uniform float u_chroma;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU;
  float velocity = sin(phase);
  float speed = pow(abs(velocity), u_shutter);
  float travel = (0.5 - 0.5 * cos(phase)) * u_strength * u_direction;
  float rolling = sin(v_uv.y * 25.0 + phase * 2.0 + u_seed) * speed * u_strength * 0.045;
  vec2 centerUv = v_uv + vec2(travel + rolling * u_direction, 0.0);
  vec2 blurVector = vec2(velocity * speed * u_strength * u_direction, 0.0);

  vec4 sum = vec4(0.0);
  sum += texture2D(u_subject, clamp(centerUv - blurVector * 0.50, 0.0, 1.0)) * 0.045;
  sum += texture2D(u_subject, clamp(centerUv - blurVector * 0.40, 0.0, 1.0)) * 0.065;
  sum += texture2D(u_subject, clamp(centerUv - blurVector * 0.30, 0.0, 1.0)) * 0.085;
  sum += texture2D(u_subject, clamp(centerUv - blurVector * 0.20, 0.0, 1.0)) * 0.105;
  sum += texture2D(u_subject, clamp(centerUv - blurVector * 0.10, 0.0, 1.0)) * 0.125;
  sum += texture2D(u_subject, clamp(centerUv, 0.0, 1.0)) * 0.15;
  sum += texture2D(u_subject, clamp(centerUv + blurVector * 0.10, 0.0, 1.0)) * 0.125;
  sum += texture2D(u_subject, clamp(centerUv + blurVector * 0.20, 0.0, 1.0)) * 0.105;
  sum += texture2D(u_subject, clamp(centerUv + blurVector * 0.30, 0.0, 1.0)) * 0.085;
  sum += texture2D(u_subject, clamp(centerUv + blurVector * 0.40, 0.0, 1.0)) * 0.065;
  sum += texture2D(u_subject, clamp(centerUv + blurVector * 0.50, 0.0, 1.0)) * 0.045;

  float channelOffset = speed * u_strength * u_chroma * 0.08;
  float red = texture2D(u_subject, clamp(centerUv + vec2(channelOffset * u_direction, 0.0), 0.0, 1.0)).r;
  float blue = texture2D(u_subject, clamp(centerUv - vec2(channelOffset * u_direction, 0.0), 0.0, 1.0)).b;
  vec3 smeared = mix(sum.rgb, vec3(red, sum.g, blue), speed * u_chroma * 0.5);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 color = mix(background, smeared, sum.a);
  float scan = pow(0.5 + 0.5 * sin(v_uv.y * 74.0 + phase * 3.0), 18.0) * speed;
  float edgeStreak = (1.0 - smoothstep(0.0, 0.26, abs(v_uv.x - 0.5))) * speed;
  color += u_signal * (scan * 0.045 + edgeStreak * 0.025);
  color *= 1.0 - speed * 0.08;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_direction: String(ctx.params.direction ?? "left") === "right" ? 1 : -1,
      u_strength: Math.min(0.28, Math.max(0.02, Number(ctx.params.strength ?? 0.16))),
      u_shutter: Math.min(2.5, Math.max(0.4, Number(ctx.params.shutter ?? 1.1))),
      u_chroma: Math.min(1, Math.max(0, Number(ctx.params.chroma ?? 0.38))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var F09_whip_pan_effect_default = kernel;
`;export{e as default};
