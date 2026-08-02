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
var H14_diamond_sweep_effect_exports = {};
__export(H14_diamond_sweep_effect_exports, {
  default: () => H14_diamond_sweep_effect_default
});
module.exports = __toCommonJS(H14_diamond_sweep_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const tile = Math.min(72, Math.max(28, Number(ctx.params.tile ?? 46)));
    const speed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 2))));
    const gloss = Math.min(1, Math.max(0.2, Number(ctx.params.gloss ?? 0.68)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const travel = ctx.t * tile * speed;
    const phase = ctx.t * Math.PI * 2;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0B1014" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: -tile * 2,
          transform: "rotate(45deg) scale(1.35)",
          backgroundImage: \`linear-gradient(90deg, \${signal}16 1px, transparent 1px), linear-gradient(\${signal}16 1px, transparent 1px)\`,
          backgroundSize: \`\${tile}px \${tile}px\`,
          backgroundPosition: \`\${travel}px \${-travel}px\`
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: "-70% -30%",
          transform: \`translateX(\${Math.sin(phase) * 24}%) rotate(-18deg)\`,
          background: \`repeating-linear-gradient(90deg, transparent 0 \${tile * 1.15}px, \${signal}08 \${tile * 1.15}px \${tile * 1.7}px, \${signal}44 \${tile * 1.82}px, transparent \${tile * 2.35}px \${tile * 3}px)\`,
          filter: \`blur(\${3 + gloss * 8}px)\`,
          opacity: gloss,
          mixBlendMode: "screen"
        }
      }
    ), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "16%", opacity: 0.25, filter: \`drop-shadow(0 0 10px \${signal}33)\` } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, background: \`radial-gradient(circle at 50% 50%, transparent 22%, \${signal}08 58%, #050708A8 100%)\`, pointerEvents: "none" } }));
  }
};
var H14_diamond_sweep_effect_default = kernel;
`;export{e as default};
