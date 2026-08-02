const t=`var __defProp = Object.defineProperty;
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
var K07_bit_rain_effect_exports = {};
__export(K07_bit_rain_effect_exports, {
  default: () => K07_bit_rain_effect_default
});
module.exports = __toCommonJS(K07_bit_rain_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const columns = Math.min(36, Math.max(8, Math.round(Number(ctx.params.columns ?? 22))));
    const speed = Math.min(4, Math.max(1, Math.round(Number(ctx.params.speed ?? 2))));
    const trail = Math.min(12, Math.max(3, Math.round(Number(ctx.params.trail ?? 7))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const cell = ctx.width / columns;
    const packetHeight = Math.max(8, cell * 0.52);
    const travel = ctx.height + packetHeight * trail;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.28;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = Math.max(2, cell * 0.14);
    for (let column = 0; column < columns; column += 1) {
      const lane = 1 + Math.floor(ctx.random(\`lane:\${column}\`) * 3);
      const phase = ctx.random(\`phase:\${column}\`);
      const head = (phase + ctx.t * speed * lane) % 1 * travel - packetHeight;
      const x = column * cell + cell * 0.12;
      for (let tailIndex = 0; tailIndex < trail; tailIndex += 1) {
        const y = head - tailIndex * packetHeight;
        if (y < -packetHeight || y > ctx.height + packetHeight) continue;
        const brightness = (1 - tailIndex / trail) ** 1.7;
        const byte = Math.floor(ctx.random(\`byte:\${column}:\${tailIndex}\`) * 256);
        const pulse = 0.82 + Math.sin(TAU * ctx.t * speed + column * 0.61) * 0.18;
        g.globalAlpha = (0.12 + brightness * 0.84) * pulse;
        for (let bit = 0; bit < 8; bit += 1) {
          const on = (byte & 1 << bit) !== 0;
          const bitColumn = bit % 4;
          const bitRow = Math.floor(bit / 4);
          const bitSize = cell * (on ? 0.13 : 0.075);
          const bitX = x + bitColumn * cell * 0.19;
          const bitY = y + bitRow * packetHeight * 0.42;
          g.fillRect(bitX, bitY, bitSize, bitSize);
        }
      }
    }
    g.restore();
    g.save();
    g.globalAlpha = 0.32;
    g.strokeStyle = signal;
    g.lineWidth = 1;
    g.strokeRect(ctx.width * 0.08, ctx.height * 0.09, ctx.width * 0.84, ctx.height * 0.82);
    g.restore();
  }
};
var K07_bit_rain_effect_default = kernel;
`;export{t as default};
