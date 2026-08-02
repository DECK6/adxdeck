const t=`var __defProp = Object.defineProperty;
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
var U14_stepper_flow_effect_exports = {};
__export(U14_stepper_flow_effect_exports, {
  default: () => U14_stepper_flow_effect_default
});
module.exports = __toCommonJS(U14_stepper_flow_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const stepCount = Math.min(6, Math.max(3, Math.round(Number(ctx.params.steps ?? 5))));
    const cycles = Math.min(3, Math.max(1, Math.round(Number(ctx.params.cycles ?? 1))));
    const direction = String(ctx.params.direction ?? "horizontal");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * cycles % 1;
    const forward = phase < 0.82 ? phase / 0.82 : 1 - (phase - 0.82) / 0.18;
    const progress = clamp01(forward) * (stepCount - 1);
    const horizontal = direction === "horizontal";
    const labels = ["BRIEF", "BUILD", "CHECK", "RENDER", "DELIVER", "LIVE"];
    const span = horizontal ? Math.min(ctx.width * 0.72, ctx.height * 1.32) : Math.min(ctx.height * 0.68, ctx.width * 0.72);
    const node = Math.max(34, Math.min(ctx.width, ctx.height) * 0.09);
    const startX = horizontal ? (ctx.width - span) * 0.5 : ctx.width * 0.5;
    const startY = horizontal ? ctx.height * 0.48 : (ctx.height - span) * 0.5;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F6FAFC", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.09, transform: "scale(0.88)" } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: horizontal ? startX + node * 0.5 : startX - 2,
          top: horizontal ? startY + node * 0.5 - 2 : startY + node * 0.5,
          width: horizontal ? span - node : 4,
          height: horizontal ? 4 : span - node,
          borderRadius: 999,
          background: "#30363D"
        }
      },
      /* @__PURE__ */ h("div", { style: { width: horizontal ? \`\${progress / (stepCount - 1) * 100}%\` : "100%", height: horizontal ? "100%" : \`\${progress / (stepCount - 1) * 100}%\`, borderRadius: 999, background: signal, boxShadow: \`0 0 14px \${signal}\` } })
    ), Array.from({ length: stepCount }, (_, index) => {
      const x = horizontal ? startX + index / (stepCount - 1) * (span - node) : startX - node * 0.5;
      const y = horizontal ? startY : startY + index / (stepCount - 1) * (span - node);
      const local = clamp01(progress - index + 1);
      const complete = progress >= index + 0.75;
      const active = Math.max(0, 1 - Math.abs(progress - index));
      return /* @__PURE__ */ h("div", { key: index, style: { position: "absolute", left: x, top: y, width: node, height: node } }, /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            boxSizing: "border-box",
            border: \`2px solid \${local > 0.2 ? signal : "#4B535C"}\`,
            background: complete ? signal : "#15191D",
            color: complete ? "#071113" : local > 0.2 ? "#F5FAFC" : "#AAB4BB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: node * 0.29,
            fontWeight: 800,
            transform: \`scale(\${1 + active * 0.14})\`,
            boxShadow: active > 0.2 ? \`0 0 \${node * 0.5}px \${signal}66\` : "0 7px 18px #00000080"
          }
        },
        complete ? "\\u2713" : String(index + 1).padStart(2, "0")
      ), /* @__PURE__ */ h("div", { style: { position: "absolute", left: horizontal ? "50%" : node * 1.35, top: horizontal ? node * 1.3 : "50%", transform: horizontal ? "translateX(-50%)" : "translateY(-50%)", color: local > 0.2 ? "#F5FAFC" : "#919BA2", fontSize: Math.max(7, node * 0.2), fontWeight: 700, letterSpacing: "0.08em", whiteSpace: "nowrap" } }, labels[index]));
    }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", bottom: "11%", transform: "translateX(-50%)", color: signal, fontSize: Math.max(8, ctx.width * 0.011), letterSpacing: "0.14em" } }, "DEXA VFX / FLOW ", String(Math.min(stepCount, Math.floor(progress) + 1)).padStart(2, "0")));
  }
};
var U14_stepper_flow_effect_default = kernel;
`;export{t as default};
