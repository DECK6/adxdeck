const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const density = Math.min(64, Math.max(18, Math.round(Number(ctx.params.density ?? 42))));
    const wind = Math.min(1, Math.max(0.25, Number(ctx.params.wind ?? 0.72)));
    const heightScale = Math.min(1.25, Math.max(0.45, Number(ctx.params.height ?? 0.92)));
    const gusts = Math.min(4, Math.max(1, Math.round(Number(ctx.params.gusts ?? 2))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU * gusts;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.12 + wind * 0.08,
            transform: \`translateX(\${Math.sin(phase) * wind * 8}px) scale(\${0.97 + wind * 0.03})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        {[0, 1, 2].map((index) => {
          const progress = (ctx.t * gusts + index / 3) % 1;
          const visibility = Math.sin(progress * Math.PI);
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: \`\${-24 + progress * 148}%\`,
                top: \`\${24 + index * 16 + Math.sin(phase + index) * 5}%\`,
                width: \`\${16 + wind * 12}%\`,
                height: 2 + index,
                borderRadius: 999,
                background: signal,
                opacity: visibility * (0.18 + wind * 0.28),
                transform: \`skewX(-24deg) scaleX(\${0.62 + visibility * 0.7})\`,
                boxShadow: \`0 0 \${8 + wind * 18}px \${signal}\`,
              }}
            />
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '11%',
            background: \`linear-gradient(180deg, transparent, \${signal}24)\`,
          }}
        />
        {Array.from({ length: density }, (_, index) => {
          const x = ((index + 0.5) / density) * 106 - 3;
          const randomHeight = 0.54 + ctx.random(\`blade:\${index}:height\`) * 0.46;
          const bladeHeight = ctx.height * 0.48 * heightScale * randomHeight;
          const bladeWidth = 2 + ctx.random(\`blade:\${index}:width\`) * 5.5;
          const phaseOffset = ctx.random(\`blade:\${index}:phase\`) * TAU;
          const layer = ctx.random(\`blade:\${index}:layer\`);
          const bend = Math.sin(phase + phaseOffset) * wind * (12 + layer * 18)
            + Math.sin(phase * 2 - phaseOffset * 0.4) * wind * 5;
          const push = (0.5 + 0.5 * Math.sin(phase - x * 0.055)) * wind * (10 + layer * 18);
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: \`\${x}%\`,
                bottom: '-3%',
                width: bladeWidth,
                height: bladeHeight,
                borderRadius: '100% 100% 35% 35%',
                transformOrigin: '50% 100%',
                transform: \`translateX(\${push}px) rotate(\${bend}deg) scaleY(\${0.92 + layer * 0.13})\`,
                background: \`linear-gradient(90deg, \${signal}44, \${signal}, \${signal}66)\`,
                opacity: 0.38 + layer * 0.58,
                boxShadow: layer > 0.72 ? \`0 0 \${4 + wind * 7}px \${signal}88\` : 'none',
              }}
            />
          );
        })}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
