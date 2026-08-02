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
var B07_callout_line_effect_exports = {};
__export(B07_callout_line_effect_exports, {
  default: () => B07_callout_line_effect_default
});
module.exports = __toCommonJS(B07_callout_line_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smooth = (value) => {
  const p = clamp01(value);
  return p * p * (3 - 2 * p);
};
const kernel = {
  kind: "react",
  render: (ctx) => {
    const label = String(ctx.params.label ?? "DEXA VFX / SIGNAL");
    const right = String(ctx.params.side ?? "right") === "right";
    const reach = Number(ctx.params.reach ?? 0.32);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const dotIn = smooth((ctx.t - 0.04) / 0.12);
    const firstLine = smooth((ctx.t - 0.12) / 0.16);
    const secondLine = smooth((ctx.t - 0.25) / 0.18);
    const labelIn = smooth((ctx.t - 0.38) / 0.16);
    const outro = smooth((1 - ctx.t) / 0.1);
    const startX = ctx.width * (right ? 0.36 : 0.64);
    const startY = ctx.height * 0.43;
    const direction = right ? 1 : -1;
    const elbowX = startX + direction * ctx.width * 0.07;
    const elbowY = startY - ctx.height * 0.12;
    const rawEndX = startX + direction * ctx.width * reach;
    const endX = right ? Math.min(ctx.width * 0.7, rawEndX) : Math.max(ctx.width * 0.3, rawEndX);
    const labelWidth = ctx.width * 0.26;
    const labelLeft = right ? endX : endX - labelWidth;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.13 } }, ctx.subjectNode), /* @__PURE__ */ h("svg", { style: { position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", opacity: outro }, viewBox: \`0 0 \${ctx.width} \${ctx.height}\` }, /* @__PURE__ */ h("circle", { cx: startX, cy: startY, r: Math.max(4, ctx.width * 6e-3), fill: "#0D0E10", stroke: signal, strokeWidth: Math.max(2, ctx.width * 2e-3), opacity: dotIn }), /* @__PURE__ */ h("circle", { cx: startX, cy: startY, r: Math.max(10, ctx.width * 0.014) * dotIn, fill: "none", stroke: signal, strokeWidth: 1, opacity: 0.42 * (1 - dotIn * 0.35) }), /* @__PURE__ */ h("line", { x1: startX, y1: startY, x2: elbowX, y2: elbowY, stroke: signal, strokeWidth: Math.max(1.5, ctx.width * 15e-4), pathLength: 1, strokeDasharray: "1", strokeDashoffset: 1 - firstLine }), /* @__PURE__ */ h("line", { x1: elbowX, y1: elbowY, x2: endX, y2: elbowY, stroke: signal, strokeWidth: Math.max(1.5, ctx.width * 15e-4), pathLength: 1, strokeDasharray: "1", strokeDashoffset: 1 - secondLine })), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: labelLeft,
          top: elbowY - ctx.height * 2e-3,
          width: labelWidth,
          padding: "1.4% 1.8%",
          boxSizing: "border-box",
          background: "#151A1EEB",
          borderTop: \`2px solid \${signal}\`,
          color: "#F5F8F9",
          opacity: labelIn * outro,
          transform: \`translate3d(\${direction * (1 - labelIn) * 28}px, 0, 0)\`
        }
      },
      /* @__PURE__ */ h("div", { style: { fontSize: Math.max(8, ctx.width * 0.012), fontWeight: 900, letterSpacing: "0.06em", whiteSpace: "nowrap" } }, label),
      /* @__PURE__ */ h("div", { style: { marginTop: "0.65em", color: "#BFC9CE", fontSize: Math.max(7, ctx.width * 8e-3), fontWeight: 700, letterSpacing: "0.14em", whiteSpace: "nowrap" } }, "TRACKED / FRAME ", String(ctx.frame).padStart(3, "0"))
    ));
  }
};
var B07_callout_line_effect_default = kernel;
`;export{t as default};
