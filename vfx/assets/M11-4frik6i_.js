const n=`var __defProp = Object.defineProperty;
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
var M11_split_mask_effect_exports = {};
__export(M11_split_mask_effect_exports, {
  default: () => M11_split_mask_effect_default
});
module.exports = __toCommonJS(M11_split_mask_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const axis = String(ctx.params.axis ?? "vertical");
    const distance = Math.min(0.34, Math.max(0.04, Number(ctx.params.distance ?? 0.18)));
    const cycles = Math.min(3, Math.max(1, Math.round(Number(ctx.params.cycles ?? 2))));
    const edge = Math.min(10, Math.max(1, Number(ctx.params.edge ?? 4)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const open = 0.5 - 0.5 * Math.cos(Math.PI * 2 * cycles * ctx.t);
    const dx = axis === "horizontal" ? 0 : ctx.width * distance * open;
    const dy = axis === "vertical" ? 0 : ctx.height * distance * open;
    const diagonal = axis === "diagonal";
    const firstClip = diagonal ? "polygon(0 0, 70% 0, 30% 100%, 0 100%)" : axis === "horizontal" ? "inset(0 0 50% 0)" : "inset(0 50% 0 0)";
    const secondClip = diagonal ? "polygon(70% 0, 100% 0, 100% 100%, 30% 100%)" : axis === "horizontal" ? "inset(50% 0 0 0)" : "inset(0 0 0 50%)";
    const markerTravel = 0.08 + 0.84 * (0.5 - 0.5 * Math.cos(Math.PI * 2 * ctx.t));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.06 + open * 0.08 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          clipPath: firstClip,
          transform: \`translate3d(\${-dx}px, \${-dy}px, 0)\`,
          filter: \`drop-shadow(0 0 \${edge * 1.8}px \${signal})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          clipPath: secondClip,
          transform: \`translate3d(\${dx}px, \${dy}px, 0)\`,
          filter: \`drop-shadow(0 0 \${edge * 1.8}px \${signal})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: axis === "horizontal" ? \`\${markerTravel * 100}%\` : "50%",
          top: axis === "horizontal" ? "50%" : \`\${markerTravel * 100}%\`,
          width: axis === "horizontal" ? 18 + open * 34 : edge * 1.5,
          height: axis === "horizontal" ? edge * 1.5 : 18 + open * 34,
          borderRadius: 999,
          background: signal,
          opacity: 0.42 + open * 0.5,
          boxShadow: \`0 0 \${10 + edge * 2}px \${signal}\`,
          transform: \`translate(-50%, -50%) rotate(\${diagonal ? 21.8 : 0}deg)\`
        }
      }
    ));
  }
};
var M11_split_mask_effect_default = kernel;
`;export{n as default};
