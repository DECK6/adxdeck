import {Quaternion,Vector3,Matrix4} from './vendor/three/three.module.js';
// A screen-plane rotation, expressed in the hand's current parent coordinates.
export function screenRollQuaternion(parentWorld,rest,angle){
 const world=parentWorld.clone().multiply(rest);
 const axis=new Vector3(0,0,1).applyQuaternion(world.invert());
 return rest.clone().multiply(new Quaternion().setFromAxisAngle(axis,angle));
}

function frame(forward,normal){
 const y=forward.clone().normalize(),z=normal.clone().addScaledVector(y,-normal.dot(y)).normalize(),x=new Vector3().crossVectors(y,z).normalize();
 return new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(x,y,z));
}
export function palmQuaternion(parentWorld,restWorld,forward,normal){
 const original=frame(new Vector3(0,1,0).applyQuaternion(restWorld),new Vector3(0,0,1));
 const target=frame(new Vector3().fromArray(forward),new Vector3().fromArray(normal));
 return parentWorld.clone().invert().multiply(target).multiply(original.invert()).multiply(restWorld);
}
