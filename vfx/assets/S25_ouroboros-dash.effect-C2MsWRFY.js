const s=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const segments = Math.round(Number(ctx.params.segments ?? 24));
    const speed = Number(ctx.params.speed ?? 1.25);
    const pulse = Number(ctx.params.pulse ?? 0.62);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU * speed;
    const radius = 330;
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', display: 'grid', placeItems: 'center' }}>
        <div style={{ position: 'absolute', inset: '30%', opacity: 0.45, filter: \`drop-shadow(0 0 12px \${signal})\` }}>{ctx.subjectNode}</div>
        <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', inset: '4%', width: '92%', height: '92%' }}>
          <circle cx="500" cy="500" r={radius} fill="none" stroke={signal} strokeWidth="2" opacity="0.12" />
          {Array.from({ length: segments }, (_, index) => {
            const a = phase + (index / segments) * TAU;
            const chase = (Math.cos(a - phase * 1.73) + 1) * 0.5;
            const length = 34 + chase * 54 * pulse;
            const x1 = 500 + Math.cos(a) * (radius - length * 0.5);
            const y1 = 500 + Math.sin(a) * (radius - length * 0.5);
            const x2 = 500 + Math.cos(a) * (radius + length * 0.5);
            const y2 = 500 + Math.sin(a) * (radius + length * 0.5);
            return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={signal} strokeWidth={5 + chase * 7} strokeLinecap="round" opacity={0.2 + chase * 0.78} />;
          })}
          <path d="M804 324 L856 344 L814 378 Z" fill={signal} transform={\`rotate(\${phase * 180 / Math.PI} 500 500)\`} />
          <circle cx={500 + Math.cos(phase * 1.7) * radius} cy={500 + Math.sin(phase * 1.7) * radius} r="13" fill="#0D0E10" stroke={signal} strokeWidth="5" />
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{s as default};
