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
var V17_funnel_steps_effect_exports = {};
__export(V17_funnel_steps_effect_exports, {
  default: () => V17_funnel_steps_effect_default
});
module.exports = __toCommonJS(V17_funnel_steps_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const steps = Math.max(3, Math.min(6, Math.round(Number(ctx.params.steps ?? 5))));
    const dropoff = Math.max(0.08, Math.min(0.28, Number(ctx.params.dropoff ?? 0.16)));
    const speed = Math.max(0.6, Math.min(1.6, Number(ctx.params.speed ?? 1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * speed % 1;
    const pulse = 0.5 - Math.cos(phase * Math.PI * 2) * 0.5;
    const labels = ["REACH", "VISIT", "ENGAGE", "TRIAL", "CONVERT", "RETAIN"];
    const base = 12400;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F7FAFC", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "18%", opacity: 0.09 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "7%", top: "7%", color: signal, fontSize: Math.max(9, ctx.width * 0.012), fontWeight: 700, letterSpacing: "0.18em" } }, "DEXA VFX / CONVERSION FLOW"), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "10%", right: "10%", top: "17%", bottom: "10%", display: "flex", flexDirection: "column", justifyContent: "center", gap: \`\${Math.max(4, ctx.height * 0.012)}px\` } }, Array.from({ length: steps }, (_, index) => {
      const value = Math.round(base * Math.pow(1 - dropoff, index));
      const prior = index === 0 ? base : Math.round(base * Math.pow(1 - dropoff, index - 1));
      const conversion = Math.round(value / prior * 100);
      const width = Math.max(34, 100 - index * dropoff * 100);
      const local = Math.max(0, Math.min(1, pulse * (steps + 1) - index * 0.72));
      const eased = local * local * (3 - 2 * local);
      const shade = 0.24 + (steps - index) / steps * 0.56;
      return /* @__PURE__ */ h("div", { key: index, style: { position: "relative", width: \`\${width}%\`, height: \`\${72 / steps}%\`, minHeight: 38, margin: "0 auto", opacity: local > 0.18 ? 1 : 0, transform: \`translateX(\${(1 - eased) * (index % 2 === 0 ? -9 : 9)}%) scaleX(\${0.82 + eased * 0.18})\` } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, background: signal, opacity: shade, clipPath: "polygon(3% 0, 97% 0, 100% 50%, 97% 100%, 3% 100%, 0 50%)", boxShadow: \`0 0 \${10 + index * 3}px \${signal}38\` } }), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 7%", boxSizing: "border-box" } }, /* @__PURE__ */ h("span", { style: { color: index < steps / 2 ? "#0D0E10" : "#F7FAFC", fontSize: Math.max(9, ctx.width * 0.012), fontWeight: 900, letterSpacing: "0.14em" } }, String(index + 1).padStart(2, "0"), " / ", labels[index]), /* @__PURE__ */ h("span", { style: { color: index < steps / 2 ? "#0D0E10" : "#F7FAFC", fontSize: Math.max(10, ctx.width * 0.015), fontWeight: 900 } }, value.toLocaleString("en-US"))), index > 0 ? /* @__PURE__ */ h("div", { style: { position: "absolute", right: "-9%", top: "50%", color: "#D7DDE1", fontSize: Math.max(8, ctx.width * 9e-3), fontWeight: 700, transform: "translateY(-50%)" } }, conversion, "%") : null);
    })));
  }
};
var V17_funnel_steps_effect_default = kernel;
`;export{e as default};
