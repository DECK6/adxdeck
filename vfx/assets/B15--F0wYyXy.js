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
var B15_locator_pin_effect_exports = {};
__export(B15_locator_pin_effect_exports, {
  default: () => B15_locator_pin_effect_default
});
module.exports = __toCommonJS(B15_locator_pin_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const easeOut = (value) => 1 - Math.pow(1 - clamp01(value), 3);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const place = String(ctx.params.place ?? "DEXA HQ");
    const zoom = Number(ctx.params.zoom ?? 1);
    const ringCount = Math.round(Number(ctx.params.rings ?? 3));
    const grid = Boolean(ctx.params.grid ?? true);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const drop = easeOut(ctx.t * 5.5);
    const impact = Math.exp(-Math.pow((ctx.t - 0.2) / 0.045, 2));
    const outro = clamp01((1 - ctx.t) / 0.08);
    const pinY = (1 - drop) * -ctx.height * 0.48 - Math.sin(clamp01(ctx.t * 4) * Math.PI * 3) * (1 - clamp01(ctx.t * 4)) * ctx.height * 0.04;
    const cycle = ctx.t * 1.7 % 1;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", fontFamily: "'JetBrains Mono', monospace", transform: \`scale(\${zoom})\` } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.09 * outro } }, ctx.subjectNode), grid ? /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "-15%", opacity: 0.24 * outro, transform: "perspective(500px) rotateX(58deg) translateY(22%)", backgroundImage: \`linear-gradient(\${signal}44 1px, transparent 1px), linear-gradient(90deg, \${signal}44 1px, transparent 1px)\`, backgroundSize: \`\${ctx.width * 0.07}px \${ctx.width * 0.07}px\`, WebkitMaskImage: "radial-gradient(circle, black 15%, transparent 68%)" } }) : null, Array.from({ length: ringCount }, (_, index) => {
      const phase = (cycle + index / ringCount) % 1;
      const size = ctx.height * (0.08 + phase * 0.46);
      return /* @__PURE__ */ h("div", { key: index, style: { position: "absolute", left: "50%", top: "58%", width: size, height: size * 0.42, border: \`2px solid \${signal}\`, borderRadius: "50%", transform: "translate(-50%, -50%)", opacity: (1 - phase) * 0.58 * drop * outro, boxShadow: \`0 0 14px \${signal}22\` } });
    }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: "58%", width: ctx.height * 0.135, height: ctx.height * 0.18, transform: \`translate(-50%, -100%) translateY(\${pinY}px) scale(\${1 + impact * 0.09}, \${1 - impact * 0.08})\`, transformOrigin: "50% 100%", opacity: outro, filter: \`drop-shadow(0 0 12px \${signal}66)\` } }, /* @__PURE__ */ h("svg", { viewBox: "0 0 100 140", style: { width: "100%", height: "100%", overflow: "visible" } }, /* @__PURE__ */ h("path", { d: "M50 136C42 110 12 84 12 51A38 38 0 0 1 88 51C88 84 58 110 50 136Z", fill: "#111418", stroke: signal, strokeWidth: "5" }), /* @__PURE__ */ h("circle", { cx: "50", cy: "51", r: "15", fill: signal }), /* @__PURE__ */ h("circle", { cx: "50", cy: "51", r: "6", fill: "#0D0E10" }))), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: "67%", transform: \`translateX(-50%) translateY(\${(1 - drop) * ctx.height * 0.08}px)\`, minWidth: ctx.width * 0.25, padding: \`\${ctx.height * 0.025}px \${ctx.width * 0.025}px\`, border: \`1px solid \${signal}55\`, background: "#0D0E10E8", textAlign: "center", opacity: drop * outro } }, /* @__PURE__ */ h("div", { style: { color: "#F4F7F8", fontSize: Math.max(12, ctx.height * 0.045), fontWeight: 800, letterSpacing: "0.12em" } }, place), /* @__PURE__ */ h("div", { style: { marginTop: "0.65em", color: signal, fontSize: Math.max(7, ctx.height * 0.019), letterSpacing: "0.13em" } }, "37.5665\\xB0 N / 126.9780\\xB0 E")));
  }
};
var B15_locator_pin_effect_default = kernel;
`;export{t as default};
