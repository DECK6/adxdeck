const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const speed = Number(ctx.params.speed ?? 1);
    const lineCount = Math.round(Number(ctx.params.lines ?? 6));
    const cursor = Boolean(ctx.params.cursor ?? true);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const messages = [
      'DEXA BIOS 06.30',
      'MEMORY ........ OK',
      'SIGNAL BUS .... ONLINE',
      'LOADING VFX KERNEL',
      'MOUNT /SUBJECT . READY',
      'SYSTEM STATUS . NOMINAL',
      'WELCOME, OPERATOR',
    ];
    const visible = Math.min(lineCount, Math.floor(ctx.t * 13 * speed));
    const ready = Math.min(1, visible / Math.max(1, lineCount));
    const blink = Math.floor(ctx.frame / Math.max(1, Math.round(ctx.fps * 0.45))) % 2 === 0;
    const outro = Math.min(1, Math.max(0, (1 - ctx.t) / 0.1));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: ready * 0.72 * outro,
            transform: \`translate3d(\${(1 - ready) * ctx.width * 0.04}px, 0, 0) scale(\${0.97 + ready * 0.03})\`,
            filter: \`contrast(\${1 + ready * 0.25})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '5%',
            top: '7%',
            width: '48%',
            minHeight: '46%',
            padding: '3%',
            border: \`1px solid \${signal}55\`,
            background: '#0D0E10E8',
            boxShadow: \`0 0 24px \${signal}12\`,
            color: '#8A8D93',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: Math.max(7, ctx.width * 0.014),
            lineHeight: 1.55,
            opacity: outro,
          }}
        >
          {messages.slice(0, lineCount).map((message, index) => (
            <div
              key={message}
              style={{
                opacity: index < visible ? 1 : 0,
                color: index === visible - 1 ? signal : '#A8ACB3',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ color: signal, marginRight: '0.6em' }}>&gt;</span>
              {message}
            </div>
          ))}
          <div style={{ marginTop: '0.55em', color: signal, opacity: visible > 0 ? 1 : 0 }}>
            <span style={{ marginRight: '0.6em' }}>$</span>
            {ready >= 1 ? 'run subject' : 'boot --safe'}
            {cursor && blink ? <span style={{ marginLeft: '0.3em' }}>█</span> : null}
          </div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
