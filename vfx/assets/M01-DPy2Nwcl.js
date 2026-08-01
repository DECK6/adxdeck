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
var M01_shape_reveal_effect_exports = {};
__export(M01_shape_reveal_effect_exports, {
  default: () => M01_shape_reveal_effect_default
});
module.exports = __toCommonJS(M01_shape_reveal_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const shape = String(ctx.params.shape ?? "circle");
    const size = Number(ctx.params.size ?? 1);
    const originX = Number(ctx.params.originX ?? 50);
    const originY = Number(ctx.params.originY ?? 50);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const progress = ctx.t * ctx.t * (3 - 2 * ctx.t);
    const extent = progress * 88 * size;
    const diamond = \`\${originX}% \${originY - extent}%, \${originX + extent}% \${originY}%, \${originX}% \${originY + extent}%, \${originX - extent}% \${originY}%\`;
    const square = \`inset(\${Math.max(-20, originY - extent)}% \${Math.max(-20, 100 - originX - extent)}% \${Math.max(-20, 100 - originY - extent)}% \${Math.max(-20, originX - extent)}%)\`;
    const clipPath = shape === "diamond" ? \`polygon(\${diamond})\` : shape === "square" ? square : \`circle(\${extent}% at \${originX}% \${originY}%)\`;
    const ringSize = Math.max(2, extent * 2);
    const ringRadius = shape === "circle" ? "50%" : shape === "diamond" ? "2%" : "0";
    const ringRotation = shape === "diamond" ? 45 : 0;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.07 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, clipPath } }, ctx.subjectNode), progress < 0.995 ? /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: \`\${originX}%\`,
          top: \`\${originY}%\`,
          width: \`\${ringSize}%\`,
          aspectRatio: "1",
          border: \`2px solid \${signal}\`,
          borderRadius: ringRadius,
          boxShadow: \`0 0 14px \${signal}\`,
          opacity: 0.35 + (1 - progress) * 0.45,
          transform: \`translate(-50%, -50%) rotate(\${ringRotation}deg)\`
        }
      }
    ) : null, /* @__PURE__ */ h("div", { style: { position: "absolute", left: 48, bottom: 42, width: 96 + progress * 160, height: 3, background: signal, opacity: 0.8 } }));
  }
};
var M01_shape_reveal_effect_default = kernel;
`;export{e as default};
