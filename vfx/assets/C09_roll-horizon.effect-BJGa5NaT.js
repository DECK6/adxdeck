const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const angle = Number(ctx.params.angle ?? 16);
    const travel = Number(ctx.params.travel ?? 0.08);
    const laps = Math.max(1, Math.round(Number(ctx.params.laps ?? 1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame % Math.max(1, ctx.durationInFrames)) / Math.max(1, ctx.durationInFrames);
    const theta = phase * Math.PI * 2 * laps;
    const roll = Math.sin(theta) * angle;
    const vertical = Math.sin(theta * 2) * ctx.height * travel;
    const markerX = 50 + Math.cos(theta) * 38;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: '-12%',
            transform: \`translate3d(0, \${vertical}px, 0) rotate(\${roll}deg) scale(1.08)\`,
            transformOrigin: 'center',
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '-16%',
            top: '50%',
            width: '132%',
            height: 2,
            background: signal,
            boxShadow: \`0 0 14px \${signal}\`,
            opacity: 0.78,
            transform: \`translateY(\${vertical * 0.42}px) rotate(\${roll}deg)\`,
            transformOrigin: 'center',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: \`\${markerX}%\`,
            top: \`calc(50% + \${vertical * 0.42}px)\`,
            width: 18,
            height: 18,
            border: \`3px solid \${signal}\`,
            borderRadius: '50%',
            background: '#0D0E10',
            boxShadow: \`0 0 18px \${signal}\`,
            transform: \`translate(-50%, -50%) rotate(\${roll}deg)\`,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
