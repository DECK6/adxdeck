function u(e){const t=String(e??"#5EE7F3").replace("#",""),a=/^[0-9a-f]{6}$/i.test(t)?t:"5EE7F3";return[0,2,4].map(o=>Number.parseInt(a.slice(o,o+2),16)/255)}const n={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_dotSize;
uniform float u_contrast;
uniform float u_ghost;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

vec3 dmgPalette(float tone) {
  if (tone < 0.25) return vec3(0.059, 0.220, 0.059);
  if (tone < 0.50) return vec3(0.188, 0.384, 0.188);
  if (tone < 0.75) return vec3(0.545, 0.675, 0.059);
  return vec3(0.608, 0.737, 0.059);
}

void main() {
  float phase = u_t * TAU;
  vec2 grid = max(floor(u_resolution / u_dotSize), vec2(1.0));
  vec2 cell = floor(v_uv * grid);
  vec2 sampleUv = clamp((cell + 0.5) / grid, 0.0, 1.0);
  vec2 ghostOffset = vec2(sin(phase), cos(phase)) * u_ghost * u_dotSize / max(u_resolution, vec2(1.0));
  vec4 subject = texture2D(u_subject, sampleUv);
  vec4 ghostSample = texture2D(u_subject, clamp(sampleUv - ghostOffset, 0.0, 1.0));
  float luminance = dot(subject.rgb, vec3(0.2126, 0.7152, 0.0722)) * subject.a;
  float ghostLuminance = dot(ghostSample.rgb, vec3(0.2126, 0.7152, 0.0722)) * ghostSample.a;
  luminance = mix(luminance, max(luminance, ghostLuminance * 0.78), u_ghost);
  luminance = clamp((luminance - 0.5) * u_contrast + 0.5, 0.0, 0.999);
  float tone = floor(luminance * 4.0) / 4.0;

  vec2 local = fract(v_uv * grid) - 0.5;
  float roundPixel = 1.0 - smoothstep(0.50, 0.67, length(local));
  vec3 darkest = vec3(0.059, 0.220, 0.059);
  vec3 color = mix(darkest * 0.72, dmgPalette(tone), roundPixel);
  float scan = 1.0 - smoothstep(0.0, 0.065, abs(fract(v_uv.y - u_t) - 0.5));
  color += u_signal * scan * (0.035 + subject.a * 0.12);
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_dotSize:Math.min(7,Math.max(2,Math.round(Number(e.params.dotSize??4)))),u_contrast:Math.min(1.8,Math.max(.7,Number(e.params.contrast??1.25))),u_ghost:Math.min(.8,Math.max(0,Number(e.params.ghost??.32))),u_signal:u(e.params.signal),u_fps:e.fps,u_seed:e.random("shader-seed")*4096})}};export{n as default};
