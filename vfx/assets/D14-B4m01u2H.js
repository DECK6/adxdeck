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
var D14_time_displace_effect_exports = {};
__export(D14_time_displace_effect_exports, {
  default: () => D14_time_displace_effect_default
});
module.exports = __toCommonJS(D14_time_displace_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const intensity = Math.min(1, Math.max(0, Number(ctx.params.intensity ?? 0.72)));
    const rowHeight = Math.min(18, Math.max(1, Math.round(Number(ctx.params.rowHeight ?? 4))));
    const history = Math.min(90, Math.max(6, Math.round(Number(ctx.params.history ?? 54))));
    const drift = Math.min(120, Math.max(0, Number(ctx.params.drift ?? 48)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (!ctx.subject.bitmap) return;
    g.save();
    g.beginPath();
    g.rect(0, 0, ctx.width, ctx.height);
    g.clip();
    let row = 0;
    for (let y = 0; y < ctx.height; y += rowHeight) {
      const height = Math.min(rowHeight, ctx.height - y);
      const depth = y / Math.max(1, ctx.height - 1);
      const frameOffset = Math.round(depth * history);
      const sampleFrame = (ctx.frame - frameOffset + duration) % duration;
      const sampleT = sampleFrame / duration;
      const wobble = Math.sin(sampleT * TAU * 2 + depth * TAU * 1.5);
      const jitter = ctx.random(\`slit:\${row}:jitter\`) * 2 - 1;
      const shift = (wobble * 0.76 + jitter * 0.24) * drift * intensity;
      const sourceX = Math.max(0, -shift);
      const sourceWidth = Math.max(1, ctx.width - Math.abs(shift));
      const destinationX = Math.max(0, shift);
      g.drawImage(ctx.subject.bitmap, sourceX, y, sourceWidth, height, destinationX, y, sourceWidth, height);
      if (row % 5 === 0 && intensity > 0) {
        g.globalAlpha = intensity * 0.18;
        g.fillStyle = signal;
        g.fillRect(destinationX, y, Math.max(2, Math.abs(shift) * 0.3), 1);
        g.globalAlpha = 1;
      }
      row += 1;
    }
    g.restore();
  }
};
var D14_time_displace_effect_default = kernel;
`;export{t as default};
