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
var F10_iris_pull_effect_exports = {};
__export(F10_iris_pull_effect_exports, {
  default: () => F10_iris_pull_effect_default
});
module.exports = __toCommonJS(F10_iris_pull_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const aperture = Math.min(1, Math.max(0.2, Number(ctx.params.aperture ?? 0.72)));
    const blur = Math.min(18, Math.max(0, Number(ctx.params.blur ?? 8)));
    const exposure = Math.min(1.6, Math.max(0.4, Number(ctx.params.exposure ?? 1.05)));
    const blades = Math.min(10, Math.max(6, Number.parseInt(String(ctx.params.blades ?? "8"), 10) || 8));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const pull = 0.5 - 0.5 * Math.cos(phase);
    const opening = 0.16 + aperture * (0.64 - pull * 0.38);
    const blurAmount = blur * pull * (1 - aperture * 0.35);
    const brightness = exposure * (1.12 - pull * 0.42);
    const apertureSize = Math.min(ctx.width, ctx.height) * (0.34 + opening * 0.44);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: "-3%",
          display: "grid",
          placeItems: "center",
          transform: \`scale(\${1.02 + pull * 0.025})\`,
          filter: \`blur(\${blurAmount}px) brightness(\${brightness}) contrast(\${1.05 + pull * 0.12})\`
        }
      },
      ctx.subjectNode
    ), Array.from({ length: 7 }, (_, index) => {
      const angle = ctx.random(\`iris:bokeh:\${index}:angle\`) * TAU;
      const radius = 18 + ctx.random(\`iris:bokeh:\${index}:radius\`) * 30;
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius * 0.66;
      const size = 12 + ctx.random(\`iris:bokeh:\${index}:size\`) * 34;
      return /* @__PURE__ */ h(
        "div",
        {
          key: \`bokeh:\${index}\`,
          style: {
            position: "absolute",
            left: \`\${x}%\`,
            top: \`\${y}%\`,
            width: size,
            height: size,
            border: \`1px solid \${signal}\`,
            borderRadius: "50%",
            opacity: pull * (0.06 + index * 0.015),
            transform: \`translate(-50%, -50%) scale(\${0.7 + pull * 0.7})\`,
            filter: \`blur(\${1 + pull * 3}px)\`,
            boxShadow: \`0 0 \${size * 0.5}px \${signal}66\`
          }
        }
      );
    }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: apertureSize,
          height: apertureSize,
          transform: \`translate(-50%, -50%) rotate(\${ctx.t * 18}deg)\`,
          borderRadius: "50%",
          border: \`1px solid \${signal}66\`,
          boxShadow: \`0 0 28px #0D0E10, inset 0 0 22px #0D0E10CC\`,
          opacity: 0.74
        }
      },
      Array.from({ length: blades }, (_, index) => /* @__PURE__ */ h(
        "div",
        {
          key: \`blade:\${index}\`,
          style: {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "52%",
            height: "28%",
            transformOrigin: "0 50%",
            transform: \`rotate(\${index * 360 / blades}deg) translateX(\${opening * apertureSize * 0.23}px)\`,
            clipPath: "polygon(0 50%, 100% 0, 78% 100%)",
            background: "linear-gradient(90deg, #0D0E10EE, #20262BCC)",
            borderLeft: \`1px solid \${signal}55\`
          }
        }
      )),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: \`\${opening * 60}%\`,
            aspectRatio: "1",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            border: \`1px solid \${signal}\`,
            boxShadow: \`0 0 \${8 + opening * 20}px \${signal}66\`
          }
        }
      )
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 15,
          bottom: 13,
          color: "#E9F0F2",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.14em",
          textShadow: "0 1px 3px #0D0E10"
        }
      },
      "DEXA VFX \\xB7 T/",
      (2.8 + pull * 8).toFixed(1)
    ));
  }
};
var F10_iris_pull_effect_default = kernel;
`;export{n as default};
