const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const direction = String(ctx.params.direction ?? 'left');
    const duration = Number(ctx.params.duration ?? 0.62);
    const edge = Number(ctx.params.edge ?? 5);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const raw = Math.min(1, Math.max(0, (ctx.t - 0.08) / duration));
    const progress = raw * raw * (3 - 2 * raw);
    const outro = Math.min(1, Math.max(0, (1 - ctx.t) / 0.1));
    const hidden = (1 - progress) * 100;
    const clipPath = direction === 'right'
      ? \`inset(0 0 0 \${hidden}%)\`
      : direction === 'up'
        ? \`inset(\${hidden}% 0 0 0)\`
        : \`inset(0 \${hidden}% 0 0)\`;
    const edgeStyle = direction === 'up'
      ? { left: 0, right: 0, top: \`\${(1 - progress) * 100}%\`, height: edge }
      : direction === 'right'
        ? { top: 0, bottom: 0, right: \`\${progress * 100}%\`, width: edge }
        : { top: 0, bottom: 0, left: \`\${progress * 100}%\`, width: edge };

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, clipPath, opacity: outro }}>
          {ctx.subjectNode}
        </div>
        {progress > 0 && progress < 1 ? (
          <div
            style={{
              position: 'absolute',
              ...edgeStyle,
              background: signal,
              boxShadow: \`0 0 \${edge * 4}px \${signal}\`,
              opacity: 0.9 * outro,
            }}
          />
        ) : null}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
