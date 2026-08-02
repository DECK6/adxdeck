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
var I05_wireframe_globe_effect_exports = {};
__export(I05_wireframe_globe_effect_exports, {
  default: () => I05_wireframe_globe_effect_default
});
module.exports = __toCommonJS(I05_wireframe_globe_effect_exports);
const MARKERS = [
  { lat: -0.42, lon: 0.18 },
  { lat: 0.16, lon: 1.25 },
  { lat: 0.52, lon: 2.72 },
  { lat: -0.08, lon: 4.08 },
  { lat: 0.31, lon: 5.34 }
];
const kernel = {
  kind: "react",
  render: (ctx) => {
    const grid = Math.min(12, Math.max(5, Math.round(Number(ctx.params.grid ?? 8))));
    const sizeRatio = Math.min(0.7, Math.max(0.34, Number(ctx.params.size ?? 0.54)));
    const turns = Math.max(1, Math.round(Number(ctx.params.turns ?? 1)));
    const markerSize = Math.min(12, Math.max(3, Number(ctx.params.markerSize ?? 6)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const diameter = Math.min(ctx.width * sizeRatio, ctx.height * sizeRatio * 1.65);
    const radius = diameter / 2;
    const phase = ctx.t * Math.PI * 2 * turns;
    return /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          display: "grid",
          placeItems: "center",
          background: "#0D0E10",
          perspective: ctx.width * 1.8
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "relative",
            width: diameter,
            height: diameter,
            border: \`1px solid \${signal}\`,
            borderRadius: "50%",
            transformStyle: "preserve-3d",
            transform: \`rotateX(-16deg) rotateY(\${phase}rad)\`,
            boxShadow: \`inset 0 0 \${diameter * 0.18}px \${signal}1f, 0 0 \${diameter * 0.11}px \${signal}35\`
          }
        },
        Array.from({ length: grid }, (_, index) => {
          const angle = index / grid * 180;
          return /* @__PURE__ */ h(
            "div",
            {
              key: \`lon:\${index}\`,
              style: {
                position: "absolute",
                inset: -1,
                border: \`1px solid \${signal}\`,
                borderRadius: "50%",
                opacity: 0.38,
                transform: \`rotateY(\${angle}deg)\`
              }
            }
          );
        }),
        Array.from({ length: grid - 1 }, (_, index) => {
          const latitude = -Math.PI / 2 + (index + 1) / grid * Math.PI;
          const ringSize = diameter * Math.cos(latitude);
          const y = radius * Math.sin(latitude);
          return /* @__PURE__ */ h(
            "div",
            {
              key: \`lat:\${index}\`,
              style: {
                position: "absolute",
                left: "50%",
                top: "50%",
                width: ringSize,
                height: ringSize,
                border: \`1px solid \${signal}\`,
                borderRadius: "50%",
                opacity: 0.34,
                transform: \`translate(-50%, -50%) translateY(\${y}px) rotateX(90deg)\`
              }
            }
          );
        }),
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              inset: "19%",
              opacity: 0.13,
              transform: "translateZ(0px)",
              overflow: "hidden",
              borderRadius: "50%"
            }
          },
          ctx.subjectNode
        ),
        MARKERS.map((marker, index) => {
          const horizontal = Math.cos(marker.lat) * radius;
          const x = Math.sin(marker.lon) * horizontal;
          const y = -Math.sin(marker.lat) * radius;
          const z = Math.cos(marker.lon) * horizontal;
          return /* @__PURE__ */ h(
            "div",
            {
              key: index,
              style: {
                position: "absolute",
                left: "50%",
                top: "50%",
                width: markerSize,
                height: markerSize,
                borderRadius: "50%",
                background: signal,
                transform: \`translate3d(\${x - markerSize / 2}px, \${y - markerSize / 2}px, \${z}px)\`,
                boxShadow: \`0 0 \${markerSize * 2.6}px \${signal}\`
              }
            }
          );
        })
      )
    );
  }
};
var I05_wireframe_globe_effect_default = kernel;
`;export{n as default};
