const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const sweepSize = Number(ctx.params.sweepSize ?? 28);
    const intensity = Number(ctx.params.intensity ?? 0.82);
    const offset = Number(ctx.params.offset ?? 7);
    const laps = Math.max(1, Math.round(Number(ctx.params.laps ?? 2)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = (ctx.frame % duration) / duration;
    const angle = phase * Math.PI * 2 * laps - Math.PI / 2;
    const x = 50 + Math.cos(angle) * 38;
    const y = 50 + Math.sin(angle) * 35;
    const mask = \`radial-gradient(circle at \${x}% \${y}%, black 0%, black \${sweepSize * 0.46}%, transparent \${sweepSize}%)\`;
    const rimX = Math.cos(angle) * offset;
    const rimY = Math.sin(angle) * offset;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.56 + intensity * 0.34 }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            maskImage: mask,
            WebkitMaskImage: mask,
            transform: \`translate3d(\${rimX}px, \${rimY}px, 0)\`,
            filter: \`brightness(\${1.4 + intensity * 1.8}) drop-shadow(\${-rimX}px \${-rimY}px \${5 + intensity * 14}px \${signal})\`,
            mixBlendMode: 'screen',
            opacity: 0.58 + intensity * 0.42,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: \`\${x}%\`,
            top: \`\${y}%\`,
            width: sweepSize * 1.3,
            height: sweepSize * 1.3,
            borderRadius: '50%',
            border: \`2px solid \${signal}\`,
            background: \`radial-gradient(circle, #FFFFFFD8 0 7%, \${signal}80 12%, \${signal}20 42%, transparent 72%)\`,
            boxShadow: \`0 0 \${12 + intensity * 22}px \${signal}\`,
            opacity: 0.72 + intensity * 0.28,
            transform: 'translate(-50%, -50%)',
            mixBlendMode: 'screen',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
