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
var O23_stamp_slam_effect_exports = {};
__export(O23_stamp_slam_effect_exports, {
  default: () => O23_stamp_slam_effect_default
});
module.exports = __toCommonJS(O23_stamp_slam_effect_exports);
const TAU = Math.PI * 2;
const LEAD = 0.06;
const SPAN = 0.7;
const LIFT_END = 0.34;
const SLAM_END = 0.5;
const GROUND = 0.66;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const lift = Math.min(0.75, Math.max(0.15, Number(ctx.params.lift ?? 0.42)));
    const impact = Math.min(1, Math.max(0.2, Number(ctx.params.impact ?? 0.75)));
    const dust = Math.min(16, Math.max(6, Math.round(Number(ctx.params.dust ?? 11))));
    const cycles = Math.min(3, Math.max(2, Math.round(Number(ctx.params.cycles ?? 2))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const raw = (ctx.t * cycles % 1 - LEAD) / SPAN;
    const u = Math.min(1, Math.max(0, raw));
    const height = lift * ctx.height;
    const climb = Math.min(1, u / LIFT_END);
    const drop = u <= LIFT_END ? 0 : Math.min(1, (u - LIFT_END) / (SLAM_END - LIFT_END));
    const y = u <= LIFT_END ? -height * (1 - (1 - climb) * (1 - climb)) : -height * (1 - drop * drop);
    const landed = raw >= 0 && u > SLAM_END;
    const r = landed ? (u - SLAM_END) / (1 - SLAM_END) : 0;
    const rFrame = Math.max(cycles / (ctx.durationInFrames * SPAN * (1 - SLAM_END)), 2e-3);
    const strike = landed && r < rFrame * 1.5 ? 1 : 0;
    const scaleY = landed ? 1 - 0.22 * impact * Math.exp(-5.5 * r) * Math.cos(TAU * 1.5 * r) : 1 + 0.03 * climb + 0.13 * impact * drop;
    const scaleX = 1 + (1 - scaleY) * 0.6;
    const unit = Math.min(ctx.width, ctx.height);
    const shake = landed ? unit * 0.026 * impact * Math.exp(-9 * r) : 0;
    const shakeX = shake * Math.sin(TAU * 6.5 * r);
    const shakeY = shake * 0.55 * Math.sin(TAU * 9 * r + 1.1);
    const ringWidth = ctx.width * (0.14 + 1.05 * (1 - Math.pow(1 - r, 2.2)));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          transform: \`translate3d(\${shakeX}px, \${shakeY}px, 0)\`
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            transform: \`translate3d(0, \${y}px, 0) scale(\${scaleX}, \${scaleY})\`,
            transformOrigin: \`50% \${GROUND * 100}%\`
          }
        },
        ctx.subjectNode
      ),
      landed ? Array.from({ length: dust }, (_, index) => {
        const side = index % 2 === 0 ? -1 : 1;
        const spread = 0.3 + ctx.random(\`dust:\${index}:spread\`) * 1;
        const loft = 0.25 + ctx.random(\`dust:\${index}:loft\`) * 0.9;
        const seed = ctx.random(\`dust:\${index}:size\`);
        const ease = 1 - Math.pow(1 - r, 2.1);
        const width = unit * (0.05 + seed * 0.09) * (0.5 + ease * 1.5);
        return /* @__PURE__ */ h(
          "div",
          {
            key: index,
            style: {
              position: "absolute",
              left: "50%",
              top: \`\${GROUND * 100}%\`,
              width,
              height: width * (0.36 + seed * 0.22),
              marginLeft: -width / 2,
              borderRadius: "50%",
              transform: \`translate3d(\${side * spread * unit * 0.34 * ease}px, \${-loft * unit * 0.12 * ease}px, 0)\`,
              background: \`radial-gradient(circle at 40% 40%, #C9D2DB2E, \${signal}12 46%, transparent 74%)\`,
              opacity: Math.pow(1 - r, 1.8) * (0.35 + impact * 0.4),
              filter: \`blur(\${1.5 + seed * 3}px)\`
            }
          }
        );
      }) : null,
      landed ? /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: "50%",
            top: \`\${GROUND * 100}%\`,
            width: ringWidth,
            height: ringWidth * 0.26,
            marginLeft: -ringWidth / 2,
            marginTop: -ringWidth * 0.13,
            borderRadius: "50%",
            border: \`\${Math.max(1, unit * 6e-3 * (1 - r))}px solid \${signal}\`,
            opacity: Math.pow(1 - r, 2.2) * 0.85,
            boxShadow: \`0 0 \${unit * 0.05}px \${signal}55\`,
            mixBlendMode: "screen"
          }
        }
      ) : null,
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            background: \`radial-gradient(ellipse at 50% \${GROUND * 100}%, \${signal}4A, transparent 55%)\`,
            opacity: strike * 0.95,
            mixBlendMode: "screen"
          }
        }
      )
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 48,
          bottom: 42,
          width: 96,
          height: 3,
          background: signal,
          opacity: 0.32 + (landed ? Math.pow(1 - r, 2.4) * 0.55 : 0),
          transform: \`scaleX(\${1 + (landed ? Math.pow(1 - r, 3) * 0.7 : 0)})\`,
          transformOrigin: "left center"
        }
      }
    ));
  }
};
var O23_stamp_slam_effect_default = kernel;
`;export{n as default};
