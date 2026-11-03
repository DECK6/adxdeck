import * as THREE from 'three';
import {createGardenGrowth} from './garden-growth.mjs?v=3.6';

const clamp=v=>Math.max(0,Math.min(1,v));
const ease=v=>{const t=clamp(v);return t*t*(3-2*t);};
const noise=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};

// All roots live in this independent world-space group, never in the rig.
export function createGarden(){
 const group=new THREE.Group();group.name='floor-garden';
 const growth=createGardenGrowth(),dummy=new THREE.Object3D();
 const from=new THREE.Vector3(),to=new THREE.Vector3(),direction=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
 const sphere=new THREE.SphereGeometry(1,8,6);
 const stemGeometry=new THREE.CylinderGeometry(.8,1,1,6);
 const make=(name,geometry,color,count)=>{
  const mesh=new THREE.InstancedMesh(geometry,new THREE.MeshStandardMaterial({color,roughness:.9,metalness:0}),count);
  mesh.name=name;mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.frustumCulled=false;mesh.count=0;group.add(mesh);return mesh;
 };
 const stems=make('stems',stemGeometry,0x657550,24*4);
 const leaves=make('leaves',sphere,0x819469,24*6);
 const petals=make('petals',sphere,0xf1d7b9,24*5);
 const hearts=make('flower-centres',sphere,0xc6a55d,24);
 const leafColor=new THREE.Color(),petalColor=new THREE.Color();
 let state={plants:[],activity:0,totalSprouted:0},roots=[];
 function instance(mesh,index,x,y,z,sx,sy,sz,rz=0,ry=0){
  dummy.position.set(x,y,z);dummy.rotation.set(0,ry,rz);dummy.scale.set(sx,sy,sz);dummy.updateMatrix();mesh.setMatrixAt(index,dummy.matrix);
 }
 return {
  group,
  update(p,now){
   state=growth.update(p,now);let si=0,li=0,pi=0,hi=0;roots=[];
   for(const plant of state.plants){
    const id=plant.id,side=id%2?1:-1;
    const x=side*(.32+noise(id+1)*.28),z=-.12-noise(id+5)*.32,y=-.009;
    const height=.12+noise(id+9)*.19,age=(now-plant.born)/1000;
    const stemGrow=ease(age/.95),presence=ease(plant.presence);
    const h=height*stemGrow*presence;
    const bend=(side*.025+Math.sin(now/1500+id*1.7)*(.005+state.activity*.008))*stemGrow;
    roots.push({id,x,y,z});
    const point=(v,target)=>target.set(x+bend*v*v,y+h*v,z+.012*Math.sin(v*Math.PI));
    for(let j=0;j<4;j++){
     point(j/4,from);point((j+1)/4,to);direction.subVectors(to,from);
     const length=direction.length();dummy.position.copy(from).add(to).multiplyScalar(.5);dummy.quaternion.setFromUnitVectors(up,direction.normalize());
     dummy.scale.set(.0025*presence,length,.0025*presence);dummy.updateMatrix();stems.setMatrixAt(si++,dummy.matrix);
    }
    for(let j=0;j<(id%3===0?4:6);j++){
     const level=Math.floor(j/2),sign=j%2?1:-1,t=.2+level*.3+(j%2)*.06;
     const unfold=ease((age-.25-level*.16)/.7),length=(.028+noise(id+j+16)*.018)*unfold*presence;
     const angle=sign*(.25+unfold*(.6+noise(id+j+13)*.45)),tilt=-.4+noise(id+j+41)*.8;
     point(t,from);
     instance(leaves,li,from.x-Math.sin(angle)*length*.7,from.y+Math.cos(angle)*length*.7,from.z+.006,.011*unfold*presence,length,.004*presence,angle,tilt);
     leafColor.setHSL(.23+noise(id+3)*.025,.21+noise(id+6)*.12,.31+noise(id+level+11)*.09);leaves.setColorAt(li++,leafColor);
    }
    // Most shoots are foliage; occasional five-petal flowers open last.
    if(id%3===0){
     const bloom=ease((age-.95)/.85)*presence,radius=(.018+noise(id+21)*.008)*bloom;
     point(1,from);petalColor.set(id%4===0?0xe3baa4:0xf3dfb4);
     for(let j=0;j<5;j++){
      const a=j*Math.PI*2/5;
      instance(petals,pi,from.x+Math.sin(a)*radius*.8,from.y+Math.cos(a)*radius*.8,from.z+.008,radius*.67,radius,.006*bloom,-a);
      petals.setColorAt(pi++,petalColor);
     }
     instance(hearts,hi++,from.x,from.y,from.z+.016,.008*bloom,.008*bloom,.006*bloom);
    }
   }
   for(const [mesh,count] of [[stems,si],[leaves,li],[petals,pi],[hearts,hi]]){
    mesh.count=count;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
   }
  },
  diagnostics(){return {count:state.plants.length,totalSprouted:state.totalSprouted,activity:state.activity,lifetimeSeconds:60,roots:roots.map(r=>({...r})),maxPlants:24,drawCalls:group.children.filter(m=>m.count>0).length};}
 };
}
