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
var Y04_pencil_sketch_effect_exports = {};
__export(Y04_pencil_sketch_effect_exports, {
  default: () => Y04_pencil_sketch_effect_default
});
module.exports = __toCommonJS(Y04_pencil_sketch_effect_exports);
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
uniform float u_spacing;
uniform float u_edgeStrength;
uniform float u_graphite;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p + u_seed * 13.0, vec2(91.7, 271.9))) * 43758.5453);
}

float sampleTone(vec2 uv) {
  vec4 tap = texture2D(u_subject, clamp(uv, 0.0, 1.0));
  return dot(tap.rgb, vec3(0.2126, 0.7152, 0.0722)) * tap.a;
}

float pencilLine(float coordinate, float spacing, float roughness) {
  float distanceToLine = abs(mod(coordinate + roughness, spacing) - spacing * 0.5);
  return 1.0 - smoothstep(0.58, 1.42, distanceToLine);
}

void main() {
  vec2 texel = 1.0 / max(u_resolution, vec2(1.0));
  float tl = sampleTone(v_uv + texel * vec2(-1.0, 1.0));
  float tc = sampleTone(v_uv + texel * vec2(0.0, 1.0));
  float tr = sampleTone(v_uv + texel * vec2(1.0, 1.0));
  float ml = sampleTone(v_uv + texel * vec2(-1.0, 0.0));
  float mr = sampleTone(v_uv + texel * vec2(1.0, 0.0));
  float bl = sampleTone(v_uv + texel * vec2(-1.0, -1.0));
  float bc = sampleTone(v_uv + texel * vec2(0.0, -1.0));
  float br = sampleTone(v_uv + texel * vec2(1.0, -1.0));
  vec2 gradient = vec2(
    -tl - 2.0 * ml - bl + tr + 2.0 * mr + br,
    -bl - 2.0 * bc - br + tl + 2.0 * tc + tr
  );
  float contour = smoothstep(0.035, 0.34, length(gradient) * u_edgeStrength);
  vec2 tangent = normalize(vec2(-gradient.y, gradient.x) + vec2(0.001, 0.0));
  vec2 pixel = v_uv * u_resolution;
  vec4 subject = texture2D(u_subject, v_uv);
  float luma = dot(subject.rgb, vec3(0.2126, 0.7152, 0.0722));
  float darkness = (1.0 - luma) * subject.a;
  float phase = u_t * TAU;
  float rough = (hash(floor(pixel * 0.25)) - 0.5) * 2.4 + sin(phase) * 0.45;
  float alongContour = pencilLine(dot(pixel, tangent), u_spacing, rough);
  vec2 diagonal = normalize(vec2(0.82, 0.57));
  float diagonalHatch = pencilLine(dot(pixel, diagonal), u_spacing * 0.82, -rough * 0.7);
  float crossHatch = pencilLine(dot(pixel, vec2(-diagonal.y, diagonal.x)), u_spacing * 0.68, rough);
  float hatch = alongContour * smoothstep(0.12, 0.5, darkness);
  hatch = max(hatch, diagonalHatch * smoothstep(0.42, 0.76, darkness));
  hatch = max(hatch, crossHatch * smoothstep(0.72, 0.96, darkness));

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  float paperGrain = hash(pixel * 0.73) * 0.018;
  vec3 paper = background + u_signal * (0.025 + paperGrain);
  vec3 graphite = mix(vec3(0.012, 0.015, 0.018), u_signal * 0.16, 0.34 + luma * 0.18);
  float ink = clamp(max(contour, hatch * u_graphite), 0.0, 1.0) * max(subject.a, contour);
  vec3 wash = mix(paper, u_signal * (0.09 + luma * 0.24), subject.a * 0.42);
  vec3 color = mix(wash, graphite, ink);
  color += u_signal * contour * 0.055;
  float pencilSweep = exp(-abs(v_uv.y - (0.5 + sin(phase) * 0.38)) * 24.0);
  color += u_signal * pencilSweep * (0.025 + subject.a * 0.11);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_spacing: Math.min(16, Math.max(4, Number(ctx.params.spacing ?? 8))),
      u_edgeStrength: Math.min(3, Math.max(0.5, Number(ctx.params.edgeStrength ?? 1.7))),
      u_graphite: Math.min(1.2, Math.max(0.3, Number(ctx.params.graphite ?? 0.82))),
      u_signal: colorToRgb(ctx.params.signal),
      u_fps: ctx.fps,
      u_seed: ctx.random("shader-seed")
    })
  }
};
var Y04_pencil_sketch_effect_default = kernel;
`;export{e as default};
