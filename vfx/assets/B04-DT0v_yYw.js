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
var B04_lower_third_stack_effect_exports = {};
__export(B04_lower_third_stack_effect_exports, {
  default: () => B04_lower_third_stack_effect_default
});
module.exports = __toCommonJS(B04_lower_third_stack_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const easeOut = (value) => 1 - (1 - clamp01(value)) ** 3;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const title = String(ctx.params.title ?? "DEXA VFX");
    const tierGap = Number(ctx.params.tierGap ?? 6);
    const density = String(ctx.params.density ?? "standard");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const first = easeOut((ctx.t - 0.05) / 0.2);
    const second = easeOut((ctx.t - 0.18) / 0.2);
    const detail = easeOut((ctx.t - 0.3) / 0.16);
    const outro = clamp01((1 - ctx.t) / 0.1);
    const width = density === "compact" ? "43%" : density === "wide" ? "66%" : "55%";
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.1 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "6%", bottom: "8%", width, height: "20%", opacity: outro } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, right: "11%", top: 0, height: \`calc(58% - \${tierGap / 2}px)\`, overflow: "hidden" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 5%",
          boxSizing: "border-box",
          background: "#171B1F",
          borderLeft: \`5px solid \${signal}\`,
          color: "#F6F9FA",
          transform: \`translate3d(0, \${(1 - first) * 105}%, 0)\`,
          boxShadow: "0 14px 34px rgba(0,0,0,0.35)"
        }
      },
      /* @__PURE__ */ h("span", { style: { fontSize: Math.max(12, ctx.width * 0.027), fontWeight: 900, letterSpacing: "-0.04em", whiteSpace: "nowrap" } }, title),
      /* @__PURE__ */ h("span", { style: { marginLeft: "auto", color: signal, fontSize: Math.max(7, ctx.width * 9e-3), fontWeight: 800 } }, "01")
    )), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", right: 0, bottom: 0, height: \`calc(42% - \${tierGap / 2}px)\`, overflow: "hidden" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 5%",
          boxSizing: "border-box",
          background: signal,
          color: "#071013",
          transform: \`translate3d(0, \${-(1 - second) * 110}%, 0)\`
        }
      },
      /* @__PURE__ */ h("span", { style: { fontSize: Math.max(8, ctx.width * 0.011), fontWeight: 900, letterSpacing: "0.16em", whiteSpace: "nowrap" } }, "BROADCAST DESIGN UNIT"),
      /* @__PURE__ */ h("span", { style: { marginLeft: "auto", fontSize: Math.max(7, ctx.width * 8e-3), fontWeight: 900, opacity: detail } }, "LIVE")
    )), /* @__PURE__ */ h("div", { style: { position: "absolute", right: "3%", top: "2%", width: 1, height: "38%", background: signal, opacity: detail } })));
  }
};
var B04_lower_third_stack_effect_default = kernel;
`;export{t as default};
