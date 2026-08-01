const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const speed = Math.min(2, Math.max(0.5, Number(ctx.params.speed ?? 1)));
    const trackCount = Math.min(4, Math.max(2, Math.round(Number(ctx.params.tracks ?? 3))));
    const scale = String(ctx.params.scale ?? 'seconds');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const loopCount = speed >= 1.75 ? 3 : speed >= 1.25 ? 2 : 1;
    const phase = (ctx.t * loopCount) % 1;
    const scrub = 0.5 - 0.5 * Math.cos(Math.PI * 2 * phase);
    const playhead = 12 + scrub * 76;
    const ticks = Array.from({ length: 17 }, (_, index) => index);
    const tracks = Array.from({ length: trackCount }, (_, index) => index);
    const clipLayouts = [
      [{ left: 2, width: 28 }, { left: 34, width: 22 }, { left: 60, width: 36 }],
      [{ left: 7, width: 18 }, { left: 29, width: 38 }, { left: 72, width: 23 }],
      [{ left: 1, width: 42 }, { left: 47, width: 19 }, { left: 70, width: 28 }],
      [{ left: 4, width: 23 }, { left: 31, width: 29 }, { left: 65, width: 31 }],
    ];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F4F7F8' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.34,
            transform: \`scale(\${0.92 + scrub * 0.08})\`,
            filter: \`drop-shadow(0 0 \${8 + scrub * 16}px \${signal})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '7%',
            right: '7%',
            bottom: '8%',
            height: \`\${34 + trackCount * 9}%\`,
            padding: '3% 3.5%',
            boxSizing: 'border-box',
            border: \`1px solid \${signal}55\`,
            borderRadius: 12,
            background: '#11151AF2',
            boxShadow: \`0 18px 50px #00000088, 0 0 22px \${signal}12\`,
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '15%', color: '#F4F7F8', fontSize: Math.max(8, ctx.width * 0.012), letterSpacing: '0.08em' }}>
            <span>TIMELINE / 06:00</span>
            <span style={{ color: signal }}>{scale === 'frames' ? \`F \${Math.round(scrub * 180).toString().padStart(3, '0')}\` : \`00:0\${(scrub * 6).toFixed(2)}\`}</span>
          </div>
          <div style={{ position: 'relative', height: '14%', marginTop: '1%' }}>
            {ticks.map((tick) => (
              <div key={tick} style={{ position: 'absolute', left: \`\${tick * 6.25}%\`, top: 0, bottom: 0, width: 1, background: tick % 4 === 0 ? '#F4F7F866' : '#F4F7F826' }}>
                {tick % 4 === 0 ? <span style={{ position: 'absolute', top: -2, left: 4, color: '#F4F7F8', fontSize: Math.max(6, ctx.width * 0.008) }}>{scale === 'frames' ? tick * 12 : \`\${(tick * 0.375).toFixed(1)}s\`}</span> : null}
              </div>
            ))}
          </div>
          <div style={{ position: 'relative', height: '66%' }}>
            {tracks.map((track) => (
              <div key={track} style={{ position: 'relative', height: \`\${100 / trackCount}%\`, borderTop: '1px solid #FFFFFF12' }}>
                {clipLayouts[track].map((clip, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      left: \`\${clip.left}%\`,
                      top: '16%',
                      width: \`\${clip.width}%\`,
                      height: '68%',
                      border: \`1px solid \${index === 1 ? signal : '#F4F7F83D'}\`,
                      borderRadius: 3,
                      background: index === 1 ? \`\${signal}32\` : '#273039',
                      boxShadow: index === 1 ? \`inset 3px 0 0 \${signal}\` : 'none',
                    }}
                  />
                ))}
              </div>
            ))}
            <div style={{ position: 'absolute', left: \`\${playhead}%\`, top: '-24%', bottom: '-5%', width: 2, background: signal, boxShadow: \`0 0 10px \${signal}\`, transform: 'translateX(-1px)' }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, width: 10, height: 8, background: signal, clipPath: 'polygon(0 0, 100% 0, 50% 100%)', transform: 'translateX(-50%)' }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
