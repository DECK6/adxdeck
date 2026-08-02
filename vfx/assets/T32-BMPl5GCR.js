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
var T32_stencil_spray_effect_exports = {};
__export(T32_stencil_spray_effect_exports, {
  default: () => T32_stencil_spray_effect_default
});
module.exports = __toCommonJS(T32_stencil_spray_effect_exports);
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const phrase = String(ctx.params.phrase ?? "DEXA").toUpperCase();
    const density = Math.max(40, Math.min(600, Math.round(Number(ctx.params.density ?? 300))));
    const overspray = Number(ctx.params.overspray ?? 0.48);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration;
    const sweep = phase < 0.72 ? Math.max(0, Math.min(1, (phase - 0.05) / 0.48)) : Math.max(0, Math.min(1, (0.98 - phase) / 0.18));
    const fontSize = Math.max(42, Math.min(ctx.width * 0.2, ctx.height * 0.38));
    const left = ctx.width * 0.12;
    const textWidth = ctx.width * 0.76;
    g.fillStyle = "#151719";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.1;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    g.save();
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = \`900 \${fontSize}px Arial Black, Impact, sans-serif\`;
    g.strokeStyle = \`\${signal}58\`;
    g.lineWidth = Math.max(1, fontSize * 0.018);
    g.strokeText(phrase, ctx.width / 2, ctx.height / 2);
    g.beginPath();
    g.rect(left, ctx.height * 0.25, textWidth * sweep, ctx.height * 0.5);
    g.clip();
    g.globalAlpha = 0.82;
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = 7;
    g.fillText(phrase, ctx.width / 2, ctx.height / 2);
    g.globalAlpha = 0.28;
    for (let pass = 0; pass < 4; pass += 1) g.fillText(phrase, ctx.width / 2 + (pass - 1.5) * 1.2, ctx.height / 2 + Math.sin(pass * 2.3) * 1.5);
    g.restore();
    g.save();
    g.globalCompositeOperation = "screen";
    const nozzleX = left + textWidth * sweep;
    for (let index = 0; index < density; index += 1) {
      const seedX = ctx.random(\`spray:\${index}:x\`);
      const seedY = ctx.random(\`spray:\${index}:y\`);
      const x = left + seedX * textWidth * Math.max(0.03, sweep) + (ctx.random(\`spray:\${index}:drift\`) - 0.5) * fontSize * overspray * 0.25;
      const spread = (0.18 + Math.abs(x - nozzleX) / textWidth) * fontSize * overspray;
      const y = ctx.height / 2 + (seedY - 0.5) * (fontSize * 0.95 + spread);
      const radius = 0.5 + ctx.random(\`spray:\${index}:size\`) * (1.2 + overspray * 2.4);
      const nearFront = 1 - Math.min(1, Math.abs(x - nozzleX) / (fontSize * 1.7));
      g.globalAlpha = (0.035 + ctx.random(\`spray:\${index}:alpha\`) * 0.28) * (0.45 + nearFront * 0.55);
      g.fillStyle = signal;
      g.beginPath();
      g.arc(x, y, radius, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = sweep > 0.02 && sweep < 0.98 ? 0.72 : 0;
    g.strokeStyle = signal;
    g.lineWidth = 2;
    g.beginPath();
    g.arc(nozzleX + fontSize * 0.13, ctx.height / 2 - fontSize * 0.58, fontSize * 0.09, 0, Math.PI * 2);
    g.stroke();
    g.restore();
    g.save();
    g.fillStyle = "#151719";
    g.globalAlpha = 0.62 * sweep;
    const bridgeWidth = Math.max(4, fontSize * 0.045);
    for (let index = 0; index < phrase.length; index += 1) {
      const x = ctx.width / 2 + (index - (phrase.length - 1) / 2) * fontSize * 0.63;
      g.fillRect(x - bridgeWidth / 2, ctx.height / 2 - fontSize * 0.48, bridgeWidth, fontSize * 0.96);
    }
    g.restore();
  }
};
var T32_stencil_spray_effect_default = kernel;
`;export{e as default};
