const n=`var __defProp = Object.defineProperty;
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
var V03_progress_ring_effect_exports = {};
__export(V03_progress_ring_effect_exports, {
  default: () => V03_progress_ring_effect_default
});
module.exports = __toCommonJS(V03_progress_ring_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const thickness = Number(ctx.params.thickness ?? 12);
    const cycles = Number(ctx.params.cycles ?? 1);
    const glow = Number(ctx.params.glow ?? 0.58);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const rawProgress = ctx.t * cycles % 1;
    const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);
    const radius = 315;
    const circumference = Math.PI * 2 * radius;
    const dashOffset = circumference * (1 - progress);
    const percentage = Math.round(progress * 100);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: "22%",
          transform: \`scale(\${0.92 + progress * 0.08})\`,
          transformOrigin: "center",
          opacity: 0.24 + progress * 0.76,
          filter: \`drop-shadow(0 0 \${glow * 12}px \${signal})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "svg",
      {
        viewBox: "0 0 1000 1000",
        preserveAspectRatio: "xMidYMid meet",
        style: { position: "absolute", inset: "8%", width: "84%", height: "84%" }
      },
      /* @__PURE__ */ h("circle", { cx: "500", cy: "500", r: radius, fill: "none", stroke: signal, strokeWidth: thickness, opacity: "0.12" }),
      /* @__PURE__ */ h(
        "circle",
        {
          cx: "500",
          cy: "500",
          r: radius,
          fill: "none",
          stroke: signal,
          strokeWidth: thickness,
          strokeLinecap: "round",
          strokeDasharray: circumference,
          strokeDashoffset: dashOffset,
          transform: "rotate(-90 500 500)",
          style: { filter: \`drop-shadow(0 0 \${4 + glow * 14}px \${signal})\` }
        }
      ),
      /* @__PURE__ */ h(
        "circle",
        {
          cx: 500 + Math.cos(progress * Math.PI * 2 - Math.PI / 2) * radius,
          cy: 500 + Math.sin(progress * Math.PI * 2 - Math.PI / 2) * radius,
          r: thickness * 0.72,
          fill: signal,
          opacity: progress > 0.01 ? 1 : 0
        }
      ),
      /* @__PURE__ */ h(
        "text",
        {
          x: "500",
          y: "530",
          fill: signal,
          fontSize: "118",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontWeight: "700",
          textAnchor: "middle",
          style: { fontVariantNumeric: "tabular-nums" }
        },
        percentage,
        "%"
      ),
      /* @__PURE__ */ h(
        "text",
        {
          x: "500",
          y: "600",
          fill: signal,
          opacity: "0.5",
          fontSize: "27",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          letterSpacing: "8",
          textAnchor: "middle"
        },
        "DEXA VFX"
      )
    ));
  }
};
var V03_progress_ring_effect_default = kernel;
`;export{n as default};
