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
var S09_spiral_unfold_effect_exports = {};
__export(S09_spiral_unfold_effect_exports, {
  default: () => S09_spiral_unfold_effect_default
});
module.exports = __toCommonJS(S09_spiral_unfold_effect_exports);
const buildSpiral = (turns, spread) => {
  const segments = 160;
  return Array.from({ length: segments + 1 }, (_, index) => {
    const progress = index / segments;
    const angle = progress * turns * Math.PI * 2;
    const radius = 18 + progress * 430 * spread;
    const x = 500 + Math.cos(angle) * radius;
    const y = 500 + Math.sin(angle) * radius;
    return \`\${index === 0 ? "M" : "L"} \${x.toFixed(2)} \${y.toFixed(2)}\`;
  }).join(" ");
};
const kernel = {
  kind: "react",
  render: (ctx) => {
    const turns = Math.min(7, Math.max(2, Number(ctx.params.turns ?? 4.5)));
    const arms = Math.max(1, Math.round(Number(ctx.params.arms ?? 3)));
    const spread = Math.min(1, Math.max(0.45, Number(ctx.params.spread ?? 0.82)));
    const weight = Math.min(8, Math.max(1, Number(ctx.params.weight ?? 3.5)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const unfold = 0.5 - 0.5 * Math.cos(ctx.t * Math.PI * 2);
    const path = buildSpiral(turns, spread);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.24 + unfold * 0.4 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "svg",
      {
        viewBox: "0 0 1000 1000",
        preserveAspectRatio: "xMidYMid meet",
        style: { position: "absolute", inset: "4%", width: "92%", height: "92%", filter: \`drop-shadow(0 0 \${weight * 3}px \${signal})\` }
      },
      Array.from({ length: arms }, (_, index) => /* @__PURE__ */ h(
        "path",
        {
          key: index,
          d: path,
          fill: "none",
          stroke: signal,
          strokeWidth: weight,
          strokeLinecap: "round",
          pathLength: 1,
          strokeDasharray: "1",
          strokeDashoffset: 1 - unfold,
          opacity: 0.9 - index * 0.1,
          transform: \`rotate(\${index * 360 / arms + ctx.t * 360} 500 500)\`
        }
      )),
      /* @__PURE__ */ h("circle", { cx: "500", cy: "500", r: 10 + unfold * 15, fill: signal, opacity: 0.55 + unfold * 0.4 })
    ));
  }
};
var S09_spiral_unfold_effect_default = kernel;
`;export{n as default};
