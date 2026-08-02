const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const density = Math.min(14, Math.max(4, Math.round(Number(ctx.params.density ?? 8))));
    const intensity = Math.min(1, Math.max(0.2, Number(ctx.params.intensity ?? 0.82)));
    const sweep = Math.min(3, Math.max(1, Math.round(Number(ctx.params.sweep ?? 2))));
    const tilt = Math.min(76, Math.max(42, Number(ctx.params.tilt ?? 62)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU * sweep;
    const scanX = 50 + Math.sin(phase) * 47;
    const scanY = 50 + Math.cos(phase) * 43;
    const gridStep = 100 / density;
    const horizonGlow = 0.42 + 0.18 * Math.cos(phase * 2);

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          background: '#0D0E10',
          perspective: 520,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '-25%',
            right: '-25%',
            bottom: '-40%',
            height: '108%',
            transformOrigin: '50% 100%',
            transform: \`rotateX(\${tilt}deg) translateY(8%)\`,
            backgroundImage: \`repeating-linear-gradient(90deg, transparent 0, transparent calc(\${gridStep}% - 1px), \${signal}  \${gridStep}%), repeating-linear-gradient(0deg, transparent 0, transparent calc(\${gridStep}% - 1px), \${signal} \${gridStep}%)\`,
            backgroundSize: '100% 100%',
            opacity: intensity * 0.46,
            filter: \`drop-shadow(0 0 4px \${signal})\`,
            maskImage: 'linear-gradient(to top, black 15%, transparent 92%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '43%',
            height: 2,
            background: signal,
            boxShadow: \`0 0 12px 2px \${signal}\`,
            opacity: intensity * horizonGlow,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: \`\${scanX}%\`,
            top: '8%',
            bottom: '-5%',
            width: 2,
            transform: \`rotate(\${Math.sin(phase) * 7}deg)\`,
            transformOrigin: '50% 0%',
            background: \`linear-gradient(180deg, transparent, \${signal} 18%, \${signal} 82%, transparent)\`,
            boxShadow: \`0 0 9px 2px \${signal}\`,
            opacity: intensity,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '-8%',
            right: '-8%',
            top: \`\${scanY}%\`,
            height: 2,
            transform: \`rotate(\${Math.cos(phase) * 4}deg)\`,
            background: \`linear-gradient(90deg, transparent, \${signal} 18%, \${signal} 82%, transparent)\`,
            boxShadow: \`0 0 9px 2px \${signal}\`,
            opacity: intensity * 0.84,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            filter: \`drop-shadow(0 0 \${5 + intensity * 7}px \${signal})\`,
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
