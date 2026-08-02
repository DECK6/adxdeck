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
var G18_wave_tear_effect_exports = {};
__export(G18_wave_tear_effect_exports, {
  default: () => G18_wave_tear_effect_default
});
module.exports = __toCommonJS(G18_wave_tear_effect_exports);
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
uniform float u_bands;
uniform float u_amplitude;
uniform float u_frequency;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash11(float value) {
  return fract(sin(value * 127.1 + u_seed) * 43758.5453123);
}

void main() {
  float phase = u_t * TAU;
  float scaledX = v_uv.x * u_bands;
  float bandId = floor(scaledX);
  float localX = fract(scaledX);
  float bandPhase = phase * (1.0 + hash11(bandId) * 2.0) + hash11(bandId + 19.0) * TAU;
  float envelope = smoothstep(0.02, 0.16, localX) * (1.0 - smoothstep(0.84, 0.98, localX));
  float slip = sin(v_uv.y * u_frequency * TAU + bandPhase);
  slip += sin(v_uv.y * u_frequency * 0.43 * TAU - bandPhase * 1.7) * 0.34;
  float direction = step(0.5, hash11(bandId + 7.0)) * 2.0 - 1.0;
  vec2 sampleUv = v_uv;
  sampleUv.y += slip * u_amplitude * envelope * direction;
  sampleUv.x += direction * u_amplitude * 0.16 * sin(bandPhase) * envelope;
  sampleUv = clamp(sampleUv, 0.0, 1.0);

  vec4 subject = texture2D(u_subject, sampleUv);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 color = mix(background, subject.rgb, subject.a);
  float seam = 1.0 - smoothstep(0.006, 0.035, min(localX, 1.0 - localX));
  float crest = pow(abs(slip) * 0.72, 5.0) * envelope;
  color += u_signal * seam * (0.1 + 0.14 * sin(bandPhase) * sin(bandPhase));
  color += u_signal * crest * subject.a * 0.17;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_bands: Math.min(12, Math.max(2, Math.round(Number(ctx.params.bands ?? 6)))),
      u_amplitude: Math.min(0.18, Math.max(0.01, Number(ctx.params.amplitude ?? 0.075))),
      u_frequency: Math.min(14, Math.max(2, Number(ctx.params.frequency ?? 7))),
      u_signal: colorToRgb(ctx.params.signal),
      u_fps: ctx.fps,
      u_seed: ctx.random("shader-seed") * 4096
    })
  }
};
var G18_wave_tear_effect_default = kernel;
`;export{e as default};
