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
var Q01_metaball_merge_effect_exports = {};
__export(Q01_metaball_merge_effect_exports, {
  default: () => Q01_metaball_merge_effect_default
});
module.exports = __toCommonJS(Q01_metaball_merge_effect_exports);
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
uniform float u_ballCount;
uniform float u_radius;
uniform float u_softness;
uniform float u_refraction;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float loopPhase = TAU * u_t;
  float blobField = 0.0;
  vec2 fieldGradient = vec2(0.0);

  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    float active = 1.0 - step(u_ballCount - 0.5, fi);
    float lane = fi / 8.0 * TAU;
    float rate = 1.0 + mod(fi, 3.0);
    vec2 center = vec2(
      cos(loopPhase * rate + lane) * (0.22 + 0.075 * sin(lane * 3.0)),
      sin(loopPhase * (rate + 1.0) - lane * 1.7) * (0.19 + 0.06 * cos(lane * 2.0))
    );
    vec2 delta = p - center;
    float radius = u_radius * (0.78 + 0.24 * sin(lane * 2.0 + 0.8));
    float distanceSquared = max(dot(delta, delta), 0.0012);
    float influence = radius * radius / distanceSquared;
    blobField += influence * active;
    fieldGradient += (-2.0 * radius * radius * delta / (distanceSquared * distanceSquared)) * active;
  }

  float mask = smoothstep(1.0 - u_softness, 1.0 + u_softness, blobField);
  float edge = 1.0 - smoothstep(u_softness * 0.45, u_softness * 2.6, abs(blobField - 1.0));
  vec2 bend = normalize(fieldGradient + vec2(0.0001)) * u_refraction * mask;
  vec4 subject = texture2D(u_subject, clamp(uv + bend, 0.0, 1.0));

  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 liquid = mix(u_signal * 0.14, subject.rgb, subject.a);
  liquid += u_signal * (0.05 + edge * 0.72);
  vec3 color = mix(background, liquid, mask);
  color += u_signal * edge * (1.0 - mask) * 0.35;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => {
      const count = String(ctx.params.count ?? "6");
      return {
        u_ballCount: count === "4" ? 4 : count === "8" ? 8 : 6,
        u_radius: Math.min(0.28, Math.max(0.08, Number(ctx.params.radius ?? 0.16))),
        u_softness: Math.min(0.24, Math.max(0.02, Number(ctx.params.softness ?? 0.09))),
        u_refraction: Math.min(0.08, Math.max(0, Number(ctx.params.refraction ?? 0.024))),
        u_signal: colorToRgb(ctx.params.signal)
      };
    }
  }
};
var Q01_metaball_merge_effect_default = kernel;
`;export{e as default};
