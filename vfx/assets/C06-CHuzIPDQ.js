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
var C06_orbit_around_effect_exports = {};
__export(C06_orbit_around_effect_exports, {
  default: () => C06_orbit_around_effect_default
});
module.exports = __toCommonJS(C06_orbit_around_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const radiusX = Number(ctx.params.radiusX ?? 0.17);
    const radiusY = Number(ctx.params.radiusY ?? 0.08);
    const depth = Number(ctx.params.depth ?? 0.22);
    const laps = Math.max(1, Math.round(Number(ctx.params.laps ?? 1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration;
    const angle = phase * Math.PI * 2 * laps - Math.PI / 2;
    const x = Math.cos(angle) * ctx.width * radiusX;
    const y = Math.sin(angle * 2) * ctx.height * radiusY;
    const z = Math.sin(angle);
    const scale = 1 + z * depth;
    const markerX = 50 + Math.cos(angle) * radiusX * 100;
    const markerY = 50 + Math.sin(angle) * radiusY * 100;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", perspective: ctx.width * 1.4 } }, /* @__PURE__ */ h("svg", { viewBox: "0 0 1000 1000", preserveAspectRatio: "none", style: { position: "absolute", inset: "8%", width: "84%", height: "84%", opacity: 0.38 } }, /* @__PURE__ */ h("ellipse", { cx: "500", cy: "500", rx: radiusX * 1e3, ry: radiusY * 1e3, fill: "none", stroke: signal, strokeWidth: "3", strokeDasharray: "16 18" })), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.1, filter: "grayscale(1)" } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          transform: \`translate3d(\${x}px, \${y}px, \${z * depth * 180}px) scale(\${scale}) rotateY(\${-Math.cos(angle) * 12}deg)\`,
          transformStyle: "preserve-3d",
          filter: \`brightness(\${0.78 + (z + 1) * 0.2}) drop-shadow(0 \${12 + z * 7}px \${18 + depth * 42}px #000000B8) drop-shadow(0 0 \${4 + (z + 1) * 7}px \${signal})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: \`\${markerX}%\`,
          top: \`\${markerY}%\`,
          width: 14 + depth * 30,
          height: 14 + depth * 30,
          borderRadius: "50%",
          border: \`2px solid \${signal}\`,
          background: signal,
          boxShadow: \`0 0 \${12 + depth * 36}px \${signal}\`,
          opacity: 0.7 + (z + 1) * 0.14,
          transform: "translate(-50%, -50%)"
        }
      }
    ));
  }
};
var C06_orbit_around_effect_default = kernel;
`;export{e as default};
