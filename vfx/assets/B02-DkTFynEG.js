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
var B02_lower_third_glass_effect_exports = {};
__export(B02_lower_third_glass_effect_exports, {
  default: () => B02_lower_third_glass_effect_default
});
module.exports = __toCommonJS(B02_lower_third_glass_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const easeOut = (value) => 1 - (1 - clamp01(value)) ** 3;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const title = String(ctx.params.title ?? "DEXA VFX");
    const blur = Number(ctx.params.blur ?? 16);
    const frost = Number(ctx.params.frost ?? 0.42);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const bloom = easeOut((ctx.t - 0.05) / 0.24);
    const textIn = easeOut((ctx.t - 0.19) / 0.17);
    const sheen = clamp01((ctx.t - 0.12) / 0.36);
    const outro = clamp01((1 - ctx.t) / 0.11);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.12 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "7%",
          bottom: "9%",
          width: "58%",
          height: "18%",
          overflow: "hidden",
          borderRadius: Math.max(8, ctx.width * 9e-3),
          border: \`1px solid \${signal}52\`,
          background: \`linear-gradient(110deg, rgba(20,25,29,\${0.58 + frost * 0.28}), rgba(57,70,75,\${0.2 + frost * 0.2}), rgba(15,18,21,\${0.62 + frost * 0.24}))\`,
          backdropFilter: \`blur(\${blur}px) saturate(1.35)\`,
          WebkitBackdropFilter: \`blur(\${blur}px) saturate(1.35)\`,
          boxShadow: \`inset 0 1px 0 rgba(255,255,255,0.2), 0 22px 52px rgba(0,0,0,0.42), 0 0 26px \${signal}14\`,
          opacity: bloom * outro,
          transform: \`scaleX(\${0.08 + bloom * 0.92}) scaleY(\${0.82 + bloom * 0.18})\`,
          transformOrigin: "50% 50%"
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            top: "-45%",
            bottom: "-45%",
            left: \`\${-35 + sheen * 150}%\`,
            width: "13%",
            transform: "skewX(-18deg)",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)"
          }
        }
      ),
      /* @__PURE__ */ h("div", { style: { position: "absolute", left: "5%", top: "22%", right: "6%", color: "#F7FAFC", opacity: textIn, transform: \`translate3d(0, \${(1 - textIn) * 16}px, 0)\` } }, /* @__PURE__ */ h("div", { style: { color: signal, fontSize: Math.max(7, ctx.width * 9e-3), fontWeight: 800, letterSpacing: "0.22em", marginBottom: "0.5em" } }, "SIGNAL / 07"), /* @__PURE__ */ h("div", { style: { fontSize: Math.max(12, ctx.width * 0.028), fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em", whiteSpace: "nowrap" } }, title), /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, right: 0, bottom: "-28%", height: 1, background: \`linear-gradient(90deg, \${signal}, \${signal}22, transparent)\` } }))
    ));
  }
};
var B02_lower_third_glass_effect_default = kernel;
`;export{t as default};
