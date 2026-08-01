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
var G01_rgb_split_effect_exports = {};
__export(G01_rgb_split_effect_exports, {
  default: () => G01_rgb_split_effect_default
});
module.exports = __toCommonJS(G01_rgb_split_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const intensity = Number(ctx.params.intensity ?? 0.72);
    const separation = Number(ctx.params.separation ?? 10);
    const spikes = Boolean(ctx.params.spikes ?? true);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const pulseCount = 18;
    const pulse = ctx.t * pulseCount % 1;
    const pulseIndex = Math.floor(ctx.t * pulseCount);
    const spikeSeed = ctx.random(\`spike:\${pulseIndex}\`);
    const spikeEnvelope = pulse < 0.24 ? Math.sin(pulse / 0.24 * Math.PI) : 0;
    const spike = spikes && spikeSeed > 0.67 ? spikeEnvelope * (1.8 + spikeSeed * 2.6) : 0;
    const drift = Math.sin(ctx.t * Math.PI * 12) * 0.35;
    const offset = separation * intensity * (1 + spike + drift);
    const jitterY = spike * separation * (ctx.random(\`vertical:\${pulseIndex}\`) - 0.5);
    const channels = [
      { color: "#FF365E", x: -offset, y: jitterY, filter: "brightness(0) saturate(100%) invert(35%) sepia(92%) saturate(4549%) hue-rotate(331deg) brightness(102%) contrast(103%)" },
      { color: signal, x: 0, y: -jitterY * 0.5, filter: "brightness(0) saturate(100%) invert(88%) sepia(35%) saturate(1015%) hue-rotate(124deg) brightness(97%) contrast(96%)" },
      { color: "#5271FF", x: offset, y: jitterY * 0.35, filter: "brightness(0) saturate(100%) invert(43%) sepia(91%) saturate(2895%) hue-rotate(218deg) brightness(101%) contrast(102%)" }
    ];
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, channels.map((channel) => /* @__PURE__ */ h(
      "div",
      {
        key: channel.color,
        style: {
          position: "absolute",
          inset: 0,
          transform: \`translate3d(\${channel.x}px, \${channel.y}px, 0)\`,
          filter: channel.filter,
          mixBlendMode: "screen",
          opacity: 0.42 + intensity * 0.38
        }
      },
      ctx.subjectNode
    )), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 48,
          bottom: 42,
          width: 96 + intensity * 160,
          height: 3,
          background: signal,
          opacity: 0.55 + spike * 0.1,
          transform: \`translateX(\${spike * 12}px)\`
        }
      }
    ));
  }
};
var G01_rgb_split_effect_default = kernel;
`;export{e as default};
