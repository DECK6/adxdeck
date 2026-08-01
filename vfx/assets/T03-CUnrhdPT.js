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
var T03_odometer_roll_effect_exports = {};
__export(T03_odometer_roll_effect_exports, {
  default: () => T03_odometer_roll_effect_default
});
module.exports = __toCommonJS(T03_odometer_roll_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const target = Math.max(0, Math.round(Number(ctx.params.value ?? 12864)));
    const digits = Math.max(3, Math.min(6, Math.round(Number(ctx.params.digits ?? 5))));
    const turns = Math.max(1, Math.round(Number(ctx.params.turns ?? 3)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const raw = Math.min(1, Math.max(0, (ctx.t - 0.06) / 0.58));
    const progress = 1 - Math.pow(1 - raw, 4);
    const outro = Math.min(1, Math.max(0, (1 - ctx.t) / 0.1));
    const targetDigits = String(target).padStart(digits, "0").slice(-digits).split("").map(Number);
    const slotHeight = Math.max(38, ctx.height * 0.25);
    const slotWidth = Math.max(26, Math.min(ctx.width * 0.105, slotHeight * 0.68));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          opacity: (0.08 + progress * 0.18) * outro,
          transform: \`scale(\${0.94 + progress * 0.06})\`,
          filter: \`blur(\${(1 - progress) * 5}px)\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          display: "flex",
          gap: Math.max(3, ctx.width * 8e-3),
          transform: "translate(-50%, -50%)",
          opacity: outro
        }
      },
      targetDigits.map((targetDigit, index) => {
        const slotTurns = turns + digits - index - 1;
        const position = progress * (slotTurns * 10 + targetDigit);
        const current = Math.floor(position);
        const fraction = position - current;
        return /* @__PURE__ */ h(
          "div",
          {
            key: index,
            style: {
              position: "relative",
              width: slotWidth,
              height: slotHeight,
              overflow: "hidden",
              border: \`1px solid \${signal}66\`,
              borderRadius: 4,
              background: "#0D0E10F2",
              boxShadow: \`inset 0 0 22px \${signal}18, 0 0 12px \${signal}0D\`
            }
          },
          [-1, 0, 1, 2].map((offset) => {
            const value = ((current + offset) % 10 + 10) % 10;
            const distance = Math.abs(offset - fraction);
            return /* @__PURE__ */ h(
              "div",
              {
                key: offset,
                style: {
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "50%",
                  height: slotHeight,
                  display: "grid",
                  placeItems: "center",
                  color: distance < 0.55 ? signal : "#747880",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: slotHeight * 0.62,
                  fontWeight: 700,
                  lineHeight: 1,
                  opacity: Math.max(0.08, 1 - distance * 0.48),
                  filter: \`blur(\${Math.min(3, distance * 1.2)}px)\`,
                  transform: \`translateY(\${(offset - fraction - 0.5) * slotHeight}px)\`
                }
              },
              value
            );
          }),
          /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: \`\${signal}3D\` } })
        );
      })
    ));
  }
};
var T03_odometer_roll_effect_default = kernel;
`;export{t as default};
