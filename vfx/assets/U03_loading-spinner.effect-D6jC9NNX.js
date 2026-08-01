const t=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const count = Math.min(14, Math.max(6, Math.round(Number(ctx.params.count ?? 10))));
    const cycles = Math.min(4, Math.max(1, Math.round(Number(ctx.params.cycles ?? 2))));
    const size = Math.min(1.25, Math.max(0.65, Number(ctx.params.size ?? 0.92)));
    const trail = Math.min(1, Math.max(0.2, Number(ctx.params.trail ?? 0.76)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU * cycles;
    const unit = Math.min(ctx.width * 0.18, ctx.height * 0.31) * size;
    const centers = [0.22, 0.5, 0.78];
    const elements = Array.from({ length: count }, (_, index) => index);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.14, filter: 'contrast(1.15)' }}>
          {ctx.subjectNode}
        </div>
        {centers.map((center, spinnerIndex) => (
          <div
            key={center}
            style={{
              position: 'absolute',
              left: \`\${center * 100}%\`,
              top: '50%',
              width: unit,
              height: unit,
              borderRadius: '50%',
              transform: \`translate(-50%, -50%) scale(\${1 + Math.sin(phase + spinnerIndex * 0.9) * 0.025})\`,
              background: '#111316CC',
              border: '1px solid #34383F',
              boxShadow: \`0 10px 34px #00000088, inset 0 0 \${unit * 0.24}px #00000099\`,
            }}
          >
            {spinnerIndex === 0 ? (
              <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: \`rotate(\${(phase * 180) / Math.PI}deg)\` }}>
                <circle cx="50" cy="50" r="34" fill="none" stroke="#3B4047" strokeWidth="7" />
                <circle
                  cx="50"
                  cy="50"
                  r="34"
                  fill="none"
                  stroke={signal}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={\`\${60 + trail * 70} 214\`}
                  style={{ filter: \`drop-shadow(0 0 5px \${signal})\` }}
                />
              </svg>
            ) : null}
            {spinnerIndex === 1
              ? elements.map((index) => {
                  const angle = (index / count) * TAU;
                  const head = 0.5 + Math.cos(angle - phase) * 0.5;
                  const opacity = 0.12 + Math.pow(head, 2.4) * 0.88 * trail;
                  const dot = unit * (0.045 + head * 0.018);
                  const radius = unit * 0.33;
                  return (
                    <div
                      key={index}
                      style={{
                        position: 'absolute',
                        left: unit * 0.5 + Math.cos(angle) * radius - dot * 0.5,
                        top: unit * 0.5 + Math.sin(angle) * radius - dot * 0.5,
                        width: dot,
                        height: dot,
                        borderRadius: '50%',
                        background: signal,
                        opacity,
                        boxShadow: opacity > 0.72 ? \`0 0 \${dot * 2.4}px \${signal}\` : 'none',
                      }}
                    />
                  );
                })
              : null}
            {spinnerIndex === 2
              ? elements.map((index) => {
                  const angle = (index / count) * TAU;
                  const head = 0.5 + Math.cos(angle - phase) * 0.5;
                  return (
                    <div
                      key={index}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: unit * 0.065,
                        height: unit * 0.24,
                        marginLeft: unit * -0.0325,
                        marginTop: unit * -0.42,
                        borderRadius: unit * 0.04,
                        transformOrigin: \`50% \${unit * 0.42}px\`,
                        transform: \`rotate(\${(angle * 180) / Math.PI}deg)\`,
                        background: signal,
                        opacity: 0.1 + Math.pow(head, 3) * 0.9 * trail,
                      }}
                    />
                  );
                })
              : null}
          </div>
        ))}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
