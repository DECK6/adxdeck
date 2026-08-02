function s(e){const o=String(e??"#5EE7F3").replace("#",""),t=/^[0-9a-f]{6}$/i.test(o)?o:"5EE7F3";return[0,2,4].map(a=>Number.parseInt(t.slice(a,a+2),16)/255)}const r={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_gain;
uniform float u_noise;
uniform float u_reticle;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash21(vec2 p) {
  return fract(sin(dot(p + u_seed, vec2(127.1, 311.7))) * 43758.5453123);
}

vec3 thermalPalette(float heat) {
  vec3 cold = vec3(0.015, 0.02, 0.09);
  vec3 violet = vec3(0.22, 0.015, 0.42);
  vec3 red = vec3(0.92, 0.045, 0.02);
  vec3 amber = vec3(1.0, 0.52, 0.015);
  vec3 whiteHot = vec3(1.0, 0.98, 0.76);
  vec3 color = mix(cold, violet, smoothstep(0.02, 0.28, heat));
  color = mix(color, red, smoothstep(0.24, 0.52, heat));
  color = mix(color, amber, smoothstep(0.48, 0.75, heat));
  return mix(color, whiteHot, smoothstep(0.72, 1.0, heat));
}

void main() {
  float phase = u_t * TAU;
  vec4 subject = texture2D(u_subject, v_uv);
  float luminance = dot(subject.rgb, vec3(0.299, 0.587, 0.114));
  float sensor = hash21(floor(v_uv * u_resolution * 0.52) + floor(mod(u_t, 1.0) * 30.0));
  float heat = clamp((luminance * 0.72 + subject.a * 0.44) * u_gain + (sensor - 0.5) * u_noise, 0.0, 1.0);
  heat += sin(phase + v_uv.y * 10.0) * 0.018 * subject.a;
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 color = mix(background, thermalPalette(clamp(heat, 0.0, 1.0)), smoothstep(0.01, 0.22, subject.a));

  vec2 pixel = 1.0 / max(u_resolution, vec2(1.0));
  float edge = abs(subject.a - texture2D(u_subject, v_uv + vec2(pixel.x * 2.0, 0.0)).a);
  edge += abs(subject.a - texture2D(u_subject, v_uv + vec2(0.0, pixel.y * 2.0)).a);
  color += u_signal * edge * 0.34;

  vec2 p = (v_uv - 0.5) * vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  float radius = length(p);
  float ring = 1.0 - smoothstep(0.002, 0.008, abs(radius - 0.235));
  float crossX = (1.0 - smoothstep(0.001, 0.004, abs(p.x))) * step(0.265, radius) * step(radius, 0.34);
  float crossY = (1.0 - smoothstep(0.001, 0.004, abs(p.y))) * step(0.265, radius) * step(radius, 0.34);
  float sweep = 1.0 - smoothstep(0.0, 0.008, abs(fract(v_uv.y - u_t) - 0.5));
  color += u_signal * (ring + crossX + crossY) * u_reticle * (0.45 + 0.12 * sin(phase));
  color += u_signal * sweep * 0.055;
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_gain:Math.min(2,Math.max(.6,Number(e.params.gain??1.35))),u_noise:Math.min(.18,Math.max(0,Number(e.params.noise??.055))),u_reticle:Math.min(1,Math.max(0,Number(e.params.reticle??.8))),u_signal:s(e.params.signal),u_fps:e.fps,u_seed:e.random("shader-seed")*4096})}};export{r as default};
