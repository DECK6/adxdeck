/*
  Variable Frequency Glass Sphere
  - Default: Smooth amorphous sphere (Freq = 0)
  - Click Interaction: Surface ripple frequency interpolates from 0 to 20
  - Visual: Transitions from clear liquid to textured glass
*/

let theShader, moves = [0, 0], zoom = 0, dpr = Math.max(1, 0.5 * window.devicePixelRatio), ww = window.innerWidth, wh = window.innerHeight, startRandom;
let myCanvas;

// 리플 주파수 변수 (JS에서 제어)
let currentRippleFreq = 0;

const VERT_SRC = `#version 300 es
precision highp float;
in vec3 aPosition;
void main() {
    gl_Position = vec4(aPosition * 2.0 - 1.0, 1.0);
}
`;

const FRAG_SRC = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec2 move;
uniform float zoom;

// JS에서 전달받는 리플 주파수 (0.0 ~ 20.0)
uniform float rippleFreq; 

#define FC gl_FragCoord.xy
#define R resolution
#define T time
#define N normalize
#define S smoothstep
#define MN min(R.x,R.y)

// --- Utilities ---
#define rot(a) mat2(cos((a)-vec4(0,11,33,0)))

float rnd(vec2 p) {
    p=fract(p*vec2(12.9898,78.233));
    p+=dot(p,p+34.56);
    return fract(p.x*p.y);
}

float scratch(vec2 uv) {
    float x=uv.x+T*1e1,
    rx=rnd(vec2(x)),
    l=step(1.-7e-4,sin(x*1e3*(rx*1e-2+1e-2))),
    y=uv.y+T*9e-4,
    ry=rnd(vec2(y));
    l*=sin(y*1e3*ry);
    return clamp(1.-l,.0,1.);
}

// --- Map Function ---
vec2 map(vec3 p) {
    // [Floor] Original Logic
    float floorDist = -(p.z - 12.0);

    // [Sphere]
    vec3 q = p;
    q.x -= 2.4; 
    q.y -= 0.5; 

    // A. Shape Distortion (형태의 큰 일렁임 - 항상 작동)
    // 기본 상태가 너무 정적이지 않도록 형태 자체는 계속 움직이게 둡니다.
    float anim = T * 1.5;
    float distStr = 0.6;
    float bigDistortion = sin(q.x*3.0 + anim) * sin(q.y*2.5 + anim*1.2) * sin(q.z*3.2 + anim*0.8);

    // B. Micro-Texture (Ripple Effect) - 인터랙션 적용 부분
    // rippleFreq가 0이면 sin(0)이 되어 리플이 완전히 사라짐 (매끈함)
    // rippleFreq가 20까지 증가하면 자글자글해짐
    float ripples = sin(q.x * rippleFreq) * sin(q.y * rippleFreq) * sin(q.z * rippleFreq);
    
    // 텍스처 깊이 (주파수가 높을수록 텍스처가 촘촘히 박힘)
    float textureStr = 0.02; 

    // SDF Calculation
    float sphereRadius = 0.7;
    float sphere = length(q) - sphereRadius;
    
    sphere += bigDistortion * distStr; // 큰 왜곡 적용
    sphere += ripples * textureStr;    // 리플 텍스처 적용
    
    sphere *= 0.5; // Lipschitz correction

    // [Union]
    vec2 res = vec2(floorDist, 0.0);
    if(sphere < res.x) {
        res = vec2(sphere, 1.0);
    }
    return res;
}

// Normals
vec3 norm(vec3 p) {
    float h=1e-2; vec2 k=vec2(-1,1);
    return N(
        k.xyy*map(p+k.xyy*h).x+
        k.yxy*map(p+k.yxy*h).x+
        k.yyx*map(p+k.yyx*h).x+
        k.xxx*map(p+k.xxx*h).x
    );
}

// Shadows
float shadow(vec3 p, vec3 lp) {
    float shd=1., maxd=length(lp-p);
    vec3 l=normalize(lp-p);
    for (float i=1e-2; i<maxd;) {
        float d=map(p+l*i).x;
        if (d<1e-2) {
            shd=.0;
            break;
        }
        shd=min(shd,64.*d/i);
        i+=d;
    }
    return shd;
}

