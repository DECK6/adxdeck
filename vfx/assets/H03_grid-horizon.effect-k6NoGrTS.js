const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const density = Math.min(18, Math.max(7, Math.round(Number(ctx.params.density ?? 12))));
    const horizon = Math.min(58, Math.max(30, Number(ctx.params.horizon ?? 43)));
    const speed = Math.min(4, Math.max(1, Math.round(Number(ctx.params.speed ?? 2))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * Math.PI * 2 * speed;
    const spacing = Math.max(18, ctx.height / density);
    const scroll = ((ctx.t * speed) % 1) * spacing;
    const horizonGlow = 0.6 + Math.sin(phase) * 0.08;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'linear-gradient(180deg, #07090D 0%, #11131A 47%, #080A0D 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.28 }}>{ctx.subjectNode}</div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: \`\${horizon - 2}%\`,
            height: '8%',
            background: \`radial-gradient(ellipse at center, \${signal}3D 0%, \${signal}12 42%, transparent 75%)\`,
            opacity: horizonGlow,
            filter: 'blur(8px)',
          }}
        />
        <div style={{ position: 'absolute', left: 0, right: 0, top: \`\${horizon}%\`, height: 1, background: signal, opacity: 0.54, boxShadow: \`0 0 16px \${signal}66\` }} />
        <div
          style={{
            position: 'absolute',
            left: '-35%',
            right: '-35%',
            top: \`\${horizon - 1}%\`,
            height: \`\${150 - horizon}%\`,
            transformOrigin: '50% 0%',
            transform: 'perspective(520px) rotateX(61deg)',
            backgroundImage: \`linear-gradient(90deg, \${signal}52 1px, transparent 1px), linear-gradient(\${signal}52 1px, transparent 1px)\`,
            backgroundSize: \`\${100 / density}% \${spacing}px\`,
            backgroundPosition: \`50% \${scroll}px\`,
            WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 13%, black 82%, transparent 100%)',
            opacity: 0.72,
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 46%, transparent 0%, transparent 36%, rgba(0,0,0,0.48) 100%)' }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
