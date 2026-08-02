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
var X18_doorway_open_effect_exports = {};
__export(X18_doorway_open_effect_exports, {
  default: () => X18_doorway_open_effect_default
});
module.exports = __toCommonJS(X18_doorway_open_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const maxOpen = Number(ctx.params.open ?? 78);
    const depth = Number(ctx.params.depth ?? 0.09);
    const glow = Number(ctx.params.glow ?? 0.7);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const open = (1 - Math.cos(ctx.t * Math.PI * 2)) * 0.5;
    const door = (left) => /* @__PURE__ */ h("div", { style: { position: "absolute", left: left ? 0 : "50%", top: 0, width: "50%", height: "100%", transformOrigin: left ? "left center" : "right center", transformStyle: "preserve-3d", transform: \`rotateY(\${(left ? 1 : -1) * maxOpen * open}deg)\`, background: \`linear-gradient(\${left ? 110 : 250}deg,#101318,#1e2930 48%,#0D0E10)\`, border: \`2px solid \${signal}\`, boxShadow: \`inset \${left ? -1 : 1}0 38px \${signal}22\` } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "9%", border: \`1px solid \${signal}55\` } }), /* @__PURE__ */ h("div", { style: { position: "absolute", [left ? "right" : "left"]: "8%", top: "50%", width: 12, height: 12, borderRadius: "50%", background: signal, boxShadow: \`0 0 14px \${signal}\` } }));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", perspective: 1e3 } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center", transform: \`scale(\${1 + open * depth})\`, filter: \`brightness(\${0.55 + open * 0.65}) drop-shadow(0 0 \${glow * 24}px \${signal})\` } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, transformStyle: "preserve-3d" } }, door(true), door(false)), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: 0, bottom: 0, width: 3, background: signal, opacity: (1 - open) * glow, boxShadow: \`0 0 \${20 + glow * 30}px \${signal}\` } }));
  }
};
var X18_doorway_open_effect_default = kernel;
`;export{e as default};
