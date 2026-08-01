const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const amplitude = Math.min(0.46, Math.max(0.1, Number(ctx.params.amplitude ?? 0.3)));
    const frequency = Math.min(6, Math.max(1, Number(ctx.params.frequency ?? 3)));
    const detail = Math.min(64, Math.max(20, Math.round(Number(ctx.params.detail ?? 44))));
    const sensitivity = Math.min(2.2, Math.max(0.5, Number(ctx.params.sensitivity ?? 1.25)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const bands = ctx.audio?.bands ?? [0, 0, 0, 0, 0, 0, 0, 0];
    const midY = ctx.height * 0.5;
    const margin = ctx.width * 0.07;
    const usableWidth = ctx.width - margin * 2;
    const phase = Math.PI * 4 * ctx.t;

    const pointAt = (index: number) => {
      const xNorm = index / Math.max(1, detail - 1);
      const bandIndex = Math.min(7, Math.floor(xNorm * 8));
      const band = clamp01(bands[bandIndex] ?? 0);
      const envelope = Math.sin(Math.PI * xNorm);
      const energy = clamp01((0.2 + band * 0.62 + rms * 0.3) * sensitivity);
      const primary = Math.sin(Math.PI * 2 * frequency * xNorm - phase);
      const harmonic = Math.sin(Math.PI * 2 * (frequency * 1.75) * xNorm + phase + bandIndex * 0.31) * 0.28;
      return {
        x: margin + xNorm * usableWidth,
        y: midY + (primary + harmonic) * ctx.height * amplitude * energy * envelope,
      };
    };

    const points = Array.from({ length: detail }, (_, index) => pointAt(index));
    const scan = 0.5 - 0.5 * Math.cos(Math.PI * 2 * ctx.t);
    const headIndex = Math.min(detail - 1, Math.round(scan * (detail - 1)));
    const head = points[headIndex];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1 + rms * 0.16,
            transform: \`translate3d(0, \${Math.sin(phase) * ctx.height * 0.018}px, 0)\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <svg
          viewBox={\`0 0 \${ctx.width} \${ctx.height}\`}
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
        >
          <line x1={margin} y1={midY} x2={ctx.width - margin} y2={midY} stroke={signal} strokeWidth="1" opacity="0.16" />
          <polyline
            points={points.map((point) => \`\${point.x},\${point.y}\`).join(' ')}
            fill="none"
            stroke={signal}
            strokeWidth={Math.max(2, ctx.height * 0.006)}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
            style={{ filter: \`drop-shadow(0 0 10px \${signal})\` }}
          />
          {points.filter((_, index) => index % 4 === 0).map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r={2.5 + rms * 2.5} fill={signal} opacity={0.38 + rms * 0.42} />
          ))}
          <circle
            cx={head.x}
            cy={head.y}
            r={7 + rms * 7}
            fill={signal}
            opacity={0.7 + rms * 0.3}
            style={{ filter: \`drop-shadow(0 0 16px \${signal})\` }}
          />
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
