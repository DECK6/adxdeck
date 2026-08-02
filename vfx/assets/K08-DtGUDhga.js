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
var K08_insert_coin_effect_exports = {};
__export(K08_insert_coin_effect_exports, {
  default: () => K08_insert_coin_effect_default
});
module.exports = __toCommonJS(K08_insert_coin_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const blinkRate = Math.min(6, Math.max(1, Math.round(Number(ctx.params.blinkRate ?? 3))));
    const pixelScale = Math.min(16, Math.max(4, Math.round(Number(ctx.params.pixelScale ?? 8))));
    const demoSpeed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.demoSpeed ?? 2))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU * demoSpeed;
    const blinkOn = Math.floor(ctx.t * blinkRate * 12) % 2 === 0;
    const titleStep = Math.round((0.5 + Math.sin(phase) * 0.5) * 4) / 4;
    const screenWidth = Math.min(ctx.width * 0.78, ctx.height * 1.24);
    const screenHeight = Math.min(ctx.height * 0.78, screenWidth * 0.72);
    const starCount = 18;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F7FAFC", fontFamily: "'Courier New', monospace" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: screenWidth,
          height: screenHeight,
          transform: "translate(-50%, -50%)",
          overflow: "hidden",
          background: "#090B0D",
          border: \`\${Math.max(3, pixelScale * 0.5)}px solid #24282D\`,
          boxShadow: \`0 0 0 \${Math.max(2, pixelScale * 0.25)}px #050607, 0 20px 60px #000000CC, inset 0 0 45px #000000\`
        }
      },
      Array.from({ length: starCount }, (_, index) => {
        const x = ctx.random(\`star:\${index}:x\`) * 100;
        const y = (ctx.random(\`star:\${index}:y\`) * 100 + ctx.t * demoSpeed * 100) % 100;
        const size = index % 3 === 0 ? pixelScale * 0.5 : pixelScale * 0.25;
        return /* @__PURE__ */ h("div", { key: index, style: { position: "absolute", left: \`\${x}%\`, top: \`\${y}%\`, width: size, height: size, background: index % 4 === 0 ? "#F7FAFC" : signal, opacity: 0.28 + index % 4 * 0.16 } });
      }),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: "14% 18% 20%",
            display: "grid",
            placeItems: "center",
            opacity: 0.62,
            imageRendering: "pixelated",
            transform: \`translate(\${Math.round(Math.sin(phase) * pixelScale)}px, \${Math.round(Math.cos(phase * 0.5) * pixelScale * 0.5)}px) scale(\${0.9 + titleStep * 0.08})\`,
            filter: \`contrast(1.35) drop-shadow(0 0 \${pixelScale}px \${signal})\`
          }
        },
        ctx.subjectNode
      ),
      /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, right: 0, top: "8%", textAlign: "center", color: "#FFFFFF", fontSize: Math.max(18, screenWidth * 0.07), fontWeight: 900, letterSpacing: "0.08em", lineHeight: 1, textShadow: \`\${pixelScale}px \${pixelScale}px 0 #16373C, 0 0 \${pixelScale * 1.5}px \${signal}\` } }, "DEXA"),
      /* @__PURE__ */ h("div", { style: { position: "absolute", left: "12%", right: "12%", bottom: "12%", padding: \`\${pixelScale * 0.7}px \${pixelScale}px\`, background: "#0D0E10E8", border: \`\${Math.max(2, pixelScale * 0.3)}px solid \${signal}\`, color: "#FFFFFF", textAlign: "center", fontSize: Math.max(11, screenWidth * 0.026), fontWeight: 900, letterSpacing: "0.14em", opacity: blinkOn ? 1 : 0.12, boxShadow: blinkOn ? \`0 0 \${pixelScale * 2}px \${signal}\` : "none" } }, "INSERT COIN"),
      /* @__PURE__ */ h("div", { style: { position: "absolute", left: "5%", bottom: "4%", color: signal, fontSize: Math.max(8, screenWidth * 0.014), fontWeight: 700 } }, "1UP 000060"),
      /* @__PURE__ */ h("div", { style: { position: "absolute", right: "5%", bottom: "4%", color: "#F7FAFC", fontSize: Math.max(8, screenWidth * 0.014), fontWeight: 700 } }, "HI 005000"),
      /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.18, background: \`repeating-linear-gradient(0deg, transparent 0, transparent \${pixelScale - 1}px, \${signal} \${pixelScale}px)\` } })
    ));
  }
};
var K08_insert_coin_effect_default = kernel;
`;export{e as default};
