const t=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const scanlines = Math.max(3, Math.round(Number(ctx.params.scanlines ?? 6)));
    const bootSpeed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.bootSpeed ?? 1))));
    const glow = clamp01(Number(ctx.params.glow ?? 0.74));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.t * bootSpeed) % 1;
    const power = clamp01((phase - 0.08) / 0.12) * clamp01((0.96 - phase) / 0.12);
    const verify = clamp01((phase - 0.18) / 0.2);
    const logo = clamp01((phase - 0.38) / 0.16);
    const settle = 1 - Math.pow(1 - logo, 3);
    const flash = Math.max(0, 1 - Math.abs(phase - 0.36) / 0.035);
    const scanY = 8 + ((phase * 3) % 1) * 84;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', fontFamily: 'JetBrains Mono, monospace' }}>
        <div style={{ position: 'absolute', inset: 0, background: flash > 0 ? signal : '#0D0E10', opacity: flash * 0.68 }} />
        <div style={{ position: 'absolute', inset: '10%', opacity: power * settle, transform: \`scale(\${0.72 + settle * 0.28})\`, filter: \`grayscale(1) contrast(1.25) drop-shadow(0 0 \${4 + glow * 22}px \${signal})\` }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '18%', right: '18%', top: '16%', display: 'flex', gap: 4, opacity: power * (1 - logo * 0.72) }}>
          {Array.from({ length: 12 }, (_, index) => <div key={index} style={{ flex: 1, height: Math.max(3, ctx.height * 0.012), background: index / 12 < verify ? signal : '#263034', boxShadow: index / 12 < verify ? \`0 0 8px \${signal}\` : 'none' }} />)}
        </div>
        <div style={{ position: 'absolute', left: '50%', bottom: '16%', transform: 'translateX(-50%)', color: '#C7D0D3', fontSize: Math.max(8, ctx.width * 0.017), letterSpacing: '0.16em', opacity: power }}>
          {phase < 0.2 ? 'POWER CHECK' : phase < 0.38 ? 'ROM VERIFIED' : phase < 0.62 ? 'DEXA SYSTEM' : 'PRESS START'}
        </div>
        <div style={{ position: 'absolute', left: '9%', right: '9%', top: \`\${scanY}%\`, height: Math.max(1, ctx.height * 0.007), background: signal, opacity: power * 0.42, boxShadow: \`0 0 12px \${signal}\` }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: \`repeating-linear-gradient(to bottom, transparent 0, transparent \${scanlines - 1}px, #000A \${scanlines}px)\`, opacity: power * 0.42 }} />
        <div style={{ position: 'absolute', left: '50%', bottom: '8%', width: Math.max(5, ctx.width * 0.012), height: Math.max(5, ctx.width * 0.012), transform: 'translateX(-50%)', borderRadius: '50%', background: power > 0.12 ? signal : '#263034', boxShadow: power > 0.12 ? \`0 0 \${8 + glow * 14}px \${signal}\` : 'none' }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
