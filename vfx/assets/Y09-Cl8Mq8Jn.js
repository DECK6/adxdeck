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
var Y09_stipple_dots_effect_exports = {};
__export(Y09_stipple_dots_effect_exports, {
  default: () => Y09_stipple_dots_effect_default
});
module.exports = __toCommonJS(Y09_stipple_dots_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const spacing = Math.min(14, Math.max(5, Math.round(Number(ctx.params.spacing ?? 8))));
    const dotSize = Math.min(2.8, Math.max(0.4, Number(ctx.params.dotSize ?? 1.5)));
    const contrast = Math.min(2.4, Math.max(0.7, Number(ctx.params.contrast ?? 1.4)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    let subjectPixels;
    if (ctx.subject.bitmap) {
      g.clearRect(0, 0, ctx.width, ctx.height);
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      subjectPixels = g.getImageData(0, 0, ctx.width, ctx.height);
    }
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    const glow = g.createRadialGradient(ctx.width * 0.5, ctx.height * 0.5, 0, ctx.width * 0.5, ctx.height * 0.5, Math.max(ctx.width, ctx.height) * 0.58);
    glow.addColorStop(0, \`\${signal}16\`);
    glow.addColorStop(1, "#0D0E1000");
    g.fillStyle = glow;
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = dotSize * 1.2;
    for (let y = Math.floor(spacing * 0.5); y < ctx.height; y += spacing) {
      for (let x = Math.floor(spacing * 0.5); x < ctx.width; x += spacing) {
        const sampleX = Math.min(ctx.width - 1, Math.max(0, x));
        const sampleY = Math.min(ctx.height - 1, Math.max(0, y));
        const offset = (sampleY * ctx.width + sampleX) * 4;
        const alpha = subjectPixels ? subjectPixels.data[offset + 3] / 255 : 0;
        if (alpha < 0.04) continue;
        const luma = subjectPixels ? (subjectPixels.data[offset] * 0.2126 + subjectPixels.data[offset + 1] * 0.7152 + subjectPixels.data[offset + 2] * 0.0722) / 255 : 0.5;
        const darkness = Math.min(1, Math.max(0, (1 - luma - 0.5) * contrast + 0.5));
        const key = \`stipple:\${x}:\${y}\`;
        const jitterX = (ctx.random(\`\${key}:x\`) - 0.5) * spacing * 0.72;
        const jitterY = (ctx.random(\`\${key}:y\`) - 0.5) * spacing * 0.72;
        const dotPhase = ctx.random(\`\${key}:phase\`) * TAU;
        const breathe = 0.88 + Math.sin(phase + dotPhase) * 0.12;
        const radius = dotSize * (0.28 + darkness * 0.92) * breathe;
        const orbit = (0.25 + darkness * 0.55) * Math.sin(phase + dotPhase);
        g.globalAlpha = alpha * (0.34 + darkness * 0.66);
        g.beginPath();
        g.arc(x + jitterX + orbit, y + jitterY + Math.cos(phase + dotPhase) * orbit, radius, 0, TAU);
        g.fill();
        if (darkness > 0.62) {
          const satelliteAngle = ctx.random(\`\${key}:satellite\`) * TAU;
          const distance = spacing * 0.28;
          g.globalAlpha *= 0.68;
          g.beginPath();
          g.arc(
            x + jitterX + Math.cos(satelliteAngle) * distance,
            y + jitterY + Math.sin(satelliteAngle) * distance,
            radius * 0.48,
            0,
            TAU
          );
          g.fill();
        }
      }
    }
    g.restore();
  }
};
var Y09_stipple_dots_effect_default = kernel;
`;export{t as default};
