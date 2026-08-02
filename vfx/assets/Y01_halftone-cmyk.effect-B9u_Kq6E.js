function t(a){const e=String(a??"#5EE7F3").replace("#",""),l=/^[0-9a-f]{6}$/i.test(e)?e:"5EE7F3";return[0,2,4].map(o=>Number.parseInt(l.slice(o,o+2),16)/255)}const c={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_cellSize;
uniform float u_separation;
uniform float u_contrast;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

mat2 rotate2d(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float plateDot(vec2 pixel, float angle, float coverage) {
  vec2 centered = pixel - u_resolution * 0.5;
  vec2 cellUv = fract(rotate2d(angle) * centered / u_cellSize) - 0.5;
  float radius = sqrt(clamp(coverage, 0.0, 1.0)) * 0.68;
  float aa = 1.35 / u_cellSize;
  return 1.0 - smoothstep(radius - aa, radius + aa, length(cellUv));
}

void main() {
  float phase = u_t * TAU;
  vec2 pixel = v_uv * u_resolution;
  vec2 wobble = vec2(cos(phase), sin(phase)) * u_separation;
  vec2 pixelUv = 1.0 / max(u_resolution, vec2(1.0));

  vec4 cTap = texture2D(u_subject, clamp(v_uv + wobble * pixelUv, 0.0, 1.0));
  vec4 mTap = texture2D(u_subject, clamp(v_uv + vec2(-wobble.y, wobble.x) * pixelUv, 0.0, 1.0));
  vec4 yTap = texture2D(u_subject, clamp(v_uv - wobble * pixelUv, 0.0, 1.0));
  vec4 kTap = texture2D(u_subject, v_uv);

  vec3 cmyC = vec3(1.0 - cTap.r, 1.0 - mTap.g, 1.0 - yTap.b);
  cmyC = clamp((cmyC - 0.5) * u_contrast + 0.5, 0.0, 1.0);
  float black = clamp(1.0 - dot(kTap.rgb, vec3(0.2126, 0.7152, 0.0722)), 0.0, 1.0);
  float cyanDot = plateDot(pixel + wobble, radians(15.0), cmyC.x * cTap.a);
  float magentaDot = plateDot(pixel - wobble.yx, radians(75.0), cmyC.y * mTap.a);
  float yellowDot = plateDot(pixel - wobble, radians(0.0), cmyC.z * yTap.a);
  float blackDot = plateDot(pixel + wobble.yx * 0.4, radians(45.0), black * kTap.a);

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 cyanInk = mix(vec3(0.02, 0.72, 0.82), u_signal, 0.62);
  vec3 magentaInk = vec3(0.96, 0.13, 0.52);
  vec3 yellowInk = vec3(1.0, 0.78, 0.08);
  vec3 color = background;
  color += cyanInk * cyanDot * 0.66;
  color += magentaInk * magentaDot * 0.56;
  color += yellowInk * yellowDot * 0.42;
  color = mix(color, background * 0.28, blackDot * 0.82);
  float rosette = cyanDot * magentaDot + magentaDot * yellowDot + yellowDot * cyanDot;
  color += u_signal * rosette * 0.08;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`,uniforms:a=>({u_cellSize:Math.min(18,Math.max(5,Number(a.params.cellSize??10))),u_separation:Math.min(8,Math.max(0,Number(a.params.separation??2.5))),u_contrast:Math.min(1.8,Math.max(.7,Number(a.params.contrast??1.2))),u_signal:t(a.params.signal),u_fps:a.fps,u_seed:a.random("shader-seed")})}};export{c as default};
