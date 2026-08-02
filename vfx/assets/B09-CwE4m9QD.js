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
var B09_news_ticker_effect_exports = {};
__export(B09_news_ticker_effect_exports, {
  default: () => B09_news_ticker_effect_default
});
module.exports = __toCommonJS(B09_news_ticker_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const speed = Number(ctx.params.speed ?? 1);
    const density = Math.round(Number(ctx.params.density ?? 4));
    const edition = String(ctx.params.edition ?? "NEWS");
    const breaking = Boolean(ctx.params.breaking ?? true);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const stories = [
      "DEXA VFX SIGNAL DESK IS NOW ONLINE",
      "REAL-TIME MOTION SYSTEMS REPORT NOMINAL",
      "NEW FRAMES ARRIVING FROM THE DEXA LAB",
      "CREATIVE NETWORK EXPANDS ACROSS THE GRID",
      "BROADCAST PACKAGE LOCKED TO MASTER CLOCK"
    ].slice(0, density);
    const intro = clamp01(ctx.t / 0.1);
    const outro = clamp01((1 - ctx.t) / 0.08);
    const beltWidth = Math.max(1, ctx.width * Math.max(1.8, stories.length * 0.7));
    const travel = ctx.t * speed * beltWidth * 1.6 % beltWidth;
    const flash = breaking ? 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(ctx.t * Math.PI * 12)) : 1;
    const fontSize = Math.max(9, ctx.height * 0.044);
    const beltTop = ctx.height * 0.76;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.1 * outro } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        "data-layout-allow-overlap": true,
        "data-layout-allow-occlusion": true,
        style: {
          position: "absolute",
          left: "5%",
          top: "9%",
          color: "#F4F7F8",
          fontSize: Math.max(8, ctx.height * 0.027),
          letterSpacing: "0.22em",
          opacity: intro * outro * 0.72
        }
      },
      "DEXA // ",
      edition,
      " NETWORK"
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          top: beltTop - 2,
          height: 2,
          background: signal,
          transform: \`scaleX(\${intro})\`,
          transformOrigin: "left",
          boxShadow: \`0 0 16px \${signal}\`,
          opacity: outro
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          top: beltTop,
          height: ctx.height * 0.14,
          background: "#15181CFA",
          color: "#F4F7F8",
          transform: \`translateY(\${(1 - intro) * ctx.height * 0.16}px)\`,
          opacity: outro,
          overflow: "hidden"
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          "data-layout-allow-overlap": true,
          "data-layout-allow-overflow": true,
          "data-layout-allow-occlusion": true,
          style: {
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: ctx.width * 0.205,
            display: "grid",
            placeItems: "center",
            background: signal,
            color: "#071012",
            fontSize,
            fontWeight: 900,
            letterSpacing: "0.08em",
            opacity: flash,
            zIndex: 2
          }
        },
        breaking ? "BREAKING" : edition
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: ctx.width * 0.205,
            right: 0,
            top: 0,
            bottom: 0,
            overflow: "hidden"
          }
        },
        [0, 1].map((copy) => /* @__PURE__ */ h(
          "div",
          {
            key: copy,
            "data-layout-allow-overflow": true,
            "data-layout-allow-occlusion": true,
            style: {
              position: "absolute",
              left: copy * beltWidth - travel,
              top: 0,
              height: "100%",
              width: beltWidth,
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              fontSize,
              fontWeight: 650
            }
          },
          stories.map((story, index) => /* @__PURE__ */ h("div", { key: story, style: { display: "flex", alignItems: "center", color: "#FFFFFF", background: "#15181C" } }, /* @__PURE__ */ h("span", { style: { width: 7, height: 7, margin: "0 1.4em", background: signal, transform: "rotate(45deg)", flex: "0 0 auto" } }), /* @__PURE__ */ h("span", null, String(index + 1).padStart(2, "0"), " / ", story)))
        ))
      )
    ));
  }
};
var B09_news_ticker_effect_default = kernel;
`;export{n as default};
