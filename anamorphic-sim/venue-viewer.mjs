import * as THREE from './assets/vendor/three.module.js';
import {makeSurface,spec} from './screen-model.mjs';

const host=document.querySelector('#venue-canvas');
const fallback=document.querySelector('#venue-fallback');
const panel=document.querySelector('#venue-example');
const status=document.querySelector('#venue-status');
const buttons=[...document.querySelectorAll('[data-venue-view]')];
const explanations={overview:'건물과 곡면 LED의 관계를 보는 시점입니다.',sweet:'설정한 관람 위치에서 본 모습입니다. 화면에 맞춰 왜곡한 영상이 하나의 장면으로 보입니다.'};
let renderer,scene,camera,selected='sweet',ready=false,started=false;

function select(mode){
  selected=mode;
  if(!ready)return;
  host.hidden=false;
  fallback.hidden=true;
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.venueView===mode)));
  status.textContent=explanations[mode];
  if(mode==='sweet'){
    // Experimental reference pose. These values are not surveyed site calibration.
    camera.position.set(-4,1.6,55);
    camera.up.set(0,1,0);
    camera.lookAt(-4+0.06608994388976171,1.6+0.25586382096676463,55-0.9644510482325869);
    camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(1/2.917091781914334));
    camera.updateProjectionMatrix();
    camera.projectionMatrix.elements[8]=-0.09079928567248592;
    camera.projectionMatrix.elements[9]=-0.04511331761018132;
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  }else{
    camera.position.set(67,39,91);camera.lookAt(-2,13,-9);camera.fov=44;camera.updateProjectionMatrix();
  }
  renderer.render(scene,camera);
}

async function init(){
  try{
    const texture=await new THREE.TextureLoader().loadAsync(new URL('./assets/shinsegae-output.png',import.meta.url).href);
    texture.colorSpace=THREE.SRGBColorSpace;
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.domElement.setAttribute('role','img');
    renderer.domElement.setAttribute('aria-label','신세계 본점 공개 화면 규격에 AI 제작 결과를 적용한 3D 시뮬레이션');
    host.append(renderer.domElement);
    scene=new THREE.Scene();scene.background=new THREE.Color('#d7d8d3');
    camera=new THREE.PerspectiveCamera(44,16/9,.05,1000);
    const surface=makeSurface();
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(surface.positions,3));
    geometry.setAttribute('uv',new THREE.Float32BufferAttribute(surface.uv,2));
    geometry.computeVertexNormals();
    const screen=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));
    screen.position.z=.04;scene.add(screen);
    // A neutral architectural volume gives scale, without impersonating the real building.
    const shape=new THREE.Shape();
    const outline=surface.outline;
    shape.moveTo(outline[0][0],-outline[0][1]);
    outline.slice(1).forEach(p=>shape.lineTo(p[0],-p[1]));
    shape.lineTo(outline.at(-1)[0],38);shape.lineTo(outline[0][0],38);shape.closePath();
    const volumeGeometry=new THREE.ExtrudeGeometry(shape,{depth:spec.bottom+spec.height+1.2,bevelEnabled:false,steps:1});
    volumeGeometry.rotateX(-Math.PI/2);
    const volume=new THREE.Mesh(volumeGeometry,new THREE.MeshStandardMaterial({color:'#b7b4a9',roughness:.9}));
    volume.position.z=-.08;scene.add(volume);
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(230,190),new THREE.MeshStandardMaterial({color:'#bdc0bb',roughness:1}));
    ground.rotation.x=-Math.PI/2;ground.position.y=-.04;scene.add(ground);
    const grid=new THREE.GridHelper(180,36,0x979f98,0xaeb5ae);grid.position.y=.005;scene.add(grid);
    // Repeated facade joints show physical scale beneath the LED.
    const jointMaterial=new THREE.MeshStandardMaterial({color:'#77796f',roughness:1});
    for(let i=0;i<outline.length-1;i++){
      const a=outline[i],b=outline[i+1],length=Math.hypot(b[0]-a[0],b[1]-a[1]);
      if(length<2)continue;
      for(let t=.07;t<1;t+=.13){
        const post=new THREE.Mesh(new THREE.BoxGeometry(.12,7.5,.12),jointMaterial);
        post.position.set(a[0]+(b[0]-a[0])*t,3.75,a[1]+(b[1]-a[1])*t+.11);scene.add(post);
      }
    }
    scene.add(new THREE.HemisphereLight(0xffffff,0x7f8582,2.3));
    const sun=new THREE.DirectionalLight(0xfff1db,2.6);sun.position.set(-40,70,50);scene.add(sun);
    ready=true;host.dataset.ready='true';fallback.hidden=true;
    const resize=()=>{if(!panel.open||!ready)return;const width=host.parentElement.clientWidth;if(!width)return;renderer.setSize(width,width*9/16);select(selected)};
    new ResizeObserver(resize).observe(host.parentElement);resize();
    renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;host.hidden=true;fallback.hidden=false;status.textContent='3D 표시가 중단되어 실제 앱 캡처를 보여드립니다.';buttons.forEach(b=>b.disabled=true)});
  }catch(error){
    host.hidden=true;fallback.hidden=false;host.dataset.error=error.message;
    status.textContent='이 환경에서는 실제 앱 캡처로 예시를 보여드립니다.';
    buttons.forEach(b=>b.disabled=true);
  }
}
buttons.forEach(button=>button.addEventListener('click',()=>select(button.dataset.venueView)));
panel.addEventListener('toggle',()=>{if(panel.open&&!started){started=true;init()}});
if(panel.open){started=true;init()}
