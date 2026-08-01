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
var E11_chromatic_grain_effect_exports = {};
__export(E11_chromatic_grain_effect_exports, {
  default: () => E11_chromatic_grain_effect_default
});
module.exports = __toCommonJS(E11_chromatic_grain_effect_exports);
const TAU = Math.PI * 2;
const CHANNELS = ["#F04E98", "#7567FF"];
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const amount = Math.min(1, Math.max(0.15, Number(ctx.params.amount ?? 0.68)));
    const grainSize = Math.min(9, Math.max(2, Math.round(Number(ctx.params.grainSize ?? 4))));
    const orbit = Math.min(42, Math.max(4, Number(ctx.params.orbit ?? 22)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const count = Math.round(ctx.width * ctx.height / (grainSize * grainSize) * 0.075 * amount);
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    g.save();
    g.globalCompositeOperation = "screen";
    for (let index = 0; index < count; index += 1) {
      const baseX = ctx.random(\`grain:\${index}:x\`) * ctx.width;
      const baseY = ctx.random(\`grain:\${index}:y\`) * ctx.height;
      const direction = ctx.random(\`grain:\${index}:phase\`) * TAU;
      const radius = orbit * (0.35 + ctx.random(\`grain:\${index}:radius\`) * 0.65);
      const x = (baseX + Math.cos(phase + direction) * radius + ctx.width) % ctx.width;
      const y = (baseY + Math.sin(phase * 2 + direction) * radius * 0.7 + ctx.height) % ctx.height;
      const channel = index % 3;
      const size = grainSize * (0.55 + ctx.random(\`grain:\${index}:size\`) * 1.1);
      g.fillStyle = channel === 0 ? signal : CHANNELS[channel - 1];
      g.globalAlpha = amount * (0.18 + ctx.random(\`grain:\${index}:alpha\`) * 0.5);
      g.fillRect(x - size * 0.5, y - size * 0.5, size, size);
    }
    g.restore();
  }
};
var E11_chromatic_grain_effect_default = kernel;
`;export{n as default};
