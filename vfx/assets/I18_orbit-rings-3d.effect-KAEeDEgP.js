const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const rings = Math.max(3, Math.min(7, Math.round(Number(ctx.params.rings ?? 5))));
    const radius = Number(ctx.params.radius ?? 0.78);
    const speed = Math.max(1, Math.round(Number(ctx.params.speed ?? 1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const unit = Math.min(ctx.width, ctx.height);
    const size = unit * radius;
    const turn = 360 * speed * ctx.t;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'radial-gradient(circle, #182026, #0D0E10 62%)' }}>
        <div style={{ position: 'absolute', inset: 0, perspective: unit * 1.35, perspectiveOrigin: '50% 48%' }}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              transformStyle: 'preserve-3d',
              transform: \`rotateX(\${18 + turn * 0.5}deg) rotateY(\${turn}deg) rotateZ(\${-turn * 0.25}deg)\`,
            }}
          >
            {Array.from({ length: rings }, (_, index) => {
              const inset = index * (size * 0.045);
              const angleX = (index * 137.5) % 180;
              const angleY = (index * 71) % 180;
              return (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    inset,
                    borderRadius: '50%',
                    border: \`\${Math.max(1, unit * 0.003)}px solid \${signal}\`,
                    boxShadow: \`inset 0 0 \${unit * 0.02}px \${signal}44, 0 0 \${unit * 0.016}px \${signal}55\`,
                    opacity: 0.42 + index / rings * 0.45,
                    transformStyle: 'preserve-3d',
                    transform: \`rotateX(\${angleX}deg) rotateY(\${angleY}deg) translateZ(\${(index - rings / 2) * unit * 0.012}px)\`,
                  }}
                >
                  <div style={{ position: 'absolute', left: '50%', top: -unit * 0.012, width: unit * 0.024, height: unit * 0.024, marginLeft: -unit * 0.012, borderRadius: '50%', background: signal, boxShadow: \`0 0 \${unit * 0.025}px \${signal}\` }} />
                </div>
              );
            })}
            <div style={{ position: 'absolute', inset: '31%', transform: \`translateZ(\${unit * 0.035}px) rotateY(\${-turn}deg) rotateX(\${-18 - turn * 0.5}deg)\`, filter: \`drop-shadow(0 0 \${unit * 0.03}px \${signal}88)\` }}>
              {ctx.subjectNode}
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: unit * 0.055, height: unit * 0.055, margin: \`\${-unit * 0.0275}px 0 0 \${-unit * 0.0275}px\`, border: \`1px solid \${signal}\`, borderRadius: '50%', opacity: 0.7 }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
