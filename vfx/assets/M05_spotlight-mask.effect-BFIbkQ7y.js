const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const radius = Math.min(42, Math.max(12, Number(ctx.params.radius ?? 24)));
    const travel = Math.min(34, Math.max(0, Number(ctx.params.travel ?? 24)));
    const softness = Math.min(18, Math.max(2, Number(ctx.params.softness ?? 8)));
    const path = String(ctx.params.path ?? 'orbit');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const angle = Math.PI * 2 * ctx.t;
    const xWave = Math.sin(angle);
    const yWave = path === 'sweep'
      ? Math.sin(angle * 2) * 0.16
      : path === 'figure-eight'
        ? Math.sin(angle * 2) * 0.72
        : Math.cos(angle) * 0.72;
    const centerX = 50 + travel * xWave;
    const centerY = 50 + travel * yWave;
    const innerRadius = Math.max(0, radius - softness);
    const mask = \`radial-gradient(circle at \${centerX}% \${centerY}%, #000 0%, #000 \${innerRadius}%, transparent \${radius}%)\`;
    const diameter = Math.min(ctx.width, ctx.height) * radius * 0.02;
    const breathing = 1 + 0.055 * Math.sin(angle * 2);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08, filter: 'grayscale(1)' }}>
          {ctx.subjectNode}
        </div>
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
          style={{
            position: 'absolute',
            left: \`\${centerX}%\`,
            top: \`\${centerY}%\`,
            width: diameter,
            height: diameter,
            border: \`2px solid \${signal}\`,
            borderRadius: '50%',
            boxShadow: \`0 0 \${Math.max(12, diameter * 0.28)}px \${signal}, inset 0 0 \${Math.max(8, diameter * 0.16)}px \${signal}\`,
            opacity: 0.44,
            transform: \`translate(-50%, -50%) scale(\${breathing})\`,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
