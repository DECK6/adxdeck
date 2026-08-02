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
var V16_candlestick_effect_exports = {};
__export(V16_candlestick_effect_exports, {
  default: () => V16_candlestick_effect_default
});
module.exports = __toCommonJS(V16_candlestick_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const count = Math.max(8, Math.min(18, Math.round(Number(ctx.params.candles ?? 12))));
    const volatility = Math.max(0.2, Math.min(1, Number(ctx.params.volatility ?? 0.62)));
    const speed = Math.max(1, Math.min(3, Math.round(Number(ctx.params.speed ?? 1))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * speed % 1;
    const reveal = 0.5 - Math.cos(phase * Math.PI * 2) * 0.5;
    const left = 92;
    const top = 130;
    const chartWidth = 816;
    const chartHeight = 660;
    const step = chartWidth / count;
    let previous = 0.52;
    const candles = Array.from({ length: count }, (_, index) => {
      const open = previous;
      const delta = (ctx.random(\`candle:\${index}:delta\`) - 0.46) * volatility * 0.32;
      const close = Math.max(0.12, Math.min(0.88, open + delta));
      const wick = (0.035 + ctx.random(\`candle:\${index}:wick\`) * 0.09) * volatility;
      const high = Math.min(0.96, Math.max(open, close) + wick);
      const low = Math.max(0.04, Math.min(open, close) - wick * (0.7 + ctx.random(\`candle:\${index}:low\`) * 0.6));
      previous = close;
      return { open, close, high, low };
    });
    const y = (value) => top + (1 - value) * chartHeight;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F7FAFC", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "18%", opacity: 0.09 } }, ctx.subjectNode), /* @__PURE__ */ h("svg", { viewBox: "0 0 1000 900", preserveAspectRatio: "none", style: { position: "absolute", inset: "7%", width: "86%", height: "86%" } }, Array.from({ length: 6 }, (_, index) => /* @__PURE__ */ h("g", { key: index }, /* @__PURE__ */ h("line", { x1: left, x2: left + chartWidth, y1: top + index * (chartHeight / 5), y2: top + index * (chartHeight / 5), stroke: "#F7FAFC", strokeWidth: "1", opacity: "0.11" }), /* @__PURE__ */ h("text", { x: left - 18, y: top + index * (chartHeight / 5), fill: "#B8C0C5", fontFamily: "'JetBrains Mono', monospace", fontSize: "18", textAnchor: "end", dominantBaseline: "middle" }, (100 - index * 8).toFixed(0)))), candles.map((candle, index) => {
      const local = Math.max(0, Math.min(1, reveal * (count + 2) - index));
      const eased = local * local * (3 - 2 * local);
      const x = left + step * (index + 0.5);
      const rising = candle.close >= candle.open;
      const color = rising ? signal : "#FF6B5F";
      const openY = y(candle.open);
      const closeY = y(candle.close);
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(8, Math.abs(closeY - openY));
      return /* @__PURE__ */ h("g", { key: index, opacity: local, style: { filter: rising ? \`drop-shadow(0 0 7px \${signal})\` : "none" } }, /* @__PURE__ */ h("line", { x1: x, x2: x, y1: y(candle.high), y2: y(candle.low), stroke: color, strokeWidth: "4", strokeDasharray: "1", pathLength: "1", strokeDashoffset: 1 - eased }), /* @__PURE__ */ h("rect", { x: x - step * 0.27, y: bodyTop + bodyHeight * (1 - eased) * 0.5, width: step * 0.54, height: bodyHeight * eased, fill: rising ? "#0D0E10" : color, stroke: color, strokeWidth: "4" }));
    }), /* @__PURE__ */ h("line", { x1: left, x2: left + chartWidth * reveal, y1: top + chartHeight + 34, y2: top + chartHeight + 34, stroke: signal, strokeWidth: "4" })), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", top: "7%", color: signal, fontSize: Math.max(9, ctx.width * 0.012), fontWeight: 700, letterSpacing: "0.18em" } }, "DEXA VFX / OHLC SIGNAL"), /* @__PURE__ */ h("div", { style: { position: "absolute", right: "8%", top: "7%", color: "#D7DDE1", fontSize: Math.max(9, ctx.width * 0.011), fontWeight: 600 } }, "06.00 / LIVE"));
  }
};
var V16_candlestick_effect_default = kernel;
`;export{e as default};
