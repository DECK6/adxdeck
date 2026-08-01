const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? 'MAKE MOTION VISIBLE');
    const duration = Math.max(0.01, Number(ctx.params.duration ?? 0.42));
    const thickness = Number(ctx.params.thickness ?? 0.72);
    const direction = String(ctx.params.direction ?? 'left');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const raw = Math.min(1, Math.max(0, (ctx.t - 0.12) / duration));
    const progress = raw * raw * (3 - 2 * raw);
    const outro = Math.min(1, Math.max(0, (1 - ctx.t) / 0.1));
    const textSize = Math.max(16, Math.min(ctx.width * 0.065, ctx.height * 0.2));
    // Band is a translucent signal glow strip; text stays light throughout.
    // (Checker resolves text backdrop from ancestors, so sibling-band inversion can't pass.)

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08 * outro }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '78%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: textSize,
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.12,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            opacity: outro,
          }}
        >
          <div
            data-layout-allow-overlap=""
            data-layout-allow-occlusion=""
            style={{
              position: 'absolute',
              left: '-3%',
              right: '-3%',
              top: \`\${50 - thickness * 37}%\`,
              height: \`\${thickness * 74}%\`,
              clipPath: direction === 'right'
                ? \`inset(0 0 0 \${(1 - progress) * 100}%)\`
                : \`inset(0 \${(1 - progress) * 100}% 0 0)\`,
              background: \`\${signal}2E\`,
              borderTop: \`2px solid \${signal}\`,
              borderBottom: \`2px solid \${signal}\`,
              transform: \`skewX(-8deg) rotate(\${direction === 'right' ? 1.2 : -1.2}deg)\`,
              boxShadow: \`0 0 26px \${signal}66, inset 0 0 18px \${signal}40\`,
            }}
          />
          <div
            style={{
              position: 'relative',
              color: '#E7EBEF',
              textShadow: '0 2px 3px #0D0E10C0',
            }}
          >
            {phrase}
          </div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
