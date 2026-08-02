const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const lift = Number(ctx.params.lift ?? 0.34);
    const sway = Number(ctx.params.sway ?? 0.55);
    const stringRatio = Number(ctx.params.string ?? 0.22);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = TAU * ctx.t;
    const rise = 0.5 - 0.5 * Math.cos(phase);
    const driftX = ctx.width * sway * (0.055 * Math.sin(phase) + 0.018 * Math.sin(phase * 2));
    const driftY = -ctx.height * lift * rise + ctx.height * 0.012 * Math.sin(phase * 3);
    const roll = sway * (4.5 * Math.sin(phase + 0.7) + 1.8 * Math.sin(phase * 2));
    const stretch = 1 + 0.035 * Math.sin(phase * 2 + 0.4);
    const stringLength = ctx.height * stringRatio;
    const anchorY = ctx.height * 0.65;
    const knotX = ctx.width / 2 + driftX;
    const knotY = anchorY + driftY;
    const stringPoints = Array.from({ length: 8 }, (_, index) => {
      const u = index / 7;
      const lag = Math.sin(phase - u * 1.8) * sway * ctx.width * 0.026 * u;
      return \`\${(knotX + lag).toFixed(1)},\${(knotY + stringLength * u).toFixed(1)}\`;
    }).join(' ');
    const shadowScale = 1 - rise * 0.42;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            left: ctx.width / 2 + driftX * 0.4,
            top: ctx.height * 0.88,
            width: ctx.width * 0.27 * shadowScale,
            height: ctx.height * 0.045 * shadowScale,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: \`radial-gradient(closest-side, \${signal}55, transparent)\`,
            opacity: 0.5 - rise * 0.28,
          }}
        />
        <svg
          viewBox={\`0 0 \${ctx.width} \${ctx.height}\`}
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <polyline
            points={stringPoints}
            fill="none"
            stroke={signal}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.72"
          />
          <line
            x1={ctx.width * 0.12}
            y1={ctx.height * 0.88}
            x2={ctx.width * 0.88}
            y2={ctx.height * 0.88}
            stroke={signal}
            strokeWidth="1"
            strokeDasharray="3 9"
            opacity="0.18"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: \`translate3d(\${driftX}px, \${driftY}px, 0) rotate(\${roll}deg) scale(\${1 / stretch}, \${stretch})\`,
            transformOrigin: '50% 62%',
            filter: \`drop-shadow(0 0 \${8 + rise * 15}px \${signal}55)\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '7%',
            bottom: '7%',
            color: signal,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: Math.max(8, ctx.width * 0.014),
            letterSpacing: '0.16em',
            opacity: 0.7,
          }}
        >
          BUOYANCY {Math.round(rise * 100).toString().padStart(3, '0')}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
