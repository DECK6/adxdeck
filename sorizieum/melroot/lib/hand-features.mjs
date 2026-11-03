const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const empty=()=>({valid:false,roll:0,curls:[0,0,0,0,0],wristX:0,wristY:0});
export function measureHands(result,aspect=4/3,wrists={}){
 const out={left:empty(),right:empty()},hands=[];const ar=Number.isFinite(aspect)&&aspect>0?aspect:4/3;
 for(const [handIndex,lm] of (result?.landmarks||[]).entries()){
  if(lm.length!==21||lm.some(p=>![p.x,p.y,p.z??0].every(Number.isFinite)||p.x<0||p.x>1||p.y<0||p.y>1))continue;
  const P=i=>({x:lm[i].x*ar,y:lm[i].y,z:(lm[i].z||0)*ar});
  const angle=(a,b,c)=>{const u=P(a),v=P(b),w=P(c),x=[v.x-u.x,v.y-u.y,v.z-u.z],y=[w.x-v.x,w.y-v.y,w.z-v.z];const d=Math.hypot(...x)*Math.hypot(...y);return d>1e-8?Math.acos(clamp(x.reduce((s,t,i)=>s+t*y[i],0)/d,-1,1)):0;};
  const curls=[1,5,9,13,17].map(i=>clamp((angle(i,i+1,i+2)+angle(i+1,i+2,i+3))/(Math.PI*1.15),0,1));
  const dx=(lm[9].x-lm[0].x)*ar,dy=lm[9].y-lm[0].y;
  const screenRollValid=Math.hypot(dx,dy)>=.015;
  const world=result.worldLandmarks?.[handIndex];
  const vector=(a,b)=>{const w=world?.[a],v=world?.[b];return w&&v&&[w.x,w.y,w.z,v.x,v.y,v.z].every(Number.isFinite)?[w.x-v.x,w.y-v.y,w.z-v.z]:[(lm[a].x-lm[b].x)*ar,lm[a].y-lm[b].y,((lm[a].z||0)-(lm[b].z||0))*ar];};
  const normalize=v=>{const n=Math.hypot(...v);return n>1e-6?v.map(x=>x/n):null};
  const forward=normalize(vector(0,9)),across=vector(17,5);
  const palmArea=forward?Math.hypot(across[1]*forward[2]-across[2]*forward[1],across[2]*forward[0]-across[0]*forward[2],across[0]*forward[1]-across[1]*forward[0]):0;
  if(!screenRollValid&&palmArea<=1e-6)continue;
  hands.push({valid:true,roll:screenRollValid?Math.atan2(dx,-dy):null,curls,wristX:lm[0].x,wristY:lm[0].y,forward,across});
 }
 // Anatomical left/right are matched to Pose wrists; this also handles crossed hands.
 const cost=(h,side)=>{const w=wrists[side];return w&&Number.isFinite(w.x)&&Number.isFinite(w.y)?Math.hypot((w.x-h.wristX)*ar,w.y-h.wristY):Math.abs(h.wristX-(side==='left'?.75:.25))+.3;};
 if(hands.length===1)out[cost(hands[0],'left')<=cost(hands[0],'right')?'left':'right']=hands[0];
 if(hands.length>=2){const swap=cost(hands[0],'left')+cost(hands[1],'right')>cost(hands[1],'left')+cost(hands[0],'right');out.left=hands[swap?1:0];out.right=hands[swap?0:1];}
 for(const side of ['left','right'])if(out[side].valid){
  const w=wrists[side];let roll=out[side].roll;
  if(roll!==null&&w&&[w.x,w.y,w.elbowX,w.elbowY].every(Number.isFinite)&&Math.hypot((w.x-w.elbowX)*ar,w.y-w.elbowY)>.025)roll-=Math.atan2((w.x-w.elbowX)*ar,-(w.y-w.elbowY));
  out[side].roll=clamp(Math.atan2(Math.sin(roll),Math.cos(roll)),-1.2,1.2);
  const h=out[side],a=h.across,b=h.forward;
  if(b){const n=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],length=Math.hypot(...n);if(length>1e-6)h.normal=n.map(v=>v/length*(side==='left'?1:-1));}
  delete h.across;
 }
 return out;
}
