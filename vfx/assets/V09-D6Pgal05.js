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
var V09_gauge_needle_effect_exports = {};
__export(V09_gauge_needle_effect_exports, {
  default: () => V09_gauge_needle_effect_default
});
module.exports = __toCommonJS(V09_gauge_needle_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const sweep = Number(ctx.params.sweep ?? 240);
    const swing = Number(ctx.params.swing ?? 0.86);
    const cycles = Math.max(1, Math.round(Number(ctx.params.cycles ?? 2)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.frame / Math.max(1, ctx.durationInFrames) * Math.PI * 2 * cycles;
    const normalized = 0.5 - Math.cos(phase) * 0.5;
    const eased = normalized * normalized * (3 - 2 * normalized);
    const needleAngle = -sweep / 2 + sweep * (0.5 + (eased - 0.5) * swing);
    const startAngle = (-90 - sweep / 2) * (Math.PI / 180);
    const endAngle = (-90 + sweep / 2) * (Math.PI / 180);
    const radius = 330;
    const startX = 500 + Math.cos(startAngle) * radius;
    const startY = 540 + Math.sin(startAngle) * radius;
    const endX = 500 + Math.cos(endAngle) * radius;
    const endY = 540 + Math.sin(endAngle) * radius;
    const largeArc = sweep > 180 ? 1 : 0;
    const ticks = 17;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "27%", opacity: 0.09 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "svg",
      {
        viewBox: "0 0 1000 820",
        preserveAspectRatio: "xMidYMid meet",
        style: { position: "absolute", inset: "8%", width: "84%", height: "84%", overflow: "visible" }
      },
      /* @__PURE__ */ h(
        "path",
        {
          d: \`M \${startX} \${startY} A \${radius} \${radius} 0 \${largeArc} 1 \${endX} \${endY}\`,
          fill: "none",
          stroke: signal,
          strokeWidth: "16",
          strokeLinecap: "round",
          opacity: "0.22"
        }
      ),
      Array.from({ length: ticks }, (_, index) => {
        const angle = (-90 - sweep / 2 + sweep * index / (ticks - 1)) * (Math.PI / 180);
        const inner = index % 4 === 0 ? radius - 46 : radius - 30;
        return /* @__PURE__ */ h(
          "line",
          {
            key: index,
            x1: 500 + Math.cos(angle) * inner,
            y1: 540 + Math.sin(angle) * inner,
            x2: 500 + Math.cos(angle) * radius,
            y2: 540 + Math.sin(angle) * radius,
            stroke: signal,
            strokeWidth: index % 4 === 0 ? 8 : 4,
            opacity: index % 4 === 0 ? 0.75 : 0.34,
            strokeLinecap: "round"
          }
        );
      }),
      /* @__PURE__ */ h("g", { transform: \`rotate(\${needleAngle} 500 540)\` }, /* @__PURE__ */ h(
        "path",
        {
          d: "M 486 552 L 500 190 L 514 552 Z",
          fill: signal,
          style: { filter: \`drop-shadow(0 0 18px \${signal})\` }
        }
      )),
      /* @__PURE__ */ h("circle", { cx: "500", cy: "540", r: "42", fill: "#0D0E10", stroke: signal, strokeWidth: "12" }),
      /* @__PURE__ */ h("circle", { cx: "500", cy: "540", r: "15", fill: signal })
    ));
  }
};
var V09_gauge_needle_effect_default = kernel;
`;export{e as default};
