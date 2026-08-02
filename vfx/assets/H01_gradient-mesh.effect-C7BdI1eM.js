function i(e){const s=String(e??"#5EE7F3").replace("#",""),o=/^[0-9a-f]{6}$/i.test(s)?s:"5EE7F3";return[0,2,4].map(a=>Number.parseInt(o.slice(a,a+2),16)/255)}const t={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_scale;
uniform float u_softness;
uniform float u_drift;
uniform float u_depth;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float blob(vec2 p, vec2 center, float radius, float softness) {
  float distanceToCenter = length((p - center) / vec2(1.0, 0.82));
  float inner = radius * (0.16 + 0.22 / softness);
  float outer = radius * (0.78 + 0.2 * softness);
  return 1.0 - smoothstep(inner, outer, distanceToCenter);
}

void main() {
  float phase = u_t * TAU * u_drift;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0) / u_scale;
  float seedPhase = u_seed * TAU;

  vec2 a = vec2(cos(phase + seedPhase), sin(phase + seedPhase * 0.7)) * vec2(0.36, 0.24);
  vec2 b = vec2(cos(-phase + 2.1 + seedPhase), sin(phase + 1.2)) * vec2(0.42, 0.3);
  vec2 c = vec2(cos(phase + 4.0), sin(-phase + 3.2 + seedPhase)) * vec2(0.31, 0.34);
  vec2 d = vec2(cos(-phase + 5.4), sin(-phase + 0.4)) * vec2(0.48, 0.22);

  float fieldA = blob(p, a, 0.52, u_softness);
  float fieldB = blob(p, b, 0.48, u_softness);
  float fieldC = blob(p, c, 0.44, u_softness);
  float fieldD = blob(p, d, 0.4, u_softness);
  float mesh = clamp(fieldA + fieldB * 0.82 + fieldC * 0.7 + fieldD * 0.58, 0.0, 1.45);
  float saddle = clamp(fieldA * fieldC + fieldB * fieldD, 0.0, 1.0);

  vec3 ink = vec3(0.05098, 0.05490, 0.06275);
  vec3 violet = mix(u_signal, vec3(0.34, 0.17, 0.5), 0.56);
  vec3 deep = mix(ink, violet, fieldB * 0.44 + fieldD * 0.34);
  vec3 field = mix(deep, u_signal, (fieldA * 0.36 + fieldC * 0.24) * u_depth);
  field += mix(violet, u_signal, 0.45) * saddle * u_depth * 0.16;
  field = mix(ink, field, 0.58 + mesh * 0.24);

  vec4 subject = texture2D(u_subject, v_uv);
  vec3 color = mix(field, subject.rgb, subject.a * 0.28);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`,uniforms:e=>({u_resolution:[e.width,e.height],u_frame:e.frame,u_t:e.t,u_fps:e.fps,u_seed:e.random("shader-seed"),u_scale:Math.min(2.2,Math.max(.7,Number(e.params.scale??1.25))),u_softness:Math.min(1.8,Math.max(.5,Number(e.params.softness??1.1))),u_drift:Math.min(3,Math.max(1,Math.round(Number(e.params.drift??1)))),u_depth:Math.min(.8,Math.max(.15,Number(e.params.depth??.48))),u_signal:i(e.params.signal)})}};export{t as default};
