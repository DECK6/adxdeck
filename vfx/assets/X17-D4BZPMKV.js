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
var X17_cube_rotate_trans_effect_exports = {};
__export(X17_cube_rotate_trans_effect_exports, {
  default: () => X17_cube_rotate_trans_effect_default
});
module.exports = __toCommonJS(X17_cube_rotate_trans_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const depth = Number(ctx.params.depth ?? 180);
    const tilt = Number(ctx.params.tilt ?? -7);
    const turns = Number(ctx.params.turns ?? 1);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const angle = ctx.t * 360 * turns;
    const face = (rotation, label) => /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", backfaceVisibility: "hidden", border: \`2px solid \${signal}\`, background: "#0D0E10", transform: \`rotateY(\${rotation}deg) translateZ(\${depth}px)\`, boxShadow: \`inset 0 0 44px \${signal}22\` } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center", filter: \`drop-shadow(0 0 12px \${signal})\` } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", right: 18, bottom: 14, color: signal, fontFamily: "monospace", fontSize: 12, letterSpacing: 3 } }, label));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", perspective: 1100, display: "grid", placeItems: "center" } }, /* @__PURE__ */ h("div", { style: { position: "relative", width: "64%", height: "58%", transformStyle: "preserve-3d", transform: \`rotateX(\${tilt}deg) rotateY(\${angle}deg)\` } }, face(0, "SCENE A"), face(90, "SCENE B"), face(180, "SCENE C"), face(270, "SCENE D")), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "15%", right: "15%", bottom: "11%", height: 2, background: signal, transform: \`scaleX(\${0.25 + 0.75 * Math.abs(Math.sin(ctx.t * Math.PI * 2))})\`, opacity: 0.45 } }));
  }
};
var X17_cube_rotate_trans_effect_default = kernel;
`;export{e as default};
