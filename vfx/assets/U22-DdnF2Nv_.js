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
var U22_file_upload_effect_exports = {};
__export(U22_file_upload_effect_exports, {
  default: () => U22_file_upload_effect_default
});
module.exports = __toCommonJS(U22_file_upload_effect_exports);
const clamp = (value) => Math.max(0, Math.min(1, value));
const smooth = (value) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};
const kernel = {
  kind: "react",
  render: (ctx) => {
    const fileCount = Math.max(1, Math.min(3, Math.round(Number(ctx.params.files ?? 2))));
    const cycles = Math.max(1, Math.min(2, Math.round(Number(ctx.params.cycles ?? 1))));
    const drop = Math.max(0.5, Math.min(1.4, Number(ctx.params.drop ?? 0.92)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * cycles % 1;
    const arrival = smooth(phase / 0.25);
    const progress = smooth((phase - 0.23) / 0.48);
    const done = smooth((phase - 0.72) / 0.12);
    const fade = 1 - smooth((phase - 0.9) / 0.1);
    const panelWidth = Math.min(ctx.width * 0.64, ctx.height * 1.08);
    const panelHeight = Math.min(ctx.height * 0.62, panelWidth * 0.62);
    const bounce = Math.sin(arrival * Math.PI * 2.5) * (1 - arrival) * 14 * drop;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F4FAFB", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.09 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: "51%", width: panelWidth, height: panelHeight, transform: \`translate(-50%, -50%) scale(\${0.96 + arrival * 0.04})\`, opacity: fade, border: \`1px dashed \${done > 0.5 ? signal : "#657179"}\`, borderRadius: 14, background: "#14181BEF", boxShadow: \`0 22px 55px #00000099, inset 0 0 30px \${signal}0D\` } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: "7%", right: "7%", top: "8%", display: "flex", justifyContent: "space-between", color: "#AAB8BD", fontSize: Math.max(7, ctx.width * 9e-3), letterSpacing: "0.12em" } }, /* @__PURE__ */ h("span", null, "DEXA VFX DROPZONE"), /* @__PURE__ */ h("span", null, done > 0.5 ? "VERIFIED" : "READY")), Array.from({ length: fileCount }, (_, index) => {
      const stagger = smooth((arrival - index * 0.16) / Math.max(0.1, 1 - index * 0.16));
      const y = -panelHeight * 0.56 * (1 - stagger) + bounce * (1 - index * 0.16);
      return /* @__PURE__ */ h("div", { key: index, "data-layout-allow-overlap": true, "data-layout-allow-occlusion": true, style: { position: "absolute", left: \`\${16 + index * 12}%\`, top: \`\${27 + index * 5}%\`, width: "68%", height: "18%", transform: \`translateY(\${y}px) rotate(\${(index - 1) * 1.6 * (1 - stagger)}deg)\`, opacity: stagger, border: \`1px solid \${index === 0 ? signal : "#445058"}\`, borderRadius: 8, background: "#1A2024", boxShadow: "0 8px 18px #00000078" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: "4%", top: "22%", width: "10%", bottom: "22%", borderRadius: 4, background: \`\${signal}24\`, color: signal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: Math.max(8, ctx.width * 0.012) } }, "\\u2191"), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "18%", top: "24%", color: "#FFFFFF", fontSize: Math.max(7, ctx.width * 95e-4) } }, index === 0 ? "DEXA_VFX.PACK" : \`SIGNAL_0\${index}.FX\`), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "18%", right: "5%", bottom: "23%", height: 4, borderRadius: 4, background: "#354047", overflow: "hidden" } }, /* @__PURE__ */ h("div", { style: { width: \`\${progress * 100}%\`, height: "100%", background: signal, boxShadow: \`0 0 8px \${signal}\` } })));
    }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", bottom: "7%", transform: \`translateX(-50%) scale(\${0.7 + done * 0.3})\`, width: Math.max(24, panelHeight * 0.12), height: Math.max(24, panelHeight * 0.12), borderRadius: "50%", border: \`2px solid \${signal}\`, color: signal, display: "flex", alignItems: "center", justifyContent: "center", opacity: done, boxShadow: \`0 0 22px \${signal}66\`, fontSize: Math.max(13, panelHeight * 0.07) } }, "\\u2713")));
  }
};
var U22_file_upload_effect_default = kernel;
`;export{e as default};
