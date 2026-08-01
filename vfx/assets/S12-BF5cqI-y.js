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
var S12_dash_march_effect_exports = {};
__export(S12_dash_march_effect_exports, {
  default: () => S12_dash_march_effect_default
});
module.exports = __toCommonJS(S12_dash_march_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const dashLength = Number(ctx.params.dashLength ?? 28);
    const gap = Number(ctx.params.gap ?? 16);
    const thickness = Number(ctx.params.thickness ?? 4);
    const laps = Math.max(1, Math.round(Number(ctx.params.laps ?? 2)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.frame % ctx.durationInFrames / ctx.durationInFrames;
    const period = dashLength + gap;
    const offset = -phase * period * laps;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center" } }, ctx.subjectNode), /* @__PURE__ */ h(
      "svg",
      {
        viewBox: "0 0 1000 1000",
        preserveAspectRatio: "none",
        style: { position: "absolute", inset: "7%", width: "86%", height: "86%", overflow: "visible" }
      },
      /* @__PURE__ */ h(
        "rect",
        {
          x: "18",
          y: "18",
          width: "964",
          height: "964",
          rx: "24",
          fill: "none",
          stroke: signal,
          strokeWidth: thickness,
          strokeDasharray: \`\${dashLength} \${gap}\`,
          strokeDashoffset: offset,
          opacity: "0.94",
          style: { filter: \`drop-shadow(0 0 \${thickness * 2.5}px \${signal})\` }
        }
      ),
      /* @__PURE__ */ h(
        "rect",
        {
          x: "43",
          y: "43",
          width: "914",
          height: "914",
          rx: "16",
          fill: "none",
          stroke: signal,
          strokeWidth: Math.max(1, thickness * 0.42),
          strokeDasharray: \`\${Math.max(3, dashLength * 0.45)} \${gap + dashLength * 0.7}\`,
          strokeDashoffset: -offset * 0.5,
          opacity: "0.34"
        }
      ),
      [0, 1, 2, 3].map((i) => {
        const perim = 2 * (964 + 964);
        const d = (phase * laps + i / 4) % 1 * perim;
        let hx = 18;
        let hy = 18;
        if (d < 964) {
          hx = 18 + d;
          hy = 18;
        } else if (d < 1928) {
          hx = 982;
          hy = 18 + (d - 964);
        } else if (d < 2892) {
          hx = 982 - (d - 1928);
          hy = 982;
        } else {
          hx = 18;
          hy = 982 - (d - 2892);
        }
        return /* @__PURE__ */ h(
          "circle",
          {
            key: i,
            cx: hx,
            cy: hy,
            r: thickness * 1.6,
            fill: signal,
            style: { filter: \`drop-shadow(0 0 \${thickness * 3}px \${signal})\` }
          }
        );
      })
    ));
  }
};
var S12_dash_march_effect_default = kernel;
`;export{n as default};
