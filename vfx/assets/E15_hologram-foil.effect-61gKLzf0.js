function o(e){const a=String(e??"#5EE7F3").replace("#",""),n=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(s=>Number.parseInt(n.slice(s,s+2),16)/255)}const u={kind:"webgl",shader:{frag:`
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_t;
uniform float u_bands;
uniform float u_shine;
uniform float u_angle;
uniform vec3 u_signal;
const float TAU=6.28318530718;
vec3 spectrum(float x){return 0.55+0.45*cos(TAU*(x+vec3(0.0,0.33,0.67)));}
void main(){
  float phase=u_t*TAU;
  vec2 p=v_uv-0.5;
  float axis=p.x*cos(u_angle)+p.y*sin(u_angle);
  float band=axis*u_bands+phase/TAU;
  vec3 rainbow=spectrum(band);
  float foil=pow(0.5+0.5*sin(band*TAU+sin(p.y*19.0-phase)*1.2),2.2);
  float sweep=pow(max(0.0,cos((axis-u_t+0.5)*TAU)),18.0);
  vec4 subject=texture2D(u_subject,v_uv);
  vec3 bg=vec3(0.05098,0.05490,0.06275);
  vec3 base=mix(bg,subject.rgb,subject.a);
  vec3 iridescent=mix(u_signal,rainbow,0.72)*(foil*0.48+sweep*u_shine);
  vec3 color=base+iridescent*subject.a;
  color+=rainbow*sweep*u_shine*0.18;
  gl_FragColor=vec4(color,1.0);
}
`,uniforms:e=>({u_bands:Number(e.params.bands??7),u_shine:Number(e.params.shine??.82),u_angle:Number(e.params.angle??.62),u_signal:o(e.params.signal)})}};export{u as default};
