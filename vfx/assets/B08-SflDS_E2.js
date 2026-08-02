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
var B08_score_bug_effect_exports = {};
__export(B08_score_bug_effect_exports, {
  default: () => B08_score_bug_effect_default
});
module.exports = __toCommonJS(B08_score_bug_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smooth = (value) => {
  const p = clamp01(value);
  return p * p * (3 - 2 * p);
};
const kernel = {
  kind: "react",
  render: (ctx) => {
    const matchup = String(ctx.params.matchup ?? "DEXA / VFX").split("/").map((part) => part.trim());
    const homeScore = Math.round(Number(ctx.params.score ?? 3));
    const awayScore = Math.max(0, homeScore - 1);
    const period = Math.round(Number(ctx.params.period ?? 2));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const enter = smooth((ctx.t - 0.04) / 0.2);
    const flip = smooth((ctx.t - 0.28) / 0.18);
    const metaIn = smooth((ctx.t - 0.4) / 0.14);
    const outro = smooth((1 - ctx.t) / 0.1);
    const previousHome = Math.max(0, homeScore - 1);
    const previousAway = awayScore;
    const teamA = matchup[0] || "DEXA";
    const teamB = matchup[1] || "VFX";
    const scoreCard = (previous, current, active) => /* @__PURE__ */ h(
      "div",
      {
        "data-layout-allow-overlap": true,
        "data-layout-allow-occlusion": true,
        style: { position: "relative", width: "26%", height: "100%", perspective: 600, background: "#0A0C0E", overflow: "hidden" }
      },
      /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#F6F9FA", fontSize: Math.max(18, Math.min(ctx.width * 0.028, ctx.height * 0.08)), fontWeight: 900 } }, current),
      active ? /* @__PURE__ */ h(
        "div",
        {
          "data-layout-allow-overflow": true,
          "data-layout-allow-overlap": true,
          "data-layout-allow-occlusion": true,
          style: {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "50%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#F6F9FA",
            background: "#15191C",
            fontSize: Math.max(18, Math.min(ctx.width * 0.028, ctx.height * 0.08)),
            fontWeight: 900,
            lineHeight: 1,
            transform: \`rotateX(\${-flip * 90}deg)\`,
            transformOrigin: "bottom",
            backfaceVisibility: "hidden",
            borderBottom: "1px solid #000"
          }
        },
        previous
      ) : null,
      /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: "#000", opacity: 0.7 } })
    );
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.09 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          right: "4%",
          top: "5%",
          width: "43%",
          height: "13%",
          display: "flex",
          background: "#15191DEE",
          borderBottom: \`3px solid \${signal}\`,
          boxShadow: "0 16px 38px rgba(0,0,0,0.42)",
          opacity: enter * outro,
          transform: \`translate3d(0, \${(1 - enter) * -ctx.height * 0.18}px, 0)\`
        }
      },
      /* @__PURE__ */ h("div", { style: { width: "37%", padding: "4% 5%", boxSizing: "border-box", color: "#F5F8FA", display: "flex", flexDirection: "column", justifyContent: "center" } }, /* @__PURE__ */ h("div", { style: { fontSize: Math.max(8, ctx.width * 0.011), fontWeight: 900, letterSpacing: "0.08em", whiteSpace: "nowrap" } }, teamA), /* @__PURE__ */ h("div", { style: { marginTop: "0.55em", color: "#CBD3D7", fontSize: Math.max(7, ctx.width * 8e-3), fontWeight: 800, letterSpacing: "0.1em", whiteSpace: "nowrap" } }, teamB)),
      /* @__PURE__ */ h("div", { style: { display: "flex", width: "39%", height: "100%", gap: 2 } }, scoreCard(previousHome, homeScore, true), /* @__PURE__ */ h("div", { style: { width: "22%", display: "flex", alignItems: "center", justifyContent: "center", color: signal, fontSize: Math.max(9, ctx.width * 0.015), fontWeight: 900 } }, "\\u2014"), scoreCard(previousAway, awayScore, false)),
      /* @__PURE__ */ h("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#F6F9FA", background: signal, opacity: metaIn } }, /* @__PURE__ */ h("div", { style: { color: "#071013", fontSize: Math.max(7, ctx.width * 8e-3), fontWeight: 900, letterSpacing: "0.08em" } }, "P", period), /* @__PURE__ */ h("div", { style: { marginTop: "0.45em", color: "#071013", fontSize: Math.max(7, ctx.width * 8e-3), fontWeight: 900 } }, "04:26"))
    ));
  }
};
var B08_score_bug_effect_default = kernel;
`;export{t as default};
