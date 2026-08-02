function i(e){const o=String(e??"#5EE7F3").replace("#",""),t=/^[0-9a-f]{6}$/i.test(o)?o:"5EE7F3";return[0,2,4].map(a=>Number.parseInt(t.slice(a,a+2),16)/255)}const r={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_t;
uniform float u_density;
uniform float u_relief;
uniform float u_speed;
uniform float u_thickness;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float gridLine(float coordinate, float thickness) {
  float distanceToLine = abs(fract(coordinate) - 0.5);
  return smoothstep(0.5 - thickness, 0.5, distanceToLine);
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 2.0;
  float horizon = 0.30;
  float ground = horizon - p.y;
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 color = background;

  if (ground > 0.015) {
    float inverseDepth = 1.0 / max(ground, 0.035);
    float worldZ = inverseDepth * 0.72;
    float worldX = p.x * inverseDepth * 0.62;
    float phase = TAU * u_t;
    float height = sin(worldX * 0.58 + worldZ * 0.71 + phase * u_speed) * 0.58;
    height += sin(worldX * 1.37 - worldZ * 0.43 - phase * (u_speed + 1.0)) * 0.28;
    height += sin(worldX * 2.11 + worldZ * 0.19 + phase * (u_speed + 2.0)) * 0.14;
    worldX += height * u_relief * 0.20;

    float scale = u_density * 0.22;
    float lineX = gridLine(worldX * scale, u_thickness);
    float lineZ = gridLine(worldZ * scale + u_t * u_speed + height * u_relief * 0.08, u_thickness);
    float wire = max(lineX, lineZ);
    float depthFade = smoothstep(0.02, 0.58, ground);
    float ridge = 0.5 + 0.5 * height;
    color += u_signal * wire * (0.18 + depthFade * 0.72) * (0.68 + ridge * 0.32);
    color += u_signal * ridge * depthFade * 0.025 * u_relief;
  }

  float horizonGlow = exp(-abs(p.y - horizon) * 54.0);
  color += u_signal * horizonGlow * 0.24;
  vec4 subject = texture2D(u_subject, uv);
  float subjectMask = subject.a * smoothstep(0.42, 0.1, length(p));
  color = mix(color, subject.rgb + u_signal * 0.04, subjectMask * 0.18);
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_density:Math.min(12,Math.max(3,Number(e.params.density??7))),u_relief:Math.min(1,Math.max(0,Number(e.params.relief??.58))),u_speed:Math.min(4,Math.max(1,Math.round(Number(e.params.speed??2)))),u_thickness:Math.min(.12,Math.max(.01,Number(e.params.thickness??.045))),u_signal:i(e.params.signal)})}};export{r as default};
