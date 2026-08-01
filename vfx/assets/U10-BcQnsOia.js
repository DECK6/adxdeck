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
var U10_chip_filter_effect_exports = {};
__export(U10_chip_filter_effect_exports, {
  default: () => U10_chip_filter_effect_default
});
module.exports = __toCommonJS(U10_chip_filter_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const speed = Math.min(2, Math.max(0.5, Number(ctx.params.speed ?? 1)));
    const columns = String(ctx.params.columns ?? "two");
    const motion = Math.min(1.4, Math.max(0.4, Number(ctx.params.motion ?? 1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const cards = ["PRISM", "SIGNAL", "VECTOR", "GRAIN"];
    const loopCount = speed >= 1.75 ? 3 : speed >= 1.25 ? 2 : 1;
    const cycle = ctx.t * loopCount % 1 * cards.length;
    const selected = Math.floor(cycle) % cards.length;
    const next = (selected + 1) % cards.length;
    const local = cycle - Math.floor(cycle);
    const eased = local * local * (3 - 2 * local);
    const cardWidth = columns === "four" ? 21 : 45;
    const cardHeight = columns === "four" ? 70 : 32;
    const positions = columns === "four" ? cards.map((_, index) => ({ x: index * 26, y: 15 })) : [{ x: 2, y: 4 }, { x: 53, y: 4 }, { x: 2, y: 57 }, { x: 53, y: 57 }];
    const rankFor = (index, active) => index === active ? 0 : index < active ? index + 1 : index;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F5F8FA", fontFamily: "Inter, sans-serif" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "8% 13%", opacity: 0.18, transform: "scale(0.84)" } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "12%", right: "12%", top: "12%", display: "flex", justifyContent: "center", gap: "2%" } }, cards.map((label, index) => {
      const active = index === selected;
      return /* @__PURE__ */ h("div", { key: label, style: { padding: "1.3% 2.6%", borderRadius: 999, border: \`1px solid \${active ? signal : "#FFFFFF38"}\`, background: active ? signal : "#171B20", color: active ? "#071013" : "#F5F8FA", boxShadow: active ? \`0 0 20px \${signal}55\` : "none", fontSize: Math.max(8, ctx.width * 0.011), fontWeight: 750, letterSpacing: "0.08em" } }, label);
    })), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "13%", right: "13%", top: "30%", bottom: "12%" } }, cards.map((label, index) => {
      const from = positions[rankFor(index, selected)];
      const to = positions[rankFor(index, next)];
      const x = from.x + (to.x - from.x) * eased;
      const y = from.y + (to.y - from.y) * eased;
      const featured = rankFor(index, selected) === 0;
      const lift = Math.sin(Math.PI * local) * motion;
      return /* @__PURE__ */ h(
        "div",
        {
          key: label,
          style: {
            position: "absolute",
            left: \`\${x}%\`,
            top: \`\${y}%\`,
            width: \`\${cardWidth}%\`,
            height: \`\${cardHeight}%\`,
            boxSizing: "border-box",
            padding: "3%",
            border: \`1px solid \${featured ? signal : "#FFFFFF26"}\`,
            borderRadius: 10,
            background: featured ? "#17252A" : "#15191E",
            boxShadow: featured ? \`0 \${10 + lift * 7}px \${22 + lift * 10}px #00000088, 0 0 18px \${signal}22\` : "0 8px 20px #00000055",
            transform: \`translate3d(0, \${featured ? -lift * 7 : 0}px, 0) scale(\${featured ? 1 + lift * 0.025 : 1})\`
          }
        },
        /* @__PURE__ */ h("div", { style: { color: featured ? signal : "#F5F8FA", fontSize: Math.max(8, ctx.width * 0.012), fontWeight: 800 } }, label),
        /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", right: "8%", bottom: "18%", height: 4, borderRadius: 4, background: featured ? signal : "#F5F8FA4D" } }),
        /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", bottom: "34%", width: featured ? "62%" : "42%", height: 4, borderRadius: 4, background: "#F5F8FA78" } })
      );
    })));
  }
};
var U10_chip_filter_effect_default = kernel;
`;export{e as default};
