const t=`import type { FxKernel } from '../../src/fx/types';

const ease = (value: number) => value * value * (3 - 2 * value);

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const tension = Number(ctx.params.tension ?? 0.58);
    const edge = Number(ctx.params.edge ?? 5);
    const invert = Boolean(ctx.params.invert ?? false);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const cycle = (1 - Math.cos(ctx.t * Math.PI * 2)) * 0.5;
    const progress = ease(Math.max(0, Math.min(1, cycle)));
    const elastic = progress + Math.sin(progress * Math.PI) * 0.08 * tension;
    const from = invert
      ? [[390, 245], [610, 245], [760, 390], [760, 610], [610, 755], [390, 755], [240, 610], [240, 390]]
      : [[0, 0], [1000, 0], [1000, 0], [1000, 1000], [1000, 1000], [0, 1000], [0, 1000], [0, 0]];
    const to = invert
      ? [[0, 0], [1000, 0], [1000, 0], [1000, 1000], [1000, 1000], [0, 1000], [0, 1000], [0, 0]]
      : [[500, 180], [625, 360], [835, 500], [625, 640], [500, 820], [375, 640], [165, 500], [375, 360]];
    const points = from.map(([x, y], index) => {
      const [targetX, targetY] = to[index];
      return [x + (targetX - x) * elastic, y + (targetY - y) * elastic];
    });
    const path = \`\${points.map(([x, y], index) => \`\${index === 0 ? 'M' : 'L'} \${x.toFixed(2)} \${y.toFixed(2)}\`).join(' ')} Z\`;
    const paperOpacity = invert ? 1 - progress : progress;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#F5F1E6', opacity: paperOpacity }} />
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            <mask id="x10-morph-mask">
              <rect width="1000" height="1000" fill="black" />
              <path d={path} fill="white" />
            </mask>
          </defs>
          <path d={path} fill="#0D0E10" stroke={signal} strokeWidth={edge} style={{ filter: \`drop-shadow(0 0 \${edge * 3}px \${signal})\` }} />
          <foreignObject x="0" y="0" width="1000" height="1000" mask="url(#x10-morph-mask)">
            <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: '#0D0E10' }}>
              {ctx.subjectNode}
            </div>
          </foreignObject>
        </svg>
        <div style={{ position: 'absolute', left: '7%', bottom: '7%', color: paperOpacity > 0.5 ? '#0D0E10' : '#F4F7F8', fontFamily: 'monospace', fontSize: 13, letterSpacing: 4 }}>
          {paperOpacity > 0.5 ? 'SCENE B / PAPER' : 'SCENE A / DARK'}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
