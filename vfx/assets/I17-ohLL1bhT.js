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
var I17_grid_wave_3d_effect_exports = {};
__export(I17_grid_wave_3d_effect_exports, {
  default: () => I17_grid_wave_3d_effect_default
});
module.exports = __toCommonJS(I17_grid_wave_3d_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const amplitude = Number(ctx.params.amplitude ?? 48);
    const density = Math.max(7, Math.min(13, Math.round(Number(ctx.params.density ?? 11)) | 1));
    const tilt = Number(ctx.params.tilt ?? 58);
    const speed = Math.max(1, Math.round(Number(ctx.params.speed ?? 2)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = TAU * speed * ctx.t;
    const unit = Math.min(ctx.width, ctx.height);
    const field = unit * 0.82;
    const gap = field / density;
    const tile = gap * 0.78;
    const center = (density - 1) / 2;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: field,
          height: field,
          marginLeft: -field / 2,
          marginTop: -field / 2,
          perspective: unit * 1.25,
          perspectiveOrigin: "50% 42%"
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transform: \`rotateX(\${tilt}deg) rotateZ(\${7 * Math.sin(phase)}deg)\`
          }
        },
        Array.from({ length: density * density }, (_, index) => {
          const x = index % density;
          const y = Math.floor(index / density);
          const dx = x - center;
          const dy = y - center;
          const radius = Math.hypot(dx, dy);
          const z = amplitude * Math.sin(radius * 1.55 - phase);
          const glow = 0.28 + 0.72 * (z / amplitude + 1) * 0.5;
          return /* @__PURE__ */ h(
            "div",
            {
              key: index,
              style: {
                position: "absolute",
                left: x * gap + (gap - tile) / 2,
                top: y * gap + (gap - tile) / 2,
                width: tile,
                height: tile,
                transform: \`translateZ(\${z}px)\`,
                border: \`1px solid \${signal}\`,
                background: \`linear-gradient(135deg, \${signal}\${z > 0 ? "44" : "12"}, #12171B)\`,
                boxShadow: \`0 0 \${3 + glow * 10}px \${signal}55\`,
                opacity: 0.28 + glow * 0.7
              }
            }
          );
        }),
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              left: "31%",
              top: "31%",
              width: "38%",
              height: "38%",
              transform: \`translateZ(\${amplitude + unit * 0.045}px) rotateX(\${-tilt}deg)\`,
              filter: \`drop-shadow(0 0 \${unit * 0.025}px \${signal}77)\`
            }
          },
          ctx.subjectNode
        )
      )
    ), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "6%", bottom: "6%", color: signal, fontFamily: "monospace", fontSize: unit * 0.018, letterSpacing: "0.18em", opacity: 0.72 } }, "Z FIELD / ", density, "\\xD7", density));
  }
};
var I17_grid_wave_3d_effect_default = kernel;
`;export{n as default};
