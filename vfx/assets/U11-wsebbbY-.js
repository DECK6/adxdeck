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
var U11_accordion_expand_effect_exports = {};
__export(U11_accordion_expand_effect_exports, {
  default: () => U11_accordion_expand_effect_default
});
module.exports = __toCommonJS(U11_accordion_expand_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const sectionCount = Math.min(5, Math.max(3, Math.round(Number(ctx.params.sections ?? 4))));
    const speed = Math.min(2, Math.max(0.5, Number(ctx.params.speed ?? 1)));
    const easing = String(ctx.params.easing ?? "soft");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const loopCount = speed >= 1.75 ? 3 : speed >= 1.25 ? 2 : 1;
    const phase = ctx.t * loopCount % 1;
    const traversal = (0.5 - 0.5 * Math.cos(Math.PI * 2 * phase)) * (sectionCount - 1);
    const labels = ["OVERVIEW", "SIGNAL PATH", "PARAMETERS", "OUTPUT", "NOTES"];
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F6F8FA", fontFamily: "Inter, sans-serif" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.13, transform: "scale(0.88)" } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "20%", right: "20%", top: "10%", bottom: "10%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 } }, labels.slice(0, sectionCount).map((label, index) => {
      const raw = Math.max(0, 1 - Math.abs(traversal - index));
      const open = easing === "snappy" ? Math.min(1, raw * 1.6) : raw * raw * (3 - 2 * raw);
      const contentOpacity = Math.max(0, (open - 0.2) / 0.8);
      return /* @__PURE__ */ h("div", { key: label, style: { height: 36 + open * Math.max(34, ctx.height * 0.09), flexShrink: 0, overflow: "hidden", border: \`1px solid \${open > 0.5 ? signal : "#FFFFFF24"}\`, borderRadius: 8, background: open > 0.5 ? "#152127F2" : "#14181DDE", boxShadow: open > 0.5 ? \`0 0 20px \${signal}18\` : "none" } }, /* @__PURE__ */ h("div", { style: { height: 36, padding: "0 3.5%", display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" } }, /* @__PURE__ */ h("span", { style: { color: open > 0.5 ? "#FFFFFF" : "#C9D0D5", fontSize: Math.max(8, ctx.width * 0.011), fontWeight: 750, letterSpacing: "0.08em" } }, label), /* @__PURE__ */ h("span", { style: { color: signal, fontSize: Math.max(14, ctx.width * 0.019), lineHeight: 1, transform: \`rotate(\${open * 45}deg)\` } }, "+")), /* @__PURE__ */ h("div", { style: { padding: "1% 3.5% 3%", opacity: contentOpacity, transform: \`translateY(\${(1 - open) * 9}px)\` } }, /* @__PURE__ */ h("div", { style: { width: \`\${58 + index * 5}%\`, height: 5, borderRadius: 4, background: "#F6F8FABD", marginBottom: 7 } }), /* @__PURE__ */ h("div", { style: { width: \`\${42 + index * 4}%\`, height: 5, borderRadius: 4, background: signal, opacity: 0.72 } })));
    })));
  }
};
var U11_accordion_expand_effect_default = kernel;
`;export{e as default};
