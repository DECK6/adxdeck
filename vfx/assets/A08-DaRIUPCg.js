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
var A08_frequency_rings_effect_exports = {};
__export(A08_frequency_rings_effect_exports, {
  default: () => A08_frequency_rings_effect_default
});
module.exports = __toCommonJS(A08_frequency_rings_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const gain = Math.min(2.5, Math.max(0.4, Number(ctx.params.gain ?? 1.25)));
    const spacing = Math.min(1.5, Math.max(0.65, Number(ctx.params.spacing ?? 1)));
    const lineWidth = Math.min(4, Math.max(0.7, Number(ctx.params.lineWidth ?? 1.6)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const bands = Array.from({ length: 8 }, (_, index) => Math.min(1, Math.max(0, ctx.audio?.bands[index] ?? 0)));
    const rms = Math.min(1, Math.max(0, ctx.audio?.rms ?? 0));
    const centerX = ctx.width * 0.5;
    const centerY = ctx.height * 0.5;
    const scale = Math.min(ctx.width, ctx.height);
    const baseGap = scale * 0.037 * spacing;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.72;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    g.save();
    g.strokeStyle = signal;
    g.shadowColor = signal;
    for (let index = 0; index < 8; index += 1) {
      const energy = Math.min(1, bands[index] * gain);
      const loopBreath = Math.sin(ctx.t * TAU + index * 0.72) * scale * 4e-3;
      const radius = scale * 0.085 + baseGap * index + energy * baseGap * 0.72 + loopBreath;
      g.globalAlpha = 0.22 + energy * 0.72;
      g.lineWidth = lineWidth * (0.8 + energy * 1.5);
      g.shadowBlur = scale * (8e-3 + energy * 0.038 + rms * 0.015);
      g.beginPath();
      g.arc(centerX, centerY, Math.max(1, radius), 0, TAU);
      g.stroke();
    }
    g.restore();
    g.save();
    const pulse = scale * (0.028 + rms * 0.045);
    const glow = g.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulse);
    glow.addColorStop(0, signal);
    glow.addColorStop(1, "rgba(13,14,16,0)");
    g.globalAlpha = 0.18 + rms * 0.3;
    g.fillStyle = glow;
    g.beginPath();
    g.arc(centerX, centerY, pulse, 0, TAU);
    g.fill();
    g.restore();
  }
};
var A08_frequency_rings_effect_default = kernel;
`;export{e as default};
