const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const intensity = Number(ctx.params.intensity ?? 0.72);
    const spread = Number(ctx.params.spread ?? 32);
    const drift = Number(ctx.params.drift ?? 0.24);
    const hotspots = Math.max(2, Math.round(Number(ctx.params.hotspots ?? 3)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = (ctx.frame % duration) / duration;
    const turn = phase * Math.PI * 2;
    const fieldX = 50 + Math.sin(turn) * 34 * drift * 2.5;
    const fieldY = 50 + Math.cos(turn * 2) * 22 * drift * 2.5;
    const mask = \`radial-gradient(ellipse at \${fieldX}% \${fieldY}%, black 0%, black 21%, transparent 68%)\`;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0 }}>{ctx.subjectNode}</div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            maskImage: mask,
            WebkitMaskImage: mask,
            transform: \`translate3d(\${Math.sin(turn) * drift * 18}px, \${Math.cos(turn) * drift * 12}px, 0) scale(\${1 + intensity * 0.025})\`,
            filter: \`brightness(\${1.15 + intensity * 1.15}) blur(\${1 + intensity * 2.4}px) drop-shadow(0 0 \${spread}px \${signal})\`,
            mixBlendMode: 'screen',
            opacity: 0.28 + intensity * 0.48,
          }}
        >
          {ctx.subjectNode}
        </div>
        {Array.from({ length: hotspots }, (_, index) => {
          const local = turn + (index / hotspots) * Math.PI * 2;
          const x = 50 + Math.cos(local) * (18 + index * 6) * drift * 2.7;
          const y = 50 + Math.sin(local * (index % 2 === 0 ? 1.5 : -1.25)) * (14 + index * 4) * drift * 2.4;
          const size = spread * (1.25 + index * 0.28);
          const glow = 0.52 + 0.48 * Math.sin(local + Math.PI / 2) ** 2;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: \`\${x}%\`,
                top: \`\${y}%\`,
                width: size,
                height: size,
                borderRadius: '50%',
                background: \`radial-gradient(circle, #FFFFFF\${intensity > 0.65 ? 'B8' : '80'} 0 5%, \${signal}8F 13%, \${signal}30 38%, transparent 72%)\`,
                filter: \`blur(\${2 + spread * 0.08}px)\`,
                opacity: intensity * glow,
                transform: 'translate(-50%, -50%)',
                mixBlendMode: 'screen',
              }}
            />
          );
        })}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
