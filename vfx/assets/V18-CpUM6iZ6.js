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
var V18_gantt_timeline_effect_exports = {};
__export(V18_gantt_timeline_effect_exports, {
  default: () => V18_gantt_timeline_effect_default
});
module.exports = __toCommonJS(V18_gantt_timeline_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const taskCount = Math.max(4, Math.min(7, Math.round(Number(ctx.params.tasks ?? 6))));
    const days = Math.max(7, Math.min(14, Math.round(Number(ctx.params.density ?? 10))));
    const completion = Math.max(0.2, Math.min(1, Number(ctx.params.progress ?? 0.68)));
    const pace = Math.max(0.6, Math.min(1.6, Number(ctx.params.pace ?? 1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * pace % 1;
    const sweep = 0.5 - Math.cos(phase * Math.PI * 2) * 0.5;
    const tasks = ["DISCOVERY", "DESIGN", "PROTOTYPE", "MOTION", "RENDER", "REVIEW", "DELIVERY"];
    const layouts = Array.from({ length: taskCount }, (_, index) => {
      const start = Math.min(days - 3, Math.round(index / Math.max(1, taskCount - 1) * (days - 4)));
      const maxDuration = Math.max(2, days - start);
      const duration = Math.min(maxDuration, 2 + Math.round(ctx.random(\`task:\${index}:duration\`) * Math.min(4, maxDuration - 1)));
      return { start, duration };
    });
    const today = 0.8 + sweep * (days - 1.6);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F7FAFC", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "20%", opacity: 0.08 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "6%", right: "6%", top: "8%", bottom: "8%", border: "1px solid #F7FAFC24", background: "#111316E8" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, top: 0, width: "23%", height: "15%", borderRight: "1px solid #F7FAFC24", borderBottom: "1px solid #F7FAFC24", display: "flex", alignItems: "center", paddingLeft: "3%", boxSizing: "border-box", color: signal, fontSize: Math.max(9, ctx.width * 0.011), fontWeight: 800, letterSpacing: "0.14em" } }, "DEXA / PLAN 06"), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "23%", right: 0, top: 0, height: "15%", borderBottom: "1px solid #F7FAFC24" } }, Array.from({ length: days }, (_, index) => /* @__PURE__ */ h("div", { key: index, style: { position: "absolute", left: \`\${index / days * 100}%\`, top: 0, width: \`\${100 / days}%\`, height: "100%", borderRight: "1px solid #F7FAFC1A", display: "flex", alignItems: "center", justifyContent: "center", color: "#C5CDD2", fontSize: Math.max(8, ctx.width * 9e-3), fontWeight: 600 } }, String(index + 1).padStart(2, "0")))), /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, right: 0, top: "15%", bottom: 0 } }, Array.from({ length: taskCount }, (_, index) => {
      const layout = layouts[index];
      const local = Math.max(0, Math.min(1, sweep * (taskCount + 1) - index * 0.68));
      const rowTop = index / taskCount * 100;
      const taskCompletion = Math.max(0.08, Math.min(1, completion - index * 0.07));
      return /* @__PURE__ */ h("div", { key: index, style: { position: "absolute", left: 0, right: 0, top: \`\${rowTop}%\`, height: \`\${100 / taskCount}%\`, borderBottom: "1px solid #F7FAFC14" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, top: 0, bottom: 0, width: "23%", borderRight: "1px solid #F7FAFC24", display: "flex", alignItems: "center", paddingLeft: "3%", boxSizing: "border-box", color: "#D7DDE1", fontSize: Math.max(8, ctx.width * 0.01), fontWeight: 700, letterSpacing: "0.08em" } }, String(index + 1).padStart(2, "0"), " ", tasks[index]), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "23%", right: 0, top: 0, bottom: 0 } }, Array.from({ length: days }, (_2, day) => /* @__PURE__ */ h("div", { key: day, style: { position: "absolute", left: \`\${day / days * 100}%\`, top: 0, bottom: 0, width: 1, background: "#F7FAFC12" } })), /* @__PURE__ */ h("div", { style: { position: "absolute", left: \`\${layout.start / days * 100}%\`, top: "28%", width: \`\${layout.duration / days * 100 * local}%\`, height: "44%", border: \`1px solid \${signal}\`, boxSizing: "border-box", background: "#1B2B30", overflow: "hidden", boxShadow: local > 0.9 ? \`0 0 10px \${signal}28\` : "none" } }, /* @__PURE__ */ h("div", { style: { width: \`\${taskCompletion * 100}%\`, height: "100%", background: signal, opacity: 0.7 } })), index < taskCount - 1 && local > 0.85 ? /* @__PURE__ */ h("div", { style: { position: "absolute", left: \`\${(layout.start + layout.duration) / days * 100}%\`, top: "72%", width: \`\${Math.max(0, (layouts[index + 1].start - layout.start - layout.duration) / days) * 100}%\`, height: "52%", borderRight: \`1px solid \${signal}\`, borderBottom: \`1px solid \${signal}\`, opacity: 0.44 } }) : null));
    }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: \`calc(23% + \${today / days * 77}%)\`, top: 0, bottom: 0, width: 2, background: "#FF6B5F", boxShadow: "0 0 10px #FF6B5F" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", top: -1, left: "50%", padding: "3px 7px", color: "#0D0E10", background: "#FF6B5F", fontSize: Math.max(7, ctx.width * 8e-3), fontWeight: 900, transform: "translate(-50%, -100%)" } }, "TODAY")))));
  }
};
var V18_gantt_timeline_effect_default = kernel;
`;export{t as default};
