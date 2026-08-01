const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const direction = String(ctx.params.direction ?? 'clockwise');
    const startAngle = Math.min(180, Math.max(-180, Number(ctx.params.startAngle ?? -90)));
    const softness = Math.min(36, Math.max(0, Number(ctx.params.softness ?? 10)));
    const radius = Math.min(76, Math.max(42, Number(ctx.params.radius ?? 64)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const reveal = 0.5 - 0.5 * Math.cos(Math.PI * 2 * ctx.t);
    const sweep = reveal * 360;
    const solidEdge = Math.max(0, sweep - softness);
    const fromAngle = direction === 'counter-clockwise' ? startAngle - sweep : startAngle;
    const headAngle = (direction === 'counter-clockwise' ? startAngle - sweep : startAngle + sweep) * Math.PI / 180;
    const mask = \`conic-gradient(from \${fromAngle}deg at 50% 50%, #000 0deg, #000 \${solidEdge}deg, transparent \${sweep}deg, transparent 360deg)\`;
    const orbitRadius = Math.min(ctx.width, ctx.height) * radius / 200;
    const headX = ctx.width * 0.5 + Math.cos(headAngle) * orbitRadius;
    const headY = ctx.height * 0.5 + Math.sin(headAngle) * orbitRadius;
    const pulse = 0.5 - 0.5 * Math.cos(Math.PI * 4 * ctx.t);
    const ringSize = Math.min(ctx.width, ctx.height) * (0.13 + pulse * 0.08);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07, filter: 'grayscale(1)' }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: \`circle(\${radius}% at 50% 50%)\`,
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: headX,
            top: headY,
            width: 10 + pulse * 8,
            height: 10 + pulse * 8,
            borderRadius: '50%',
            background: signal,
            boxShadow: \`0 0 18px \${signal}\`,
            opacity: 0.42 + reveal * 0.48,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: ringSize,
            height: ringSize,
            border: \`1px solid \${signal}\`,
            borderRadius: '50%',
            opacity: 0.12 + pulse * 0.2,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
