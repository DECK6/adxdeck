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
var C05_rack_focus_effect_exports = {};
__export(C05_rack_focus_effect_exports, {
  default: () => C05_rack_focus_effect_default
});
module.exports = __toCommonJS(C05_rack_focus_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const blur = Number(ctx.params.blur ?? 12);
    const focusWidth = Number(ctx.params.focusWidth ?? 24);
    const direction = String(ctx.params.direction ?? "horizontal");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const turn = ctx.t * Math.PI * 2;
    const focusPosition = 50 + Math.sin(turn) * 38;
    const outerStart = Math.max(0, focusPosition - focusWidth * 0.5);
    const innerStart = Math.max(0, focusPosition - focusWidth * 0.28);
    const innerEnd = Math.min(100, focusPosition + focusWidth * 0.28);
    const outerEnd = Math.min(100, focusPosition + focusWidth * 0.5);
    const axis = direction === "vertical" ? "to bottom" : "to right";
    const mask = \`linear-gradient(\${axis}, transparent \${outerStart}%, black \${innerStart}%, black \${innerEnd}%, transparent \${outerEnd}%)\`;
    const markerStyle = direction === "vertical" ? { left: 0, right: 0, top: \`\${focusPosition}%\`, height: 2 } : { top: 0, bottom: 0, left: \`\${focusPosition}%\`, width: 2 };
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: -18,
          opacity: 0.64,
          transform: "scale(1.035)",
          filter: \`blur(\${blur}px) brightness(0.72)\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          WebkitMaskImage: mask,
          maskImage: mask,
          filter: \`contrast(\${1.08 + blur * 0.012}) drop-shadow(0 0 \${Math.max(3, blur * 0.45)}px \${signal})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          ...markerStyle,
          background: signal,
          opacity: 0.2 + 0.12 * Math.cos(turn),
          boxShadow: \`0 0 \${8 + blur}px \${signal}\`
        }
      }
    ));
  }
};
var C05_rack_focus_effect_default = kernel;
`;export{n as default};
