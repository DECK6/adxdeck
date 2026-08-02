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
var S23_arrow_flock_effect_exports = {};
__export(S23_arrow_flock_effect_exports, {
  default: () => S23_arrow_flock_effect_default
});
module.exports = __toCommonJS(S23_arrow_flock_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const count = Math.min(110, Math.max(24, Math.round(Number(ctx.params.count ?? 64))));
    const alignment = Math.min(1, Math.max(0, Number(ctx.params.alignment ?? 0.74)));
    const drift = Math.min(1, Math.max(0, Number(ctx.params.drift ?? 0.56)));
    const size = Math.min(18, Math.max(5, Number(ctx.params.size ?? 10)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const alignEnvelope = alignment * (0.5 - 0.5 * Math.cos(phase));
    const targetAngle = phase + Math.sin(phase * 2) * 0.45;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.22;
      g.drawImage(ctx.subject.bitmap, ctx.width * 0.34, ctx.height * 0.22, ctx.width * 0.32, ctx.height * 0.56);
      g.restore();
    }
    g.save();
    g.strokeStyle = signal;
    g.fillStyle = signal;
    g.lineWidth = Math.max(1, size * 0.16);
    g.shadowColor = signal;
    g.shadowBlur = size * 0.35;
    for (let index = 0; index < count; index += 1) {
      const baseX = ctx.random(\`arrow:\${index}:x\`) * ctx.width;
      const baseY = ctx.random(\`arrow:\${index}:y\`) * ctx.height;
      const orbit = phase + ctx.random(\`arrow:\${index}:phase\`) * TAU;
      const x = baseX + Math.cos(orbit) * drift * ctx.width * 0.055;
      const y = baseY + Math.sin(orbit * 1.3) * drift * ctx.height * 0.085;
      const individualAngle = ctx.random(\`arrow:\${index}:angle\`) * TAU + Math.sin(orbit) * 0.7;
      const blendX = Math.cos(individualAngle) * (1 - alignEnvelope) + Math.cos(targetAngle) * alignEnvelope;
      const blendY = Math.sin(individualAngle) * (1 - alignEnvelope) + Math.sin(targetAngle) * alignEnvelope;
      const angle = Math.atan2(blendY, blendX);
      const localSize = size * (0.72 + ctx.random(\`arrow:\${index}:size\`) * 0.56);
      g.save();
      g.translate(x, y);
      g.rotate(angle);
      g.globalAlpha = 0.34 + alignEnvelope * 0.5 + ctx.random(\`arrow:\${index}:alpha\`) * 0.14;
      g.beginPath();
      g.moveTo(localSize, 0);
      g.lineTo(-localSize * 0.58, -localSize * 0.62);
      g.lineTo(-localSize * 0.22, 0);
      g.lineTo(-localSize * 0.58, localSize * 0.62);
      g.closePath();
      g.fill();
      g.stroke();
      g.restore();
    }
    g.restore();
  }
};
var S23_arrow_flock_effect_default = kernel;
`;export{n as default};
