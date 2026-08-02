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
var A24_chromagram_effect_exports = {};
__export(A24_chromagram_effect_exports, {
  default: () => A24_chromagram_effect_default
});
module.exports = __toCommonJS(A24_chromagram_effect_exports);
const TAU = Math.PI * 2;
const NOTES = ["C", "C\\u266F", "D", "D\\u266F", "E", "F", "F\\u266F", "G", "G\\u266F", "A", "A\\u266F", "B"];
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const gain = Math.min(2.5, Math.max(0.5, Number(ctx.params.gain ?? 1.35)));
    const turns = Math.min(3, Math.max(0, Math.round(Number(ctx.params.turns ?? 1))));
    const radiusFactor = Math.min(0.36, Math.max(0.18, Number(ctx.params.radius ?? 0.27)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const bands = Array.from({ length: 8 }, (_, index) => clamp01(ctx.audio?.bands[index] ?? 0));
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const centerX = ctx.width * 0.5;
    const centerY = ctx.height * 0.5;
    const shortSide = Math.min(ctx.width, ctx.height);
    const innerRadius = shortSide * radiusFactor;
    const rotation = ctx.t * TAU * turns - Math.PI / 2;
    g.fillStyle = "#080A0E";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.08 + rms * 0.1;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    for (let pitch = 0; pitch < 12; pitch += 1) {
      const bandPosition = pitch / 11 * 7;
      const low = Math.floor(bandPosition);
      const high = Math.min(7, low + 1);
      const mix = bandPosition - low;
      const band = bands[low] * (1 - mix) + bands[high] * mix;
      const energy = clamp01((band * 0.84 + rms * 0.2) * gain);
      const centerAngle = rotation + pitch / 12 * TAU;
      const gap = 0.045;
      const start = centerAngle - TAU / 24 + gap;
      const end = centerAngle + TAU / 24 - gap;
      const outerRadius = innerRadius + shortSide * (0.055 + energy * 0.16);
      const hue = pitch * 30;
      g.save();
      g.beginPath();
      g.arc(centerX, centerY, innerRadius, start, end);
      g.arc(centerX, centerY, outerRadius, end, start, true);
      g.closePath();
      g.fillStyle = \`hsl(\${hue} 88% \${48 + energy * 18}%)\`;
      g.globalAlpha = 0.24 + energy * 0.72;
      g.shadowColor = \`hsl(\${hue} 95% 62%)\`;
      g.shadowBlur = shortSide * (0.012 + energy * 0.045);
      g.fill();
      const labelRadius = outerRadius + shortSide * 0.045;
      g.globalAlpha = 0.36 + energy * 0.62;
      g.fillStyle = \`hsl(\${hue} 92% 70%)\`;
      g.font = \`700 \${Math.max(8, shortSide * 0.037)}px 'JetBrains Mono', monospace\`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(NOTES[pitch], centerX + Math.cos(centerAngle) * labelRadius, centerY + Math.sin(centerAngle) * labelRadius);
      g.restore();
    }
    g.save();
    g.strokeStyle = signal;
    g.lineWidth = Math.max(1.5, shortSide * 7e-3);
    g.globalAlpha = 0.5 + rms * 0.42;
    g.shadowColor = signal;
    g.shadowBlur = 8 + rms * 18;
    g.beginPath();
    g.arc(centerX, centerY, innerRadius * (0.9 + rms * 0.04), 0, TAU);
    g.stroke();
    g.fillStyle = signal;
    g.globalAlpha = 0.22 + rms * 0.3;
    g.beginPath();
    g.arc(centerX, centerY, shortSide * (0.025 + rms * 0.025), 0, TAU);
    g.fill();
    g.restore();
  }
};
var A24_chromagram_effect_default = kernel;
`;export{n as default};
