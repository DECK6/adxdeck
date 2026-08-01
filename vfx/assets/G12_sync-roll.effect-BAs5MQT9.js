const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const speed = Math.max(1, Math.round(Number(ctx.params.speed ?? 1)));
    const tear = Number(ctx.params.tear ?? 18);
    const wobble = Number(ctx.params.wobble ?? 7);
    const direction = String(ctx.params.direction ?? 'down');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = (ctx.frame % duration) / duration;
    const roll = (phase * speed) % 1;
    const sign = direction === 'up' ? -1 : 1;
    const x = Math.sin(phase * Math.PI * 2 * speed * 2) * wobble;
    const seam = roll * 100;

    const rolledSubject = (extraX: number) => (
      <>
        {[-1, 0, 1].map((offset) => (
          <div
            key={offset}
            style={{
              position: 'absolute',
              inset: 0,
              transform: \`translate3d(\${x + extraX}px, \${(roll + offset) * ctx.height * sign}px, 0)\`,
            }}
          >
            {ctx.subjectNode}
          </div>
        ))}
      </>
    );

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        {rolledSubject(0)}
        {tear > 0 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: \`inset(\${Math.max(0, seam - 4)}% 0 \${Math.max(0, 96 - seam)}% 0)\`,
              filter: \`drop-shadow(\${tear * 0.3}px 0 3px \${signal})\`,
              opacity: 0.78,
            }}
          >
            {rolledSubject(tear)}
          </div>
        ) : null}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: \`\${seam}%\`,
            height: 2,
            transform: 'translateY(-1px)',
            background: signal,
            boxShadow: \`0 0 10px \${signal}\`,
            opacity: 0.7,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
