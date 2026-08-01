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
var T18_char_swarm_assemble_effect_exports = {};
__export(T18_char_swarm_assemble_effect_exports, {
  default: () => T18_char_swarm_assemble_effect_default
});
module.exports = __toCommonJS(T18_char_swarm_assemble_effect_exports);
const clamp01 = (value) => Math.max(0, Math.min(1, value));
const easeOut = (u) => 1 - Math.pow(1 - u, 3);
const easeIn = (u) => u * u * u;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const text = String(ctx.params.text ?? "DEXA VFX").toUpperCase();
    const spread = Number(ctx.params.spread ?? 0.42);
    const swirl = Number(ctx.params.swirl ?? 0.55);
    const stagger = Number(ctx.params.stagger ?? 0.34);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const characters = text.split("");
    const fontSize = Math.max(20, Math.min(ctx.width * 0.82 / Math.max(6, characters.length * 0.68), ctx.height * 0.24));
    const formed = clamp01((ctx.t - 0.06) / 0.42) * (1 - clamp01((ctx.t - 0.74) / 0.16));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.09 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize,
          fontWeight: 700,
          lineHeight: 1,
          color: "#F5F8FA",
          whiteSpace: "pre"
        }
      },
      characters.map((character, index) => {
        const order = ctx.random(\`order:\${index}\`);
        const angle = ctx.random(\`angle:\${index}\`) * Math.PI * 2;
        const reach = 0.45 + ctx.random(\`reach:\${index}\`) * 0.55;
        const spin = (ctx.random(\`spin:\${index}\`) * 2 - 1) * 260;
        const startX = Math.cos(angle) * ctx.width * spread * reach;
        const startY = Math.sin(angle) * ctx.height * spread * reach;
        const rawIn = (ctx.t - (0.03 + order * stagger)) / 0.3;
        const flyIn = easeOut(clamp01(rawIn));
        const flyOut = easeIn(clamp01((ctx.t - (0.74 + order * 0.06)) / 0.14));
        const path = flyIn * (1 - flyOut);
        const controlX = startX * 0.5 - startY * swirl;
        const controlY = startY * 0.5 + startX * swirl;
        const inverse = 1 - path;
        const offsetX = inverse * inverse * startX + 2 * inverse * path * controlX;
        const offsetY = inverse * inverse * startY + 2 * inverse * path * controlY;
        const arrive = Math.exp(-Math.pow((rawIn - 1) / 0.14, 2));
        return /* @__PURE__ */ h(
          "span",
          {
            key: \`\${character}:\${index}\`,
            style: {
              display: "inline-block",
              minWidth: character === " " ? "0.62em" : void 0,
              opacity: clamp01(path * 2.4),
              transform: \`translate3d(\${offsetX}px, \${offsetY}px, 0) rotate(\${(1 - path) * spin}deg) scale(\${0.55 + path * 0.45})\`,
              filter: \`blur(\${(1 - path) * 5}px)\`,
              textShadow: \`0 0 \${4 + arrive * 26}px \${signal}\`
            }
          },
          character
        );
      })
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "18%",
          right: "18%",
          top: "62%",
          height: 1,
          background: signal,
          opacity: 0.55 * formed,
          transform: \`scaleX(\${formed})\`,
          transformOrigin: "center"
        }
      }
    ));
  }
};
var T18_char_swarm_assemble_effect_default = kernel;
`;export{n as default};
