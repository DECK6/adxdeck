function i(e){const a=String(e??"#5EE7F3").replace("#",""),o=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(t=>Number.parseInt(o.slice(t,t+2),16)/255)}const r={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_distance;
uniform float u_threshold;
uniform float u_intensity;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float saturation(vec3 color) {
  float high = max(max(color.r, color.g), color.b);
  float low = min(min(color.r, color.g), color.b);
  return high - low;
}

void main() {
  float phase = u_t * TAU;
  float direction = 0.62 + 0.38 * sin(phase);
  vec4 center = texture2D(u_subject, v_uv);
  vec4 accumulation = vec4(0.0);
  float weightSum = 0.0;

  for (int index = 0; index < 11; index++) {
    float stepIndex = float(index) / 10.0;
    float signedDistance = (stepIndex * 2.0 - 1.0) * u_distance;
    vec2 sampleUv = clamp(v_uv - vec2(signedDistance * direction, 0.0), 0.0, 1.0);
    vec4 tap = texture2D(u_subject, sampleUv);
    float chroma = saturation(tap.rgb);
    float active = smoothstep(u_threshold, min(1.0, u_threshold + 0.25), chroma) * tap.a;
    float trail = exp(-abs(signedDistance) * 18.0 / max(u_distance, 0.001));
    float weight = active * (0.18 + trail);
    accumulation += tap * weight;
    weightSum += weight;
  }

  vec4 smear = accumulation / max(weightSum, 0.0001);
  float presence = smoothstep(0.03, 0.32, weightSum);
  float scan = 0.84 + 0.16 * sin(v_uv.y * u_resolution.y * 0.52 + phase * 2.0);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 base = mix(background, center.rgb, center.a);
  vec3 bled = mix(smear.rgb, smear.rgb + u_signal * 0.12, saturation(smear.rgb));
  vec3 color = mix(base, bled, presence * u_intensity * scan * max(center.a, smear.a));
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_distance:Math.min(.18,Math.max(.01,Number(e.params.distance??.09))),u_threshold:Math.min(.9,Math.max(.05,Number(e.params.threshold??.38))),u_intensity:Math.min(1,Math.max(0,Number(e.params.intensity??.78))),u_signal:i(e.params.signal)})}};export{r as default};
