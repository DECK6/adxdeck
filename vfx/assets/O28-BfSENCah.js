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
var O28_chain_drag_effect_exports = {};
__export(O28_chain_drag_effect_exports, {
  default: () => O28_chain_drag_effect_default
});
module.exports = __toCommonJS(O28_chain_drag_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const links = Math.max(8, Math.min(28, Math.round(Number(ctx.params.links ?? 20))));
    const lag = Number(ctx.params.lag ?? 0.02);
    const reach = Number(ctx.params.reach ?? 0.32);
    const thickness = Number(ctx.params.thickness ?? 2.5);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const pathAt = (time) => {
      const phase = TAU * ((time % 1 + 1) % 1);
      return {
        x: ctx.width / 2 + Math.sin(phase) * ctx.width * reach,
        y: ctx.height / 2 + Math.sin(phase * 2) * ctx.height * reach * 0.58
      };
    };
    const points = Array.from({ length: links }, (_, index) => pathAt(ctx.t - index * lag));
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.strokeStyle = \`\${signal}20\`;
    g.lineWidth = 1;
    g.setLineDash([3, 8]);
    g.beginPath();
    for (let index = 0; index <= 80; index += 1) {
      const point = pathAt(index / 80);
      if (index === 0) g.moveTo(point.x, point.y);
      else g.lineTo(point.x, point.y);
    }
    g.stroke();
    g.setLineDash([]);
    g.strokeStyle = \`\${signal}AA\`;
    g.lineWidth = thickness;
    g.beginPath();
    points.forEach((point, index) => index === 0 ? g.moveTo(point.x, point.y) : g.lineTo(point.x, point.y));
    g.stroke();
    for (let index = links - 1; index >= 0; index -= 1) {
      const point = points[index];
      const next = points[Math.max(0, index - 1)];
      const angle = Math.atan2(next.y - point.y, next.x - point.x);
      const fade = 1 - index / links * 0.72;
      g.save();
      g.translate(point.x, point.y);
      g.rotate(angle);
      g.globalAlpha = fade;
      g.strokeStyle = signal;
      g.lineWidth = thickness;
      g.beginPath();
      g.ellipse(0, 0, 9 + thickness * 1.5, 4 + thickness * 0.7, 0, 0, TAU);
      g.stroke();
      g.restore();
    }
    const leader = points[0];
    const size = Math.min(ctx.width, ctx.height) * 0.17;
    if (ctx.subject.bitmap) {
      g.save();
      g.shadowColor = signal;
      g.shadowBlur = 18;
      g.drawImage(ctx.subject.bitmap, leader.x - size, leader.y - size * 0.62, size * 2, size * 1.24);
      g.restore();
    }
    g.fillStyle = signal;
    g.font = \`\${Math.max(10, Math.min(ctx.width, ctx.height) * 0.018)}px monospace\`;
    g.fillText(\`DELAY \${(lag * 1e3).toFixed(0)}MS \\xD7 \${links}\`, ctx.width * 0.06, ctx.height * 0.93);
  }
};
var O28_chain_drag_effect_default = kernel;
`;export{n as default};
