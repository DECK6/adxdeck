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
var F03_film_burn_effect_exports = {};
__export(F03_film_burn_effect_exports, {
  default: () => F03_film_burn_effect_default
});
module.exports = __toCommonJS(F03_film_burn_effect_exports);
function colorToRgb(value) {
  const hex = String(value ?? "#5EE7F3").replace("#", "");
  const valid = /^[0-9a-f]{6}$/i.test(hex) ? hex : "5EE7F3";
  return [0, 2, 4].map((offset) => Number.parseInt(valid.slice(offset, offset + 2), 16) / 255);
}
function directionValue(value) {
  if (value === "right") return 1;
  if (value === "center") return 2;
  return 0;
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
uniform float u_intensity;
uniform float u_turbulence;
uniform float u_softness;
uniform float u_direction;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash21(vec2 p) {
  return fract(sin(dot(p + u_seed, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 eased = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), eased.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), eased.x),
    eased.y
  );
}

float fbm(vec2 p) {
  float value = noise2(p) * 0.56;
  value += noise2(p * 2.03 + 7.1) * 0.27;
  value += noise2(p * 4.11 - 3.8) * 0.12;
  value += noise2(p * 8.17 + 1.4) * 0.05;
  return value;
}

void main() {
  float phase = u_t * TAU;
  float progress = 0.5 - 0.5 * cos(phase);
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = vec2(v_uv.x * aspect, v_uv.y);
  vec2 loopDrift = vec2(cos(phase), sin(phase)) * 0.31;
  float paper = fbm(p * u_turbulence + loopDrift);
  float fine = noise2(p * u_turbulence * 3.7 - loopDrift * 1.9);
  float distortion = (paper - 0.5) * 0.24 + (fine - 0.5) * 0.055;

  float coordinate = v_uv.x;
  float front = mix(-0.16, 1.16, progress);
  if (u_direction > 0.5 && u_direction < 1.5) coordinate = 1.0 - v_uv.x;
  if (u_direction > 1.5) {
    coordinate = length((v_uv - 0.5) * vec2(aspect, 1.0)) / max(0.5, aspect * 0.5);
    front = mix(-0.12, 1.36, progress);
  }

  float signedEdge = front - coordinate + distortion;
  float revealed = smoothstep(-u_softness, u_softness, signedEdge);
  float heat = exp(-abs(signedEdge) / max(0.008, u_softness * 1.55));
  float charLine = exp(-abs(signedEdge + u_softness * 1.3) / max(0.006, u_softness * 0.38));
  float perforation = step(0.82, noise2(vec2(floor(v_uv.y * 34.0), floor(v_uv.x * 25.0)) + u_seed));
  heat *= 0.76 + paper * 0.54 + perforation * 0.18;

  vec4 subject = texture2D(u_subject, v_uv);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 exposed = mix(background, subject.rgb, subject.a);
  vec3 color = mix(background, exposed, revealed);
  vec3 ember = mix(vec3(1.0, 0.075, 0.005), vec3(1.0, 0.72, 0.12), clamp(heat, 0.0, 1.0));
  color += ember * heat * u_intensity * 0.78;
  color += vec3(1.0) * pow(clamp(heat, 0.0, 1.0), 4.0) * u_intensity * 0.34;
  color += u_signal * charLine * 0.18;
  float vignette = smoothstep(0.92, 0.25, length((v_uv - 0.5) * vec2(aspect, 1.0)));
  color *= 0.78 + vignette * 0.22;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_resolution: [ctx.width, ctx.height],
      u_frame: ctx.frame,
      u_t: Math.min(1, Math.max(0, ctx.t)),
      u_fps: ctx.fps,
      u_seed: ctx.random("film-burn:seed") * 997,
      u_intensity: Math.min(1.4, Math.max(0.3, Number(ctx.params.intensity ?? 0.92))),
      u_turbulence: Math.min(6, Math.max(1, Number(ctx.params.turbulence ?? 3.4))),
      u_softness: Math.min(0.2, Math.max(0.02, Number(ctx.params.softness ?? 0.08))),
      u_direction: directionValue(ctx.params.direction),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var F03_film_burn_effect_default = kernel;
`;export{e as default};
