const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const pointCount = Math.max(8, Math.min(24, Math.round(Number(ctx.params.points ?? 16))));
    const amplitude = Number(ctx.params.amplitude ?? 0.62);
    const laps = Math.max(1, Math.round(Number(ctx.params.laps ?? 1)));
    const thickness = Number(ctx.params.thickness ?? 5);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame % Math.max(1, ctx.durationInFrames)) / Math.max(1, ctx.durationInFrames);
    const scroll = phase * pointCount * laps;
    const whole = Math.floor(scroll);
    const fraction = scroll - whole;
    const spacing = 840 / (pointCount - 1);
    const valueAt = (sample: number) => {
      const wrapped = ((sample % pointCount) + pointCount) % pointCount;
      const noise = ctx.random(\`spark:\${wrapped}\`) - 0.5;
      const wave = Math.sin((wrapped / pointCount) * Math.PI * 4) * 0.28;
      return 500 - (noise * 0.95 + wave) * 560 * amplitude;
    };
    const points = Array.from({ length: pointCount + 3 }, (_, index) => {
      const sample = whole + index - 1;
      return {
        x: 80 + (index - 1 - fraction) * spacing,
        y: Math.max(155, Math.min(845, valueAt(sample))),
      };
    });
    const polyline = points.map((point) => \`\${point.x},\${point.y}\`).join(' ');
    const cursor = (0.5 - Math.cos(phase * Math.PI * 2) * 0.5) * (pointCount - 1);
    const cursorIndex = Math.floor(cursor) + 1;
    const cursorMix = cursor - Math.floor(cursor);
    const cursorA = points[Math.min(points.length - 1, cursorIndex)];
    const cursorB = points[Math.min(points.length - 1, cursorIndex + 1)];
    const cursorX = cursorA.x + (cursorB.x - cursorA.x) * cursorMix;
    const cursorY = cursorA.y + (cursorB.y - cursorA.y) * cursorMix;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '25%', opacity: 0.05 }}>
          {ctx.subjectNode}
        </div>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ position: 'absolute', inset: '8%', width: '84%', height: '84%', overflow: 'hidden' }}>
          {[250, 500, 750].map((y) => (
            <line key={y} x1="70" x2="930" y1={y} y2={y} stroke={signal} strokeWidth="2" opacity="0.1" />
          ))}
          <polyline
            points={polyline}
            fill="none"
            stroke={signal}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: \`drop-shadow(0 0 \${thickness * 2}px \${signal})\` }}
          />
          {points.map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r={thickness * 1.05} fill={signal} opacity="0.72" />
          ))}
          <circle cx={cursorX} cy={cursorY} r={thickness * 3.2} fill="#0D0E10" stroke={signal} strokeWidth={thickness} />
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
