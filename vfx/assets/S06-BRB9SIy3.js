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
var S06_circle_pack_effect_exports = {};
__export(S06_circle_pack_effect_exports, {
  default: () => S06_circle_pack_effect_default
});
module.exports = __toCommonJS(S06_circle_pack_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const count = Math.min(64, Math.max(16, Math.round(Number(ctx.params.count ?? 38))));
    const growth = Math.min(1, Math.max(0.35, Number(ctx.params.growth ?? 0.82)));
    const drift = Math.min(1, Math.max(0, Number(ctx.params.drift ?? 0.42)));
    const weight = Math.min(5, Math.max(0.5, Number(ctx.params.weight ?? 1.8)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const shortSide = Math.min(ctx.width, ctx.height);
    const circles = [];
    for (let index = 0; index < count; index += 1) {
      const goldenAngle = 2.399963229728653;
      const ring = Math.sqrt((index + 0.6) / count);
      const angle = index * goldenAngle + ctx.random(\`c:\${index}:angle\`) * 0.35;
      const x = ctx.width * 0.5 + Math.cos(angle) * ring * ctx.width * 0.42;
      const y = ctx.height * 0.5 + Math.sin(angle) * ring * ctx.height * 0.42;
      let radius = shortSide * (0.035 + ctx.random(\`c:\${index}:size\`) * 0.055);
      for (const other of circles) radius = Math.min(radius, Math.hypot(x - other.x, y - other.y) - other.radius - shortSide * 6e-3);
      circles.push({
        x,
        y,
        radius: Math.max(shortSide * 0.012, radius),
        phase: ctx.random(\`c:\${index}:phase\`)
      });
    }
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.16;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    g.save();
    g.lineWidth = weight;
    g.strokeStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = weight * 3;
    for (let index = 0; index < circles.length; index += 1) {
      const circle = circles[index];
      const localPhase = ctx.t * TAU * 2 + circle.phase * TAU;
      const pulse = 0.22 + 0.78 * (0.5 - 0.5 * Math.cos(localPhase));
      const orbit = drift * shortSide * 0.014;
      const x = circle.x + Math.cos(ctx.t * TAU + circle.phase * TAU) * orbit;
      const y = circle.y + Math.sin(ctx.t * TAU + circle.phase * TAU) * orbit;
      const radius = circle.radius * (1 - growth + growth * pulse);
      g.globalAlpha = 0.35 + pulse * 0.58;
      g.fillStyle = \`\${signal}18\`;
      g.beginPath();
      g.arc(x, y, radius, 0, TAU);
      g.fill();
      g.stroke();
      if (index % 5 === 0) {
        g.globalAlpha = 0.75;
        g.fillStyle = signal;
        g.beginPath();
        g.arc(x, y, Math.max(1.2, weight * pulse), 0, TAU);
        g.fill();
      }
    }
    g.restore();
  }
};
var S06_circle_pack_effect_default = kernel;
`;export{e as default};
