const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const number=(v,fallback=0)=>Number.isFinite(v)?v:fallback;
const NEUTRAL={yaw:0,pitch:0,roll:0,leftArm:0,rightArm:0,lean:0,float:0,
 rootX:0,crouch:0,hipLean:0,leftLift:0,rightLift:0,leftKnee:0,rightKnee:0,
 leftUpperWeight:0,rightUpperWeight:0,leftForeWeight:0,rightForeWeight:0,
 blink:0,mouth:0,smile:0,brow:0};
export function createMotion(){
 let camera=false,mode='upper',face=null,body=null,hands=null,faceAt=-Infinity,bodyAt=-Infinity,handsAt=-Infinity,baseline=null;
 const fade=(now,at)=>clamp(1-Math.max(0,now-at-250)/650,0,1);
 return {
  get mode(){return mode;},
  setMode(next){if(!['upper','full'].includes(next))throw new Error('Unknown tracking mode');if(mode!==next){mode=next;baseline=null;body=null;bodyAt=-Infinity;}},
  recenter(){baseline=null;},
  setCamera(on){camera=on;face=body=hands=null;faceAt=bodyAt=handsAt=-Infinity;baseline=null;},
  hands(p,at){if(Number.isFinite(at)&&at>=handsAt&&p){hands=p;handsAt=at;}},
  face(p,at){if(Number.isFinite(at)&&at>=faceAt&&p&&[p.ax,p.ay,p.az].every(Number.isFinite)){face={...p};faceAt=at;}},
  body(p,at){if(Number.isFinite(at)&&at>=bodyAt&&p){body={...p};bodyAt=at;
   if(mode==='full'&&!baseline&&p.lowerValid&&p.hipValid&&Number.isFinite(p.hipX)&&p.torsoHeight>.05)baseline={x:p.hipX,y:p.hipY,height:p.torsoHeight};
  }},
  sample(now){
   const t=now/1000,p={...NEUTRAL,mode,tracked:false,faceTracked:false,bodyTracked:false,lowerTracked:false,handsTracked:false,leftWrist:0,rightWrist:0,leftFingers:[0,0,0,0,0],rightFingers:[0,0,0,0,0]};
   if(!camera)return {...p,yaw:.07*Math.sin(t*.43),pitch:.025*Math.sin(t*.7),roll:.018*Math.sin(t*.51),leftArm:.025*Math.sin(t*.8),rightArm:.025*Math.sin(t*.8+1),float:.004*Math.sin(t*1.5)};
   const f=fade(now,faceAt),b=fade(now,bodyAt);
   const arm=side=>body?.[side+'UpperValid']||body?.[side+'Valid']?clamp((number(body[side+'Arm'],.4)-.4)*1.05,-.3,.60)*b:0;
   Object.assign(p,{yaw:face?clamp(face.ax,-1,1)*.32*f:0,pitch:face?clamp(face.ay,-1,1)*.18*f:0,roll:face?clamp(face.az,-1,1)*.16*f:0,
    leftArm:arm('left'),rightArm:arm('right'),lean:body?.torsoValid?clamp(number(body.bodyLean),-1,1)*.06*b:0,
    blink:face?(1-clamp((number(face.eL,1)+number(face.eR,1))/2,0,1))*f:0,
    mouth:clamp(number(face?.mo),0,1)*f,smile:clamp(number(face?.mf),0,1)*f,brow:clamp(number(face?.br),-1,1)*f,
    faceTracked:!!face&&f>0,bodyTracked:!!body&&b>0&&!!(body.leftValid||body.rightValid||body.torsoValid)});
   for(const side of ['left','right'])for(const part of ['Upper','Fore']){
    const d=body?.[side+part+'Dir'];if(body?.[side+part+'Valid']&&Array.isArray(d)&&d.length===3&&d.every(Number.isFinite)){
     p[side+part+'Dir']=[...d];p[side+part+'Weight']=b;p.bodyTracked=b>0;
    }
   }
   if(mode==='full'&&body){
    p.lowerTracked=b>0&&!!body.lowerValid;
    if(body.hipValid&&body.lowerValid&&baseline){
     p.rootX=clamp(-(number(body.hipX,baseline.x)-baseline.x)/baseline.height*.14,-.22,.22)*b;
     p.hipLean=clamp(number(body.hipLean),-1,1)*.12*b;
     p.crouch=clamp((number(body.leftKnee)+number(body.rightKnee))*.5,0,1)*b;
    }
    for(const side of ['left','right'])if(body[side+'LegValid']){
     p[side+'Knee']=clamp(number(body[side+'Knee']),0,1)*b;
     p[side+'Lift']=body.lowerValid?clamp(number(body[side+'Lift']),0,1)*b:0;
    }
   }
   const h=fade(now,handsAt);
   for(const side of ['left','right'])if(hands?.[side]?.valid){
    if(hands[side].forward?.every(Number.isFinite)&&hands[side].normal?.every(Number.isFinite)){p[side+'PalmForward']=[...hands[side].forward];p[side+'PalmNormal']=[...hands[side].normal];p[side+'PalmWeight']=h;}
    p[side+'Wrist']=clamp(number(hands[side].roll),-1.2,1.2)*h;
    p[side+'Fingers']=Array.from({length:5},(_,i)=>clamp(number(hands[side].curls?.[i]),0,1)*h);
    if(h>0)p.handsTracked=true;
   }
   // Environment growth must ignore the ease back to rest after tracking loss.
   p.bodyFresh=p.bodyTracked&&b===1;
   for(const side of ['left','right'])p[side+'HandFresh']=!!hands?.[side]?.valid&&h===1;
   p.tracked=p.faceTracked||p.bodyTracked||p.handsTracked;return p;
  }
 };
}
