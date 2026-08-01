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
var M08_blind_reveal_effect_exports = {};
__export(M08_blind_reveal_effect_exports, {
  default: () => M08_blind_reveal_effect_default
});
module.exports = __toCommonJS(M08_blind_reveal_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const slats = Math.min(16, Math.max(4, Math.round(Number(ctx.params.slats ?? 10))));
    const orientation = String(ctx.params.orientation ?? "vertical");
    const stagger = clamp01(Number(ctx.params.stagger ?? 0.42));
    const edge = Math.min(8, Math.max(1, Number(ctx.params.edge ?? 3)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const baseOpen = 0.5 - 0.5 * Math.cos(Math.PI * 2 * ctx.t);
    const vertical = orientation === "vertical";
    const slotSize = (vertical ? ctx.width : ctx.height) / slats;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.05 + baseOpen * 0.04 } }, ctx.subjectNode), Array.from({ length: slats }, (_, index) => {
      const wave = Math.sin(Math.PI * 2 * ctx.t + index * 0.72);
      const open = clamp01(0.04 + baseOpen * 0.96 + wave * stagger * 0.1);
      const visibleSize = Math.max(1, slotSize * open);
      const slotStart = index * slotSize;
      const start = slotStart + (slotSize - visibleSize) * 0.5;
      return /* @__PURE__ */ h("div", { key: index }, /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: vertical ? start : 0,
            top: vertical ? 0 : start,
            width: vertical ? visibleSize : ctx.width,
            height: vertical ? ctx.height : visibleSize,
            overflow: "hidden"
          }
        },
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              left: vertical ? -start : 0,
              top: vertical ? 0 : -start,
              width: ctx.width,
              height: ctx.height
            }
          },
          ctx.subjectNode
        )
      ), /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: vertical ? start + visibleSize - edge : slotStart,
            top: vertical ? 0 : start + visibleSize - edge,
            width: vertical ? edge : slotSize,
            height: vertical ? ctx.height : edge,
            background: signal,
            opacity: 0.18 + open * 0.5,
            boxShadow: \`0 0 \${edge * 3}px \${signal}\`
          }
        }
      ));
    }));
  }
};
var M08_blind_reveal_effect_default = kernel;
`;export{e as default};
