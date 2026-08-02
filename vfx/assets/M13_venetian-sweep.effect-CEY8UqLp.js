const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const slats = Math.round(Number(ctx.params.slats ?? 9));
    const angle = Number(ctx.params.angle ?? -12);
    const stagger = Number(ctx.params.stagger ?? 0.48);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const cycle = (1 - Math.cos(ctx.t * Math.PI * 2)) * 0.5;
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, filter: 'grayscale(1)' }}>{ctx.subjectNode}</div>
        {Array.from({ length: slats }, (_, index) => {
          const delay = index / Math.max(1, slats - 1) * stagger;
          const local = Math.max(0, Math.min(1, (cycle - delay) / Math.max(0.01, 1 - stagger)));
          const eased = local * local * (3 - 2 * local);
          const top = index * 100 / slats;
          return (
            <div key={index} style={{ position: 'absolute', inset: 0, clipPath: \`inset(\${top}% 0 \${100 - top - 100 / slats}% 0)\`, transform: \`translateX(\${(1 - eased) * (index % 2 ? 1 : -1) * 62}%) skewX(\${angle * (1 - eased)}deg)\`, transformOrigin: 'center' }}>
              <div style={{ position: 'absolute', inset: 0 }}>{ctx.subjectNode}</div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: \`\${top}%\`, height: 2, background: signal, opacity: 0.24 + eased * 0.55 }} />
            </div>
          );
        })}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
