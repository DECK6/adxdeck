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
var I14_dice_roll_effect_exports = {};
__export(I14_dice_roll_effect_exports, {
  default: () => I14_dice_roll_effect_default
});
module.exports = __toCommonJS(I14_dice_roll_effect_exports);
const pipLayouts = [
  [[50, 50]],
  [[28, 28], [72, 72]],
  [[28, 28], [50, 50], [72, 72]],
  [[28, 28], [72, 28], [28, 72], [72, 72]],
  [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]]
];
const kernel = {
  kind: "react",
  render: (ctx) => {
    const size = Number(ctx.params.size ?? 170);
    const bounce = Number(ctx.params.bounce ?? 0.72);
    const rolls = Math.max(1, Math.round(Number(ctx.params.rolls ?? 2)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration;
    const theta = phase * Math.PI * 2;
    const travel = 0.5 - 0.5 * Math.cos(theta);
    const lift = Math.abs(Math.sin(phase * Math.PI * 3)) * Math.sin(Math.PI * phase) * ctx.height * 0.3 * bounce;
    const drift = Math.sin(theta) * ctx.width * 0.12;
    const rotateX = travel * rolls * 360;
    const rotateY = travel * (rolls * 270 + 90);
    const rotateZ = Math.sin(theta) * 16 * bounce;
    const half = size / 2;
    const faces = [
      \`translateZ(\${half}px)\`,
      \`rotateY(180deg) translateZ(\${half}px)\`,
      \`rotateY(90deg) translateZ(\${half}px)\`,
      \`rotateY(-90deg) translateZ(\${half}px)\`,
      \`rotateX(90deg) translateZ(\${half}px)\`,
      \`rotateX(-90deg) translateZ(\${half}px)\`
    ];
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", perspective: ctx.width * 1.25 } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.05, filter: "grayscale(1)" } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "68%",
          width: size * (0.72 + (1 - lift / Math.max(1, ctx.height)) * 0.28),
          height: size * 0.18,
          transform: \`translate(-50%, -50%) translateX(\${drift * 0.62}px)\`,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.9), transparent)",
          opacity: 0.8 - Math.min(0.55, lift / Math.max(1, ctx.height))
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "58%",
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          transform: \`translate3d(calc(-50% + \${drift}px), calc(-50% - \${lift}px), 0) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) rotateZ(\${rotateZ}deg)\`
        }
      },
      faces.map((transform, faceIndex) => /* @__PURE__ */ h(
        "div",
        {
          key: faceIndex,
          style: {
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            transform,
            backfaceVisibility: "hidden",
            border: \`2px solid \${signal}\`,
            borderRadius: size * 0.09,
            boxSizing: "border-box",
            background: "linear-gradient(145deg, #20262D, #090B0E)",
            boxShadow: \`inset 0 0 \${size * 0.18}px #000000, 0 0 16px \${signal}44\`
          }
        },
        /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.12 } }, ctx.subjectNode),
        pipLayouts[faceIndex].map(([left, top], pipIndex) => /* @__PURE__ */ h(
          "div",
          {
            key: pipIndex,
            style: {
              position: "absolute",
              left: \`\${left}%\`,
              top: \`\${top}%\`,
              width: size * 0.105,
              height: size * 0.105,
              transform: "translate(-50%, -50%) translateZ(2px)",
              borderRadius: "50%",
              background: signal,
              boxShadow: \`inset 0 2px 5px #FFFFFF88, 0 0 9px \${signal}\`
            }
          }
        ))
      ))
    ));
  }
};
var I14_dice_roll_effect_default = kernel;
`;export{t as default};
