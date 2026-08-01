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
var E05_scan_print_effect_exports = {};
__export(E05_scan_print_effect_exports, {
  default: () => E05_scan_print_effect_default
});
module.exports = __toCommonJS(E05_scan_print_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const density = Math.min(14, Math.max(3, Math.round(Number(ctx.params.density ?? 7))));
    const ink = Math.min(1, Math.max(0.1, Number(ctx.params.ink ?? 0.64)));
    const stains = Math.min(18, Math.max(3, Math.round(Number(ctx.params.stains ?? 9))));
    const feed = Math.min(3, Math.max(0.5, Number(ctx.params.feed ?? 1.2)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const feedPhase = ctx.t * ctx.height * feed % (density * 9);
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.86;
      g.filter = "grayscale(1) contrast(1.35)";
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    g.save();
    g.strokeStyle = signal;
    g.lineWidth = 1;
    for (let y = -density; y < ctx.height + density; y += density) {
      const row = Math.floor(y / density);
      const offset = Math.sin(row * 0.73 + ctx.t * TAU) * density * 0.42;
      g.globalAlpha = ink * (0.1 + ctx.random(\`screen:\${row}:alpha\`) * 0.13);
      g.beginPath();
      g.moveTo(offset, y);
      g.lineTo(ctx.width + offset, y + ctx.width * 0.08);
      g.stroke();
    }
    g.fillStyle = signal;
    for (let index = 0; index < stains; index += 1) {
      const x = ctx.random(\`stain:\${index}:x\`) * ctx.width;
      const y = ctx.random(\`stain:\${index}:y\`) * ctx.height;
      const radius = Math.min(ctx.width, ctx.height) * (0.012 + ctx.random(\`stain:\${index}:radius\`) * 0.045);
      const stretch = 0.35 + ctx.random(\`stain:\${index}:stretch\`) * 1.4;
      const pulse = 0.78 + Math.sin(ctx.t * TAU + ctx.random(\`stain:\${index}:phase\`) * TAU) * 0.22;
      g.globalAlpha = ink * (0.035 + ctx.random(\`stain:\${index}:alpha\`) * 0.075) * pulse;
      g.beginPath();
      g.ellipse(x, y, radius * stretch, radius, ctx.random(\`stain:\${index}:angle\`) * TAU, 0, TAU);
      g.fill();
    }
    const bandCount = Math.ceil(ctx.height / (density * 9)) + 2;
    for (let band = -1; band < bandCount; band += 1) {
      const y = band * density * 9 + feedPhase;
      const strength = 0.08 + ctx.random(\`feed:\${band}:strength\`) * 0.16;
      g.globalAlpha = ink * strength;
      g.fillRect(0, y, ctx.width, Math.max(1, density * 0.42));
    }
    g.restore();
  }
};
var E05_scan_print_effect_default = kernel;
`;export{n as default};
