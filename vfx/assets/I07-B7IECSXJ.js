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
var I07_starfield_warp_effect_exports = {};
__export(I07_starfield_warp_effect_exports, {
  default: () => I07_starfield_warp_effect_default
});
module.exports = __toCommonJS(I07_starfield_warp_effect_exports);
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const stars = Math.min(420, Math.max(80, Math.round(Number(ctx.params.stars ?? 260))));
    const speed = Math.min(4, Math.max(1, Math.round(Number(ctx.params.speed ?? 2))));
    const spread = Math.min(1.4, Math.max(0.4, Number(ctx.params.spread ?? 0.92)));
    const trail = Math.min(0.18, Math.max(0.01, Number(ctx.params.trail ?? 0.075)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const centerX = ctx.width / 2;
    const centerY = ctx.height / 2;
    const focal = Math.min(ctx.width, ctx.height) * 0.24;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.08;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    g.save();
    g.strokeStyle = signal;
    g.fillStyle = signal;
    g.lineCap = "round";
    g.shadowColor = signal;
    g.shadowBlur = Math.max(2, Math.min(ctx.width, ctx.height) * 0.012);
    for (let index = 0; index < stars; index += 1) {
      const baseX = (ctx.random(\`star:\${index}:x\`) * 2 - 1) * spread;
      const baseY = (ctx.random(\`star:\${index}:y\`) * 2 - 1) * spread;
      const startZ = ctx.random(\`star:\${index}:z\`);
      const wrapped = ((startZ - ctx.t * speed) % 1 + 1) % 1;
      const z = 0.055 + wrapped * 0.945;
      const previousZ = Math.min(1, z + trail * speed);
      const x = centerX + baseX / z * focal;
      const y = centerY + baseY / z * focal;
      const previousX = centerX + baseX / previousZ * focal;
      const previousY = centerY + baseY / previousZ * focal;
      const visible = x > -20 && x < ctx.width + 20 && y > -20 && y < ctx.height + 20;
      if (!visible) continue;
      const intensity = 1 - wrapped;
      g.globalAlpha = 0.18 + intensity * 0.82;
      g.lineWidth = 0.45 + intensity * 2.4;
      g.beginPath();
      g.moveTo(previousX, previousY);
      g.lineTo(x, y);
      g.stroke();
      g.beginPath();
      g.arc(x, y, 0.45 + intensity * 1.55, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  }
};
var I07_starfield_warp_effect_default = kernel;
`;export{e as default};
