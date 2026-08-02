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
var O36_wrecking_ball_effect_exports = {};
__export(O36_wrecking_ball_effect_exports, {
  default: () => O36_wrecking_ball_effect_default
});
module.exports = __toCommonJS(O36_wrecking_ball_effect_exports);
function smooth(value) {
  const u = Math.min(1, Math.max(0, value));
  return u * u * (3 - 2 * u);
}
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const swing = Number(ctx.params.swing ?? 44);
    const debrisCount = Math.max(4, Math.min(12, Math.round(Number(ctx.params.debris ?? 8))));
    const force = Number(ctx.params.force ?? 0.78);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const impactAt = 0.46;
    const pivotX = ctx.width * 0.27;
    const pivotY = ctx.height * 0.11;
    const ropeLength = Math.min(ctx.height * 0.62, ctx.width * 0.46);
    const ballRadius = Math.min(ctx.width, ctx.height) * 0.105;
    const approach = smooth((ctx.t - 0.06) / (impactAt - 0.06));
    const impactAge = Math.max(0, ctx.t - impactAt);
    const angleDegrees = ctx.t < impactAt ? -swing + (swing + 38) * approach : 38 - force * 15 * Math.exp(-impactAge * 5) * Math.sin(impactAge * 34);
    const angle = angleDegrees * Math.PI / 180;
    const ballX = pivotX + Math.sin(angle) * ropeLength;
    const ballY = pivotY + Math.cos(angle) * ropeLength;
    const stackX = pivotX + Math.sin(38 * Math.PI / 180) * ropeLength + ballRadius * 0.68;
    const ground = Math.min(ctx.height * 0.88, pivotY + ropeLength + ballRadius);
    const flash = impactAge > 0 ? Math.exp(-impactAge * 19) * force : 0;
    const visible = Math.min(1, ctx.t / 0.05, Math.max(0, (1 - ctx.t) / 0.09));
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.save();
    g.globalAlpha = visible;
    g.strokeStyle = \`\${signal}44\`;
    g.lineWidth = 1;
    g.setLineDash([4, 8]);
    g.beginPath();
    g.arc(pivotX, pivotY, ropeLength, -swing * Math.PI / 180, 38 * Math.PI / 180);
    g.stroke();
    g.setLineDash([]);
    g.fillStyle = \`\${signal}33\`;
    g.fillRect(ctx.width * 0.08, ground, ctx.width * 0.84, 1);
    g.strokeStyle = signal;
    g.lineWidth = Math.max(1.5, ctx.width * 3e-3);
    g.beginPath();
    g.moveTo(pivotX, pivotY);
    g.lineTo(ballX, ballY);
    g.stroke();
    g.fillStyle = "#171B1F";
    g.strokeStyle = signal;
    g.lineWidth = 2;
    g.beginPath();
    g.arc(pivotX, pivotY, Math.max(5, ballRadius * 0.13), 0, Math.PI * 2);
    g.fill();
    g.stroke();
    const blockWidth = ballRadius * 0.78;
    const blockHeight = ballRadius * 0.72;
    for (let row = 0; row < 3; row += 1) {
      for (let column = 0; column < 3 - row; column += 1) {
        const index = row * 3 + column;
        const direction = 0.45 + ctx.random(\`block:\${index}:direction\`) * 0.75;
        const delay = index * 0.012;
        const age = Math.max(0, impactAge - delay);
        const kick = smooth(age / 0.18) * force;
        const baseX = stackX + (column - (2 - row) / 2) * blockWidth;
        const baseY = ground - blockHeight * (row + 0.5);
        const dx = kick * ballRadius * (1.2 + direction) * (column + row % 2 === 0 ? 1 : 0.7);
        const dy = -kick * ballRadius * (1.7 - row * 0.22) + ctx.height * age * age * 0.58;
        g.save();
        g.translate(baseX + dx, Math.min(ground - blockHeight / 2, baseY + dy));
        g.rotate(kick * direction * 2.2);
        g.fillStyle = \`\${signal}\${row === 0 ? "42" : "28"}\`;
        g.strokeStyle = signal;
        g.lineWidth = 1;
        g.fillRect(-blockWidth * 0.47, -blockHeight * 0.47, blockWidth * 0.94, blockHeight * 0.94);
        g.strokeRect(-blockWidth * 0.47, -blockHeight * 0.47, blockWidth * 0.94, blockHeight * 0.94);
        g.restore();
      }
    }
    for (let index = 0; index < debrisCount; index += 1) {
      const side = ctx.random(\`debris:\${index}:side\`) > 0.5 ? 1 : -1;
      const speed = 0.6 + ctx.random(\`debris:\${index}:speed\`) * 1.1;
      const age = Math.max(0, impactAge - index * 6e-3);
      const x = stackX + side * ballRadius * speed * age * 8;
      const y = ballY - ballRadius * 0.25 - ballRadius * speed * age * 5 + ctx.height * age * age * 0.75;
      const size = 1.5 + ctx.random(\`debris:\${index}:size\`) * 3.5;
      g.globalAlpha = visible * Math.max(0, 1 - age * 1.7);
      g.fillStyle = signal;
      g.fillRect(x - size / 2, y - size / 2, size, size);
    }
    g.globalAlpha = visible;
    g.save();
    g.beginPath();
    g.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    g.clip();
    g.fillStyle = "#111519";
    g.fillRect(ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);
    if (ctx.subject.bitmap) {
      g.drawImage(ctx.subject.bitmap, ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);
    }
    g.restore();
    g.strokeStyle = signal;
    g.lineWidth = 2.5;
    g.shadowColor = signal;
    g.shadowBlur = 8 + flash * 24;
    g.beginPath();
    g.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    g.stroke();
    g.shadowBlur = 0;
    if (flash > 0.01) {
      g.globalAlpha = flash;
      g.strokeStyle = signal;
      g.lineWidth = 2;
      g.beginPath();
      g.arc(stackX, ballY, ballRadius * (0.5 + (1 - flash) * 2.4), 0, Math.PI * 2);
      g.stroke();
    }
    g.restore();
  }
};
var O36_wrecking_ball_effect_default = kernel;
`;export{n as default};
