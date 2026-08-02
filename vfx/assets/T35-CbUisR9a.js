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
var T35_braille_dots_effect_exports = {};
__export(T35_braille_dots_effect_exports, {
  default: () => T35_braille_dots_effect_default
});
module.exports = __toCommonJS(T35_braille_dots_effect_exports);
const TAU = Math.PI * 2;
const BRAILLE = {
  A: 1,
  B: 3,
  C: 9,
  D: 25,
  E: 17,
  F: 11,
  G: 27,
  H: 19,
  I: 10,
  J: 26,
  K: 5,
  L: 7,
  M: 13,
  N: 29,
  O: 21,
  P: 15,
  Q: 31,
  R: 23,
  S: 14,
  T: 30,
  U: 37,
  V: 39,
  W: 58,
  X: 45,
  Y: 61,
  Z: 53
};
const kernel = {
  kind: "react",
  render: (ctx) => {
    const text = String(ctx.params.text ?? "DEXA").toUpperCase();
    const dotSize = Math.min(18, Math.max(5, Number(ctx.params.dotSize ?? 10)));
    const spacing = Math.min(28, Math.max(10, Number(ctx.params.spacing ?? 17)));
    const cycles = Math.min(3, Math.max(1, Math.round(Number(ctx.params.cycles ?? 1))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const characters = text.split("");
    const phase = ctx.t * TAU * cycles;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.08 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: spacing * 0.75
        }
      },
      characters.map((character, characterIndex) => {
        const mask = BRAILLE[character] ?? 0;
        return character === " " ? /* @__PURE__ */ h("span", { key: \`space:\${characterIndex}\`, style: { width: spacing } }) : /* @__PURE__ */ h(
          "span",
          {
            key: \`\${character}:\${characterIndex}\`,
            style: {
              display: "grid",
              gridTemplateColumns: \`\${dotSize}px \${dotSize}px\`,
              gridTemplateRows: \`\${dotSize}px \${dotSize}px \${dotSize}px\`,
              gap: Math.max(3, spacing - dotSize)
            }
          },
          Array.from({ length: 6 }, (_, visualIndex) => {
            const column = visualIndex % 2;
            const row = Math.floor(visualIndex / 2);
            const bit = column === 0 ? 1 << row : 1 << row + 3;
            const active = (mask & bit) !== 0;
            const order = characterIndex * 6 + visualIndex;
            const wave = 0.5 + 0.5 * Math.sin(phase - order * 0.23);
            const energy = active ? 0.3 + wave * 0.7 : 0.06 + wave * 0.06;
            return /* @__PURE__ */ h(
              "span",
              {
                key: visualIndex,
                style: {
                  width: dotSize,
                  height: dotSize,
                  borderRadius: "50%",
                  background: active ? signal : "#5EE7F322",
                  opacity: energy,
                  boxShadow: active ? \`0 0 \${3 + wave * 12}px \${signal}\` : "none",
                  transform: \`scale(\${active ? 0.55 + wave * 0.45 : 0.5})\`
                }
              }
            );
          })
        );
      })
    ));
  }
};
var T35_braille_dots_effect_default = kernel;
`;export{n as default};
