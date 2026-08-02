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
var Y05_cel_shade_effect_exports = {};
__export(Y05_cel_shade_effect_exports, {
  default: () => Y05_cel_shade_effect_default
});
module.exports = __toCommonJS(Y05_cel_shade_effect_exports);
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
uniform float u_levels;
uniform float u_outline;
uniform float u_saturation;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float sceneLuma(vec2 uv) {
  vec4 tap = texture2D(u_subject, clamp(uv, 0.0, 1.0));
  return dot(tap.rgb, vec3(0.2126, 0.7152, 0.0722)) * tap.a;
}

void main() {
  vec2 texel = u_outline / max(u_resolution, vec2(1.0));
  float tl = sceneLuma(v_uv + texel * vec2(-1.0, 1.0));
  float tc = sceneLuma(v_uv + texel * vec2(0.0, 1.0));
  float tr = sceneLuma(v_uv + texel * vec2(1.0, 1.0));
  float ml = sceneLuma(v_uv + texel * vec2(-1.0, 0.0));
  float mr = sceneLuma(v_uv + texel * vec2(1.0, 0.0));
  float bl = sceneLuma(v_uv + texel * vec2(-1.0, -1.0));
  float bc = sceneLuma(v_uv + texel * vec2(0.0, -1.0));
  float br = sceneLuma(v_uv + texel * vec2(1.0, -1.0));
  vec2 gradient = vec2(
    -tl - 2.0 * ml - bl + tr + 2.0 * mr + br,
    -bl - 2.0 * bc - br + tl + 2.0 * tc + tr
  );
  vec4 subject = texture2D(u_subject, v_uv);
  float alphaEdge = 0.0;
  alphaEdge = max(alphaEdge, abs(subject.a - texture2D(u_subject, v_uv + vec2(texel.x, 0.0)).a));
  alphaEdge = max(alphaEdge, abs(subject.a - texture2D(u_subject, v_uv - vec2(texel.x, 0.0)).a));
  alphaEdge = max(alphaEdge, abs(subject.a - texture2D(u_subject, v_uv + vec2(0.0, texel.y)).a));
  alphaEdge = max(alphaEdge, abs(subject.a - texture2D(u_subject, v_uv - vec2(0.0, texel.y)).a));
  float inkLine = smoothstep(0.045, 0.24, length(gradient) + alphaEdge * 1.8);

  float phase = u_t * TAU;
  vec2 lightDirection = vec2(cos(phase), sin(phase));
  float sourceLuma = dot(subject.rgb, vec3(0.2126, 0.7152, 0.0722));
  float directionalLight = dot(v_uv - 0.5, lightDirection) * 0.18;
  float tone = clamp(sourceLuma + directionalLight, 0.0, 1.0);
  float steps = max(1.0, u_levels - 1.0);
  float band = floor(tone * steps + 0.5) / steps;
  vec3 saturated = mix(vec3(sourceLuma), subject.rgb, u_saturation);
  vec3 celColor = saturated * (0.34 + band * 0.72);
  celColor = mix(celColor, u_signal * (0.18 + band * 0.64), 0.14);

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  float halo = (1.0 - smoothstep(0.18, 0.72, length(v_uv - 0.5))) * 0.018;
  vec3 field = background + u_signal * halo;
  vec3 color = mix(field, celColor, subject.a);
  vec3 ink = background * 0.22 + u_signal * 0.025;
  color = mix(color, ink, inkLine);
  float rim = alphaEdge * max(0.0, dot(normalize(gradient + vec2(0.001)), lightDirection));
  color += u_signal * rim * 0.22;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_levels: Math.min(6, Math.max(2, Math.round(Number(ctx.params.levels ?? 4)))),
      u_outline: Math.min(3, Math.max(0.5, Number(ctx.params.outline ?? 1.6))),
      u_saturation: Math.min(1.8, Math.max(0.5, Number(ctx.params.saturation ?? 1.2))),
      u_signal: colorToRgb(ctx.params.signal),
      u_fps: ctx.fps,
      u_seed: ctx.random("shader-seed")
    })
  }
};
var Y05_cel_shade_effect_default = kernel;
`;export{e as default};
