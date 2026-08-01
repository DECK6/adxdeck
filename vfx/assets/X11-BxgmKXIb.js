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
var X11_shatter_break_effect_exports = {};
__export(X11_shatter_break_effect_exports, {
  default: () => X11_shatter_break_effect_default
});
module.exports = __toCommonJS(X11_shatter_break_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const columns = Math.min(9, Math.max(4, Math.round(Number(ctx.params.grid ?? 7))));
    const rows = Math.max(3, Math.round(columns * ctx.height / Math.max(1, ctx.width)));
    const force = Math.min(1, Math.max(0.2, Number(ctx.params.force ?? 0.72)));
    const spin = Math.min(1, Math.max(0, Number(ctx.params.spin ?? 0.68)));
    const gap = Math.min(5, Math.max(0.5, Number(ctx.params.gap ?? 1.4)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const points = [];
    for (let row = 0; row <= rows; row += 1) {
      const line = [];
      for (let column = 0; column <= columns; column += 1) {
        const onEdge = row === 0 || row === rows || column === 0 || column === columns;
        const jitterX = onEdge ? 0 : (ctx.random(\`s:\${row}:\${column}:x\`) - 0.5) * 0.72;
        const jitterY = onEdge ? 0 : (ctx.random(\`s:\${row}:\${column}:y\`) - 0.5) * 0.72;
        line.push({
          x: (column + jitterX) / columns * ctx.width,
          y: (row + jitterY) / rows * ctx.height
        });
      }
      points.push(line);
    }
    const shards = [];
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const a = points[row][column];
        const b = points[row][column + 1];
        const c = points[row + 1][column];
        const d = points[row + 1][column + 1];
        if (ctx.random(\`s:\${row}:\${column}:split\`) > 0.5) shards.push([a, b, d], [a, d, c]);
        else shards.push([a, b, c], [b, d, c]);
      }
    }
    const rawBreak = 0.5 - 0.5 * Math.cos(ctx.t * TAU);
    const breakAmount = rawBreak * rawBreak * (3 - 2 * rawBreak);
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    const glowX = ctx.width * (0.5 + Math.cos(ctx.t * TAU * 2) * 0.2);
    const glowY = ctx.height * (0.5 + Math.sin(ctx.t * TAU * 2) * 0.2);
    const field = g.createRadialGradient(glowX, glowY, 0, glowX, glowY, Math.max(ctx.width, ctx.height) * 0.72);
    field.addColorStop(0, \`\${signal}3d\`);
    field.addColorStop(0.42, \`\${signal}14\`);
    field.addColorStop(1, "#0D0E10");
    g.fillStyle = field;
    g.fillRect(0, 0, ctx.width, ctx.height);
    for (let index = 0; index < shards.length; index += 1) {
      const shard = shards[index];
      const centerX = (shard[0].x + shard[1].x + shard[2].x) / 3;
      const centerY = (shard[0].y + shard[1].y + shard[2].y) / 3;
      const radialX = centerX - ctx.width * 0.5;
      const radialY = centerY - ctx.height * 0.5;
      const radialLength = Math.max(1, Math.hypot(radialX, radialY));
      const baseAngle = Math.atan2(radialY, radialX);
      const scatter = (ctx.random(\`s:\${index}:scatter\`) - 0.5) * 1.25;
      const direction = baseAngle + scatter;
      const distance = breakAmount * force * Math.min(ctx.width, ctx.height) * (0.3 + ctx.random(\`s:\${index}:force\`) * 0.75);
      const moveX = Math.cos(direction) * distance + radialX / radialLength * breakAmount * gap * 2;
      const moveY = Math.sin(direction) * distance + radialY / radialLength * breakAmount * gap * 2;
      const angle = (ctx.random(\`s:\${index}:spin\`) - 0.5) * spin * breakAmount * TAU;
      const scale = 1 - breakAmount * (0.04 + ctx.random(\`s:\${index}:scale\`) * 0.12);
      g.save();
      g.translate(centerX + moveX, centerY + moveY);
      g.rotate(angle);
      g.scale(scale, scale);
      g.translate(-centerX, -centerY);
      g.beginPath();
      g.moveTo(shard[0].x, shard[0].y);
      g.lineTo(shard[1].x, shard[1].y);
      g.lineTo(shard[2].x, shard[2].y);
      g.closePath();
      g.clip();
      if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      else {
        g.fillStyle = \`\${signal}24\`;
        g.fillRect(0, 0, ctx.width, ctx.height);
      }
      g.restore();
      g.save();
      g.translate(centerX + moveX, centerY + moveY);
      g.rotate(angle);
      g.scale(scale, scale);
      g.translate(-centerX, -centerY);
      g.strokeStyle = signal;
      g.lineWidth = gap;
      g.globalAlpha = 0.22 + breakAmount * 0.72;
      g.shadowColor = signal;
      g.shadowBlur = gap * 2.5;
      g.beginPath();
      g.moveTo(shard[0].x, shard[0].y);
      g.lineTo(shard[1].x, shard[1].y);
      g.lineTo(shard[2].x, shard[2].y);
      g.closePath();
      g.stroke();
      g.restore();
    }
  }
};
var X11_shatter_break_effect_default = kernel;
`;export{n as default};
