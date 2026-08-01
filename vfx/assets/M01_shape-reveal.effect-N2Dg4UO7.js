const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const shape = String(ctx.params.shape ?? 'circle');
    const size = Number(ctx.params.size ?? 1);
    const originX = Number(ctx.params.originX ?? 50);
    const originY = Number(ctx.params.originY ?? 50);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const progress = ctx.t * ctx.t * (3 - 2 * ctx.t);
    const extent = progress * 88 * size;
    const diamond = \`\${originX}% \${originY - extent}%, \${originX + extent}% \${originY}%, \${originX}% \${originY + extent}%, \${originX - extent}% \${originY}%\`;
    const square = \`inset(\${Math.max(-20, originY - extent)}% \${Math.max(-20, 100 - originX - extent)}% \${Math.max(-20, 100 - originY - extent)}% \${Math.max(-20, originX - extent)}%)\`;
    const clipPath = shape === 'diamond'
      ? \`polygon(\${diamond})\`
      : shape === 'square'
        ? square
        : \`circle(\${extent}% at \${originX}% \${originY}%)\`;
    const ringSize = Math.max(2, extent * 2);
    const ringRadius = shape === 'circle' ? '50%' : shape === 'diamond' ? '2%' : '0';
    const ringRotation = shape === 'diamond' ? 45 : 0;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', inset: 0, clipPath }}>{ctx.subjectNode}</div>
        {progress < 0.995 ? (
          <div
            style={{
              position: 'absolute',
              left: \`\${originX}%\`,
              top: \`\${originY}%\`,
              width: \`\${ringSize}%\`,
              aspectRatio: '1',
              border: \`2px solid \${signal}\`,
              borderRadius: ringRadius,
              boxShadow: \`0 0 14px \${signal}\`,
              opacity: 0.35 + (1 - progress) * 0.45,
              transform: \`translate(-50%, -50%) rotate(\${ringRotation}deg)\`,
            }}
          />
        ) : null}
        <div style={{ position: 'absolute', left: 48, bottom: 42, width: 96 + progress * 160, height: 3, background: signal, opacity: 0.8 }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
