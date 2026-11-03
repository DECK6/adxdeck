// Motion is measured as pose travel, not render-frame count or held posture.
const clamp=v=>Math.max(0,Math.min(1,v));
function channels(p){
 const c={};
 if(p.bodyFresh){
  for(const side of ['left','right'])for(const part of ['Upper','Fore']){
   const key=side+part+'Dir';
   if(p[side+part+'Weight']===1&&p[key]?.length===3)c[key]=p[key];
  }
  c.torso=[(p.lean||0)*4];
  if(p.lowerTracked)c.lower=[(p.rootX||0)*4,p.crouch||0,p.leftLift||0,p.rightLift||0];
 }
 for(const side of ['left','right'])if(p[side+'HandFresh']){
  c[side+'Hand']=[(p[side+'Wrist']||0)*.5,...(p[side+'Fingers']||[]).map(v=>v*.25)];
  if(p[side+'PalmNormal'])c[side+'Palm']=p[side+'PalmNormal'].map(v=>v*.5);
 }
 return Object.fromEntries(Object.entries(c).filter(([,v])=>v.every(Number.isFinite)));
}
export function createGardenGrowth(){
 let previous={},last=null,mode=null,energy=0,activity=0,totalSprouted=0,lastSprout=-Infinity;
 let plants=[];
 return {
  update(p,now){
   if(!Number.isFinite(now))throw new Error('Garden time must be finite');
   const elapsed=last===null?0:Math.max(0,(now-last)/1000),dt=Math.min(.1,elapsed);
   const current=channels(p),reset=last===null||elapsed>.5||now<last||mode!==p.mode;
   let travel=0;
   if(!reset)for(const [key,values] of Object.entries(current)){
    const before=previous[key];
    if(!before||before.length!==values.length)continue;
    const distance=Math.hypot(...values.map((v,i)=>v-before[i]));
    // Keep the reference through tiny fluctuations, so jitter cannot accrue.
    if(distance<.035)current[key]=before;
    else travel+=Math.min(.4,distance);
   }
   if(reset||!Object.keys(current).length){energy=0;activity=0;}
   previous=current;last=now;mode=p.mode;
   activity=Math.min(1,activity*Math.exp(-dt*3)+travel*.8);
   plants=plants.filter(plant=>now-plant.born<60000);
   energy=Math.min(.8,energy+travel*.55);
   if(travel>0&&energy>=.34&&plants.length<24&&now-lastSprout>=2400){
    plants.push({id:totalSprouted++,born:now,growth:0,presence:1});energy-=.34;lastSprout=now;
   }
   // Don't release a stored burst when a full garden gets its next empty slot.
   if(plants.length>=24)energy=0;
   for(const plant of plants){
    const age=Math.max(0,(now-plant.born)/1000);
    plant.growth=clamp(age/1.8);
    plant.presence=1-clamp((age-54)/6);
   }
   return {plants,activity,totalSprouted};
  }
 };
}
