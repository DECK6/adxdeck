import{W as e,c as t,et as n,gn as r,nn as i,rt as a,tn as o}from"./three.core-rqVSU9gU.js";var s=`
void main() {
  gl_Position = vec4(position, 1.0);
}
`;function c(c,l,u={}){let d=new o,f=new n(-1,1,1,-1,0,1),p={uTime:{value:0},uSeed:{value:c.seed%1e3+c.random()},uRes:{value:new r(c.width,c.height)},uColBg:{value:new t(c.palette.bg)},uColSignal:{value:new t(c.palette.signal)},uColAccent:{value:new t(c.palette.accent)},uColPaper:{value:new t(c.palette.paper)},...u},m=new a(2,2),h=new i({vertexShader:s,fragmentShader:l,uniforms:p});return d.add(new e(m,h)),{scene:d,camera:f,uniforms:p,update(e){p.uTime.value=e},dispose(){m.dispose(),h.dispose()}}}export{c as t};