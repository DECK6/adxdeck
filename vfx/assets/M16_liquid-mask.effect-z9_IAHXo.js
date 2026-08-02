function s(e){const u=String(e??"#5EE7F3").replace("#",""),o=/^[0-9a-f]{6}$/i.test(u)?u:"5EE7F3";return[0,2,4].map(a=>Number.parseInt(o.slice(a,a+2),16)/255)}const r={kind:"webgl",shader:{frag:`
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_t;
uniform float u_waves;
uniform float u_wobble;
uniform float u_edge;
uniform float u_seed;
uniform vec3 u_signal;
const float TAU = 6.28318530718;
void main() {
  float phase = u_t * TAU;
  float rise = 0.12 + 0.76 * (0.5 - 0.5 * cos(phase));
  float wave = sin(v_uv.x * TAU * u_waves + phase * 1.3) * u_wobble;
  wave += sin(v_uv.x * TAU * (u_waves * 0.53) - phase * 1.9 + u_seed) * u_wobble * 0.45;
  float front = rise + wave;
  float liquid = smoothstep(front + u_edge, front - u_edge, v_uv.y);
  float rim = 1.0 - smoothstep(u_edge, u_edge * 2.6, abs(v_uv.y - front));
  vec4 subject = texture2D(u_subject, v_uv);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 inside = mix(background + u_signal * 0.07, subject.rgb, subject.a);
  inside += u_signal * (0.035 + 0.025 * sin(v_uv.y * 42.0 - phase));
  vec3 color = mix(background, inside, liquid);
  color += u_signal * rim * 0.72;
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_waves:Number(e.params.waves??5),u_wobble:Number(e.params.wobble??.075),u_edge:Number(e.params.edge??.025),u_seed:e.random("liquid-mask")*6.28318530718,u_signal:s(e.params.signal)})}};export{r as default};
