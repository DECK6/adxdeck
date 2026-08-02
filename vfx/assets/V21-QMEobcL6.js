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
var V21_donut_multi_effect_exports = {};
__export(V21_donut_multi_effect_exports, {
  default: () => V21_donut_multi_effect_default
});
module.exports = __toCommonJS(V21_donut_multi_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const thickness = Math.max(8, Math.min(28, Number(ctx.params.thickness ?? 16)));
    const gap = Math.max(5, Math.min(24, Number(ctx.params.gap ?? 12)));
    const sweep = Math.max(0.4, Math.min(1, Number(ctx.params.sweep ?? 0.84)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const reveal = 0.5 - Math.cos(ctx.t * Math.PI * 2) * 0.5;
    const values = [0.78, 0.62, 0.91];
    const labels = ["DEXA", "VFX", "SIGNAL"];
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F4F7F8", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "24%", opacity: 0.09 } }, ctx.subjectNode), /* @__PURE__ */ h("svg", { viewBox: "0 0 1000 1000", style: { position: "absolute", left: "7%", top: "10%", width: "62%", height: "80%", overflow: "visible" } }, values.map((value, index) => {
      const radius = 250 - index * (thickness + gap + 20);
      const circumference = Math.PI * 2 * radius;
      const local = Math.max(0, Math.min(1, reveal * 1.55 - index * 0.25));
      return /* @__PURE__ */ h("g", { key: labels[index], transform: "rotate(-90 500 500)" }, /* @__PURE__ */ h("circle", { cx: "500", cy: "500", r: radius, fill: "none", stroke: "#273036", strokeWidth: thickness, opacity: "0.75" }), /* @__PURE__ */ h("circle", { cx: "500", cy: "500", r: radius, fill: "none", stroke: signal, strokeWidth: thickness, strokeLinecap: "round", strokeDasharray: \`\${circumference * value * sweep * local} \${circumference}\`, opacity: 1 - index * 0.2, style: { filter: \`drop-shadow(0 0 \${8 - index}px \${signal})\` } }));
    })), /* @__PURE__ */ h("div", { style: { position: "absolute", right: "8%", top: "25%", width: "24%", display: "flex", flexDirection: "column", gap: 28 } }, values.map((value, index) => /* @__PURE__ */ h("div", { key: labels[index], style: { borderLeft: \`3px solid \${signal}\`, paddingLeft: 18, opacity: 1 - index * 0.15 } }, /* @__PURE__ */ h("div", { style: { color: "#AAB2B7", fontSize: 14, letterSpacing: 3 } }, labels[index]), /* @__PURE__ */ h("div", { style: { marginTop: 5, fontSize: 34, fontWeight: 700 } }, Math.round(value * sweep * reveal * 100), "%")))), /* @__PURE__ */ h("div", { style: { position: "absolute", left: \`\${9 + reveal * 52}%\`, bottom: "8%", width: 12, height: 12, marginLeft: -6, borderRadius: "50%", background: signal, boxShadow: \`0 0 14px \${signal}\` } }));
  }
};
var V21_donut_multi_effect_default = kernel;
`;export{e as default};
