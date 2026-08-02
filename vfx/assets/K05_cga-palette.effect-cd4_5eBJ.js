function r(e){const a=String(e??"#5EE7F3").replace("#",""),c=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(o=>Number.parseInt(c.slice(o,o+2),16)/255)}const l={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_pixelWidth;
uniform float u_saturation;
uniform float u_scanline;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU;
  vec2 pixelShape = vec2(u_pixelWidth * 2.0, u_pixelWidth);
  vec2 grid = max(floor(u_resolution / pixelShape), vec2(1.0));
  float horizontalKick = floor(sin(phase) * 1.5 + 0.5);
  vec2 cell = floor(v_uv * grid + vec2(horizontalKick, 0.0));
  vec2 sampleUv = clamp((cell + 0.5 - vec2(horizontalKick, 0.0)) / grid, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 source = mix(background, subject.rgb, subject.a);
  float luminance = dot(source, vec3(0.2126, 0.7152, 0.0722));
  float cyanScore = source.g + source.b - source.r * 0.7;
  float magentaScore = source.r + source.b - source.g * 0.7;
  float checker = mod(cell.x + cell.y, 2.0);
  vec3 black = background;
  vec3 cyan = mix(vec3(0.20, 1.0, 1.0), u_signal, 0.18);
  vec3 magenta = vec3(1.0, 0.20, 1.0);
  vec3 white = vec3(1.0);
  vec3 chroma = cyanScore > magentaScore ? cyan : magenta;
  chroma = mix(vec3(luminance), chroma, u_saturation);
  vec3 color;
  if (luminance < 0.18) color = black;
  else if (luminance < 0.48) color = checker < luminance * 2.0 ? chroma : black;
  else if (luminance < 0.82) color = checker < (luminance - 0.48) * 2.9 ? white : chroma;
  else color = white;

  float darkRow = step(0.5, mod(cell.y, 2.0));
  color *= 1.0 - darkRow * u_scanline;
  float phosphorEdge = step(0.94, fract(v_uv.x * grid.x));
  color += u_signal * phosphorEdge * subject.a * 0.06;
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_pixelWidth:Math.min(10,Math.max(2,Math.round(Number(e.params.pixelWidth??5)))),u_saturation:Math.min(1.5,Math.max(.5,Number(e.params.saturation??1.1))),u_scanline:Math.min(.7,Math.max(0,Number(e.params.scanline??.35))),u_signal:r(e.params.signal),u_fps:e.fps,u_seed:e.random("shader-seed")*4096})}};export{l as default};
