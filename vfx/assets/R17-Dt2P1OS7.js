const n=`var __defProp = Object.defineProperty;
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
var R17_weave_cross_effect_exports = {};
__export(R17_weave_cross_effect_exports, {
  default: () => R17_weave_cross_effect_default
});
module.exports = __toCommonJS(R17_weave_cross_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const spacing = Math.min(34, Math.max(10, Number(ctx.params.spacing ?? 20)));
    const thickness = Math.min(7, Math.max(1.5, Number(ctx.params.thickness ?? 3.5)));
    const bend = Math.min(0.45, Math.max(0, Number(ctx.params.bend ?? 0.2)));
    const progress = Math.min(1.5, Math.max(0.5, Number(ctx.params.progress ?? 1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const reveal = Math.min(1, (0.5 - 0.5 * Math.cos(phase)) * progress);
    const columns = Math.ceil(ctx.width / spacing) + 2;
    const rows = Math.ceil(ctx.height / spacing) + 2;
    const left = (ctx.width - (columns - 1) * spacing) * 0.5;
    const top = (ctx.height - (rows - 1) * spacing) * 0.5;
    const halfWidth = ctx.width * reveal * 0.5;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.16;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    g.save();
    g.lineCap = "round";
    g.lineJoin = "round";
    for (let column = 0; column < columns; column += 1) {
      const x = left + column * spacing;
      g.beginPath();
      for (let y = -spacing; y <= ctx.height + spacing; y += 3) {
        const wave = Math.sin(y / spacing * Math.PI + column * Math.PI) * spacing * bend;
        if (y === -spacing) g.moveTo(x + wave, y);
        else g.lineTo(x + wave, y);
      }
      g.strokeStyle = signal;
      g.globalAlpha = 0.24;
      g.lineWidth = thickness;
      g.stroke();
    }
    g.beginPath();
    g.rect(ctx.width * 0.5 - halfWidth, 0, halfWidth * 2, ctx.height);
    g.clip();
    for (let row = 0; row < rows; row += 1) {
      const y = top + row * spacing;
      g.beginPath();
      for (let x = -spacing; x <= ctx.width + spacing; x += 3) {
        const wave = Math.sin(x / spacing * Math.PI + row * Math.PI) * spacing * bend;
        if (x === -spacing) g.moveTo(x, y + wave);
        else g.lineTo(x, y + wave);
      }
      g.strokeStyle = signal;
      g.globalAlpha = 0.58;
      g.lineWidth = thickness;
      g.shadowColor = signal;
      g.shadowBlur = thickness * 1.6;
      g.stroke();
    }
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        if ((row + column) % 2 !== 0) continue;
        const x = left + column * spacing;
        if (Math.abs(x - ctx.width * 0.5) > halfWidth) continue;
        const y = top + row * spacing;
        g.fillStyle = "#0D0E10";
        g.globalAlpha = 0.92;
        g.fillRect(x - thickness * 1.25, y - thickness * 0.8, thickness * 2.5, thickness * 1.6);
        g.beginPath();
        g.moveTo(x - thickness * 1.35, y);
        g.lineTo(x + thickness * 1.35, y);
        g.strokeStyle = signal;
        g.globalAlpha = 0.9;
        g.lineWidth = thickness;
        g.stroke();
      }
    }
    g.restore();
  }
};
var R17_weave_cross_effect_default = kernel;
`;export{n as default};
