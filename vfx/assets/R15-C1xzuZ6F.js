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
var R15_penrose_tile_effect_exports = {};
__export(R15_penrose_tile_effect_exports, {
  default: () => R15_penrose_tile_effect_default
});
module.exports = __toCommonJS(R15_penrose_tile_effect_exports);
const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;
function mix(a, b, amount) {
  return { x: a.x + (b.x - a.x) * amount, y: a.y + (b.y - a.y) * amount };
}
function subdivide(triangles) {
  const next = [];
  for (const triangle of triangles) {
    if (triangle.kind === 0) {
      const p = mix(triangle.a, triangle.b, 1 / PHI);
      next.push({ kind: 0, a: p, b: triangle.c, c: triangle.a });
      next.push({ kind: 1, a: triangle.c, b: p, c: triangle.b });
    } else {
      const q = mix(triangle.b, triangle.a, 1 / PHI);
      const r = mix(triangle.b, triangle.c, 1 / PHI);
      next.push({ kind: 1, a: r, b: triangle.c, c: triangle.a });
      next.push({ kind: 1, a: q, b: r, c: triangle.b });
      next.push({ kind: 0, a: r, b: q, c: triangle.a });
    }
  }
  return next;
}
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const depth = Math.min(6, Math.max(3, Math.round(Number(ctx.params.depth ?? 5))));
    const growth = Math.min(1.5, Math.max(0.5, Number(ctx.params.growth ?? 1)));
    const rotation = Math.min(1, Math.max(0, Number(ctx.params.rotation ?? 0.18)));
    const lineWidth = Math.min(2.4, Math.max(0.4, Number(ctx.params.lineWidth ?? 1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const reveal = Math.min(1, (0.5 - 0.5 * Math.cos(phase)) * growth);
    const radius = Math.hypot(ctx.width, ctx.height) * 0.63;
    const center = { x: ctx.width * 0.5, y: ctx.height * 0.5 };
    let triangles = [];
    for (let index = 0; index < 10; index += 1) {
      const a0 = phase * rotation * 0.12 + index * TAU / 10;
      const a1 = phase * rotation * 0.12 + (index + 1) * TAU / 10;
      const first = { x: center.x + Math.cos(a0) * radius, y: center.y + Math.sin(a0) * radius };
      const second = { x: center.x + Math.cos(a1) * radius, y: center.y + Math.sin(a1) * radius };
      triangles.push(index % 2 === 0 ? { kind: 0, a: center, b: first, c: second } : { kind: 0, a: center, b: second, c: first });
    }
    for (let level = 0; level < depth; level += 1) triangles = subdivide(triangles);
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.18;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    const ordered = triangles.map((triangle) => ({
      triangle,
      distance: Math.hypot(
        (triangle.a.x + triangle.b.x + triangle.c.x) / 3 - center.x,
        (triangle.a.y + triangle.b.y + triangle.c.y) / 3 - center.y
      )
    })).sort((left, right) => left.distance - right.distance);
    const visible = Math.floor(ordered.length * reveal);
    g.save();
    g.strokeStyle = signal;
    g.lineWidth = lineWidth;
    g.lineJoin = "round";
    g.shadowColor = signal;
    g.shadowBlur = lineWidth * 2.5;
    for (let index = 0; index < visible; index += 1) {
      const { triangle } = ordered[index];
      g.globalAlpha = triangle.kind === 0 ? 0.64 : 0.38;
      g.fillStyle = triangle.kind === 0 ? \`\${signal}18\` : \`\${signal}0A\`;
      g.beginPath();
      g.moveTo(triangle.a.x, triangle.a.y);
      g.lineTo(triangle.b.x, triangle.b.y);
      g.lineTo(triangle.c.x, triangle.c.y);
      g.closePath();
      g.fill();
      g.stroke();
    }
    g.restore();
  }
};
var R15_penrose_tile_effect_default = kernel;
`;export{n as default};
