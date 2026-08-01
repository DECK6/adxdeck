const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const softness = Number(ctx.params.softness ?? 0.12);
    const originX = Number(ctx.params.originX ?? 0.5);
    const originY = Number(ctx.params.originY ?? 0.5);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const pulse = Math.sin(Math.PI * ctx.t);
    const progress = pulse * pulse * (3 - 2 * pulse);
    const radius = progress * 142;
    const feather = 1 + softness * 18;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            background: '#F5F1E6',
            clipPath: \`circle(\${radius}% at \${originX * 100}% \${originY * 100}%)\`,
            filter: \`drop-shadow(0 0 \${feather}px \${signal})\`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(135deg, transparent 0 46%, rgba(13,14,16,0.08) 46% 54%, transparent 54% 100%)',
              backgroundSize: '72px 72px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              filter: 'grayscale(1) contrast(1.35)',
              mixBlendMode: 'multiply',
              transform: \`scale(\${0.92 + progress * 0.08})\`,
            }}
          >
            {ctx.subjectNode}
          </div>
          <div
            style={{
              position: 'absolute',
              left: '8%',
              top: '11%',
              width: '20%',
              height: 9,
              background: '#17181A',
              transform: 'rotate(-7deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '9%',
              bottom: '12%',
              color: '#17181A',
              fontFamily: 'monospace',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.24em',
            }}
          >
            DEXA VFX / IRIS
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: \`\${originX * 100}%\`,
            top: \`\${originY * 100}%\`,
            width: \`\${radius * 2}%\`,
            aspectRatio: '1',
            border: \`2px solid \${signal}\`,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: progress > 0.02 && progress < 0.98 ? 0.75 : 0,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
