const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;
const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

type Point = { x: number; y: number };

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) * 0.5, y: (a.y + b.y) * 0.5 };
}

function smoothClosedPath(points: Point[]): string {
  const first = midpoint(points[points.length - 1], points[0]);
  let path = \`M \${first.x.toFixed(2)} \${first.y.toFixed(2)}\`;
  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];
    const next = points[(index + 1) % points.length];
    const middle = midpoint(point, next);
    path += \` Q \${point.x.toFixed(2)} \${point.y.toFixed(2)} \${middle.x.toFixed(2)} \${middle.y.toFixed(2)}\`;
  }
  return \`\${path} Z\`;
}

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const gain = Math.min(2.5, Math.max(0.5, Number(ctx.params.gain ?? 1.35)));
    const lobes = Math.min(20, Math.max(8, Math.round(Number(ctx.params.lobes ?? 14) / 2) * 2));
    const wobble = Math.min(1, Math.max(0.1, Number(ctx.params.wobble ?? 0.62)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const bands = Array.from({ length: 8 }, (_, index) => clamp01(ctx.audio?.bands[index] ?? 0));
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const centerX = ctx.width * 0.5;
    const centerY = ctx.height * 0.5;
    const baseRadius = Math.min(ctx.width, ctx.height) * (0.2 + rms * 0.055 * gain);
    const rotation = ctx.t * TAU;
    const points = Array.from({ length: lobes }, (_, index) => {
      const ratio = index / lobes;
      const position = ratio * bands.length;
      const low = Math.floor(position) % bands.length;
      const high = (low + 1) % bands.length;
      const mix = position - Math.floor(position);
      const band = bands[low] * (1 - mix) + bands[high] * mix;
      const angle = ratio * TAU - Math.PI / 2 + rotation;
      const idle = 0.5 + 0.5 * Math.sin(angle * 3 - rotation * 4);
      const surface = clamp01((band * 0.78 + rms * 0.28 + idle * 0.08) * gain);
      const radius = baseRadius * (1 + surface * 0.34 * wobble);
      return { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius };
    });
    const path = smoothClosedPath(points);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#080A0E' }}>
        <svg viewBox={\`0 0 \${ctx.width} \${ctx.height}\`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path d={path} fill="none" stroke={signal} strokeWidth={Math.max(8, Math.min(ctx.width, ctx.height) * 0.045)} opacity={0.12 + rms * 0.12} style={{ filter: \`blur(\${Math.max(5, Math.min(ctx.width, ctx.height) * 0.025)}px)\` }} />
          <path d={path} fill={signal} fillOpacity={0.13 + rms * 0.13} stroke={signal} strokeWidth={Math.max(1.5, Math.min(ctx.width, ctx.height) * 0.008)} strokeOpacity={0.74 + rms * 0.24} style={{ filter: \`drop-shadow(0 0 \${8 + rms * 20}px \${signal})\` }} />
          {points.map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r={1.8 + bands[index % 8] * 3.2} fill={signal} opacity={0.4 + bands[index % 8] * 0.55} />
          ))}
        </svg>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: baseRadius * 1.34,
            height: baseRadius * 1.34,
            overflow: 'hidden',
            borderRadius: '50%',
            opacity: 0.52 + rms * 0.36,
            transform: \`translate(-50%, -50%) scale(\${0.95 + rms * 0.08})\`,
            filter: \`drop-shadow(0 0 \${5 + rms * 14}px \${signal})\`,
          }}
        >
          <div style={{ position: 'absolute', inset: 0, transform: 'scale(1.85)' }}>{ctx.subjectNode}</div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
