function t(a){const e=String(a??"#5EE7F3").replace("#",""),r=/^[0-9a-f]{6}$/i.test(e)?e:"5EE7F3";return[0,2,4].map(o=>Number.parseInt(r.slice(o,o+2),16)/255)}const u={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_frame;
uniform float u_t;
uniform float u_curl;
uniform float u_shadow;
uniform float u_paper;
uniform float u_speed;
uniform vec3 u_signal;

const float PI = 3.14159265359;
const float TAU = 6.28318530718;

vec3 darkScene(vec2 uv) {
  vec4 subject = texture2D(u_subject, clamp(uv, 0.0, 1.0));
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  float halo = 1.0 - smoothstep(0.0, 0.58, length(uv - 0.5));
  vec3 field = background + u_signal * halo * 0.025;
  return mix(field, subject.rgb, subject.a);
}

vec3 paperScene(vec2 uv) {
  vec4 subject = texture2D(u_subject, clamp(uv, 0.0, 1.0));
  float grain = sin(uv.x * 413.0 + uv.y * 227.0) * sin(uv.y * 337.0 - uv.x * 181.0);
  vec3 paper = vec3(u_paper, u_paper * 0.985, u_paper * 0.94) + grain * 0.008;
  vec3 ink = vec3(0.018, 0.024, 0.029) + u_signal * 0.045;
  return mix(paper, ink, subject.a * (0.88 + dot(subject.rgb, vec3(0.2126, 0.7152, 0.0722)) * 0.12));
}

void main() {
  float phase = u_t * TAU * u_speed;
  float progress = 0.5 - 0.5 * cos(phase);
  float front = mix(1.12, -0.12, progress);
  float curlWidth = u_curl;
  float local = (v_uv.x - front) / curlWidth;
  float flatPage = step(front + curlWidth, v_uv.x);
  float onCurl = step(0.0, local) * (1.0 - step(1.0, local));

  vec3 dark = darkScene(v_uv);
  vec3 paper = paperScene(v_uv);
  vec3 color = mix(dark, paper, flatPage);

  float theta = clamp(local, 0.0, 1.0) * PI;
  float cylinderX = front + curlWidth * (0.5 - 0.5 * cos(theta));
  float lift = sin(theta);
  vec2 curlUv = vec2(cylinderX, v_uv.y + (v_uv.y - 0.5) * lift * 0.035);
  vec3 frontColor = paperScene(curlUv);
  vec3 backColor = vec3(u_paper * 0.82, u_paper * 0.84, u_paper * 0.82) + u_signal * 0.035;
  float backFacing = smoothstep(0.46, 0.58, local);
  float cylinderShade = mix(0.7, 1.04, 0.5 + 0.5 * cos(theta - 0.7));
  vec3 curlColor = mix(frontColor, backColor, backFacing) * cylinderShade;
  color = mix(color, curlColor, onCurl);

  float castDistance = max(0.0, front - v_uv.x);
  float castShadow = exp(-castDistance * 34.0 / max(curlWidth, 0.001));
  castShadow *= step(v_uv.x, front) * smoothstep(-0.08, 0.2, front) * (1.0 - smoothstep(0.8, 1.08, front));
  color *= 1.0 - castShadow * u_shadow * (0.18 + lift * 0.22);
  float rim = onCurl * pow(max(0.0, sin(theta)), 10.0);
  color += u_signal * rim * 0.13;
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:a=>({u_curl:Math.min(.32,Math.max(.08,Number(a.params.curl??.2))),u_shadow:Math.min(1,Math.max(.2,Number(a.params.shadow??.72))),u_paper:Math.min(1,Math.max(.65,Number(a.params.paper??.92))),u_speed:Math.min(3,Math.max(1,Math.round(Number(a.params.speed??1)))),u_signal:t(a.params.signal)})}};export{u as default};
