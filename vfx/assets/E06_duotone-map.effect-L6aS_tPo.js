const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const contrast = Number(ctx.params.contrast ?? 1.65);
    const mix = Number(ctx.params.mix ?? 0.88);
    const shadow = String(ctx.params.shadow ?? '#0D0E10');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const turn = ctx.t * Math.PI * 2;
    const breathingContrast = contrast * (0.94 + Math.sin(turn) * 0.06);
    // Wipe divider travels the full frame — geometry motion (gradient position is paint-only)
    const wipe = 50 + Math.sin(turn) * 46;

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          isolation: 'isolate',
          background: shadow,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            filter: \`grayscale(1) contrast(\${breathingContrast}) brightness(0.92)\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        {/* duotone tint applies left of the traveling divider — width animates (geometry) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: \`\${wipe}%\`,
            overflow: 'hidden',
            background: \`linear-gradient(118deg, \${shadow} 0%, \${signal} 130%)\`,
            mixBlendMode: 'multiply',
            opacity: mix,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: \`\${wipe}%\`,
            width: 2,
            marginLeft: -1,
            background: signal,
            opacity: 0.85,
            boxShadow: \`0 0 14px \${signal}\`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: mix * 0.28,
            filter: \`contrast(\${1.15 + contrast * 0.12}) drop-shadow(0 0 10px \${signal})\`,
            mixBlendMode: 'screen',
          }}
        >
          {ctx.subjectNode}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
