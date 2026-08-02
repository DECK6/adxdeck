const t=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const rating = Math.min(5, Math.max(1, Number(ctx.params.rating ?? 4.5)));
    const bounce = Math.min(1, Math.max(0.2, Number(ctx.params.bounce ?? 0.7)));
    const mode = String(ctx.params.mode ?? 'precise');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t % 1;
    const sweep = phase < 0.58 ? phase / 0.58 : phase < 0.78 ? 1 : phase < 0.96 ? 1 - (phase - 0.78) / 0.18 : 0;
    const starSize = Math.min(ctx.width * 0.115, ctx.height * 0.2);
    const gap = starSize * 0.16;
    const totalWidth = starSize * 5 + gap * 4;
    const startX = (ctx.width - totalWidth) * 0.5;
    const centerY = ctx.height * 0.49;
    const starPath = 'polygon(50% 4%, 61% 36%, 96% 37%, 68% 57%, 78% 91%, 50% 71%, 22% 91%, 32% 57%, 4% 37%, 39% 36%)';
    const effectiveRating = mode === 'whole' ? Math.round(rating) : rating;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F7FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.09, transform: 'scale(0.88)' }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '50%', top: centerY - starSize * 1.45, transform: 'translateX(-50%)', color: '#F7FAFC', fontSize: Math.max(12, starSize * 0.22), fontWeight: 800, letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>RATE DEXA VFX</div>
        <div style={{ position: 'absolute', left: '50%', top: centerY - starSize * 1.08, transform: 'translateX(-50%)', color: '#9CA8AF', fontSize: Math.max(8, starSize * 0.12), letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>SIGNAL QUALITY FEEDBACK</div>
        {Array.from({ length: 5 }, (_, index) => {
          const local = clamp01(sweep * 6 - index);
          const eased = 1 - Math.pow(1 - local, 3);
          const targetFill = clamp01(effectiveRating - index);
          const fill = targetFill * eased;
          const pop = Math.sin(local * Math.PI) * bounce;
          const x = startX + index * (starSize + gap);
          return (
            <div key={index} style={{ position: 'absolute', left: x, top: centerY - starSize * 0.5, width: starSize, height: starSize, transform: \`translateY(\${-pop * starSize * 0.18}px) scale(\${0.86 + eased * 0.14 + pop * 0.16}) rotate(\${(1 - eased) * -12}deg)\`, filter: fill > 0 ? \`drop-shadow(0 0 \${starSize * 0.14}px \${signal}88)\` : 'none' }}>
              <div style={{ position: 'absolute', inset: 0, clipPath: starPath, background: '#252B30' }} />
              <div style={{ position: 'absolute', left: 0, top: 0, width: \`\${fill * 100}%\`, height: '100%', overflow: 'hidden' }}>
                <div style={{ width: starSize, height: starSize, clipPath: starPath, background: \`linear-gradient(145deg, #EAFDFF 0%, \${signal} 52%, #239AA8 100%)\` }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, clipPath: starPath, background: 'transparent', boxShadow: 'inset 0 0 0 2px #718089' }} />
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: '50%', top: centerY + starSize * 0.88, transform: 'translateX(-50%)', display: 'flex', alignItems: 'baseline', gap: starSize * 0.08 }}>
          <span style={{ color: signal, fontSize: Math.max(24, starSize * 0.48), fontWeight: 900 }}>{(effectiveRating * clamp01(sweep * 1.35)).toFixed(1)}</span>
          <span style={{ color: '#A5B0B7', fontSize: Math.max(9, starSize * 0.15), letterSpacing: '0.08em' }}>/ 5.0 VERIFIED</span>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
