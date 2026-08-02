const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const layers = Math.min(24, Math.max(5, Math.round(Number(ctx.params.layers ?? 16))));
    const depth = Math.min(6, Math.max(1, Number(ctx.params.depth ?? 3.25)));
    const perspective = Number(ctx.params.perspective ?? 980);
    const turns = Math.max(1, Math.round(Number(ctx.params.turns ?? 1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * Math.PI * 2 * turns;
    const rotateY = Math.sin(phase) * 32;
    const rotateX = Math.cos(phase) * 9;
    const offsetX = Math.sin(phase) * depth;
    const offsetY = Math.cos(phase) * depth * 0.55;
    const label = ctx.subject.label || 'DEXA VFX';
    const fontSize = Math.max(22, Math.min(ctx.width * 0.14, ctx.height * 0.28));

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
          background: '#0D0E10',
          perspective,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>{ctx.subjectNode}</div>
        <div
          data-layout-allow-overflow
          data-layout-allow-overlap
          style={{
            position: 'relative',
            width: '84%',
            height: fontSize * 1.45,
            transformStyle: 'preserve-3d',
            transform: \`rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`,
          }}
        >
          {Array.from({ length: layers }, (_, index) => {
            const layer = layers - index - 1;
            const front = layer === 0;
            return (
              <div
                key={index}
                aria-hidden={!front}
                data-layout-allow-overflow
                data-layout-allow-overlap
                data-layout-allow-occlusion
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  placeItems: 'center',
                  color: front ? signal : '#111419',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize,
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                  WebkitTextStroke: front ? \`1px \${signal}\` : \`1px \${signal}55\`,
                  textShadow: front ? \`0 0 \${fontSize * 0.32}px \${signal}88\` : 'none',
                  transform: \`translate3d(\${offsetX * layer}px, \${offsetY * layer}px, \${-depth * layer}px)\`,
                  opacity: front ? 1 : 0.4 + (index / layers) * 0.48,
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
