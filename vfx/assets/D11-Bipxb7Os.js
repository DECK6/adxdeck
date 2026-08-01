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
var D11_mirror_fold_effect_exports = {};
__export(D11_mirror_fold_effect_exports, {
  default: () => D11_mirror_fold_effect_default
});
module.exports = __toCommonJS(D11_mirror_fold_effect_exports);
const TAU = Math.PI * 2;
function drawVerticalFold(g, bitmap, width, height, offset) {
  g.save();
  g.beginPath();
  g.rect(0, 0, width / 2, height);
  g.clip();
  g.drawImage(bitmap, offset, 0, width, height);
  g.restore();
  g.save();
  g.beginPath();
  g.rect(width / 2, 0, width / 2, height);
  g.clip();
  g.translate(width, 0);
  g.scale(-1, 1);
  g.drawImage(bitmap, offset, 0, width, height);
  g.restore();
}
function drawHorizontalFold(g, bitmap, width, height, offset) {
  g.save();
  g.beginPath();
  g.rect(0, 0, width, height / 2);
  g.clip();
  g.drawImage(bitmap, 0, offset, width, height);
  g.restore();
  g.save();
  g.beginPath();
  g.rect(0, height / 2, width, height / 2);
  g.clip();
  g.translate(0, height);
  g.scale(1, -1);
  g.drawImage(bitmap, 0, offset, width, height);
  g.restore();
}
function drawQuadFold(g, bitmap, width, height, offsetX, offsetY) {
  for (let row = 0; row < 2; row += 1) {
    for (let column = 0; column < 2; column += 1) {
      g.save();
      g.beginPath();
      g.rect(column * width / 2, row * height / 2, width / 2, height / 2);
      g.clip();
      g.translate(column === 0 ? 0 : width, row === 0 ? 0 : height);
      g.scale(column === 0 ? 1 : -1, row === 0 ? 1 : -1);
      g.drawImage(bitmap, offsetX, offsetY, width, height);
      g.restore();
    }
  }
}
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const axisValue = String(ctx.params.axis ?? "vertical");
    const axis = axisValue === "horizontal" || axisValue === "quad" ? axisValue : "vertical";
    const depth = Math.min(1, Math.max(0, Number(ctx.params.depth ?? 0.55)));
    const seam = Math.min(8, Math.max(0, Number(ctx.params.seam ?? 2)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const bitmap = ctx.subject.bitmap;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (!bitmap) return;
    const phase = ctx.frame / Math.max(1, ctx.durationInFrames) * TAU;
    const pulse = Math.sin(phase) * depth;
    const offsetX = pulse * ctx.width * 0.08;
    const offsetY = pulse * ctx.height * 0.08;
    if (axis === "vertical") drawVerticalFold(g, bitmap, ctx.width, ctx.height, offsetX);
    else if (axis === "horizontal") drawHorizontalFold(g, bitmap, ctx.width, ctx.height, offsetY);
    else drawQuadFold(g, bitmap, ctx.width, ctx.height, offsetX, offsetY);
    if (seam === 0) return;
    g.save();
    g.strokeStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = seam * 2.5;
    g.globalAlpha = 0.32 + depth * 0.28;
    g.lineWidth = seam;
    g.beginPath();
    if (axis !== "horizontal") {
      g.moveTo(ctx.width / 2, 0);
      g.lineTo(ctx.width / 2, ctx.height);
    }
    if (axis !== "vertical") {
      g.moveTo(0, ctx.height / 2);
      g.lineTo(ctx.width, ctx.height / 2);
    }
    g.stroke();
    g.restore();
  }
};
var D11_mirror_fold_effect_default = kernel;
`;export{t as default};
