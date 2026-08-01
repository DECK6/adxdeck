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
var L02_specular_sweep_effect_exports = {};
__export(L02_specular_sweep_effect_exports, {
  default: () => L02_specular_sweep_effect_default
});
module.exports = __toCommonJS(L02_specular_sweep_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const width = Number(ctx.params.width ?? 12);
    const angle = Number(ctx.params.angle ?? -18);
    const intensity = Number(ctx.params.intensity ?? 0.76);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const eased = ctx.t * ctx.t * (3 - 2 * ctx.t);
    const center = -36 + eased * 172;
    const slope = Math.tan(angle * Math.PI / 180) * 50;
    const leftTop = center - width / 2 - slope;
    const rightTop = center + width / 2 - slope;
    const rightBottom = center + width / 2 + slope;
    const leftBottom = center - width / 2 + slope;
    const band = \`polygon(\${leftTop}% 0, \${rightTop}% 0, \${rightBottom}% 100%, \${leftBottom}% 100%)\`;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          clipPath: band,
          filter: \`brightness(\${1.5 + intensity * 2.2}) drop-shadow(0 0 \${8 + intensity * 18}px \${signal})\`,
          mixBlendMode: "screen"
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          clipPath: band,
          background: \`linear-gradient(90deg, transparent, \${signal}22 22%, #FFFFFF\${intensity > 0.5 ? "B8" : "72"} 50%, \${signal}33 78%, transparent)\`,
          mixBlendMode: "screen",
          opacity: 0.35 + intensity * 0.42
        }
      }
    ), /* @__PURE__ */ h("div", { style: { position: "absolute", left: 48, bottom: 42, width: 96 + intensity * 160, height: 3, background: signal, opacity: 0.8 } }));
  }
};
var L02_specular_sweep_effect_default = kernel;
`;export{e as default};
