const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const axis = String(ctx.params.axis ?? 'vertical');
    const distance = Math.min(0.34, Math.max(0.04, Number(ctx.params.distance ?? 0.18)));
    const cycles = Math.min(3, Math.max(1, Math.round(Number(ctx.params.cycles ?? 2))));
    const edge = Math.min(10, Math.max(1, Number(ctx.params.edge ?? 4)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const open = 0.5 - 0.5 * Math.cos(Math.PI * 2 * cycles * ctx.t);
    const dx = axis === 'horizontal' ? 0 : ctx.width * distance * open;
    const dy = axis === 'vertical' ? 0 : ctx.height * distance * open;
    const diagonal = axis === 'diagonal';
    const firstClip = diagonal
      ? 'polygon(0 0, 70% 0, 30% 100%, 0 100%)'
      : axis === 'horizontal'
        ? 'inset(0 0 50% 0)'
        : 'inset(0 50% 0 0)';
    const secondClip = diagonal
      ? 'polygon(70% 0, 100% 0, 100% 100%, 30% 100%)'
      : axis === 'horizontal'
        ? 'inset(50% 0 0 0)'
        : 'inset(0 0 0 50%)';
    const markerTravel = 0.08 + 0.84 * (0.5 - 0.5 * Math.cos(Math.PI * 2 * ctx.t));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06 + open * 0.08 }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: firstClip,
            transform: \`translate3d(\${-dx}px, \${-dy}px, 0)\`,
            filter: \`drop-shadow(0 0 \${edge * 1.8}px \${signal})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: secondClip,
            transform: \`translate3d(\${dx}px, \${dy}px, 0)\`,
            filter: \`drop-shadow(0 0 \${edge * 1.8}px \${signal})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: axis === 'horizontal' ? \`\${markerTravel * 100}%\` : '50%',
            top: axis === 'horizontal' ? '50%' : \`\${markerTravel * 100}%\`,
            width: axis === 'horizontal' ? 18 + open * 34 : edge * 1.5,
            height: axis === 'horizontal' ? edge * 1.5 : 18 + open * 34,
            borderRadius: 999,
            background: signal,
            opacity: 0.42 + open * 0.5,
            boxShadow: \`0 0 \${10 + edge * 2}px \${signal}\`,
            transform: \`translate(-50%, -50%) rotate(\${diagonal ? 21.8 : 0}deg)\`,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
