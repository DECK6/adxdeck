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

// ... (Shaders stay the same)

function setup() {
	pixelDensity(1);
	myCanvas = createCanvas(ww, wh, WEBGL);
	myCanvas.elt.style = canvasStyle;
	startRandom = Math.random();

	// Create shader from inlined sources
	theShader = createShader(VERT_SRC, FRAG_SRC);

	// Attach canvas to the hero section instead of default body if possible, or just keep it as background
	let heroSection = document.getElementById('hero-canvas-container');
	if (heroSection) {
		myCanvas.parent('hero-canvas-container'); // Use p5's parent() method
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
