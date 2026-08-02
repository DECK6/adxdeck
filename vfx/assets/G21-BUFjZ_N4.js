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
var G21_feedback_loop_effect_exports = {};
__export(G21_feedback_loop_effect_exports, {
  default: () => G21_feedback_loop_effect_default
});
module.exports = __toCommonJS(G21_feedback_loop_effect_exports);
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const copies = Math.round(Number(ctx.params.copies ?? 11));
    const zoom = Number(ctx.params.zoom ?? 0.72);
    const twist = Number(ctx.params.twist ?? 0.08);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * Math.PI * 2;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (!ctx.subject.bitmap) return;
    for (let index = copies - 1; index >= 0; index -= 1) {
      const scale = Math.pow(zoom, index) * (1 + Math.sin(phase + index * 0.6) * 0.018);
      const rotation = phase * twist * (index + 1);
      const driftX = Math.sin(phase * 1.3 + index) * index * 1.8;
      const driftY = Math.cos(phase * 0.9 + index * 0.7) * index * 1.2;
      g.save();
      g.translate(ctx.width / 2 + driftX, ctx.height / 2 + driftY);
      g.rotate(rotation);
      g.scale(scale, scale);
      g.translate(-ctx.width / 2, -ctx.height / 2);
      g.globalAlpha = 0.18 + (1 - index / copies) * 0.68;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.strokeStyle = signal;
      g.lineWidth = Math.max(1, 3 / scale);
      g.globalAlpha *= 0.55;
      g.strokeRect(ctx.width * 0.08, ctx.height * 0.08, ctx.width * 0.84, ctx.height * 0.84);
      g.restore();
    }
    g.globalAlpha = 0.2;
    g.fillStyle = signal;
    for (let y = phase * 24 % 24; y < ctx.height; y += 24) g.fillRect(0, y, ctx.width, 1);
    g.globalAlpha = 1;
  }
};
var G21_feedback_loop_effect_default = kernel;
`;export{e as default};
