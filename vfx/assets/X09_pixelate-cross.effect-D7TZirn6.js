function r(e){const s=String(e??"#5EE7F3").replace("#",""),a=/^[0-9a-f]{6}$/i.test(s)?s:"5EE7F3";return[0,2,4].map(t=>Number.parseInt(a.slice(t,t+2),16)/255)}const o={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_frame;
uniform float u_t;
uniform float u_pixelSize;
uniform float u_crossWidth;
uniform float u_softness;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU * u_speed;
  float progress = 0.5 - 0.5 * cos(phase);
  float blockSize = mix(2.0, u_pixelSize, sin(phase) * sin(phase));
  vec2 grid = max(u_resolution / blockSize, vec2(1.0));
  vec2 drift = vec2(sin(phase * 2.0), cos(phase)) * 0.65;
  vec2 cell = floor(v_uv * grid + drift);
  vec2 sampleUv = clamp((cell + 0.5 - drift) / grid, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);

  vec2 centered = abs(v_uv - 0.5);
  float reach = mix(0.015, 0.56, progress);
  float vertical = 1.0 - smoothstep(reach - u_softness, reach + u_softness, centered.x);
  float horizontal = 1.0 - smoothstep(reach - u_softness, reach + u_softness, centered.y);
  float crossMask = max(vertical, horizontal);
  float innerWidth = max(0.008, u_crossWidth * (0.35 + progress * 0.65));
  float verticalArm = (1.0 - smoothstep(innerWidth, innerWidth + u_softness, centered.x))
    * (1.0 - smoothstep(reach, reach + u_softness, centered.y));
  float horizontalArm = (1.0 - smoothstep(innerWidth, innerWidth + u_softness, centered.y))
    * (1.0 - smoothstep(reach, reach + u_softness, centered.x));
  crossMask *= max(verticalArm, horizontalArm);

  vec2 p = sampleUv - 0.5;
  float field = 0.5
    + 0.25 * sin(p.x * 16.0 + phase * 2.0)
    + 0.22 * cos(p.y * 14.0 - phase * 3.0);
  field = clamp(field, 0.0, 1.0);
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 fieldColor = background + u_signal * field * 0.25;
  vec3 pixelatedSubject = mix(fieldColor, subject.rgb, subject.a);
  float cellEdge = max(step(0.92, fract(v_uv.x * grid.x)), step(0.92, fract(v_uv.y * grid.y)));
  pixelatedSubject += u_signal * cellEdge * crossMask * 0.16;

  vec3 clearSubject = mix(background, texture2D(u_subject, v_uv).rgb, texture2D(u_subject, v_uv).a);
  vec3 color = mix(clearSubject, pixelatedSubject, crossMask);
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_pixelSize:Math.min(40,Math.max(4,Math.round(Number(e.params.pixelSize??22)))),u_crossWidth:Math.min(.5,Math.max(.08,Number(e.params.crossWidth??.28))),u_softness:Math.min(.08,Math.max(.005,Number(e.params.softness??.025))),u_speed:Math.min(3,Math.max(1,Math.round(Number(e.params.speed??1)))),u_signal:r(e.params.signal)})}};export{o as default};
