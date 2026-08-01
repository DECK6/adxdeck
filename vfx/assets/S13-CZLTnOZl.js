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
var S13_corner_trace_effect_exports = {};
__export(S13_corner_trace_effect_exports, {
  default: () => S13_corner_trace_effect_default
});
module.exports = __toCommonJS(S13_corner_trace_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const inset = Number(ctx.params.inset ?? 8) * 10;
    const arm = Number(ctx.params.armLength ?? 24) * 10;
    const traceLength = Number(ctx.params.traceLength ?? 0.34);
    const thickness = Number(ctx.params.thickness ?? 5);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.frame % ctx.durationInFrames / ctx.durationInFrames;
    const far = 1e3 - inset;
    const cornerPoint = (index, u) => {
      const d = u * 2 * arm;
      const corners = [
        { sx: inset + arm, sy: inset, cx: inset, cy: inset, ex: inset, ey: inset + arm },
        { sx: far - arm, sy: inset, cx: far, cy: inset, ex: far, ey: inset + arm },
        { sx: far - arm, sy: far, cx: far, cy: far, ex: far, ey: far - arm },
        { sx: inset + arm, sy: far, cx: inset, cy: far, ex: inset, ey: far - arm }
      ][index];
      if (d <= arm) {
        const k2 = d / arm;
        return { x: corners.sx + (corners.cx - corners.sx) * k2, y: corners.sy };
      }
      const k = (d - arm) / arm;
      return { x: corners.cx, y: corners.cy + (corners.ey - corners.cy) * k };
    };
    const paths = [
      \`M \${inset + arm} \${inset} H \${inset} V \${inset + arm}\`,
      \`M \${far - arm} \${inset} H \${far} V \${inset + arm}\`,
      \`M \${far - arm} \${far} H \${far} V \${far - arm}\`,
      \`M \${inset + arm} \${far} H \${inset} V \${far - arm}\`
    ];
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center" } }, ctx.subjectNode), /* @__PURE__ */ h("svg", { viewBox: "0 0 1000 1000", preserveAspectRatio: "none", style: { position: "absolute", inset: 0, width: "100%", height: "100%" } }, paths.map((path, index) => {
      const localPhase = (phase + index * 0.25) % 1;
      return /* @__PURE__ */ h("g", { key: path }, /* @__PURE__ */ h("path", { d: path, pathLength: 1, fill: "none", stroke: signal, strokeWidth: Math.max(1, thickness * 0.32), opacity: "0.2" }), /* @__PURE__ */ h(
        "path",
        {
          d: path,
          pathLength: 1,
          fill: "none",
          stroke: signal,
          strokeWidth: thickness,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeDasharray: \`\${traceLength} \${1 - traceLength}\`,
          strokeDashoffset: -localPhase,
          style: { filter: \`drop-shadow(0 0 \${thickness * 2.2}px \${signal})\` }
        }
      ), (() => {
        const head = cornerPoint(index, (localPhase + traceLength) % 1);
        return /* @__PURE__ */ h("circle", { cx: head.x, cy: head.y, r: thickness * 1.5, fill: signal });
      })());
    })));
  }
};
var S13_corner_trace_effect_default = kernel;
`;export{e as default};
