const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};

// The v3 export's distance mask accidentally assigned branch-hand surfaces to
// CloakL/R. Rebind the complete fan to the hand, blending only at its wrist.
// Positions, topology, textures and the source GLB remain unchanged.
export function repairHandSkin(geometry,skeleton){
 const p=geometry.attributes.position,j=geometry.attributes.skinIndex,w=geometry.attributes.skinWeight;
 const counts={left:0,right:0};if(!p||!j||!w||!skeleton)return counts;
 const names=skeleton.bones.map(b=>b.name.replaceAll('.',''));
 for(const [side,suffix,sign,cy,cz] of [['left','L',-1,.56,.185],['right','R',1,.48,.05]]){
  const chain=['UpperArm','Forearm','Hand'].map(name=>names.indexOf(name+suffix)),hand=chain[2];
  if(chain.some(i=>i<0))continue;
  for(let i=0;i<p.count;i++){
   const reach=p.getX(i)*sign;
   const region=smooth(.175,.21,reach)*(1-smooth(.08,.13,Math.abs(p.getY(i)-cy)))*(1-smooth(.06,.10,Math.abs(p.getZ(i)-cz)));
   if(!region)continue;
   let arm=0;for(let k=0;k<4;k++)if(chain.includes(j.getComponent(i,k)))arm+=w.getComponent(i,k);
   // Existing branch membership excludes nearby cloak/leaf surfaces. The
   // transition keeps low-weight cuff boundary vertices continuous.
   const blend=region*smooth(.05,.2,arm);if(blend<=0)continue;
   const weights=new Map();
   for(let k=0;k<4;k++){const joint=j.getComponent(i,k),weight=w.getComponent(i,k)*(1-blend);weights.set(joint,(weights.get(joint)||0)+weight);}
   weights.set(hand,(weights.get(hand)||0)+blend);
   const entries=[...weights].filter(([,weight])=>weight>0).sort((a,b)=>b[1]-a[1]).slice(0,4),sum=entries.reduce((s,[,weight])=>s+weight,0);
   for(let k=0;k<4;k++){j.setComponent(i,k,entries[k]?.[0]??0);w.setComponent(i,k,(entries[k]?.[1]??0)/sum);}
   counts[side]++;
  }
 }
 j.needsUpdate=true;w.needsUpdate=true;return counts;
}
