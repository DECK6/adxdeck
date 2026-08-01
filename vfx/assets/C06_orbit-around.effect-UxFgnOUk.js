const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const radiusX = Number(ctx.params.radiusX ?? 0.17);
    const radiusY = Number(ctx.params.radiusY ?? 0.08);
    const depth = Number(ctx.params.depth ?? 0.22);
    const laps = Math.max(1, Math.round(Number(ctx.params.laps ?? 1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = (ctx.frame % duration) / duration;
    const angle = phase * Math.PI * 2 * laps - Math.PI / 2;
    const x = Math.cos(angle) * ctx.width * radiusX;
    const y = Math.sin(angle * 2) * ctx.height * radiusY;
    const z = Math.sin(angle);
    const scale = 1 + z * depth;
    const markerX = 50 + Math.cos(angle) * radiusX * 100;
    const markerY = 50 + Math.sin(angle) * radiusY * 100;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', perspective: ctx.width * 1.4 }}>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ position: 'absolute', inset: '8%', width: '84%', height: '84%', opacity: 0.38 }}>
          <ellipse cx="500" cy="500" rx={radiusX * 1000} ry={radiusY * 1000} fill="none" stroke={signal} strokeWidth="3" strokeDasharray="16 18" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, filter: 'grayscale(1)' }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: \`translate3d(\${x}px, \${y}px, \${z * depth * 180}px) scale(\${scale}) rotateY(\${-Math.cos(angle) * 12}deg)\`,
            transformStyle: 'preserve-3d',
            filter: \`brightness(\${0.78 + (z + 1) * 0.2}) drop-shadow(0 \${12 + z * 7}px \${18 + depth * 42}px #000000B8) drop-shadow(0 0 \${4 + (z + 1) * 7}px \${signal})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: \`\${markerX}%\`,
            top: \`\${markerY}%\`,
            width: 14 + depth * 30,
            height: 14 + depth * 30,
            borderRadius: '50%',
            border: \`2px solid \${signal}\`,
            background: signal,
            boxShadow: \`0 0 \${12 + depth * 36}px \${signal}\`,
            opacity: 0.7 + (z + 1) * 0.14,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
