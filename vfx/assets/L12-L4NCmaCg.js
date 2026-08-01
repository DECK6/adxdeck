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
var L12_spotlight_track_effect_exports = {};
__export(L12_spotlight_track_effect_exports, {
  default: () => L12_spotlight_track_effect_default
});
module.exports = __toCommonJS(L12_spotlight_track_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const radius = Math.min(42, Math.max(10, Number(ctx.params.radius ?? 25)));
    const feather = Math.min(30, Math.max(5, Number(ctx.params.feather ?? 16)));
    const laps = Math.max(1, Math.round(Number(ctx.params.laps ?? 2)));
    const ambient = Math.min(0.45, Math.max(0, Number(ctx.params.ambient ?? 0.12)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const angle = ctx.t * Math.PI * 2 * laps - Math.PI / 2;
    const x = 50 + Math.cos(angle) * 28;
    const y = 50 + Math.sin(angle * 2) * 20;
    const edge = radius + feather;
    const mask = \`radial-gradient(circle at \${x}% \${y}%, black 0%, black \${radius}%, transparent \${edge}%)\`;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: ambient, filter: "grayscale(1)" } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          maskImage: mask,
          WebkitMaskImage: mask,
          filter: \`brightness(1.35) drop-shadow(0 0 12px \${signal})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: \`\${x - edge / 2}%\`,
          top: \`\${y - edge / 2}%\`,
          width: \`\${edge}%\`,
          height: \`\${edge}%\`,
          borderRadius: "50%",
          background: \`radial-gradient(circle, \${signal}38 0%, \${signal}14 55%, transparent 78%)\`,
          border: \`1.5px solid \${signal}55\`,
          mixBlendMode: "screen"
        }
      }
    ));
  }
};
var L12_spotlight_track_effect_default = kernel;
`;export{e as default};
