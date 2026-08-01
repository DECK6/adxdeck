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
var G05_vhs_tracking_effect_exports = {};
__export(G05_vhs_tracking_effect_exports, {
  default: () => G05_vhs_tracking_effect_default
});
module.exports = __toCommonJS(G05_vhs_tracking_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const tracking = Math.min(1, Math.max(0, Number(ctx.params.tracking ?? 0.68)));
    const bleed = Math.min(16, Math.max(0, Number(ctx.params.bleed ?? 6)));
    const scanlines = Boolean(ctx.params.scanlines ?? true);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const loopFrame = (ctx.frame % ctx.durationInFrames + ctx.durationInFrames) % ctx.durationInFrames;
    const progress = loopFrame / ctx.durationInFrames;
    const phase = progress * TAU;
    const wobble = Math.sin(phase * 4) * tracking * ctx.width * 6e-3;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.drawImage(ctx.subject.bitmap, wobble, 0, ctx.width, ctx.height);
      const trackingY = progress * 2.4 % 1 * (ctx.height * 1.25) - ctx.height * 0.12;
      const zoneHeight = ctx.height * (0.1 + tracking * 0.12);
      const slices = 7;
      for (let slice = 0; slice < slices; slice += 1) {
        const y = trackingY + slice / slices * zoneHeight;
        const height = zoneHeight / slices + 1;
        const wave = Math.sin(phase * 3 + slice * 1.7);
        const shift = wave * tracking * ctx.width * 0.035;
        g.drawImage(ctx.subject.bitmap, 0, y, ctx.width, height, shift, y, ctx.width, height);
      }
      if (bleed > 0) {
        g.save();
        g.globalCompositeOperation = "screen";
        g.globalAlpha = 0.16 + tracking * 0.16;
        g.drawImage(ctx.subject.bitmap, bleed, 0, ctx.width, ctx.height);
        g.globalAlpha = 0.12 + tracking * 0.12;
        g.drawImage(ctx.subject.bitmap, -bleed * 0.65, 0, ctx.width, ctx.height);
        g.fillStyle = signal;
        g.globalAlpha = 0.06 + tracking * 0.08;
        g.fillRect(0, 0, ctx.width, ctx.height);
        g.restore();
      }
    }
    g.save();
    const headHeight = Math.max(2, ctx.height * 0.012);
    const headY = progress * 2.4 % 1 * (ctx.height + headHeight) - headHeight;
    g.globalAlpha = 0.22 + tracking * 0.42;
    g.fillStyle = "rgba(255,255,255,0.92)";
    g.fillRect(0, headY, ctx.width, headHeight);
    g.globalAlpha = tracking * 0.2;
    g.fillStyle = signal;
    g.fillRect(0, headY + headHeight, ctx.width, headHeight * 2.2);
    if (scanlines) {
      g.globalAlpha = 0.12 + tracking * 0.08;
      g.fillStyle = "#0D0E10";
      const spacing = Math.max(3, Math.round(ctx.height / 110));
      for (let y = 0; y < ctx.height; y += spacing) g.fillRect(0, y, ctx.width, 1);
    }
    g.restore();
  }
};
var G05_vhs_tracking_effect_default = kernel;
`;export{t as default};
