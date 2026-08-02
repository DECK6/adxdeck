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
var T27_emboss_press_effect_exports = {};
__export(T27_emboss_press_effect_exports, {
  default: () => T27_emboss_press_effect_default
});
module.exports = __toCommonJS(T27_emboss_press_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? "DEXA");
    const depth = Number(ctx.params.depth ?? 6);
    const grain = Number(ctx.params.grain ?? 0.45);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration;
    const press = Math.sin(phase * Math.PI * 2);
    const relief = Math.sin(phase * Math.PI * 2 - Math.PI / 2);
    const offset = Math.max(1, depth * (0.45 + Math.abs(relief) * 0.55));
    const paper = "#D8D4C8";
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", display: "grid", placeItems: "center", background: paper } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.03, filter: "grayscale(1) contrast(1.4)" } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: grain * 0.2, backgroundImage: \`radial-gradient(circle at 20% 30%, #5C5A5428 0 0.7px, transparent 0.9px), radial-gradient(circle at 70% 65%, #FFFFFF4A 0 0.6px, transparent 0.8px)\`, backgroundSize: "9px 11px, 13px 15px" } }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "relative",
          color: "#77736B",
          fontFamily: "Georgia, serif",
          fontSize: Math.max(36, Math.min(ctx.width * 0.15, ctx.height * 0.32)),
          fontWeight: 900,
          letterSpacing: "0.07em",
          lineHeight: 1,
          whiteSpace: "nowrap",
          transform: \`scale(\${1 - Math.max(0, press) * 0.018}) translateY(\${Math.max(0, press) * 2}px)\`,
          textShadow: \`\${-offset * relief}px \${-offset * relief}px \${offset * 1.1}px #FFFFFF, \${offset * relief}px \${offset * relief}px \${offset * 1.15}px #77736B, 0 0 \${Math.max(0, -press) * 12}px \${signal}42\`,
          WebkitTextStroke: \`1px \${relief > 0 ? "#BCB8AD" : "#EEEAE0"}\`
        }
      },
      phrase
    ), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "20%", right: "20%", top: "69%", height: 1, background: signal, opacity: 0.12 + Math.max(0, -press) * 0.3, transform: \`scaleX(\${0.7 + Math.abs(press) * 0.3})\` } }));
  }
};
var T27_emboss_press_effect_default = kernel;
`;export{e as default};
