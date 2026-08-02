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
var N17_fog_roll_effect_exports = {};
__export(N17_fog_roll_effect_exports, {
  default: () => N17_fog_roll_effect_default
});
module.exports = __toCommonJS(N17_fog_roll_effect_exports);
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
uniform float u_density;
uniform float u_layers;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = noise2(p) * 0.55;
  value += noise2(p * 2.03 + 7.1) * 0.27;
  value += noise2(p * 4.07 - 3.4) * 0.12;
  value += noise2(p * 8.11 + 11.8) * 0.06;
  return value;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y);
  float phase = TAU * u_t * u_speed;
  vec2 orbit = vec2(cos(phase), sin(phase));
  float fog = 0.0;
  float wisps = 0.0;

  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float enabled = 1.0 - step(u_layers, fi + 0.5);
    float altitude = 0.14 + fi * 0.105;
    float lowMask = 1.0 - smoothstep(altitude, altitude + 0.23, uv.y);
    vec2 domain = vec2(p.x * (2.2 + fi * 0.31), p.y * (5.2 - fi * 0.38));
    vec2 loopOffset = orbit * vec2(1.15 + fi * 0.19, 0.34 + fi * 0.08);
    float body = fbm(domain + loopOffset + vec2(fi * 7.3, fi * 2.1));
    float ribbon = 0.5 + 0.5 * sin(p.x * (5.0 + fi) - phase * (1.0 + fi * 0.22) + body * 4.2 + fi);
    float layer = smoothstep(0.38, 0.82, body * 0.78 + ribbon * 0.22);
    fog += layer * lowMask * enabled * (0.34 + fi * 0.08);
    wisps += ribbon * layer * lowMask * enabled;
  }

  fog = clamp(fog * u_density, 0.0, 1.0);
  wisps = clamp(wisps / max(u_layers, 1.0), 0.0, 1.0);
  vec2 refractUv = clamp(uv + vec2((wisps - 0.5) * fog * 0.012, fog * 0.004), 0.0, 1.0);
  vec4 subject = texture2D(u_subject, refractUv);
  vec3 ink = vec3(0.051, 0.055, 0.063);
  vec3 base = mix(ink, subject.rgb, subject.a * (0.9 - fog * 0.48));
  vec3 mist = mix(ink + u_signal * 0.08, vec3(0.55) + u_signal * 0.18, 0.18 + wisps * 0.32);
  vec3 color = mix(base, mist, fog * 0.82);
  color += u_signal * wisps * fog * 0.07;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_density: Math.min(1, Math.max(0.25, Number(ctx.params.density ?? 0.72))),
      u_layers: Math.min(5, Math.max(2, Math.round(Number(ctx.params.layers ?? 4)))),
      u_speed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1)))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var N17_fog_roll_effect_default = kernel;
`;export{e as default};
