const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const windows = Math.min(7, Math.max(3, Math.round(Number(ctx.params.windows ?? 5))));
    const travel = Math.min(38, Math.max(8, Number(ctx.params.travel ?? 26)));
    const softness = Math.min(30, Math.max(0, Number(ctx.params.softness ?? 12)));
    const cycles = Math.min(4, Math.max(1, Math.round(Number(ctx.params.cycles ?? 2))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU * cycles;
    const baseWidth = ctx.width / (windows + 1.8);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.055, filter: 'grayscale(1)' }}>
          {ctx.subjectNode}
        </div>
        {Array.from({ length: windows }, (_, index) => {
          const localPhase = phase + (index / windows) * TAU;
          const baseX = ((index + 0.5) / windows) * ctx.width;
          const centerX = baseX + Math.sin(localPhase) * ctx.width * travel * 0.01;
          const centerY = ctx.height * (0.5 + Math.cos(localPhase * 0.5 + index) * 0.11);
          const width = baseWidth * (0.68 + (0.5 + 0.5 * Math.cos(localPhase)) * 0.62);
          const height = ctx.height * (0.42 + (0.5 + 0.5 * Math.sin(localPhase)) * 0.46);
          const left = centerX - width * 0.5;
          const top = centerY - height * 0.5;
          const edge = softness * 0.5;
          const matte = \`linear-gradient(90deg, transparent 0%, #000 \${edge}%, #000 \${100 - edge}%, transparent 100%)\`;
          const opacity = 0.64 + (0.5 + 0.5 * Math.sin(localPhase + 0.7)) * 0.36;
          return (
            <div key={index}>
              <div
                style={{
                  position: 'absolute',
                  left,
                  top,
                  width,
                  height,
                  overflow: 'hidden',
                  borderRadius: Math.min(width, height) * 0.32,
                  opacity,
                  maskImage: matte,
                  WebkitMaskImage: matte,
                  boxShadow: \`0 0 \${18 + softness}px \${signal}44\`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: -left,
                    top: -top,
                    width: ctx.width,
                    height: ctx.height,
                  }}
                >
                  {ctx.subjectNode}
                </div>
                <div style={{ position: 'absolute', inset: 0, background: signal, opacity: 0.035 + index * 0.012 }} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left,
                  top,
                  width,
                  height,
                  border: \`1px solid \${signal}\`,
                  borderRadius: Math.min(width, height) * 0.32,
                  boxSizing: 'border-box',
                  opacity: 0.16 + opacity * 0.2,
                  transform: \`scale(\${1.025 + Math.sin(localPhase) * 0.018})\`,
                  boxShadow: \`inset 0 0 \${10 + softness}px \${signal}22\`,
                }}
              />
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: \`\${12 + (0.5 + 0.5 * Math.sin(phase)) * 76}%\`,
            bottom: '7%',
            width: \`\${8 + (0.5 + 0.5 * Math.cos(phase)) * 18}%\`,
            height: 3,
            borderRadius: 999,
            background: signal,
            opacity: 0.72,
            transform: 'translateX(-50%)',
            boxShadow: \`0 0 14px \${signal}\`,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
