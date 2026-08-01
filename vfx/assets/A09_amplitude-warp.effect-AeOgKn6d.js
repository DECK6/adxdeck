function l(a){const e=String(a??"#5EE7F3").replace("#",""),r=/^[0-9a-f]{6}$/i.test(e)?e:"5EE7F3";return[0,2,4].map(t=>Number.parseInt(r.slice(t,t+2),16)/255)}const c={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_t;
uniform float u_energy;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_mode;
uniform float u_chroma;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

vec2 warpUv(vec2 uv, float energy) {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float radius = length(p);
  float angle = atan(p.y, p.x);
  float phase = TAU * u_t;
  vec2 displacement;
  if (u_mode < 0.5) {
    displacement = normalize(p + vec2(0.0001))
      * sin(radius * 34.0 - phase * 4.0) * energy * 0.045;
  } else if (u_mode < 1.5) {
    displacement = vec2(
      sin(p.y * 22.0 + phase * 3.0 + u_mid * 4.0),
      cos(p.x * 17.0 - phase * 2.0)
    ) * energy * 0.034;
  } else {
    float twist = energy * (1.0 - smoothstep(0.05, 0.72, radius)) * 1.1;
    float a = angle + twist * sin(phase + radius * 9.0);
    displacement = vec2(cos(a), sin(a)) * radius - p;
  }
  return clamp(uv + displacement / vec2(aspect, 1.0), 0.0, 1.0);
}

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float radius = length(p);
  float energy = clamp(u_energy + u_bass * 0.16, 0.0, 1.0);
  vec2 warped = warpUv(v_uv, energy);
  vec2 channelShift = normalize(p + vec2(0.0001)) * u_chroma * energy * 0.009 / vec2(aspect, 1.0);
  vec4 centerSample = texture2D(u_subject, warped);
  float red = texture2D(u_subject, clamp(warped + channelShift, 0.0, 1.0)).r;
  float blue = texture2D(u_subject, clamp(warped - channelShift, 0.0, 1.0)).b;
  vec3 subjectColor = vec3(red, centerSample.g, blue);

  float phase = TAU * u_t;
  float ring = pow(max(0.0, 0.5 + 0.5 * sin(radius * (38.0 + u_treble * 18.0) - phase * 3.0)), 12.0);
  ring *= smoothstep(0.62, 0.08, radius) * (0.2 + energy * 0.8);
  float core = smoothstep(0.46 + energy * 0.08, 0.06, radius);
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 field = background + u_signal * (ring * 0.5 + core * energy * 0.1);
  subjectColor = mix(subjectColor, u_signal, ring * 0.22);
  vec3 color = mix(field, subjectColor, centerSample.a * (0.78 + energy * 0.22));
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:a=>{const e=a.audio?.bands??[],r=Math.min(1,Math.max(0,a.audio?.rms??0)),t=Math.min(1,Math.max(0,((e[0]??0)+(e[1]??0)+(e[2]??0))/3)),o=Math.min(1,Math.max(0,((e[3]??0)+(e[4]??0)+(e[5]??0))/3)),i=Math.min(1,Math.max(0,((e[6]??0)+(e[7]??0))/2)),u=Math.min(2.5,Math.max(.2,Number(a.params.sensitivity??1.25))),s=Math.min(1,Math.max(0,Number(a.params.bassWeight??.68))),n=String(a.params.warpMode??"radial");return{u_energy:Math.min(1,(r*(1-s)+t*s)*u),u_bass:t,u_mid:o,u_treble:i,u_mode:n==="ribbon"?1:n==="twist"?2:0,u_chroma:Math.min(1,Math.max(0,Number(a.params.chroma??.42))),u_signal:l(a.params.signal)}}}};export{c as default};
