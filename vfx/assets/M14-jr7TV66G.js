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
var M14_keyhole_zoom_effect_exports = {};
__export(M14_keyhole_zoom_effect_exports, {
  default: () => M14_keyhole_zoom_effect_default
});
module.exports = __toCommonJS(M14_keyhole_zoom_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const zoom = Number(ctx.params.zoom ?? 1.2);
    const throat = Number(ctx.params.throat ?? 28);
    const glow = Number(ctx.params.glow ?? 0.66);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const travel = (1 - Math.cos(ctx.t * Math.PI * 2)) * 0.5;
    const scale = 0.22 + travel * zoom;
    const common = { position: "absolute", left: "50%", overflow: "hidden", filter: \`drop-shadow(0 0 \${12 + glow * 28}px \${signal})\` };
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.08, transform: \`scale(\${1.08 - travel * 0.06})\`, filter: "grayscale(1)" } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { ...common, top: "18%", width: "34%", aspectRatio: "1", borderRadius: "50%", transform: \`translateX(-50%) scale(\${scale})\`, transformOrigin: "50% 88%" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: "-97%", top: "-53%", width: "294%", height: "294%", transform: \`scale(\${1 + travel * 0.18})\` } }, ctx.subjectNode)), /* @__PURE__ */ h("div", { style: { ...common, top: "43%", width: \`\${throat}%\`, height: "48%", clipPath: "polygon(38% 0,62% 0,100% 100%,0 100%)", transform: \`translateX(-50%) scale(\${scale})\`, transformOrigin: "50% 0" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: \`\${-(50 - throat / 2) / throat * 100}%\`, top: "-90%", width: \`\${1e4 / throat}%\`, height: "208%" } }, ctx.subjectNode)), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: "43%", width: 12, height: 12, borderRadius: "50%", background: signal, transform: \`translate(-50%,-50%) scale(\${0.4 + travel})\`, opacity: glow } }));
  }
};
var M14_keyhole_zoom_effect_default = kernel;
`;export{e as default};
