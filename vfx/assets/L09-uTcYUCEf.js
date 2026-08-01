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
var L09_strobe_cut_effect_exports = {};
__export(L09_strobe_cut_effect_exports, {
  default: () => L09_strobe_cut_effect_default
});
module.exports = __toCommonJS(L09_strobe_cut_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const rate = Math.max(1, Math.round(Number(ctx.params.rate ?? 6)));
    const duty = Math.min(0.5, Math.max(0.05, Number(ctx.params.duty ?? 0.16)));
    const intensity = Math.min(1, Math.max(0.1, Number(ctx.params.intensity ?? 0.84)));
    const sliceCount = Math.max(2, Math.round(Number(ctx.params.slices ?? 6)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * rate * 6 % 1;
    const flash = phase < duty ? 1 - phase / duty : 0;
    const cut = phase < duty * 0.42;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: cut ? 0.08 : 0.72 + flash * 0.28 } }, ctx.subjectNode), Array.from({ length: sliceCount }, (_, index) => {
      const active = (index + Math.floor(ctx.t * rate * 6)) % 2 === 0;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: 0,
            right: 0,
            top: \`\${index / sliceCount * 100}%\`,
            height: \`\${100 / sliceCount + 0.15}%\`,
            overflow: "hidden",
            opacity: active ? flash * intensity : flash * intensity * 0.28,
            background: signal,
            mixBlendMode: "screen"
          }
        }
      );
    }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          background: signal,
          opacity: flash * intensity * 0.34,
          mixBlendMode: "screen",
          boxShadow: \`inset 0 0 \${80 + intensity * 120}px \${signal}\`
        }
      }
    ));
  }
};
var L09_strobe_cut_effect_default = kernel;
`;export{e as default};
