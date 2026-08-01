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
var G02_datamosh_slice_effect_exports = {};
__export(G02_datamosh_slice_effect_exports, {
  default: () => G02_datamosh_slice_effect_default
});
module.exports = __toCommonJS(G02_datamosh_slice_effect_exports);
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const intensity = Math.min(1, Math.max(0, Number(ctx.params.intensity ?? 0.68)));
    const sliceHeight = Math.min(64, Math.max(6, Math.round(Number(ctx.params.sliceHeight ?? 22))));
    const maxShift = Math.min(180, Math.max(4, Number(ctx.params.maxShift ?? 72)));
    const channelOffset = Math.min(24, Math.max(0, Number(ctx.params.channelOffset ?? 8)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (!ctx.subject.bitmap) return;
    g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    if (intensity === 0) return;
    const beat = ctx.t * 15;
    const event = Math.floor(beat);
    const eventPhase = beat - event;
    const envelope = Math.pow(Math.sin(eventPhase * Math.PI), 3);
    g.save();
    g.beginPath();
    g.rect(0, 0, ctx.width, ctx.height);
    g.clip();
    let slice = 0;
    for (let y = 0; y < ctx.height; y += sliceHeight) {
      const height = Math.min(sliceHeight, ctx.height - y);
      const active = ctx.random(\`slice:\${event}:\${slice}:active\`) < 0.22 + intensity * 0.58;
      if (!active) {
        slice += 1;
        continue;
      }
      const direction = ctx.random(\`slice:\${event}:\${slice}:direction\`) < 0.5 ? -1 : 1;
      const strength = 0.3 + ctx.random(\`slice:\${event}:\${slice}:strength\`) * 0.7;
      const shift = direction * maxShift * intensity * strength * envelope;
      g.fillStyle = "#0D0E10";
      g.fillRect(0, y, ctx.width, height);
      g.drawImage(ctx.subject.bitmap, 0, y, ctx.width, height, shift, y, ctx.width, height);
      if (channelOffset > 0 && ctx.random(\`slice:\${event}:\${slice}:channel\`) < 0.55) {
        g.save();
        g.globalCompositeOperation = "screen";
        g.globalAlpha = (0.08 + intensity * 0.16) * envelope;
        g.filter = "sepia(1) saturate(8) hue-rotate(130deg)";
        g.drawImage(
          ctx.subject.bitmap,
          0,
          y,
          ctx.width,
          height,
          shift + direction * channelOffset,
          y,
          ctx.width,
          height
        );
        g.filter = "sepia(1) saturate(8) hue-rotate(-45deg)";
        g.drawImage(
          ctx.subject.bitmap,
          0,
          y,
          ctx.width,
          height,
          shift - direction * channelOffset,
          y,
          ctx.width,
          height
        );
        g.restore();
      }
      if (ctx.random(\`slice:\${event}:\${slice}:edge\`) < 0.34) {
        g.globalAlpha = (0.18 + intensity * 0.32) * envelope;
        g.fillStyle = signal;
        g.fillRect(shift, y, Math.max(2, Math.abs(shift) * 0.16), 1);
        g.globalAlpha = 1;
      }
      slice += 1;
    }
    g.restore();
  }
};
var G02_datamosh_slice_effect_default = kernel;
`;export{e as default};
