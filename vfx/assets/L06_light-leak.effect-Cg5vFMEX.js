const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const intensity = Number(ctx.params.intensity ?? 0.68);
    const size = Number(ctx.params.size ?? 0.82);
    const drift = Math.max(1, Math.round(Number(ctx.params.drift ?? 1)));
    const source = String(ctx.params.source ?? 'left');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ((ctx.frame % duration) / duration) * Math.PI * 2 * drift;
    const x = source === 'right'
      ? 108 - Math.cos(phase) * 13
      : source === 'orbit'
        ? 50 + Math.cos(phase) * 48
        : -8 + Math.cos(phase) * 13;
    const y = 50 + Math.sin(phase) * (source === 'orbit' ? 38 : 24);
    const breathe = 0.82 + (0.5 + 0.5 * Math.sin(phase - Math.PI / 2)) * 0.34;
    const width = ctx.width * size * 1.15 * breathe;
    const height = ctx.height * size * 2.4 * breathe;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0 }}>{ctx.subjectNode}</div>
        <div
          style={{
            position: 'absolute',
            left: \`\${x}%\`,
            top: \`\${y}%\`,
            width,
            height,
            transform: \`translate(-50%, -50%) rotate(\${18 + Math.sin(phase) * 12}deg)\`,
            borderRadius: '50%',
            background: \`radial-gradient(ellipse at center, \${signal} 0%, transparent 68%)\`,
            filter: \`blur(\${18 + size * 26}px)\`,
            mixBlendMode: 'screen',
            opacity: intensity * 0.72,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: \`\${x}%\`,
            top: '-30%',
            width: Math.max(18, width * 0.16),
            height: '160%',
            transform: \`translateX(-50%) rotate(\${8 + Math.cos(phase) * 5}deg)\`,
            background: \`linear-gradient(90deg, transparent, \${signal}, transparent)\`,
            filter: \`blur(\${12 + size * 18}px)\`,
            mixBlendMode: 'screen',
            opacity: intensity * 0.28,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: \`radial-gradient(circle at \${x}% \${y}%, \${signal} 0%, transparent \${Math.max(24, size * 54)}%)\`,
            mixBlendMode: 'screen',
            opacity: intensity * 0.14,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
