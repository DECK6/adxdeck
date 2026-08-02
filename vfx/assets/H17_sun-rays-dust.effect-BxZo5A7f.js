const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const rayCount = Math.max(5, Math.round(Number(ctx.params.rayCount ?? 9)));
    const dust = Math.max(12, Math.round(Number(ctx.params.dust ?? 28)));
    const drift = Number(ctx.params.drift ?? 1);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ((ctx.frame % duration) / duration) * TAU;
    const rayStops = Array.from({ length: rayCount * 2 }, (_, index) => {
      const position = (index / (rayCount * 2)) * 100;
      return \`\${index % 2 === 0 ? \`\${signal}20\` : 'transparent'} \${position}%\`;
    }).join(', ');

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'linear-gradient(145deg, #111B20 0%, #0D0E10 54%, #08090B 100%)' }}>
        <div
          style={{
            position: 'absolute',
            left: '-58%',
            top: '-115%',
            width: '190%',
            aspectRatio: '1',
            borderRadius: '50%',
            background: \`conic-gradient(from \${-18 + Math.sin(phase) * 2.5}deg, \${rayStops})\`,
            filter: 'blur(7px)',
            opacity: 0.72,
            transform: \`rotate(\${Math.sin(phase) * 1.4}deg)\`,
            transformOrigin: '50% 50%',
          }}
        />
        <div style={{ position: 'absolute', left: '-9%', top: '-13%', width: '34%', aspectRatio: '1', borderRadius: '50%', background: \`radial-gradient(circle, #FFFFFFC8 0%, \${signal}5C 12%, \${signal}18 38%, transparent 70%)\`, filter: 'blur(4px)' }} />
        {Array.from({ length: dust }, (_, index) => {
          const startX = ctx.random(\`dust:\${index}:x\`);
          const startY = ctx.random(\`dust:\${index}:y\`);
          const radius = 1 + ctx.random(\`dust:\${index}:r\`) * 2.4;
          const orbit = (0.012 + ctx.random(\`dust:\${index}:orbit\`) * 0.035) * drift;
          const offset = ctx.random(\`dust:\${index}:phase\`) * TAU;
          const x = (startX + Math.sin(phase + offset) * orbit + 1) % 1;
          const y = (startY + Math.cos(phase + offset) * orbit * 0.62 + 1) % 1;
          return <span key={index} style={{ position: 'absolute', left: x * 100 + '%', top: y * 100 + '%', width: radius, height: radius, borderRadius: '50%', background: index % 4 === 0 ? signal : '#F7FAFC', opacity: 0.18 + ctx.random(\`dust:\${index}:alpha\`) * 0.42, boxShadow: \`0 0 \${radius * 4}px \${signal}\` }} />;
        })}
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: 0.26, transform: 'scale(0.94)' }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 48% 46%, transparent 20%, #0D0E105C 72%, #0D0E10C8 100%)' }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
