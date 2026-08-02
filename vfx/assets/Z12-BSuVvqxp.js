const t=`var __defProp = Object.defineProperty;
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
var Z12_dot_flip_effect_exports = {};
__export(Z12_dot_flip_effect_exports, {
  default: () => Z12_dot_flip_effect_default
});
module.exports = __toCommonJS(Z12_dot_flip_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const columns = Math.min(42, Math.max(16, Math.round(Number(ctx.params.columns ?? 28))));
    const gap = Math.min(0.38, Math.max(0.08, Number(ctx.params.gap ?? 0.2)));
    const waves = Math.min(4, Math.max(1, Math.round(Number(ctx.params.waves ?? 2))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const pitch = ctx.width / columns;
    const rows = Math.ceil(ctx.height / pitch);
    const radius = pitch * (0.5 - gap * 0.5);
    const centerColumn = (columns - 1) * 0.5;
    const centerRow = (rows - 1) * 0.5;
    const bitmap = ctx.subject.bitmap;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const x = (column + 0.5) * pitch;
        const y = (row + 0.5) * pitch;
        const distance = Math.hypot(column - centerColumn, row - centerRow);
        const localPhase = ctx.t * TAU * waves - distance * 0.48;
        const facingFront = Math.sin(localPhase) >= 0;
        const flipScale = Math.max(0.06, Math.abs(Math.sin(localPhase)));
        const dotRadiusY = radius * flipScale;
        g.fillStyle = "#030405";
        g.beginPath();
        g.arc(x, y, radius, 0, TAU);
        g.fill();
        g.strokeStyle = "#2A3033";
        g.lineWidth = Math.max(0.5, pitch * 0.035);
        g.stroke();
        g.save();
        g.beginPath();
        g.ellipse(x, y, radius, dotRadiusY, 0, 0, TAU);
        g.clip();
        if (facingFront && bitmap) {
          const sourceX = column / columns * bitmap.width;
          const sourceY = row / rows * bitmap.height;
          g.globalAlpha = 0.86;
          g.drawImage(bitmap, sourceX, sourceY, bitmap.width / columns + 1, bitmap.height / rows + 1, x - radius, y - dotRadiusY, radius * 2, dotRadiusY * 2);
          g.globalCompositeOperation = "screen";
          g.globalAlpha = 0.2 + 0.18 * flipScale;
          g.fillStyle = signal;
          g.fillRect(x - radius, y - dotRadiusY, radius * 2, dotRadiusY * 2);
        } else {
          g.fillStyle = facingFront ? \`\${signal}55\` : "#111518";
          g.globalAlpha = facingFront ? 0.72 : 1;
          g.fillRect(x - radius, y - dotRadiusY, radius * 2, dotRadiusY * 2);
        }
        g.restore();
        g.globalAlpha = 0.2 + flipScale * 0.42;
        g.strokeStyle = facingFront ? signal : "#4B5459";
        g.lineWidth = Math.max(0.5, pitch * 0.045);
        g.beginPath();
        g.ellipse(x, y, radius * 0.72, dotRadiusY * 0.72, 0, Math.PI * 1.08, Math.PI * 1.84);
        g.stroke();
        g.globalAlpha = 1;
      }
    }
    const sweepRadius = ctx.t * waves % 1 * Math.hypot(columns, rows) * pitch * 0.58;
    g.strokeStyle = signal;
    g.globalAlpha = 0.12;
    g.lineWidth = Math.max(2, pitch * 0.35);
    g.beginPath();
    g.arc(ctx.width / 2, ctx.height / 2, sweepRadius, 0, TAU);
    g.stroke();
    g.globalAlpha = 1;
  }
};
var Z12_dot_flip_effect_default = kernel;
`;export{t as default};
