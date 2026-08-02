const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const altitude = Number(ctx.params.altitude ?? 0.68);
    const radius = Number(ctx.params.radius ?? 0.52);
    const turns = Number(ctx.params.turns ?? 2);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * Math.PI * 2 * turns;
    const x = Math.cos(phase) * ctx.width * radius * 0.1;
    const y = Math.sin(phase) * ctx.height * radius * 0.08;
    const scale = 1.12 - altitude * 0.28 + Math.sin(phase * 0.5) * 0.025;
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '-35%', transform: \`rotate(\${phase * 180 / Math.PI}deg) scale(\${0.8 + altitude * 0.45})\`, opacity: 0.18, backgroundImage: \`radial-gradient(circle,transparent 0 18%,\${signal}55 18.3% 18.7%,transparent 19%),linear-gradient(\${signal}33 1px,transparent 1px),linear-gradient(90deg,\${signal}33 1px,transparent 1px)\`, backgroundSize: '100% 100%,72px 72px,72px 72px' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', transform: \`translate3d(\${x}px,\${y}px,0) scale(\${scale}) rotate(\${Math.sin(phase) * 2.5}deg)\`, filter: \`drop-shadow(\${-x * 0.2}px \${22 + altitude * 34}px \${18 + altitude * 22}px #000) drop-shadow(0 0 10px \${signal})\` }}>{ctx.subjectNode}</div>
        <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', inset: '4%', width: '92%', height: '92%', opacity: 0.62 }}>
          <ellipse cx="500" cy="500" rx={260 * radius} ry={150 * radius} fill="none" stroke={signal} strokeWidth="3" strokeDasharray="12 18" />
          <circle cx={500 + Math.cos(phase) * 260 * radius} cy={500 + Math.sin(phase) * 150 * radius} r="13" fill={signal} />
          <path d="M470 500 H530 M500 470 V530" stroke={signal} strokeWidth="2" />
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
