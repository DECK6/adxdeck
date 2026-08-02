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
var H09_ray_burst_bg_effect_exports = {};
__export(H09_ray_burst_bg_effect_exports, {
  default: () => H09_ray_burst_bg_effect_default
});
module.exports = __toCommonJS(H09_ray_burst_bg_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const rayCount = Math.min(32, Math.max(10, Math.round(Number(ctx.params.rays ?? 20) / 2) * 2));
    const rotation = Math.min(2, Math.max(-2, Math.round(Number(ctx.params.rotation ?? 1))));
    const intensity = Math.min(1, Math.max(0.15, Number(ctx.params.intensity ?? 0.62)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * Math.PI * 2;
    const angle = phase * rotation * 180 / Math.PI;
    const pulse = 0.82 + Math.sin(phase * 2) * 0.12;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: \`radial-gradient(circle at 50% 52%, \${signal}20 0%, #101A20 18%, #0D0E10 66%)\` } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: "52%", width: "154vmax", height: "154vmax", transform: \`translate(-50%, -50%) rotate(\${angle}deg)\`, opacity: intensity * pulse } }, Array.from({ length: rayCount }, (_, index) => {
      const spread = 360 / rayCount;
      const width = spread * (0.2 + ctx.random(\`ray:\${index}:width\`) * 0.3);
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "50%",
            height: \`\${Math.max(2, width)}%\`,
            transformOrigin: "0 50%",
            transform: \`translateY(-50%) rotate(\${index * spread}deg)\`,
            clipPath: "polygon(0 38%, 100% 0, 100% 100%, 0 62%)",
            background: \`linear-gradient(90deg, \${signal}44, \${signal}0A 74%, transparent)\`
          }
        }
      );
    })), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: "52%", width: "24%", aspectRatio: "1", transform: "translate(-50%, -50%)", borderRadius: "50%", background: \`\${signal}18\`, filter: "blur(26px)" } }), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "16%", opacity: 0.26, transform: \`scale(\${0.97 + Math.sin(phase) * 0.015})\` } }, ctx.subjectNode));
  }
};
var H09_ray_burst_bg_effect_default = kernel;
`;export{t as default};
