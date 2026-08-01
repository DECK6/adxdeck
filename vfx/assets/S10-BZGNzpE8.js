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
var S10_fractal_branch_effect_exports = {};
__export(S10_fractal_branch_effect_exports, {
  default: () => S10_fractal_branch_effect_default
});
module.exports = __toCommonJS(S10_fractal_branch_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const maxDepth = Math.min(8, Math.max(4, Math.round(Number(ctx.params.depth ?? 7))));
    const spread = Math.min(48, Math.max(12, Number(ctx.params.spread ?? 29))) * Math.PI / 180;
    const decay = Math.min(0.78, Math.max(0.58, Number(ctx.params.decay ?? 0.69)));
    const weight = Math.min(7, Math.max(0.8, Number(ctx.params.weight ?? 3.2)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const branches = [];
    const wind = Math.sin(ctx.t * TAU) * 0.12;
    const grow = 0.5 - 0.5 * Math.cos(ctx.t * TAU * 2);
    const build = (x, y, length, angle, level, side) => {
      const localWind = wind * (0.25 + level / maxDepth);
      const endX = x + Math.cos(angle + localWind) * length;
      const endY = y + Math.sin(angle + localWind) * length;
      branches.push({ x, y, endX, endY, level, side });
      if (level >= maxDepth) return;
      const irregular = (ctx.random(\`b:\${level}:\${side}:bend\`) - 0.5) * 0.14;
      build(endX, endY, length * decay, angle - spread + irregular, level + 1, side * 2);
      build(endX, endY, length * decay, angle + spread + irregular, level + 1, side * 2 + 1);
    };
    build(ctx.width * 0.5, ctx.height * 0.92, ctx.height * 0.25, -Math.PI * 0.5, 0, 1);
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.12 + grow * 0.08;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    g.save();
    g.strokeStyle = signal;
    g.fillStyle = signal;
    g.lineCap = "round";
    g.shadowColor = signal;
    g.shadowBlur = weight * 2.5;
    for (const branch of branches) {
      const start = branch.level / (maxDepth + 1);
      const local = Math.min(1, Math.max(0, (grow - start * 0.72) / 0.28));
      if (local <= 0) continue;
      const eased = local * local * (3 - 2 * local);
      const endX = branch.x + (branch.endX - branch.x) * eased;
      const endY = branch.y + (branch.endY - branch.y) * eased;
      g.globalAlpha = 0.45 + (1 - branch.level / (maxDepth + 1)) * 0.5;
      g.lineWidth = Math.max(0.55, weight * Math.pow(decay, branch.level * 0.7));
      g.beginPath();
      g.moveTo(branch.x, branch.y);
      g.lineTo(endX, endY);
      g.stroke();
      if (branch.level === maxDepth && local > 0.5) {
        const leafPulse = 0.7 + 0.3 * Math.sin(ctx.t * TAU * 3 + branch.side);
        g.globalAlpha = (local - 0.5) * 1.7;
        g.beginPath();
        g.arc(endX, endY, weight * leafPulse, 0, TAU);
        g.fill();
      }
    }
    g.restore();
  }
};
var S10_fractal_branch_effect_default = kernel;
`;export{e as default};
