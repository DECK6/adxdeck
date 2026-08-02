function i(e){const a=String(e??"#5EE7F3").replace("#",""),t=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(r=>Number.parseInt(t.slice(r,r+2),16)/255)}const o={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_strength;
uniform float u_scale;
uniform float u_rise;
uniform float u_height;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  p += u_seed * 0.013;
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise2(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  vec2 eased = local * local * (3.0 - 2.0 * local);
  return mix(
    mix(hash(cell), hash(cell + vec2(1.0, 0.0)), eased.x),
    mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), eased.x),
    eased.y
  );
}

float heatField(vec2 p, vec2 orbit) {
  float broad = noise2(p + orbit * 0.82);
  float detail = noise2(p * 2.07 - orbit.yx * 1.23 + 4.6);
  return broad * 0.68 + detail * 0.32;
}

void main() {
  float phase = u_t * TAU * u_rise;
  vec2 orbit = vec2(sin(phase), cos(phase));
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = vec2(v_uv.x * aspect, v_uv.y) * u_scale;
  float field = heatField(p, orbit);
  float fieldX = heatField(p + vec2(0.07, 0.0), orbit);
  float fieldY = heatField(p + vec2(0.0, 0.07), orbit);
  vec2 gradient = vec2(fieldX - field, fieldY - field) / 0.07;

  float lowerAir = 1.0 - smoothstep(u_height, min(1.0, u_height + 0.18), v_uv.y);
  lowerAir *= smoothstep(0.0, 0.08, v_uv.y);
  float risingBands = sin(p.y * 2.7 - phase * 2.0 + field * 7.0);
  vec2 refraction = vec2(gradient.x + risingBands * 0.38, gradient.y * 0.18);
  refraction *= u_strength * lowerAir;

  vec2 sampleUv = clamp(v_uv + refraction, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);
  vec4 fringe = texture2D(u_subject, clamp(sampleUv + vec2(u_strength * 0.18, 0.0), 0.0, 1.0));
  float refractedEdge = clamp(abs(subject.a - fringe.a) + length(subject.rgb - fringe.rgb) * 0.32, 0.0, 1.0);
  float shimmer = pow(max(0.0, 0.5 + 0.5 * risingBands), 9.0) * lowerAir;

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 color = mix(background, subject.rgb, subject.a);
  color += u_signal * (refractedEdge * 0.34 + shimmer * 0.035);
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_fps:e.fps,u_seed:e.random("shader-seed")*1e3,u_strength:Math.min(.06,Math.max(.002,Number(e.params.strength??.024))),u_scale:Math.min(14,Math.max(3,Number(e.params.scale??7.5))),u_rise:Math.min(3,Math.max(1,Math.round(Number(e.params.rise??2)))),u_height:Math.min(1,Math.max(.25,Number(e.params.height??.72))),u_signal:i(e.params.signal)})}};export{o as default};
