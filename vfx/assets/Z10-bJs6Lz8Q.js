const e=`var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var Z10_crt_terminal_effect_exports = {};
__export(Z10_crt_terminal_effect_exports, {
  default: () => Z10_crt_terminal_effect_default
});
module.exports = __toCommonJS(Z10_crt_terminal_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const curvature = Math.min(1, Math.max(0, Number(ctx.params.curvature ?? 0.68)));
    const persistence = Math.min(1, Math.max(0, Number(ctx.params.persistence ?? 0.72)));
    const scanRate = Math.min(4, Math.max(1, Math.round(Number(ctx.params.scanRate ?? 2))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const screenX = ctx.width * 0.075;
    const screenY = ctx.height * 0.07;
    const screenWidth = ctx.width * 0.85;
    const screenHeight = ctx.height * 0.84;
    const radiusX = screenWidth * 0.055;
    const radiusY = screenHeight * 0.07;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.fillStyle = "#020303";
    g.strokeStyle = "#343A3D";
    g.lineWidth = Math.max(4, ctx.width * 0.016);
    g.beginPath();
    g.moveTo(screenX + radiusX, screenY);
    g.lineTo(screenX + screenWidth - radiusX, screenY);
    g.quadraticCurveTo(screenX + screenWidth, screenY, screenX + screenWidth, screenY + radiusY);
    g.lineTo(screenX + screenWidth, screenY + screenHeight - radiusY);
    g.quadraticCurveTo(screenX + screenWidth, screenY + screenHeight, screenX + screenWidth - radiusX, screenY + screenHeight);
    g.lineTo(screenX + radiusX, screenY + screenHeight);
    g.quadraticCurveTo(screenX, screenY + screenHeight, screenX, screenY + screenHeight - radiusY);
    g.lineTo(screenX, screenY + radiusY);
    g.quadraticCurveTo(screenX, screenY, screenX + radiusX, screenY);
    g.closePath();
    g.fill();
    g.stroke();
    g.save();
    g.clip();
    if (ctx.subject.bitmap) {
      const bitmap = ctx.subject.bitmap;
      const strips = Math.max(48, Math.round(screenHeight / 2));
      for (let row = 0; row < strips; row += 1) {
        const normalized = (row + 0.5) / strips;
        const edge = Math.abs(normalized * 2 - 1);
        const inset = edge * edge * curvature * screenWidth * 0.055;
        const wobble = Math.sin(phase * scanRate + row * 0.19) * curvature * 0.55;
        const sourceY = row / strips * bitmap.height;
        const destinationY = screenY + row / strips * screenHeight;
        const stripHeight = screenHeight / strips + 1;
        g.globalAlpha = 0.9;
        g.drawImage(bitmap, 0, sourceY, bitmap.width, bitmap.height / strips + 1, screenX + inset + wobble, destinationY, screenWidth - inset * 2, stripHeight);
      }
      g.save();
      g.globalCompositeOperation = "screen";
      g.globalAlpha = persistence * 0.14;
      g.filter = \`blur(\${1 + persistence * 3}px)\`;
      g.drawImage(bitmap, screenX - 2, screenY, screenWidth + 4, screenHeight);
      g.globalAlpha = persistence * 0.08;
      g.drawImage(bitmap, screenX + Math.cos(phase) * 3, screenY + Math.sin(phase) * 2, screenWidth, screenHeight);
      g.restore();
    }
    g.globalAlpha = 0.22;
    g.fillStyle = "#0D0E10";
    const scanSpacing = Math.max(3, Math.round(ctx.height / 100));
    for (let y = screenY; y < screenY + screenHeight; y += scanSpacing) g.fillRect(screenX, y, screenWidth, 1);
    const beamY = screenY + ctx.t * scanRate % 1 * screenHeight;
    const beam = g.createLinearGradient(0, beamY - 20, 0, beamY + 20);
    beam.addColorStop(0, "rgba(94,231,243,0)");
    beam.addColorStop(0.5, signal);
    beam.addColorStop(1, "rgba(94,231,243,0)");
    g.globalCompositeOperation = "screen";
    g.globalAlpha = 0.1 + persistence * 0.12;
    g.fillStyle = beam;
    g.fillRect(screenX, beamY - 20, screenWidth, 40);
    g.globalCompositeOperation = "source-over";
    g.globalAlpha = 0.82;
    g.fillStyle = signal;
    g.font = \`600 \${Math.max(8, Math.round(ctx.width * 0.022))}px JetBrains Mono, monospace\`;
    g.textBaseline = "top";
    g.fillText("> CRT/LINK ACTIVE", screenX + screenWidth * 0.055, screenY + screenHeight * 0.07);
    g.globalAlpha = 0.62;
    g.font = \`500 \${Math.max(7, Math.round(ctx.width * 0.017))}px JetBrains Mono, monospace\`;
    g.fillText(\`FRAME \${String(ctx.frame).padStart(4, "0")}  PHOSPHOR \${Math.round(persistence * 100)}\`, screenX + screenWidth * 0.055, screenY + screenHeight * 0.14);
    for (let mark = 0; mark < 9; mark += 1) {
      const x = screenX + screenWidth * (0.18 + ctx.random(\`burn-x:\${mark}\`) * 0.64);
      const y = screenY + screenHeight * (0.22 + ctx.random(\`burn-y:\${mark}\`) * 0.58);
      g.globalAlpha = persistence * (0.025 + ctx.random(\`burn-a:\${mark}\`) * 0.045);
      g.fillStyle = signal;
      g.beginPath();
      g.arc(x, y, 1 + ctx.random(\`burn-r:\${mark}\`) * 2.5, 0, TAU);
      g.fill();
    }
    g.restore();
    const vignette = g.createRadialGradient(ctx.width / 2, ctx.height / 2, ctx.height * 0.22, ctx.width / 2, ctx.height / 2, ctx.width * 0.58);
    vignette.addColorStop(0, "rgba(13,14,16,0)");
    vignette.addColorStop(0.72, "rgba(13,14,16,0.05)");
    vignette.addColorStop(1, "rgba(13,14,16,0.92)");
    g.fillStyle = vignette;
    g.fillRect(0, 0, ctx.width, ctx.height);
  }
};
var Z10_crt_terminal_effect_default = kernel;
`;export{e as default};
