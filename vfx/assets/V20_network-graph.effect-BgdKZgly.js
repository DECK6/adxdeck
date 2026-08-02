const n=`import type { CanvasStatefulKernel, FxKernel } from '../../src/fx/types';

interface NodeState { x: number; y: number; vx: number; vy: number; tx: number; ty: number }
interface NetworkState { nodes: NodeState[] }

const stateful: CanvasStatefulKernel<NetworkState> = {
  init: (ctx) => {
    const count = Math.max(8, Math.min(24, Math.round(Number(ctx.params.nodes ?? 16))));
    const radius = Math.min(ctx.width, ctx.height) * 0.31;
    const nodes = Array.from({ length: count }, (_, index) => {
      const cluster = index % 3;
      const angle = (index / count) * Math.PI * 2 + cluster * 0.31;
      const ring = radius * (0.48 + ctx.random(\`ring:\${index}\`) * 0.52);
      const tx = ctx.width / 2 + Math.cos(angle) * ring;
      const ty = ctx.height / 2 + Math.sin(angle) * ring * 0.72;
      return {
        x: ctx.width / 2 + (ctx.random(\`x:\${index}\`) - 0.5) * ctx.width * 0.08,
        y: ctx.height / 2 + (ctx.random(\`y:\${index}\`) - 0.5) * ctx.height * 0.08,
        vx: 0,
        vy: 0,
        tx,
        ty,
      };
    });
    return { nodes };
  },
  step: (state, ctx) => {
    const tension = Math.max(0.2, Math.min(1, Number(ctx.params.tension ?? 0.62)));
    const damping = Math.max(0.75, Math.min(0.98, Number(ctx.params.damping ?? 0.9)));
    const dt = 1 / Math.max(1, ctx.fps);
    return {
      nodes: state.nodes.map((node, index) => {
        let ax = (node.tx - node.x) * tension * 8;
        let ay = (node.ty - node.y) * tension * 8;
        for (let otherIndex = 0; otherIndex < state.nodes.length; otherIndex += 1) {
          if (otherIndex === index) continue;
          const other = state.nodes[otherIndex];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distanceSquared = Math.max(400, dx * dx + dy * dy);
          ax += (dx / Math.sqrt(distanceSquared)) * 18000 / distanceSquared;
          ay += (dy / Math.sqrt(distanceSquared)) * 18000 / distanceSquared;
        }
        const vx = (node.vx + ax * dt) * damping;
        const vy = (node.vy + ay * dt) * damping;
        return { ...node, x: node.x + vx, y: node.y + vy, vx, vy };
      }),
    };
  },
  render: (g, state, ctx) => {
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const nodeSize = Math.max(3, Math.min(12, Number(ctx.params.nodeSize ?? 6)));
    const reveal = 0.5 - Math.cos(ctx.t * Math.PI * 2) * 0.5;
    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.1;
      g.drawImage(ctx.subject.bitmap, ctx.width * 0.2, ctx.height * 0.2, ctx.width * 0.6, ctx.height * 0.6);
      g.restore();
    }
    g.save();
    g.strokeStyle = signal;
    g.lineWidth = 1.5;
    for (let index = 0; index < state.nodes.length; index += 1) {
      const node = state.nodes[index];
      const targets = [(index + 1) % state.nodes.length, (index + 3 + (index % 4)) % state.nodes.length];
      for (const targetIndex of targets) {
        const target = state.nodes[targetIndex];
        const edgeProgress = Math.max(0, Math.min(1, reveal * 1.35 - index / state.nodes.length * 0.35));
        g.globalAlpha = 0.12 + edgeProgress * 0.3;
        g.beginPath();
        g.moveTo(node.x, node.y);
        g.lineTo(node.x + (target.x - node.x) * edgeProgress, node.y + (target.y - node.y) * edgeProgress);
        g.stroke();
      }
    }
    state.nodes.forEach((node, index) => {
      const local = Math.max(0, Math.min(1, reveal * 1.5 - index / state.nodes.length * 0.5));
      g.globalAlpha = 0.25 + local * 0.75;
      g.fillStyle = signal;
      g.shadowColor = signal;
      g.shadowBlur = nodeSize * 2 * local;
      g.beginPath();
      g.arc(node.x, node.y, nodeSize * (0.35 + local * 0.65) * (index % 5 === 0 ? 1.7 : 1), 0, Math.PI * 2);
      g.fill();
    });
    g.restore();
  },
};

const kernel = { kind: 'canvas', stateful } satisfies FxKernel;
export default kernel;
`;export{n as default};
