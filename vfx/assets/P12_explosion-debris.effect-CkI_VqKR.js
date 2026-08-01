const n=`import type { CanvasStatefulKernel, FxKernel } from '../../src/fx/types';

interface Debris {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  scale: number;
  sides: number;
  alpha: number;
}

interface DebrisState {
  debris: Debris[];
}

const TAU = Math.PI * 2;

const stateful: CanvasStatefulKernel<DebrisState> = {
  init: (ctx) => {
    const count = Math.min(180, Math.max(24, Math.round(Number(ctx.params.count ?? 96))));
    const force = Math.min(2, Math.max(0.4, Number(ctx.params.force ?? 1.15)));
    const speedScale = Math.min(ctx.width, ctx.height) * force;

    return {
      debris: Array.from({ length: count }, (_, index) => {
        const angle = -Math.PI * (0.1 + ctx.random(\`debris:\${index}:arc\`) * 0.8);
        const speed = speedScale * (0.22 + ctx.random(\`debris:\${index}:speed\`) * 0.48);
        return {
          x: ctx.width * (0.5 + (ctx.random(\`debris:\${index}:x\`) - 0.5) * 0.045),
          y: ctx.height * (0.53 + (ctx.random(\`debris:\${index}:y\`) - 0.5) * 0.035),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          angle: ctx.random(\`debris:\${index}:angle\`) * TAU,
          spin: (ctx.random(\`debris:\${index}:spin\`) * 2 - 1) * 6.5,
          scale: 0.35 + ctx.random(\`debris:\${index}:scale\`) * 1.15,
          sides: 3 + Math.floor(ctx.random(\`debris:\${index}:sides\`) * 3),
          alpha: 0.55 + ctx.random(\`debris:\${index}:alpha\`) * 0.45,
        };
      }),
    };
  },
  step: (state, ctx) => {
    const dt = 1 / Math.max(1, ctx.fps);
    const gravity = Math.min(2, Math.max(0, Number(ctx.params.gravity ?? 0.82))) * ctx.height * 0.38;
    const drag = Math.pow(0.988, dt * 30);

    return {
      debris: state.debris.map((piece) => {
        const vx = piece.vx * drag;
        const vy = (piece.vy + gravity * dt) * drag;
        return {
          ...piece,
          x: piece.x + vx * dt,
          y: piece.y + vy * dt,
          vx,
          vy,
          angle: piece.angle + piece.spin * dt,
        };
      }),
    };
  },
  render: (g, state, ctx) => {
    const size = Math.min(18, Math.max(2, Number(ctx.params.size ?? 8)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame % Math.max(1, ctx.durationInFrames)) / Math.max(1, ctx.durationInFrames);
    const fade = Math.min(1, (1 - phase) * 5);

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);

    g.save();
    g.fillStyle = signal;
    g.strokeStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = size * 1.4;
    g.lineJoin = 'round';
    for (const piece of state.debris) {
      g.save();
      g.translate(piece.x, piece.y);
      g.rotate(piece.angle);
      g.globalAlpha = piece.alpha * fade;
      g.beginPath();
      for (let point = 0; point < piece.sides; point += 1) {
        const angle = (point / piece.sides) * TAU;
        const radius = size * piece.scale * (point % 2 === 0 ? 1 : 0.62);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.58;
        if (point === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.closePath();
      g.fill();
      g.globalAlpha *= 0.8;
      g.lineWidth = 1;
      g.stroke();
      g.restore();
    }
    g.restore();
  },
};

const kernel = { kind: 'canvas', stateful } satisfies FxKernel;

export default kernel;
`;export{n as default};
