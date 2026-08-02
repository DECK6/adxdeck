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
var Z08_ticker_marquee_effect_exports = {};
__export(Z08_ticker_marquee_effect_exports, {
  default: () => Z08_ticker_marquee_effect_default
});
module.exports = __toCommonJS(Z08_ticker_marquee_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const message = String(ctx.params.message ?? "DEXA SIGNAL ONLINE");
    const speed = Math.min(4, Math.max(1, Math.round(Number(ctx.params.speed ?? 2))));
    const dotPitch = Math.min(8, Math.max(3, Math.round(Number(ctx.params.dotPitch ?? 5))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const travel = ctx.t * speed % 1;
    const group = Array.from({ length: 4 }, (_, index) => /* @__PURE__ */ h("span", { key: index, style: { display: "inline-flex", alignItems: "center", flex: "0 0 auto", paddingRight: "2.8em" } }, /* @__PURE__ */ h("span", { style: { color: signal, marginRight: "0.65em" } }, "\\u25C6"), message));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.18, filter: \`contrast(1.15) drop-shadow(0 0 12px \${signal}33)\` } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "-3%",
          right: "-3%",
          top: "50%",
          height: "34%",
          transform: "translateY(-50%) perspective(700px) rotateX(3deg)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          background: "#050607F2",
          borderTop: \`2px solid \${signal}55\`,
          borderBottom: \`2px solid \${signal}55\`,
          boxShadow: \`inset 0 0 30px \${signal}14, 0 0 24px #000000CC\`
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            display: "flex",
            width: "max-content",
            flex: "0 0 auto",
            transform: \`translate3d(\${-50 * travel}%, 0, 0)\`,
            color: signal,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: Math.max(19, Math.min(ctx.width * 0.085, ctx.height * 0.25)),
            fontWeight: 800,
            letterSpacing: "0.12em",
            lineHeight: 1,
            whiteSpace: "nowrap",
            textShadow: \`0 0 7px \${signal}, 0 0 22px \${signal}99\`,
            maskImage: \`radial-gradient(circle, #000 0 \${Math.max(1, dotPitch * 0.32)}px, transparent \${Math.max(1.5, dotPitch * 0.46)}px)\`,
            WebkitMaskImage: \`radial-gradient(circle, #000 0 \${Math.max(1, dotPitch * 0.32)}px, transparent \${Math.max(1.5, dotPitch * 0.46)}px)\`,
            maskSize: \`\${dotPitch}px \${dotPitch}px\`,
            WebkitMaskSize: \`\${dotPitch}px \${dotPitch}px\`
          }
        },
        /* @__PURE__ */ h("div", { style: { display: "flex", flex: "0 0 auto" } }, group),
        /* @__PURE__ */ h("div", { style: { display: "flex", flex: "0 0 auto" } }, group)
      )
    ));
  }
};
var Z08_ticker_marquee_effect_default = kernel;
`;export{e as default};
