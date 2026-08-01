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
var L08_lightning_arc_effect_exports = {};
__export(L08_lightning_arc_effect_exports, {
  default: () => L08_lightning_arc_effect_default
});
module.exports = __toCommonJS(L08_lightning_arc_effect_exports);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const smooth = (value) => value * value * (3 - 2 * value);
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const branchCount = Math.round(clamp(Number(ctx.params.branches ?? 5), 1, 8));
    const jaggedness = clamp(Number(ctx.params.jaggedness ?? 0.68), 0.1, 1);
    const thickness = clamp(Number(ctx.params.thickness ?? 1.7), 0.5, 4);
    const glow = clamp(Number(ctx.params.glow ?? 0.78), 0, 1);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * Math.PI * 2;
    const knotCount = 12;
    const exactKnot = ctx.t * knotCount;
    const knotA = Math.floor(exactKnot) % knotCount;
    const knotB = (knotA + 1) % knotCount;
    const mix = smooth(exactKnot - Math.floor(exactKnot));
    const pointCount = 18;
    const points = [];
    const morph = (key) => {
      const a = ctx.random(\`\${key}:\${knotA}\`);
      const b = ctx.random(\`\${key}:\${knotB}\`);
      return a + (b - a) * mix;
    };
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.48;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    for (let index = 0; index <= pointCount; index += 1) {
      const progress = index / pointCount;
      const x = ctx.width * (0.08 + progress * 0.84);
      const envelope = Math.sin(progress * Math.PI);
      const wave = Math.sin(phase * 2 + progress * Math.PI * 3) * ctx.height * 0.08;
      const jitter = (morph(\`point:\${index}\`) * 2 - 1) * ctx.height * 0.2 * jaggedness * envelope;
      const y = ctx.height * 0.5 + wave + jitter;
      points.push([x, y]);
    }
    const drawPath = (lineWidth, alpha, blur) => {
      g.save();
      g.strokeStyle = signal;
      g.globalAlpha = alpha;
      g.lineWidth = lineWidth;
      g.lineJoin = "round";
      g.lineCap = "round";
      g.shadowColor = signal;
      g.shadowBlur = blur;
      g.beginPath();
      g.moveTo(points[0][0], points[0][1]);
      for (let index = 1; index < points.length; index += 1) g.lineTo(points[index][0], points[index][1]);
      g.stroke();
      g.restore();
    };
    const flicker = 0.72 + 0.28 * Math.sin(phase * 9 + Math.sin(phase * 4)) ** 2;
    drawPath(thickness * (5 + glow * 5), glow * 0.16 * flicker, 18 * glow);
    drawPath(thickness * 2.2, 0.5 * flicker, 8 * glow);
    drawPath(thickness, 0.95 * flicker, 3 * glow);
    g.save();
    g.strokeStyle = signal;
    g.lineCap = "round";
    g.shadowColor = signal;
    g.shadowBlur = 7 * glow;
    for (let branch = 0; branch < branchCount; branch += 1) {
      const originIndex = 2 + Math.floor(morph(\`branch-origin:\${branch}\`) * (pointCount - 4));
      const origin = points[originIndex];
      const direction = morph(\`branch-direction:\${branch}\`) > 0.5 ? 1 : -1;
      const length = ctx.width * (0.07 + morph(\`branch-length:\${branch}\`) * 0.13);
      const segments = 4;
      g.globalAlpha = (0.35 + morph(\`branch-alpha:\${branch}\`) * 0.38) * flicker;
      g.lineWidth = Math.max(0.5, thickness * 0.62);
      g.beginPath();
      g.moveTo(origin[0], origin[1]);
      for (let segment = 1; segment <= segments; segment += 1) {
        const progress = segment / segments;
        const x = origin[0] + length * progress;
        const branchJitter = (morph(\`branch:\${branch}:\${segment}\`) * 2 - 1) * ctx.height * 0.035;
        const y = origin[1] + direction * length * progress * 0.58 + branchJitter;
        g.lineTo(x, y);
      }
      g.stroke();
    }
    g.restore();
  }
};
var L08_lightning_arc_effect_default = kernel;
`;export{n as default};
