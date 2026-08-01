const e=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const thickness = Number(ctx.params.thickness ?? 12);
    const cycles = Number(ctx.params.cycles ?? 1);
    const glow = Number(ctx.params.glow ?? 0.58);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const rawProgress = (ctx.t * cycles) % 1;
    const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);
    const radius = 315;
    const circumference = Math.PI * 2 * radius;
    const dashOffset = circumference * (1 - progress);
    const percentage = Math.round(progress * 100);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: '22%',
            transform: \`scale(\${0.92 + progress * 0.08})\`,
            transformOrigin: 'center',
            opacity: 0.24 + progress * 0.76,
            filter: \`drop-shadow(0 0 \${glow * 12}px \${signal})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <svg
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: '8%', width: '84%', height: '84%' }}
        >
          <circle cx="500" cy="500" r={radius} fill="none" stroke={signal} strokeWidth={thickness} opacity="0.12" />
          <circle
            cx="500"
            cy="500"
            r={radius}
            fill="none"
            stroke={signal}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 500 500)"
            style={{ filter: \`drop-shadow(0 0 \${4 + glow * 14}px \${signal})\` }}
          />
          <circle
            cx={500 + Math.cos(progress * Math.PI * 2 - Math.PI / 2) * radius}
            cy={500 + Math.sin(progress * Math.PI * 2 - Math.PI / 2) * radius}
            r={thickness * 0.72}
            fill={signal}
            opacity={progress > 0.01 ? 1 : 0}
          />
          <text
            x="500"
            y="530"
            fill={signal}
            fontSize="118"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontWeight="700"
            textAnchor="middle"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {percentage}%
          </text>
          <text
            x="500"
            y="600"
            fill={signal}
            opacity="0.5"
            fontSize="27"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            letterSpacing="8"
            textAnchor="middle"
          >
            DEXA VFX
          </text>
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
