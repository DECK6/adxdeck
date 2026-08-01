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
var L01_bloom_pulse_effect_exports = {};
__export(L01_bloom_pulse_effect_exports, {
  default: () => L01_bloom_pulse_effect_default
});
module.exports = __toCommonJS(L01_bloom_pulse_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const intensity = Number(ctx.params.intensity ?? 0.72);
    const radius = Number(ctx.params.radius ?? 18);
    const speed = Number(ctx.params.speed ?? 1);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const pulse = 0.5 + 0.5 * Math.sin(ctx.t * Math.PI * 2 * speed - Math.PI / 2);
    const blur = 2 + radius * (0.35 + pulse * 0.65);
    const bloomOpacity = intensity * (0.28 + pulse * 0.72);
    const filterId = "l01-bloom-filter";
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "svg",
      {
        width: "0",
        height: "0",
        "aria-hidden": "true",
        style: { position: "absolute" }
      },
      /* @__PURE__ */ h("defs", null, /* @__PURE__ */ h("filter", { id: filterId, x: "-80%", y: "-80%", width: "260%", height: "260%" }, /* @__PURE__ */ h("feGaussianBlur", { stdDeviation: blur, result: "blur" }), /* @__PURE__ */ h("feFlood", { floodColor: signal, floodOpacity: bloomOpacity, result: "color" }), /* @__PURE__ */ h("feComposite", { in: "color", in2: "blur", operator: "in", result: "coloredBlur" }), /* @__PURE__ */ h("feMerge", null, /* @__PURE__ */ h("feMergeNode", { in: "coloredBlur" }), /* @__PURE__ */ h("feMergeNode", { in: "coloredBlur" }))))
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          filter: \`url(#\${filterId})\`,
          opacity: bloomOpacity,
          transform: \`scale(\${1 + pulse * 0.025})\`,
          transformOrigin: "center"
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          filter: \`drop-shadow(0 0 \${4 + pulse * 8}px \${signal})\`
        }
      },
      ctx.subjectNode
    ));
  }
};
var L01_bloom_pulse_effect_default = kernel;
`;export{e as default};
