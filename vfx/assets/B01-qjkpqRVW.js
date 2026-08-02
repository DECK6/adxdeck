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
var B01_lower_third_slide_effect_exports = {};
__export(B01_lower_third_slide_effect_exports, {
  default: () => B01_lower_third_slide_effect_default
});
module.exports = __toCommonJS(B01_lower_third_slide_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smooth = (value) => {
  const p = clamp01(value);
  return p * p * (3 - 2 * p);
};
const kernel = {
  kind: "react",
  render: (ctx) => {
    const title = String(ctx.params.title ?? "DEXA VFX");
    const speed = Number(ctx.params.speed ?? 1);
    const accentWidth = Number(ctx.params.accentWidth ?? 0.08);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const base = smooth((ctx.t * speed - 0.035) / 0.2);
    const nameIn = smooth((ctx.t * speed - 0.13) / 0.15);
    const roleIn = smooth((ctx.t * speed - 0.2) / 0.15);
    const outro = smooth((1 - ctx.t) / 0.1);
    const fontSize = Math.max(12, ctx.width * 0.029);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.1 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "6%",
          bottom: "9%",
          width: "58%",
          height: "17%",
          opacity: outro,
          transform: \`translate3d(\${(base - 1) * ctx.width * 0.7}px, 0, 0)\`
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            background: "#14181CEB",
            borderTop: \`1px solid \${signal}66\`,
            boxShadow: "0 18px 42px rgba(0,0,0,0.38)"
          }
        }
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: \`\${accentWidth * 100}%\`,
            background: signal,
            transform: \`scaleY(\${smooth((ctx.t * speed - 0.08) / 0.12)})\`,
            transformOrigin: "bottom"
          }
        }
      ),
      /* @__PURE__ */ h("div", { style: { position: "absolute", left: \`\${accentWidth * 100 + 4}%\`, right: "5%", top: "21%", overflow: "hidden" } }, /* @__PURE__ */ h(
        "div",
        {
          style: {
            color: "#F5F8FA",
            fontSize,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            opacity: nameIn,
            transform: \`translate3d(\${(1 - nameIn) * 48}px, 0, 0)\`,
            whiteSpace: "nowrap"
          }
        },
        title
      )),
      /* @__PURE__ */ h("div", { style: { position: "absolute", left: \`\${accentWidth * 100 + 4}%\`, right: "5%", bottom: "17%", overflow: "hidden" } }, /* @__PURE__ */ h(
        "div",
        {
          style: {
            color: "#C7CFD4",
            fontSize: Math.max(8, ctx.width * 0.011),
            fontWeight: 700,
            letterSpacing: "0.18em",
            opacity: roleIn,
            transform: \`translate3d(\${(1 - roleIn) * 34}px, 0, 0)\`,
            whiteSpace: "nowrap"
          }
        },
        "MOTION SYSTEMS / ON AIR"
      )),
      /* @__PURE__ */ h("div", { style: { position: "absolute", right: "3%", top: "14%", width: "7%", height: 2, background: signal, opacity: 0.72 * roleIn } })
    ));
  }
};
var B01_lower_third_slide_effect_default = kernel;
`;export{n as default};
