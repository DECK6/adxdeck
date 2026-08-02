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
var B06_caption_pop_effect_exports = {};
__export(B06_caption_pop_effect_exports, {
  default: () => B06_caption_pop_effect_default
});
module.exports = __toCommonJS(B06_caption_pop_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const caption = String(ctx.params.caption ?? "DEXA VFX ON AIR");
    const anchor = String(ctx.params.anchor ?? "left");
    const bounce = Number(ctx.params.bounce ?? 0.62);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const p = clamp01((ctx.t - 0.08) / 0.25);
    const spring = 1 - Math.exp(-7 * p) * Math.cos((8 + bounce * 5) * p);
    const settle = clamp01(spring);
    const detail = clamp01((ctx.t - 0.22) / 0.12);
    const outro = clamp01((1 - ctx.t) / 0.1);
    const left = anchor === "left" ? "28%" : anchor === "right" ? "72%" : "50%";
    const origin = anchor === "left" ? "16% 100%" : anchor === "right" ? "84% 100%" : "50% 100%";
    const tailLeft = anchor === "left" ? "14%" : anchor === "right" ? "72%" : "44%";
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.11 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left,
          bottom: "14%",
          width: "44%",
          transform: \`translateX(-50%) scale(\${0.25 + settle * 0.75}) translate3d(0, \${(1 - p) * 26}px, 0)\`,
          transformOrigin: origin,
          opacity: p * outro
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "relative",
            padding: "5% 7%",
            borderRadius: Math.max(8, ctx.width * 0.012),
            background: "#F2F6F7",
            color: "#0D0E10",
            borderTop: \`5px solid \${signal}\`,
            boxShadow: \`0 18px 44px rgba(0,0,0,0.4), 0 0 24px \${signal}1F\`
          }
        },
        /* @__PURE__ */ h("div", { style: { fontSize: Math.max(11, ctx.width * 0.022), fontWeight: 900, lineHeight: 1.12, letterSpacing: "-0.035em", whiteSpace: "nowrap" } }, caption),
        /* @__PURE__ */ h("div", { style: { marginTop: "0.8em", color: "#334047", fontSize: Math.max(7, ctx.width * 85e-4), fontWeight: 800, letterSpacing: "0.16em", opacity: detail } }, "CAPTION / 01:24"),
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              left: tailLeft,
              bottom: -Math.max(12, ctx.height * 0.032),
              width: 0,
              height: 0,
              borderLeft: \`\${Math.max(9, ctx.width * 0.012)}px solid transparent\`,
              borderRight: \`\${Math.max(4, ctx.width * 5e-3)}px solid transparent\`,
              borderTop: \`\${Math.max(13, ctx.height * 0.035)}px solid #F2F6F7\`
            }
          }
        )
      ),
      /* @__PURE__ */ h("div", { style: { position: "absolute", left: tailLeft, bottom: -Math.max(28, ctx.height * 0.075), width: 5, height: 5, borderRadius: "50%", background: signal, boxShadow: \`0 0 12px \${signal}\` } })
    ));
  }
};
var B06_caption_pop_effect_default = kernel;
`;export{t as default};
