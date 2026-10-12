// Public Shinsegae Square screen dimensions; viewpoint and base height are demo assumptions.
export const spec = Object.freeze({left:36.57,right:30.705,radius:9.6,arc:9.66,height:17.595,bottom:8,segments:64});

export function makeSurface(height=spec.height,bottom=spec.bottom) {
  const half=spec.arc/spec.radius/2;
  const c=Math.cos(half),s=Math.sin(half),t=spec.radius*Math.tan(half);
  const x0=-t*c,z0=-t*s;
  const outline=[[x0-spec.left*c,z0-spec.left*s,0],[x0,z0,4452/9366]];
  for(let i=1;i<=spec.segments;i++){
    const a=Math.PI/2+half-i/spec.segments*half*2;
    outline.push([Math.cos(a)*spec.radius,-spec.radius/c+Math.sin(a)*spec.radius,(4452+1176*i/spec.segments)/9366]);
  }
  outline.push([t*c+spec.right*c,-t*s-spec.right*s,1]);
  const positions=[],uv=[];
  for(let i=0;i<outline.length-1;i++){
    const a=outline[i],b=outline[i+1];
    for(const [p,top] of [[a,0],[b,0],[b,1],[a,0],[b,1],[a,1]]){
      positions.push(p[0],bottom+height*top,p[1]);uv.push(p[2],top);
    }
  }
  return {positions,uv,outline};
}
