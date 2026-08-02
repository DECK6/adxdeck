const t=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const steps = Math.round(Math.min(24, Math.max(4, Number(ctx.params.steps ?? 12))));
    const ghosts = Math.round(Math.min(5, Math.max(1, Number(ctx.params.ghosts ?? 3))));
    const jitter = Math.min(48, Math.max(2, Number(ctx.params.jitter ?? 20)));
    const persistence = Math.min(0.55, Math.max(0.08, Number(ctx.params.persistence ?? 0.28)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const source = ctx.subject.bitmap;
    const loopT = ((ctx.t % 1) + 1) % 1;
    const exactStep = loopT * steps;
    const heldStep = Math.floor(exactStep) % steps;
    const holdProgress = exactStep - Math.floor(exactStep);

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (!source) return;

    const drawExposure = (step: number, alpha: number, ghostIndex: number) => {
      const wrapped = ((step % steps) + steps) % steps;
      const phase = (wrapped / steps) * TAU;
      const x = Math.sin(phase * 3) * jitter + (ctx.random(\`q:\${wrapped}:x\`) - 0.5) * jitter * 0.35;
      const y = Math.cos(phase * 2) * jitter * 0.38 + (ctx.random(\`q:\${wrapped}:y\`) - 0.5) * jitter * 0.2;
      const angle = (ctx.random(\`q:\${wrapped}:angle\`) - 0.5) * 0.035;
      g.save();
      g.globalAlpha = alpha;
      g.globalCompositeOperation = ghostIndex === 0 ? 'source-over' : 'screen';
      g.translate(ctx.width * 0.5 + x, ctx.height * 0.5 + y);
      g.rotate(angle);
      g.translate(-ctx.width * 0.5, -ctx.height * 0.5);
      if (ghostIndex > 0) g.filter = \`sepia(1) saturate(5) hue-rotate(130deg) brightness(\${0.78 + ghostIndex * 0.08})\`;
      g.drawImage(source, 0, 0, ctx.width, ctx.height);
      g.restore();
    };

    for (let ghost = ghosts; ghost >= 1; ghost -= 1) {
      const fade = persistence * (1 - ghost / (ghosts + 1)) * (0.55 + holdProgress * 0.45);
      drawExposure(heldStep - ghost, fade, ghost);
    }
    drawExposure(heldStep, 1, 0);

    const railWidth = Math.min(ctx.width * 0.66, 360);
    const railX = (ctx.width - railWidth) * 0.5;
    const railY = ctx.height - 28;
    g.fillStyle = '#0D0E10D9';
    g.fillRect(railX - 7, railY - 8, railWidth + 14, 18);
    const cellWidth = railWidth / steps;
    for (let step = 0; step < steps; step += 1) {
      g.globalAlpha = step === heldStep ? 0.95 : 0.18;
      g.fillStyle = step === heldStep ? '#E9FDFF' : signal;
      g.fillRect(railX + step * cellWidth, railY, Math.max(1, cellWidth - 2), step === heldStep ? 5 : 2);
    }
    g.globalAlpha = 1;
    g.fillStyle = '#E9FDFF';
    g.font = '10px monospace';
    g.fillText(\`Q \${String(heldStep).padStart(2, '0')}/\${steps}\`, railX, railY - 11);
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
