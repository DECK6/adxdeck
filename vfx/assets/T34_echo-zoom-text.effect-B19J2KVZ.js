const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const echoes = Math.min(9, Math.max(3, Math.round(Number(ctx.params.echoes ?? 6))));
    const zoom = Math.min(0.7, Math.max(0.12, Number(ctx.params.zoom ?? 0.38)));
    const decay = Math.min(0.9, Math.max(0.35, Number(ctx.params.decay ?? 0.68)));
    const cycles = Math.min(3, Math.max(1, Math.round(Number(ctx.params.cycles ?? 1))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU * cycles;
    const travel = 0.5 - 0.5 * Math.cos(phase);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        {Array.from({ length: echoes }, (_, index) => {
          const age = (index + travel) / echoes;
          const scale = 1 + age * zoom;
          const opacity = Math.pow(1 - age, 1.35) * Math.pow(decay, index) * 0.72;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                inset: 0,
                opacity,
                color: signal,
                filter: \`drop-shadow(0 0 \${2 + age * 15}px \${signal})\`,
                mixBlendMode: 'screen',
                transform: \`scale(\${scale})\`,
                transformOrigin: 'center',
              }}
            >
              {ctx.subjectNode}
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            filter: \`drop-shadow(0 0 \${5 + travel * 8}px \${signal})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
