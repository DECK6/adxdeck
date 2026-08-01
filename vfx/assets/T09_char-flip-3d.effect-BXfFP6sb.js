const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? 'DEXA VFX');
    const stagger = Number(ctx.params.stagger ?? 0.065);
    const depth = Number(ctx.params.depth ?? 80);
    const direction = String(ctx.params.direction ?? 'alternate');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const outro = Math.min(1, Math.max(0, (1 - ctx.t) / 0.1));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', perspective: ctx.width * 1.25 }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.09 * outro }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            display: 'flex',
            transform: 'translate(-50%, -50%)',
            transformStyle: 'preserve-3d',
            color: signal,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: Math.max(18, Math.min(ctx.width * 0.095, ctx.height * 0.28)),
            fontWeight: 800,
            letterSpacing: '0.04em',
            whiteSpace: 'pre',
          }}
        >
          {phrase.split('').map((character, index) => {
            const raw = Math.min(1, Math.max(0, (ctx.t - 0.06 - index * stagger) / 0.22));
            const progress = raw * raw * (3 - 2 * raw);
            const sign = direction === 'alternate' && index % 2 === 1 ? -1 : 1;
            const rotation = sign * (1 - progress) * 92;
            return (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  minWidth: character === ' ' ? '0.55em' : undefined,
                  opacity: progress * outro,
                  transformOrigin: '50% 58%',
                  transformStyle: 'preserve-3d',
                  transform: \`translateZ(\${-(1 - progress) * depth}px) translateY(\${(1 - progress) * ctx.height * 0.06}px) rotateX(\${rotation}deg)\`,
                  filter: \`brightness(\${0.45 + progress * 0.55}) blur(\${(1 - progress) * 2}px)\`,
                  textShadow: \`0 \${Math.max(2, depth * 0.08)}px \${Math.max(8, depth * 0.22)}px \${signal}52\`,
                  backfaceVisibility: 'hidden',
                }}
              >
                {character}
              </span>
            );
          })}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
