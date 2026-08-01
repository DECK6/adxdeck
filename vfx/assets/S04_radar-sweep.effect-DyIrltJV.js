const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const speed = Number(ctx.params.speed ?? 1);
    const trail = Number(ctx.params.trail ?? 54);
    const blipCount = Math.round(Number(ctx.params.blips ?? 5));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const turns = ctx.t * speed;
    const sweepAngle = (turns % 1) * Math.PI * 2 - Math.PI / 2;
    const sweepDegrees = (turns % 1) * 360;
    const blips = Array.from({ length: blipCount }, (_, index) => {
      const angle = ctx.random(\`blip-angle:\${index}\`) * Math.PI * 2;
      const radius = 95 + ctx.random(\`blip-radius:\${index}\`) * 260;
      const x = 500 + Math.cos(angle) * radius;
      const y = 500 + Math.sin(angle) * radius;
      const angularDistance = ((sweepAngle - angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      const freshness = Math.max(0, 1 - angularDistance / (Math.PI * 0.9));
      const blink = 0.72 + Math.sin(ctx.t * Math.PI * 12 + index * 1.9) * 0.28;
      return { x, y, opacity: freshness * blink, size: 5 + ctx.random(\`blip-size:\${index}\`) * 7 };
    });

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.2, filter: \`grayscale(1) drop-shadow(0 0 4px \${signal})\` }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.82,
            filter: \`drop-shadow(0 0 9px \${signal})\`,
            maskImage: \`conic-gradient(from \${sweepDegrees - trail}deg, transparent 0deg, black \${trail}deg, transparent \${trail + 1}deg)\`,
            WebkitMaskImage: \`conic-gradient(from \${sweepDegrees - trail}deg, transparent 0deg, black \${trail}deg, transparent \${trail + 1}deg)\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <svg
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: '7%', width: '86%', height: '86%' }}
        >
          <defs>
            <radialGradient id="s04-radar-field">
              <stop offset="0%" stopColor={signal} stopOpacity="0.08" />
              <stop offset="100%" stopColor={signal} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="s04-radar-trail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={signal} stopOpacity="0" />
              <stop offset="100%" stopColor={signal} stopOpacity="0.42" />
            </linearGradient>
          </defs>
          <circle cx="500" cy="500" r="390" fill="url(#s04-radar-field)" stroke={signal} strokeWidth="3" opacity="0.68" />
          {[98, 195, 292].map((radius) => (
            <circle key={radius} cx="500" cy="500" r={radius} fill="none" stroke={signal} strokeWidth="2" opacity="0.18" />
          ))}
          <path d="M110 500 H890 M500 110 V890" stroke={signal} strokeWidth="2" opacity="0.15" />
          <g transform={\`rotate(\${sweepDegrees} 500 500)\`}>
            <path d="M500 500 L890 500 A390 390 0 0 0 500 110 Z" fill="url(#s04-radar-trail)" opacity={Math.min(1, trail / 54)} />
            <line x1="500" y1="500" x2="890" y2="500" stroke={signal} strokeWidth="5" style={{ filter: \`drop-shadow(0 0 10px \${signal})\` }} />
          </g>
          {blips.map((blip, index) => (
            <g key={index} opacity={blip.opacity}>
              <circle cx={blip.x} cy={blip.y} r={blip.size * 2.4} fill="none" stroke={signal} strokeWidth="2" />
              <circle cx={blip.x} cy={blip.y} r={blip.size} fill={signal} />
            </g>
          ))}
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
