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
var U26_window_manage_effect_exports = {};
__export(U26_window_manage_effect_exports, {
  default: () => U26_window_manage_effect_default
});
module.exports = __toCommonJS(U26_window_manage_effect_exports);
const clamp = (value) => Math.max(0, Math.min(1, value));
const smooth = (value) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};
const mix = (from, to, amount) => from + (to - from) * amount;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const windowCount = Math.max(2, Math.min(4, Math.round(Number(ctx.params.windows ?? 3))));
    const cycles = Math.max(1, Math.min(2, Math.round(Number(ctx.params.cycles ?? 1))));
    const gap = Math.max(4, Math.min(18, Number(ctx.params.gap ?? 10)));
    const spring = Math.max(0.2, Math.min(1, Number(ctx.params.spring ?? 0.62)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * cycles % 1;
    const open = smooth(phase / 0.18);
    const snap = smooth((phase - 0.2) / 0.25);
    const minimize = smooth((phase - 0.68) / 0.2);
    const restore = smooth((phase - 0.9) / 0.1);
    const desktopLeft = ctx.width * 0.11;
    const desktopTop = ctx.height * 0.14;
    const desktopWidth = ctx.width * 0.78;
    const desktopHeight = ctx.height * 0.66;
    const columns = windowCount === 2 ? 2 : 2;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F4FAFB", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.08 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: desktopLeft, top: desktopTop, width: desktopWidth, height: desktopHeight, border: "1px solid #465158", borderRadius: 12, background: "#111518CC", boxShadow: "0 22px 60px #00000099", overflow: "hidden" } }, /* @__PURE__ */ h("div", { style: { height: "8%", borderBottom: "1px solid #394248", display: "flex", alignItems: "center", padding: "0 2.5%", gap: 6 } }, [signal, "#68747A", "#68747A"].map((color, index) => /* @__PURE__ */ h("div", { key: index, style: { width: 6, height: 6, borderRadius: "50%", background: color } })), /* @__PURE__ */ h("span", { style: { marginLeft: "auto", color: "#839197", fontSize: Math.max(7, ctx.width * 8e-3), letterSpacing: "0.12em" } }, "DEXA DESKTOP")), Array.from({ length: windowCount }, (_, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      const targetWidth = windowCount === 3 && index === 2 ? desktopWidth - gap * 2 : (desktopWidth - gap * 3) / 2;
      const targetHeight = (desktopHeight * 0.92 - gap * 3) / 2;
      const targetX = windowCount === 3 && index === 2 ? gap : gap + column * (targetWidth + gap);
      const targetY = desktopHeight * 0.08 + gap + row * (targetHeight + gap);
      const stackWidth = desktopWidth * 0.58;
      const stackHeight = desktopHeight * 0.58;
      const stackX = desktopWidth * 0.21 + index * gap * 0.55;
      const stackY = desktopHeight * 0.16 + index * gap * 0.7;
      const x = mix(stackX, targetX, snap);
      const y = mix(stackY, targetY, snap);
      const width = mix(stackWidth, targetWidth, snap);
      const height = mix(stackHeight, targetHeight, snap);
      const activeMinimize = index === 1 ? minimize * (1 - restore) : 0;
      const bounce = Math.sin(open * Math.PI * 2.5) * (1 - open) * spring;
      return /* @__PURE__ */ h("div", { key: index, "data-layout-allow-overlap": true, "data-layout-allow-occlusion": true, style: { position: "absolute", left: x, top: y, width, height, transform: \`translate(\${activeMinimize * (desktopWidth * 0.42 - x)}px, \${activeMinimize * (desktopHeight * 0.87 - y)}px) scale(\${(0.45 + open * 0.55 + bounce * 0.06) * (1 - activeMinimize * 0.86)})\`, transformOrigin: "top left", opacity: open * (1 - activeMinimize * 0.55), border: \`1px solid \${index === 0 ? signal : "#526068"}\`, borderRadius: 8, background: index === 0 ? "#17272D" : "#192025", boxShadow: \`0 \${8 + index * 3}px \${18 + index * 5}px #00000088\`, zIndex: windowCount - index, overflow: "hidden" } }, /* @__PURE__ */ h("div", { style: { height: 22, borderBottom: "1px solid #FFFFFF1F", display: "flex", alignItems: "center", padding: "0 8px", color: index === 0 ? signal : "#A6B2B7", fontSize: Math.max(6, ctx.width * 75e-4), letterSpacing: "0.09em" } }, "DEXA / ", ["COMPOSE", "ASSETS", "OUTPUT", "SIGNAL"][index]), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", right: "8%", top: "36%", height: 5, borderRadius: 4, background: index === 0 ? signal : "#6C797E", opacity: 0.7 } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", width: "48%", top: "57%", height: 5, borderRadius: 4, background: "#DBE5E866", opacity: 0.7 } }));
    }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "40%", right: "40%", bottom: "1.2%", height: 5, borderRadius: 6, background: signal, opacity: minimize * (1 - restore), boxShadow: \`0 0 12px \${signal}\` } })));
  }
};
var U26_window_manage_effect_default = kernel;
`;export{t as default};
