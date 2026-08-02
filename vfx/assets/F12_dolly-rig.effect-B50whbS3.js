const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const travel = Math.min(1, Math.max(0.2, Number(ctx.params.travel ?? 0.76)));
    const parallax = Math.min(1, Math.max(0, Number(ctx.params.parallax ?? 0.62)));
    const rigScale = Math.min(1.3, Math.max(0.7, Number(ctx.params.rigScale ?? 1)));
    const direction = String(ctx.params.direction ?? 'right') === 'left' ? -1 : 1;
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;
    const progress = 0.5 - 0.5 * Math.cos(phase);
    const velocity = Math.sin(phase);
    const trackLeft = ctx.width * (0.12 + progress * 0.62 * travel);
    const rigX = direction > 0 ? trackLeft : ctx.width - trackLeft;
    const subjectShift = (progress - 0.5) * ctx.width * 0.12 * parallax * -direction;
    const rigWidth = Math.min(ctx.width, ctx.height * 1.7) * 0.25 * rigScale;
    const wheelSize = rigWidth * 0.12;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: '-5%',
            display: 'grid',
            placeItems: 'center',
            transform: \`translate3d(\${subjectShift}px, 0, 0) scale(\${1.04 + progress * 0.025 * parallax})\`,
            filter: \`brightness(\${0.72 + Math.abs(velocity) * 0.06}) contrast(1.08)\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.16,
            backgroundImage: \`linear-gradient(90deg, transparent 49.8%, \${signal} 50%, transparent 50.2%), linear-gradient(0deg, transparent 49.8%, \${signal} 50%, transparent 50.2%)\`,
            backgroundSize: \`\${70 + progress * 25}px \${70 + progress * 25}px\`,
            backgroundPosition: \`\${subjectShift * -0.45}px 0\`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '-8%',
            right: '-8%',
            bottom: '12%',
            height: 2,
            background: signal,
            boxShadow: \`0 \${wheelSize * 0.9}px 0 \${signal}, 0 0 10px \${signal}66\`,
            opacity: 0.68,
          }}
        />
        {Array.from({ length: 14 }, (_, index) => (
          <div
            key={\`sleeper:\${index}\`}
            style={{
              position: 'absolute',
              left: \`\${index * 8 - 4}%\`,
              bottom: '8%',
              width: '5%',
              height: 2,
              background: '#8B969A',
              transform: 'rotate(-8deg)',
              opacity: 0.48,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: rigX,
            bottom: '12%',
            width: rigWidth,
            height: rigWidth * 0.68,
            transform: \`translateX(-50%) translateY(\${Math.abs(velocity) * 1.5}px)\`,
            filter: 'drop-shadow(0 10px 12px #000000CC)',
          }}
        >
          <div style={{ position: 'absolute', left: '8%', right: '8%', bottom: wheelSize * 0.72, height: rigWidth * 0.11, border: \`2px solid \${signal}\`, background: '#14191C' }} />
          {[0.18, 0.5, 0.82].map((left, index) => (
            <div
              key={\`wheel:\${index}\`}
              style={{
                position: 'absolute',
                left: \`\${left * 100}%\`,
                bottom: 0,
                width: wheelSize,
                height: wheelSize,
                borderRadius: '50%',
                border: \`2px solid \${signal}\`,
                background: '#0D0E10',
                boxShadow: \`inset 0 0 0 \${wheelSize * 0.22}px #242B2E\`,
                transform: \`translateX(-50%) rotate(\${direction * progress * 720}deg)\`,
              }}
            >
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: signal }} />
            </div>
          ))}
          <div style={{ position: 'absolute', left: '43%', bottom: wheelSize * 1.15, width: rigWidth * 0.08, height: rigWidth * 0.3, background: '#273035', border: \`1px solid \${signal}88\` }} />
          <div
            style={{
              position: 'absolute',
              left: '27%',
              bottom: rigWidth * 0.42,
              width: rigWidth * 0.42,
              height: rigWidth * 0.23,
              background: '#101518',
              border: \`2px solid \${signal}\`,
              clipPath: 'polygon(0 15%, 76% 15%, 100% 0, 100% 100%, 76% 85%, 0 85%)',
            }}
          >
            <div style={{ position: 'absolute', left: '12%', top: '22%', width: '50%', height: '56%', border: \`1px solid \${signal}77\`, overflow: 'hidden', opacity: 0.78 }}>
              <div style={{ position: 'absolute', inset: '-35%', display: 'grid', placeItems: 'center', transform: \`translateX(\${subjectShift * 0.06}px) scale(0.42)\` }}>
                {ctx.subjectNode}
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', left: '12%', bottom: rigWidth * 0.64, width: rigWidth * 0.46, height: 3, background: signal, transform: 'rotate(-18deg)', transformOrigin: 'right center' }} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 13,
            color: '#E8F0F2',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.16em',
            textShadow: '0 1px 3px #0D0E10',
          }}
        >
          DEXA VFX · DOLLY / {Math.round(progress * 100).toString().padStart(3, '0')}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
