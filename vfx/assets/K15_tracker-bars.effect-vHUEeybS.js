const n=`import type { FxKernel } from '../../src/fx/types';

const NOTES = ['C-2', 'D#2', 'F-2', 'G#2', 'A#2', 'C-3', 'E-3', '---'];
const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const channels = Math.max(3, Math.min(6, Math.round(Number(ctx.params.channels ?? 4))));
    const rows = Math.max(5, Math.min(10, Math.round(Number(ctx.params.rows ?? 7))));
    const tempo = Math.min(4, Math.max(1, Math.round(Number(ctx.params.tempo ?? 2))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;
    const step = Math.floor(ctx.t * 64 * tempo) % 64;
    const playhead = step % rows;
    const rowHeight = Math.min(ctx.height * 0.073, ctx.width * 0.035);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', fontFamily: 'JetBrains Mono, monospace' }}>
        <div style={{ position: 'absolute', inset: '11% 17%', opacity: 0.09, filter: \`grayscale(1) drop-shadow(0 0 10px \${signal})\` }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '50%', top: '49%', width: '82%', transform: 'translate(-50%, -50%)', border: '1px solid #394146', background: '#080A0BEF', boxShadow: '0 16px 38px #000C' }}>
          <div style={{ display: 'grid', gridTemplateColumns: \`0.45fr repeat(\${channels}, 1fr)\`, color: '#AEB8BC', background: '#151A1D', borderBottom: \`1px solid \${signal}55\`, fontSize: rowHeight * 0.27, padding: \`\${rowHeight * 0.22}px 0\` }}>
            <span style={{ textAlign: 'center' }}>ROW</span>
            {Array.from({ length: channels }, (_, channel) => <span key={channel} style={{ textAlign: 'center', color: signal }}>CH{channel + 1}</span>)}
          </div>
          {Array.from({ length: rows }, (_, row) => (
            <div key={row} style={{ position: 'relative', height: rowHeight, display: 'grid', gridTemplateColumns: \`0.45fr repeat(\${channels}, 1fr)\`, alignItems: 'center', color: row === playhead ? '#F3FBFC' : '#879195', background: row === playhead ? \`\${signal}1F\` : row % 2 === 0 ? '#0B0E10' : '#101416', borderBottom: row === rows - 1 ? 'none' : '1px solid #20272A', fontSize: rowHeight * 0.31 }}>
              <span style={{ textAlign: 'center', color: row === playhead ? signal : '#96A3A7' }}>{String((step - playhead + row + 64) % 64).padStart(2, '0')}</span>
              {Array.from({ length: channels }, (_, channel) => {
                const noteIndex = (step + row * 7 + channel * 11) % NOTES.length;
                const volume = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(phase * tempo + channel * 1.8 + row * 0.63));
                return (
                  <span key={channel} style={{ position: 'relative', height: '100%', display: 'grid', placeItems: 'center', borderLeft: '1px solid #222A2E', letterSpacing: '0.06em' }}>
                    {NOTES[noteIndex]}
                    <span style={{ position: 'absolute', left: '8%', bottom: 2, width: \`\${volume * 84}%\`, height: 2, background: signal, opacity: row === playhead ? 0.95 : 0.34 }} />
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
