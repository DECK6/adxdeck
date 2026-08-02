const e=`import type { FxKernel } from '../../src/fx/types';

const gearPath = (cx: number, cy: number, teeth: number, rootRadius: number, toothDepth: number): string => {
  const points = Array.from({ length: teeth * 4 }, (_, index) => {
    const angle = (index / (teeth * 4)) * Math.PI * 2 - Math.PI / 2;
    const onTooth = index % 4 === 1 || index % 4 === 2;
    const radius = rootRadius + (onTooth ? toothDepth : 0);
    return \`\${cx + Math.cos(angle) * radius},\${cy + Math.sin(angle) * radius}\`;
  });
  return \`M\${points.join(' L')} Z\`;
};

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const turns = Math.min(3, Math.max(1, Math.round(Number(ctx.params.turns ?? 1))));
    const toothDepth = Math.min(22, Math.max(8, Number(ctx.params.toothDepth ?? 15)));
    const glow = Math.min(1, Math.max(0, Number(ctx.params.glow ?? 0.52)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const drive = ctx.t * turns * 360;
    const gears = [
      { cx: 500, cy: 500, teeth: 24, radius: 168, hole: 82, rotation: drive },
      { cx: 246, cy: 405, teeth: 14, radius: 92, hole: 38, rotation: -drive * (24 / 14) + 7 },
      { cx: 731, cy: 632, teeth: 12, radius: 78, hole: 31, rotation: -drive * 2 + 15 },
    ];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '34%', display: 'grid', placeItems: 'center', opacity: 0.58, filter: \`drop-shadow(0 0 \${4 + glow * 12}px \${signal})\` }}>
          {ctx.subjectNode}
        </div>
        <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', inset: '3%', width: '94%', height: '94%', filter: \`drop-shadow(0 0 \${2 + glow * 9}px \${signal})\` }}>
          <path d="M246 405 L500 500 L731 632" fill="none" stroke={signal} strokeWidth="3" strokeDasharray="8 12" opacity="0.22" />
          {gears.map((gear, index) => (
            <g key={index} transform={\`rotate(\${gear.rotation} \${gear.cx} \${gear.cy})\`}>
              <path
                d={gearPath(gear.cx, gear.cy, gear.teeth, gear.radius, toothDepth)}
                fill="#0D0E10"
                fillOpacity="0.82"
                stroke={signal}
                strokeWidth={index === 0 ? 6 : 5}
                strokeLinejoin="round"
              />
              <circle cx={gear.cx} cy={gear.cy} r={gear.radius * 0.7} fill="none" stroke={signal} strokeWidth="3" opacity="0.38" />
              <circle cx={gear.cx} cy={gear.cy} r={gear.hole} fill="#0D0E10" stroke={signal} strokeWidth="5" />
              {Array.from({ length: index === 0 ? 6 : 4 }, (_, spoke) => {
                const angle = (spoke / (index === 0 ? 6 : 4)) * Math.PI * 2;
                return (
                  <line
                    key={spoke}
                    x1={gear.cx + Math.cos(angle) * gear.hole}
                    y1={gear.cy + Math.sin(angle) * gear.hole}
                    x2={gear.cx + Math.cos(angle) * gear.radius * 0.68}
                    y2={gear.cy + Math.sin(angle) * gear.radius * 0.68}
                    stroke={signal}
                    strokeWidth={index === 0 ? 12 : 9}
                    opacity="0.55"
                  />
                );
              })}
            </g>
          ))}
          <circle cx="372" cy="453" r="8" fill={signal} opacity="0.9" />
          <circle cx="617" cy="567" r="8" fill={signal} opacity="0.9" />
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
