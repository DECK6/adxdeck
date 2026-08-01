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
var T17_char_bounce_wave_effect_exports = {};
__export(T17_char_bounce_wave_effect_exports, {
  default: () => T17_char_bounce_wave_effect_default
});
module.exports = __toCommonJS(T17_char_bounce_wave_effect_exports);
const clamp01 = (value) => Math.max(0, Math.min(1, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const text = String(ctx.params.text ?? "DEXA VFX").toUpperCase();
    const jump = Number(ctx.params.jump ?? 0.46);
    const stagger = Number(ctx.params.stagger ?? 0.72);
    const squash = Number(ctx.params.squash ?? 0.55);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const characters = text.split("");
    const last = Math.max(1, characters.length - 1);
    const fontSize = Math.max(20, Math.min(ctx.width * 0.84 / Math.max(6, characters.length * 0.68), ctx.height * 0.24));
    const hop = 0.32;
    const spread = (1 - hop) * stagger;
    const cycle = ctx.t * 2 % 1;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.1 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "12%", right: "12%", bottom: "42%", height: 1, background: signal, opacity: 0.22 } }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "42%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize,
          fontWeight: 700,
          lineHeight: 1,
          color: "#F5F8FA",
          whiteSpace: "pre"
        }
      },
      characters.map((character, index) => {
        const raw = (cycle - index / last * spread) / hop;
        const air = Math.sin(Math.PI * clamp01(raw));
        const impact = Math.exp(-Math.pow(raw / 0.08, 2)) + Math.exp(-Math.pow((raw - 1) / 0.08, 2));
        const lift = -Math.pow(air, 0.72) * fontSize * jump;
        const scaleY = 1 + air * squash * 0.12 - impact * squash * 0.34;
        const scaleX = 1 - air * squash * 0.08 + impact * squash * 0.3;
        return /* @__PURE__ */ h(
          "span",
          {
            key: \`\${character}:\${index}\`,
            style: { position: "relative", display: "inline-block", minWidth: character === " " ? "0.62em" : void 0 }
          },
          /* @__PURE__ */ h(
            "span",
            {
              style: {
                position: "absolute",
                left: "-8%",
                right: "-8%",
                bottom: "-0.09em",
                height: "0.08em",
                borderRadius: "50%",
                background: signal,
                opacity: character === " " ? 0 : 0.34 * (1 - air),
                transform: \`scaleX(\${1 - air * 0.45})\`
              }
            }
          ),
          /* @__PURE__ */ h(
            "span",
            {
              style: {
                display: "inline-block",
                transform: \`translate3d(0, \${lift}px, 0) scale(\${scaleX}, \${scaleY})\`,
                transformOrigin: "50% 100%",
                textShadow: \`0 0 \${6 + air * 26}px \${signal}\`
              }
            },
            character
          )
        );
      })
    ));
  }
};
var T17_char_bounce_wave_effect_default = kernel;
`;export{n as default};
