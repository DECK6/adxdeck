const t=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? 'DEXA');
    const speed = Number(ctx.params.speed ?? 1);
    const stroke = Number(ctx.params.stroke ?? 2.5);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = (ctx.frame % duration) / duration;
    const travel = phase < 0.72 ? clamp01((phase - 0.05) / 0.52) : clamp01((0.98 - phase) / 0.2);
    const progress = 1 - Math.pow(1 - travel, 2.2 * speed);
    const width = Math.min(ctx.width * 0.8, Math.max(260, phrase.length * ctx.width * 0.14));
    const height = Math.min(ctx.height * 0.42, width * 0.34);
    const dash = width * 2.1;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', display: 'grid', placeItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12 + progress * 0.08, transform: \`scale(\${0.98 + progress * 0.02})\` }}>
          {ctx.subjectNode}
        </div>
        <svg width={width} height={height} viewBox="0 0 1000 320" style={{ position: 'relative', overflow: 'visible' }}>
          <text
            x="500"
            y="205"
            textAnchor="middle"
            style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive", fontSize: 210, fontWeight: 700, letterSpacing: 12, fill: 'transparent', stroke: \`\${signal}20\`, strokeWidth: stroke + 2 }}
          >
            {phrase}
          </text>
          <text
            x="500"
            y="205"
            textAnchor="middle"
            pathLength={dash}
            style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive", fontSize: 210, fontWeight: 700, letterSpacing: 12, fill: '#F7FAFC', stroke: signal, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round', strokeDasharray: dash, strokeDashoffset: dash * (1 - progress), filter: \`drop-shadow(0 0 \${5 + stroke * 2}px \${signal})\` }}
          >
            {phrase}
          </text>
          <path d="M 115 238 C 320 278, 650 258, 888 225" pathLength="1" style={{ fill: 'none', stroke: signal, strokeWidth: stroke * 0.7, strokeLinecap: 'round', strokeDasharray: 1, strokeDashoffset: 1 - progress, opacity: 0.72 }} />
          <circle cx={115 + 773 * progress} cy={238 + 10 * Math.sin(progress * Math.PI)} r={4 + stroke} style={{ fill: signal, opacity: travel < 1 ? 0.92 : 0, filter: \`drop-shadow(0 0 9px \${signal})\` }} />
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
