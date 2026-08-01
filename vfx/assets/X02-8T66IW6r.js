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
var X02_slice_shuffle_effect_exports = {};
__export(X02_slice_shuffle_effect_exports, {
  default: () => X02_slice_shuffle_effect_default
});
module.exports = __toCommonJS(X02_slice_shuffle_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const slices = Math.max(4, Math.round(Number(ctx.params.slices ?? 10)));
    const stagger = Number(ctx.params.stagger ?? 0.46);
    const travel = Number(ctx.params.travel ?? 1.05);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const wave = Math.sin(Math.PI * ctx.t);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center" } }, ctx.subjectNode), Array.from({ length: slices }, (_, index) => {
      const rank = slices <= 1 ? 0 : index / (slices - 1);
      const delay = Math.abs(rank - 0.5) * 2 * stagger;
      const raw = Math.max(0, Math.min(1, (wave - delay) / Math.max(0.01, 1 - delay)));
      const progress = raw * raw * (3 - 2 * raw);
      const direction = index % 2 === 0 ? -1 : 1;
      const offset = direction * (1 - progress) * ctx.height * travel;
      const left = index / slices * 100;
      const width = 100 / slices + 0.12;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            clipPath: \`polygon(\${left}% 0, \${left + width}% 0, \${left + width}% 100%, \${left}% 100%)\`
          }
        },
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              background: "#F5F1E6",
              transform: \`translate3d(0, \${offset}px, 0)\`
            }
          },
          /* @__PURE__ */ h(
            "div",
            {
              style: {
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                filter: "grayscale(1) contrast(1.4) brightness(0.45)",
                mixBlendMode: "multiply"
              }
            },
            ctx.subjectNode
          ),
          /* @__PURE__ */ h(
            "div",
            {
              style: {
                position: "absolute",
                left: \`\${left + width * 0.18}%\`,
                top: index % 3 === 0 ? "14%" : "78%",
                width: \`\${Math.max(1.4, width * 0.14)}%\`,
                height: index % 3 === 0 ? "25%" : "12%",
                background: "#17181A",
                opacity: 0.82
              }
            }
          )
        ),
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              left: \`\${left}%\`,
              top: 0,
              bottom: 0,
              width: 2,
              background: signal,
              opacity: progress > 0.04 && progress < 0.96 ? 0.7 : 0,
              transform: \`translateY(\${offset}px)\`
            }
          }
        )
      );
    }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          right: 38,
          bottom: 30,
          color: signal,
          background: "rgba(13, 14, 16, 0.88)",
          padding: "4px 10px",
          fontFamily: "monospace",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.2em"
        }
      },
      "DEXA VFX / SHUFFLE"
    ));
  }
};
var X02_slice_shuffle_effect_default = kernel;
`;export{n as default};
