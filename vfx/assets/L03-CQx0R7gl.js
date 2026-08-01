const e=`var __defProp = Object.defineProperty;
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
var L03_neon_flicker_effect_exports = {};
__export(L03_neon_flicker_effect_exports, {
  default: () => L03_neon_flicker_effect_default
});
module.exports = __toCommonJS(L03_neon_flicker_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const glow = Number(ctx.params.glow ?? 0.82);
    const flickerRate = Number(ctx.params.flickerRate ?? 22);
    const settle = Number(ctx.params.settle ?? 0.3);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const flickerIndex = Math.floor(ctx.t * flickerRate);
    const flickerNoise = ctx.random(\`flicker:\${flickerIndex}\`);
    const warmup = Math.min(1, ctx.t / Math.max(0.01, settle));
    const unstable = warmup < 1 ? flickerNoise > 0.42 ? 0.58 + flickerNoise * 0.42 : 0.04 + flickerNoise * 0.28 : 1;
    const ignitionPulse = warmup < 1 ? 0.78 + Math.sin(ctx.t * Math.PI * flickerRate * 1.7) * 0.22 : 1;
    const power = Math.max(0.04, unstable * ignitionPulse);
    const blur = 5 + glow * 20;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          opacity: power,
          filter: \`brightness(\${1 + glow * 0.7}) drop-shadow(0 0 \${blur * 0.35}px \${signal}) drop-shadow(0 0 \${blur}px \${signal})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "10%",
          color: "#F7FAFC",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "0.42em",
          textAlign: "center",
          opacity: power * 0.82,
          textShadow: \`0 0 4px #F7FAFC, 0 0 \${blur * 0.55}px \${signal}, 0 0 \${blur * 1.2}px \${signal}, 0 0 \${blur * 2}px \${signal}\`
        }
      },
      "DEXA VFX"
    ), /* @__PURE__ */ h("div", { style: { position: "absolute", left: 48, bottom: 42, width: 96 + glow * 160, height: 3, background: signal, opacity: power * 0.8, boxShadow: \`0 0 \${blur}px \${signal}\` } }));
  }
};
var L03_neon_flicker_effect_default = kernel;
`;export{e as default};
