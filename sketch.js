/*
It is a 3D shader made for the weekly Creative Coding Challenge
(https://openprocessing.org/curation/78544) on the theme "Marching".

There is a light ray marching through a scene made of signed
distance fields. 

Translucency and surface distortion are the main reasons one would
choose a raymarcher over a mesh-based renderer.

Raphaël, this time you can zoom. I have mapped the mouse wheel.
*/

let theShader, moves = [0, 0], zoom = 0, dpr = Math.max(1, 0.5 * window.devicePixelRatio), ww = window.innerWidth, wh = window.innerHeight, startRandom;
let myCanvas;

const VERT_SRC = `#version 300 es
precision highp float;
in vec3 aPosition;
void main() {
    gl_Position = vec4(aPosition * 2.0 - 1.0, 1.0);
}
`;

const FRAG_SRC = `#version 300 es
/*********
* made by Matthias Hurrle (@atzedent)
* Tip: For syntax highlighting, paste the code here:
* https://shadered.org/app?fork=4Y3P9GQID0
*/ 
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec2 move;
uniform float zoom;
#define FC gl_FragCoord.xy
#define R resolution
#define T time
#define N normalize
#define S smoothstep
#define MN min(R.x,R.y)
// fast (unprecise) 2D rotation
#define rot(a) mat2(cos((a)-vec4(0,11,33,0)))
// Rotates the camera
void cam(inout vec3 p) {
	p.yx*=rot(-.42);
	p.yz*=rot(cos(1.6+move.y*6.3/MN));
	p.xz*=rot(T*.2-move.x*6.3/MN);
}
// Returns the signed distance function of a single chain link
float link(vec3 p, float r1, float r2, float h) {
	// add ripples
	p+=sin(p*vec3(80,1,1))*.005;
	// elongate along y-axis
	p.y-=clamp(p.y,-h,h);
	// torus
	vec2 c=vec2(length(p.xy)-r1, p.z);
	return length(c)-r2;
}
// Returns the distance to the scene at point p and its associated object-id
vec2 map(vec3 p) {
	// spacing of the domain repetition
	const float n=4.5;
	// pre-calculate floor with original point
	float floor=-(p.z-12.);
	// animate camera around chain
	cam(p);
	// flip axis for second link and move apart a fair bit
	vec3 u=p.zyx+vec3(0,2.25,0);
	// calculate domain repetition for each of the two links
	p.y-=clamp(round(p.y/n),-3.,3.)*n;
	u.y-=clamp(round(u.y/n),-3.,3.)*n;
	// distance calculation
	float
	d=abs(link(p,.7,.3,.77))-.04,
	e=abs(link(u,.7,.3,.77))-.04;
	// union of floor and links
	vec2 a=vec2(floor,0), b=vec2(min(d,e),1);
	a=a.x<b.x?a:b;
	return a;
}
// Returns the normal of the surface at the given point
vec3 norm(vec3 p) {
	float h=1e-2; vec2 k=vec2(-1,1);
	return N(
		k.xyy*map(p+k.xyy*h).x+
		k.yxy*map(p+k.yxy*h).x+
		k.yyx*map(p+k.yyx*h).x+
		k.xxx*map(p+k.xxx*h).x
	);
}
// Returns a pseudo random number for a given point (white noise)
float rnd(vec2 p) {
	p=fract(p*vec2(12.9898,78.233));
	p+=dot(p,p+34.56);
	return fract(p.x*p.y);
}
// Returns the shadow value of the given point with the given light position
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
// Returns a scratch pattern at the given point
float scratch(vec2 uv) {
  float x=uv.x+T*1e1,
  rx=rnd(vec2(x)),
  l=step(1.-7e-4,sin(x*1e3*(rx*1e-2+1e-2))),
  y=uv.y+T*9e-4,
  ry=rnd(vec2(y));
  l*=sin(y*1e3*ry);
  return clamp(1.-l,.0,1.);
}
// render the scene
vec3 scene() {
	// normalize the canvas dimensions (-.5/.5)
	vec2 uv=(FC-.5*R)/MN;
    uv.x -= 0.35; // Shift center to the right
	// shortest or longest component of the unit vector depending on orientation
	float mn=R.x>R.y?max(abs(uv.x),abs(uv.y)):min(abs(uv.x),abs(uv.y));
	// initialize the color vector
	vec3 col=vec3(0),
	// place the camera at two units in front of the scene and allow smooth zooming
	p=vec3(0,0,-2.-2.*S(10.,-10.,10.*zoom)),
	// construct a fish-eye lense
	rd=N(vec3(uv,.7+S(.0,3.2,max(dot(mn,mn),.0))));
	// keep track of distance, glow, side...
	float dd=.0, at=.0, side=1., e=1., bnz=.0, k=mix(.7,1.,rnd(uv+T*.01));
	// raymarching loop
	for (int i; i++<80;) {
		// get distance and material
		vec2 d=map(p);
		// multiply distance by side (inside or outside the link)
		d.x*=side;
		// ray has hit a surface
		if (abs(d.x)<1e-3) {
			// calculate surface normal, place light and normalize light vector
			vec3 n=norm(p)*side, lp=vec3(16,2,-20), l=N(lp-p);
			// invert light vector if inside a link
			if (dot(l,n)<.0) l=-l;
			// calculate diffuse light, fresnel, specular light and shadows
			float dif=clamp(dot(l,n),.0,1.), fres=pow(clamp(1.+dot(rd,n),.0,1.),5.),
			spec=d.y<1.?.0:pow(clamp(dot(reflect(rd,n),l),.0,1.),128.),
			// calculate shadow only once (the first time)
			shd=bnz++<1.?shadow(p+n*5e-2,lp):1.;
			// add diffuse light dpending on the material (harder if it is a link)
			col+=pow(dif,d.y<1.?5.:15.)*.85*vec3(.4,.9,1);
			// darken by a factor indicating the level of transparancy
			col*=e;
			// add specular light
			col+=1e2*spec;
			// add a shimmer to surfaces at a shallow angle
			col+=3.*fres*vec3(.4,.9,1);
			// reduce the factor so that lower layers can be darkened
			e*=.95;
			// darken and add some grain
			col*=.75*k;
			// shade floor
			if (d.y<1.) {
				// add the chain's shadow
				col*=shd;
				// add movement to the right
				p.x-=T*5.;
				// generate a pattern
				float w=sin(p.x)-cos(p.y);
				// add the pattern
				col+=S(1.,1.5,w);
				// add scaled version to the red channel for a red outline
				col.r+=S(1.,1.2,w);
				// add scaled version to the green channel turn color back to yellow
				col.g+=S(.5,3.2,w);
				// add scratch effect
				col+=step(scratch(uv),1.-7e-7)*.2;
				// exit the raymarcher since we already hit the floor
				break;
			}
			// flip sides since we will transition from outside to inside or vice versa
			side=-side;
			// refract the ray according to the side
			vec3 rdo=refract(rd,n,1.+side*.25);
			// instead of refraction calculate the reflection if the surface is at a shallow angle
			if (dot(rdo,rdo)==.0) rdo=reflect(rd,n);
			// set the ray direction according to the pre-calculated ray
			rd=rdo;
			// offset the distance to avoid artifacts
			d.x=5e-2;
		}
		// keep track of the overall distance the ray travelled through the scene
		dd+=d.x;
		// accumulate glow for the glass effect
		at+=.05*(.05/dd*k);
		// advance the ray
		p+=rd*d.x;
	}
	// increase the glow
	at*=5.;
	// add the glow and tint it
	col+=at*at*at*at*vec3(.4,.9,1);
	// return the color of the scene
	return col;
}
// The main entry of the fragment shader
void main() {
	// calculate the output color
	vec3 col=scene();
	// calculate a vignette and add it to the output color
	vec2 uv=FC/R*2.-1.;
	uv*=.95;
	uv*=uv*uv*uv*uv;
	float v=pow(dot(uv,uv),.8);
	col=mix(col,vec3(0),v);
	// calculate the animation time for the intro
	float t=min(time*.3,1.);
	// animate from black
	col=mix(vec3(0),col,t);
	// animate from monochrome
	col=mix(vec3(dot(col,vec3(.21,.71,.07)))*vec3(.8,.9,1),col,pow(t,5.));
	// output the final color
	O=vec4(col,1);
}
`;

