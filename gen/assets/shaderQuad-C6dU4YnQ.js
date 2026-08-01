import{G as e,Sn as t,an as n,at as r,in as i,l as a,nt as o}from"./three.core-oECZ-9HV.js";var s=`
void main() {
  gl_Position = vec4(position, 1.0);
}
`;function c(c,l,u={}){let d=new i,f=new o(-1,1,1,-1,0,1),p={uTime:{value:0},uSeed:{value:c.seed%1e3+c.random()},uRes:{value:new t(c.width,c.height)},uColBg:{value:new a(c.palette.bg)},uColSignal:{value:new a(c.palette.signal)},uColAccent:{value:new a(c.palette.accent)},uColPaper:{value:new a(c.palette.paper)},...u},m=new r(2,2),h=new n({vertexShader:s,fragmentShader:l,uniforms:p});return d.add(new e(m,h)),{scene:d,camera:f,uniforms:p,update(e){p.uTime.value=e},dispose(){m.dispose(),h.dispose()}}}export{c as t};