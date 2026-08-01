const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const direction = String(ctx.params.direction ?? 'right');
    const softness = Number(ctx.params.softness ?? 14);
    const glow = Number(ctx.params.glow ?? 0.68);
    const cycles = Number(ctx.params.cycles ?? 1);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const reveal = 0.5 - 0.5 * Math.cos(Math.PI * 2 * cycles * ctx.t);
    const travel = -softness + reveal * (100 + softness * 2);
    const start = travel - softness;
    const end = travel + softness;
    const cssDirection = direction === 'left'
      ? 'to left'
      : direction === 'down'
        ? 'to bottom'
        : direction === 'up'
          ? 'to top'
          : 'to right';
    const mask = \`linear-gradient(\${cssDirection}, #000 0%, #000 \${start}%, transparent \${end}%, transparent 100%)\`;
    const horizontal = direction === 'right' || direction === 'left';
    const reverse = direction === 'left' || direction === 'up';
    const physicalTravel = reverse ? 100 - travel : travel;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>{ctx.subjectNode}</div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={horizontal
            ? {
                position: 'absolute',
                left: \`\${physicalTravel - softness}%\`,
                top: 0,
                bottom: 0,
                width: \`\${softness * 2}%\`,
                background: \`linear-gradient(to right, transparent, \${signal}, transparent)\`,
                filter: \`blur(\${Math.max(1, softness * 0.12)}px)\`,
                opacity: glow * 0.55,
              }
            : {
                position: 'absolute',
                left: 0,
                right: 0,
                top: \`\${physicalTravel - softness}%\`,
                height: \`\${softness * 2}%\`,
                background: \`linear-gradient(to bottom, transparent, \${signal}, transparent)\`,
                filter: \`blur(\${Math.max(1, softness * 0.12)}px)\`,
                opacity: glow * 0.55,
              }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
