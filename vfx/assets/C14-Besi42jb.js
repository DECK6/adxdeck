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
var C14_vertigo_rise_effect_exports = {};
__export(C14_vertigo_rise_effect_exports, {
  default: () => C14_vertigo_rise_effect_default
});
module.exports = __toCommonJS(C14_vertigo_rise_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const rise = Number(ctx.params.rise ?? 0.48);
    const vertigo = Number(ctx.params.vertigo ?? 0.42);
    const horizon = Number(ctx.params.horizon ?? 54);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = (1 - Math.cos(ctx.t * Math.PI * 2)) * 0.5;
    const worldScale = 0.75 + phase * vertigo;
    const subjectScale = 1.22 - phase * vertigo * 0.52;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", perspective: 800 } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: "-30%", right: "-30%", top: \`\${horizon}%\`, bottom: "-60%", transformOrigin: "center top", transform: \`rotateX(66deg) translateY(\${phase * rise * 120}px) scale(\${worldScale})\`, backgroundImage: \`linear-gradient(\${signal}44 1px,transparent 1px),linear-gradient(90deg,\${signal}44 1px,transparent 1px)\`, backgroundSize: "58px 58px", boxShadow: \`0 -8px 30px \${signal}22\` } }), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center", transform: \`translateY(\${-phase * rise * ctx.height * 0.28}px) scale(\${subjectScale})\`, filter: \`drop-shadow(0 \${14 + phase * 24}px \${16 + phase * 22}px #000) drop-shadow(0 0 8px \${signal})\` } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "7%", top: \`\${horizon}%\`, width: "86%", height: 2, background: signal, opacity: 0.32 } }));
  }
};
var C14_vertigo_rise_effect_default = kernel;
`;export{e as default};
