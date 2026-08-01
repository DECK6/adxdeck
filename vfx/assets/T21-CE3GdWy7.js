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
var T21_elastic_tracking_effect_exports = {};
__export(T21_elastic_tracking_effect_exports, {
  default: () => T21_elastic_tracking_effect_default
});
module.exports = __toCommonJS(T21_elastic_tracking_effect_exports);
const clamp01 = (value) => Math.max(0, Math.min(1, value));
const springDrive = (time, cycles) => {
  const w = Math.PI * 2 * cycles * time;
  return 0.5 - 0.5 * Math.cos(w) + 0.09 * Math.sin(w * 2) - 0.028 * Math.sin(w * 3);
};
const kernel = {
  kind: "react",
  render: (ctx) => {
    const text = String(ctx.params.text ?? "DEXA VFX").toUpperCase();
    const spread = Number(ctx.params.spread ?? 0.52);
    const cycles = Math.max(1, Math.round(Number(ctx.params.cycles ?? 2)));
    const lag = Number(ctx.params.lag ?? 0.025);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const characters = text.split("");
    const center = (characters.length - 1) / 2;
    const reach = Math.max(1, center);
    const fontSize = Math.max(20, Math.min(ctx.width * 0.5 / Math.max(4, characters.length * 0.5), ctx.height * 0.22));
    const advance = fontSize * 0.66;
    const edgeTrack = springDrive(ctx.t - reach * lag, cycles) * spread * fontSize;
    const halfSpan = reach * (advance + edgeTrack) + fontSize * 0.5;
    const compressed = 1 - clamp01(springDrive(ctx.t, cycles));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.1 } }, ctx.subjectNode), [-1, 1].map((side) => /* @__PURE__ */ h(
      "div",
      {
        key: side,
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 2,
          height: fontSize * 1.5,
          background: signal,
          opacity: 0.25 + compressed * 0.45,
          transform: \`translate(-50%, -50%) translateX(\${side * halfSpan}px)\`
        }
      }
    )), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize,
          fontWeight: 700,
          lineHeight: 1,
          color: "#F5F8FA",
          whiteSpace: "pre"
        }
      },
      characters.map((character, index) => {
        const offsetIndex = index - center;
        const distance = Math.abs(offsetIndex) / reach;
        const drive = springDrive(ctx.t - Math.abs(offsetIndex) * lag, cycles);
        const open = clamp01(drive);
        const shift = offsetIndex * drive * spread * fontSize;
        return /* @__PURE__ */ h(
          "span",
          {
            key: \`\${character}:\${index}\`,
            style: {
              display: "inline-block",
              width: advance,
              textAlign: "center",
              transform: \`translate3d(\${shift}px, 0, 0)\`,
              opacity: 1 - distance * open * 0.72,
              filter: \`blur(\${distance * open * 2.2}px)\`,
              textShadow: \`0 0 \${4 + (1 - open) * 18}px \${signal}\`
            }
          },
          character
        );
      })
    ));
  }
};
var T21_elastic_tracking_effect_default = kernel;
`;export{e as default};
