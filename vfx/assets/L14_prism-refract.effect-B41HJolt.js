function u(e){const a=String(e??"#5EE7F3").replace("#",""),t=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(r=>Number.parseInt(t.slice(r,r+2),16)/255)}const o={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_dispersion;
uniform float u_angle;
uniform float u_width;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU;
  vec2 direction = vec2(cos(u_angle + sin(phase) * 0.16), sin(u_angle + sin(phase) * 0.16));
  vec2 normal = vec2(-direction.y, direction.x);
  vec2 centered = v_uv - 0.5;
  float prismBand = 1.0 - smoothstep(u_width * 0.72, u_width, abs(dot(centered, normal)));
  float breathing = 0.78 + 0.22 * cos(phase);
  vec2 offset = direction * u_dispersion * breathing * prismBand;

  vec4 redTap = texture2D(u_subject, clamp(v_uv + offset * 1.15, 0.0, 1.0));
  vec4 yellowTap = texture2D(u_subject, clamp(v_uv + offset * 0.58, 0.0, 1.0));
  vec4 centerTap = texture2D(u_subject, v_uv);
  vec4 cyanTap = texture2D(u_subject, clamp(v_uv - offset * 0.52, 0.0, 1.0));
  vec4 blueTap = texture2D(u_subject, clamp(v_uv - offset * 1.12, 0.0, 1.0));

  vec3 spectrum = vec3(
    redTap.r * 0.82 + yellowTap.r * 0.18,
    yellowTap.g * 0.34 + centerTap.g * 0.38 + cyanTap.g * 0.28,
    cyanTap.b * 0.24 + blueTap.b * 0.76
  );
  float alpha = max(max(redTap.a, blueTap.a), max(centerTap.a, max(yellowTap.a, cyanTap.a)));
  float edge = clamp(abs(redTap.a - blueTap.a) + length(redTap.rgb - blueTap.rgb) * 0.22, 0.0, 1.0);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 color = mix(background, spectrum, alpha);
  color += mix(vec3(0.82, 0.16, 0.38), u_signal, 0.58) * edge * prismBand * 0.28;
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_dispersion:Math.min(.12,Math.max(.005,Number(e.params.dispersion??.0525))),u_angle:Math.min(90,Math.max(-90,Number(e.params.angle??24)))*(Math.PI/180),u_width:Math.min(.8,Math.max(.1,Number(e.params.width??.46))),u_signal:u(e.params.signal)})}};export{o as default};
