const e=`import type { FxKernel } from '../../src/fx/types';

function colorToRgb(value: unknown): number[] {
  const hex = String(value ?? '#5EE7F3').replace('#', '');
  const valid = /^[0-9a-f]{6}$/i.test(hex) ? hex : '5EE7F3';
  return [0, 2, 4].map((offset) => Number.parseInt(valid.slice(offset, offset + 2), 16) / 255);
}

const kernel = {
  kind: 'webgl',
  shader: {
    frag: \`
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_t;
uniform float u_spread;
uniform float u_feather;
uniform float u_fibers;
uniform float u_seed;
uniform vec3 u_signal;
float hash(vec2 p){return fract(sin(dot(p + u_seed,vec2(127.1,311.7)))*43758.5453);}
float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
void main(){
  float phase=u_t*6.28318530718;
  float grow=(0.5-0.5*cos(phase))*u_spread;
  vec2 aspect=vec2(u_resolution.x/max(u_resolution.y,1.0),1.0);
  vec2 p=(v_uv-0.5)*aspect;
  float fibers=noise2(v_uv*u_fibers*7.0+vec2(phase*0.18,-phase*0.11));
  float lobes=0.05*sin(atan(p.y,p.x)*7.0+fibers*5.0);
  float boundary=grow*0.72+lobes+(fibers-0.5)*0.16;
  float d=length(p-vec2(sin(phase)*0.08,cos(phase*0.7)*0.04));
  float ink=smoothstep(boundary+u_feather,boundary-u_feather,d);
  float rim=1.0-smoothstep(u_feather,u_feather*2.6,abs(d-boundary));
  vec4 subject=texture2D(u_subject,v_uv);
  vec3 bg=vec3(0.05098,0.05490,0.06275);
  vec3 soaked=mix(bg,subject.rgb,subject.a);
  soaked=mix(soaked,u_signal,0.07+fibers*0.08);
  vec3 color=mix(bg,soaked,ink)+u_signal*rim*0.55;
  gl_FragColor=vec4(color,1.0);
}
\`,
    uniforms: (ctx) => ({
      u_spread: Number(ctx.params.spread ?? 1), u_feather: Number(ctx.params.feather ?? 0.075),
      u_fibers: Number(ctx.params.fibers ?? 5), u_seed: ctx.random('ink-bleed') * 97,
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
