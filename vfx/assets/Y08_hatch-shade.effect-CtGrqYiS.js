function i(a){const e=String(a??"#5EE7F3").replace("#",""),s=/^[0-9a-f]{6}$/i.test(e)?e:"5EE7F3";return[0,2,4].map(t=>Number.parseInt(s.slice(t,t+2),16)/255)}const o={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_spacing;
uniform float u_lineWidth;
uniform float u_contrast;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hatch(float coordinate, float spacing, float width) {
  float distanceToLine = abs(mod(coordinate + spacing * 0.5, spacing) - spacing * 0.5);
  return 1.0 - smoothstep(width, width + 1.0, distanceToLine);
}

void main() {
  vec4 subject = texture2D(u_subject, v_uv);
  float luma = dot(subject.rgb, vec3(0.2126, 0.7152, 0.0722));
  luma = clamp((luma - 0.5) * u_contrast + 0.5, 0.0, 1.0);
  float darkness = 1.0 - luma;
  vec2 pixel = v_uv * u_resolution;

  float first = hatch(pixel.x * 0.72 + pixel.y, u_spacing, u_lineWidth);
  float second = hatch(pixel.x * 0.72 - pixel.y, u_spacing, u_lineWidth);
  float third = hatch(pixel.x * 1.45 + pixel.y * 0.18, u_spacing * 0.78, u_lineWidth * 0.8);
  float shade = first * step(0.28, darkness);
  shade = max(shade, second * step(0.56, darkness));
  shade = max(shade, third * step(0.78, darkness));
  shade *= subject.a;

  float phase = u_t * TAU;
  vec2 lightCenter = vec2(0.5 + cos(phase) * 0.26, 0.5 + sin(phase) * 0.18);
  float exposure = exp(-length((v_uv - lightCenter) * vec2(1.5, 1.0)) * 5.5);
  float subjectPaper = subject.a * (0.09 + luma * 0.16 + exposure * 0.08);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 field = background + u_signal * subjectPaper;
  vec3 hatchInk = mix(background * 0.34, u_signal * 0.16, exposure * 0.4);
  vec3 color = mix(field, hatchInk, shade * 0.96);
  color += u_signal * subject.a * step(0.56, darkness) * exposure * 0.12;
  float hatchSweep = exp(-abs(v_uv.x - lightCenter.x) * 22.0);
  color += u_signal * hatchSweep * (0.022 + subject.a * 0.1);
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:a=>({u_resolution:[a.width,a.height],u_frame:a.frame,u_t:a.t,u_fps:a.fps,u_seed:a.random("shader-seed"),u_spacing:Math.min(18,Math.max(5,Number(a.params.spacing??9))),u_lineWidth:Math.min(2.8,Math.max(.6,Number(a.params.lineWidth??1.2))),u_contrast:Math.min(2.2,Math.max(.7,Number(a.params.contrast??1.35))),u_signal:i(a.params.signal)})}};export{o as default};
