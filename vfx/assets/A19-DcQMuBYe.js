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
var A19_note_rain_effect_exports = {};
__export(A19_note_rain_effect_exports, {
  default: () => A19_note_rain_effect_default
});
module.exports = __toCommonJS(A19_note_rain_effect_exports);
const TAU = Math.PI * 2;
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const density = Math.min(72, Math.max(20, Math.round(Number(ctx.params.density ?? 44) / 4) * 4));
    const speed = String(ctx.params.speed ?? "fall");
    const threshold = Math.min(0.75, Math.max(0, Number(ctx.params.threshold ?? 0.2)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const bands = Array.from({ length: 8 }, (_, index) => clamp01(ctx.audio?.bands[index] ?? 0));
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const cycles = speed === "drift" ? 1 : speed === "storm" ? 3 : 2;
    g.fillStyle = "#080A0E";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.08 + rms * 0.12;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    g.save();
    g.strokeStyle = signal;
    g.fillStyle = signal;
    g.lineCap = "round";
    g.shadowColor = signal;
    for (let index = 0; index < density; index += 1) {
      const bandIndex = Math.min(7, Math.floor(ctx.random(\`band:\${index}\`) * 8));
      const energy = bands[bandIndex];
      const activity = clamp01((energy - threshold) / Math.max(0.01, 1 - threshold));
      const seed = ctx.random(\`phase:\${index}\`);
      const phase = (seed + ctx.t * cycles) % 1;
      const lane = (bandIndex + 0.18 + ctx.random(\`lane:\${index}\`) * 0.64) / 8;
      const sway = Math.sin(TAU * (ctx.t + seed) + bandIndex) * ctx.width * (8e-3 + rms * 0.012);
      const x = lane * ctx.width + sway;
      const y = -ctx.height * 0.12 + phase * ctx.height * 1.24;
      const size = Math.min(ctx.width, ctx.height) * (0.012 + ctx.random(\`size:\${index}\`) * 0.018) * (0.75 + activity * 0.65);
      const alpha = 0.06 + activity * 0.78 + rms * 0.08;
      g.globalAlpha = Math.min(0.94, alpha) * Math.sin(Math.PI * phase);
      g.lineWidth = Math.max(1, size * 0.16);
      g.shadowBlur = size * (0.35 + activity * 0.9);
      g.beginPath();
      g.moveTo(x, y - size * (1.15 + activity));
      g.lineTo(x, y - size * 0.18);
      g.stroke();
      g.beginPath();
      g.ellipse(x - size * 0.3, y, size * 0.48, size * 0.32, -0.35, 0, TAU);
      g.fill();
      if (index % 3 === 0) {
        g.beginPath();
        g.moveTo(x, y - size * 1.15);
        g.lineTo(x + size * 0.72, y - size * 0.9);
        g.stroke();
      }
      g.globalAlpha *= 0.24;
      g.beginPath();
      g.moveTo(x, y - size * 1.3);
      g.lineTo(x, y - size * (2.3 + activity * 2));
      g.stroke();
    }
    g.restore();
    g.save();
    g.globalAlpha = 0.16 + rms * 0.24;
    g.fillStyle = signal;
    for (let bandIndex = 0; bandIndex < 8; bandIndex += 1) {
      const width = ctx.width / 8;
      g.fillRect(bandIndex * width + width * 0.47, ctx.height * 0.93, width * 0.06, 2 + bands[bandIndex] * ctx.height * 0.035);
    }
    g.restore();
  }
};
var A19_note_rain_effect_default = kernel;
`;export{n as default};
