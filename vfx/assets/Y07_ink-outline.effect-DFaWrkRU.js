function t(e){const o=String(e??"#5EE7F3").replace("#",""),a=/^[0-9a-f]{6}$/i.test(o)?o:"5EE7F3";return[0,2,4].map(u=>Number.parseInt(a.slice(u,u+2),16)/255)}const r={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_edgeWidth;
uniform float u_ink;
uniform float u_toneScale;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float energy(vec4 sampleColor) {
  return max(sampleColor.a, dot(sampleColor.rgb, vec3(0.2126, 0.7152, 0.0722)) * sampleColor.a);
}

void main() {
  vec2 pixel = 1.0 / max(u_resolution, vec2(1.0));
  vec2 dx = vec2(pixel.x * u_edgeWidth, 0.0);
  vec2 dy = vec2(0.0, pixel.y * u_edgeWidth);
  vec4 subject = texture2D(u_subject, v_uv);
  float left = energy(texture2D(u_subject, clamp(v_uv - dx, 0.0, 1.0)));
  float right = energy(texture2D(u_subject, clamp(v_uv + dx, 0.0, 1.0)));
  float down = energy(texture2D(u_subject, clamp(v_uv - dy, 0.0, 1.0)));
  float up = energy(texture2D(u_subject, clamp(v_uv + dy, 0.0, 1.0)));
  float edge = smoothstep(0.035, 0.28, length(vec2(right - left, up - down)) * u_ink);

  vec2 toneCell = fract(v_uv * u_resolution / u_toneScale) - 0.5;
  float luma = dot(subject.rgb, vec3(0.2126, 0.7152, 0.0722));
  float dotRadius = mix(0.08, 0.36, clamp(1.0 - luma, 0.0, 1.0));
  float screenTone = 1.0 - smoothstep(dotRadius, dotRadius + 0.08, length(toneCell));
  screenTone *= subject.a * smoothstep(0.18, 0.72, 1.0 - luma);

  float phase = u_t * TAU;
  float pressSweep = 1.0 - smoothstep(0.0, 0.16, abs(v_uv.x - (0.5 + 0.46 * sin(phase))));
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 mutedSubject = mix(background, subject.rgb, subject.a * 0.48);
  vec3 paperInk = mix(mutedSubject, background * 0.42, screenTone * 0.78);
  vec3 color = mix(paperInk, mix(background * 0.2, u_signal * 0.18, 0.38), edge);
  color += u_signal * edge * (0.38 + pressSweep * 0.34);
  color += u_signal * screenTone * 0.08;
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_resolution:[e.width,e.height],u_frame:e.frame,u_t:e.t,u_fps:e.fps,u_seed:e.random("shader-seed"),u_edgeWidth:Math.min(3.5,Math.max(.5,Number(e.params.edgeWidth??1.6))),u_ink:Math.min(1.4,Math.max(.2,Number(e.params.ink??.9))),u_toneScale:Math.min(18,Math.max(5,Number(e.params.toneScale??10))),u_signal:t(e.params.signal)})}};export{r as default};
