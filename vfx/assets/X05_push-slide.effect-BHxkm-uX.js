const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const direction = String(ctx.params.direction ?? 'left');
    const overshoot = Number(ctx.params.overshoot ?? 0.06);
    const edgeWidth = Number(ctx.params.edgeWidth ?? 6);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame % ctx.durationInFrames) / ctx.durationInFrames;
    const progress = (1 - Math.cos(phase * Math.PI * 2)) * 0.5;
    const travel = progress + Math.sin(progress * Math.PI) * overshoot;
    const vectors: Record<string, [number, number]> = {
      left: [-1, 0],
      right: [1, 0],
      up: [0, -1],
      down: [0, 1],
    };
    const [dx, dy] = vectors[direction] ?? vectors.left;
    const distanceX = dx * ctx.width;
    const distanceY = dy * ctx.height;
    const edgeStyle = dx !== 0
      ? { top: 0, bottom: 0, width: edgeWidth, [dx < 0 ? 'left' : 'right']: 0 }
      : { left: 0, right: 0, height: edgeWidth, [dy < 0 ? 'top' : 'bottom']: 0 };

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            transform: \`translate3d(\${distanceX * travel}px, \${distanceY * travel}px, 0)\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            background: '#0D0E10',
            transform: \`translate3d(\${-distanceX * (1 - travel)}px, \${-distanceY * (1 - travel)}px, 0)\`,
            boxShadow: \`0 0 \${edgeWidth * 3}px \${signal}\`,
          }}
        >
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: \`repeating-linear-gradient(\${dx === 0 ? '0deg' : '90deg'}, transparent 0 46px, \${signal} 46px 48px)\` }} />
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', transform: 'scale(1.08)', filter: \`drop-shadow(0 0 14px \${signal})\` }}>
            {ctx.subjectNode}
          </div>
          <div style={{ position: 'absolute', background: signal, boxShadow: \`0 0 \${edgeWidth * 2}px \${signal}\`, ...edgeStyle }} />
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
