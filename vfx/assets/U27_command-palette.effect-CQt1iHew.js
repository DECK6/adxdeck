const t=`import type { FxKernel } from '../../src/fx/types';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const rows = Math.max(3, Math.min(6, Math.round(Number(ctx.params.rows ?? 5))));
    const cycles = Math.max(1, Math.min(2, Math.round(Number(ctx.params.cycles ?? 1))));
    const density = Math.max(0.75, Math.min(1.2, Number(ctx.params.density ?? 1)));
    const mode = String(ctx.params.mode ?? 'render').toUpperCase();
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.t * cycles) % 1;
    const open = smooth(phase / 0.16) * (1 - smooth((phase - 0.9) / 0.1));
    const typed = clamp((phase - 0.18) / 0.28);
    const selection = Math.min(rows - 1, Math.floor(clamp((phase - 0.5) / 0.32) * rows));
    const execute = smooth((phase - 0.82) / 0.08);
    const query = \`DEXA \${mode}\`;
    const visibleQuery = query.slice(0, Math.floor(typed * (query.length + 1)));
    const commands = [
      \`\${mode} ACTIVE COMPOSITION\`,
      \`\${mode} DEXA VFX PREVIEW\`,
      \`\${mode} SIGNAL PARAMETERS\`,
      \`\${mode} SELECTED LAYERS\`,
      \`\${mode} FRAME RANGE\`,
      \`\${mode} DELIVERY PACKAGE\`,
    ];
    const panelWidth = Math.min(ctx.width * 0.68, ctx.height * 1.18);
    const panelHeight = Math.min(ctx.height * 0.7, panelWidth * 0.69) * density;
    const rowHeight = (panelHeight * 0.58) / rows;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F3FAFB', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, transform: \`scale(\${1 - open * 0.025})\` }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', inset: 0, background: '#020405', opacity: open * 0.48 }} />
        <div style={{ position: 'absolute', left: '50%', top: '48%', width: panelWidth, height: panelHeight, transform: \`translate(-50%, -50%) translateY(\${(1 - open) * -ctx.height * 0.08}px) scale(\${0.92 + open * 0.08 + execute * 0.018})\`, opacity: open, border: \`1px solid \${execute > 0.4 ? signal : '#526168'}\`, borderRadius: 12, background: '#151A1EF5', boxShadow: \`0 26px 70px #000000C4, 0 0 \${execute * 28}px \${signal}44\`, overflow: 'hidden' }}>
          <div style={{ height: '24%', borderBottom: '1px solid #3C474D', display: 'flex', alignItems: 'center', padding: '0 5%', boxSizing: 'border-box' }}>
            <span style={{ color: signal, fontSize: Math.max(13, ctx.width * 0.018), marginRight: '3%' }}>⌘</span>
            <span style={{ color: '#FFFFFF', fontSize: Math.max(8, ctx.width * 0.012), letterSpacing: '0.07em' }}>{visibleQuery}</span>
            <span style={{ marginLeft: 3, width: 2, height: '34%', background: signal, opacity: Math.floor(ctx.frame / Math.max(1, ctx.fps * 0.35)) % 2 === 0 ? 1 : 0.18 }} />
            <span style={{ marginLeft: 'auto', padding: '1.2% 2%', border: '1px solid #59666C', borderRadius: 4, color: '#A9B5BA', fontSize: Math.max(6, ctx.width * 0.007) }}>ESC</span>
          </div>
          <div style={{ position: 'absolute', left: '3%', right: '3%', top: '28%', bottom: '8%' }}>
            {commands.slice(0, rows).map((command, index) => {
              const active = index === selection;
              return (
                <div key={command} style={{ height: rowHeight, display: 'flex', alignItems: 'center', padding: '0 3%', boxSizing: 'border-box', borderRadius: 6, background: active ? \`\${signal}1F\` : 'transparent', borderLeft: active ? \`3px solid \${signal}\` : '3px solid transparent', color: active ? '#FFFFFF' : '#AAB6BA', transform: \`translateX(\${active ? 5 : 0}px)\`, fontSize: Math.max(7, ctx.width * 0.009), letterSpacing: '0.05em' }}>
                  <span style={{ width: '8%', color: active ? signal : '#93A3A9' }}>{String(index + 1).padStart(2, '0')}</span>
                  <span>{command}</span>
                  <span style={{ marginLeft: 'auto', color: active ? signal : '#93A3A9' }}>{active ? '↵' : '›'}</span>
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', left: '5%', bottom: '3%', color: '#93A3A9', fontSize: Math.max(6, ctx.width * 0.007), letterSpacing: '0.1em' }}>DEXA COMMAND / {rows} RESULTS</div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
