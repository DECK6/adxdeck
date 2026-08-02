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
var C13_snap_zoom_chain_effect_exports = {};
__export(C13_snap_zoom_chain_effect_exports, {
  default: () => C13_snap_zoom_chain_effect_default
});
module.exports = __toCommonJS(C13_snap_zoom_chain_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const steps = Math.round(Number(ctx.params.steps ?? 5));
    const range = Number(ctx.params.range ?? 0.48);
    const shake = Number(ctx.params.shake ?? 7);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const beat = ctx.t * steps;
    const index = Math.floor(beat) % steps;
    const local = beat - Math.floor(beat);
    const punch = Math.pow(1 - local, 4);
    const direction = index % 2 ? -1 : 1;
    const scale = 1 + direction * range * (index + 1) / steps + punch * range * 0.22;
    const offset = punch * shake * direction;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "-12%", opacity: 0.12, backgroundImage: \`linear-gradient(\${signal} 1px,transparent 1px),linear-gradient(90deg,\${signal} 1px,transparent 1px)\`, backgroundSize: "64px 64px", transform: \`scale(\${scale * 0.84}) translate(\${offset}px,\${-offset * 0.5}px)\` } }), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center", transform: \`translate3d(\${offset}px,\${-offset * 0.45}px,0) scale(\${scale})\`, filter: \`blur(\${punch * 1.8}px) drop-shadow(0 0 12px \${signal})\` } }, ctx.subjectNode), Array.from({ length: steps }, (_, i) => /* @__PURE__ */ h("div", { key: i, style: { position: "absolute", left: \`\${12 + i * 76 / Math.max(1, steps - 1)}%\`, bottom: "8%", width: i === index ? 30 : 8, height: 3, background: signal, opacity: i === index ? 0.9 : 0.22 } })));
  }
};
var C13_snap_zoom_chain_effect_default = kernel;
`;export{e as default};
