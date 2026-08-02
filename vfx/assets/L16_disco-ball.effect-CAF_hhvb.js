const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const facets = Math.min(11, Math.max(5, Math.round(Number(ctx.params.facets ?? 8))));
    const reflectionCount = Math.min(72, Math.max(18, Math.round(Number(ctx.params.reflections ?? 42))));
    const rotation = Math.min(3, Math.max(1, Math.round(Number(ctx.params.rotation ?? 1))));
    const sparkle = Math.min(1, Math.max(0.2, Number(ctx.params.sparkle ?? 0.76)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU * rotation;
    const ballX = ctx.width * 0.5;
    const ballY = ctx.height * 0.23;
    const ballRadius = Math.min(ctx.width, ctx.height) * 0.135;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);

    g.save();
    for (let i = 0; i < reflectionCount; i += 1) {
      const base = ctx.random(\`reflection:\${i}:angle\`) * TAU;
      const lane = 0.22 + ctx.random(\`reflection:\${i}:lane\`) * 0.78;
      const direction = ctx.random(\`reflection:\${i}:direction\`) < 0.5 ? -1 : 1;
      const angle = base + phase * direction;
      const x = ctx.width * (0.5 + Math.cos(angle) * lane * 0.64);
      const y = ctx.height * (0.56 + Math.sin(angle + base * 0.37) * lane * 0.48);
      const size = 1.2 + ctx.random(\`reflection:\${i}:size\`) * 4.2;
      const twinkle = 0.28 + 0.72 * Math.sin(angle * 2 + base * 3) ** 2;

      g.globalAlpha = sparkle * twinkle * 0.1;
      g.strokeStyle = signal;
      g.lineWidth = Math.max(0.35, size * 0.18);
      g.beginPath();
      g.moveTo(ballX, ballY);
      g.lineTo(x, y);
      g.stroke();

      g.globalAlpha = sparkle * twinkle * 0.72;
      g.fillStyle = signal;
      g.shadowColor = signal;
      g.shadowBlur = size * 3;
      g.save();
      g.translate(x, y);
      g.rotate(angle);
      g.fillRect(-size * 0.85, -size * 0.34, size * 1.7, size * 0.68);
      g.restore();
    }
    g.restore();

    if (ctx.subject.bitmap) {
      g.save();
      g.shadowColor = signal;
      g.shadowBlur = 9 + sparkle * 8;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    g.save();
    g.strokeStyle = '#58636B';
    g.lineWidth = Math.max(1, ballRadius * 0.035);
    g.beginPath();
    g.moveTo(ballX, 0);
    g.lineTo(ballX, ballY - ballRadius);
    g.stroke();

    g.beginPath();
    g.arc(ballX, ballY, ballRadius, 0, TAU);
    g.clip();
    const sphereGradient = g.createRadialGradient(
      ballX - ballRadius * 0.34,
      ballY - ballRadius * 0.38,
      ballRadius * 0.05,
      ballX,
      ballY,
      ballRadius,
    );
    sphereGradient.addColorStop(0, '#E8FFFF');
    sphereGradient.addColorStop(0.28, signal);
    sphereGradient.addColorStop(0.7, '#26434A');
    sphereGradient.addColorStop(1, '#081014');
    g.fillStyle = sphereGradient;
    g.fillRect(ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);

    const tile = (ballRadius * 2) / facets;
    for (let row = 0; row < facets; row += 1) {
      for (let column = 0; column < facets; column += 1) {
        const cx = ballX - ballRadius + (column + 0.5) * tile;
        const cy = ballY - ballRadius + (row + 0.5) * tile;
        const nx = (cx - ballX) / ballRadius;
        const ny = (cy - ballY) / ballRadius;
        const radial = nx * nx + ny * ny;
        if (radial > 0.96) continue;
        const glint = Math.sin(column * 1.71 + row * 2.37 - phase * 2.0) * 0.5 + 0.5;
        const alpha = 0.12 + glint * sparkle * 0.5;
        const skew = nx * tile * 0.14;
        g.fillStyle = glint > 0.84 ? \`rgba(232,255,255,\${alpha})\` : \`rgba(94,231,243,\${alpha * 0.55})\`;
        g.strokeStyle = 'rgba(13,14,16,0.68)';
        g.lineWidth = Math.max(0.5, tile * 0.055);
        g.beginPath();
        g.moveTo(cx - tile * 0.46 + skew, cy - tile * 0.44);
        g.lineTo(cx + tile * 0.46 + skew, cy - tile * 0.44);
        g.lineTo(cx + tile * 0.46 - skew, cy + tile * 0.44);
        g.lineTo(cx - tile * 0.46 - skew, cy + tile * 0.44);
        g.closePath();
        g.fill();
        g.stroke();
      }
    }
    g.restore();

    g.save();
    g.strokeStyle = signal;
    g.globalAlpha = 0.48 + sparkle * 0.38;
    g.shadowColor = signal;
    g.shadowBlur = 12;
    g.lineWidth = 1.2;
    g.beginPath();
    g.arc(ballX, ballY, ballRadius, 0, TAU);
    g.stroke();
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
