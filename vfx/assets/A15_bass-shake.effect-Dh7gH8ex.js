const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;
const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const sensitivity = Math.min(2.5, Math.max(0.4, Number(ctx.params.sensitivity ?? 1.45)));
    const distance = Math.min(24, Math.max(0, Number(ctx.params.distance ?? 10)));
    const blur = Math.min(12, Math.max(0, Number(ctx.params.blur ?? 4)));
    const response = String(ctx.params.response ?? 'heavy');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const bands = Array.from({ length: 8 }, (_, index) => clamp01(ctx.audio?.bands[index] ?? 0));
    const bass = clamp01(bands[0] * 0.54 + bands[1] * 0.31 + bands[2] * 0.15);
    const weighted = response === 'tight'
      ? bass * bass
      : response === 'sub'
        ? bands[0] * 0.78 + rms * 0.22
        : Math.pow(bass, 1.35) * 0.8 + rms * 0.2;
    const impact = clamp01(weighted * sensitivity);
    const phase = ctx.t * TAU;
    const x = distance * impact * (Math.sin(phase * 12) * 0.68 + Math.sin(phase * 17) * 0.32);
    const y = distance * impact * (Math.cos(phase * 15) * 0.58 - Math.sin(phase * 9) * 0.42);
    const punch = 1 + impact * (response === 'sub' ? 0.12 : response === 'tight' ? 0.055 : 0.085);
    const impactBlur = blur * impact * (0.25 + 0.75 * Math.abs(Math.sin(phase * 12)));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: -distance - blur,
            opacity: 0.16 + impact * 0.22,
            transform: \`translate3d(\${-x * 1.8}px, \${-y * 1.8}px, 0) scale(\${punch * 1.015})\`,
            filter: \`blur(\${1 + impactBlur * 1.6}px)\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.78 + impact * 0.22,
            transform: \`translate3d(\${x}px, \${y}px, 0) scale(\${punch})\`,
            transformOrigin: 'center',
            filter: \`blur(\${impactBlur * 0.28}px) contrast(\${1 + impact * 0.32}) drop-shadow(0 0 \${4 + impact * 18}px \${signal})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: Math.max(4, ctx.height * 0.055),
            border: \`2px solid \${signal}\`,
            opacity: 0.08 + impact * 0.48,
            transform: \`translate3d(\${x * 0.28}px, \${y * 0.28}px, 0) scale(\${1 + impact * 0.025})\`,
            boxShadow: \`inset 0 0 \${8 + impact * 24}px \${signal}, 0 0 \${4 + impact * 14}px \${signal}\`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: \`\${6 + (0.5 + 0.5 * Math.sin(phase)) * 88}%\`,
            bottom: '4%',
            width: 4,
            height: '10%',
            borderRadius: 3,
            background: signal,
            opacity: 0.34 + impact * 0.58,
            boxShadow: \`0 0 \${8 + impact * 12}px \${signal}\`,
            transform: \`translateX(-50%) scaleY(\${0.72 + impact * 0.55})\`,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