// --- Scene Render ---
vec3 scene() {
    vec2 uv=(FC-.5*R)/MN;
    
    vec3 p = vec3(0, 0, -2.0 - 2.0 * S(10., -10., 10. * zoom));
    vec3 rd = N(vec3(uv, .7)); 

    vec3 col = vec3(0);
    float dd=.0, at=.0, side=1., e=1., bnz=.0, k=mix(.7,1.,rnd(uv+T*.01));

    for (int i; i++<80;) {
        vec2 d = map(p);
        d.x *= side;

        if (abs(d.x) < 1e-3) {
            vec3 n = norm(p) * side;
            vec3 lp = vec3(16, 2, -20);
            vec3 l = N(lp - p);
            if (dot(l, n) < .0) l = -l;

            if (d.y < 0.5) { // Floor (ID 0)
                float shd = bnz++ < 1. ? shadow(p + n * 5e-2, lp) : 1.;
                vec3 floorP = p;
                floorP.x -= T * 5.;
                float w = sin(floorP.x) - cos(floorP.y);
                
                vec3 floorCol = vec3(0);
                floorCol += S(1., 1.5, w);
                floorCol.r += S(1., 1.2, w);
                floorCol.g += S(.5, 3.2, w);
                floorCol += step(scratch(uv), 1.-7e-7) * .2;
                
                col += floorCol * shd;
                break;
            } else { // Sphere (ID 1)
                float dif = clamp(dot(l, n), .0, 1.);
                float fres = pow(clamp(1. + dot(rd, n), .0, 1.), 4.);
                float spec = pow(clamp(dot(reflect(rd, n), l), .0, 1.), 60.);

                col += spec * 2.5 * e;
                col += fres * 1.0 * vec3(0.7, 0.8, 1.0) * e;

                e *= .95;
                
                side = -side;
                vec3 rdo = refract(rd, n, 1.0 + side * 0.45);
                if (dot(rdo, rdo) == .0) rdo = reflect(rd, n);
                rd = rdo;
                d.x = 5e-2;
            }
        }
        
        dd += d.x;
        p += rd * d.x;
    }
    return col;
}

void main() {
    vec3 col = scene();
    
    vec2 uv = FC/R*2.-1.;
    uv *= .95;
    uv *= uv*uv*uv*uv;
    float v = pow(dot(uv,uv),.8);
    col = mix(col, vec3(0), v);
    
    float t = min(time*.3, 1.);
    col = mix(vec3(0), col, t);
    col = mix(vec3(dot(col, vec3(.21,.71,.07))) * vec3(.8,.9,1), col, pow(t, 5.));
    
    O = vec4(col, 1);
}
`;

function windowResized() {
	resizeCanvas(window.innerWidth, window.innerHeight);
	if (myCanvas) {
		myCanvas.style('position', 'fixed');
		myCanvas.style('top', '0');
		myCanvas.style('left', '0');
		myCanvas.style('z-index', '-1');
		myCanvas.style('width', '100vw');
		myCanvas.style('height', '100vh');
	}
}

function setup() {
	pixelDensity(1);
	myCanvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);

	myCanvas.style('position', 'fixed');
	myCanvas.style('top', '0');
	myCanvas.style('left', '0');
	myCanvas.style('z-index', '-1');
	myCanvas.style('width', '100vw');
	myCanvas.style('height', '100vh');
	myCanvas.style('background-color', '#000000');

	startRandom = Math.random();
	theShader = createShader(VERT_SRC, FRAG_SRC);

	let heroSection = document.getElementById('hero-canvas-container');
	if (heroSection) {
		myCanvas.parent('hero-canvas-container');
	}
}

function draw() {
	shader(theShader);

	// --- 인터랙션 로직 수정 ---
	// 목표 주파수: 클릭 시 20.0, 떼면 0.0
	let targetFreq = mouseIsPressed ? 20.0 : 0.0;

	// 부드러운 전환 (Lerp)
	currentRippleFreq = lerp(currentRippleFreq, targetFreq, 0.05);

	theShader.setUniform("resolution", [width, height]);
	theShader.setUniform("time", millis() / 1000.0);
	theShader.setUniform("move", moves);
	theShader.setUniform("pointerCount", mouseIsPressed ? 1 : 0);
	theShader.setUniform("zoom", zoom);

	// 계산된 주파수를 쉐이더로 전달
	theShader.setUniform("rippleFreq", currentRippleFreq);

	noStroke();
	beginShape();
	vertex(0, 0);
	vertex(1, 0);
	vertex(1, 1);
	vertex(0, 1);
	endShape(CLOSE);
}