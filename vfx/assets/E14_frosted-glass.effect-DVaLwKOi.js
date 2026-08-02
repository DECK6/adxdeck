function u(e){const t=String(e??"#5EE7F3").replace("#",""),a=/^[0-9a-f]{6}$/i.test(t)?t:"5EE7F3";return[0,2,4].map(r=>Number.parseInt(a.slice(r,r+2),16)/255)}const o={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_frost;
uniform float u_diffusion;
uniform float u_wipe_width;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32 + u_seed);
  return fract(p.x * p.y);
}

void main() {
  vec2 pixel = 1.0 / max(u_resolution, vec2(1.0));
  vec2 p = v_uv - 0.5;
  float paneX = 1.0 - smoothstep(0.405, 0.42, abs(p.x));
  float paneY = 1.0 - smoothstep(0.365, 0.38, abs(p.y));
  float pane = paneX * paneY;
  vec4 clearSubject = texture2D(u_subject, v_uv);

  vec2 cells = floor(v_uv * u_resolution / 7.0);
  float grainBase = hash21(cells + floor(u_frame / max(u_fps * 6.0, 1.0)));
  float grain = clamp(grainBase + sin(u_t * TAU + grainBase * TAU) * 0.12, 0.0, 1.0);
  vec2 jitter = vec2(hash21(cells + 7.1), hash21(cells + 19.7)) - 0.5;
  vec2 radius = pixel * u_diffusion * (0.72 + grain * 0.62);
  vec2 drift = jitter * radius * 0.8;
  vec4 frosted = texture2D(u_subject, clamp(v_uv + drift, 0.0, 1.0)) * 0.22;
  frosted += texture2D(u_subject, clamp(v_uv + vec2(radius.x, 0.0), 0.0, 1.0)) * 0.13;
  frosted += texture2D(u_subject, clamp(v_uv - vec2(radius.x, 0.0), 0.0, 1.0)) * 0.13;
  frosted += texture2D(u_subject, clamp(v_uv + vec2(0.0, radius.y), 0.0, 1.0)) * 0.13;
  frosted += texture2D(u_subject, clamp(v_uv - vec2(0.0, radius.y), 0.0, 1.0)) * 0.13;
  frosted += texture2D(u_subject, clamp(v_uv + radius, 0.0, 1.0)) * 0.065;
  frosted += texture2D(u_subject, clamp(v_uv - radius, 0.0, 1.0)) * 0.065;
  frosted += texture2D(u_subject, clamp(v_uv + vec2(radius.x, -radius.y), 0.0, 1.0)) * 0.065;
  frosted += texture2D(u_subject, clamp(v_uv + vec2(-radius.x, radius.y), 0.0, 1.0)) * 0.065;

  float wipeCenter = 0.5 + 0.39 * sin(u_t * TAU - 1.57079632679);
  float wiped = 1.0 - smoothstep(u_wipe_width * 0.35, u_wipe_width, abs(v_uv.x - wipeCenter));
  float wetEdge = 1.0 - smoothstep(0.006, 0.026, abs(abs(v_uv.x - wipeCenter) - u_wipe_width));
  float frostMask = pane * u_frost * (1.0 - wiped * 0.92);

  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 clearColor = mix(background, clearSubject.rgb, clearSubject.a);
  vec3 frostColor = mix(background, frosted.rgb, min(1.0, frosted.a + 0.42));
  frostColor = mix(frostColor, vec3(0.72, 0.8, 0.82), 0.12 + grain * 0.09);
  vec3 color = mix(clearColor, frostColor, frostMask);

  float border = pane * (1.0 - (1.0 - smoothstep(0.39, 0.405, abs(p.x))) * (1.0 - smoothstep(0.35, 0.365, abs(p.y))));
  color += u_signal * (border * 0.3 + wetEdge * pane * 0.16);
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_seed:e.random("frost-seed")*97,u_frost:Math.min(1,Math.max(.2,Number(e.params.frost??.72))),u_diffusion:Math.min(12,Math.max(1,Number(e.params.diffusion??7))),u_wipe_width:Math.min(.3,Math.max(.06,Number(e.params.wipeWidth??.15))),u_signal:u(e.params.signal)})}};export{o as default};
