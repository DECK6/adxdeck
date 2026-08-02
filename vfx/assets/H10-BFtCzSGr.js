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
var H10_blueprint_grid_effect_exports = {};
__export(H10_blueprint_grid_effect_exports, {
  default: () => H10_blueprint_grid_effect_default
});
module.exports = __toCommonJS(H10_blueprint_grid_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const spacing = Math.min(72, Math.max(24, Number(ctx.params.spacing ?? 42)));
    const pan = Math.min(3, Math.max(0, Math.round(Number(ctx.params.pan ?? 1))));
    const detail = Math.min(1, Math.max(0.2, Number(ctx.params.detail ?? 0.65)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const offset = ctx.t * spacing * pan;
    const phase = ctx.t * Math.PI * 2;
    const markers = Array.from({ length: 12 }, (_, index) => ({
      left: 8 + ctx.random(\`marker:\${index}:x\`) * 84,
      top: 7 + ctx.random(\`marker:\${index}:y\`) * 86,
      length: 34 + ctx.random(\`marker:\${index}:length\`) * 70,
      vertical: index % 3 === 0
    }));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#07141B" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: -spacing,
          backgroundImage: \`linear-gradient(\${signal}14 1px, transparent 1px), linear-gradient(90deg, \${signal}14 1px, transparent 1px), linear-gradient(\${signal}28 1px, transparent 1px), linear-gradient(90deg, \${signal}28 1px, transparent 1px)\`,
          backgroundSize: \`\${spacing / 5}px \${spacing / 5}px, \${spacing / 5}px \${spacing / 5}px, \${spacing}px \${spacing}px, \${spacing}px \${spacing}px\`,
          backgroundPosition: \`\${offset}px \${-offset * 0.55}px\`
        }
      }
    ), markers.map((marker, index) => /* @__PURE__ */ h("div", { key: index, style: { position: "absolute", left: \`\${marker.left}%\`, top: \`\${marker.top}%\`, opacity: detail * (0.34 + 0.2 * Math.sin(phase + index)) } }, /* @__PURE__ */ h("div", { style: { width: marker.vertical ? 1 : marker.length, height: marker.vertical ? marker.length : 1, background: signal } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: -3, top: -3, width: 7, height: 7, border: \`1px solid \${signal}\` } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: marker.vertical ? 7 : marker.length + 7, top: marker.vertical ? marker.length - 8 : -8, color: signal, fontFamily: "monospace", fontSize: 7, letterSpacing: 1 } }, \`\${index + 1}.\${Math.round(marker.length)}\`))), /* @__PURE__ */ h("div", { style: { position: "absolute", left: 20, top: 18, color: signal, opacity: 0.38, fontFamily: "monospace", fontSize: 9, letterSpacing: 2 } }, "DEXA / FIELD PLAN \\xB7 09"), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "16%", opacity: 0.25, filter: \`drop-shadow(0 0 8px \${signal}44)\` } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 10, border: \`1px solid \${signal}24\`, pointerEvents: "none" } }));
  }
};
var H10_blueprint_grid_effect_default = kernel;
`;export{e as default};
