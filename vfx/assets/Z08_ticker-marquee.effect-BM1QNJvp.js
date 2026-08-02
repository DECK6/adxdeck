const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const message = String(ctx.params.message ?? 'DEXA SIGNAL ONLINE');
    const speed = Math.min(4, Math.max(1, Math.round(Number(ctx.params.speed ?? 2))));
    const dotPitch = Math.min(8, Math.max(3, Math.round(Number(ctx.params.dotPitch ?? 5))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const travel = (ctx.t * speed) % 1;
    const group = Array.from({ length: 4 }, (_, index) => (
      <span key={index} style={{ display: 'inline-flex', alignItems: 'center', flex: '0 0 auto', paddingRight: '2.8em' }}>
        <span style={{ color: signal, marginRight: '0.65em' }}>◆</span>
        {message}
      </span>
    ));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.18, filter: \`contrast(1.15) drop-shadow(0 0 12px \${signal}33)\` }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '-3%',
            right: '-3%',
            top: '50%',
            height: '34%',
            transform: 'translateY(-50%) perspective(700px) rotateX(3deg)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            background: '#050607F2',
            borderTop: \`2px solid \${signal}55\`,
            borderBottom: \`2px solid \${signal}55\`,
            boxShadow: \`inset 0 0 30px \${signal}14, 0 0 24px #000000CC\`,
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 'max-content',
              flex: '0 0 auto',
              transform: \`translate3d(\${-50 * travel}%, 0, 0)\`,
              color: signal,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: Math.max(19, Math.min(ctx.width * 0.085, ctx.height * 0.25)),
              fontWeight: 800,
              letterSpacing: '0.12em',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              textShadow: \`0 0 7px \${signal}, 0 0 22px \${signal}99\`,
              maskImage: \`radial-gradient(circle, #000 0 \${Math.max(1, dotPitch * 0.32)}px, transparent \${Math.max(1.5, dotPitch * 0.46)}px)\`,
              WebkitMaskImage: \`radial-gradient(circle, #000 0 \${Math.max(1, dotPitch * 0.32)}px, transparent \${Math.max(1.5, dotPitch * 0.46)}px)\`,
              maskSize: \`\${dotPitch}px \${dotPitch}px\`,
              WebkitMaskSize: \`\${dotPitch}px \${dotPitch}px\`,
            }}
          >
            <div style={{ display: 'flex', flex: '0 0 auto' }}>{group}</div>
            <div style={{ display: 'flex', flex: '0 0 auto' }}>{group}</div>
          </div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
