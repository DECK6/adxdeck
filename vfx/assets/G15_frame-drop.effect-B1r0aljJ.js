const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const hold = Math.max(1, Math.round(Number(ctx.params.hold ?? 6)));
    const motion = Number(ctx.params.motion ?? 30);
    const jitter = Number(ctx.params.jitter ?? 6);
    const axis = String(ctx.params.axis ?? 'horizontal');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const loopFrame = ((ctx.frame % duration) + duration) % duration;
    const sampledFrame = Math.floor(loopFrame / hold) * hold;
    const previousFrame = (sampledFrame - hold + duration) % duration;
    const holdProgress = (loopFrame - sampledFrame) / hold;

    const transformAt = (frame: number) => {
      const phase = (frame / duration) * Math.PI * 2;
      const offset = Math.sin(phase) * motion + Math.sin(phase * 7) * jitter;
      if (axis === 'vertical') return \`translate3d(0, \${offset}px, 0)\`;
      if (axis === 'rotate') return \`rotate(\${offset * 0.32}deg) scale(\${1 + Math.abs(offset) * 0.0015})\`;
      return \`translate3d(\${offset}px, 0, 0)\`;
    };

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: transformAt(previousFrame),
            opacity: (1 - holdProgress) * 0.28,
            filter: \`brightness(1.25) drop-shadow(0 0 8px \${signal})\`,
            mixBlendMode: 'screen',
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: transformAt(sampledFrame),
            filter: \`drop-shadow(0 0 \${2 + (1 - holdProgress) * 5}px \${signal})\`,
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
