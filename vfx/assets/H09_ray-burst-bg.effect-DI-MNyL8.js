const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const rayCount = Math.min(32, Math.max(10, Math.round(Number(ctx.params.rays ?? 20) / 2) * 2));
    const rotation = Math.min(2, Math.max(-2, Math.round(Number(ctx.params.rotation ?? 1))));
    const intensity = Math.min(1, Math.max(0.15, Number(ctx.params.intensity ?? 0.62)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * Math.PI * 2;
    const angle = (phase * rotation * 180) / Math.PI;
    const pulse = 0.82 + Math.sin(phase * 2) * 0.12;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: \`radial-gradient(circle at 50% 52%, \${signal}20 0%, #101A20 18%, #0D0E10 66%)\` }}>
        <div style={{ position: 'absolute', left: '50%', top: '52%', width: '154vmax', height: '154vmax', transform: \`translate(-50%, -50%) rotate(\${angle}deg)\`, opacity: intensity * pulse }}>
          {Array.from({ length: rayCount }, (_, index) => {
            const spread = 360 / rayCount;
            const width = spread * (0.2 + ctx.random(\`ray:\${index}:width\`) * 0.3);
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: '50%',
                  height: \`\${Math.max(2, width)}%\`,
                  transformOrigin: '0 50%',
                  transform: \`translateY(-50%) rotate(\${index * spread}deg)\`,
                  clipPath: 'polygon(0 38%, 100% 0, 100% 100%, 0 62%)',
                  background: \`linear-gradient(90deg, \${signal}44, \${signal}0A 74%, transparent)\`,
                }}
              />
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: '50%', top: '52%', width: '24%', aspectRatio: '1', transform: 'translate(-50%, -50%)', borderRadius: '50%', background: \`\${signal}18\`, filter: 'blur(26px)' }} />
        <div style={{ position: 'absolute', inset: '16%', opacity: 0.26, transform: \`scale(\${0.97 + Math.sin(phase) * 0.015})\` }}>{ctx.subjectNode}</div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
