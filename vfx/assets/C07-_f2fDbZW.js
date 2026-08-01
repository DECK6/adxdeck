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
var C07_crash_zoom_effect_exports = {};
__export(C07_crash_zoom_effect_exports, {
  default: () => C07_crash_zoom_effect_default
});
module.exports = __toCommonJS(C07_crash_zoom_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const zoom = Number(ctx.params.zoom ?? 2.35);
    const snap = Math.max(0.01, Number(ctx.params.snap ?? 0.11));
    const smear = Number(ctx.params.smear ?? 0.68);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const pulseAt = (offset) => {
      const wave = Math.sin(Math.PI * (ctx.t - 0.38 + offset));
      return Math.exp(-Math.pow(wave / snap, 2));
    };
    const pulse = pulseAt(0);
    const mainScale = 1 + (zoom - 1) * pulse;
    const echoes = [0.014, 0.028, 0.044];
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, echoes.map((delay, index) => {
      const echo = pulseAt(delay);
      const scale = 1 + (zoom - 1) * echo * (0.92 - index * 0.12);
      return /* @__PURE__ */ h(
        "div",
        {
          key: delay,
          style: {
            position: "absolute",
            inset: 0,
            transform: \`scale(\${scale})\`,
            transformOrigin: "center",
            opacity: smear * echo * (0.22 - index * 0.045),
            filter: \`blur(\${(index + 1) * smear * 3}px) drop-shadow(0 0 \${10 + index * 7}px \${signal})\`,
            mixBlendMode: "screen"
          }
        },
        ctx.subjectNode
      );
    }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          transform: \`scale(\${mainScale})\`,
          transformOrigin: "center",
          filter: \`contrast(\${1 + pulse * 0.32}) blur(\${pulse * smear * 0.65}px)\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: \`\${8 + pulse * 34}%\`,
          border: \`1px solid \${signal}\`,
          opacity: pulse * 0.38,
          transform: \`scale(\${1 + pulse * 1.8})\`
        }
      }
    ));
  }
};
var C07_crash_zoom_effect_default = kernel;
`;export{e as default};
