const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const scale = Math.min(1.25, Math.max(0.7, Number(ctx.params.scale ?? 1)));
    const sweep = Math.min(0.8, Math.max(0.15, Number(ctx.params.sweep ?? 0.5)));
    const jitter = Math.min(1, Math.max(0, Number(ctx.params.jitter ?? 0.34)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const segment = Math.min(7, Math.floor(ctx.t * 8));
    const digit = 8 - segment;
    const segmentProgress = ctx.t * 8 - segment;
    const wedgeRotation = segmentProgress * 360 - 90;
    const offsetX = (ctx.random(\`leader:\${segment}:x\`) - 0.5) * 5 * jitter;
    const offsetY = (ctx.random(\`leader:\${segment}:y\`) - 0.5) * 4 * jitter;
    const pulse = 0.5 + 0.5 * Math.cos(segmentProgress * TAU);
    const diameter = Math.min(ctx.width, ctx.height) * 0.68 * scale;

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          background: '#0D0E10',
          color: '#F4F7F8',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '8%',
            display: 'grid',
            placeItems: 'center',
            opacity: 0.28,
            transform: \`translate(\${offsetX * -0.4}px, \${offsetY * -0.4}px) scale(\${0.96 + pulse * 0.025})\`,
            filter: 'grayscale(1) contrast(1.3)',
          }}
        >
          {ctx.subjectNode}
        </div>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#F4F7F844' }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#F4F7F844' }} />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: diameter,
            height: diameter,
            borderRadius: '50%',
            border: '2px solid #F4F7F8AA',
            boxShadow: \`0 0 0 \${diameter * 0.075}px #0D0E1099, 0 0 0 \${diameter * 0.08}px \${signal}44\`,
            transform: \`translate(calc(-50% + \${offsetX}px), calc(-50% + \${offsetY}px))\`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '-1px',
              borderRadius: '50%',
              background: \`conic-gradient(from \${wedgeRotation}deg, \${signal}\${Math.round(sweep * 170).toString(16).padStart(2, '0')} 0deg 42deg, transparent 43deg 360deg)\`,
              mixBlendMode: 'screen',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '10%',
              borderRadius: '50%',
              border: '1px solid #F4F7F866',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            fontSize: diameter * 0.48,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.08em',
            textShadow: \`0 0 \${12 + pulse * 12}px \${signal}66\`,
            transform: \`translate(\${offsetX}px, \${offsetY}px) scale(\${0.96 + pulse * 0.025})\`,
          }}
        >
          {digit}
        </div>
        <div style={{ position: 'absolute', left: 16, top: 14, color: signal, fontSize: 10, letterSpacing: '0.18em' }}>
          DEXA VFX · ACADEMY
        </div>
        <div style={{ position: 'absolute', right: 16, bottom: 14, color: '#F4F7F8AA', fontSize: 10 }}>
          35MM / {String(segment + 1).padStart(2, '0')}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.13,
            backgroundImage: \`repeating-linear-gradient(0deg, transparent 0 3px, \${signal}22 4px)\`,
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
