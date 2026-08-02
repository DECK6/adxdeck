import{Z as e,ct as t,d as n,dt as r,fn as i,jn as a,pn as o}from"./three.core-CqZLgeuL.js";var s=`
void main() {
  gl_Position = vec4(position, 1.0);
}
`;function c(c,l,u={}){let d=new i,f=new t(-1,1,1,-1,0,1),p={uTime:{value:0},uSeed:{value:c.seed%1e3+c.random()},uRes:{value:new a(c.width,c.height)},uColBg:{value:new n(c.palette.bg)},uColSignal:{value:new n(c.palette.signal)},uColAccent:{value:new n(c.palette.accent)},uColPaper:{value:new n(c.palette.paper)},...u},m=new r(2,2),h=new o({vertexShader:s,fragmentShader:l,uniforms:p});return d.add(new e(m,h)),{scene:d,camera:f,uniforms:p,update(e){p.uTime.value=e},dispose(){m.dispose(),h.dispose()}}}export{c as t};