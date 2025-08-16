/* p5.js instance-mode sketch to avoid global collisions
   Poster-inspired neon rings & pillars with keyword seeding
*/

(function(){
  let kkalSeed = 1;
  let keyword = '';

  function hashString(str){
    let h = 2166136261 >>> 0; // FNV-1a
    for (let i=0;i<str.length;i++){
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function seededRandom(seed){
    let s = seed >>> 0;
    return function(){
      s = (1664525 * s + 1013904223) >>> 0;
      return (s & 0xffffffff) / 0x100000000;
    }
  }

  // expose for main.js
  window.updateKkalSeed = function(str){
    keyword = str || '';
    kkalSeed = hashString(keyword || 'kkal');
  }

  const sketch = (p) => {
    let t = 0;
    const defaultPalette = [
      [215,255,47],   // neon lime
      [109,231,242],  // cyan
      [213,107,255],  // magenta
      [255,154,60],   // orange
      [167,255,235]   // mint
    ];
    let palette = defaultPalette.slice();

    p.setup = function(){
      const holder = document.getElementById('p5-holder');
      const c = p.createCanvas(holder.clientWidth, holder.clientHeight, p.WEBGL);
      c.parent('p5-holder');
      p.pixelDensity(window.devicePixelRatio || 1);
      p.noFill();
      p.angleMode(p.DEGREES);
      window.updateKkalSeed('');
      palette = defaultPalette.slice();
    }

    p.windowResized = function(){
      const holder = document.getElementById('p5-holder');
      p.resizeCanvas(holder.clientWidth, Math.max(340, window.innerHeight*0.56));
    }

    function getCol(idx){
      if (!Array.isArray(palette) || palette.length < 1) palette = defaultPalette.slice();
      const n = palette.length;
      const i = ((idx % n) + n) % n;
      return palette[i] || defaultPalette[0];
    }

    p.draw = function(){
      p.background(0, 20); // slight persistence for trail feel
      if (!Array.isArray(palette) || palette.length < 1) palette = defaultPalette.slice();
      const rnd = seededRandom(kkalSeed);

      // base rotation from mouse
      const rot = p.map(p.mouseX, 0, p.width, -30, 30, true);
      const density = Math.floor(p.map(p.mouseY, 0, p.height, 8, 32, true));

      // central glow
      p.push();
      for(let r=380;r>20;r-=30){
        const a = p.map(r, 20, 380, 8, 80);
        p.stroke(215,255,47, a*0.2);
        p.ellipse(0, 150, r*2.2, r*0.8);
      }
      p.pop();

      // rotating ring stacks
      p.push();
      p.rotateX(60 + rot*0.2);
      p.rotateZ(p.frameCount*0.2);
      const layers = 6;
      for (let i=0;i<layers;i++){
        const rr = 80 + i*40;
        const hueIdx = (i + Math.floor(p.frameCount/30));
        const col = getCol(hueIdx);
        p.stroke(col[0], col[1], col[2], 180);
        for (let j=0;j<density;j++){
          const a = j * (360/density) + rot*2;
          p.push();
          p.rotateZ(a + i*12 + p.sin(t + i*0.7)*10);
          p.ellipse(0, 0, rr*4, rr*1.2 + p.sin(t*1.2 + j)*20);
          p.pop();
        }
      }
      p.pop();

      // vertical neon pillars reminiscent of poster rectangles
      p.push();
      p.rotateZ(-10 + rot*0.1);
      const pillars = 3;
      for(let pi=0;pi<pillars;pi++){
        const px = -p.width/4 + pi*(p.width/4);
        const col = getCol(pi+2);
        p.stroke(col[0], col[1], col[2], 200);
        for(let y=-p.height/3;y<p.height/3;y+=8){
          const wid = 40 + 10*pi + 8*p.sin((y+t)*0.12 + pi);
          p.line(px - wid/2, y, px + wid/2, y);
        }
      }
      p.pop();

      // floating sparks
      p.push();
      const sparkCount = 50;
      for(let s=0;s<sparkCount;s++){
        const col = getCol(Math.floor(rnd()*palette.length));
        p.stroke(col[0], col[1], col[2], 150);
        const x = p.map(p.noise(s*0.1, t*0.01), 0, 1, -p.width/2, p.width/2);
        const y = p.map(p.noise(s*0.13, t*0.011), 0, 1, -p.height/2, p.height/2);
        p.point(x, y);
      }
      p.pop();

      // keyword text pulse
      if (keyword){
        p.push();
        p.rotateZ(p.sin(t*1.2)*3);
        const kcol = getCol(Math.floor(Math.abs(p.sin(t*0.03))*palette.length));
        p.stroke(kcol[0], kcol[1], kcol[2], 240);
        p.strokeWeight(1.5);
        p.noFill();
        const w = p.map(p.sin(t*0.7), -1, 1, p.width*0.1, p.width*0.5);
        p.rectMode(p.CENTER);
        p.rect(0, -p.height*0.18, w, 46, 8);
        p.drawingContext.shadowBlur = 20;
        p.drawingContext.shadowColor = `rgba(${kcol[0]},${kcol[1]},${kcol[2]},0.6)`;
        p.fill(kcol[0], kcol[1], kcol[2]);
        p.noStroke();
        p.textFont('Black Han Sans');
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(Math.min(64, p.width*0.06));
        p.text(keyword, 0, -p.height*0.18);
        p.pop();
      }

      t += 0.8;
    }
  };

  new p5(sketch, 'p5-holder');
})();
