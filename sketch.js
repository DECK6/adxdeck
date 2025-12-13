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
const canvasStyle = 'width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;z-index:0;';
let myCanvas; // Global variable for canvas

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
	if (myCanvas) myCanvas.elt.style = canvasStyle;
}

const VERT_SRC = `
precision highp float;
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  // Map 0..1 geometry to -1..1 clip space
  vec4 positionVec4 = vec4(aPosition * 2.0 - 1.0, 1.0);
  gl_Position = positionVec4;
}
`;

const FRAG_SRC = `
precision highp float;
varying vec2 vTexCoord;
uniform vec2 resolution;
uniform float time;
uniform vec2 move;
uniform float zoom;

// SDF Function for spacing and shapes
float map(vec3 p) {
    vec3 q = fract(p) * 2.0 - 1.0;
    return length(q) - 0.25;
}

float trace(vec3 o, vec3 r) {
    float t = 0.0;
    for (int i = 0; i < 32; ++i) {
        vec3 p = o + r * t;
        float d = map(p);
        t += d * 0.5;
    }
    return t;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - resolution.xy * 0.5) / resolution.y;
    
    // Camera setup
    vec3 ro = vec3(move.x * 0.01, move.y * 0.01, time * 0.5); // Ray origin
    vec3 rd = normalize(vec3(uv, 1.0)); // Ray direction (zoom affected by Z component)

    // Raymarching
    float t = trace(ro, rd);
    
    // Coloring
    vec3 p = ro + rd * t;
    float fog = 1.0 / (1.0 + t * t * 0.1);
    vec3 col = vec3(0.0, 240.0/255.0, 255.0/255.0) * fog; // Cyan glow

    gl_FragColor = vec4(col, 1.0);
}
`;

function setup() {
	pixelDensity(1);
	myCanvas = createCanvas(ww, wh, WEBGL);

	// Explicitly set styles to ensure visibility even if parenting fails
	myCanvas.style('position', 'fixed');
	myCanvas.style('top', '0');
	myCanvas.style('left', '0');
	myCanvas.style('z-index', '-1');
	myCanvas.style('width', '100vw');
	myCanvas.style('height', '100vh');

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
	// Draw a quad covering the screen with normalized coordinates (0..1)
	// The vertex shader expects 0..1 to map to -1..1 clip space
	noStroke();
	beginShape();
	vertex(0, 0);
	vertex(1, 0);
	vertex(1, 1);
	vertex(0, 1);
	endShape(CLOSE);
}

// (Override removed for compatibility with p5.js v1.9.4)
