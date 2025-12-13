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
const canvasStyle = 'width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;z-index:-1;';

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
    canvas.style = canvasStyle;
}

function preload() {
    theShader = loadShader('vert.glsl', 'frag.glsl');
}

function setup() {
    pixelDensity(1);
    createCanvas(ww, wh, WEBGL);
    canvas.style = canvasStyle;
    startRandom = Math.random();

    // Attach canvas to the hero section instead of default body if possible, or just keep it as background
    let heroSection = document.getElementById('hero-canvas-container');
    if (heroSection) {
        heroSection.appendChild(canvas);
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
    rect(0, 0, width, height);
}

// Override to enable webgl2 and support for high resolution and retina displays
p5.RendererGL.prototype._initContext = function () {
    try {
        this.drawingContext = this.canvas.getContext('webgl2', this._pInst._glAttributes) ||
            this.canvas.getContext('experimental-webgl', this._pInst._glAttributes);
        if (this.drawingContext === null) {
            throw new Error('Error creating webgl context');
        } else {
            const gl = this.drawingContext;
            gl.viewport(0, 0, ww, wh);
            this._viewport = this.drawingContext.getParameter(this.drawingContext.VIEWPORT);
        }
    } catch (er) { throw er; }
};
