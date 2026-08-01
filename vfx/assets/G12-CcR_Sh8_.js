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
var G12_sync_roll_effect_exports = {};
__export(G12_sync_roll_effect_exports, {
  default: () => G12_sync_roll_effect_default
});
module.exports = __toCommonJS(G12_sync_roll_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const speed = Math.max(1, Math.round(Number(ctx.params.speed ?? 1)));
    const tear = Number(ctx.params.tear ?? 18);
    const wobble = Number(ctx.params.wobble ?? 7);
    const direction = String(ctx.params.direction ?? "down");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration;
    const roll = phase * speed % 1;
    const sign = direction === "up" ? -1 : 1;
    const x = Math.sin(phase * Math.PI * 2 * speed * 2) * wobble;
    const seam = roll * 100;
    const rolledSubject = (extraX) => /* @__PURE__ */ h(Frag, null, [-1, 0, 1].map((offset) => /* @__PURE__ */ h(
      "div",
      {
        key: offset,
        style: {
          position: "absolute",
          inset: 0,
          transform: \`translate3d(\${x + extraX}px, \${(roll + offset) * ctx.height * sign}px, 0)\`
        }
      },
      ctx.subjectNode
    )));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, rolledSubject(0), tear > 0 ? /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          clipPath: \`inset(\${Math.max(0, seam - 4)}% 0 \${Math.max(0, 96 - seam)}% 0)\`,
          filter: \`drop-shadow(\${tear * 0.3}px 0 3px \${signal})\`,
          opacity: 0.78
        }
      },
      rolledSubject(tear)
    ) : null, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          top: \`\${seam}%\`,
          height: 2,
          transform: "translateY(-1px)",
          background: signal,
          boxShadow: \`0 0 10px \${signal}\`,
          opacity: 0.7
        }
      }
    ));
  }
};
var G12_sync_roll_effect_default = kernel;
`;export{n as default};
