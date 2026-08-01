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
var C12_follow_track_effect_exports = {};
__export(C12_follow_track_effect_exports, {
  default: () => C12_follow_track_effect_default
});
module.exports = __toCommonJS(C12_follow_track_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const travel = Number(ctx.params.travel ?? 0.62);
    const follow = Number(ctx.params.follow ?? 0.72);
    const reticle = Boolean(ctx.params.reticle ?? true);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * Math.PI * 2;
    const radiusX = ctx.width * 0.27 * travel;
    const radiusY = ctx.height * 0.2 * travel;
    const targetX = Math.sin(phase) * radiusX;
    const targetY = Math.sin(phase * 2) * radiusY;
    const lag = (1 - follow) * 0.9;
    const cameraX = Math.sin(phase - lag) * radiusX * follow;
    const cameraY = Math.sin((phase - lag) * 2) * radiusY * follow;
    const screenX = targetX - cameraX;
    const screenY = targetY - cameraY;
    const speed = Math.hypot(Math.cos(phase) * radiusX, Math.cos(phase * 2) * radiusY * 2);
    const lock = Math.max(0.2, 1 - Math.hypot(screenX, screenY) / Math.max(1, Math.min(ctx.width, ctx.height) * 0.42));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: "-20%",
          opacity: 0.16,
          transform: \`translate3d(\${-cameraX}px, \${-cameraY}px, 0)\`,
          backgroundImage: \`linear-gradient(\${signal} 1px, transparent 1px), linear-gradient(90deg, \${signal} 1px, transparent 1px)\`,
          backgroundSize: "72px 72px"
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          transform: \`translate3d(\${screenX}px, \${screenY}px, 0) scale(\${1 + speed / Math.max(ctx.width, ctx.height) * 0.025})\`,
          filter: \`drop-shadow(0 0 \${8 + lock * 12}px \${signal})\`
        }
      },
      ctx.subjectNode
    ), reticle && /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: "50%", width: 150, height: 150, transform: "translate(-50%, -50%)", border: \`2px solid \${signal}\`, borderRadius: "50%", opacity: 0.35 + lock * 0.45 } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: -28, right: -28, top: "50%", height: 1, background: signal } }), /* @__PURE__ */ h("div", { style: { position: "absolute", top: -28, bottom: -28, left: "50%", width: 1, background: signal } })), /* @__PURE__ */ h("div", { style: { position: "absolute", right: "6%", top: "7%", color: "#F4F7F8", fontFamily: "monospace", fontSize: 13, letterSpacing: 3 } }, "TRACK ", Math.round(lock * 100).toString().padStart(3, "0"), "%"));
  }
};
var C12_follow_track_effect_default = kernel;
`;export{t as default};
