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
var A11_spectrum_3d_effect_exports = {};
__export(A11_spectrum_3d_effect_exports, {
  default: () => A11_spectrum_3d_effect_default
});
module.exports = __toCommonJS(A11_spectrum_3d_effect_exports);
const TAU = Math.PI * 2;
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const gain = Math.min(2.5, Math.max(0.4, Number(ctx.params.gain ?? 1.35)));
    const rowCount = Math.min(10, Math.max(4, Math.round(Number(ctx.params.rows ?? 7))));
    const depth = Math.min(260, Math.max(80, Number(ctx.params.depth ?? 170)));
    const tilt = Math.min(72, Math.max(42, Number(ctx.params.tilt ?? 58)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const bands = Array.from({ length: 8 }, (_, index) => clamp01(ctx.audio?.bands[index] ?? 0));
    const phase = ctx.t * TAU;
    const stageWidth = ctx.width * 0.72;
    const stageHeight = ctx.height * 0.48;
    const cellWidth = stageWidth / 8;
    const barWidth = cellWidth * 0.58;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", perspective: ctx.width * 1.15 } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.08 + rms * 0.1, transform: \`scale(\${0.9 + rms * 0.08})\` } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "53%",
          width: stageWidth,
          height: stageHeight,
          transformStyle: "preserve-3d",
          transform: \`translate3d(-50%, -50%, 0) rotateX(\${tilt}deg)\`
        }
      },
      Array.from({ length: rowCount }, (_, row) => {
        const rowUnit = row / Math.max(1, rowCount - 1);
        const z = (0.5 - rowUnit) * depth;
        return bands.map((band, column) => {
          const ripple = 0.5 + 0.5 * Math.sin(phase * (1 + column % 3) - row * 0.72 + column * 0.54);
          const energy = clamp01((band * 0.78 + rms * 0.18 + ripple * 0.12) * gain);
          const height = Math.max(3, stageHeight * (0.08 + energy * 0.62));
          const x = column * cellWidth + (cellWidth - barWidth) * 0.5;
          const y = stageHeight * 0.72 - height;
          const depthFade = 0.24 + (1 - rowUnit) * 0.64;
          return /* @__PURE__ */ h(
            "div",
            {
              key: \`\${row}:\${column}\`,
              style: {
                position: "absolute",
                left: x,
                top: y,
                width: barWidth,
                height,
                border: \`1px solid \${signal}\`,
                background: \`\${signal}26\`,
                opacity: depthFade * (0.55 + energy * 0.45),
                boxShadow: \`0 0 \${3 + energy * 10}px \${signal}\`,
                transform: \`translate3d(0, 0, \${z}px)\`,
                transformOrigin: "50% 100%"
              }
            }
          );
        });
      }),
      Array.from({ length: rowCount }, (_, row) => {
        const rowUnit = row / Math.max(1, rowCount - 1);
        return /* @__PURE__ */ h(
          "div",
          {
            key: \`rail:\${row}\`,
            style: {
              position: "absolute",
              left: 0,
              right: 0,
              top: stageHeight * 0.72,
              height: 1,
              background: signal,
              opacity: 0.08 + (1 - rowUnit) * 0.16,
              transform: \`translateZ(\${(0.5 - rowUnit) * depth}px)\`
            }
          }
        );
      })
    ));
  }
};
var A11_spectrum_3d_effect_default = kernel;
`;export{n as default};
