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
var E16_static_wool_effect_exports = {};
__export(E16_static_wool_effect_exports, {
  default: () => E16_static_wool_effect_default
});
module.exports = __toCommonJS(E16_static_wool_effect_exports);
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const fibers = Math.round(Number(ctx.params.fibers ?? 58));
    const curl = Number(ctx.params.curl ?? 18);
    const charge = Number(ctx.params.charge ?? 0.62);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * Math.PI * 2;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.globalAlpha = 0.34;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    }
    g.lineCap = "round";
    for (let index = 0; index < fibers; index += 1) {
      const y = ctx.random(\`y:\${index}\`) * ctx.height;
      const start = -40 + ctx.random(\`x:\${index}\`) * ctx.width * 0.3;
      const length = ctx.width * (0.48 + ctx.random(\`l:\${index}\`) * 0.72);
      const amp = curl * (0.35 + ctx.random(\`a:\${index}\`));
      const lift = Math.sin(phase * (0.7 + index % 5 * 0.11) + index * 1.37) * amp * charge;
      g.beginPath();
      g.moveTo(start, y);
      g.bezierCurveTo(start + length * 0.28, y + lift, start + length * 0.66, y - lift * 0.72, start + length, y + Math.sin(phase + index) * amp * 0.3);
      g.strokeStyle = index % 5 === 0 ? signal : "#D8DEE1";
      g.globalAlpha = 0.08 + ctx.random(\`o:\${index}\`) * 0.24 + (index % 5 === 0 ? charge * 0.16 : 0);
      g.lineWidth = 0.6 + ctx.random(\`w:\${index}\`) * 2.2;
      g.stroke();
    }
    g.globalAlpha = 0.25 + charge * 0.35;
    g.strokeStyle = signal;
    g.lineWidth = 1.2;
    for (let spark = 0; spark < 7; spark += 1) {
      const x = (ctx.random(\`sx:\${spark}\`) * ctx.width + ctx.t * ctx.width * (0.4 + spark * 0.07)) % ctx.width;
      const y = ctx.random(\`sy:\${spark}\`) * ctx.height;
      g.beginPath();
      g.moveTo(x - 8, y);
      g.lineTo(x, y - 7);
      g.lineTo(x + 6, y + 5);
      g.stroke();
    }
    g.globalAlpha = 1;
  }
};
var E16_static_wool_effect_default = kernel;
`;export{t as default};
