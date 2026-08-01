const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const zoom = Number(ctx.params.zoom ?? 2.35);
    const snap = Math.max(0.01, Number(ctx.params.snap ?? 0.11));
    const smear = Number(ctx.params.smear ?? 0.68);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const pulseAt = (offset: number) => {
      const wave = Math.sin(Math.PI * (ctx.t - 0.38 + offset));
      return Math.exp(-Math.pow(wave / snap, 2));
    };
    const pulse = pulseAt(0);
    const mainScale = 1 + (zoom - 1) * pulse;
    const echoes = [0.014, 0.028, 0.044];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        {echoes.map((delay, index) => {
          const echo = pulseAt(delay);
          const scale = 1 + (zoom - 1) * echo * (0.92 - index * 0.12);
          return (
            <div
              key={delay}
              style={{
                position: 'absolute',
                inset: 0,
                transform: \`scale(\${scale})\`,
                transformOrigin: 'center',
                opacity: smear * echo * (0.22 - index * 0.045),
                filter: \`blur(\${(index + 1) * smear * 3}px) drop-shadow(0 0 \${10 + index * 7}px \${signal})\`,
                mixBlendMode: 'screen',
              }}
            >
              {ctx.subjectNode}
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: \`scale(\${mainScale})\`,
            transformOrigin: 'center',
            filter: \`contrast(\${1 + pulse * 0.32}) blur(\${pulse * smear * 0.65}px)\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: \`\${8 + pulse * 34}%\`,
            border: \`1px solid \${signal}\`,
            opacity: pulse * 0.38,
            transform: \`scale(\${1 + pulse * 1.8})\`,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
