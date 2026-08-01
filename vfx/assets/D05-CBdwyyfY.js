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
var D05_wave_shear_effect_exports = {};
__export(D05_wave_shear_effect_exports, {
  default: () => D05_wave_shear_effect_default
});
module.exports = __toCommonJS(D05_wave_shear_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const strength = Math.min(0.18, Math.max(0, Number(ctx.params.strength ?? 0.075)));
    const frequency = Math.min(8, Math.max(1, Math.round(Number(ctx.params.frequency ?? 4))));
    const cycles = Math.min(4, Math.max(1, Math.round(Number(ctx.params.cycles ?? 1))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const bitmap = ctx.subject.bitmap;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (!bitmap) return;
    const stripHeight = Math.max(2, Math.ceil(ctx.height / 96));
    const phase = ctx.frame / Math.max(1, ctx.durationInFrames) * TAU * cycles;
    const maxShift = ctx.width * strength;
    g.save();
    g.beginPath();
    g.rect(0, 0, ctx.width, ctx.height);
    g.clip();
    for (let y = 0; y < ctx.height; y += stripHeight) {
      const height = Math.min(stripHeight, ctx.height - y);
      const sourceY = y / ctx.height * bitmap.height;
      const sourceHeight = Math.max(1, height / ctx.height * bitmap.height);
      const wave = Math.sin(y / ctx.height * TAU * frequency + phase);
      const harmonic = Math.sin(y / ctx.height * TAU * (frequency * 0.5 + 1) - phase) * 0.22;
      const shift = (wave + harmonic) * maxShift;
      g.drawImage(bitmap, 0, sourceY, bitmap.width, sourceHeight, shift, y, ctx.width, height);
      g.drawImage(bitmap, 0, sourceY, bitmap.width, sourceHeight, shift - ctx.width, y, ctx.width, height);
      g.drawImage(bitmap, 0, sourceY, bitmap.width, sourceHeight, shift + ctx.width, y, ctx.width, height);
    }
    g.restore();
    g.save();
    g.globalCompositeOperation = "screen";
    g.strokeStyle = signal;
    g.globalAlpha = 0.22 + strength * 1.2;
    g.lineWidth = Math.max(1, ctx.height * 3e-3);
    g.beginPath();
    for (let y = 0; y <= ctx.height; y += stripHeight * 2) {
      const wave = Math.sin(y / ctx.height * TAU * frequency + phase);
      const x = ctx.width * 0.5 + wave * maxShift;
      if (y === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
    g.restore();
  }
};
var D05_wave_shear_effect_default = kernel;
`;export{t as default};
