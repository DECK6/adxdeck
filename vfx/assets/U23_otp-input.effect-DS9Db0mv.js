const t=`import type { FxKernel } from '../../src/fx/types';

const clamp = (value: number) => Math.max(0, Math.min(1, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const digits = Math.max(4, Math.min(8, Math.round(Number(ctx.params.digits ?? 6))));
    const cycles = Math.max(1, Math.min(2, Math.round(Number(ctx.params.cycles ?? 1))));
    const pace = Math.max(0.55, Math.min(1.4, Number(ctx.params.pace ?? 1)));
    const masked = Boolean(ctx.params.masked ?? false);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.t * cycles) % 1;
    const typed = clamp((phase - 0.1) * pace / 0.52) * digits;
    const validated = clamp((phase - 0.7) / 0.12);
    const exit = clamp((phase - 0.9) / 0.1);
    const values = ['4', '2', '7', '0', '1', '9', '3', '6'];
    const panelWidth = Math.min(ctx.width * 0.78, ctx.height * 1.4);
    const cellGap = Math.max(5, panelWidth * 0.015);
    const cellWidth = (panelWidth - cellGap * (digits - 1)) / digits;
    const cellHeight = Math.min(ctx.height * 0.19, cellWidth * 1.22);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F5FAFB', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '50%', top: '28%', transform: \`translate(-50%, \${-exit * ctx.height * 0.03}px)\`, opacity: 1 - exit, textAlign: 'center' }}>
          <div style={{ color: signal, fontSize: Math.max(9, ctx.width * 0.014), fontWeight: 800, letterSpacing: '0.2em' }}>DEXA VFX ACCESS</div>
          <div style={{ marginTop: '0.7em', color: '#AAB5BA', fontSize: Math.max(7, ctx.width * 0.009), letterSpacing: '0.08em' }}>{validated > 0.8 ? 'IDENTITY VERIFIED' : 'ENTER SECURITY CODE'}</div>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: '53%', width: panelWidth, height: cellHeight, transform: \`translate(-50%, -50%) scale(\${1 + Math.sin(validated * Math.PI) * 0.025})\`, display: 'flex', gap: cellGap, opacity: 1 - exit }}>
          {Array.from({ length: digits }, (_, index) => {
            const visible = typed > index;
            const active = Math.floor(typed) === index && typed < digits;
            const pop = clamp((typed - index) * 3);
            return (
              <div key={index} style={{ position: 'relative', width: cellWidth, height: cellHeight, boxSizing: 'border-box', border: \`1px solid \${validated > 0 ? signal : active ? signal : '#4A555B'}\`, borderRadius: Math.max(7, cellWidth * 0.12), background: validated > 0 ? \`\${signal}18\` : '#171C1F', boxShadow: active ? \`0 0 20px \${signal}44, inset 0 -3px 0 \${signal}\` : validated > 0 ? \`0 0 \${18 * validated}px \${signal}33\` : '0 8px 20px #00000066', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.max(16, cellWidth * 0.38), fontWeight: 800, transform: \`translateY(\${-Math.sin(pop * Math.PI) * 7}px)\` }}>
                {visible ? (masked ? '•' : values[index]) : ''}
                <div style={{ position: 'absolute', left: '22%', right: '22%', bottom: '12%', height: 2, background: active || validated > 0 ? signal : '#68757B', opacity: 0.35 + (active ? 0.65 : 0) }} />
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: '50%', top: '72%', transform: 'translateX(-50%)', width: panelWidth * 0.42, height: 3, borderRadius: 4, background: '#354047', overflow: 'hidden', opacity: 1 - exit }}><div style={{ height: '100%', width: \`\${Math.min(1, typed / digits) * 100}%\`, background: signal, boxShadow: \`0 0 9px \${signal}\` }} /></div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
