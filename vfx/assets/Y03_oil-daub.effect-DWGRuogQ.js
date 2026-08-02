function t(e){const a=String(e??"#5EE7F3").replace("#",""),o=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(i=>Number.parseInt(o.slice(i,i+2),16)/255)}const r={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_radius;
uniform float u_strokeScale;
uniform float u_impasto;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p + u_seed * 31.0, vec2(127.1, 311.7))) * 43758.5453);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), u.x), u.y);
}

void main() {
  float phase = u_t * TAU;
  vec2 pixel = v_uv * u_resolution;
  vec2 strokeCell = floor(pixel / max(u_radius * 1.7, 1.0)) + 0.5;
  vec2 loop = vec2(cos(phase), sin(phase));
  float flow = noise2(strokeCell / u_strokeScale + loop * 0.72);
  float angle = flow * TAU + sin(phase + flow * 5.0) * 0.22;
  vec2 direction = vec2(cos(angle), sin(angle));
  vec2 normal = vec2(-direction.y, direction.x);
  vec2 texel = 1.0 / max(u_resolution, vec2(1.0));

  vec4 paint = vec4(0.0);
  float weightSum = 0.0;
  for (int i = -4; i <= 4; i++) {
    float fi = float(i) / 4.0;
    float weight = 1.0 - abs(fi) * 0.52;
    vec2 offset = direction * fi * u_radius + normal * sin(fi * 9.0 + flow * TAU) * u_radius * 0.18;
    paint += texture2D(u_subject, clamp(v_uv + offset * texel, 0.0, 1.0)) * weight;
    weightSum += weight;
  }
  paint /= weightSum;

  vec4 ridgeA = texture2D(u_subject, clamp(v_uv + normal * texel * u_radius, 0.0, 1.0));
  vec4 ridgeB = texture2D(u_subject, clamp(v_uv - normal * texel * u_radius, 0.0, 1.0));
  float lumaA = dot(ridgeA.rgb, vec3(0.2126, 0.7152, 0.0722)) * ridgeA.a;
  float lumaB = dot(ridgeB.rgb, vec3(0.2126, 0.7152, 0.0722)) * ridgeB.a;
  float ridge = clamp((lumaA - lumaB) * 2.6 + (ridgeA.a - ridgeB.a), -1.0, 1.0);
  float bristle = 0.5 + 0.5 * sin(dot(pixel, normal) * 1.7 + flow * 19.0);
  bristle *= 0.72 + 0.28 * sin(dot(pixel, direction) * 0.23 - phase);

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  float paintLuma = dot(paint.rgb, vec3(0.2126, 0.7152, 0.0722));
  vec3 daub = mix(paint.rgb, u_signal * (0.22 + paintLuma * 0.54), 0.12);
  daub += u_signal * max(ridge, 0.0) * u_impasto * (0.2 + bristle * 0.28);
  daub *= 1.0 - max(-ridge, 0.0) * u_impasto * 0.36;
  vec3 color = mix(background, daub, paint.a);
  float strayStroke = pow(bristle, 7.0) * smoothstep(0.02, 0.38, paint.a) * (1.0 - smoothstep(0.38, 0.78, paint.a));
  color += u_signal * strayStroke * u_impasto * 0.08;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`,uniforms:e=>({u_radius:Math.min(10,Math.max(1,Number(e.params.radius??5.5))),u_strokeScale:Math.min(12,Math.max(2,Number(e.params.strokeScale??6))),u_impasto:Math.min(1.4,Math.max(0,Number(e.params.impasto??.82))),u_signal:t(e.params.signal),u_fps:e.fps,u_seed:e.random("shader-seed")})}};export{r as default};
