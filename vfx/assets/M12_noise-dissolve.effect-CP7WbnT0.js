function i(e){const a=String(e??"#5EE7F3").replace("#",""),o=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(s=>Number.parseInt(o.slice(s,s+2),16)/255)}const l={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_frame;
uniform float u_t;
uniform float u_scale;
uniform float u_edgeWidth;
uniform float u_grain;
uniform float u_mode;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 fade = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), fade.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), fade.x),
    fade.y
  );
}

float fbm(vec2 p) {
  float sum = valueNoise(p) * 0.57;
  sum += valueNoise(p * 2.03 + 7.1) * 0.28;
  sum += valueNoise(p * 4.07 - 3.8) * 0.15;
  return sum;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float coarse = fbm(p * u_scale + vec2(2.7, -1.4));
  float fine = valueNoise(p * u_scale * 3.2 + vec2(-4.1, 8.3));
  float dissolveField = mix(coarse, fine, u_grain * 0.38);

  float verticalField = mix(dissolveField, uv.y, 0.46);
  float radialField = mix(dissolveField, clamp(1.0 - length(p) * 1.4, 0.0, 1.0), 0.46);
  dissolveField = mix(dissolveField, verticalField, step(0.5, u_mode));
  dissolveField = mix(dissolveField, radialField, step(1.5, u_mode));

  float progress = 0.5 - 0.5 * cos(TAU * u_t);
  float threshold = mix(-u_edgeWidth, 1.0 + u_edgeWidth, progress);
  float softness = 0.012 + u_grain * 0.018;
  float visibleMask = smoothstep(threshold - softness, threshold + softness, dissolveField);
  float edge = 1.0 - smoothstep(u_edgeWidth * 0.35, u_edgeWidth, abs(dissolveField - threshold));
  edge *= step(-0.001, threshold) * step(threshold, 1.001);

  vec4 subject = texture2D(u_subject, uv);
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 subjectLayer = mix(background, subject.rgb, subject.a);
  vec3 color = mix(background, subjectLayer, visibleMask);
  color += u_signal * edge * (0.38 + subject.a * 0.46);
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>{const a=String(e.params.mode??"organic");return{u_scale:Math.min(14,Math.max(2,Number(e.params.scale??6.5))),u_edgeWidth:Math.min(.18,Math.max(.01,Number(e.params.edgeWidth??.065))),u_grain:Math.min(1,Math.max(0,Number(e.params.grain??.42))),u_mode:a==="vertical"?1:a==="radial"?2:0,u_signal:i(e.params.signal)}}}};export{l as default};
