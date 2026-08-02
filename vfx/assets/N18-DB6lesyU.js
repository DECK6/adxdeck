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
var N18_ice_freeze_effect_exports = {};
__export(N18_ice_freeze_effect_exports, {
  default: () => N18_ice_freeze_effect_default
});
module.exports = __toCommonJS(N18_ice_freeze_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const density = Math.min(36, Math.max(8, Math.round(Number(ctx.params.density ?? 22))));
    const spread = Math.min(1, Math.max(0.35, Number(ctx.params.spread ?? 0.74)));
    const branching = Math.min(0.8, Math.max(0.1, Number(ctx.params.branching ?? 0.46)));
    const frost = Math.min(0.9, Math.max(0.15, Number(ctx.params.frost ?? 0.58)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const freeze = 0.5 - 0.5 * Math.cos(ctx.t * TAU);
    const scale = Math.min(ctx.width, ctx.height);
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.86 - freeze * frost * 0.42;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    g.save();
    g.fillStyle = signal;
    g.globalAlpha = freeze * frost * 0.1;
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.strokeStyle = signal;
    g.lineCap = "round";
    g.lineJoin = "round";
    g.shadowColor = signal;
    g.shadowBlur = Math.max(2, scale * 0.014);
    for (let crystal = 0; crystal < density; crystal += 1) {
      const edge = Math.floor(ctx.random(\`ice:\${crystal}:edge\`) * 4);
      const along = 0.04 + ctx.random(\`ice:\${crystal}:along\`) * 0.92;
      let x = edge === 1 ? ctx.width : edge === 3 ? 0 : along * ctx.width;
      let y = edge === 0 ? 0 : edge === 2 ? ctx.height : along * ctx.height;
      let angle = edge === 0 ? Math.PI * 0.5 : edge === 1 ? Math.PI : edge === 2 ? -Math.PI * 0.5 : 0;
      angle += (ctx.random(\`ice:\${crystal}:lean\`) - 0.5) * 0.9;
      const total = scale * spread * (0.12 + ctx.random(\`ice:\${crystal}:reach\`) * 0.2);
      const segments = 5 + Math.floor(ctx.random(\`ice:\${crystal}:segments\`) * 4);
      for (let segment = 0; segment < segments; segment += 1) {
        const reveal = Math.min(1, Math.max(0, freeze * (segments + 1) - segment));
        if (reveal <= 0) continue;
        const key = \`ice:\${crystal}:\${segment}\`;
        const length = total / segments * (0.72 + ctx.random(\`\${key}:length\`) * 0.56) * reveal;
        const turn = (ctx.random(\`\${key}:turn\`) - 0.5) * 0.28;
        angle += turn;
        const nx = x + Math.cos(angle) * length;
        const ny = y + Math.sin(angle) * length;
        g.globalAlpha = (0.28 + frost * 0.62) * reveal;
        g.lineWidth = Math.max(0.7, scale * (7e-3 - segment * 65e-5));
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(nx, ny);
        g.stroke();
        if (ctx.random(\`\${key}:branch\`) < branching) {
          const side = ctx.random(\`\${key}:side\`) < 0.5 ? -1 : 1;
          const branchAngle = angle + side * (0.62 + ctx.random(\`\${key}:fork\`) * 0.38);
          const branchLength = length * (0.48 + ctx.random(\`\${key}:branch-length\`) * 0.48);
          g.globalAlpha *= 0.72;
          g.lineWidth *= 0.62;
          g.beginPath();
          g.moveTo(nx, ny);
          g.lineTo(nx + Math.cos(branchAngle) * branchLength, ny + Math.sin(branchAngle) * branchLength);
          g.stroke();
        }
        x = nx;
        y = ny;
      }
    }
    g.restore();
  }
};
var N18_ice_freeze_effect_default = kernel;
`;export{e as default};