function mouseMove() {
	if (!mouseIsPressed) return;
	moves[0] += mouseX - pmouseX;
	moves[1] += pmouseY - mouseY;
}

function mouseWheel(e) {
	zoom = lerp(
		zoom,
		max(-1, min(1, zoom + e.delta)),
		0.05
	);
}

function windowResized() {
	ww = window.innerWidth; wh = window.innerHeight;
	resizeCanvas(ww, wh);

	// Ensure fallback styles persist on resize
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
	myCanvas = createCanvas(ww, wh, WEBGL);

	// Explicitly set styles to ensure visibility
	myCanvas.style('position', 'fixed');
	myCanvas.style('top', '0');
	myCanvas.style('left', '0');
	myCanvas.style('z-index', '-1');
	myCanvas.style('width', '100vw');
	myCanvas.style('height', '100vh');
	// Force black background on canvas to avoid white flashes
	myCanvas.style('background-color', '#000000');

	startRandom = Math.random();

	// Create shader from inlined sources
	theShader = createShader(VERT_SRC, FRAG_SRC);

	// Attach canvas to the hero section instead of default body if possible
	let heroSection = document.getElementById('hero-canvas-container');
	if (heroSection) {
		console.log("AdxDeck: Attaching canvas to #hero-canvas-container");
		myCanvas.parent('hero-canvas-container');
	} else {
		console.error("AdxDeck: #hero-canvas-container NOT FOUND. Canvas appended to body.");
	}
}

function draw() {
	shader(theShader);
	mouseMove();
	theShader.setUniform("resolution", [width, height]);
	theShader.setUniform("time", millis() / 1000.0);
	theShader.setUniform("move", moves);
	theShader.setUniform("pointerCount", mouseIsPressed ? 1 : 0);
	theShader.setUniform("zoom", zoom);

	// Draw full screen quad
	// Attempting to match user provided rect logic but typically WebGL needs -1 to 1 mapping in shader
	// The user's vertex shader does: gl_Position=vec4(aPosition*2.-1., 1.0);
	// p5 rect(0,0,w,h) likely sends 0..w coordinates.
	// If I use beginShape/vertex I can control 0..1 normalization easily.
	// Let's stick to the normalized 0..1 quad which works with the vert shader "aPosition * 2.0 - 1.0"

	noStroke();
	beginShape();
	vertex(0, 0);
	vertex(1, 0);
	vertex(1, 1);
	vertex(0, 1);
	endShape(CLOSE);
}
