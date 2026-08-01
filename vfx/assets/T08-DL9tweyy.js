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
var T08_text_path_flow_effect_exports = {};
__export(T08_text_path_flow_effect_exports, {
  default: () => T08_text_path_flow_effect_default
});
module.exports = __toCommonJS(T08_text_path_flow_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? "DEXA / MOTION /");
    const speed = Math.max(1, Math.round(Number(ctx.params.speed ?? 1)));
    const curve = Number(ctx.params.curve ?? 0.68);
    const direction = String(ctx.params.direction ?? "clockwise") === "counter" ? -1 : 1;
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const cycle = ctx.frame % duration / duration;
    const phase = direction * cycle * Math.PI * 2 * speed;
    const rx = 375;
    const ry = 235 * curve;
    const pathId = \`t08-path-\${Math.floor(ctx.random("path-id") * 1e9)}\`;
    const path = \`M \${500 - rx} 300 a \${rx} \${ry} 0 1 1 \${rx * 2} 0 a \${rx} \${ry} 0 1 1 \${-rx * 2} 0\`;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.08 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "svg",
      {
        viewBox: "0 0 1000 600",
        preserveAspectRatio: "xMidYMid meet",
        style: { position: "absolute", inset: "4%", width: "92%", height: "92%", overflow: "visible" }
      },
      /* @__PURE__ */ h("defs", null, /* @__PURE__ */ h("path", { id: pathId, d: path })),
      /* @__PURE__ */ h("path", { d: path, fill: "none", stroke: signal, strokeWidth: "2", opacity: "0.22" }),
      [0, 1, 2, 3].map((index) => {
        const offset = ((direction * cycle * speed + index * 0.25) % 1 + 1) % 1;
        return /* @__PURE__ */ h(
          "text",
          {
            key: index,
            fill: index % 2 === 0 ? signal : "#E7EBEF",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "42",
            fontWeight: "750",
            letterSpacing: "3",
            opacity: index % 2 === 0 ? 1 : 0.68,
            style: { filter: index === 0 ? \`drop-shadow(0 0 10px \${signal})\` : void 0 }
          },
          /* @__PURE__ */ h("textPath", { href: \`#\${pathId}\`, startOffset: \`\${offset * 100}%\` }, phrase)
        );
      }),
      [0, Math.PI].map((headOffset, index) => {
        const angle = phase + headOffset;
        const x = 500 - rx * Math.cos(angle);
        const y = 300 - ry * Math.sin(angle);
        return /* @__PURE__ */ h("g", { key: index, transform: \`translate(\${x} \${y})\` }, /* @__PURE__ */ h("circle", { r: "13", fill: signal, opacity: index === 0 ? 1 : 0.58 }), /* @__PURE__ */ h("circle", { r: "25", fill: "none", stroke: signal, strokeWidth: "2", opacity: "0.35" }));
      })
    ));
  }
};
var T08_text_path_flow_effect_default = kernel;
`;export{e as default};
