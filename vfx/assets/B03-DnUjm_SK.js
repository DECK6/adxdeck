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
var B03_lower_third_wipe_effect_exports = {};
__export(B03_lower_third_wipe_effect_exports, {
  default: () => B03_lower_third_wipe_effect_default
});
module.exports = __toCommonJS(B03_lower_third_wipe_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smooth = (value) => {
  const p = clamp01(value);
  return p * p * (3 - 2 * p);
};
const kernel = {
  kind: "react",
  render: (ctx) => {
    const title = String(ctx.params.title ?? "DEXA VFX");
    const reverse = String(ctx.params.direction ?? "left-to-right") === "right-to-left";
    const gap = Number(ctx.params.barGap ?? 8);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const sweep = smooth((ctx.t - 0.04) / 0.28);
    const clear = smooth((ctx.t - 0.27) / 0.14);
    const reveal = smooth((ctx.t - 0.14) / 0.22);
    const outro = smooth((1 - ctx.t) / 0.1);
    const clip = reverse ? \`inset(0 0 0 \${100 - reveal * 100}%)\` : \`inset(0 \${100 - reveal * 100}% 0 0)\`;
    const travel = reverse ? 112 - sweep * 124 : -12 + sweep * 124;
    const barDirection = reverse ? -1 : 1;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.09 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "6%", bottom: "9%", width: "62%", height: "16%", opacity: outro } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          clipPath: clip,
          background: "#15191DEB",
          borderBottom: \`2px solid \${signal}\`,
          color: "#F6F9FA",
          padding: "2.5% 5%",
          boxSizing: "border-box"
        }
      },
      /* @__PURE__ */ h("div", { style: { fontSize: Math.max(12, ctx.width * 0.028), fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", whiteSpace: "nowrap" } }, title),
      /* @__PURE__ */ h("div", { style: { marginTop: "0.65em", color: "#C7D0D5", fontSize: Math.max(7, ctx.width * 9e-3), fontWeight: 700, letterSpacing: "0.2em", whiteSpace: "nowrap" } }, "VISUAL EFFECTS NETWORK")
    ), [0, 1].map((index) => /* @__PURE__ */ h(
      "div",
      {
        key: index,
        style: {
          position: "absolute",
          left: \`\${travel + barDirection * index * (gap / Math.max(1, ctx.width)) * 100}%\`,
          top: index === 0 ? 0 : "12%",
          width: index === 0 ? "8%" : "3%",
          height: index === 0 ? "100%" : "76%",
          background: index === 0 ? signal : "#F4F7F8",
          opacity: 1 - clear * (index === 0 ? 0.2 : 0.65),
          boxShadow: index === 0 ? \`0 0 20px \${signal}3D\` : "none"
        }
      }
    ))));
  }
};
var B03_lower_third_wipe_effect_default = kernel;
`;export{e as default};
