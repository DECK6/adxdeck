const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const value=(v)=>Number.isFinite(v)?clamp(v,0,1):0;
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
// Relative morphs: move existing roots, never the projector or branch hands.
export function rootOffsets(positions){
 const left=new Float32Array(positions.length),right=new Float32Array(positions.length);
 for(let i=0;i<positions.length;i+=3){
  const x=positions[i],y=positions[i+1],z=positions[i+2];
  const base=(1-smooth(.08,.32,y))*(1-smooth(.13,.23,-z));
  for(const [out,sign] of [[left,-1],[right,1]]){
   const w=base*smooth(-.015,.075,x*sign);
   if(w===0)continue;
   out[i]=sign*.025*w;out[i+1]=.12*w;out[i+2]=.045*w;
  }
 }
 return {left,right};
}
export function lensExpression(p){
 return {open:1-value(p.blink),aperture:1+.22*value(p.mouth),warmth:value(p.smile),brow:Number.isFinite(p.brow)?clamp(p.brow,-1,1):0};
}
// Five measured finger channels bend the existing sculpted branch fans.
// Spatial blends avoid hard seams where neighboring branches meet the palm.
export function fingerOffsets(positions){
 const out=Array.from({length:10},()=>new Float32Array(positions.length));
 for(let i=0;i<positions.length;i+=3){
  const x=positions[i],y=positions[i+1],z=positions[i+2];
  for(const [side,sign,cy,cz] of [[0,-1,.56,.185],[1,1,.48,.05]]){
   const reach=x*sign-.225;
   const area=smooth(.205,.265,x*sign)*(1-smooth(.065,.10,Math.abs(y-cy)))*(1-smooth(.04,.08,Math.abs(z-cz)));
   if(area===0)continue;
   const angle=Math.atan2(y-cy,Math.max(.005,reach));
   const weights=[1.1,.55,0,-.45,-.9].map(a=>Math.exp(-(((angle-a)/.38)**2)));const total=weights.reduce((a,b)=>a+b,0)||1;
   for(let f=0;f<5;f++){const w=weights[f]/total*area;const a=out[side*5+f];const bend=1.25*smooth(.0,.07,reach);a[i]=-sign*Math.max(0,reach)*(1-Math.cos(bend))*w;a[i+1]=(cy-y)*.5*w;a[i+2]=Math.max(.015,reach)*Math.sin(bend)*w;}
  }
 }
 return out;
}
