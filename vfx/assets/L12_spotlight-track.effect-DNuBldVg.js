const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const radius = Math.min(42, Math.max(10, Number(ctx.params.radius ?? 25)));
    const feather = Math.min(30, Math.max(5, Number(ctx.params.feather ?? 16)));
    const laps = Math.max(1, Math.round(Number(ctx.params.laps ?? 2)));
    const ambient = Math.min(0.45, Math.max(0, Number(ctx.params.ambient ?? 0.12)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const angle = ctx.t * Math.PI * 2 * laps - Math.PI / 2;
    const x = 50 + Math.cos(angle) * 28;
    const y = 50 + Math.sin(angle * 2) * 20;
    const edge = radius + feather;
    const mask = \`radial-gradient(circle at \${x}% \${y}%, black 0%, black \${radius}%, transparent \${edge}%)\`;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: ambient, filter: 'grayscale(1)' }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            maskImage: mask,
            WebkitMaskImage: mask,
            filter: \`brightness(1.35) drop-shadow(0 0 12px \${signal})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        {/* positioned glow element: geometry motion (mask/gradient position alone is paint-only) */}
        <div
          style={{
            position: 'absolute',
            left: \`\${x - edge / 2}%\`,
            top: \`\${y - edge / 2}%\`,
            width: \`\${edge}%\`,
            height: \`\${edge}%\`,
            borderRadius: '50%',
            background: \`radial-gradient(circle, \${signal}38 0%, \${signal}14 55%, transparent 78%)\`,
            border: \`1.5px solid \${signal}55\`,
            mixBlendMode: 'screen',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
