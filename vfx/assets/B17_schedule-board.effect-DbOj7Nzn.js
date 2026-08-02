const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const rowCount = Math.min(6, Math.max(3, Math.round(Number(ctx.params.rows ?? 5))));
    const pace = Math.min(3, Math.max(1, Math.round(Number(ctx.params.pace ?? 1))));
    const channel = String(ctx.params.label ?? 'DEXA VFX');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const cycle = (ctx.t * pace) % 1;
    const active = Math.min(rowCount - 1, Math.floor(cycle * rowCount));
    const local = cycle * rowCount - active;
    const sweep = local * local * (3 - 2 * local);
    const programs = ['SIGNAL OPEN', 'MOTION DESK', 'FRAME REPORT', 'VFX SESSION', 'NIGHT OUTPUT', 'LOOP CLOSE'];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F4F7F8', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: '14%', display: 'grid', placeItems: 'center', opacity: 0.11, filter: 'grayscale(1)' }}>
          {ctx.subjectNode}
        </div>
        <div style={{ position: 'absolute', left: '8%', right: '8%', top: '10%', bottom: '10%', border: \`1px solid \${signal}4D\`, background: '#111419EB', boxShadow: '0 26px 70px #0000008C' }}>
          <div style={{ height: '18%', padding: '0 4%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: \`2px solid \${signal}\`, boxSizing: 'border-box' }}>
            <div>
              <div style={{ color: signal, fontSize: Math.max(10, ctx.width * 0.012), fontWeight: 800, letterSpacing: '0.2em' }}>{channel} / PROGRAM</div>
              <div style={{ marginTop: 5, color: '#AEB8C0', fontSize: Math.max(8, ctx.width * 0.0085), letterSpacing: '0.14em' }}>SIX SECOND BROADCAST GRID</div>
            </div>
            <div style={{ border: \`1px solid \${signal}\`, padding: '7px 10px', color: '#F4F7F8', fontSize: Math.max(9, ctx.width * 0.009), fontWeight: 800 }}>CH 07</div>
          </div>
          <div style={{ height: '82%', padding: '2.2% 4%', boxSizing: 'border-box' }}>
            {Array.from({ length: rowCount }, (_, index) => {
              const selected = index === active;
              const hour = 18 + index;
              return (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    height: \`\${100 / rowCount}%\`,
                    display: 'grid',
                    gridTemplateColumns: '18% 1fr 16%',
                    alignItems: 'center',
                    borderBottom: '1px solid #FFFFFF1F',
                    padding: '0 2%',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    background: selected ? \`\${signal}17\` : 'transparent',
                    color: selected ? '#FFFFFF' : '#C1C8CD',
                  }}
                >
                  {selected ? <div style={{ position: 'absolute', inset: 0, width: \`\${16 + sweep * 84}%\`, background: \`linear-gradient(90deg, \${signal}35, \${signal}0A)\` }} /> : null}
                  <span style={{ position: 'relative', color: selected ? signal : '#8E9AA3', fontSize: Math.max(9, ctx.width * 0.01), fontWeight: 800 }}>{hour.toString().padStart(2, '0')}:00</span>
                  <span style={{ position: 'relative', fontSize: Math.max(10, ctx.width * 0.013), fontWeight: selected ? 800 : 600, letterSpacing: '0.08em' }}>{programs[index]}</span>
                  <span style={{ position: 'relative', textAlign: 'right', color: selected ? '#FFFFFF' : '#8E9AA3', fontSize: Math.max(8, ctx.width * 0.0085) }}>{selected ? 'ON AIR' : \`\${42 + index * 7} MIN\`}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
