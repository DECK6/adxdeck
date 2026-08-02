const t=`import type { FxKernel } from '../../src/fx/types';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const fileCount = Math.max(1, Math.min(3, Math.round(Number(ctx.params.files ?? 2))));
    const cycles = Math.max(1, Math.min(2, Math.round(Number(ctx.params.cycles ?? 1))));
    const drop = Math.max(0.5, Math.min(1.4, Number(ctx.params.drop ?? 0.92)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.t * cycles) % 1;
    const arrival = smooth(phase / 0.25);
    const progress = smooth((phase - 0.23) / 0.48);
    const done = smooth((phase - 0.72) / 0.12);
    const fade = 1 - smooth((phase - 0.9) / 0.1);
    const panelWidth = Math.min(ctx.width * 0.64, ctx.height * 1.08);
    const panelHeight = Math.min(ctx.height * 0.62, panelWidth * 0.62);
    const bounce = Math.sin(arrival * Math.PI * 2.5) * (1 - arrival) * 14 * drop;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F4FAFB', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.09 }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '50%', top: '51%', width: panelWidth, height: panelHeight, transform: \`translate(-50%, -50%) scale(\${0.96 + arrival * 0.04})\`, opacity: fade, border: \`1px dashed \${done > 0.5 ? signal : '#657179'}\`, borderRadius: 14, background: '#14181BEF', boxShadow: \`0 22px 55px #00000099, inset 0 0 30px \${signal}0D\` }}>
          <div style={{ position: 'absolute', left: '7%', right: '7%', top: '8%', display: 'flex', justifyContent: 'space-between', color: '#AAB8BD', fontSize: Math.max(7, ctx.width * 0.009), letterSpacing: '0.12em' }}><span>DEXA VFX DROPZONE</span><span>{done > 0.5 ? 'VERIFIED' : 'READY'}</span></div>
          {Array.from({ length: fileCount }, (_, index) => {
            const stagger = smooth((arrival - index * 0.16) / Math.max(0.1, 1 - index * 0.16));
            const y = -panelHeight * 0.56 * (1 - stagger) + bounce * (1 - index * 0.16);
            return (
              <div key={index} data-layout-allow-overlap data-layout-allow-occlusion style={{ position: 'absolute', left: \`\${16 + index * 12}%\`, top: \`\${27 + index * 5}%\`, width: '68%', height: '18%', transform: \`translateY(\${y}px) rotate(\${(index - 1) * 1.6 * (1 - stagger)}deg)\`, opacity: stagger, border: \`1px solid \${index === 0 ? signal : '#445058'}\`, borderRadius: 8, background: '#1A2024', boxShadow: '0 8px 18px #00000078' }}>
                <div style={{ position: 'absolute', left: '4%', top: '22%', width: '10%', bottom: '22%', borderRadius: 4, background: \`\${signal}24\`, color: signal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.max(8, ctx.width * 0.012) }}>↑</div>
                <div style={{ position: 'absolute', left: '18%', top: '24%', color: '#FFFFFF', fontSize: Math.max(7, ctx.width * 0.0095) }}>{index === 0 ? 'DEXA_VFX.PACK' : \`SIGNAL_0\${index}.FX\`}</div>
                <div style={{ position: 'absolute', left: '18%', right: '5%', bottom: '23%', height: 4, borderRadius: 4, background: '#354047', overflow: 'hidden' }}><div style={{ width: \`\${progress * 100}%\`, height: '100%', background: signal, boxShadow: \`0 0 8px \${signal}\` }} /></div>
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: '50%', bottom: '7%', transform: \`translateX(-50%) scale(\${0.7 + done * 0.3})\`, width: Math.max(24, panelHeight * 0.12), height: Math.max(24, panelHeight * 0.12), borderRadius: '50%', border: \`2px solid \${signal}\`, color: signal, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: done, boxShadow: \`0 0 22px \${signal}66\`, fontSize: Math.max(13, panelHeight * 0.07) }}>✓</div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
