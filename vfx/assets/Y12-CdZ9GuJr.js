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
var Y12_paper_cutout_effect_exports = {};
__export(Y12_paper_cutout_effect_exports, {
  default: () => Y12_paper_cutout_effect_default
});
module.exports = __toCommonJS(Y12_paper_cutout_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const layers = Math.min(7, Math.max(3, Math.round(Number(ctx.params.layers ?? 5))));
    const depth = Math.min(18, Math.max(2, Number(ctx.params.depth ?? 9)));
    const shadow = Math.min(28, Math.max(4, Number(ctx.params.shadow ?? 16)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const openness = 0.5 - 0.5 * Math.cos(phase);
    return /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          isolation: "isolate",
          background: "#0D0E10"
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: "-20%",
            background: \`radial-gradient(circle at \${50 + Math.cos(phase) * 18}% \${50 + Math.sin(phase) * 12}%, \${signal}24 0%, #0D0E10 58%)\`
          }
        }
      ),
      Array.from({ length: layers }, (_, index) => {
        const inset = 7 + index * (17 / layers);
        const remaining = layers - index - 1;
        const offset = remaining * depth * openness * 0.38;
        const corner = 4 + ctx.random(\`paper:\${index}:corner\`) * 7;
        const opposite = 4 + ctx.random(\`paper:\${index}:opposite\`) * 7;
        const clipPath = \`polygon(\${corner}% 0%, \${100 - opposite}% 0%, 100% \${corner * 0.8}%, 100% \${100 - opposite}%, \${100 - corner}% 100%, \${opposite}% 100%, 0% \${100 - corner * 0.7}%, 0% \${opposite}%)\`;
        const isTop = index === layers - 1;
        const cyanMix = 0.06 + index / Math.max(1, layers - 1) * 0.12;
        return /* @__PURE__ */ h(
          "div",
          {
            key: index,
            style: {
              position: "absolute",
              inset: \`\${inset}%\`,
              overflow: "hidden",
              clipPath,
              transform: \`translate(\${-offset}px, \${offset * 0.72}px) rotate(\${remaining * openness * -0.35}deg)\`,
              transformOrigin: "50% 50%",
              background: \`linear-gradient(145deg, \${signal}\${index % 2 === 0 ? "2B" : "1B"} 0%, #172025 42%, #0D0E10 100%)\`,
              filter: \`drop-shadow(\${depth * 0.35}px \${depth * 0.55}px \${shadow}px #000000CC) drop-shadow(0 0 \${2 + index}px \${signal}26)\`,
              opacity: Math.min(1, 0.84 + cyanMix),
              zIndex: index + 1
            }
          },
          /* @__PURE__ */ h(
            "div",
            {
              style: {
                position: "absolute",
                inset: 1,
                clipPath,
                boxShadow: \`inset 0 0 0 1px \${signal}38\`
              }
            }
          ),
          isTop ? /* @__PURE__ */ h(
            "div",
            {
              style: {
                position: "absolute",
                inset: "3%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                filter: \`drop-shadow(0 \${Math.max(2, depth * 0.32)}px \${shadow * 0.55}px #000000)\`
              }
            },
            ctx.subjectNode
          ) : null
        );
      })
    );
  }
};
var Y12_paper_cutout_effect_default = kernel;
`;export{n as default};
