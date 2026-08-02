const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const depth = Number(ctx.params.depth ?? 180);
    const tilt = Number(ctx.params.tilt ?? -7);
    const turns = Number(ctx.params.turns ?? 1);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const angle = ctx.t * 360 * turns;
    const face = (rotation: number, label: string) => (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', backfaceVisibility: 'hidden', border: \`2px solid \${signal}\`, background: '#0D0E10', transform: \`rotateY(\${rotation}deg) translateZ(\${depth}px)\`, boxShadow: \`inset 0 0 44px \${signal}22\` }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', filter: \`drop-shadow(0 0 12px \${signal})\` }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', right: 18, bottom: 14, color: signal, fontFamily: 'monospace', fontSize: 12, letterSpacing: 3 }}>{label}</div>
      </div>
    );
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', perspective: 1100, display: 'grid', placeItems: 'center' }}>
        <div style={{ position: 'relative', width: '64%', height: '58%', transformStyle: 'preserve-3d', transform: \`rotateX(\${tilt}deg) rotateY(\${angle}deg)\` }}>
          {face(0, 'SCENE A')}{face(90, 'SCENE B')}{face(180, 'SCENE C')}{face(270, 'SCENE D')}
        </div>
        <div style={{ position: 'absolute', left: '15%', right: '15%', bottom: '11%', height: 2, background: signal, transform: \`scaleX(\${0.25 + 0.75 * Math.abs(Math.sin(ctx.t * Math.PI * 2))})\`, opacity: 0.45 }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
