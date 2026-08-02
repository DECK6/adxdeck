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
var Y13_blueprint_effect_exports = {};
__export(Y13_blueprint_effect_exports, {
  default: () => Y13_blueprint_effect_default
});
module.exports = __toCommonJS(Y13_blueprint_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const grid = Math.min(72, Math.max(24, Number(ctx.params.grid ?? 40)));
    const detail = Math.min(1, Math.max(0.3, Number(ctx.params.detail ?? 0.78)));
    const drift = Math.min(12, Math.max(0, Number(ctx.params.drift ?? 4)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const offsetX = Math.cos(phase) * drift;
    const offsetY = Math.sin(phase) * drift;
    const measureWidth = Math.min(ctx.width * 0.58, ctx.height * 0.72);
    const measureHeight = measureWidth * 0.56;
    return /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          backgroundColor: "#0D0E10",
          backgroundImage: \`linear-gradient(\${signal}12 1px, transparent 1px), linear-gradient(90deg, \${signal}12 1px, transparent 1px), linear-gradient(\${signal}22 1px, transparent 1px), linear-gradient(90deg, \${signal}22 1px, transparent 1px)\`,
          backgroundSize: \`\${grid / 5}px \${grid / 5}px, \${grid / 5}px \${grid / 5}px, \${grid}px \${grid}px, \${grid}px \${grid}px\`,
          backgroundPosition: \`\${offsetX}px \${offsetY}px\`
        }
      },
      /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, background: \`radial-gradient(circle at 50% 50%, \${signal}14, transparent 62%)\` } }),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            opacity: 0.42 + detail * 0.38,
            filter: \`grayscale(1) sepia(1) saturate(5) hue-rotate(135deg) brightness(1.32) drop-shadow(0 0 3px \${signal})\`
          }
        },
        ctx.subjectNode
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: measureWidth,
            height: measureHeight,
            transform: \`translate(-50%, -50%) translate(\${offsetX * 0.35}px, \${offsetY * 0.35}px)\`,
            border: \`1px dashed \${signal}99\`,
            boxShadow: \`inset 0 0 24px \${signal}0D\`
          }
        },
        /* @__PURE__ */ h("div", { style: { position: "absolute", left: -18, right: -18, top: -24, height: 1, background: signal, opacity: detail } }),
        /* @__PURE__ */ h("div", { style: { position: "absolute", left: -18, top: -29, width: 1, height: 11, background: signal } }),
        /* @__PURE__ */ h("div", { style: { position: "absolute", right: -18, top: -29, width: 1, height: 11, background: signal } }),
        /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: -36, padding: "2px 7px", transform: "translateX(-50%)", background: "#0D0E10", color: "#E9FDFF", border: \`1px solid \${signal}88\`, fontFamily: "monospace", fontSize: 11, letterSpacing: 1.4 } }, "W ", Math.round(measureWidth)),
        /* @__PURE__ */ h("div", { style: { position: "absolute", top: -18, bottom: -18, right: -25, width: 1, background: signal, opacity: detail } }),
        /* @__PURE__ */ h("div", { style: { position: "absolute", right: -30, top: -18, width: 11, height: 1, background: signal } }),
        /* @__PURE__ */ h("div", { style: { position: "absolute", right: -30, bottom: -18, width: 11, height: 1, background: signal } }),
        /* @__PURE__ */ h("div", { style: { position: "absolute", right: -49, top: "50%", padding: "2px 6px", transform: "translateY(-50%) rotate(90deg)", background: "#0D0E10", color: "#E9FDFF", fontFamily: "monospace", fontSize: 10, letterSpacing: 1.2 } }, "H ", Math.round(measureHeight)),
        /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: -9, bottom: -9, width: 1, background: \`\${signal}66\` } }),
        /* @__PURE__ */ h("div", { style: { position: "absolute", top: "50%", left: -9, right: -9, height: 1, background: \`\${signal}66\` } })
      ),
      /* @__PURE__ */ h("div", { style: { position: "absolute", left: 20, bottom: 18, padding: "7px 10px", background: "#0D0E10E6", borderLeft: \`3px solid \${signal}\`, color: "#E9FDFF", fontFamily: "monospace", fontSize: 10, lineHeight: 1.5, letterSpacing: 1 } }, "DEXA // PLAN Y13", /* @__PURE__ */ h("br", null), "REV ", String(Math.floor(ctx.t % 1 * 24)).padStart(2, "0"), " \\xB7 SCALE 1:1")
    );
  }
};
var Y13_blueprint_effect_default = kernel;
`;export{t as default};
