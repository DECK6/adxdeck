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
var T12_vertical_roll_effect_exports = {};
__export(T12_vertical_roll_effect_exports, {
  default: () => T12_vertical_roll_effect_default
});
module.exports = __toCommonJS(T12_vertical_roll_effect_exports);
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const kernel = {
  kind: "react",
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? "DEXA");
    const turns = Math.max(1, Math.round(Number(ctx.params.turns ?? 2)));
    const stagger = Number(ctx.params.stagger ?? 0.35);
    const windowRows = Number(ctx.params.window ?? 3.2);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const cycle = ctx.frame % duration / duration;
    const letters = phrase.split("");
    const cellHeight = Math.max(42, Math.min(ctx.height * 0.2, ctx.width * 0.115));
    const reelWidth = cellHeight * 0.69;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.06 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          display: "flex",
          gap: Math.max(3, ctx.width * 8e-3),
          transform: "translate(-50%, -50%)"
        }
      },
      letters.map((target, index) => {
        if (target === " ") {
          return /* @__PURE__ */ h("div", { key: \`space:\${index}\`, style: { width: reelWidth * 0.5 } });
        }
        const targetIndex = Math.max(0, alphabet.indexOf(target.toUpperCase()));
        const position = cycle * alphabet.length * turns + index * stagger;
        const current = Math.floor(position);
        const fraction = position - current;
        return /* @__PURE__ */ h(
          "div",
          {
            key: \`\${target}:\${index}\`,
            style: {
              position: "relative",
              width: reelWidth,
              height: cellHeight * windowRows,
              overflow: "hidden",
              borderTop: \`2px solid \${signal}8C\`,
              borderBottom: \`2px solid \${signal}8C\`,
              background: "#0D0E10E8",
              boxShadow: \`inset 0 0 \${cellHeight * 0.48}px #0D0E10, 0 0 15px \${signal}14\`
            }
          },
          [-2, -1, 0, 1, 2, 3].map((offset) => {
            const letterIndex = ((targetIndex + current + offset) % alphabet.length + alphabet.length) % alphabet.length;
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
                  height: cellHeight,
                  display: "grid",
                  placeItems: "center",
                  color: distance < 0.7 ? signal : "#747880",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: cellHeight * 0.72,
                  fontWeight: 800,
                  lineHeight: 1,
                  opacity: Math.max(0.08, 1 - distance * 0.31),
                  filter: \`blur(\${Math.max(0, distance - 0.45) * 1.4}px)\`,
                  transform: \`translateY(\${(offset - fraction - 0.5) * cellHeight}px)\`,
                  textShadow: distance < 0.7 ? \`0 0 15px \${signal}73\` : "none"
                }
              },
              alphabet[letterIndex]
            );
          }),
          /* @__PURE__ */ h(
            "div",
            {
              style: {
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                height: cellHeight,
                borderTop: \`1px solid \${signal}38\`,
                borderBottom: \`1px solid \${signal}38\`,
                transform: "translateY(-50%)"
              }
            }
          )
        );
      })
    ));
  }
};
var T12_vertical_roll_effect_default = kernel;
`;export{n as default};
