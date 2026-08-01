function t(u){const a=String(u??"#5EE7F3").replace("#",""),s=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(e=>Number.parseInt(s.slice(e,e+2),16)/255)}const o={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_frame;
uniform float u_t;
uniform float u_focus;
uniform float u_bandWidth;
uniform float u_blur;
uniform float u_angle;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU;
  float cs = cos(u_angle);
  float sn = sin(u_angle);
  vec2 axis = vec2(-sn, cs);
  float movingFocus = u_focus + sin(phase) * 0.17;
  float bandDistance = abs(dot(v_uv - vec2(0.5, movingFocus), axis));
  float blurAmount = smoothstep(u_bandWidth * 0.42, u_bandWidth, bandDistance);
  float radius = u_blur * blurAmount * (0.82 + 0.18 * cos(phase * 2.0));
  vec2 aspectFix = vec2(u_resolution.y / max(u_resolution.x, 1.0), 1.0);

  vec4 sum = texture2D(u_subject, v_uv) * 0.2;
  sum += texture2D(u_subject, clamp(v_uv + vec2(1.0, 0.0) * aspectFix * radius, 0.0, 1.0)) * 0.1;
  sum += texture2D(u_subject, clamp(v_uv + vec2(-1.0, 0.0) * aspectFix * radius, 0.0, 1.0)) * 0.1;
  sum += texture2D(u_subject, clamp(v_uv + vec2(0.0, 1.0) * aspectFix * radius, 0.0, 1.0)) * 0.1;
  sum += texture2D(u_subject, clamp(v_uv + vec2(0.0, -1.0) * aspectFix * radius, 0.0, 1.0)) * 0.1;
  sum += texture2D(u_subject, clamp(v_uv + vec2(0.707, 0.707) * aspectFix * radius, 0.0, 1.0)) * 0.1;
  sum += texture2D(u_subject, clamp(v_uv + vec2(-0.707, 0.707) * aspectFix * radius, 0.0, 1.0)) * 0.1;
  sum += texture2D(u_subject, clamp(v_uv + vec2(0.707, -0.707) * aspectFix * radius, 0.0, 1.0)) * 0.1;
  sum += texture2D(u_subject, clamp(v_uv + vec2(-0.707, -0.707) * aspectFix * radius, 0.0, 1.0)) * 0.1;

  vec3 background = vec3(0.051, 0.055, 0.063);
  float focusGlow = exp(-bandDistance * bandDistance / max(0.002, u_bandWidth * u_bandWidth * 0.18));
  float travelingGrain = 0.5 + 0.5 * sin(dot(v_uv, vec2(31.0, 17.0)) + phase * 2.0);
  vec3 base = background + u_signal * focusGlow * (0.018 + travelingGrain * 0.016);
  vec3 subjectColor = mix(base, sum.rgb, sum.a);
  subjectColor = mix(subjectColor, subjectColor * subjectColor * (3.0 - 2.0 * subjectColor), 0.32);
  subjectColor += u_signal * focusGlow * sum.a * 0.035;
  gl_FragColor = vec4(subjectColor, 1.0);
}
`,uniforms:u=>({u_focus:Math.min(.8,Math.max(.2,Number(u.params.focus??.5))),u_bandWidth:Math.min(.42,Math.max(.08,Number(u.params.bandWidth??.2))),u_blur:Math.min(.035,Math.max(.004,Number(u.params.blur??.022))),u_angle:Math.min(35,Math.max(-35,Number(u.params.angle??-8)))*(Math.PI/180),u_signal:t(u.params.signal)})}};export{o as default};
