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
var E01_film_grain_effect_exports = {};
__export(E01_film_grain_effect_exports, {
  default: () => E01_film_grain_effect_default
});
module.exports = __toCommonJS(E01_film_grain_effect_exports);
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const amount = Math.min(1, Math.max(0, Number(ctx.params.amount ?? 0.32)));
    const grainSize = Math.min(4, Math.max(1, Math.round(Number(ctx.params.grainSize ?? 2))));
    const mono = Boolean(ctx.params.mono ?? true);
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    if (amount === 0) return;
    g.save();
    g.globalCompositeOperation = "screen";
    g.globalAlpha = 0.12 + amount * 0.34;
    let i = 0;
    for (let y = 0; y < ctx.height; y += grainSize) {
      for (let x = 0; x < ctx.width; x += grainSize) {
        const noise = ctx.random(\`g:\${ctx.frame}:\${i}\`);
        i += 1;
        if (noise > amount * 0.72) continue;
        if (mono) {
          const value = Math.round(noise * 255);
          g.fillStyle = \`rgb(\${value} \${value} \${value})\`;
        } else {
          const red = Math.round(ctx.random(\`g:\${ctx.frame}:\${i}:r\`) * 255);
          const green = Math.round(ctx.random(\`g:\${ctx.frame}:\${i}:g\`) * 255);
          const blue = Math.round(ctx.random(\`g:\${ctx.frame}:\${i}:b\`) * 255);
          g.fillStyle = \`rgb(\${red} \${green} \${blue})\`;
        }
        g.fillRect(x, y, grainSize, grainSize);
      }
    }
    g.restore();
  }
};
var E01_film_grain_effect_default = kernel;
`;export{e as default};
