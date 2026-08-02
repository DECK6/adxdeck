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
var I08_tunnel_fly_effect_exports = {};
__export(I08_tunnel_fly_effect_exports, {
  default: () => I08_tunnel_fly_effect_default
});
module.exports = __toCommonJS(I08_tunnel_fly_effect_exports);
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
uniform float u_t;
uniform float u_rings;
uniform float u_speed;
uniform float u_twist;
uniform float u_aperture;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 2.0;
  float radius = length(p);
  float angle = atan(p.y, p.x);
  float depth = 1.0 / max(radius, 0.035);
  float travel = u_t * u_speed;

  float ringCoordinate = depth * u_rings * 0.18 + travel;
  float ringDistance = abs(fract(ringCoordinate) - 0.5);
  float rings = smoothstep(0.44, 0.5, ringDistance);
  float ribs = pow(max(0.0, cos(angle * 10.0 + depth * u_twist + travel * TAU)), 18.0);
  float wall = smoothstep(u_aperture * 0.72, u_aperture * 1.35, radius);
  float depthFade = smoothstep(0.0, 0.85, radius);
  float pulse = 0.72 + 0.28 * sin(TAU * (u_t * u_speed - depth * 0.08));

  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 color = background + u_signal * wall * depthFade * (rings * 0.72 + ribs * 0.28) * pulse;
  color += u_signal * rings * ribs * 0.32;

  vec2 portalUv = (uv - 0.5) / max(u_aperture * 2.7, 0.001) + 0.5;
  vec4 subject = texture2D(u_subject, clamp(portalUv, 0.0, 1.0));
  float portal = 1.0 - smoothstep(u_aperture * 0.72, u_aperture, radius);
  color = mix(color, subject.rgb + u_signal * 0.035, portal * subject.a * 0.8);
  color += u_signal * exp(-abs(radius - u_aperture) * 90.0) * 0.32;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_rings: Math.min(10, Math.max(2, Number(ctx.params.rings ?? 5.5))),
      u_speed: Math.min(4, Math.max(1, Math.round(Number(ctx.params.speed ?? 2)))),
      u_twist: Math.min(5, Math.max(0, Number(ctx.params.twist ?? 2.2))),
      u_aperture: Math.min(0.3, Math.max(0.08, Number(ctx.params.aperture ?? 0.17))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var I08_tunnel_fly_effect_default = kernel;
`;export{e as default};
