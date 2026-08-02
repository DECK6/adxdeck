function i(e){const a=String(e??"#5EE7F3").replace("#",""),t=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(o=>Number.parseInt(t.slice(o,o+2),16)/255)}const r={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_frame;
uniform float u_t;
uniform float u_amplitude;
uniform float u_layers;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  float phase = TAU * u_t * u_speed;
  float horizon = 0.56;
  float waterMask = 1.0 - smoothstep(horizon - 0.012, horizon + 0.012, uv.y);
  float depth = clamp((horizon - uv.y) / horizon, 0.0, 1.0);

  float waveField = 0.0;
  float crestField = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float enabled = 1.0 - step(u_layers, fi + 0.5);
    float layerDepth = (fi + 1.0) / 6.0;
    float baseY = horizon - 0.025 - fi * 0.098;
    float frequency = 7.0 + fi * 2.15;
    float direction = mod(fi, 2.0) < 1.0 ? 1.0 : -1.0;
    float wave = sin(uv.x * frequency * aspect + phase * direction * (1.0 + fi * 0.18) + fi * 1.73);
    wave += sin(uv.x * frequency * 1.83 * aspect - phase * direction * 2.0 + fi * 0.61) * 0.28;
    float lineY = baseY + wave * u_amplitude * (0.32 + layerDepth);
    float distanceToCrest = abs(uv.y - lineY);
    float crest = exp(-distanceToCrest * (150.0 - fi * 12.0));
    crestField += crest * enabled * (0.36 + layerDepth * 0.74);
    waveField += wave * enabled * (0.08 + layerDepth * 0.1);
  }

  float crossWave = sin((uv.x * aspect * 19.0 + uv.y * 31.0) - phase * 2.0);
  float shimmer = pow(max(0.0, crossWave * 0.5 + 0.5), 9.0) * depth;
  vec2 reflectionUv = vec2(
    clamp(uv.x + (waveField + crossWave * 0.08) * u_amplitude * depth, 0.0, 1.0),
    clamp(horizon + (horizon - uv.y) * 0.58, 0.0, 1.0)
  );
  vec4 subject = texture2D(u_subject, uv);
  vec4 reflection = texture2D(u_subject, reflectionUv);

  vec3 ink = vec3(0.051, 0.055, 0.063);
  vec3 sky = ink + u_signal * (0.025 + 0.08 * (1.0 - uv.y));
  sky = mix(sky, subject.rgb, subject.a * (1.0 - waterMask) * 0.82);
  float oceanLight = 0.055 + depth * 0.08 + crestField * 0.32 + shimmer * 0.14;
  vec3 ocean = ink + u_signal * oceanLight;
  ocean = mix(ocean, reflection.rgb, reflection.a * (0.16 + crestField * 0.08));
  ocean += u_signal * crestField * 0.18;

  vec3 color = mix(sky, ocean, waterMask);
  float horizonGlow = exp(-abs(uv.y - horizon) * 180.0);
  color += u_signal * horizonGlow * 0.18;
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_amplitude:Math.min(.08,Math.max(.01,Number(e.params.amplitude??.042))),u_layers:Math.min(5,Math.max(3,Math.round(Number(e.params.layers??5)))),u_speed:Math.min(3,Math.max(1,Math.round(Number(e.params.speed??1)))),u_signal:i(e.params.signal)})}};export{r as default};
