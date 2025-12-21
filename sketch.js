/*
  Background Color Interaction Shader
  - Object: Smooth Amorphous Glass Sphere (Transparent, No Ripples)
  - Lighting: Left-side source, sharp distortion
  - Interaction: 
	* Default: Warm/Gold background lights
	* Click: Cool/Blue background lights
	* The sphere reflects this environmental change.
*/

let theShader, moves = [0, 0], zoom = 0, dpr = Math.max(1, 0.5 * window.devicePixelRatio), ww = window.innerWidth, wh = window.innerHeight, startRandom;
let myCanvas;
let clickIntensity = 0.0; // 0.0(Warm) ~ 1.0(Cool)

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
uniform float clickStr; // 배경 색상 제어 변수

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

// --- Map Function (Smooth Sphere) ---
vec2 map(vec3 p) {
    // [Floor]
    float floorDist = -(p.z - 12.0);

    // [Sphere]
    vec3 q = p;
    q.x -= 2.4; 
    q.y -= 0.5; 

    // Amorphous Distortion
    float anim = T * 1.5;
    float distStr = 0.6;
    float bigDistortion = sin(q.x*3.0 + anim) * sin(q.y*2.5 + anim*1.2) * sin(q.z*3.2 + anim*0.8);

    // SDF
    float sphereRadius = 0.7;
    float sphere = length(q) - sphereRadius;
    sphere += bigDistortion * distStr;
    sphere *= 0.5; 

    // Union
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
    
    // Camera
    vec3 p = vec3(0, 0, -2.0 - 2.0 * S(10., -10., 10. * zoom));
    vec3 rd = N(vec3(uv, .7)); 

    vec3 col = vec3(0);
    float dd=.0, at=.0, side=1., e=1., bnz=.0, k=mix(.7,1.,rnd(uv+T*.01));

    // --- Color Definition (Interaction) ---
    // Warm: 오렌지/골드, Cool: 사이버 블루/청록
    vec3 warmColor = vec3(1.0, 0.6, 0.3); 
    vec3 coolColor = vec3(0.2, 0.6, 1.0);
    
    // 현재 조명 색상 계산
    vec3 currentLightColor = mix(warmColor, coolColor, clickStr);

    // Raymarching
    for (int i; i++<80;) {
        vec2 d = map(p);
        d.x *= side;

        if (abs(d.x) < 1e-3) {
            vec3 n = norm(p) * side;
            
            // 조명 위치 (왼쪽)
            vec3 lp = vec3(-8.0, 5.0, -5.0);
            vec3 l = N(lp - p);
            if (dot(l, n) < .0) l = -l;

            // ID 0: Floor (Background Pattern)
            if (d.y < 0.5) {
                float shd = bnz++ < 1. ? shadow(p + n * 5e-2, lp) : 1.;
                vec3 floorP = p;
                floorP.x -= T * 5.; // Movement
                
                // Pattern Shape
                float w = sin(floorP.x) - cos(floorP.y);
                
                // 기존의 하드코딩된 색상 대신 currentLightColor를 적용
                // 패턴의 강약(Shape)만 추출
                float patternIntensity = 0.0;
                patternIntensity += S(1., 1.5, w);       // Core
                patternIntensity += S(1., 1.2, w) * 0.5; // Rim
                patternIntensity += S(.5, 3.2, w) * 0.2; // Glow
                
                // 색상 적용
                vec3 floorCol = patternIntensity * currentLightColor;
                
                // 스크래치 질감 추가
                floorCol += step(scratch(uv), 1.-7e-7) * 0.2;
                
                col += floorCol * shd;
                break;
            } 
            // ID 1: Glass Sphere
            else {
                // Sphere reflects the "light source" which creates the background
                float fres = pow(clamp(1.0 + dot(rd, n), 0.0, 1.0), 4.0);
                float spec = pow(clamp(dot(reflect(rd, n), l), 0.0, 1.0), 128.0);

                // 구체의 하이라이트도 현재 조명 색상을 따라감
                col += spec * 3.0 * currentLightColor * e;
                col += fres * 1.5 * currentLightColor * e;

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
    
    // Monochrome Intro (Warm tone emphasis)
    // 인트로가 끝나면 원래 색(col)이 나오므로 인터랙션 색상이 적용됨
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

	// Interaction Logic: Click to Cool (1.0), Release to Warm (0.0)
	let targetIntensity = mouseIsPressed ? 1.0 : 0.0;
	clickIntensity = lerp(clickIntensity, targetIntensity, 0.05); // Smooth transition

	theShader.setUniform("resolution", [width, height]);
	theShader.setUniform("time", millis() / 1000.0);
	theShader.setUniform("move", moves);
	theShader.setUniform("pointerCount", mouseIsPressed ? 1 : 0);
	theShader.setUniform("zoom", zoom);

	// Pass color control value
	theShader.setUniform("clickStr", clickIntensity);

	noStroke();
	beginShape();
	vertex(0, 0);
	vertex(1, 0);
	vertex(1, 1);
	vertex(0, 1);
	endShape(CLOSE);
}