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
var V04_line_chart_draw_effect_exports = {};
__export(V04_line_chart_draw_effect_exports, {
  default: () => V04_line_chart_draw_effect_default
});
module.exports = __toCommonJS(V04_line_chart_draw_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const pointCount = Math.max(6, Math.min(16, Math.round(Number(ctx.params.points ?? 10))));
    const amplitude = Number(ctx.params.amplitude ?? 0.62);
    const thickness = Number(ctx.params.thickness ?? 6);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.frame / Math.max(1, ctx.durationInFrames) * Math.PI * 2;
    const progress = 0.5 - Math.cos(phase) * 0.5;
    const points = Array.from({ length: pointCount }, (_, index) => {
      const x = 90 + 820 * index / (pointCount - 1);
      const trend = 650 - 360 * index / (pointCount - 1);
      const noise = (ctx.random(\`point:\${index}\`) - 0.5) * 420 * amplitude;
      return { x, y: Math.max(125, Math.min(780, trend + noise)) };
    });
    const path = points.map((point, index) => \`\${index === 0 ? "M" : "L"} \${point.x} \${point.y}\`).join(" ");
    const visibleIndex = Math.min(pointCount - 1, Math.floor(progress * pointCount));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "20%", opacity: 0.08 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "svg",
      {
        viewBox: "0 0 1000 900",
        preserveAspectRatio: "none",
        style: { position: "absolute", inset: "10%", width: "80%", height: "80%", overflow: "visible" }
      },
      Array.from({ length: 5 }, (_, index) => /* @__PURE__ */ h(
        "line",
        {
          key: index,
          x1: "70",
          x2: "930",
          y1: 150 + index * 150,
          y2: 150 + index * 150,
          stroke: signal,
          strokeWidth: "2",
          opacity: "0.1"
        }
      )),
      /* @__PURE__ */ h(
        "path",
        {
          d: path,
          fill: "none",
          stroke: signal,
          strokeWidth: thickness,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          pathLength: "1",
          strokeDasharray: "1",
          strokeDashoffset: 1 - progress,
          style: { filter: \`drop-shadow(0 0 \${thickness * 1.8}px \${signal})\` }
        }
      ),
      points.map((point, index) => /* @__PURE__ */ h(
        "circle",
        {
          key: index,
          cx: point.x,
          cy: point.y,
          r: thickness * 1.25,
          fill: signal,
          opacity: index <= visibleIndex && progress > 0.02 ? 1 : 0
        }
      ))
    ));
  }
};
var V04_line_chart_draw_effect_default = kernel;
`;export{n as default};
