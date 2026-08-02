const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const tile = Math.min(72, Math.max(28, Number(ctx.params.tile ?? 46)));
    const speed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 2))));
    const gloss = Math.min(1, Math.max(0.2, Number(ctx.params.gloss ?? 0.68)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const travel = ctx.t * tile * speed;
    const phase = ctx.t * Math.PI * 2;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0B1014' }}>
        <div
          style={{
            position: 'absolute',
            inset: -tile * 2,
            transform: 'rotate(45deg) scale(1.35)',
            backgroundImage: \`linear-gradient(90deg, \${signal}16 1px, transparent 1px), linear-gradient(\${signal}16 1px, transparent 1px)\`,
            backgroundSize: \`\${tile}px \${tile}px\`,
            backgroundPosition: \`\${travel}px \${-travel}px\`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '-70% -30%',
            transform: \`translateX(\${Math.sin(phase) * 24}%) rotate(-18deg)\`,
            background: \`repeating-linear-gradient(90deg, transparent 0 \${tile * 1.15}px, \${signal}08 \${tile * 1.15}px \${tile * 1.7}px, \${signal}44 \${tile * 1.82}px, transparent \${tile * 2.35}px \${tile * 3}px)\`,
            filter: \`blur(\${3 + gloss * 8}px)\`,
            opacity: gloss,
            mixBlendMode: 'screen',
          }}
        />
        <div style={{ position: 'absolute', inset: '16%', opacity: 0.25, filter: \`drop-shadow(0 0 10px \${signal}33)\` }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', inset: 0, background: \`radial-gradient(circle at 50% 50%, transparent 22%, \${signal}08 58%, #050708A8 100%)\`, pointerEvents: 'none' }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
