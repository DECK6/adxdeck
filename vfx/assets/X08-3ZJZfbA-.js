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
var X08_blinds_effect_exports = {};
__export(X08_blinds_effect_exports, {
  default: () => X08_blinds_effect_default
});
module.exports = __toCommonJS(X08_blinds_effect_exports);
const smoothstep = (value) => value * value * (3 - 2 * value);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const slats = Math.max(3, Math.round(Number(ctx.params.slats ?? 8)));
    const axis = String(ctx.params.axis ?? "horizontal");
    const gap = Number(ctx.params.gap ?? 2);
    const stagger = Number(ctx.params.stagger ?? 0.35);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const cycle = (1 - Math.cos(ctx.t * Math.PI * 2)) / 2;
    const horizontal = axis === "horizontal";
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.12, filter: "grayscale(1) brightness(0.4)" } }, ctx.subjectNode), Array.from({ length: slats }, (_, index) => {
      const delay = index / Math.max(1, slats - 1) * stagger * 0.65;
      const local = Math.max(0, Math.min(1, (cycle - delay) / Math.max(1e-3, 1 - delay)));
      const opening = smoothstep(local);
      const start = index / slats * 100;
      const size = 100 / slats;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: horizontal ? 0 : \`\${start}%\`,
            top: horizontal ? \`\${start}%\` : 0,
            width: horizontal ? "100%" : \`\${size}%\`,
            height: horizontal ? \`\${size}%\` : "100%",
            overflow: "hidden",
            borderColor: signal,
            borderStyle: "solid",
            borderWidth: horizontal ? \`\${gap / 2}px 0\` : \`0 \${gap / 2}px\`,
            boxSizing: "border-box",
            transform: horizontal ? \`scaleY(\${opening})\` : \`scaleX(\${opening})\`,
            transformOrigin: "center",
            boxShadow: opening > 0.02 ? \`0 0 \${gap + 4}px \${signal}\` : "none"
          }
        },
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              left: horizontal ? 0 : \`\${-index * 100}%\`,
              top: horizontal ? \`\${-index * 100}%\` : 0,
              width: horizontal ? "100%" : \`\${slats * 100}%\`,
              height: horizontal ? \`\${slats * 100}%\` : "100%"
            }
          },
          ctx.subjectNode
        )
      );
    }));
  }
};
var X08_blinds_effect_default = kernel;
`;export{n as default};
