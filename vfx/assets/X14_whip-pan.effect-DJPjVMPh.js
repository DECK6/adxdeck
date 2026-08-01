const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const direction = String(ctx.params.direction ?? 'left');
    const blur = Number(ctx.params.blur ?? 22);
    const overshoot = Number(ctx.params.overshoot ?? 0.06);
    const trails = Math.max(2, Math.round(Number(ctx.params.trails ?? 5)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const theta = ctx.t * Math.PI * 2;
    const cycle = (1 - Math.cos(theta)) / 2;
    const velocity = Math.sin(theta);
    const speed = Math.abs(velocity);
    const progress = cycle + overshoot * Math.sin(Math.PI * cycle) * velocity;
    const panSign = direction === 'left' ? 1 : -1;
    const movementSign = -panSign * Math.sign(velocity || 1);

    const subjectLayer = (index: number, trailOffset: number, opacity: number) => {
      const x = panSign * (index - progress) * ctx.width + trailOffset;
      return (
        <div
          key={\`\${index}:\${trailOffset}\`}
          style={{
            position: 'absolute',
            inset: 0,
            opacity,
            transform: \`translate3d(\${x}px, 0, 0) scale(\${1 + speed * 0.018})\`,
            filter: \`blur(\${blur * speed}px)\`,
          }}
        >
          {ctx.subjectNode}
        </div>
      );
    };

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        {speed > 0.01
          ? Array.from({ length: trails }, (_, trail) => {
              const lag = ((trail + 1) / trails) * blur * 2.4 * speed * movementSign;
              return [subjectLayer(0, lag, 0.11 / trails), subjectLayer(1, lag, 0.11 / trails)];
            })
          : null}
        {subjectLayer(0, 0, 1)}
        {subjectLayer(1, 0, 1)}
        {Array.from({ length: trails }, (_, index) => {
          const y = ((index + 0.5) / trails) * ctx.height;
          const length = ctx.width * (0.08 + speed * (0.12 + index * 0.018));
          return (
            <div
              key={\`streak:\${index}\`}
              style={{
                position: 'absolute',
                left: direction === 'left' ? ctx.width - length : 0,
                top: y,
                width: length,
                height: 1,
                background: \`linear-gradient(\${direction === 'left' ? '90deg' : '270deg'}, transparent, \${signal})\`,
                opacity: speed * (0.12 + (index % 3) * 0.08),
                transform: \`translateX(\${movementSign * speed * 26}px)\`,
              }}
            />
          );
        })}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
