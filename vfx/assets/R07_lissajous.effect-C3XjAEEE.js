const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const ratio = String(ctx.params.ratio ?? '3:2');
    const [rawA, rawB] = ratio.split(':').map(Number);
    const frequencyX = Number.isFinite(rawA) ? rawA : 3;
    const frequencyY = Number.isFinite(rawB) ? rawB : 2;
    const trails = Math.min(7, Math.max(1, Math.round(Number(ctx.params.trails ?? 4))));
    const scale = Math.min(0.96, Math.max(0.55, Number(ctx.params.scale ?? 0.82)));
    const lineWidth = Math.min(4, Math.max(0.6, Number(ctx.params.lineWidth ?? 1.6)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;
    const centerX = ctx.width * 0.5;
    const centerY = ctx.height * 0.5;
    const amplitudeX = ctx.width * 0.44 * scale;
    const amplitudeY = ctx.height * 0.43 * scale;
    const sampleCount = 280;

    const makePath = (trailIndex: number) => {
      const trailPhase = phase - trailIndex * 0.055;
      let path = '';
      for (let index = 0; index <= sampleCount; index += 1) {
        const theta = (index / sampleCount) * TAU;
        const x = centerX + Math.sin(frequencyX * theta + trailPhase) * amplitudeX;
        const y = centerY + Math.sin(frequencyY * theta) * amplitudeY;
        path += \`\${index === 0 ? 'M' : 'L'}\${x.toFixed(2)} \${y.toFixed(2)}\`;
      }
      return path;
    };

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.16,
            filter: \`contrast(1.25) saturate(0.65)\`,
            transform: \`scale(\${0.98 + Math.cos(phase) * 0.012})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <svg
          width={ctx.width}
          height={ctx.height}
          viewBox={\`0 0 \${ctx.width} \${ctx.height}\`}
          style={{ position: 'absolute', inset: 0 }}
        >
          {Array.from({ length: trails }, (_, index) => {
            const age = index / Math.max(1, trails - 1);
            return (
              <path
                key={index}
                d={makePath(index)}
                fill="none"
                stroke={signal}
                strokeWidth={lineWidth * (1 - age * 0.35)}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.9 * Math.pow(1 - age, 1.3) + 0.06}
                style={{ filter: index === 0 ? \`drop-shadow(0 0 \${lineWidth * 4}px \${signal})\` : 'none' }}
              />
            );
          })}
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
