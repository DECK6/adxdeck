function u(o){const a=String(o??"#5EE7F3").replace("#",""),s=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(e=>Number.parseInt(s.slice(e,e+2),16)/255)}const l={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_folds;
uniform float u_flow;
uniform float u_sheen;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  float phase = u_t * TAU;
  float loopX = cos(phase) * 0.38 * u_flow;
  float loopY = sin(phase) * 0.24 * u_flow;
  float waveA = sin((uv.x * u_folds + loopX + u_seed * 0.17) * TAU);
  float waveB = sin((uv.x * (u_folds * 0.53 + 1.0) - loopY) * TAU + 1.7);
  float center = 0.5 + waveA * 0.12 + waveB * 0.055;
  float distanceToFold = uv.y - center;
  float ribbons = exp(-abs(distanceToFold) * 9.0);
  ribbons += exp(-abs(distanceToFold - 0.23 - waveB * 0.035) * 12.0) * 0.72;
  ribbons += exp(-abs(distanceToFold + 0.25 + waveA * 0.025) * 11.0) * 0.62;
  float normals = 0.5 + 0.5 * sin(distanceToFold * 68.0 + waveA * 2.8 - waveB * 1.7);
  float specular = pow(normals, 7.0) * ribbons * u_sheen;
  float edge = pow(1.0 - abs(uv.y - 0.5) * 1.65, 2.0);

  vec3 background = vec3(0.025, 0.043, 0.055);
  vec3 deep = mix(background, u_signal * 0.17, ribbons * 0.56);
  vec3 color = deep + u_signal * specular * 0.56 + u_signal * edge * 0.025;
  color += u_signal * (0.5 + 0.5 * cos((uv.x * aspect + uv.y) * 12.0 + phase)) * 0.012;

  vec4 subject = texture2D(u_subject, uv);
  color = mix(color, subject.rgb, subject.a * 0.26);
  color += u_signal * subject.a * specular * 0.08;
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:o=>({u_resolution:[o.width,o.height],u_frame:o.frame,u_t:o.t,u_fps:o.fps,u_seed:o.random("silk-seed"),u_folds:Math.min(8,Math.max(2,Math.round(Number(o.params.folds??5)))),u_flow:Math.min(1.5,Math.max(.3,Number(o.params.flow??.8))),u_sheen:Math.min(1,Math.max(.2,Number(o.params.sheen??.72))),u_signal:u(o.params.signal)})}};export{l as default};
