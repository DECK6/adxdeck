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
var U12_drag_sort_effect_exports = {};
__export(U12_drag_sort_effect_exports, {
  default: () => U12_drag_sort_effect_default
});
module.exports = __toCommonJS(U12_drag_sort_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const distance = Math.min(3, Math.max(1, Math.round(Number(ctx.params.distance ?? 2))));
    const lift = Math.min(1.5, Math.max(0.4, Number(ctx.params.lift ?? 1)));
    const handle = String(ctx.params.handle ?? "dots");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const progress = 0.5 - 0.5 * Math.cos(Math.PI * 2 * ctx.t);
    const eased = progress * progress * (3 - 2 * progress);
    const activeIndex = 1;
    const rowGap = Math.max(42, ctx.height * 0.115);
    const items = ["SOURCE", "MASK", "SIGNAL", "OUTPUT", "ARCHIVE"];
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F5F8FA", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.11, transform: "scale(0.9)" } }, ctx.subjectNode), /* @__PURE__ */ h("div", { "data-layout-allow-overlap": "", "data-layout-allow-occlusion": "", style: { position: "absolute", left: "24%", right: "24%", top: "15%", height: rowGap * items.length } }, items.map((label, index) => {
      const isActive = index === activeIndex;
      const isDisplaced = index > activeIndex && index <= activeIndex + distance;
      const offset = isActive ? distance * rowGap * eased : isDisplaced ? -rowGap * eased : 0;
      const elevation = isActive ? Math.sin(Math.PI * progress) * lift : 0;
      return /* @__PURE__ */ h(
        "div",
        {
          key: label,
          style: {
            position: "absolute",
            left: 0,
            right: 0,
            top: index * rowGap,
            height: rowGap - 8,
            display: "flex",
            alignItems: "center",
            padding: "0 5%",
            boxSizing: "border-box",
            border: \`1px solid \${isActive ? signal : "#FFFFFF24"}\`,
            borderRadius: 9,
            background: isActive ? "#18272D" : "#15191E",
            boxShadow: isActive ? \`0 \${8 + elevation * 12}px \${18 + elevation * 18}px #000000A8, 0 0 \${elevation * 15}px \${signal}44\` : "0 5px 12px #0000003D",
            transform: \`translate3d(\${isActive ? elevation * 5 : 0}px, \${offset}px, 0) rotate(\${isActive ? elevation * 0.7 : 0}deg) scale(\${1 + elevation * 0.018})\`,
            zIndex: isActive ? 5 : 1
          }
        },
        /* @__PURE__ */ h("div", { style: { width: 22, color: isActive ? signal : "#F5F8FA", fontSize: 12, letterSpacing: handle === "dots" ? 2 : 0 } }, handle === "dots" ? "\\u283F" : "\\u2261"),
        /* @__PURE__ */ h("span", { style: { marginLeft: "4%", color: "#FFFFFF", fontSize: Math.max(8, ctx.width * 0.012), fontWeight: 750, letterSpacing: "0.09em" } }, label),
        /* @__PURE__ */ h("span", { style: { marginLeft: "auto", color: isActive ? signal : "#C8D0D5", fontFamily: "JetBrains Mono, monospace", fontSize: Math.max(7, ctx.width * 0.01) } }, String(index + 1).padStart(2, "0"))
      );
    })));
  }
};
var U12_drag_sort_effect_default = kernel;
`;export{e as default};
