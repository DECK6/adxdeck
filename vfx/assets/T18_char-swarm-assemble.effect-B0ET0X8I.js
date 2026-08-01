const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const easeOut = (u: number) => 1 - Math.pow(1 - u, 3);
const easeIn = (u: number) => u * u * u;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const text = String(ctx.params.text ?? 'DEXA VFX').toUpperCase();
    const spread = Number(ctx.params.spread ?? 0.42);
    const swirl = Number(ctx.params.swirl ?? 0.55);
    const stagger = Number(ctx.params.stagger ?? 0.34);
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    const characters = text.split('');
    const fontSize = Math.max(20, Math.min((ctx.width * 0.82) / Math.max(6, characters.length * 0.68), ctx.height * 0.24));
    const formed = clamp01((ctx.t - 0.06) / 0.42) * (1 - clamp01((ctx.t - 0.74) / 0.16));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.09 }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize,
            fontWeight: 700,
            lineHeight: 1,
            color: '#F5F8FA',
            whiteSpace: 'pre',
          }}
        >
          {characters.map((character, index) => {
            const order = ctx.random(\`order:\${index}\`);
            const angle = ctx.random(\`angle:\${index}\`) * Math.PI * 2;
            const reach = 0.45 + ctx.random(\`reach:\${index}\`) * 0.55;
            const spin = (ctx.random(\`spin:\${index}\`) * 2 - 1) * 260;

            const startX = Math.cos(angle) * ctx.width * spread * reach;
            const startY = Math.sin(angle) * ctx.height * spread * reach;

            const rawIn = (ctx.t - (0.03 + order * stagger)) / 0.3;
            const flyIn = easeOut(clamp01(rawIn));
            const flyOut = easeIn(clamp01((ctx.t - (0.74 + order * 0.06)) / 0.14));
            const path = flyIn * (1 - flyOut);

            // quadratic bezier from the scattered seed to the aligned slot, bowed by swirl
            const controlX = startX * 0.5 - startY * swirl;
            const controlY = startY * 0.5 + startX * swirl;
            const inverse = 1 - path;
            const offsetX = inverse * inverse * startX + 2 * inverse * path * controlX;
            const offsetY = inverse * inverse * startY + 2 * inverse * path * controlY;

            const arrive = Math.exp(-Math.pow((rawIn - 1) / 0.14, 2));

            return (
              <span
                key={\`\${character}:\${index}\`}
                style={{
                  display: 'inline-block',
                  minWidth: character === ' ' ? '0.62em' : undefined,
                  opacity: clamp01(path * 2.4),
                  transform: \`translate3d(\${offsetX}px, \${offsetY}px, 0) rotate(\${(1 - path) * spin}deg) scale(\${0.55 + path * 0.45})\`,
                  filter: \`blur(\${(1 - path) * 5}px)\`,
                  textShadow: \`0 0 \${4 + arrive * 26}px \${signal}\`,
                }}
              >
                {character}
              </span>
            );
          })}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '18%',
            right: '18%',
            top: '62%',
            height: 1,
            background: signal,
            opacity: 0.55 * formed,
            transform: \`scaleX(\${formed})\`,
            transformOrigin: 'center',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
