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
var Z02_seven_segment_effect_exports = {};
__export(Z02_seven_segment_effect_exports, {
  default: () => Z02_seven_segment_effect_default
});
module.exports = __toCommonJS(Z02_seven_segment_effect_exports);
const DIGIT_SEGMENTS = [
  [1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 0, 0, 0, 0],
  [1, 1, 0, 1, 1, 0, 1],
  [1, 1, 1, 1, 0, 0, 1],
  [0, 1, 1, 0, 0, 1, 1],
  [1, 0, 1, 1, 0, 1, 1],
  [1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 1]
];
const SEGMENTS = [
  { left: "20%", top: "7%", width: "60%", height: "9%", clipPath: "polygon(8% 0, 92% 0, 100% 50%, 92% 100%, 8% 100%, 0 50%)" },
  { left: "78%", top: "13%", width: "12%", height: "36%", clipPath: "polygon(50% 0, 100% 10%, 100% 90%, 50% 100%, 0 90%, 0 10%)" },
  { left: "78%", top: "51%", width: "12%", height: "36%", clipPath: "polygon(50% 0, 100% 10%, 100% 90%, 50% 100%, 0 90%, 0 10%)" },
  { left: "20%", top: "84%", width: "60%", height: "9%", clipPath: "polygon(8% 0, 92% 0, 100% 50%, 92% 100%, 8% 100%, 0 50%)" },
  { left: "10%", top: "51%", width: "12%", height: "36%", clipPath: "polygon(50% 0, 100% 10%, 100% 90%, 50% 100%, 0 90%, 0 10%)" },
  { left: "10%", top: "13%", width: "12%", height: "36%", clipPath: "polygon(50% 0, 100% 10%, 100% 90%, 50% 100%, 0 90%, 0 10%)" },
  { left: "20%", top: "45.5%", width: "60%", height: "9%", clipPath: "polygon(8% 0, 92% 0, 100% 50%, 92% 100%, 8% 100%, 0 50%)" }
];
const kernel = {
  kind: "react",
  render: (ctx) => {
    const count = Math.max(3, Math.round(Number(ctx.params.digits ?? 4)));
    const speed = Math.max(1, Math.round(Number(ctx.params.speed ?? 4)));
    const glow = Math.min(1, Math.max(0, Number(ctx.params.glow ?? 0.72)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.frame % Math.max(1, ctx.durationInFrames) / Math.max(1, ctx.durationInFrames);
    const tick = phase * speed * 10;
    const value = Math.floor(tick) % Math.pow(10, count);
    const blend = Math.pow(tick - Math.floor(tick), 4);
    const current = String(value).padStart(count, "0").split("").map(Number);
    const next = String((value + 1) % Math.pow(10, count)).padStart(count, "0").split("").map(Number);
    const digitWidth = Math.min(ctx.width * 0.15, ctx.height * 0.22);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "7%", opacity: 0.14, filter: \`drop-shadow(0 0 12px \${signal})\` } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: "54%", display: "flex", gap: digitWidth * 0.12, transform: "translate(-50%, -50%)", padding: digitWidth * 0.14, background: "#08090AEF", border: \`1px solid \${signal}38\`, borderRadius: digitWidth * 0.08, boxShadow: \`inset 0 0 \${digitWidth * 0.5}px #000, 0 0 \${digitWidth * 0.18}px \${signal}1F\` } }, current.map((digit, digitIndex) => /* @__PURE__ */ h("div", { key: digitIndex, style: { position: "relative", width: digitWidth, height: digitWidth * 1.72 } }, SEGMENTS.map((segment, segmentIndex) => {
      const activeNow = DIGIT_SEGMENTS[digit][segmentIndex];
      const activeNext = DIGIT_SEGMENTS[next[digitIndex]][segmentIndex];
      const power = activeNow * (1 - blend) + activeNext * blend;
      return /* @__PURE__ */ h("div", { key: segmentIndex, style: { position: "absolute", ...segment, background: power > 0.08 ? signal : "#1D292B", opacity: 0.16 + power * 0.84, boxShadow: power > 0.08 ? \`0 0 \${3 + glow * 12}px \${signal}, inset 0 0 3px #FFFFFFAA\` : "inset 0 0 2px #000" } });
    })))));
  }
};
var Z02_seven_segment_effect_default = kernel;
`;export{t as default};
