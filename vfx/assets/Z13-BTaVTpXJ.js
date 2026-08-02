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
var Z13_stadium_board_effect_exports = {};
__export(Z13_stadium_board_effect_exports, {
  default: () => Z13_stadium_board_effect_default
});
module.exports = __toCommonJS(Z13_stadium_board_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const pixelSize = Math.max(5, Math.round(Number(ctx.params.pixelSize ?? 9)));
    const zoom = Math.min(0.28, Math.max(0, Number(ctx.params.zoom ?? 0.12)));
    const refresh = Math.max(1, Math.round(Number(ctx.params.refresh ?? 4)));
    const bloom = clamp01(Number(ctx.params.bloom ?? 0.62));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.frame % Math.max(1, ctx.durationInFrames) / Math.max(1, ctx.durationInFrames);
    g.clearRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    const source = g.getImageData(0, 0, ctx.width, ctx.height).data;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    const cameraScale = 1 + zoom * (0.5 - 0.5 * Math.cos(phase * Math.PI * 2));
    g.save();
    g.translate(ctx.width / 2, ctx.height / 2);
    g.scale(cameraScale, cameraScale);
    g.translate(-ctx.width / 2, -ctx.height / 2);
    const marginX = ctx.width * 0.075;
    const marginY = ctx.height * 0.09;
    const boardWidth = ctx.width - marginX * 2;
    const boardHeight = ctx.height - marginY * 2;
    g.fillStyle = "#07090A";
    g.fillRect(marginX - 7, marginY - 7, boardWidth + 14, boardHeight + 14);
    g.strokeStyle = "#454C50";
    g.lineWidth = 3;
    g.strokeRect(marginX - 7, marginY - 7, boardWidth + 14, boardHeight + 14);
    const columns = Math.max(1, Math.floor(boardWidth / pixelSize));
    const rows = Math.max(1, Math.floor(boardHeight / pixelSize));
    const panelWave = Math.floor(phase * refresh * rows) % rows;
    for (let row = 0; row < rows; row += 1) {
      const y = marginY + row * pixelSize + pixelSize * 0.5;
      const refreshed = (row - panelWave + rows) % rows < Math.max(2, Math.floor(rows * 0.28));
      for (let column = 0; column < columns; column += 1) {
        const x = marginX + column * pixelSize + pixelSize * 0.5;
        const sampleX = Math.min(ctx.width - 1, Math.max(0, Math.round(x)));
        const sampleY = Math.min(ctx.height - 1, Math.max(0, Math.round(y)));
        const offset = (sampleY * ctx.width + sampleX) * 4;
        const alpha = source[offset + 3] / 255;
        const luma = (source[offset] * 0.2126 + source[offset + 1] * 0.7152 + source[offset + 2] * 0.0722) / 255;
        const gate = ctx.random(\`lamp:\${row}:\${column}\`) * 0.18;
        const power = clamp01(alpha * (0.28 + luma * 0.82) - gate + (refreshed ? 0.1 : 0));
        const size = pixelSize * (0.54 + power * 0.2);
        g.globalAlpha = power > 0.08 ? 0.28 + power * 0.72 : 0.34;
        g.fillStyle = power > 0.08 ? signal : "#20262A";
        g.shadowColor = signal;
        g.shadowBlur = power * bloom * pixelSize * 1.3;
        g.fillRect(x - size * 0.5, y - size * 0.38, size, size * 0.76);
      }
    }
    const sweepY = marginY + phase * refresh % 1 * boardHeight;
    g.globalAlpha = 0.46;
    g.shadowBlur = pixelSize * 1.4;
    g.fillStyle = signal;
    g.fillRect(marginX, sweepY, boardWidth, Math.max(1, pixelSize * 0.16));
    g.restore();
    g.globalAlpha = 0.82;
    g.shadowBlur = 0;
    g.fillStyle = "#0D0E10";
    g.fillRect(ctx.width * 0.37, ctx.height * 0.035, ctx.width * 0.26, ctx.height * 0.07);
    g.strokeStyle = signal;
    g.lineWidth = 1;
    g.strokeRect(ctx.width * 0.37, ctx.height * 0.035, ctx.width * 0.26, ctx.height * 0.07);
  }
};
var Z13_stadium_board_effect_default = kernel;
`;export{e as default};
