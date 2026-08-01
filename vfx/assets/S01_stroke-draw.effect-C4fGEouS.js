const e=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const thickness = Number(ctx.params.thickness ?? 4);
    const speed = Number(ctx.params.speed ?? 1);
    const glow = Number(ctx.params.glow ?? 0.55);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const cycle = (ctx.t * speed) % 1;
    const progress = cycle < 0.72 ? cycle / 0.72 : 1 - (cycle - 0.72) / 0.28;
    const eased = progress * progress * (3 - 2 * progress);
    const pathLength = 1000;
    const dashOffset = pathLength * (1 - eased);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.14 + eased * 0.86,
            clipPath: \`inset(\${50 * (1 - eased)}% \${50 * (1 - eased)}%)\`,
            filter: \`drop-shadow(0 0 \${glow * 10}px \${signal})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <svg
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: '9%', width: '82%', height: '82%' }}
        >
          <g
            fill="none"
            stroke={signal}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={pathLength}
            strokeDasharray={pathLength}
            strokeDashoffset={dashOffset}
            style={{ filter: \`drop-shadow(0 0 \${3 + glow * 12}px \${signal})\` }}
          >
            <path d="M500 112 L838 696 L500 500 Z" pathLength={pathLength} />
            <path d="M500 500 L162 696 L500 888 Z" pathLength={pathLength} />
            <path d="M162 696 L500 112 L500 500 Z" pathLength={pathLength} />
          </g>
          <circle cx="500" cy="500" r={10 + eased * 12} fill={signal} opacity={eased} />
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
