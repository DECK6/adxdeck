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
var S07_voronoi_shatter_effect_exports = {};
__export(S07_voronoi_shatter_effect_exports, {
  default: () => S07_voronoi_shatter_effect_default
});
module.exports = __toCommonJS(S07_voronoi_shatter_effect_exports);
const TAU = Math.PI * 2;
function clipCell(polygon, site, other) {
  const nx = other.x - site.x;
  const ny = other.y - site.y;
  const midpoint = (other.x * other.x + other.y * other.y - site.x * site.x - site.y * site.y) * 0.5;
  const output = [];
  for (let index = 0; index < polygon.length; index += 1) {
    const a = polygon[index];
    const b = polygon[(index + 1) % polygon.length];
    const da = a.x * nx + a.y * ny - midpoint;
    const db = b.x * nx + b.y * ny - midpoint;
    if (da <= 0) output.push(a);
    if (da <= 0 !== db <= 0) {
      const mix = da / (da - db);
      output.push({ x: a.x + (b.x - a.x) * mix, y: a.y + (b.y - a.y) * mix });
    }
  }
  return output;
}
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const cellCount = Math.min(30, Math.max(10, Math.round(Number(ctx.params.cells ?? 19))));
    const spread = Math.min(0.55, Math.max(0.05, Number(ctx.params.spread ?? 0.3)));
    const rotation = Math.min(1, Math.max(0, Number(ctx.params.rotation ?? 0.62)));
    const edge = Math.min(5, Math.max(0.5, Number(ctx.params.edge ?? 1.5)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const sites = Array.from({ length: cellCount }, (_, index) => ({
      x: ctx.width * (0.08 + ctx.random(\`v:\${index}:x\`) * 0.84),
      y: ctx.height * (0.08 + ctx.random(\`v:\${index}:y\`) * 0.84)
    }));
    const cells = sites.map((site) => {
      let polygon = [
        { x: 0, y: 0 },
        { x: ctx.width, y: 0 },
        { x: ctx.width, y: ctx.height },
        { x: 0, y: ctx.height }
      ];
      for (const other of sites) {
        if (other !== site) polygon = clipCell(polygon, site, other);
        if (polygon.length === 0) break;
      }
      return polygon;
    });
    const breakAmount = Math.pow(0.5 - 0.5 * Math.cos(ctx.t * TAU * 2), 0.72);
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    const field = g.createRadialGradient(
      ctx.width * (0.5 + Math.cos(ctx.t * TAU) * 0.18),
      ctx.height * (0.5 + Math.sin(ctx.t * TAU) * 0.18),
      0,
      ctx.width * 0.5,
      ctx.height * 0.5,
      Math.max(ctx.width, ctx.height) * 0.7
    );
    field.addColorStop(0, \`\${signal}32\`);
    field.addColorStop(1, "#0D0E10");
    g.fillStyle = field;
    g.fillRect(0, 0, ctx.width, ctx.height);
    for (let index = 0; index < cells.length; index += 1) {
      const polygon = cells[index];
      if (polygon.length < 3) continue;
      const site = sites[index];
      const dx = site.x - ctx.width * 0.5;
      const dy = site.y - ctx.height * 0.5;
      const length = Math.max(1, Math.hypot(dx, dy));
      const jitterAngle = (ctx.random(\`v:\${index}:direction\`) - 0.5) * 0.9;
      const direction = Math.atan2(dy, dx) + jitterAngle;
      const distance = breakAmount * spread * Math.min(ctx.width, ctx.height) * (0.55 + ctx.random(\`v:\${index}:force\`));
      const angle = (ctx.random(\`v:\${index}:spin\`) - 0.5) * rotation * breakAmount * Math.PI;
      const moveX = Math.cos(direction) * distance + dx / length * breakAmount * 4;
      const moveY = Math.sin(direction) * distance + dy / length * breakAmount * 4;
      g.save();
      g.translate(site.x + moveX, site.y + moveY);
      g.rotate(angle);
      g.translate(-site.x, -site.y);
      g.beginPath();
      g.moveTo(polygon[0].x, polygon[0].y);
      for (let pointIndex = 1; pointIndex < polygon.length; pointIndex += 1) g.lineTo(polygon[pointIndex].x, polygon[pointIndex].y);
      g.closePath();
      g.clip();
      if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      else {
        g.fillStyle = \`\${signal}22\`;
        g.fillRect(0, 0, ctx.width, ctx.height);
      }
      g.restore();
      g.save();
      g.translate(site.x + moveX, site.y + moveY);
      g.rotate(angle);
      g.translate(-site.x, -site.y);
      g.strokeStyle = signal;
      g.globalAlpha = 0.42 + breakAmount * 0.5;
      g.lineWidth = edge;
      g.shadowColor = signal;
      g.shadowBlur = edge * 2;
      g.beginPath();
      g.moveTo(polygon[0].x, polygon[0].y);
      for (let pointIndex = 1; pointIndex < polygon.length; pointIndex += 1) g.lineTo(polygon[pointIndex].x, polygon[pointIndex].y);
      g.closePath();
      g.stroke();
      g.restore();
    }
  }
};
var S07_voronoi_shatter_effect_default = kernel;
`;export{n as default};
