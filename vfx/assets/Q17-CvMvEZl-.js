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
var Q17_splash_crown_effect_exports = {};
__export(Q17_splash_crown_effect_exports, {
  default: () => Q17_splash_crown_effect_default
});
module.exports = __toCommonJS(Q17_splash_crown_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const spikeCount = Math.min(18, Math.max(7, Math.round(Number(ctx.params.spikes ?? 12))));
    const height = Math.min(1.5, Math.max(0.4, Number(ctx.params.height ?? 0.92)));
    const dropletCount = Math.min(24, Math.max(6, Math.round(Number(ctx.params.droplets ?? 14))));
    const glow = Math.min(24, Math.max(0, Number(ctx.params.glow ?? 10)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const bloom = Math.sin(phase * 0.5) ** 2;
    const lift = Math.sin(phase * 0.5);
    const scale = Math.min(ctx.width, ctx.height);
    const centerX = ctx.width * 0.5;
    const waterY = ctx.height * 0.66;
    const crownRadius = scale * (0.08 + bloom * 0.2);
    const crownHeight = scale * height * 0.28 * bloom;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.46;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    g.save();
    g.strokeStyle = signal;
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = glow;
    g.lineCap = "round";
    g.lineJoin = "round";
    g.globalAlpha = 0.2 + bloom * 0.62;
    g.lineWidth = Math.max(1, scale * 8e-3);
    g.beginPath();
    g.ellipse(centerX, waterY, crownRadius * 1.25, crownRadius * 0.3, 0, 0, TAU);
    g.stroke();
    g.globalAlpha = bloom * 0.88;
    g.lineWidth = Math.max(1.2, scale * 9e-3);
    g.beginPath();
    for (let index = 0; index <= spikeCount * 2; index += 1) {
      const unit = index / (spikeCount * 2);
      const angle = unit * TAU;
      const isTip = index % 2 === 1;
      const irregularity = 0.82 + ctx.random(\`crown:\${index % spikeCount}:height\`) * 0.36;
      const radius = crownRadius * (isTip ? 1.04 : 0.83);
      const x = centerX + Math.cos(angle) * radius;
      const y = waterY + Math.sin(angle) * crownRadius * 0.29 - (isTip ? crownHeight * irregularity : crownHeight * 0.18);
      if (index === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
    for (let index = 0; index < spikeCount; index += 1) {
      const angle = index / spikeCount * TAU;
      const radius = crownRadius * 1.04;
      const irregularity = 0.82 + ctx.random(\`crown:\${index}:height\`) * 0.36;
      const tipX = centerX + Math.cos(angle) * radius;
      const tipY = waterY + Math.sin(angle) * crownRadius * 0.29 - crownHeight * irregularity;
      g.globalAlpha = bloom * (0.55 + irregularity * 0.25);
      g.beginPath();
      g.arc(tipX, tipY, Math.max(1.2, scale * 9e-3 * irregularity), 0, TAU);
      g.fill();
    }
    for (let index = 0; index < dropletCount; index += 1) {
      const angle = ctx.random(\`drop:\${index}:angle\`) * TAU;
      const reach = scale * (0.14 + ctx.random(\`drop:\${index}:reach\`) * 0.25) * lift;
      const arc = scale * height * (0.1 + ctx.random(\`drop:\${index}:lift\`) * 0.24) * bloom;
      const x = centerX + Math.cos(angle) * reach;
      const y = waterY + Math.sin(angle) * reach * 0.25 - arc;
      const radius = scale * (4e-3 + ctx.random(\`drop:\${index}:size\`) * 9e-3) * (0.45 + bloom * 0.75);
      g.globalAlpha = bloom * (0.42 + ctx.random(\`drop:\${index}:alpha\`) * 0.5);
      g.beginPath();
      g.ellipse(x, y, radius * 0.72, radius * 1.3, angle, 0, TAU);
      g.fill();
    }
    g.globalAlpha = 0.2 + bloom * 0.35;
    g.lineWidth = Math.max(0.8, scale * 4e-3);
    for (let ring = 0; ring < 3; ring += 1) {
      const spread = scale * (0.11 + ring * 0.08) * (0.4 + bloom * 0.8);
      g.beginPath();
      g.ellipse(centerX, waterY + scale * 0.018, spread, spread * 0.16, 0, 0, TAU);
      g.stroke();
    }
    g.restore();
  }
};
var Q17_splash_crown_effect_default = kernel;
`;export{n as default};
