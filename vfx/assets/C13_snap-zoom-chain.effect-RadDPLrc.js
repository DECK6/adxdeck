const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const steps = Math.round(Number(ctx.params.steps ?? 5));
    const range = Number(ctx.params.range ?? 0.48);
    const shake = Number(ctx.params.shake ?? 7);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const beat = ctx.t * steps;
    const index = Math.floor(beat) % steps;
    const local = beat - Math.floor(beat);
    const punch = Math.pow(1 - local, 4);
    const direction = index % 2 ? -1 : 1;
    const scale = 1 + direction * range * (index + 1) / steps + punch * range * 0.22;
    const offset = punch * shake * direction;
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '-12%', opacity: 0.12, backgroundImage: \`linear-gradient(\${signal} 1px,transparent 1px),linear-gradient(90deg,\${signal} 1px,transparent 1px)\`, backgroundSize: '64px 64px', transform: \`scale(\${scale * 0.84}) translate(\${offset}px,\${-offset * 0.5}px)\` }} />
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', transform: \`translate3d(\${offset}px,\${-offset * 0.45}px,0) scale(\${scale})\`, filter: \`blur(\${punch * 1.8}px) drop-shadow(0 0 12px \${signal})\` }}>{ctx.subjectNode}</div>
        {Array.from({ length: steps }, (_, i) => <div key={i} style={{ position: 'absolute', left: \`\${12 + i * 76 / Math.max(1, steps - 1)}%\`, bottom: '8%', width: i === index ? 30 : 8, height: 3, background: signal, opacity: i === index ? 0.9 : 0.22 }} />)}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
