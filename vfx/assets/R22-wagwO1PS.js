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
var R22_pinwheel_fractal_effect_exports = {};
__export(R22_pinwheel_fractal_effect_exports, {
  default: () => R22_pinwheel_fractal_effect_default
});
module.exports = __toCommonJS(R22_pinwheel_fractal_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const blades = Math.min(8, Math.max(3, Math.round(Number(ctx.params.blades ?? 5))));
    const depth = Math.min(5, Math.max(2, Math.round(Number(ctx.params.depth ?? 4))));
    const twist = Math.min(1, Math.max(0.1, Number(ctx.params.twist ?? 0.64)));
    const weight = Math.min(4, Math.max(0.5, Number(ctx.params.weight ?? 1.4)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const shortSide = Math.min(ctx.width, ctx.height);
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.2;
      g.drawImage(ctx.subject.bitmap, ctx.width * 0.36, ctx.height * 0.25, ctx.width * 0.28, ctx.height * 0.5);
      g.restore();
    }
    g.save();
    g.translate(ctx.width * 0.5, ctx.height * 0.5);
    g.strokeStyle = signal;
    g.fillStyle = \`\${signal}18\`;
    g.lineWidth = weight;
    g.shadowColor = signal;
    g.shadowBlur = weight * 3;
    const drawBranch = (x, y, radius, angle, level) => {
      const sweep = TAU / blades;
      g.globalAlpha = 0.28 + level / depth * 0.58;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
      g.lineTo(x + Math.cos(angle + sweep * 0.72) * radius * 0.74, y + Math.sin(angle + sweep * 0.72) * radius * 0.74);
      g.closePath();
      g.fill();
      g.stroke();
      if (level <= 1) return;
      const nextRadius = radius * 0.52;
      const pivotAngle = angle + sweep * 0.43;
      const pivotX = x + Math.cos(pivotAngle) * radius * 0.58;
      const pivotY = y + Math.sin(pivotAngle) * radius * 0.58;
      const oscillation = Math.sin(phase) * twist;
      drawBranch(pivotX, pivotY, nextRadius, angle + oscillation + sweep * 0.5, level - 1);
      drawBranch(pivotX, pivotY, nextRadius, angle - oscillation - sweep * 0.28, level - 1);
    };
    for (let blade = 0; blade < blades; blade += 1) {
      drawBranch(0, 0, shortSide * 0.42, phase + blade / blades * TAU, depth);
    }
    g.restore();
  }
};
var R22_pinwheel_fractal_effect_default = kernel;
`;export{e as default};
