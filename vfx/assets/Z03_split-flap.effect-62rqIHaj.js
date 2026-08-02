const t=`import type { FxKernel } from '../../src/fx/types';

const ALPHABET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const cells = Math.max(4, Math.round(Number(ctx.params.cells ?? 7)));
    const speed = Math.max(1, Number(ctx.params.speed ?? 2));
    const stagger = Math.min(0.8, Math.max(0, Number(ctx.params.stagger ?? 0.34)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame % Math.max(1, ctx.durationInFrames)) / Math.max(1, ctx.durationInFrames);
    const label = ctx.subject.label.toUpperCase().replace(/[^ A-Z0-9]/g, '').padEnd(cells, ' ').slice(0, cells);
    const cellWidth = Math.min(ctx.width * 0.11, ctx.height * 0.17);
    const cellHeight = cellWidth * 1.35;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', perspective: ctx.width }}>
        <div style={{ position: 'absolute', inset: '5% 8% 28%', opacity: 0.32, filter: 'contrast(1.15)' }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '50%', top: '70%', transform: 'translate(-50%, -50%)', display: 'flex', gap: Math.max(3, cellWidth * 0.06), padding: cellWidth * 0.12, background: '#08090A', border: '1px solid #33383D', boxShadow: '0 16px 38px #000B' }}>
          {label.split('').map((target, index) => {
            const cycle = phase * speed * ALPHABET.length - index * stagger * 4;
            const step = ((Math.floor(cycle) % ALPHABET.length) + ALPHABET.length) % ALPHABET.length;
            const local = cycle - Math.floor(cycle);
            const targetIndex = Math.max(0, ALPHABET.indexOf(target));
            const locked = phase > 0.64 && phase < 0.9;
            const currentChar = locked ? target : ALPHABET[step];
            const nextChar = locked ? target : ALPHABET[(step + 1) % ALPHABET.length];
            const flip = locked ? 0 : Math.min(1, local * 1.65);
            const glyphStyle = { position: 'absolute' as const, left: 0, width: '100%', height: cellHeight, display: 'grid', placeItems: 'center', color: '#F5F7F8', fontFamily: 'JetBrains Mono, monospace', fontSize: cellHeight * 0.62, fontWeight: 800, lineHeight: 1 };
            const displayChar = locked ? ALPHABET[targetIndex] : currentChar;
            return (
              <div key={index} data-layout-allow-overlap data-layout-allow-occlusion style={{ position: 'relative', width: cellWidth, height: cellHeight, background: '#17191C', border: '1px solid #34383C', borderRadius: 3, overflow: 'hidden', transformStyle: 'preserve-3d' }}>
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}><div style={glyphStyle}>{nextChar}</div></div>
                <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '50%', overflow: 'hidden', background: '#202327' }}><div style={glyphStyle}>{displayChar}</div></div>
                <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: '50%', overflow: 'hidden', background: '#151719' }}><div style={{ ...glyphStyle, bottom: 0 }}>{nextChar}</div></div>
                {!locked && flip < 0.5 ? <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '50%', overflow: 'hidden', background: '#202327', transformOrigin: '50% 100%', transform: \`rotateX(\${-flip * 180}deg)\`, backfaceVisibility: 'hidden', zIndex: 3 }}><div style={glyphStyle}>{currentChar}</div></div> : null}
                {!locked && flip >= 0.5 ? <div style={{ position: 'absolute', left: 0, top: '50%', width: '100%', height: '50%', overflow: 'hidden', background: '#151719', transformOrigin: '50% 0', transform: \`rotateX(\${(1 - flip) * 180}deg)\`, backfaceVisibility: 'hidden', zIndex: 3 }}><div style={{ ...glyphStyle, bottom: 0 }}>{nextChar}</div></div> : null}
                <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 2, transform: 'translateY(-1px)', background: '#050607', boxShadow: \`0 0 4px \${signal}33\`, zIndex: 5 }} />
                <div style={{ position: 'absolute', left: 3, top: '50%', width: 3, height: 3, borderRadius: '50%', transform: 'translateY(-50%)', background: signal, zIndex: 6 }} />
              </div>
            );
          })}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
