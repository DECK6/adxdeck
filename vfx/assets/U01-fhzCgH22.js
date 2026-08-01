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
var U01_terminal_boot_effect_exports = {};
__export(U01_terminal_boot_effect_exports, {
  default: () => U01_terminal_boot_effect_default
});
module.exports = __toCommonJS(U01_terminal_boot_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const speed = Number(ctx.params.speed ?? 1);
    const lineCount = Math.round(Number(ctx.params.lines ?? 6));
    const cursor = Boolean(ctx.params.cursor ?? true);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const messages = [
      "DEXA BIOS 06.30",
      "MEMORY ........ OK",
      "SIGNAL BUS .... ONLINE",
      "LOADING VFX KERNEL",
      "MOUNT /SUBJECT . READY",
      "SYSTEM STATUS . NOMINAL",
      "WELCOME, OPERATOR"
    ];
    const visible = Math.min(lineCount, Math.floor(ctx.t * 13 * speed));
    const ready = Math.min(1, visible / Math.max(1, lineCount));
    const blink = Math.floor(ctx.frame / Math.max(1, Math.round(ctx.fps * 0.45))) % 2 === 0;
    const outro = Math.min(1, Math.max(0, (1 - ctx.t) / 0.1));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          opacity: ready * 0.72 * outro,
          transform: \`translate3d(\${(1 - ready) * ctx.width * 0.04}px, 0, 0) scale(\${0.97 + ready * 0.03})\`,
          filter: \`contrast(\${1 + ready * 0.25})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "5%",
          top: "7%",
          width: "48%",
          minHeight: "46%",
          padding: "3%",
          border: \`1px solid \${signal}55\`,
          background: "#0D0E10E8",
          boxShadow: \`0 0 24px \${signal}12\`,
          color: "#8A8D93",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: Math.max(7, ctx.width * 0.014),
          lineHeight: 1.55,
          opacity: outro
        }
      },
      messages.slice(0, lineCount).map((message, index) => /* @__PURE__ */ h(
        "div",
        {
          key: message,
          style: {
            opacity: index < visible ? 1 : 0,
            color: index === visible - 1 ? signal : "#A8ACB3",
            whiteSpace: "nowrap"
          }
        },
        /* @__PURE__ */ h("span", { style: { color: signal, marginRight: "0.6em" } }, ">"),
        message
      )),
      /* @__PURE__ */ h("div", { style: { marginTop: "0.55em", color: signal, opacity: visible > 0 ? 1 : 0 } }, /* @__PURE__ */ h("span", { style: { marginRight: "0.6em" } }, "$"), ready >= 1 ? "run subject" : "boot --safe", cursor && blink ? /* @__PURE__ */ h("span", { style: { marginLeft: "0.3em" } }, "\\u2588") : null)
    ));
  }
};
var U01_terminal_boot_effect_default = kernel;
`;export{n as default};
