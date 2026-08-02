function l(e){const a=String(e??"#5EE7F3").replace("#",""),o=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(t=>Number.parseInt(o.slice(t,t+2),16)/255)}const r={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_jam;
uniform float u_melt;
uniform float u_jitter;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash11(float value) {
  return fract(sin(value * 127.1 + u_seed * 31.7) * 43758.5453123);
}

void main() {
  float phase = fract(u_t);
  float catchIn = smoothstep(0.16, 0.22, phase);
  float release = 1.0 - smoothstep(0.62, 0.76, phase);
  float jamEnvelope = catchIn * release * u_jam;
  float loopFrame = mod(u_frame, max(1.0, u_fps * 6.0));
  float lockedFrame = floor(loopFrame / max(1.0, floor(u_fps * 0.11)));
  float gateJitter = (hash11(lockedFrame) - 0.5) * u_jitter * jamEnvelope;
  float slipSteps = floor(smoothstep(0.3, 0.58, phase) * 4.0) / 4.0;
  float verticalSlip = slipSteps * 0.34 * jamEnvelope;
  float tearLine = 0.52 + sin(lockedFrame * 1.7) * 0.11;
  float belowTear = smoothstep(tearLine - 0.012, tearLine + 0.012, v_uv.y);
  float heatPull = belowTear * u_melt * jamEnvelope * (0.35 + 0.65 * v_uv.y);
  vec2 sampleUv = v_uv;
  sampleUv.x += gateJitter + sin(v_uv.y * 46.0 + lockedFrame) * u_melt * 0.035 * jamEnvelope;
  sampleUv.y = fract(sampleUv.y + verticalSlip + heatPull);

  vec4 subject = texture2D(u_subject, clamp(sampleUv, 0.0, 1.0));
  vec4 echoTap = texture2D(u_subject, clamp(sampleUv + vec2(gateJitter * -0.8, u_melt * 0.08), 0.0, 1.0));
  float tearGlow = exp(-abs(v_uv.y - tearLine) * 210.0) * jamEnvelope;
  float exposure = pow(max(0.0, sin(phase * TAU - 0.5)), 18.0) * u_jam;

  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  float gateEdge = 1.0 - smoothstep(0.008, 0.026, min(v_uv.x, 1.0 - v_uv.x));
  vec2 sprocketCell = vec2(v_uv.x < 0.5 ? v_uv.x : 1.0 - v_uv.x, fract(v_uv.y * 9.0));
  float sprocket = (1.0 - smoothstep(0.018, 0.024, sprocketCell.x))
    * (1.0 - smoothstep(0.17, 0.24, abs(sprocketCell.y - 0.5)))
    * step(1.1, aspect);

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 image = mix(echoTap.rgb, subject.rgb, subject.a);
  vec3 color = mix(background, image, max(subject.a, echoTap.a * 0.42));
  color = mix(color, vec3(0.94, 0.72, 0.38), exposure * 0.42 + tearGlow * 0.16);
  color += u_signal * (tearGlow * 0.26 + sprocket * 0.16);
  color *= 1.0 - gateEdge * 0.72;
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_jam:Math.min(1,Math.max(.2,Number(e.params.jam??.78))),u_melt:Math.min(.28,Math.max(0,Number(e.params.melt??.14))),u_jitter:Math.min(.08,Math.max(0,Number(e.params.jitter??.035))),u_signal:l(e.params.signal)})}};export{r as default};
