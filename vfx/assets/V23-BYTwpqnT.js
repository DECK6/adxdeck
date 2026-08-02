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
var V23_bubble_pack_effect_exports = {};
__export(V23_bubble_pack_effect_exports, {
  default: () => V23_bubble_pack_effect_default
});
module.exports = __toCommonJS(V23_bubble_pack_effect_exports);
const layout = [
  [0, 0, 0.23],
  [-0.28, -0.04, 0.17],
  [0.28, 0.01, 0.155],
  [0.03, -0.27, 0.14],
  [-0.05, 0.27, 0.13],
  [-0.3, 0.25, 0.105],
  [0.31, 0.27, 0.1],
  [-0.32, -0.29, 0.09],
  [0.32, -0.28, 0.085],
  [-0.49, 0.06, 0.07],
  [0.48, 0.09, 0.065],
  [0.08, 0.46, 0.06]
];
function rgba(hexValue, alpha) {
  const hex = /^#[0-9a-f]{6}$/i.test(hexValue) ? hexValue.slice(1) : "5EE7F3";
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  return \`rgba(\${red}, \${green}, \${blue}, \${alpha})\`;
}
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const count = Math.max(5, Math.min(12, Math.round(Number(ctx.params.bubbles ?? 9))));
    const scale = Math.max(0.65, Math.min(1.15, Number(ctx.params.scale ?? 0.94)));
    const pulse = Math.max(0, Math.min(0.18, Number(ctx.params.pulse ?? 0.06)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const reveal = 0.5 - Math.cos(ctx.t * Math.PI * 2) * 0.5;
    const unit = Math.min(ctx.width, ctx.height);
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.09;
      g.drawImage(ctx.subject.bitmap, ctx.width * 0.2, ctx.height * 0.2, ctx.width * 0.6, ctx.height * 0.6);
      g.restore();
    }
    g.save();
    g.textAlign = "center";
    g.textBaseline = "middle";
    for (let index = count - 1; index >= 0; index -= 1) {
      const [nx, ny, baseRadius] = layout[index];
      const local = Math.max(0, Math.min(1, reveal * 1.55 - index * 0.065));
      const breathing = 1 + Math.sin(ctx.t * Math.PI * 2 + index * 0.8) * pulse * local;
      const radius = baseRadius * unit * scale * local * breathing;
      const x = ctx.width / 2 + nx * unit * scale;
      const y = ctx.height / 2 + ny * unit * scale;
      g.fillStyle = rgba(signal, 0.08 + (count - index) / count * 0.36);
      g.strokeStyle = rgba(signal, 0.34 + local * 0.5);
      g.lineWidth = Math.max(1.5, unit * 25e-4);
      g.shadowColor = signal;
      g.shadowBlur = index < 3 ? 18 * local : 5 * local;
      g.beginPath();
      g.arc(x, y, radius, 0, Math.PI * 2);
      g.fill();
      g.stroke();
      if (index < 3 && radius > 24) {
        g.shadowBlur = 0;
        g.fillStyle = "#F4F7F8";
        g.font = \`700 \${Math.max(12, radius * 0.2)}px 'JetBrains Mono', monospace\`;
        g.fillText(index === 0 ? "DEXA" : index === 1 ? "VFX" : "DATA", x, y);
      }
    }
    g.restore();
  }
};
var V23_bubble_pack_effect_default = kernel;
`;export{e as default};
