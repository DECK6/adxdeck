const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const sensitivity = Math.min(2.4, Math.max(0.4, Number(ctx.params.sensitivity ?? 1.35)));
    const bassWeight = Math.min(1, Math.max(0, Number(ctx.params.bassWeight ?? 0.7)));
    const response = String(ctx.params.response ?? 'punchy');
    const tempo = String(ctx.params.tempo ?? 'medium');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const rms = Math.min(1, Math.max(0, ctx.audio?.rms ?? 0));
    const bands = ctx.audio?.bands ?? [0, 0, 0, 0, 0, 0, 0, 0];
    const bass = Math.min(1, Math.max(0, ((bands[0] ?? 0) + (bands[1] ?? 0) + (bands[2] ?? 0)) / 3));
    const weighted = rms * (1 - bassWeight) + bass * bassWeight;
    const audioEnergy = response === 'smooth'
      ? Math.sqrt(weighted)
      : response === 'sub'
        ? bass * 0.82 + rms * 0.18
        : weighted * weighted * 1.25;
    const beatCount = tempo === 'slow' ? 6 : tempo === 'fast' ? 18 : 12;
    const syntheticBeat = 0.5 - 0.5 * Math.cos(Math.PI * 2 * beatCount * ctx.t);
    const pulse = Math.min(1, audioEnergy * sensitivity + syntheticBeat * 0.16);
    const subjectScale = 1 + pulse * 0.16;
    const driftY = Math.sin(Math.PI * 2 * ctx.t) * ctx.height * 0.012;
    const baseSize = Math.min(ctx.width, ctx.height);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        {[0, 1, 2].map((index) => {
          const size = baseSize * (0.24 + index * 0.11 + pulse * (0.09 + index * 0.025));
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: size,
                height: size,
                border: \`2px solid \${signal}\`,
                borderRadius: '50%',
                opacity: Math.max(0.08, 0.38 - index * 0.09 + pulse * 0.24),
                boxShadow: \`0 0 \${10 + pulse * 24}px \${signal}\`,
                transform: \`translate(-50%, -50%) rotate(\${index * 22.5}deg)\`,
              }}
            />
          );
        })}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.78 + pulse * 0.22,
            transform: \`translate3d(0, \${driftY}px, 0) scale(\${subjectScale})\`,
            transformOrigin: 'center',
            filter: \`drop-shadow(0 0 \${6 + pulse * 20}px \${signal})\`,
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
