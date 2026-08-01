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
var X14_whip_pan_effect_exports = {};
__export(X14_whip_pan_effect_exports, {
  default: () => X14_whip_pan_effect_default
});
module.exports = __toCommonJS(X14_whip_pan_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const direction = String(ctx.params.direction ?? "left");
    const blur = Number(ctx.params.blur ?? 22);
    const overshoot = Number(ctx.params.overshoot ?? 0.06);
    const trails = Math.max(2, Math.round(Number(ctx.params.trails ?? 5)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const theta = ctx.t * Math.PI * 2;
    const cycle = (1 - Math.cos(theta)) / 2;
    const velocity = Math.sin(theta);
    const speed = Math.abs(velocity);
    const progress = cycle + overshoot * Math.sin(Math.PI * cycle) * velocity;
    const panSign = direction === "left" ? 1 : -1;
    const movementSign = -panSign * Math.sign(velocity || 1);
    const subjectLayer = (index, trailOffset, opacity) => {
      const x = panSign * (index - progress) * ctx.width + trailOffset;
      return /* @__PURE__ */ h(
        "div",
        {
          key: \`\${index}:\${trailOffset}\`,
          style: {
            position: "absolute",
            inset: 0,
            opacity,
            transform: \`translate3d(\${x}px, 0, 0) scale(\${1 + speed * 0.018})\`,
            filter: \`blur(\${blur * speed}px)\`
          }
        },
        ctx.subjectNode
      );
    };
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, speed > 0.01 ? Array.from({ length: trails }, (_, trail) => {
      const lag = (trail + 1) / trails * blur * 2.4 * speed * movementSign;
      return [subjectLayer(0, lag, 0.11 / trails), subjectLayer(1, lag, 0.11 / trails)];
    }) : null, subjectLayer(0, 0, 1), subjectLayer(1, 0, 1), Array.from({ length: trails }, (_, index) => {
      const y = (index + 0.5) / trails * ctx.height;
      const length = ctx.width * (0.08 + speed * (0.12 + index * 0.018));
      return /* @__PURE__ */ h(
        "div",
        {
          key: \`streak:\${index}\`,
          style: {
            position: "absolute",
            left: direction === "left" ? ctx.width - length : 0,
            top: y,
            width: length,
            height: 1,
            background: \`linear-gradient(\${direction === "left" ? "90deg" : "270deg"}, transparent, \${signal})\`,
            opacity: speed * (0.12 + index % 3 * 0.08),
            transform: \`translateX(\${movementSign * speed * 26}px)\`
          }
        }
      );
    }));
  }
};
var X14_whip_pan_effect_default = kernel;
`;export{e as default};
