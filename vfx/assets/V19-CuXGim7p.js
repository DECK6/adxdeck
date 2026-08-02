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
var V19_calendar_heat_effect_exports = {};
__export(V19_calendar_heat_effect_exports, {
  default: () => V19_calendar_heat_effect_default
});
module.exports = __toCommonJS(V19_calendar_heat_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const weeks = Math.max(12, Math.min(32, Math.round(Number(ctx.params.weeks ?? 24))));
    const intensity = Math.max(0.35, Math.min(1, Number(ctx.params.intensity ?? 0.82)));
    const gap = Math.max(2, Math.min(10, Number(ctx.params.gap ?? 5)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const loop = 0.5 - Math.cos(ctx.t * Math.PI * 2) * 0.5;
    const head = loop * (weeks + 7);
    const cells = Array.from({ length: weeks * 7 }, (_, index) => {
      const week = Math.floor(index / 7);
      const day = index % 7;
      const value = 0.12 + ctx.random(\`day:\${index}\`) * 0.88;
      const reveal = Math.max(0, Math.min(1, head - week - day * 0.16));
      return { index, week, day, value, reveal };
    });
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", fontFamily: "'JetBrains Mono', monospace", color: "#F4F7F8" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "22%", opacity: 0.1 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", right: "8%", top: "14%", display: "flex", alignItems: "baseline", justifyContent: "space-between" } }, /* @__PURE__ */ h("div", { style: { fontSize: 22, letterSpacing: 5, fontWeight: 700 } }, "DEXA VFX / ACTIVITY"), /* @__PURE__ */ h("div", { style: { fontSize: 15, letterSpacing: 2, color: signal } }, "06 SEC LOOP")), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", right: "8%", top: "26%", bottom: "17%", display: "grid", gridTemplateColumns: \`repeat(\${weeks}, minmax(0, 1fr))\`, gridTemplateRows: "repeat(7, minmax(0, 1fr))", gridAutoFlow: "column", gap } }, cells.map((cell) => /* @__PURE__ */ h(
      "div",
      {
        key: cell.index,
        style: {
          minWidth: 0,
          minHeight: 0,
          borderRadius: 3,
          border: \`1px solid \${signal}\${cell.reveal > 0.02 ? "38" : "18"}\`,
          background: signal,
          opacity: 0.06 + cell.value * intensity * cell.reveal * 0.9,
          boxShadow: cell.reveal > 0.82 && cell.value > 0.76 ? \`0 0 12px \${signal}88\` : "none"
        }
      }
    ))), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", right: "8%", bottom: "9%", display: "flex", justifyContent: "space-between", fontSize: 13, letterSpacing: 2, color: "#AAB2B7" } }, /* @__PURE__ */ h("span", null, "MON"), /* @__PURE__ */ h("span", null, "WED"), /* @__PURE__ */ h("span", null, "FRI"), /* @__PURE__ */ h("span", null, "DEXA VFX DATA")));
  }
};
var V19_calendar_heat_effect_default = kernel;
`;export{e as default};
