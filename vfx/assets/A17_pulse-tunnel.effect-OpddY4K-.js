const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const ringCount = Math.min(16, Math.max(6, Math.round(Number(ctx.params.rings ?? 11))));
    const sensitivity = Math.min(2.5, Math.max(0.5, Number(ctx.params.sensitivity ?? 1.35)));
    const depth = Math.min(1.8, Math.max(0.5, Number(ctx.params.depth ?? 1.1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const bands = Array.from({ length: 8 }, (_, index) => clamp01(ctx.audio?.bands[index] ?? 0));
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const bass = (bands[0] + bands[1]) * 0.5;
    const pulse = clamp01((bass * 0.72 + rms * 0.28) * sensitivity);
    const shortSide = Math.min(ctx.width, ctx.height);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#07090C', perspective: shortSide * 2.8 }}>
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
          {Array.from({ length: ringCount }, (_, index) => {
            const travel = (ctx.t * 2 + index / ringCount) % 1;
            const band = bands[index % bands.length];
            const energy = clamp01((band * 0.68 + pulse * 0.55) * sensitivity);
            const z = (-shortSide * 2.45 + travel * shortSide * 2.3) * depth;
            const size = shortSide * (0.22 + energy * 0.11);
            const fade = Math.sin(Math.PI * travel);
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: size,
                  height: size,
                  border: \`\${1 + energy * 2.4}px solid \${signal}\`,
                  borderRadius: index % 3 === 0 ? '18%' : '50%',
                  opacity: 0.08 + fade * (0.28 + energy * 0.6),
                  boxShadow: \`0 0 \${5 + energy * 22}px \${signal}, inset 0 0 \${4 + energy * 14}px \${signal}\`,
                  transform: \`translate(-50%, -50%) translateZ(\${z}px) rotate(\${index * 17 + ctx.t * 360}deg)\`,
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.42 + pulse * 0.5,
            transform: \`scale(\${0.82 + pulse * 0.12})\`,
            filter: \`drop-shadow(0 0 \${8 + pulse * 22}px \${signal})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: shortSide * (0.035 + pulse * 0.045),
            height: shortSide * (0.035 + pulse * 0.045),
            borderRadius: '50%',
            background: signal,
            opacity: 0.45 + pulse * 0.5,
            boxShadow: \`0 0 \${shortSide * (0.1 + pulse * 0.16)}px \${signal}\`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
