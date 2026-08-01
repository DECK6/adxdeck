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
var R07_lissajous_effect_exports = {};
__export(R07_lissajous_effect_exports, {
  default: () => R07_lissajous_effect_default
});
module.exports = __toCommonJS(R07_lissajous_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const ratio = String(ctx.params.ratio ?? "3:2");
    const [rawA, rawB] = ratio.split(":").map(Number);
    const frequencyX = Number.isFinite(rawA) ? rawA : 3;
    const frequencyY = Number.isFinite(rawB) ? rawB : 2;
    const trails = Math.min(7, Math.max(1, Math.round(Number(ctx.params.trails ?? 4))));
    const scale = Math.min(0.96, Math.max(0.55, Number(ctx.params.scale ?? 0.82)));
    const lineWidth = Math.min(4, Math.max(0.6, Number(ctx.params.lineWidth ?? 1.6)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const centerX = ctx.width * 0.5;
    const centerY = ctx.height * 0.5;
    const amplitudeX = ctx.width * 0.44 * scale;
    const amplitudeY = ctx.height * 0.43 * scale;
    const sampleCount = 280;
    const makePath = (trailIndex) => {
      const trailPhase = phase - trailIndex * 0.055;
      let path = "";
      for (let index = 0; index <= sampleCount; index += 1) {
        const theta = index / sampleCount * TAU;
        const x = centerX + Math.sin(frequencyX * theta + trailPhase) * amplitudeX;
        const y = centerY + Math.sin(frequencyY * theta) * amplitudeY;
        path += \`\${index === 0 ? "M" : "L"}\${x.toFixed(2)} \${y.toFixed(2)}\`;
      }
      return path;
    };
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          opacity: 0.16,
          filter: \`contrast(1.25) saturate(0.65)\`,
          transform: \`scale(\${0.98 + Math.cos(phase) * 0.012})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "svg",
      {
        width: ctx.width,
        height: ctx.height,
        viewBox: \`0 0 \${ctx.width} \${ctx.height}\`,
        style: { position: "absolute", inset: 0 }
      },
      Array.from({ length: trails }, (_, index) => {
        const age = index / Math.max(1, trails - 1);
        return /* @__PURE__ */ h(
          "path",
          {
            key: index,
            d: makePath(index),
            fill: "none",
            stroke: signal,
            strokeWidth: lineWidth * (1 - age * 0.35),
            strokeLinecap: "round",
            strokeLinejoin: "round",
            opacity: 0.9 * Math.pow(1 - age, 1.3) + 0.06,
            style: { filter: index === 0 ? \`drop-shadow(0 0 \${lineWidth * 4}px \${signal})\` : "none" }
          }
        );
      })
    ));
  }
};
var R07_lissajous_effect_default = kernel;
`;export{n as default};
