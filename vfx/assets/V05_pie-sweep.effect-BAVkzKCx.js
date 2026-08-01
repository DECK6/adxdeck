const n=`import type { FxKernel } from '../../src/fx/types';

function colorWithAlpha(color: string, alpha: number): string {
  const hex = color.replace('#', '');
  const expanded = hex.length === 3 ? hex.split('').map((digit) => digit + digit).join('') : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return color;
  const value = Number.parseInt(expanded, 16);
  return \`rgba(\${(value >> 16) & 255}, \${(value >> 8) & 255}, \${value & 255}, \${alpha})\`;
}

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const segmentCount = Math.max(3, Math.min(8, Math.round(Number(ctx.params.segments ?? 5))));
    const hole = Number(ctx.params.hole ?? 0.32);
    const cycles = Math.max(1, Math.round(Number(ctx.params.cycles ?? 1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame / Math.max(1, ctx.durationInFrames)) * Math.PI * 2 * cycles;
    const progress = 0.5 - Math.cos(phase) * 0.5;
    const weights = Array.from({ length: segmentCount }, (_, index) => 0.5 + ctx.random(\`slice:\${index}\`));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let cursor = 0;
    const stops: string[] = [];
    weights.forEach((weight, index) => {
      const start = cursor;
      cursor += (weight / total) * 360;
      const inset = Math.min(1.2, (cursor - start) * 0.08);
      const color = colorWithAlpha(signal, 1 - index * (0.52 / Math.max(1, segmentCount - 1)));
      stops.push(\`transparent \${start}deg \${start + inset}deg\`);
      stops.push(\`\${color} \${start + inset}deg \${cursor}deg\`);
    });
    const size = Math.min(ctx.width, ctx.height) * 0.68;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '25%', opacity: 0.11 }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: size,
            height: size,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%) rotate(-90deg)',
            background: \`conic-gradient(\${stops.join(', ')})\`,
            maskImage: \`radial-gradient(circle, transparent 0 \${hole * 50}%, #000 \${hole * 50 + 0.6}%), conic-gradient(#000 0deg \${progress * 360}deg, transparent \${progress * 360 + 0.5}deg)\`,
            WebkitMaskImage: \`radial-gradient(circle, transparent 0 \${hole * 50}%, #000 \${hole * 50 + 0.6}%), conic-gradient(#000 0deg \${progress * 360}deg, transparent \${progress * 360 + 0.5}deg)\`,
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
            filter: \`drop-shadow(0 0 \${size * 0.035}px \${colorWithAlpha(signal, 0.38)})\`,
          }}
        />
        {/* sweep needle + tip dot: geometry motion (conic mask animation is paint-only) */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 2.5,
            height: size / 2,
            background: '#F7FAFC',
            opacity: 0.9,
            transformOrigin: '50% 0%',
            transform: \`translate(-50%, 0) rotate(\${180 + progress * 360}deg)\`,
          }}
        />
        {(() => {
          const a = (progress * 360 - 90) * (Math.PI / 180);
          const r = size / 2;
          return (
            <div
              style={{
                position: 'absolute',
                left: \`calc(50% + \${Math.cos(a) * r}px)\`,
                top: \`calc(50% + \${Math.sin(a) * r}px)\`,
                width: 10,
                height: 10,
                marginLeft: -5,
                marginTop: -5,
                borderRadius: '50%',
                background: signal,
                boxShadow: \`0 0 12px \${signal}\`,
              }}
            />
          );
        })()}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
