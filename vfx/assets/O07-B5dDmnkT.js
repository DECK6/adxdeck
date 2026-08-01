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
var O07_focus_pop_effect_exports = {};
__export(O07_focus_pop_effect_exports, {
  default: () => O07_focus_pop_effect_default
});
module.exports = __toCommonJS(O07_focus_pop_effect_exports);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const CORNERS = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1]
];
const kernel = {
  kind: "react",
  render: (ctx) => {
    const blur = Number(ctx.params.blur ?? 0.62);
    const startScale = Number(ctx.params.startScale ?? 1.34);
    const hunt = Number(ctx.params.hunt ?? 0.55);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const p = clamp01(ctx.t / 0.36);
    const hunting = Math.exp(-4.6 * p) * Math.abs(Math.cos((5.2 + hunt * 6) * p));
    const idle = Math.max(0, ctx.t - 0.36);
    const breath = 24e-4 * (1 + Math.sin(idle * Math.PI * 1.7));
    const blurPx = blur * ctx.height * 0.07 * hunting + ctx.height * breath;
    const settle = 1 - Math.exp(-5.4 * p) * Math.cos(6.4 * p);
    const scale = 1 + (startScale - 1) * (1 - settle);
    const spread = 21 - 12 * hunting;
    const lock = Math.exp(-Math.pow((ctx.t - 0.34) / 0.05, 2));
    const bracket = Math.max(1, ctx.height * 9e-3);
    const bracketSize = ctx.height * 0.075;
    const entry = clamp01(ctx.t / 0.05);
    const outro = clamp01((1 - ctx.t) / 0.1);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: outro * entry } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "19%",
          top: "19%",
          width: "62%",
          height: "62%",
          transform: \`scale(\${scale * 1.04})\`,
          transformOrigin: "50% 47.8%",
          filter: \`blur(\${blurPx * 2.6 + 0.4}px)\`,
          opacity: 0.25 + hunting * 0.5
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "19%",
          top: "19%",
          width: "62%",
          height: "62%",
          transform: \`scale(\${scale})\`,
          transformOrigin: "50% 47.8%",
          filter: \`blur(\${blurPx}px)\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: \`\${spread}%\`,
          right: \`\${spread}%\`,
          top: \`\${spread}%\`,
          bottom: \`\${spread}%\`
        }
      },
      CORNERS.map(([rx, ry], index) => /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: rx ? void 0 : 0,
            right: rx ? 0 : void 0,
            top: ry ? void 0 : 0,
            bottom: ry ? 0 : void 0,
            width: bracketSize,
            height: bracketSize,
            borderTop: ry ? void 0 : \`\${bracket}px solid \${signal}\`,
            borderBottom: ry ? \`\${bracket}px solid \${signal}\` : void 0,
            borderLeft: rx ? void 0 : \`\${bracket}px solid \${signal}\`,
            borderRight: rx ? \`\${bracket}px solid \${signal}\` : void 0,
            opacity: 0.32 + hunting * 0.34 + lock * 0.5
          }
        }
      ))
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          background: "radial-gradient(72% 72% at 50% 48%, rgba(0,0,0,0), rgba(0,0,0,0.55))"
        }
      }
    )));
  }
};
var O07_focus_pop_effect_default = kernel;
`;export{n as default};
