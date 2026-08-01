function i(l){const o=String(l??"#5EE7F3").replace("#",""),a=/^[0-9a-f]{6}$/i.test(o)?o:"5EE7F3";return[0,2,4].map(e=>Number.parseInt(a.slice(e,e+2),16)/255)}const u={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_quality;
uniform float u_blockSize;
uniform float u_ringing;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash21(vec2 p) {
  return fract(sin(dot(p + u_seed, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  float pulse = 0.5 + 0.5 * sin(u_t * TAU * 3.0);
  float liveQuality = clamp(u_quality * mix(0.62, 1.08, pulse), 0.04, 1.0);
  vec2 blocks = max(floor(u_resolution / u_blockSize), vec2(1.0));
  vec2 blockId = floor(v_uv * blocks);
  vec2 blockUv = (blockId + 0.5) / blocks;
  vec2 pixelUv = 1.0 / max(u_resolution, vec2(1.0));
  float blockNoise = hash21(blockId);
  vec2 wobble = vec2(blockNoise - 0.5, hash21(blockId + 19.0) - 0.5);
  wobble *= pixelUv * (1.0 - liveQuality) * 5.0;

  vec4 source = texture2D(u_subject, clamp(v_uv + wobble, 0.0, 1.0));
  vec4 blockSample = texture2D(u_subject, clamp(blockUv + wobble, 0.0, 1.0));
  vec3 mixed = mix(blockSample.rgb, source.rgb, 0.34 + liveQuality * 0.58);
  float alpha = mix(blockSample.a, source.a, 0.42 + liveQuality * 0.5);

  float levels = mix(5.0, 42.0, liveQuality);
  vec3 quantized = floor(mixed * levels + 0.5) / levels;
  vec2 within = fract(v_uv * blocks) - 0.5;
  float dct = cos(within.x * 3.14159265 * 4.0) * cos(within.y * 3.14159265 * 4.0);
  float boundary = 1.0 - smoothstep(0.02, 0.2, min(0.5 - abs(within.x), 0.5 - abs(within.y)));
  vec3 ringing = u_signal * (dct * 0.5 + 0.5) * boundary * u_ringing * (1.0 - liveQuality) * 0.34;

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 color = mix(background, quantized, alpha);
  color += ringing * (0.24 + alpha * 0.76);
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:l=>({u_quality:Math.min(1,Math.max(.05,Number(l.params.quality??.42))),u_blockSize:Math.min(24,Math.max(4,Math.round(Number(l.params.blockSize??8)))),u_ringing:Math.min(1,Math.max(0,Number(l.params.ringing??.62))),u_signal:i(l.params.signal)})}};export{u as default};
