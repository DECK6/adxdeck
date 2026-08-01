const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? 'DEXA / MOTION /');
    const speed = Math.max(1, Math.round(Number(ctx.params.speed ?? 1)));
    const curve = Number(ctx.params.curve ?? 0.68);
    const direction = String(ctx.params.direction ?? 'clockwise') === 'counter' ? -1 : 1;
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const cycle = (ctx.frame % duration) / duration;
    const phase = direction * cycle * Math.PI * 2 * speed;
    const rx = 375;
    const ry = 235 * curve;
    const pathId = \`t08-path-\${Math.floor(ctx.random('path-id') * 1_000_000_000)}\`;
    const path = \`M \${500 - rx} 300 a \${rx} \${ry} 0 1 1 \${rx * 2} 0 a \${rx} \${ry} 0 1 1 \${-rx * 2} 0\`;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
          {ctx.subjectNode}
        </div>
        <svg
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: '4%', width: '92%', height: '92%', overflow: 'visible' }}
        >
          <defs>
            <path id={pathId} d={path} />
          </defs>
          <path d={path} fill="none" stroke={signal} strokeWidth="2" opacity="0.22" />
          {[0, 1, 2, 3].map((index) => {
            const offset = ((direction * cycle * speed + index * 0.25) % 1 + 1) % 1;
            return (
              <text
                key={index}
                fill={index % 2 === 0 ? signal : '#E7EBEF'}
                fontFamily="JetBrains Mono, monospace"
                fontSize="42"
                fontWeight="750"
                letterSpacing="3"
                opacity={index % 2 === 0 ? 1 : 0.68}
                style={{ filter: index === 0 ? \`drop-shadow(0 0 10px \${signal})\` : undefined }}
              >
                <textPath href={\`#\${pathId}\`} startOffset={\`\${offset * 100}%\`}>
                  {phrase}
                </textPath>
              </text>
            );
          })}
          {[0, Math.PI].map((headOffset, index) => {
            const angle = phase + headOffset;
            const x = 500 - rx * Math.cos(angle);
            const y = 300 - ry * Math.sin(angle);
            return (
              <g key={index} transform={\`translate(\${x} \${y})\`}>
                <circle r="13" fill={signal} opacity={index === 0 ? 1 : 0.58} />
                <circle r="25" fill="none" stroke={signal} strokeWidth="2" opacity="0.35" />
              </g>
            );
          })}
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
