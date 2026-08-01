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
var X01_iris_wipe_effect_exports = {};
__export(X01_iris_wipe_effect_exports, {
  default: () => X01_iris_wipe_effect_default
});
module.exports = __toCommonJS(X01_iris_wipe_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const softness = Number(ctx.params.softness ?? 0.12);
    const originX = Number(ctx.params.originX ?? 0.5);
    const originY = Number(ctx.params.originY ?? 0.5);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const pulse = Math.sin(Math.PI * ctx.t);
    const progress = pulse * pulse * (3 - 2 * pulse);
    const radius = progress * 142;
    const feather = 1 + softness * 18;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center" } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          background: "#F5F1E6",
          clipPath: \`circle(\${radius}% at \${originX * 100}% \${originY * 100}%)\`,
          filter: \`drop-shadow(0 0 \${feather}px \${signal})\`
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(135deg, transparent 0 46%, rgba(13,14,16,0.08) 46% 54%, transparent 54% 100%)",
            backgroundSize: "72px 72px"
          }
        }
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            filter: "grayscale(1) contrast(1.35)",
            mixBlendMode: "multiply",
            transform: \`scale(\${0.92 + progress * 0.08})\`
          }
        },
        ctx.subjectNode
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: "8%",
            top: "11%",
            width: "20%",
            height: 9,
            background: "#17181A",
            transform: "rotate(-7deg)"
          }
        }
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            right: "9%",
            bottom: "12%",
            color: "#17181A",
            fontFamily: "monospace",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.24em"
          }
        },
        "DEXA VFX / IRIS"
      )
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: \`\${originX * 100}%\`,
          top: \`\${originY * 100}%\`,
          width: \`\${radius * 2}%\`,
          aspectRatio: "1",
          border: \`2px solid \${signal}\`,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          opacity: progress > 0.02 && progress < 0.98 ? 0.75 : 0
        }
      }
    ));
  }
};
var X01_iris_wipe_effect_default = kernel;
`;export{n as default};
