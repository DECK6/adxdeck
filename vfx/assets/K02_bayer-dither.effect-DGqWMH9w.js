function r(e){const l=String(e??"#5EE7F3").replace("#",""),a=/^[0-9a-f]{6}$/i.test(l)?l:"5EE7F3";return[0,2,4].map(o=>Number.parseInt(a.slice(o,o+2),16)/255)}const s={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_cellSize;
uniform float u_levels;
uniform float u_amount;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float bayerOffset(vec2 bit) {
  if (bit.y < 0.5) return bit.x < 0.5 ? 0.0 : 2.0;
  return bit.x < 0.5 ? 3.0 : 1.0;
}

float bayer8(vec2 position) {
  vec2 cell = mod(floor(position), 8.0);
  vec2 fine = mod(cell, 2.0);
  vec2 middle = mod(floor(cell / 2.0), 2.0);
  vec2 coarse = floor(cell / 4.0);
  return (16.0 * bayerOffset(fine) + 4.0 * bayerOffset(middle) + bayerOffset(coarse) + 0.5) / 64.0;
}

void main() {
  float phase = u_t * TAU;
  vec2 logicalPixel = floor(v_uv * u_resolution / u_cellSize);
  vec2 sampleUv = clamp((logicalPixel + 0.5) * u_cellSize / u_resolution, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 source = mix(background, subject.rgb, subject.a);
  float threshold = bayer8(logicalPixel) - 0.5;
  threshold += sin(phase + logicalPixel.x * 0.21 - logicalPixel.y * 0.13) * 0.055;
  float steps = max(1.0, u_levels - 1.0);
  vec3 channelBias = vec3(threshold, bayer8(logicalPixel + vec2(3.0, 5.0)) - 0.5, bayer8(logicalPixel + vec2(5.0, 1.0)) - 0.5);
  channelBias += vec3(threshold) * 0.25;
  vec3 ordered = floor(clamp(source * steps + channelBias * u_amount + 0.5, 0.0, steps)) / steps;
  float sweep = 1.0 - smoothstep(0.0, 0.045, abs(fract(v_uv.x + v_uv.y * 0.35 - u_t) - 0.5));
  ordered += u_signal * sweep * subject.a * 0.07;
  vec3 color = mix(source, ordered, 0.72 + u_amount * 0.28);
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_cellSize:Math.min(6,Math.max(1,Math.round(Number(e.params.cellSize??2)))),u_levels:Math.min(5,Math.max(2,Math.round(Number(e.params.levels??3)))),u_amount:Math.min(1,Math.max(.2,Number(e.params.amount??.85))),u_signal:r(e.params.signal),u_fps:e.fps,u_seed:e.random("shader-seed")*4096})}};export{s as default};
