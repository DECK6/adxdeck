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
var S08_triangulate_effect_exports = {};
__export(S08_triangulate_effect_exports, {
  default: () => S08_triangulate_effect_default
});
module.exports = __toCommonJS(S08_triangulate_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const columns = Math.min(8, Math.max(3, Math.round(Number(ctx.params.density ?? 6))));
    const rows = Math.max(3, Math.round(columns * ctx.height / Math.max(1, ctx.width)));
    const depth = Math.min(0.4, Math.max(0.04, Number(ctx.params.depth ?? 0.22)));
    const twist = Math.min(1, Math.max(0, Number(ctx.params.twist ?? 0.48)));
    const edge = Math.min(4, Math.max(0.5, Number(ctx.params.edge ?? 1.2)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const points = [];
    for (let row = 0; row <= rows; row += 1) {
      const line = [];
      for (let column = 0; column <= columns; column += 1) {
        const boundary = row === 0 || row === rows || column === 0 || column === columns;
        const jitterX = boundary ? 0 : (ctx.random(\`m:\${row}:\${column}:x\`) - 0.5) * 0.58;
        const jitterY = boundary ? 0 : (ctx.random(\`m:\${row}:\${column}:y\`) - 0.5) * 0.58;
        line.push({
          x: (column + jitterX) / columns * ctx.width,
          y: (row + jitterY) / rows * ctx.height
        });
      }
      points.push(line);
    }
    const triangles = [];
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const a = points[row][column];
        const b = points[row][column + 1];
        const c = points[row + 1][column];
        const d = points[row + 1][column + 1];
        if ((row + column) % 2 === 0) triangles.push([a, b, d], [a, d, c]);
        else triangles.push([a, b, c], [b, d, c]);
      }
    }
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.1;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    for (let index = 0; index < triangles.length; index += 1) {
      const triangle = triangles[index];
      const centerX = (triangle[0].x + triangle[1].x + triangle[2].x) / 3;
      const centerY = (triangle[0].y + triangle[1].y + triangle[2].y) / 3;
      const phase = ctx.random(\`t:\${index}:phase\`) * TAU;
      const wave = Math.sin(ctx.t * TAU + phase);
      const lift = (0.5 + 0.5 * wave) * depth;
      const fromCenterX = centerX - ctx.width * 0.5;
      const fromCenterY = centerY - ctx.height * 0.5;
      const moveX = fromCenterX * lift + Math.cos(phase + ctx.t * TAU) * ctx.width * depth * 0.035;
      const moveY = fromCenterY * lift + Math.sin(phase + ctx.t * TAU) * ctx.height * depth * 0.035;
      const angle = wave * twist * 0.24;
      const scale = 1 - lift * 0.18;
      g.save();
      g.translate(centerX + moveX, centerY + moveY);
      g.rotate(angle);
      g.scale(scale, scale);
      g.translate(-centerX, -centerY);
      g.beginPath();
      g.moveTo(triangle[0].x, triangle[0].y);
      g.lineTo(triangle[1].x, triangle[1].y);
      g.lineTo(triangle[2].x, triangle[2].y);
      g.closePath();
      g.clip();
      if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      else {
        g.fillStyle = \`\${signal}1f\`;
        g.fillRect(0, 0, ctx.width, ctx.height);
      }
      g.restore();
      g.save();
      g.translate(centerX + moveX, centerY + moveY);
      g.rotate(angle);
      g.scale(scale, scale);
      g.translate(-centerX, -centerY);
      g.strokeStyle = signal;
      g.globalAlpha = 0.28 + lift * 1.6;
      g.lineWidth = edge;
      g.beginPath();
      g.moveTo(triangle[0].x, triangle[0].y);
      g.lineTo(triangle[1].x, triangle[1].y);
      g.lineTo(triangle[2].x, triangle[2].y);
      g.closePath();
      g.stroke();
      g.restore();
    }
  }
};
var S08_triangulate_effect_default = kernel;
`;export{n as default};
