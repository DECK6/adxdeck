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
var O35_slingshot_effect_exports = {};
__export(O35_slingshot_effect_exports, {
  default: () => O35_slingshot_effect_default
});
module.exports = __toCommonJS(O35_slingshot_effect_exports);
function smooth(value) {
  const u = Math.min(1, Math.max(0, value));
  return u * u * (3 - 2 * u);
}
const kernel = {
  kind: "react",
  render: (ctx) => {
    const pull = Number(ctx.params.pull ?? 0.24);
    const arc = Number(ctx.params.arc ?? 0.2);
    const impactPower = Number(ctx.params.impact ?? 0.78);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const drawStart = 0.08;
    const drawEnd = 0.29;
    const release = 0.35;
    const hit = 0.68;
    const startX = ctx.width * 0.25;
    const targetX = ctx.width * 0.79;
    const restY = ctx.height * 0.58;
    const pullDistance = ctx.width * pull;
    const draw = smooth((ctx.t - drawStart) / (drawEnd - drawStart));
    const heldPull = ctx.t < release ? draw : 1;
    const flight = smooth((ctx.t - release) / (hit - release));
    const launched = ctx.t >= release;
    const landed = ctx.t >= hit;
    const x = launched ? startX - pullDistance + (targetX - startX + pullDistance) * flight : startX - pullDistance * heldPull;
    const y = launched ? restY - ctx.height * arc * 4 * flight * (1 - flight) : restY + heldPull * ctx.height * 0.025;
    const impactAge = Math.max(0, ctx.t - hit);
    const impact = landed ? Math.exp(-impactAge * 18) * impactPower : 0;
    const recoilAge = Math.max(0, ctx.t - release);
    const bandRecoil = launched ? Math.exp(-recoilAge * 18) * Math.cos(recoilAge * 85) : 1;
    const boxWidth = ctx.width * 0.22;
    const boxHeight = ctx.height * 0.29;
    const speed = launched && !landed ? 1 : 0;
    const heading = launched ? -Math.atan2(ctx.height * arc * 4 * (1 - 2 * flight), targetX - startX + pullDistance) : 0;
    const visible = Math.min(1, ctx.t / 0.05, Math.max(0, (1 - ctx.t) / 0.08));
    const forkX = startX + ctx.width * 0.035;
    const forkTop = restY - ctx.height * 0.11;
    const bandX = launched ? forkX - ctx.width * 0.025 * bandRecoil : x;
    const bandY = launched ? restY : y;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "svg",
      {
        viewBox: \`0 0 \${ctx.width} \${ctx.height}\`,
        preserveAspectRatio: "none",
        style: { position: "absolute", inset: 0, width: "100%", height: "100%" }
      },
      /* @__PURE__ */ h("line", { x1: forkX, y1: forkTop, x2: forkX, y2: ctx.height * 0.79, stroke: signal, strokeWidth: "5", opacity: "0.38" }),
      /* @__PURE__ */ h("line", { x1: forkX, y1: forkTop, x2: forkX - ctx.width * 0.055, y2: restY - ctx.height * 0.02, stroke: signal, strokeWidth: "5", opacity: "0.6" }),
      /* @__PURE__ */ h("line", { x1: forkX, y1: forkTop, x2: forkX + ctx.width * 0.055, y2: restY - ctx.height * 0.02, stroke: signal, strokeWidth: "5", opacity: "0.6" }),
      /* @__PURE__ */ h(
        "polyline",
        {
          points: \`\${forkX - ctx.width * 0.055},\${restY - ctx.height * 0.02} \${bandX},\${bandY} \${forkX + ctx.width * 0.055},\${restY - ctx.height * 0.02}\`,
          fill: "none",
          stroke: signal,
          strokeWidth: "2",
          opacity: 0.5 + heldPull * 0.4
        }
      ),
      /* @__PURE__ */ h(
        "path",
        {
          d: \`M \${startX - pullDistance} \${restY} Q \${(startX + targetX) / 2} \${restY - ctx.height * arc * 2}, \${targetX} \${restY}\`,
          fill: "none",
          stroke: signal,
          strokeWidth: "1",
          strokeDasharray: "3 8",
          opacity: "0.22"
        }
      )
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: targetX - ctx.width * 0.045,
          top: restY - ctx.width * 0.045,
          width: ctx.width * 0.09,
          height: ctx.width * 0.09,
          border: \`2px solid \${signal}\`,
          borderRadius: "50%",
          opacity: 0.42 + impact * 0.5,
          boxShadow: \`0 0 \${impact * 28}px \${signal}\`
        }
      }
    ), landed ? [0, 1, 2].map((index) => {
      const spread = Math.min(1, impactAge * (3.8 + index * 0.8));
      const size = ctx.width * (0.09 + spread * (0.2 + index * 0.05));
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: targetX - size / 2,
            top: restY - size / 2,
            width: size,
            height: size,
            border: \`1px solid \${signal}\`,
            borderRadius: "50%",
            opacity: Math.max(0, 1 - spread) * impactPower * (0.7 - index * 0.15)
          }
        }
      );
    }) : null, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: x - boxWidth / 2,
          top: y - boxHeight / 2,
          width: boxWidth,
          height: boxHeight,
          opacity: visible * (landed ? Math.max(0.35, 1 - impactAge * 1.6) : 1),
          transform: \`rotate(\${heading}rad) scale(\${1 + speed * 0.18 - impact * 0.18}, \${1 - speed * 0.1 + impact * 0.22})\`,
          filter: \`drop-shadow(0 0 \${6 + speed * 18 + impact * 24}px \${signal}66)\`
        }
      },
      ctx.subjectNode
    ));
  }
};
var O35_slingshot_effect_default = kernel;
`;export{t as default};
