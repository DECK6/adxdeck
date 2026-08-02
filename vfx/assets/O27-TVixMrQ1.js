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
var O27_rope_swing_effect_exports = {};
__export(O27_rope_swing_effect_exports, {
  default: () => O27_rope_swing_effect_default
});
module.exports = __toCommonJS(O27_rope_swing_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const joints = Math.max(8, Math.min(24, Math.round(Number(ctx.params.joints ?? 18))));
    const maxAngle = Number(ctx.params.angle ?? 38) * Math.PI / 180;
    const damping = Number(ctx.params.damping ?? 1.15);
    const ropeLength = Number(ctx.params.length ?? 0.62) * ctx.height;
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const u = (ctx.t * 2 % 1 + 1) % 1;
    const cycleSeconds = ctx.durationInFrames / Math.max(1, ctx.fps) / 2;
    const decay = Math.exp(-damping * u * cycleSeconds);
    const base = maxAngle * decay * Math.sin(TAU * 2 * u);
    const ripple = maxAngle * 0.14 * decay * Math.sin(TAU * 3 * u);
    const segmentLength = ropeLength / joints;
    const points = [{ x: ctx.width / 2, y: ctx.height * 0.08 }];
    for (let index = 0; index < joints; index += 1) {
      const along = (index + 1) / joints;
      const angle = base * (0.38 + along * 0.62) + ripple * Math.sin(along * Math.PI);
      const previous = points[index];
      points.push({ x: previous.x + Math.sin(angle) * segmentLength, y: previous.y + Math.cos(angle) * segmentLength });
    }
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.strokeStyle = \`\${signal}22\`;
    g.lineWidth = 1;
    g.setLineDash([4, 9]);
    g.beginPath();
    g.moveTo(ctx.width / 2, ctx.height * 0.08);
    g.lineTo(ctx.width / 2, ctx.height * 0.08 + ropeLength);
    g.stroke();
    g.setLineDash([]);
    g.strokeStyle = signal;
    g.lineWidth = Math.max(2, Math.min(ctx.width, ctx.height) * 7e-3);
    g.lineJoin = "round";
    g.shadowColor = signal;
    g.shadowBlur = 10;
    g.beginPath();
    points.forEach((point, index) => index === 0 ? g.moveTo(point.x, point.y) : g.lineTo(point.x, point.y));
    g.stroke();
    g.shadowBlur = 0;
    points.forEach((point, index) => {
      if (index === 0 || index % 2 !== 0) return;
      g.fillStyle = index === joints ? signal : "#0D0E10";
      g.strokeStyle = signal;
      g.beginPath();
      g.arc(point.x, point.y, Math.max(2.5, g.lineWidth * 0.8), 0, TAU);
      g.fill();
      g.stroke();
    });
    const end = points[points.length - 1];
    const bob = Math.min(ctx.width, ctx.height) * 0.19;
    if (ctx.subject.bitmap) {
      g.save();
      g.shadowColor = signal;
      g.shadowBlur = 18;
      g.drawImage(ctx.subject.bitmap, end.x - bob, end.y - bob * 0.25, bob * 2, bob * 1.25);
      g.restore();
    }
    g.fillStyle = signal;
    g.font = \`\${Math.max(10, Math.min(ctx.width, ctx.height) * 0.018)}px monospace\`;
    g.fillText(\`ROPE / \${joints} JOINTS\`, ctx.width * 0.06, ctx.height * 0.93);
  }
};
var O27_rope_swing_effect_default = kernel;
`;export{n as default};
