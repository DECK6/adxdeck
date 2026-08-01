const n=`import type { FxKernel } from '../../src/fx/types';

const smoothstep = (value: number) => value * value * (3 - 2 * value);

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const slats = Math.max(3, Math.round(Number(ctx.params.slats ?? 8)));
    const axis = String(ctx.params.axis ?? 'horizontal');
    const gap = Number(ctx.params.gap ?? 2);
    const stagger = Number(ctx.params.stagger ?? 0.35);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const cycle = (1 - Math.cos(ctx.t * Math.PI * 2)) / 2;
    const horizontal = axis === 'horizontal';

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12, filter: 'grayscale(1) brightness(0.4)' }}>
          {ctx.subjectNode}
        </div>
        {Array.from({ length: slats }, (_, index) => {
          const delay = (index / Math.max(1, slats - 1)) * stagger * 0.65;
          const local = Math.max(0, Math.min(1, (cycle - delay) / Math.max(0.001, 1 - delay)));
          const opening = smoothstep(local);
          const start = (index / slats) * 100;
          const size = 100 / slats;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: horizontal ? 0 : \`\${start}%\`,
                top: horizontal ? \`\${start}%\` : 0,
                width: horizontal ? '100%' : \`\${size}%\`,
                height: horizontal ? \`\${size}%\` : '100%',
                overflow: 'hidden',
                borderColor: signal,
                borderStyle: 'solid',
                borderWidth: horizontal ? \`\${gap / 2}px 0\` : \`0 \${gap / 2}px\`,
                boxSizing: 'border-box',
                transform: horizontal ? \`scaleY(\${opening})\` : \`scaleX(\${opening})\`,
                transformOrigin: 'center',
                boxShadow: opening > 0.02 ? \`0 0 \${gap + 4}px \${signal}\` : 'none',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: horizontal ? 0 : \`\${-index * 100}%\`,
                  top: horizontal ? \`\${-index * 100}%\` : 0,
                  width: horizontal ? '100%' : \`\${slats * 100}%\`,
                  height: horizontal ? \`\${slats * 100}%\` : '100%',
                }}
              >
                {ctx.subjectNode}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
